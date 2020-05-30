<template>
  <!-- 食堂菜单 -->
  <div class="wdf-custom-list-wrapper">
    <div class="search-wrapper">
      <a-range-picker v-model="sDate" style="width:300px;" :allowClear="true" />
      <a-select
        v-if="activeKey === 0"
        placeholder="审批状态"
        :allowClear="true"
        v-model="approveState"
        style="width: 120px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">通过</a-select-option>
        <a-select-option :value="3">不通过</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <a-button
        class="a-button"
        style="float:right;"
        type="primary"
        icon="plus"
        @click="doAction('add',null)"
        v-if="$auth('canteen-menu-management-config:add')"
      >新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('canteen-menu-management-config:approval')">
          <a-tab-pane tab="待审批" key="1" />
          <a-tab-pane tab="已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="startDate" slot-scope="text, record, index">
          <span>{{record.startDate}} ~ {{record.endDate}}</span>
        </div>

        <div slot="approveState" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStatusText(text) }}</a>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 单据审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view',record)">查看</a>
            <template v-if="$auth('canteen-menu-management-config:edit') && record.approveState === 3">
              <a-divider type="vertical"  />
              <a type="primary"  @click="doAction('edit',record)">修改</a>
            </template>
            <template v-if="$auth('canteen-menu-management-config:del') && record.approveState !== 1">
              <a-divider type="vertical" />
              <a href="javascript:void(0);" @click="doAction('del',record)">删除</a>
            </template>
            <template v-if="$auth('canteen-menu-management-config:publish') && record.approveState === 2 && record.isPublished === 0">
              <a-divider type="vertical"  />
              <a href="javascript:void(0);" @click="doAction('publish',record)">发布</a>
            </template>
            <template v-if="$auth('canteen-menu-management-config:revocation') && record.approveState === 1 && record.withdrawState === 0 && record.createdId ===userInfo.id">
              <a-divider type="vertical"  />
              <a href="javascript:void(0);" @click="doAction('revocation',record)">撤回</a>
            </template>
          </template>

          <template v-if="activeKey === 1">
            <a type="primary" @click="doAction('view',record)">查看</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval',record)">审批</a>
          </template>

          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view',record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="searchAction({current:1})" />
  </div>
</template>
<script>
import { canteenMenuPage, canteenMenuDelete ,canteenMenuPublish ,canteenMenuRevocation} from '@/api/canteenMenuManagement'
import AddForm from './AddForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '时间',
    dataIndex: 'startDate',
    scopedSlots: { customRender: 'startDate' }
  },
  {
    align: 'center',
    title: '审批状态',
    dataIndex: 'approveState',
    scopedSlots: { customRender: 'approveState' }
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'canteen-menu-config',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      approval_status: undefined,
      approveState:undefined,
      activeKey: 0,
      sDate:[undefined,undefined],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false
    }
  },
  computed: {
    searchParam() {
      let that = this
      let startDate = undefined,endDate = undefined
      if(Array.isArray(that.sDate) && that.sDate.length === 2){
        startDate = that.sDate[0] instanceof moment ? that.sDate[0].format('YYYY-MM-DD') : undefined
        endDate = that.sDate[1] instanceof moment ?  that.sDate[1].format('YYYY-MM-DD') :undefined
      }
      return {
        startDate,
        endDate,
        searchStatus: that.activeKey,
        approveState: that.approveState
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'canteen-menu-management-config') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {}, {
        searchStatus: that.activeKey
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      canteenMenuPage(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    doAction(type, record) {
      let that = this
      if(type === 'view' || type === 'add' || type === 'edit' || type === 'approval'){
        that.$refs.addForm.query(type, record)
        return
      }
      if (type === 'del') {
        this.$confirm({
          title: '提示',
          content: '确认要删除该菜单吗？',
          onOk() {
            return canteenMenuDelete(`id=${record.id}`).then(res => {
              that.$message.info(res.msg)
              that.searchAction()
            })
          },
          onCancel() {},
        });
        return
      }
      if(type === 'publish'){
        this.$confirm({
          title: '提示',
          content: '确认要发布该菜单吗？',
          onOk() {
            return canteenMenuPublish(`id=${record.id}`).then(res => {
              that.$message.info(res.msg)
              that.searchAction()
            })
          },
          onCancel() {},
        });
        return
      }
      if(type === 'revocation'){
        this.$confirm({
          title: '提示',
          content: '确认要撤回该菜单吗？',
          onOk() {
            return new Promise((resolve,reject) =>{
              canteenMenuRevocation(`id=${record.id}`).then(res => {
                that.$message.info(res.msg)
                if(res.code === 200){
                  resolve()
                  that.$refs.addForm.query('edit', record)
                }else{
                  reject()
                }
              }).catch(err => reject(err.message))
            })
          },
          onCancel() {},
        });
        return
      }
    },
    getStatusText(state) {
      let stateMap = {
        1: '待审批',
        2: '通过',
        3: '不通过'
      }
      return stateMap[state] || `未知状态:${state}`
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchAction({ current: 1})
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    }
  }
}
</script>
<style scoped>
.wdf-custom-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.wdf-custom-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>

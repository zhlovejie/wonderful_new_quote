<template>
  <!-- 出勤规则修改设置 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="考勤组名称模糊查询" v-model="searchParam.attanceName" allowClear style="width:200px;" />
        </a-form-item>
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="searchAction({current:1})"
          >查询</a-button>
        </a-form-item>
        
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('attendance-rules-setting-attendance-rule-edit:approval')">
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
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="editContent" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="doAction('editView',record)">查看</a>
        </div>
        <div slot="status" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="approvalPreview(record)">
            {{ {1:'待审批',2:'通过',3:'不通过'}[text] || '未知' }}
          </a>
        </div>
        
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit',record)">修改</a>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="searchAction({current:1})" />
    <EditView ref="editView" />
  </div>
</template>

<script>
import {attenceChangeApproveList } from '@/api/attendanceManagement'
import AddForm from './AddForm'
import EditView from './EditView'
import moment from 'moment'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '考勤组名称',
    dataIndex: 'attanceName'
  },
  {
    align: 'center',
    title: '修改内容',
    scopedSlots: { customRender: 'editContent' }
  },
  {
    align: 'center',
    title: '审批状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
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
  name: 'attendance-rule-list-edit',
  components: {
    AddForm,
    EditView,
    ApproveInfo
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchParam:{},
      activeKey:0
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'attendance-rules-setting-attendance-rule-edit') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    init() {
      this.searchParam.searchStatus = this.activeKey
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      attenceChangeApproveList(_searchParam)
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
      this.searchAction({ current: pagination.current })
    },
    doAction(actionType, record) {
      let that = this
      if(['view','edit'].includes(actionType)){
        that.$refs.addForm.query(actionType,record)
      }else if(actionType === 'editView'){
        this.$refs.editView.init(record.id)
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam.searchStatus = this.activeKey
      this.searchAction({ current: 1})
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    }
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}

</style>

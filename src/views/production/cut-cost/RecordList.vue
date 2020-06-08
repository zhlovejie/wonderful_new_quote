<template>
  <!-- 降本记录 -->
  <div class="cut-cost-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="原物料代码/原产品名称/原品牌" v-model="quondamKeyword" style="width:260px;" />
      <a-input placeholder="现物料代码/现产品名称/现品牌" v-model="newKeyword" style="width:260px;" />

      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button
        class="a-button"
        v-if="$auth('cutCostRecord:add')"
        style="float:right;"
        type="primary"
        icon="plus"
        @click="doAction('add',null)"
      >新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('cutCostRecord:approval')">
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
        <div slot="approveState" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <!--
            全部界面：
            待审批：撤回，查看
            审批通过：删除，查看，应用
            审批不通过：修改，查看
            已撤回：修改，查看
          -->
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view',record)">查看</a>
            <template v-if="+record.approveState === 1 && isSelf(record.createdId) && +record.withdrawState === 0">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('back',record)">撤回</a>
            </template>

            <template v-if="+record.approveState === 2">
              <template v-if="isSelf(record.createdId)">
                <a-divider type="vertical" />
                <a type="primary" @click="doAction('del',record)">删除</a>
              </template>
              <template v-if="+record.isUsed === 0 && $auth('depreciateApply:use')">
                <a-divider type="vertical" />
                <a type="primary" @click="doAction('use',record)">应用</a>
              </template>
            </template>

            <template v-if="(+record.approveState === 3 || +record.withdrawState === 1) && isSelf(record.createdId)">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit',record)">修改</a>
            </template>
          </template>
          <template v-if="activeKey === 1">
            <a type="primary" @click="doAction('approval',record)">审批</a>
          </template>
          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view',record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
    <UseForm ref="useForm" @finish="searchAction" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import { depreciateApplyPage, depreciateApplyDelete, depreciateApplyRevocation } from '@/api/production/cutCost'
import AddForm from './module/AddForm'
import UseForm from './module/UseForm'
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
    title: '原物料代码',
    dataIndex: 'quondamCode'
  },
  {
    align: 'center',
    title: '原产品名称',
    dataIndex: 'quondamName'
  },
  {
    align: 'center',
    title: '原品牌',
    dataIndex: 'quondamBrand'
  },
  {
    align: 'center',
    title: '原价格(元)',
    dataIndex: 'quondamPrice'
  },
  {
    align: 'center',
    title: '现物料代码',
    dataIndex: 'newCode'
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'newName'
  },
  {
    align: 'center',
    title: '品牌',
    dataIndex: 'newBrand'
  },
  {
    align: 'center',
    title: '价格(元)',
    dataIndex: 'newPrice'
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
  name: 'cut-cost-record-list',
  components: {
    AddForm: AddForm,
    UseForm:UseForm,
    ApproveInfo: ApproveInfo
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      activeKey: 0,
      quondamKeyword: undefined,
      newKeyword: undefined,
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
      return {
        quondamKeyword: this.quondamKeyword,
        newKeyword: this.newKeyword,
        searchStatus: this.activeKey
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'cutCostRecord') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {}, {
        searchStatus: that.activeKey
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      depreciateApplyPage(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
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
      console.log(type)
      if (['add', 'view', 'edit', 'approval'].includes(type)) {
        this.$refs.addForm.query(type, record)
        return
      }
      if(type === 'use'){
        this.$refs.useForm.query(type, record)
        return
      }
      if (type === 'back') {
        this.$confirm({
          title: '警告',
          content: `确定要撤回该条记录吗?`,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            console.log('OK')
            depreciateApplyRevocation(`id=${record.id}`).then(res => {
              that.$message.info(res.msg)
              if (res.code !== 200) {
                return
              }
              that.searchAction()
            })
          },
          onCancel() {
            console.log('Cancel')
          }
        })
        return
      }
      if (type === 'del') {
        this.$confirm({
          title: '警告',
          content: `确定要删除该条记录吗?`,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            console.log('OK')
            depreciateApplyDelete(`id=${record.id}`).then(res => {
              that.$message.info(res.msg)
              if (res.code !== 200) {
                return
              }
              that.searchAction()
            })
          },
          onCancel() {
            console.log('Cancel')
          }
        })
        return
      }
    },
    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '通过',
        3: '不通过'
      }
      return stateMap[state] || `未知状态:${state}`
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    isSelf(createdId){
      return +createdId === +this.userInfo.id
    }
  }
}
</script>
<style scoped>
.cut-cost-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.cut-cost-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
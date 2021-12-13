<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="代码模糊查询" v-model="queryParam.code" allowClear style="width: 150px" />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="名称模糊查询" v-model="queryParam.ruleName" allowClear style="width: 150px" />
        </a-form-item>
        <a-form-item label="审批状态" v-if="+activeKey === 1">
          <a-select style="width: 150px" v-model="queryParam.status">
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="search({ current: 1 })">查询</a-button>
        </a-form-item>
        <template v-if="+activeKey === 2 && $auth('materialRuleAudit:approval')">
          <a-form-item>
            <a-button :disabled="selectedRows.length === 0" type="primary" @click="passAction">通过</a-button>
          </a-form-item>
          <a-form-item>
            <a-button :disabled="selectedRows.length !== 1" type="primary" @click="noPassAction">不通过</a-button>
          </a-form-item>
        </template>
      </a-form>
    </div>

    <div class="main-wrapper material-rule-audit-wrapper">
      <a-tabs :activeKey="activeKey" :defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="我的" :key="1" />
        <template v-if="$auth('materialRuleAudit:approval')">
          <a-tab-pane tab="待我审批" :key="2" />
          <a-tab-pane tab="我已审批" :key="3" />
        </template>
      </a-tabs>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :rowSelection="
          +activeKey === 2 ? { onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys } : null
        "
      >
        <div slot="status" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ { 1: '待审批', 2: '通过', 3: '不通过' }[text] }}</a>
        </div>


        <div slot="allName" slot-scope="text, record, index">
          <div v-html="record.pathFormatHTML"></div>
        </div>


        
      </a-table>
    </div>
    <Approval ref="approval" @opinionChange="opinionChange" />
    <ApproveInfo ref="approveInfoCard" />
    </a-spin>
  </a-card>
</template>

<script>
import { materialRuleAudit, materialRuleAuditBatch, materialRuleAuditPageList } from '@/api/routineMaterial'
import Approval from './Approval'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
const columns = [
  {
    align: 'center',
    title: '路径码',
    dataIndex: 'allCode',
  },
  {
    align: 'center',
    title: '路径',
    dataIndex: 'allName',
    scopedSlots: { customRender: 'allName' },
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'ruleName',
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
  },
]

export default {
  name: 'material-management-audit-RoutineList',
  components: {
    Approval,
    ApproveInfo,
  },
  props: {
    type:{
      type:[Number,String],
      default:() => 1
    },
    tabKey:{
      type:[Number,String],
      default:() => 1
    }
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      queryParam: {},
      activeKey: 1,
      columns,
      selectedRowKeys: [],
      selectedRows: [],

      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      spinning:false
    }
  },
  watch: {
    type: {
      handler: function (type) {
        if(type){
          this.$nextTick(() => this.init())
        }
      },
      immediate: true,
    },
    tabKey:{
      handler: function (tabKey) {
        this.activeKey = +tabKey
        this.$nextTick(() => this.init())
      },
      immediate: true,
    }

  },
  methods: {
    init() {
      const that = this
      that.queryParam = { ...that.queryParam, queryType: that.activeKey, type: that.type }
      let queue = []
      that.search()
      return Promise.all(queue)
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    search(params = {}) {
      const that = this
      that.selectedRowKeys = []
      that.selectedRows = []

      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      that.loading = true
      materialRuleAuditPageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.pathFormatHTML = that.pathFormat(item)
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch((err) => {
          that.loading = false
          console.log(err)
        })
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    tabChange(tagKey) {
      this.activeKey = +tagKey
      this.queryParam = { ...this.queryParam, queryType: this.activeKey }
      this.selectedRowKeys = []
      this.selectedRows = []
      this.search({ current: 1 })
    },
    submitAction(opt) {
      const that = this
      let values = Object.assign({}, opt || {}, { approveId: that.selectedRows[0].id })
      that.spinning = true
      materialRuleAudit(values)
        .then((res) => {
          that.spinning = false
          that.$message.info(res.msg)
          if(+ res.code === 200){
            that.search()
          }
        })
        .catch((err) => {
          that.spinning = false
          console.log(err)
        })
    },
    passAction(opt = {}) {
      //this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
      const that = this
      const ids = that.selectedRows.map((item) => item.id).join(',')
      that.spinning = true
      materialRuleAuditBatch(`ids=${ids}`)
        .then((res) => {
          that.spinning = false
          that.$message.info(res.msg)
          that.search()
        })
        .catch((err) => {
          that.spinning = false
          that.$message.error(`接口发生错误，错误信息：${err}`)
        })
    },
    noPassAction() {
      this.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId,'material')
    },

    pathFormat(record){
      const {allCode,allName} = record
      let arr_code = allCode.split('.')
      let arr_name = allName.split('-')
      if(arr_code.length !== arr_name.length){
        return allName
      }
      let tr = []
      tr.push(`<thead><tr>${arr_name.map(name => `<th>${name}</th>`).join('')}</tr></thead>`)
      tr.push(`<tbody><tr>${arr_code.map(code => `<td>${code}</td>`).join('')}</tr></tbody>`)
      let html = `
        <table class="custom-path-format-table" style="margin: 0 auto;">
            ${tr.join('')}
        </table>
      `
      return html
    }
  },
}
</script>

<style scoped>
.material-rule-audit-wrapper >>> .custom-path-format-table{
  width: auto;
  border-collapse: collapse;
}
.material-rule-audit-wrapper >>> .custom-path-format-table th,
.material-rule-audit-wrapper >>> .custom-path-format-table td{
  border: 1px solid #ddd;
  padding: 2px 10px;
  text-align: center;
}

.material-rule-audit-wrapper >>> .custom-path-format-table td{
  color: red;
  font-weight: 700;
}
</style>


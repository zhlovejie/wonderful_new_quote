<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="名称模糊查询" v-model="queryParam.materialName" allowClear style="width: 150px" />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="代码模糊查询" v-model="queryParam.materialCode" allowClear style="width: 150px" />
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
        <template v-if="+activeKey === 2 && ((type === 1 && $auth('routineMaterialAudit:approval')) || (type === 2 && $auth('productMaterialAudit:approval')))">
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
        :customRow="customRowFunction"
        :rowSelection="
          +activeKey === 2 ? { onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys } : null
        "
      >
        <div slot="status" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ { 1: '待审批', 2: '通过', 3: '不通过' }[text] }}</a>
        </div>

        <div slot="path" slot-scope="text, record, index">
          <div v-html="record.pathFormatHTML"></div>
        </div>

      </a-table>
    </div>
    <Approval ref="approval" @opinionChange="opinionChange" />
    <ApproveInfo ref="approveInfoCard" />
    <NormalAddForm
      ref="NormalAddForm"
      :key="normalAddFormKeyCount"
    />
    </a-spin>
  </a-card>
</template>

<script>
// import { materialRuleAudit, materialRuleAuditBatch, materialRuleAuditPageList } from '@/api/routineMaterial'

import {
  routineMaterialAudit,
  routineMaterialBatchAudit,
  routineMaterialAuditList,

  productMaterialAudit,
  productMaterialBatchAudit,
  productMaterialAuditList
} from '@/api/routineMaterial'

import Approval from './Approval'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import NormalAddForm from '../module/NormalAddForm'
const columns = [
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode',
  },
  {
    align: 'center',
    title: '路径',
    dataIndex: 'path',
    scopedSlots: { customRender: 'path' },
  },
  {
    align: 'center',
    title: '中文名称',
    dataIndex: 'materialName',
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
  {
    align: 'center',
    title: '审核结果',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  }
]
const __API__ = {
  '1':{ //常规
    audit:routineMaterialAudit,
    batchAudit:routineMaterialBatchAudit,
    list:routineMaterialAuditList
  },
  '2':{ //成品
    audit:productMaterialAudit,
    batchAudit:productMaterialBatchAudit,
    list:productMaterialAuditList
  }
}
export default {
  name: 'material-rule-management-library-component-audit',
  components: {
    Approval,
    ApproveInfo,
    NormalAddForm
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
      spinning:false,
      normalAddFormKeyCount:1
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
      that.__API__ = __API__[that.type]
      // that.queryParam = { ...that.queryParam }
      let queue = []
      // that.search()
      that.tabChange(that.tabKey)
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
      that.__API__.list(_searchParam)
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
      that.__API__.audit(values)
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
      that.__API__.batchAudit(`ids=${ids}`)
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
    customRowFunction(record) {
      const that = this
      let __from = +that.type === 1 ? 'normal' : 'product'
      let { materialId } = record
      return {
        on: {
          dblclick: event => {
            console.log(record)
            const that = this
            that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1
            that.$nextTick(() => {
              that.$refs.NormalAddForm.query('view', {
                id:materialId,
                __selectItem: null,
                __treeData: [],
                __from: __from
              })
            })
          }
        }
      }
    },
    pathFormat(record){
      const {materialCode,path} = record
      let arr_code = materialCode.split('.')
      let arr_name = path.split('-')
      if(arr_code.length !== arr_name.length){
        return path
      }
      let tr = []
      tr.push(`<thead><tr>${arr_name.map(name => `<th>${name}</th>`).join('')}</tr></thead>`)
      tr.push(`<tbody><tr>${arr_code.map(code => `<td>${code}</td>`).join('')}</tr></tbody>`)
      let html = `
        <table class="custom-path-format-table">
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

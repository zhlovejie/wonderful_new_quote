<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              placeholder="工艺路线组件名称"
              v-model="queryParam.materialGroupCode"
              allowClear
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item>
            <a-input placeholder="工艺路线代码" v-model="queryParam.routeCode" allowClear style="width: 150px" />
          </a-form-item>
          <a-form-item>
            <a-input placeholder="工艺路线名称" v-model="queryParam.routeName" allowClear style="width: 150px" />
          </a-form-item>
          <a-form-item>
            <a-input placeholder="物料代码" v-model="queryParam.materialCommonCode" allowClear style="width: 150px" />
          </a-form-item>
          <a-form-item>
            <a-input placeholder="物料名称" v-model="queryParam.materialCommonName" allowClear style="width: 150px" />
          </a-form-item>
          <a-form-item v-if="+activeKey === 1">
            <a-select style="width: 150px" placeholder="审批状态" allowClear v-model="queryParam.status">
              <a-select-option :value="1">待审批</a-select-option>
              <a-select-option :value="2">审核中</a-select-option>
              <a-select-option :value="3">通过</a-select-option>
              <a-select-option :value="4">不通过</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" icon="search" @click="search({ current: 1 })">查询</a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="main-wrapper">
        <a-tabs v-if="status.isAction" :activeKey="activeKey" :defaultActiveKey="2" @change="tabChange">
          <a-tab-pane v-for="tab in tabList" :key="tab.key">
            <span slot="tab">
              <span>{{tab.label}}</span>
              <span style="color:red;margin-left:5px;">{{`(${tab.qty})`}}</span>
            </span>
          </a-tab-pane>
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
          <div slot="materialCommonType" slot-scope="text, record, index">
            <a-tooltip>
              <template slot="title">
                {{ text }}
              </template>
              <span class="icon-required">查看</span>
              <a-icon type="question-circle" style="margin-left: 5px; color: #1890ff" />
            </a-tooltip>
          </div>
          <div slot="materialCommonCaculatorUnit" slot-scope="text, record, index">
            {{ {1:'支',2:'把',3:'件'}[text] || text }}
          </div>
          <div slot="defaultStatus" slot-scope="text, record, index">
            <span>{{ { 1: '是', 0: '否' }[text] }}</span>
          </div>
          <div slot="status" slot-scope="text, record, index">
            <a @click="approvalPreview(record)">{{ { 1: '待审批', 2: '审批中', 3: '通过', 4: '不通过' }[text] }}</a>
          </div>
          <div slot="action" slot-scope="text, record, index">
            <a @click="doAction('view', record)">查看</a>
            <template v-if="+record.status === 2">
              <a-divider type="vertical" />
              <a @click="doAction('approval', record)">审批</a>
            </template>
          </div>
        </a-table>
      </div>

      <ApproveInfo ref="approveInfoCard" />
      <NormalAddForm ref="normalAddForm" :key="normalAddFormKeyCount" @finish="finishHandler" />
    </a-spin>
  </a-card>
</template>

<script>
// import { materialRuleAudit, materialRuleAuditBatch, materialRuleAuditPageList } from '@/api/routineMaterial'

import { craftRouteApprovePageList } from '@/api/craftRoute'

import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import AddForm from './module/AddForm'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '工艺路线组件名称',
    dataIndex: 'materialGroupCode',
  },
  {
    align: 'center',
    title: '工艺路线代码',
    dataIndex: 'routeCode',
  },
  {
    align: 'center',
    title: '工艺路线名称',
    dataIndex: 'routeName',
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCommonCode',
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialCommonName',
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'materialCommonType',
    scopedSlots: { customRender: 'materialCommonType' },
  },
  {
    align: 'center',
    title: '采购计量单位',
    dataIndex: 'materialCommonCaculatorUnit',
    scopedSlots: { customRender: 'materialCommonCaculatorUnit' },
  },
  {
    align: 'center',
    title: '缺省状态',
    dataIndex: 'defaultStatus',
    scopedSlots: { customRender: 'defaultStatus' },
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
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'product-process-management_process-route-management_approval',
  components: {
    ApproveInfo,
    NormalAddForm: AddForm,
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      queryParam: {},
      activeKey: 1,
      columns,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      spinning: false,
      normalAddFormKeyCount: 1,
      status: {
        isSubmit: false,
        isAction: false,
      },
      tabList:[
        {
          key:2,
          label:"待我审批",
          qty:0
        },
        {
          key:3,
          label:"我已审批",
          qty:0
        }
      ]
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        let base = 'product-process-management_process-route-management_approval_'
        let isAction = to.name === `${base}myaction`
        let isSubmit = to.name === `${base}mysubmit`
        this.status = {
          ...this.status,
          isSubmit,
          isAction,
        }
        if (isSubmit) {
          this.activeKey = 1
          this.queryParam = { queryType: 1 }
          this.init()
        } else if (isAction) {
          this.activeKey = 2
          this.queryParam = { queryType: 2 }
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    async init() {
      const that = this
      that.search();

    },
    async initQty(){
      const that = this
      let tabList = [...that.tabList]
      let arr = []
      tabList.map(tab => {
        arr.push(craftRouteApprovePageList({...that.queryParam,queryType:tab.key,current: 1,size: 1}).then(res => {
          return {key:tab.key,qty:+res.data.total}
        }).catch(err => {
          console.warn(err)
          return {key:tab.key,qty:0}
        }))
      })
      let result = await Promise.all(arr)
      result.map(item => {
        let target = tabList.find(t => t.key === item.key)
        if(target){
          target.qty = item.qty
        }
      })
      that.tabList = tabList
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

      that.status.isAction && that.initQty()
      return craftRouteApprovePageList(_searchParam)
        .then((res) => {
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
      if (tagKey) {
        this.activeKey = +tagKey
      }
      this.queryParam = { ...this.queryParam, queryType: this.activeKey }
      this.search({ current: 1 })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    doAction(type, record) {
      const that = this
      that.$refs['normalAddForm'].query(type, { ...record })
    },
    finishHandler(){
      this.search()
    }
  },
}
</script>


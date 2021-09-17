<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              placeholder="异常单号模糊查询"
              v-model="queryParam.serialNum"
              allowClear
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item>
            <a-select
              placeholder="是否为客诉"
              style="width: 150px"
              allowClear
              v-model="queryParam.formCustomer"
            >
              <a-select-option :value="1">是</a-select-option>
              <a-select-option :value="2">否</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <DepartmentSelect
              placeholder="责任部门"
              style="width: 150px"
              allowClear
              :depId.sync="queryParam.departmentId"
            />
          </a-form-item>
          <a-form-item>
            <CommonDictionarySelect
              placeholder="异常类型"
              style="width: 150px"
              allowClear
              :text="'售后异常类型'"
              :dictionaryId.sync="queryParam.exceptionTypeDicId"
            />
          </a-form-item>

          <a-form-item>
            <a-range-picker v-model="queryParam.date" :placeholder="['开始日期','结束日期']" />
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              icon="search"
              @click="search({ current: 1 })"
            >查询</a-button>
          </a-form-item>
        </a-form>
      </div>

      <a-tabs
        :activeKey="activeKey"
        :defaultActiveKey="activeKey"
        @change="tabChange"
      >
        <a-tab-pane
          tab="待审批"
          :key="1"
        />

        <a-tab-pane
          tab="已审批"
          :key="2"
        />
      </a-tabs>
      <div class="main-wrapper">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            {{index + 1}}
          </div>
          <div
            slot="formCustomer"
            slot-scope="text, record, index"
          >
            {{ {1:'是',2:'否'}[text] }}
          </div>
          <div
            slot="status"
            slot-scope="text, record, index"
          >
            <a @click="approvalPreview(record)">{{ getStatus(text) }}</a>
          </div>
          <div
            slot="action"
            slot-scope="text, record, index"
          >
            <template v-if="+activeKey === 1">
              <a @click="doAction('approval',record)">审批</a>
            </template>
            <template v-if="+activeKey === 2">
              <a @click="doAction('view',record)">查看</a>
            </template>
          </div>
        </a-table>
      </div>
      <ApproveInfo ref="approveInfoCard" />
      <ActionForm ref="actionForm" @finish="() => search()" />
    </a-spin>
  </a-card>
</template>

<script>
import DepartmentSelect from '@/components/CustomerList/DepartmentSelect'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import ActionForm from './ActionForm'
import {
  exceptionReportApproval,
  exceptionReportFinishExceptionReport,
  exceptionReportFeedback,
  exceptionReportDetail,
  exceptionReportPageList,
  exceptionReportSaveAndUpdateDispose,
  exceptionReportSaveAndUpdateExceptionReport,
  exceptionReportSaveExceptionFeedback,
  exceptionReportWithdraw
} from '@/api/after-sales-management-custom'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width:80
  },
  {
    title: '异常单号',
    dataIndex: 'serialNum'
  },
  {
    title: '是否为客诉',
    dataIndex: 'formCustomer',
    scopedSlots: { customRender: 'formCustomer' }
  },
  {
    title: '异常日期',
    dataIndex: 'exceptionDate'
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '产品型号',
    dataIndex: 'materialType'
  },
  {
    title: '异常类型',
    dataIndex: 'exceptionTypeName',
  },
  {
    title: '异常数量',
    dataIndex: 'exceptionNum'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    DepartmentSelect,
    CommonDictionarySelect,
    ApproveInfo,
    ActionForm
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      activeKey:1,
      queryParam: {
        searchStatus:this.activeKey
      },
      columns,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      spinning: false,
      normalAddFormKeyCount: 1,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'after-sales-management_exception_approve') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      const that = this
      that.tabChange(that.activeKey)
    },
    search(params = {}) {
      const that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }

      const _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      that.loading = true
      exceptionReportPageList(_searchParam)
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

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          const { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch(err => {
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

    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    getStatus(type){
      let m = {0:'待提交',1:'待处理',2:'已撤回',3:'已处理',4:'待审批',5:'不通过',6:'通过',7:'完结'}
      return m[type]
    },
    tabChange(key){
      this.activeKey = +key
      this.queryParam = {
        ...this.queryParam,
        searchStatus:this.activeKey
      }
      this.search()
    },
    doAction(type,record){
      const that = this
      if(['view','approval'].includes(type)){
        that.$refs.actionForm.query(type,record)
        return
      }
    },
  }
}
</script>
<style scoped>
.__table-footer-action-wrapper > *{
  margin-right: 10px;
}
</style>

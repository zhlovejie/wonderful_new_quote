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

          <a-form-item style="float:right;">
            <a-button
              type="primary"
              icon="plus"
              @click="doAction('add',null)"
            >新增</a-button>
          </a-form-item>
        </a-form>
      </div>

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
            <a @click="doAction('view',record)">查看</a>
            <!-- 0待提交-->
            <template v-if="+record.status === 0">
              <template v-if="[1,3].includes(+record.dataType)">
                <a-divider type="vertical" />
                <a @click="doAction('edit',record)">修改</a>
              </template>
              <template v-if="+record.createdId === +userInfo.id">
                <a-divider type="vertical" />
                <a @click="doAction('reback',record)">撤回</a>
              </template>
            </template>
            <!-- 1待处理-->
            <template v-if="+record.status === 1">
              <template v-if="[2,3].includes(+record.dataType)">
                <a-divider type="vertical" />
                <a @click="doAction('handle',record)">处理</a>
              </template>
            </template>

            <!-- 2已撤回-->
            <template v-if="+record.status === 2">
              <template v-if="[1,3].includes(+record.dataType)">
                <a-divider type="vertical" />
                <a @click="doAction('edit',record)">修改</a>
              </template>
            </template>

            <!-- 3已处理-->
            <template v-if="+record.status === 3">
              <template v-if="[2,3].includes(+record.dataType)">
                <a-divider type="vertical" />
                <a @click="doAction('edit',record)">修改</a>
              </template>
            </template>
            <!-- 4待审批-->
            <template v-if="+record.status === 4">
              <!-- <a @click="doAction('view',record)">查看</a> -->
            </template>
            <!-- 5不通过-->
            <template v-if="+record.status === 5">
              <template v-if="[2,3].includes(+record.dataType)">
                <a-divider type="vertical" />
                <a @click="doAction('edit',record)">修改</a>
              </template>
            </template>
            <!-- 6通过-->
            <template v-if="+record.status === 6">
              <template v-if="[1,3].includes(+record.dataType) && +record.formCustomer === 1">
                <template v-if="$auth('exceptionReport:feedback')">
                  <a-divider type="vertical" />
                  <a @click="doAction('feedbackAdd',record)">新增反馈记录</a>
                </template>
              </template>

              <template  v-if="[1,3].includes(+record.dataType) && +record.formCustomer === 2">
                <template v-if="$auth('exceptionReport:over')">
                  <a-divider type="vertical" />
                  <a @click="doAction('over',record)">完结</a>
                </template>
              </template>
            </template>
            <!-- 7完结-->
            <template v-if="+record.status === 7">
              <template v-if="[1,3].includes(+record.dataType) && +record.formCustomer === 1">
                <a-divider type="vertical" />
                <a @click="doAction('feedbackDetail',record)">反馈详情</a>
              </template>
            </template>
          </div>
        </a-table>
      </div>
      <ActionForm ref="actionForm" @finish="() => search()" />
      <ApproveInfo ref="approveInfoCard" />
      <FeedBackForm ref="feedBackForm" @finish="() => search()" />
      <FeedBackRecordForm ref="feedBackRecordForm" />
    </a-spin>
  </a-card>
</template>

<script>
import DepartmentSelect from '@/components/CustomerList/DepartmentSelect'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ActionForm from './ActionForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import FeedBackForm from './FeedBackForm'
import FeedBackRecordForm from './FeedBackRecordForm'
import moment from 'moment'
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
    ActionForm,
    ApproveInfo,
    FeedBackForm,
    FeedBackRecordForm
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      queryParam: {
        searchStatus:0
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
        if (to.name === 'after-sales-management_exception_list') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      const that = this
      that.search()
    },
    search(params = {}) {
      const that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      let _queryParam = {...that.queryParam}
      if(_queryParam.date){
        let [exceptionBeginDate,exceptionEndDate] = _queryParam.date
        if(exceptionBeginDate){
          _queryParam.exceptionBeginDate = exceptionBeginDate.format('YYYY-MM-DD')
        }
        if(exceptionEndDate){
          _queryParam.exceptionEndDate = exceptionEndDate.format('YYYY-MM-DD')
        }
      }

      const _searchParam = Object.assign({}, _queryParam, paginationParam, params)
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
    doAction(type,record){
      const that = this
      if(['add','view','edit','approval','handle'].includes(type)){
        that.$refs.actionForm.query(type,record)
        return
      }else if(type === 'feedbackAdd'){
        that.$refs.feedBackForm.query(record)
        return
      }else if(type === 'feedbackDetail'){
        that.$refs.feedBackRecordForm.query(record)
        return
      }else if(type === 'over'){
        that.$confirm({
          title: '完结',
          content: `异常单[${record.serialNum}]是否更状态为完结！请确保此任务单已经完成！`,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            exceptionReportFinishExceptionReport({id:record.id}).then(res => {
              that.$message.info(res.msg)
              if(res.code === 200){
                that.search()
              }
            }).catch(err => {
              that.$message.error(err)
            })
          },
          onCancel() {
            console.log('Cancel')
          }
        })
        return
      }else if(type === 'reback'){
        that.$confirm({
          title: '撤回',
          content: `确定执行撤回操作吗?`,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            exceptionReportWithdraw({id:record.id}).then(res => {
              that.$message.info(res.msg)
              if(res.code === 200){
                that.search()
              }
            }).catch(err => {
              that.$message.error(err)
            })
          },
          onCancel() {
            console.log('Cancel')
          }
        })
        return
      }
    },
    getStatus(type){
      let m = {0:'待提交',1:'待处理',2:'已撤回',3:'已处理',4:'待审批',5:'不通过',6:'通过',7:'完结'}
      return m[type]
    }
  }
}
</script>
<style scoped>
.__table-footer-action-wrapper > *{
  margin-right: 10px;
}
</style>

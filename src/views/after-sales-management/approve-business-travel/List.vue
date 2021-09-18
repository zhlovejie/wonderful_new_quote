<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <DepartmentUserCascade allowClear :info.sync="queryParam.applyUser" style="width:360px;"/>
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
      <a-tabs
        :activeKey="activeKey"
        :defaultActiveKey="activeKey"
        @change="tabChange"
      >
        <a-tab-pane tab="我的" :key="0" />
        <a-tab-pane tab="待审批" :key="1" />
        <a-tab-pane tab="已审批" :key="2" />
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

              <a @click="doAction('view',record)">查看</a>
              <a-divider type="vertical" />
              <a @click="doAction('edit',record)">修改</a>
              <a-divider type="vertical" />
                <a @click="doAction('reback',record)">撤回</a>
              <a-divider type="vertical" />
                <a @click="doAction('del',record)">删除</a>

          </div>
        </a-table>
      </div>
      <AddForm ref="addForm" @finish="() => search()" />
      <ApproveInfo ref="approveInfoCard" />
    </a-spin>
  </a-card>
</template>

<script>
import DepartmentUserCascade from '@/components/CustomerList/DepartmentUserCascade'
import AddForm from './AddForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import {
  reimburseAdd,
  reimburseApproval,
  reimburseDelete,
  reimburseDetail,
  reimbursePageList,
  reimburseWithdraw,
  reimburseSubmit
} from '@/api/after-sales-management-custom'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width:80
  },
  {
    title: '日常报销单号',
    dataIndex: 'serialNum'
  },
  {
    title: '报销人',
    dataIndex: 'formCustomer',
    scopedSlots: { customRender: 'formCustomer' }
  },
  {
    title: '报销时间',
    dataIndex: 'exceptionDate'
  },
  {
    title: '报销描述',
    dataIndex: 'materialCode'
  },
  {
    title: '金额(元)',
    dataIndex: 'materialType'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    DepartmentUserCascade,
    AddForm,
    ApproveInfo,
  },
  data() {
    return {
      activeKey:0,
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
        if (to.name === 'after-sales-management_approve-business-travel') {
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
      let queryParam = {...that.queryParam}
      queryParam.activeKey = that.activeKey
      if(queryParam.date){
        let [beginTime,endTime] = queryParam.date
        if(beginTime){
          queryParam.beginTime = beginTime.format('YYYY-MM-DD')
        }
        if(endTime){
          queryParam.endTime = endTime.format('YYYY-MM-DD')
        }
      }else{
        queryParam.beginTime = undefined
        queryParam.endTime = undefined
      }
      if(queryParam.applyUser){
        if(queryParam.applyUser.userId){
          queryParam.createdId = queryParam.applyUser.userId
        }else{
          queryParam.createdId = undefined
        }
        if(queryParam.applyUser.depId){
          queryParam.depId = queryParam.applyUser.depId
        }
      }else{
        queryParam.createdId = undefined
        queryParam.depId = undefined
      }
      delete queryParam.applyUser
      delete queryParam.date

      const _searchParam = Object.assign({}, queryParam , paginationParam, params)
      that.loading = true
      reimbursePageList(_searchParam)
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
        that.$refs.addForm.query(type,record)
        return
      }
      //else if(type === 'feedbackAdd'){
      //   that.$refs.feedBackForm.query(record)
      //   return
      // }else if(type === 'feedbackDetail'){
      //   that.$refs.feedBackRecordForm.query(record)
      //   return
      // }else if(type === 'over'){
      //   that.$confirm({
      //     title: '完结',
      //     content: `异常单[${record.serialNum}]是否更状态为完结！请确保此任务单已经完成！`,
      //     okText: '确定',
      //     cancelText: '取消',
      //     onOk() {
      //       exceptionReportFinishExceptionReport({id:record.id}).then(res => {
      //         that.$message.info(res.msg)
      //         if(res.code === 200){
      //           that.search()
      //         }
      //       }).catch(err => {
      //         that.$message.error(err)
      //       })
      //     },
      //     onCancel() {
      //       console.log('Cancel')
      //     }
      //   })
      //   return
      // }else if(type === 'reback'){
      //   that.$confirm({
      //     title: '撤回',
      //     content: `确定执行撤回操作吗?`,
      //     okText: '确定',
      //     cancelText: '取消',
      //     onOk() {
      //       exceptionReportWithdraw({id:record.id}).then(res => {
      //         that.$message.info(res.msg)
      //         if(res.code === 200){
      //           that.search()
      //         }
      //       }).catch(err => {
      //         that.$message.error(err)
      //       })
      //     },
      //     onCancel() {
      //       console.log('Cancel')
      //     }
      //   })
      //   return
      // }
    },
    getStatus(type){
      let m = {0:'待提交',1:'待处理',2:'已撤回',3:'已处理',4:'待审批',5:'不通过',6:'通过',7:'完结'}
      return m[type]
    },
    tabChange(key){
      this.activeKey = +key
      this.search()
    }
  }
}
</script>
<style scoped>
.__table-footer-action-wrapper > *{
  margin-right: 10px;
}
</style>

<template>
  <!-- 客户预收款 应收列表-->
  <a-modal
    title="客户预收款应收列表"
    :width="980"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false" 
    :footer="null"
  >
  <a-card :bordered="false" class="_sales_top_wrapper">
    <a-row>
      
      <h3>
        {{record.staticsDate}}
        <span style="margin-left:50px;">应收：{{record.shouldAmount | moneyFormatNumber}}</span>
      </h3>
      <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange" 
          size="middle" 
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="amount" slot-scope="text,record">
            <span :style="{color:record.expireFlag === 1 ? 'red' : 'green'}">{{text | moneyFormatNumber}}</span>
          </div>
          <div slot="moneyType" slot-scope="text">
            <span>{{ getMoneyTypeTxt(text) }}</span>
          </div>

          <template slot="footer" >
            <h3 style="color:red;">
              合计：{{record.contractAmount | moneyFormatNumber}}
            </h3>
          </template>
        </a-table>
      </a-col>
      
    </a-row>
  </a-card>
  </a-modal>
</template>

<script>
import { pageListReportPrepareMoneyContractProduct, exportExcelDatas } from '@/api/saleReport'
import moment from 'moment'

let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '预收日期',
    dataIndex: 'paymentDate',
  },
  {
    title: '结算方式',
    dataIndex: 'moneyType',
    scopedSlots: { customRender: 'moneyType' }
  },
  {
    title: '应收金额(元)',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' }
  }
]

export default {
  name: 'AdvancePaymentChart-ShouldAmount',
  data() {
    return {
      pageTitle: '客户预收款单合同-应收款列表',
      columns: columns,
      contractNum:undefined,
      dataSource: [],
      sDate:[undefined,undefined],
      pagination: {
        current: 1,
        size: '10',
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading: false,
      visible:false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      record:{}
    }
  },
  computed: {
    searchParam() {
      return {
        contractId:this.record.contractId,
        staticsDate:this.record.staticsDate
      }
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let queue = []
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.size || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      that.loading = true
      pageListReportPrepareMoneyContractProduct(_searchParam)
        .then((res) => {
          that.loading = false
          let data = res.data
          try {
            that.dataSource = data.map((item, index) => {
              item.key = uuid()
              item.paymentDate = item.paymentDate ? item.paymentDate.slice(0, 10) : '-'
              return item
            })
          } catch (e) {
            console.log(e)
            that.dataSource = []
          }
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = data.total || 0
          pagination.current = data.current || 1
          that.pagination = pagination

        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      let pagination = { ...this.pagination }
      pagination.current = current
      pagination.size = String(pageSize)
      this.pagination = pagination
      this.searchAction()
    },
    query(type,record={}){
      this.visible = true
      this.record = {...record}
      this.$nextTick(() => this.searchAction())
    },
    handleSubmit(){
      this.handleCancel()
    },
    handleCancel(){
      this.visible = false
    },
    getMoneyTypeTxt(type){
      return {1:'质保金',2:'进度款',3:'验收款',4:'预付款',5:'提货款'}[type]
    }
  },
}
</script>

<style scoped>
.chart-wrapper {
  padding: 0 0 0 0;
}
.chart-wrapper .chart-title {
  text-align: center;
  font-size: 22px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}

._sales_top_wrapper >>> .department-sum-item {
  color: red;
  font-weight: bold;
}

._sales_top_wrapper >>> .ant-table-header{
  overflow-y: auto !important;
}
._sales_top_wrapper >>> .ant-table-body{
  overflow-y: auto !important;
}
</style>
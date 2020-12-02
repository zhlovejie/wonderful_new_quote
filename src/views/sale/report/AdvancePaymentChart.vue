<template>
  <!-- 客户预收款表 -->
  <a-card :bordered="false" class="_sales_top_wrapper">
    <a-row>
      <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <a-form layout="inline">
          <a-form-item v-if="$auth('reportRateMoneyCustomer:select')">
            <a-select
              placeholder="选择销售经理"
              v-model="saleUserId"
              :allowClear="true"
              style="width:200px;"
            >
              <a-select-option v-for="item in saleUser" :value="item.userId" :key="item.userId" >{{ item.salesmanName }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input placeholder="客户名称" v-model="customerName" allowClear style="width:200px;" />
          </a-form-item>
          <a-form-item>
            <a-range-picker v-model="sDate" :allowClear="true" />
          </a-form-item>
          <a-form-item>
            <a-button class="a-button" type="primary" icon="search" @click="actionHandler('search')">查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-button class="a-button" type="primary" icon="download" @click="actionHandler('download')">下载</a-button>
          </a-form-item>
        </a-form>
      </a-col>

      <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
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
          <div slot="amount" slot-scope="text">
            <span>{{ text | moneyFormatNumber }}</span>
          </div>

          <div slot="action" slot-scope="text, record">
            <a href="javascript:void(0);" @click="actionHandler('view',record)">查看</a>
          </div>

        </a-table>
      </a-col>
    </a-row>
    <ContractViewForm ref="contractViewForm" />
  </a-card>
</template>

<script>
import { pageListReportRateMoneyCustomer, exportExcelDatas } from '@/api/saleReport'
import { salesJurisdiction } from '@/api/customer'
import moment from 'moment'
import ContractViewForm from './AdvancePaymentChartModel/ContractView'

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
    title: '日期',
    dataIndex: 'staticsDate',
    width:150
  },
  {
    title: '客户名称',
    dataIndex: 'customerName'
  },
  {
    title: '销售经理',
    dataIndex: 'salerUserName',
    width:150
  },
  {
    title: '金额(元)',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' },
    width:150
  },
  {
    title: '详情',
    scopedSlots: { customRender: 'action' },
    width:150
  },
]

export default {
  name: 'AdvancePaymentChart',
  components:{ContractViewForm},
  data() {
    return {
      pageTitle: '客户预收款单',
      columns: columns,
      sDate: [moment(),moment()],
      saleUser:[],
      saleUserId:undefined,
      customerName:undefined,
      dataSource: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize:10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人

      customerSelectOptions:{
        showInputLabel:false,
        wrapperStyle:{
          width:'100%'
        },
        formLayout:'horizontal',
        formItemLayout:{
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired:true,
        inputAllowClear:false
      },
      needOptions:{
        userId:undefined
      }
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'AdvancePaymentChart') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {
    searchParam() {
      let startTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        startTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      return {
        searchBeginDate: startTime,
        searchEndDate: endTime,
        customerName:this.customerName,
        salerUserId:this.saleUserId
      }
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this

      //重置搜索条件
      that.sDate = [moment(),moment()]
      that.saleUserId = undefined
      that.customerName = undefined

      let queue = []
      let task1 = salesJurisdiction().then(res => (that.saleUser = res.data.allSalesman || res.data.subSalesman || []))
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      that.loading = true
      pageListReportRateMoneyCustomer(_searchParam)
        .then((res) => {
          that.loading = false
          let data = res.data
          try {
            that.dataSource = data.records.map((item, index) => {
              item.key = uuid()
              item.staticsDate = item.staticsDate ? item.staticsDate.slice(0, 10) : '-'
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
      const pager = pagination
      pager.current = pagination.current
      if(+pager.pageSize !== +pager._prePageSize){ //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = {...this.pagination,...pager}
      this.searchAction()
    },
    simpleSearch(type) {
      this.rangeType = this.rangeType === type ? undefined : type
      this.searchAction({current:1})
    },
    actionHandler(type,record) {
      if (type === 'search') {
        this.searchAction({current:1})
        return
      } else if (type === 'download') {
        this.downloadAction()
        return
      } else if(type === 'view'){
        this.$refs.contractViewForm.query(type,record)
        return
      }
    },
    downloadAction() {
      let that = this
      exportExcelDatas(9, this.searchParam)
        .then((res) => {
          console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `${that.pageTitle}.xls`
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => {
          that.$message.info(`请求出错：${err.message}`)
        })
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

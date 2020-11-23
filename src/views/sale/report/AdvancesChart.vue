<template>
  <!-- 预收账款分析 -->
  <a-card :bordered="false" class="_sales_top_wrapper">
    <a-row>
      <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <a-form layout="inline">
          <a-form-item>
            <a-range-picker 
              v-model="sDate" 
              :allowClear="true" 
              :disabledDate="disabledDate" 
              @change="pickerChange"
              @calendarChange="pickerChange" 
              @openChange="pickerOpenChange"
            >
            <template slot="renderExtraFooter">
              <span style="color:red;">只能选择一月内的数据</span>
            </template>
            </a-range-picker>
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
        <div class="chart-wrapper">
          <h3 class="chart-title">预收账款分析</h3>
          <template v-if="chartData && chartData.length > 0">
            <v-chart  :forceFit="true" :height="chartHeight" :data="chartData" :scale="scale" :padding="padding">
              <v-tooltip />
              <v-legend />
              <v-interval position="staticsDate*amount" />
              <v-axis dataKey="amount" :label="labelFormat" :title="title" />
            </v-chart>
          </template>
          <template v-else>
            <a-empty :image="emptyImage" />
          </template>
        </div>
      </a-col>
      <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="loading"
          :scroll="{ y: 500 }" 
          size="middle"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="amount" slot-scope="text">
            <span>{{ text | moneyFormatNumber }}</span>
          </div>
        </a-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { pageListReportPrepareMoneyDate, exportExcelDatas } from '@/api/saleReport'
import moment from 'moment'
import { Empty } from 'ant-design-vue'
const DataSet = require('@antv/data-set')
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
  },
  {
    title: '金额(元)',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' },
  },
]

const label = {
  textStyle: {
    fill: '#aaaaaa'
  }
}

const labelFormat = {
  textStyle: {
    fill: '#aaaaaa'
  },
  formatter: function formatter(text) {
    return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
}

const tickLine = {
  alignWithLabel: false,
  length: 0
}

const title = {
  offset: 70
}

export default {
  name: 'AdvancesChart',
  data() {
    return {
      pageTitle: '预收账款分析',
      columns: columns,
      sDate: [moment().startOf('months'), moment()],
      disabledDateRange:[],
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

      
      chartHeight:500,
      padding:[20, 20, 50, 140],
      label,
      labelFormat,
      tickLine,
      title,
      scale:[{
        dataKey: 'amount',
        alias: '金额(元)',
      },
      {
        dataKey: 'staticsDate',
        type: 'timeCat',
      }],
      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'AdvancesChart') {
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
        //searchType: startTime && endTime ? undefined : this.rangeType,
      }
    },
    chartData(){
      return this.dataSource.map(item =>{
        return {
          staticsDate:item.staticsDate,
          amount:+item.amount || 0
        }
      })
    },
  },
  methods: {
    moment: moment,
    init() {
      
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      that.loading = true
      pageListReportPrepareMoneyDate(_searchParam)
        .then((res) => {
          that.loading = false
          let data = res.data
          try {
            that.dataSource = data.map((item, index) => {
              item.key = uuid()
              item.staticsDate = item.staticsDate ? item.staticsDate.slice(0, 10) : '-'
              return item
            })
          } catch (e) {
            console.log(e)
            that.dataSource = []
          }
          //设置数据总条数
          // const pagination = { ...that.pagination }
          // pagination.total = data.total || 0
          // pagination.current = data.current || 1
          // that.pagination = pagination

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
    actionHandler(type) {
      if (type === 'search') {
        let {searchBeginDate,searchEndDate} = this.searchParam
        if(!searchBeginDate || !searchEndDate ){
          this.$message.warn('请选择开始日期和结束日期')
          return
        }
        this.searchAction({current:1})
      } else if (type === 'download') {
        this.downloadAction()
      }
    },
    downloadAction() {
      let that = this
      exportExcelDatas(8, this.searchParam)
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
    },
    disabledDate(current){
      //console.log(arguments)
      //return []
      //return 
      console.log('disabledDate called...')
      let disabledDateRange = this.disabledDateRange
      if(disabledDateRange.length === 0){
        return current > moment().endOf('day')
      }else{
        return current < disabledDateRange[0] || current >= disabledDateRange[1]
      }
    },
    pickerChange(arr){ //计算开始日期后一个月内可选日期范围
      console.log('pickerChange called...')
      if(arr.length === 0){
        this.disabledDateRange = []
        return
      }
      let startDate = arr[0].clone()
      let end = arr[0].clone()
      end = end.add(1,'months')
      let current = moment()
      if(end > current){
        let diff = Math.abs(end.diff(current,'days'))
        end = end.add(-end.diff(current,'days'),'days')
      }
      console.log(startDate.format("YYYY-MM-DD"),'~',end.format("YYYY-MM-DD"))
      this.disabledDateRange = [startDate.clone(),end.clone()]
    },
    pickerOpenChange(){
      this.disabledDateRange = []
    }
  },
}
</script>

<style scoped>
.chart-wrapper {
  background-color: rgba(250, 250, 250, .5);
  margin-top: 20px;
  padding: 20px 0 0 0;
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
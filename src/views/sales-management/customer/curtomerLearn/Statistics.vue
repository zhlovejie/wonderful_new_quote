<template>
  <a-card :bordered="false" class="_sales_top_wrapper">
    <a-row>
      <a-col :xl="10" :lg="24" :md="24" :sm="24" :xs="24">
        <a-form layout="inline">
          <a-form-item>
            <a-button-group>
              <a-button type="primary" :class="{ currentDayWeekMonth: rangeType === 1 }" @click="simpleSearch(1)"
                >本周</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: rangeType === 2 }" @click="simpleSearch(2)"
                >本月</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: rangeType === 3 }" @click="simpleSearch(3)"
                >全部</a-button
              >
            </a-button-group>
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

        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="loading"
          :customRow="customRowFunction"
          bordered
        >
          <div slot="money" slot-scope="text, record">
            <span>{{ record.money | moneyFormatNumber }}</span>
          </div>
          <div slot="percentage" slot-scope="text, record">
            <span>{{ text || 0 }}%</span>
          </div>
        </a-table>
      </a-col>
      <a-col :xl="14" :lg="24" :md="24" :sm="24" :xs="24">
        <div class="chart-wrapper">
          <h3 class="chart-title">客户获知渠道分析</h3>
          <template v-if="chartData && chartData.length > 0">
            <v-chart :forceFit="true" :height="600" :data="chartData" :scale="scale">
              <v-tooltip />
              <v-axis />
              <v-bar position="learn*数量" />
            </v-chart>
          </template>
          <template v-else>
            <a-empty :image="emptyImage" />
          </template>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { pageListReportStatisticsForLearn, exportExcelDatas } from '@/api/saleReport'
import moment from 'moment'
import { Empty } from 'ant-design-vue'
const DataSet = require('@antv/data-set')
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

const columns = [
  {
    title: '获知渠道',
    dataIndex: 'learn',
  },
  {
    title: '数量',
    dataIndex: 'count',
  },
  {
    title: '占比(%)',
    dataIndex: 'percentage',
    scopedSlots: { customRender: 'percentage' },
  },
]

export default {
  name: 'curtomer-learn-statistics',
  data() {
    return {
      pageTitle: '客户获知渠道分析',
      columns: columns,
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      rangeType: 1,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      height: 600,
      scale: [
        {
          dataKey: '数量',
        },
      ],
      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'curtomer-learn-statistics') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {
    chartData() {
      return this.dataSource.filter(item => !item.isTotal).map((item) => {
        return {
          '数量': item.count,
          learn: item.learn,
        }
      })
    },
    searchParam() {
      let startTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        startTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      return {
        startTime,
        endTime,
        type: this.rangeType,
      }
    },
  },
  methods: {
    moment: moment,
    init() {
      this.rangeType = 1
      this.dataSource = []
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {})
      //console.log('执行搜索...', _searchParam)
      that.dataSource = []
      that.loading = true
      pageListReportStatisticsForLearn(_searchParam)
        .then((res) => {
          that.loading = false
          let dataSource = res.data
          let total = dataSource.reduce((target,item) =>{
            target.count += item.count
            target.percentage += item.percentage
            return target
          },{isTotal:true, learn:'合计',count:0,percentage:0})

          that.dataSource = [...dataSource,total]
          //设置数据总条数
          // const pagination = { ...that.pagination }
          // pagination.total = res.data.total
          // that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    simpleSearch(type) {
      this.rangeType = this.rangeType === type ? undefined : type
      this.searchAction()
    },
    actionHandler(type) {
      if (type === 'search') {
        this.searchAction()
      } else if (type === 'download') {
        this.downloadAction()
      }
    },
    downloadAction() {
      let that = this
      exportExcelDatas(11, this.searchParam)
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
    customRowFunction(record, index) {
      let that = this
      return {
        class: [
          record.isTotal ? 'total-item' : ''
        ],
      }
    },
  },
}
</script>

<style scoped>
.chart-wrapper {
  padding: 50px 0 0 0;
}
.chart-wrapper .chart-title {
  text-align: center;
  font-size: 22px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}

._sales_top_wrapper >>> .total-item {
  color: red;
  font-weight: bold;
}
</style>

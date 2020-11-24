<template>
  <!-- 毛利率分析表 -->
  <a-card :bordered="false" class="_sales_top_wrapper">
    <a-row>
      <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <a-form layout="inline">
          <a-form-item>
            <a-button-group>
              <a-button type="primary" :class="{ currentDayWeekMonth: rangeType === 2 }" @click="simpleSearch(2)"
                >本周</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: rangeType === 3 }" @click="simpleSearch(3)"
                >本月</a-button
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
        <h3>平均毛利率：{{ avgRate }}%</h3>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :scroll="{ y: 500 }"
          size="small"
          bordered
        >
          <div slot="avgRate" slot-scope="text">
            <span>{{ text || 0 }}%</span>
          </div>
        </a-table>
      </a-col>
      <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <div class="chart-wrapper">
          <h3 class="chart-title">毛利率分析</h3>
          <template v-if="chartData && chartData.length > 0">
            <v-chart :forceFit="true" :height="height" :data="chartData" :scale="scale">
              <v-tooltip />
              <v-axis />
              <v-line position="date*value" />
              <v-point position="date*value" shape="circle" />
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
import { grossMarginSummaryChartList, exportExcelDatas } from '@/api/saleReport'
import moment from 'moment'
import { Empty } from 'ant-design-vue'
const DataSet = require('@antv/data-set')
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

const columns = [
  {
    title: '日期',
    align: 'center',
    dataIndex: 'staticsDate',
  },
  {
    title: '毛利率(%)',
    align: 'center',
    dataIndex: 'avgRate',
    scopedSlots: { customRender: 'avgRate' },
  },
]

export default {
  name: 'GrossMarginChart',
  data() {
    return {
      pageTitle: '毛利率分析',
      columns: columns,
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      rangeType: 2,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      avgRate: 0,

      scale: [
        {
          dataKey: 'value',

          alias: '毛利率',
        },
        {
          dataKey: 'date',
          type: 'timeCat',
        },
      ],
      height: 600,
      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'GrossMarginChart') {
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
        beginDate: startTime,
        endDate: endTime,
        searchType: startTime && endTime ? undefined : this.rangeType,
      }
    },
    chartData() {
      let dataSource = this.dataSource.map((item) => {
        return {
          date: item.staticsDate,
          //'value': +item.avgRate === 0 ? 0.1 : +item.avgRate,
          value: +item.avgRate,
        }
      })
      return dataSource
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
      grossMarginSummaryChartList(_searchParam)
        .then((res) => {
          that.loading = false
          let data = res.data.reportRateMoneyCollectVoList
          if (!data) {
            that.avgRate = 0
            that.dataSource = []
            return
          }
          try {
            that.avgRate = +res.data.avgCalRate
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
      if (+pager.pageSize !== +pager._prePageSize) {
        //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = { ...this.pagination, ...pager }
      this.searchAction()
    },

    simpleSearch(type) {
      this.rangeType = this.rangeType === type ? undefined : type
      this.searchAction({ current: 1 })
    },
    actionHandler(type) {
      if (type === 'search') {
        this.searchAction({ current: 1 })
      } else if (type === 'download') {
        this.downloadAction()
      }
    },
    downloadAction() {
      let that = this
      exportExcelDatas(7, this.searchParam)
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
  },
}
</script>

<style scoped>
.chart-wrapper {
  padding: 50px 0 0 0;
}
.chart-wrapper .chart-title {
  text-align: left;
  font-size: 22px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}

._sales_top_wrapper >>> .department-sum-item {
  color: red;
  font-weight: bold;
}

._sales_top_wrapper >>> .ant-table-header {
  overflow-y: auto !important;
}
._sales_top_wrapper >>> .ant-table-body {
  overflow-y: auto !important;
}
</style>
<template>
  <a-card :bordered="false">
    <a-row>
      <a-col :span="24">
        <a-form layout="inline">
          <a-form-item>
            <a-button-group>
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 1 }" @click="simpleSearch(1)"
                >今天</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 2 }" @click="simpleSearch(2)"
                >本周</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 3 }" @click="simpleSearch(3)"
                >本月</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType1 === 4 }" @click="simpleSearch(4)"
                >全部</a-button
              >
            </a-button-group>
          </a-form-item>
          <a-form-item>
            <a-range-picker style="margin-bottom: 20px" v-model="sDate" :allowClear="true" />
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
          :dataSource="tableData"
          :pagination="false"
          :loading="loading"
          size="small"
          bordered
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="money" slot-scope="text, record">
            <span>{{ record.money | moneyFormatNumber }}</span>
          </div>
        </a-table>
      </a-col>
      <a-col :span="6" v-for="key in Object.keys(chartData)" :key="key">
        <div class="chart-wrapper" style="height: 500px">
          <h3 class="chart-title">{{ key === 'numP' ? '总计占比' : key }}</h3>
          <template v-if="chartData">
            <v-chart :forceFit="true" :height="chartHeight" :data="chartData[key]" :scale="scale">
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
              <v-coord type="theta" />
            </v-chart>
          </template>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { Statistical, downStatistical } from '@/api/saleReport'
import moment from 'moment'
const DataSet = require('@antv/data-set')
export default {
  name: 'PersonnelPerformanceReport',
  data() {
    return {
      pageTitle: '销售类别统计',
      columns: [],
      sDate: [undefined, undefined],
      dataSource: [],
      CakeShape: [],
      loading: false,
      chartHeight: 300,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1,
      },
      //   padding: [20, 20, 50, 140],
      scale: [
        {
          dataKey: 'percent',
          min: 0,
          formatter: '.0%',
        },
      ],
      labelConfig: [
        'percent',
        {
          formatter: (val, item) => {
            return item.point.item + ': ' + val
          },
        },
      ],

      stageTimeType: 1,
      stageTimeType1: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'SalesCategoryAnalysis') {
          this.dataSource = []
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {
    tableData() {
      let _res = this.dataSource
      if (_res.length > 0) {
        let _columns = [
          {
            title: '序号',
            key: 'order',
            width: '70px',
            align: 'center',
            scopedSlots: { customRender: 'order' },
          },
          {
            title: '名称',
            align: 'center',
            dataIndex: 'text',
          },
          {
            title: '总计占比(%)',
            align: 'center',
            dataIndex: 'numP',
          },
        ]

        Object.keys(_res[0]).forEach((v) => {
          if (v !== 'numP' && v !== 'key' && v !== 'text') {
            _columns.push({
              title: v + '占比(%)',
              dataIndex: v,
              align: 'center',
              scopedSlots: { customRender: v },
            })
          }
        })
        this.columns = _columns
      } else {
        this.columns = []
      }
      return _res
    },
    chartData() {
      let dataSource = [...this.dataSource]
      if (dataSource.length === 0) {
        return {}
      }
      let baseKey = 'text'
      let otherKeys = Object.keys(dataSource[0]).filter((k) => ![baseKey, 'key'].includes(k))

      let map = {}
      otherKeys.map((k) => {
        map[k] = []
      })
      dataSource.map((item) => {
        otherKeys.map((k) => {
          map[k].push({
            item: item[baseKey],
            count: item[k],
          })
        })
      })

      Object.keys(map).map((k) => {
        const dv = new DataSet.View().source(map[k])
        dv.transform({
          type: 'percent',
          field: 'count',
          dimension: 'item',
          as: 'percent',
        })
        map[k] = dv.rows
      })

      return map
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
        stageTimeType: this.stageTimeType,
      }
    },
  },
  methods: {
    moment: moment,
    init() {
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, opt || {})
      that.loading = true
      Statistical(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch((err) => (that.loading = false))
    },

    simpleSearch(type) {
      if (type == 4) {
        this.stageTimeType1 = 4
        this.stageTimeType = undefined
        this.searchAction()
      } else {
        this.stageTimeType1 = undefined
        this.stageTimeType = this.stageTimeType === type ? undefined : type
        this.searchAction()
      }
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
      downStatistical(this.searchParam)
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
  text-align: center;
  font-size: 22px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>
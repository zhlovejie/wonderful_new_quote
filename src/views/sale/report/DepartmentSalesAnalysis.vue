<template>
  <a-card :bordered="false">
    <a-row>
      <a-col :span="10">
        <a-form layout="inline">
          <a-form-item>
            <a-month-picker placeholder="开始日期" v-model="startTime" @openChange="handleStartOpenChange" />
          </a-form-item>
          <a-form-item>
            <span>~</span>
          </a-form-item>
          <a-form-item>
            <a-month-picker
              placeholder="结束日期"
              v-model="endTime"
              :open="endOpen"
              @openChange="handleEndOpenChange"
            />
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
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="money" slot-scope="text, record">
            <span>{{ record.money | moneyFormatNumber }}</span>
          </div>
        </a-table>
      </a-col>
      <a-col :span="14">
        <div class="chart-wrapper">
          <h3 class="chart-title">部门业绩分析</h3>
          <v-chart :forceFit="true" :height="chartHeight" :data="chartData" :scale="scale" :padding="padding">
            <v-tooltip />

            <v-legend />
            <v-interval position="月份*销售金额" color="name" :adjust="adjust" :opcaity="1" />
            <v-axis :label="labelFormat" :title="title" dataKey="销售金额" />
          </v-chart>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { pageListDepartmentPerformanceReport, exportExcelDatas } from '@/api/saleReport'
import moment from 'moment'
const DataSet = require('@antv/data-set')

const label = {
  textStyle: {
    fill: '#aaaaaa',
  },
}

const labelFormat = {
  textStyle: {
    fill: '#aaaaaa',
  },
  formatter: function formatter(text) {
    return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  },
}

const tickLine = {
  alignWithLabel: false,
  length: 0,
}

const title = {
  offset: 70,
}
export default {
  name: 'DepartmentSalesAnalysis',
  data() {
    return {
      pageTitle: '部门业绩分析',
      columns: [],
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      chartHeight: 600,
      padding: [20, 20, 100, 140],
      label,
      labelFormat,
      tickLine,
      title,
      scale: [
        {
          dataKey: '销售金额',
          alias: '销售额(RMB)',
        },
      ],
      monthFormat: 'YYYY/MM',
      adjust: [
        {
          type: 'dodge',
          marginRatio: 1 / 32,
        },
      ],
      startTime: undefined,
      endTime: undefined,
      endOpen: false,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'DepartmentSalesAnalysis') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {
    chartData() {
      //参考 https://viserjs.github.io/demo.html#/viser/bar/grouped-column
      let fields = [...new Set(this.dataSource.map((item) => item.date))]
      let _formatChartData = (records) => {
        if (!Array.isArray(records)) {
          return []
        }
        if (records.length === 0) {
          return []
        }
        let keys = Object.keys(records[0]).filter((v) => v !== 'date' && v !== 'key')
        let result = []
        records.map((item) => {
          keys.map((k) => {
            let target = result.find((item) => item.name === k)
            if (target) {
              target[`${item.date}`] = +item[k]
            } else {
              let obj = {}
              obj.name = k
              obj[`${item.date}`] = +item[k]
              result.push(obj)
            }
          })
        })
        return result
      }
      const dv = new DataSet.View().source(_formatChartData(this.dataSource))
      dv.transform({
        type: 'fold',
        fields: fields,
        key: '月份',
        value: '销售金额',
      })
      return dv.rows
    },
    tableData() {
      //let _res = this.formatTableData(this.dataSource)
      let _res = this.dataSource
      if (_res.length > 0) {
        let _columns = [
          {
            title: '序号',
            key: 'order',
            width: '70px',
            scopedSlots: { customRender: 'order' },
          },
        ]

        Object.keys(_res[0]).forEach((v) => {
          if (v !== 'key') {
            _columns.push({
              title: v === 'date' ? '月份' : v === 'sumMoney' ? '总计销售额(万元)' : v,
              dataIndex: v,
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
    searchParam() {
      let startTime = undefined,
        endTime = undefined
      //if(Array.isArray(this.sDate) && this.sDate.length === 2){
      startTime = this.startTime instanceof moment ? this.startTime.format('YYYY-MM') : undefined
      endTime = this.endTime instanceof moment ? this.endTime.format('YYYY-MM') : undefined
      //}
      return {
        startTime,
        endTime,
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
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      pageListDepartmentPerformanceReport(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
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
    simpleSearch(type) {
      this.stageTimeType = this.stageTimeType === type ? undefined : type
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
      exportExcelDatas(3, this.searchParam)
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
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
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
</style>
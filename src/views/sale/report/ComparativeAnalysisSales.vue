<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form layout="inline">
          <a-form-item>
            <a-date-picker
              style="width: 280px; margin-right: 10px"
              mode="year"
              placeholder="开始年份"
              format="YYYY"
              v-model="yearPick"
              :open="yearPickShow"
              @panelChange="handlePanelChange"
              @openChange="handleOpenChange"
            />
            <!-- <a-range-picker style="margin-bottom: 20px" v-model="sDate" :allowClear="true" /> -->
          </a-form-item>
          <a-form-item>
            <a-date-picker
              style="width: 280px; margin-right: 10px"
              mode="year"
              placeholder="结束年份"
              format="YYYY"
              v-model="yearPick1"
              :open="yearPickShow1"
              @panelChange="handlePanelChange1"
              @openChange="handleOpenChange1"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              class="a-button"
              style="margin-bottom: 20px"
              type="primary"
              icon="search"
              @click="actionHandler('search')"
              >查询</a-button
            >
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
          size="small"
          bordered
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
      </a-col>
      <a-col :span="24">
        <div class="chart-wrapper1">
          <h3 class="chart-title1">销售额详情</h3>
          <a-table
            :columns="baseColumns"
            :dataSource="dataSource1"
            :pagination="false"
            :loading="loading"
            size="small"
            bordered
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
          </a-table>
        </div>
      </a-col>
      <a-col :span="24">
        <div class="chart-wrapper">
          <h3 class="chart-title">销售额对比</h3>
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
import { listSaleQuotaAnalysis, listSaleQuotaAnalysisDetail, listSaleQuotaDownDetail } from '@/api/saleReport'
import moment from 'moment'
const DataSet = require('@antv/data-set')
const columns = [
  {
    title: '序号',
    key: 'order',
    align: 'center',
    width: '20%',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '年份',
    align: 'center',
    width: '40%',
    dataIndex: 'year',
  },
  {
    align: 'center',
    width: '40%',
    title: '总计销售额(万元)',
    dataIndex: 'sumSaleQuota',
  },
]
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
  name: 'InvoiceProductReport',
  data() {
    return {
      yearPick: null, //年选择器的值
      yearPickShow: false, //年选择器的显示隐藏
      yearPick1: null, //年选择器的值
      yearPickShow1: false, //年选择器的显示隐藏
      pageTitle: '发货量分析',
      columns: columns,
      columns1: [
        {
          title: '序号',
          key: 'order',
          align: 'center',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '月份',
          align: 'center',
          dataIndex: 'month',
        },
        // {

        //   key: 'keys',
        // },
      ],
      dataSource1: [],

      sDate: [undefined, undefined],
      dataSource: [],
      adjust: [
        {
          type: 'dodge',
          marginRatio: 1 / 32,
        },
      ],
      scale: [
        {
          dataKey: '销售金额',
          alias: '销售金额(万元)',
        },
      ],
      loading: false,
      chartHeight: 600,
      padding: [20, 20, 100, 140],
      label,
      searchParam: {},
      labelFormat,
      tickLine,
      title,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'ComparativeAnalysisSales') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {
    baseColumns() {
      let _columns = []
      this.dataSource.map((item, idx) => {
        if (!_columns.find((c) => c.title === item.year)) {
          _columns.push({
            title: `${item.year}销售额(万元)`,
            dataIndex: `bounsItemRetio_${item.key}`,
            align: 'center',
          })
        }
      })

      let __columns = [...this.columns1]
      // let idx = __columns.findIndex((item) => item.key === 'keys')
      // if (idx >= 0) {
      __columns.splice(__columns.length, 0, ..._columns)
      // }
      return __columns
    },
    chartData() {
      //参考 https://viserjs.github.io/demo.html#/viser/bar/grouped-column
      let fields = [...new Set(this.dataSource1.map((item) => item.month + '月份'))]
      let _formatChartData = (records) => {
        if (!Array.isArray(records)) {
          return []
        }
        if (records.length === 0) {
          return []
        }
        let keys = Object.keys(records[0]).filter(
          (v) => v !== 'month' && v !== 'key' && v !== 'bounsItemRetio_1' && v !== 'bounsItemRetio_2'
        )
        let result = []
        records.map((item) => {
          keys.map((k) => {
            let target = result.find((item) => item.name === k)
            if (target) {
              target[`${item.month}月份`] = +item[k]
            } else {
              let obj = {}
              obj.name = k
              obj[`${item.month}月份`] = +item[k]
              result.push(obj)
            }
          })
        })
        if (this.dataSource.length > 1) {
          result[0].name = this.dataSource[1].year + '销售额(万元)'
          result[1].name = this.dataSource[0].year + '销售额(万元)'
        }

        return result
      }
      const dv = new DataSet.View().source(_formatChartData(this.dataSource1))
      dv.transform({
        type: 'fold',
        fields: fields,
        key: '月份',
        value: '销售金额',
      })
      return dv.rows
    },
  },
  methods: {
    moment,
    init() {
      let nowDate = new Date()
      let date = {
        year: nowDate.getFullYear(),
      }
      let date1 = {
        year: nowDate.getFullYear() - 1,
      }
      this.searchParam.endYear = date.year
      this.searchParam.startYear = date1.year
      this.searchAction()
    },
    // 得到年份选择器的值
    handlePanelChange(value) {
      this.yearPick = value
      this.yearPickShow = false
    },
    handleOpenChange(status) {
      this.yearPickShow = status
    },
    // 得到年份选择器的值
    handlePanelChange1(value) {
      if (!this.yearPick) {
        return this.$message.error('请先选择开始年份')
      }
      if (this.yearPick < value) {
        this.yearPick1 = value
        this.yearPickShow1 = false
      } else {
        this.$message.error('当前年份要大于开始年份')
      }
    },
    handleOpenChange1(status) {
      this.yearPickShow1 = status
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      listSaleQuotaAnalysis(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.map((item, index) => {
            item.key = index + 1
            return item
          })
        })

        .catch((err) => (that.loading = false))

      listSaleQuotaAnalysisDetail(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource1 = res.data.map((item, index) => {
            item.key = index + 1
            item.bounsItemRetio_1 = item.sumEndSaleQuota
            item.bounsItemRetio_2 = item.sumStartSaleQuota
            return item
          })
        })
        .catch((err) => (that.loading = false))
    },

    actionHandler(type) {
      let year = moment(this.yearPick).format('YYYY')
      let year1 = moment(this.yearPick1).format('YYYY')
      if (type === 'search') {
        if (this.yearPick != null && this.yearPick1 != null && year !== year1) {
          this.searchParam.startYear = year
          this.searchParam.endYear = year1
        } else {
          delete this.searchParam.startYear
          delete this.searchParam.endYear
          return this.$message.error('请选择开始年份或结束年份 ,开始年份和结束年份不能相同')
        }
        this.searchAction()
      } else if (type === 'download') {
        if (this.yearPick != null && this.yearPick1 != null) {
          this.downloadAction({ startYear: year, endYear: year1 })
        } else {
          let nowDate = new Date()
          let date = {
            year: nowDate.getFullYear(),
          }
          let date1 = {
            year: nowDate.getFullYear() - 1,
          }
          this.searchParam.endYear = date.year
          this.searchParam.startYear = date1.year
          this.downloadAction()
        }
      }
    },
    downloadAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, opt || {})
      listSaleQuotaDownDetail(_searchParam)
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
              a.download = `销售额详情对比分析.xls`
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

.chart-wrapper1 {
  padding: 11px 0 0 0;
}
.chart-wrapper1 .chart-title1 {
  text-align: left;
  font-size: 22px;
}
</style>
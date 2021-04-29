<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="10">
        <a-form layout="inline">
          <a-form-item>
            <a-range-picker v-model="sDate" :allowClear="true" />
          </a-form-item>
          <a-form-item>
            <a-button class="a-button" type="primary" icon="search" @click="actionHandler('search')">查询</a-button>
          </a-form-item>
        </a-form>

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
        </a-table>
      </a-col>
      <a-col :span="14">
        <div class="chart-wrapper">
          <h3 class="chart-title">工作餐数据分析</h3>
          <!-- <v-chart :forceFit="true" :height="height" :data="chartData">
            <v-tooltip />
            <v-axis />
            <v-legend />
            <v-bar position="日期*工作餐" color="name" :adjust="adjust" />
          </v-chart> -->
          <v-chart :forceFit="true" :height="height" :data="chartData" :scale="scale">
            <v-tooltip />

            <v-legend />
            <v-interval position="日期*工作餐" color="name" :adjust="adjust" :opcaity="1" />
            <v-axis :label="labelFormat" :title="title" dataKey="工作餐" />
          </v-chart>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { getOrderLunchStatisticsList } from '@/api/attendanceManagement'
import moment from 'moment'
const DataSet = require('@antv/data-set')
const label = {
  textStyle: {
    fill: '#aaaaaa',
  },
}

const title = {
  offset: 70,
}
const labelFormat = {
  textStyle: {
    fill: '#aaaaaa',
  },
  formatter: function formatter(text) {
    return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  },
}
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '日期',
    dataIndex: 'lunchDate',
    width: '120px',
  },
  {
    title: '预约工作餐人数',
    dataIndex: 'workLunchNum',
    width: '70px',
  },
  {
    title: '就餐人数',
    dataIndex: 'workLunchEatNum',
    width: '70px',
  },
]

export default {
  name: 'attendancechartSummaryLIst',
  data() {
    return {
      pageTitle: '工作餐数据分析',
      title,
      label,
      labelFormat,
      columns,
      height: 400,
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1,
      },
      scale: [
        {
          tickCount: 7,
          dataKey: 'date',
          type: 'cat',
        },
      ],
      adjust: [
        {
          type: 'dodge',
          marginRatio: 1 / 32,
        },
      ],
      loading: false,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'attendance-chart-SummaryLIst') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {
    chartData() {
      const field = [...new Set(this.dataSource.map((item) => item.lunchDate + ' '))]

      let _formatChartData = (records) => {
        if (!Array.isArray(records)) {
          return []
        }
        if (records.length === 0) {
          return []
        }
        let obj = { name: '预约工作餐人数' }
        let arr = { name: '就餐人数' }
        records.map((item) => {
          obj[`${item.lunchDate} `] = item.workLunchNum
          arr[`${item.lunchDate} `] = item.workLunchEatNum
        })
        return [obj, arr]
      }
      const dv = new DataSet.View().source(_formatChartData(this.dataSource))
      dv.transform({
        type: 'fold',
        fields: field,
        key: '日期',
        value: '工作餐',
      })
      return dv.rows
    },
    searchParam() {
      let beginTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        beginTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      return { beginTime, endTime }
    },
  },
  methods: {
    moment,
    init() {
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getOrderLunchStatisticsList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return {
              key: index + 1,
              lunchDate: item.lunchDate,
              workLunchNum: item.workLunchNum,
              workLunchEatNum: item.workLunchEatNum,
            }
          })
          console.log(that.dataSource)
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      let that = this
      console.log(pagination, filters, sorter)
      const pager = { ...that.pagination }
      pager.current = pagination.current
      that.pagination = pager
      that.searchAction()
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
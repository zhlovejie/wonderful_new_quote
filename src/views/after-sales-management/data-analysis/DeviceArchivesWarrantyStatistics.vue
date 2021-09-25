<template>
  <a-card :bordered="false">
    <a-row>
      <a-col :span="10">
        <a-form layout="inline">
          <a-form-item>
            <a-button-group>
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 0 }" @click="simpleSearch(0)"
                >今天</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 1 }" @click="simpleSearch(1)"
                >本周</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 2 }" @click="simpleSearch(2)"
                >本月</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 3 }" @click="simpleSearch(3)"
                >上月</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 4 }" @click="simpleSearch(4)"
                >本年</a-button
              >
            </a-button-group>
          </a-form-item>
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
          <h3 class="chart-title">过保分析数据</h3>
          <v-chart :forceFit="true" :height="chartHeight" :data="chartData" :scale="scale" :padding="padding">
            <v-tooltip />
            <v-legend />
            <v-interval position="dateTime*quantity" :opcaity="1" />
            <v-axis dataKey="quantity" :label="labelFormat" :title="title" />
          </v-chart>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import {
  deviceArchivesWarrantyStatistics,//数据分析-过保统计
} from '@/api/after-sales-management-custom'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '日期',
    dataIndex: 'dateTime',
    width: '100px',
  },
  {
    title: '过保数量',
    dataIndex: 'quantity',
    width: '150px',
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
    return text
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
  name: 'DeviceArchivesWarrantyStatistics',
  data() {
    return {
      pageTitle: '过保统计',
      columns: columns,
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      chartHeight: 600,
      padding: [20, 20, 50, 140],
      label,
      labelFormat,
      tickLine,
      title,
      scale: [
        {
          dataKey: 'quantity',
          alias: '数量',
        },
      ],

      stageTimeType: 1,
    }
  },
  computed: {
    chartData() {
      return this.dataSource.map((item) => Object.assign({}, item))
    },
    searchParam() {
      let startTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        startTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      return {
        beginTime:startTime,
        endTime:endTime,
        dayWeekMonth: this.stageTimeType,
      }
    },
  },
  created(){
    this.init()
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
      deviceArchivesWarrantyStatistics(_searchParam)
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
      this.stageTimeType = type
      this.searchAction()
    },
    actionHandler(type) {
      if (type === 'search') {
        this.searchAction()
      }
    }
  }
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

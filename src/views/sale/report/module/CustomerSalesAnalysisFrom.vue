<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
    </div>
    <div>
      <a-row>
        <a-col :span="24">
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
        <a-col :span="24">
          <div class="chart-wrapper">
            <h3 class="chart-title">{{ record.customerName }}销售额分析表</h3>
            <v-chart :forceFit="true" :height="chartHeight" :data="chartData1" :scale="scale1">
              <v-tooltip />
              <v-axis />
              <v-line position="date*销售额(万元)" />
              <v-point position="date*销售额(万元)" shape="circle" />
            </v-chart>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="chart-wrapper">
            <h3 class="chart-title">销售类别排行</h3>
            <v-chart :forceFit="true" :height="chartHeight1" :data="chartData" :scale="scale">
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
              <v-coord type="theta" />
            </v-chart>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="chart-wrapper">
            <h3 class="chart-title">产品占比</h3>
            <v-chart :forceFit="true" :height="chartHeight1" :data="chartData2" :scale="scale">
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
              <v-coord type="theta" />
            </v-chart>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
  <!-- </a-modal> -->
</template>

<script>
import { SalesAnalysis, listCustomerCategory, listCustomerProduct } from '@/api/saleReport'
const DataSet = require('@antv/data-set')
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '日期',
    dataIndex: 'date',
    align: 'center',
  },
  {
    title: '订单数(个)',
    dataIndex: 'orders',
    align: 'center',
  },
  {
    title: '产品数量(台)',
    dataIndex: 'productCount',
    align: 'center',
  },
  {
    title: '销售额(万元)',
    dataIndex: 'saleQuota',
    align: 'center',
  },
]
export default {
  name: 'ReceiptSaleContract', // 所有的软件合同

  data() {
    return {
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1,
      },
      labelConfig: [
        'percent',
        {
          formatter: (val, item) => {
            return item.point.item + ': ' + val
          },
        },
      ],
      sourceData: [
        { item: '事例一', count: 40 },
        { item: '事例二', count: 21 },
        { item: '事例三', count: 17 },
        { item: '事例四', count: 13 },
        { item: '事例五', count: 9 },
      ],
      scale: [
        {
          dataKey: 'percent',
          min: 0,
          formatter: '.0%',
        },
      ],
      scale1: [
        {
          dataKey: '销售额(万元)',
          min: 0,
        },
        {
          dataKey: 'date',
          min: 0,
          max: 1,
        },
      ],
      columns,
      visible: false,
      chartHeight: 400,
      chartHeight1: 300,
      confirmLoading: false,
      dataSource: [],
      dataSource1: [],
      dataSource2: [],
      record: {},
      searchParam: {},
      loading: false,
      pagination: {
        current: 1,
      },
    }
  },
  computed: {
    modalTitle() {
      return `${this.record.customerName}销售额分析汇总`
    },
    chartData1() {
      return this.dataSource.map((item) => {
        return {
          date: item.date,
          '销售额(万元)': item.saleQuota,
        }
      })
    },
    chartData() {
      let source = this.dataSource1.map((item) => {
        return {
          item: item.text,
          count: item.num,
        }
      })
      const dv = new DataSet.View().source(source)
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent',
      })
      return dv.rows
    },
    chartData2() {
      let source = this.dataSource2.map((item) => {
        return {
          item: item.text,
          count: item.num,
        }
      })
      const dv = new DataSet.View().source(source)
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent',
      })
      return dv.rows
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'CustomerSalesAnalysisFrom') {
          if (this.$route.params.record.customerId !== undefined) {
            this.init()
          } else {
            this.goBack()
          }
        }
      },
      immediate: true,
    },
  },

  methods: {
    componentDidUpdate() {
      setTimeout(() => {
        const e = document.createEvent('Event')
        e.initEvent('resize', true, true)
        window.dispatchEvent(e)
      }, 10)
    },
    init() {
      let that = this
      this.record = this.$route.params.record
      this.searchParam = this.$route.params.searchParam
      this.searchAction()
      let _searchParam = Object.assign({}, { customerId: this.record.customerId, type: 1 }, { ...this.searchParam })
      listCustomerCategory(_searchParam).then((res) => {
        this.dataSource1 = res.data
      })
      listCustomerProduct(_searchParam).then((res) => {
        this.dataSource2 = res.data
      })

      this.componentDidUpdate()
    },
    goBack() {
      this.$router.push({ name: 'CustomerSalesAnalysis' })
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign(
        {},
        { customerId: this.record.customerId, type: 1 },
        // { ...that.searchParam },
        // { ...that.pagination },
        opt || {}
      )
      that.loading = true
      that.dataSource = []
      that.dataSource1 = []
      SalesAnalysis(_searchParam)
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
    handleCancel() {
      this.searchParam = {}
      this.dataSource = []
      this.visible = false
    },
    handleOk() {
      this.visible = false
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
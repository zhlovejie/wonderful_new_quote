<template>
  <a-card :bordered="false">
    <a-row>
      <a-col :span="24">
        <a-form layout="inline">
          <a-form-item>
            <a-select style="width: 200px" :allowClear="true" v-model="saleUserId" placeholder="请选择销售人员">
              <a-select-option v-for="sale in sales" :key="sale.index" :value="sale.userId">{{
                sale.salesmanName
              }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input v-model="trainName" placeholder="客户名称" style="width: 200px" :allowClear="true" />
          </a-form-item>
          <a-form-item>
            <a-date-picker
              style="width: 280px; margin-right: 10px"
              mode="year"
              placeholder="年份"
              format="YYYY"
              v-model="yearPick"
              :open="yearPickShow"
              @panelChange="handlePanelChange"
              @openChange="handleOpenChange"
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
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="orders" slot-scope="text, record">
            <template v-if="record.roExponent !== null">
              <span>{{ text }}</span>
            </template>
            <template v-else>
              <span style="color: red">{{ text }}</span>
            </template>
          </div>
          <div slot="saleQuota" slot-scope="text, record">
            <template v-if="record.rsqExponent !== null">
              <span>{{ text }}</span>
            </template>
            <template v-else>
              <span style="color: red">{{ text }}</span>
            </template>
          </div>
          <div slot="avgSaleQuota" slot-scope="text, record">
            <template v-if="record.rasqExponent !== null">
              <span>{{ text }}</span>
            </template>
            <template v-else>
              <span style="color: red">{{ text }}</span>
            </template>
          </div>
          <div slot="exponent" slot-scope="text, record">
            <template v-if="record.rasqExponent !== null && record.rsqExponent !== null && record.roExponent !== null">
              <span>{{ text }}</span>
            </template>
            <template v-else>
              <span style="color: red">{{ text }}</span>
            </template>
          </div>
        </a-table>
      </a-col>
      <a-col :span="24">
        <div class="chart-wrapper">
          <h3 class="chart-title">活跃度指数表</h3>
          <v-chart :forceFit="true" :height="chartHeight" :data="chartData1" :scale="scale1">
            <v-tooltip />
            <v-axis />
            <v-bar position="date*活跃度指数" />
          </v-chart>
        </div>
      </a-col>

      <a-col :span="24">
        <div class="chart-wrapper">
          <h3 class="chart-title">销售额排行</h3>
          <!-- <v-chart :forceFit="true" :height="chartHeight" :data="chartData" :scale="scale">
            <v-tooltip />
            <v-axis />
            <v-line position="year*销售额(万元)" />
            <v-point position="year*销售额(万元)" shape="circle" />
          </v-chart> -->
          <v-chart :force-fit="true" :height="chartHeight" :data="chartData" :scale="scale">
            <v-tooltip />
            <v-axis />
            <v-legend />
            <v-line position="year*temperature" color="city" />
            <v-point position="year*temperature" color="city" :size="4" :v-style="style" :shape="'circle'" />
          </v-chart>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { listExponent, downCustomerExponent } from '@/api/saleReport'
import { getAllContractSalesman } from '@api/order'
const DataSet = require('@antv/data-set')
import moment from 'moment'
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '年份',
    dataIndex: 'date',
    align: 'center',
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
    align: 'center',
  },
  {
    title: '订单数',
    dataIndex: 'orders',
    align: 'center',
    scopedSlots: { customRender: 'orders' },
  },
  {
    title: '销售额(万元)',
    dataIndex: 'saleQuota',
    align: 'center',
    scopedSlots: { customRender: 'saleQuota' },
  },
  {
    title: '当年平均销售额(万元)',
    dataIndex: 'avgSaleQuota',
    align: 'center',
    scopedSlots: { customRender: 'avgSaleQuota' },
  },
  {
    title: '活跃度指数',
    dataIndex: 'exponent',
    align: 'center',
    scopedSlots: { customRender: 'exponent' },
  },
]
export default {
  name: 'PersonnelPerformanceReport',
  data() {
    return {
      pageTitle: '客户活跃分析表',
      columns: columns,
      sDate: [undefined, undefined],
      dataSource: [],
      sales: [],
      yearPick: null, //年选择器的值
      yearPickShow: false, //年选择器的显示隐藏
      trainName: undefined,
      saleUserId: undefined,
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      chartHeight: 600,
      padding: [20, 20, 50, 140],
      style: { stroke: '#fff', lineWidth: 1 },
      scale1: [
        {
          dataKey: '活跃度指数',
          tickInterval: 20,
        },
      ],
      scale: [
        {
          dataKey: 'year',
          min: 0,
          max: 1,
        },
      ],
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'CustomerActivityAnalysis') {
          this.init()
          getAllContractSalesman().then((res) => {
            this.sales = res.data
          })
        }
      },
      immediate: true,
    },
  },
  computed: {
    chartData1() {
      return this.dataSource.map((item) => {
        return {
          date: item.customerName,
          活跃度指数: item.exponent,
        }
      })
    },
    chartData() {
      let sourceData = this.dataSource.map((item) => {
        return {
          year: item.customerName,
          '销售额(万元)': item.saleQuota,
          '平均销售额(万元)': item.avgSaleQuota,
        }
      })
      const dv = new DataSet.View().source(sourceData)
      dv.transform({
        type: 'fold',
        fields: ['销售额(万元)', '平均销售额(万元)'],
        key: 'city',
        value: 'temperature',
      })
      return dv.rows
    },
    searchParam() {
      let year = undefined

      if (this.yearPick) {
        year = moment(this.yearPick).format('YYYY')
      }
      return {
        year,
        saleUserId: this.saleUserId,
        customerName: this.trainName,
      }
    },
  },
  methods: {
    moment: moment,
    init() {
      this.searchAction({ current: 1 })
    },
    // 得到年份选择器的值
    handlePanelChange(value) {
      this.yearPick = value
      this.yearPickShow = false
    },
    handleOpenChange(status) {
      this.yearPickShow = status
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt || {})
      that.loading = true
      listExponent(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
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
    actionHandler(type) {
      if (type === 'search') {
        this.searchAction({ current: 1 })
      } else if (type === 'download') {
        this.downloadAction()
      }
    },
    downloadAction() {
      let that = this
      downCustomerExponent(this.searchParam)
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
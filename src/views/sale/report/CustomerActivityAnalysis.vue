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
          <v-chart :forceFit="true" :height="chartHeight" :data="chartData1" :scale="scale">
            <v-tooltip />
            <v-axis />
            <v-bar position="date*活跃度指数" />
          </v-chart>
        </div>
      </a-col>

      <a-col :span="24">
        <div class="chart-wrapper">
          <h3 class="chart-title">销售额排行</h3>
          <v-chart :forceFit="true" :height="chartHeight" :data="chartData1" :scale="scale">
            <v-tooltip />
            <v-axis />
            <v-bar position="date*活跃度指数" />
          </v-chart>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { listExponent, downCustomerExponent } from '@/api/saleReport'
import { getAllContractSalesman } from '@api/order'
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
      pageTitle: '人员业绩分析',
      columns: columns,
      sDate: [undefined, undefined],
      dataSource: [],
      sales: [],
      trainName: undefined,
      saleUserId: undefined,
      pagination: {
        current: 1,
      },
      loading: false,
      chartHeight: 600,
      padding: [20, 20, 50, 140],
      scale1: [
        {
          dataKey: '活跃度指数',
          tickInterval: 20,
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
    searchParam() {
      let startDate = undefined,
        endDate = undefined
      let isThisYear = 1

      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        isThisYear = undefined
        startDate = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endDate = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      } else {
        isThisYear = 1
      }
      return {
        startDate,
        endDate,
        isThisYear,
        saleUserId: this.saleUserId,
        customerName: this.trainName,
      }
    },
  },
  methods: {
    moment: moment,
    init() {
      this.searchParam.isThisYear = 1
      this.searchAction({ current: 1 })
    },

    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...that.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      listExponent(_searchParam)
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
    actionHandler(type) {
      if (type === 'search') {
        this.searchAction()
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
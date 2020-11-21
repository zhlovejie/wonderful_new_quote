<template>
  <a-card :bordered="false" class="_sales_top_wrapper">
    <a-row>
      <a-col :xl="10"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
        <a-form layout="inline">
          <a-form-item>
            <a-button-group>
              <a-button type="primary" :class="{ currentDayWeekMonth: rangeType === 1 }" @click="simpleSearch(1)"
                >今天</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: rangeType === 2 }" @click="simpleSearch(2)"
                >本周</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: rangeType === 3 }" @click="simpleSearch(3)"
                >本月</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: rangeType === 4 }" @click="simpleSearch(4)"
                >本季度</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: rangeType === 5 }" @click="simpleSearch(5)"
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
        >
          <div slot="money" slot-scope="text, record">
            <span>{{ record.money | moneyFormatNumber }}</span>
          </div>
          <div slot="percentage" slot-scope="text, record">
            <span>{{ text || 0 }}%</span>
          </div>
        </a-table>
      </a-col>
      <a-col :xl="14"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
        <div class="chart-wrapper">
          <h3 class="chart-title">人员销售额排行榜</h3>
          <template v-if="chartData && chartData.length > 0">
            <div>
              <v-chart :forceFit="true" :height="height" :data="chartData" :scale="scale">
                <v-tooltip :showTitle="false" :itemTpl="itemTpl" />
                <v-coord type="theta" :radius="0.5" />
                <v-pie
                  position="percent"
                  :color="'type'"
                  :label="label"
                  :select="false"
                  :vStyle="style"
                  :tooltip="tooltipview"
                />
                <v-view :data="viewData" :scale="scale">
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.5 / 0.75" />
                  <v-pie
                    position="percent"
                    :color="color"
                    label="name"
                    :select="false"
                    :vStyle="style"
                    :tooltip="tooltip"
                  />
                </v-view>
              </v-chart>
            </div>
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
import { salesTop, exportExcelDatas } from '@/api/saleReport'
import moment from 'moment'
import { Empty } from 'ant-design-vue'
const DataSet = require('@antv/data-set')
let uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '销售额(万元)',
    dataIndex: 'money',
    scopedSlots: { customRender: 'money' },
  },
  {
    title: '销售额(占比)',
    dataIndex: 'percentage',
    scopedSlots: { customRender: 'percentage' },
  },
]

const scale = {
  dataType: 'percent',
  formatter: '.2%',
}

const itemTpl = `<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>`

const style = {
  lineWidth: 1,
  stroke: '#fff',
}

const label = ['type', { offset: -10 }]

const tooltip = [
  'name*percent',
  (item, percent) => {
    percent = (percent * 100).toFixed(2) + '%'
    return {
      name: item,
      value: percent,
    }
  },
]

const tooltipview = [
  'type*percent',
  (item, percent) => {
    percent = (percent * 100).toFixed(2) + '%'
    return {
      name: item,
      value: percent,
    }
  },
]

const color = ['name', ['#BAE7FF', '#7FC9FE', '#71E3E3', '#ABF5F5', '#8EE0A1', '#BAF5C4']]

export default {
  name: 'DepartmentSalemanTop',
  data() {
    return {
      pageTitle: '销售额排行榜',
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
      scale,
      itemTpl,
      tooltip,
      tooltipview,
      color,
      label,
      style,

      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'DepartmentSalemanTop') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {
    baseChartData() {
      let sourceCpuData = [...this.dataSource]
      return sourceCpuData
        .filter((item) => item.forChart)
        .map((item) => {
          return {
            name: item.name,
            count: item.percentage,
            money: item.money,
            type: item.departmentName,
          }
        })
    },
    chartData() {
      let data = new DataSet.View()
        .source(this.baseChartData)
        .transform({ type: 'percent', field: 'count', dimension: 'type', as: 'percent' }).rows
      return data
    },
    viewData() {
      let data = new DataSet.View()
        .source(this.baseChartData)
        .transform({ type: 'percent', field: 'count', dimension: 'name', as: 'percent' }).rows
      return data
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
        rangeType: this.rangeType,
        depId: this.userInfo.departmentId,
      }
    },
  },
  methods: {
    moment: moment,
    init() {
      this.rangeType = 2
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {})
      //console.log('执行搜索...', _searchParam)
      that.loading = true
      salesTop(_searchParam)
        .then((res) => {
          that.loading = false
          try {
            let dataSource = []
            let totalMoney = 0,
              totalRate = 0
            if (res && res.data && res.data.depList && Array.isArray(res.data.depList)) {
              res.data.depList.map((item, index) => {
                dataSource.push({
                  key: uuid(),
                  name: item.departmentName,
                  money: item.depMoney,
                  percentage: item.percentage,
                  departmentName: item.departmentName,
                  isDepartment: true,
                  forChart: Array.isArray(item.users) && item.users.length > 0 ? false : true,
                })
                totalMoney += Number(item.depMoney) || 0
                totalRate += Number(item.percentage) || 0

                if (Array.isArray(item.users)) {
                  item.users.map((u, _idx) => {
                    dataSource.push({
                      key: uuid(),
                      name: u.userName,
                      money: u.money,
                      percentage: u.percentage,
                      departmentName: item.departmentName,
                      isDepartment: false,
                      forChart: true,
                    })
                  })
                }
              })
            }
            dataSource.push({
              key: uuid(),
              name: '合计',
              money: totalMoney,
              percentage: totalRate,
              forChart: false,
            })
            that.dataSource = dataSource
          } catch (e) {
            console.log(e)
            that.dataSource = []
          }
          //设置数据总条数
          // const pagination = { ...that.pagination }
          // pagination.total = res.data.total
          // that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    customRowFunction(record, index) {
      let that = this
      return {
        class:[
          record.isDepartment ? 'department-item' : '', //部门标记
          record.forChart ? '' : 'department-sum-item'  //合计标记
        ]
      }
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
      exportExcelDatas(4, this.searchParam)
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

._sales_top_wrapper >>> .department-sum-item{
  color: red;
  font-weight: bold;
}
</style>
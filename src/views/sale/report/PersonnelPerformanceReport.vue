<template>
  <a-card :bordered="false">
    <a-row>
      <a-col :span="10">
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
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 4 }" @click="simpleSearch(4)"
                >全部</a-button
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
          <h3 class="chart-title">人员业绩分析</h3>
          <v-chart :forceFit="true" :height="chartHeight" :data="chartData" :scale="scale" :padding="padding">
            <v-tooltip />
            <v-legend />
            <v-interval position="userName*money" :opcaity="1" />
            <v-axis dataKey="money" :label="labelFormat" :title="title" />
          </v-chart>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { pageListPersonnelPerformanceReport, exportExcelDatas } from '@/api/saleReport'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '销售人员',
    dataIndex: 'userName',
    width: '100px',
  },
  {
    title: '销售额',
    dataIndex: 'money',
    scopedSlots: { customRender: 'money' },
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
  name: 'PersonnelPerformanceReport',
  data() {
    return {
      pageTitle: '人员业绩分析',
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
          dataKey: 'money',
          alias: '销售额(RMB)',
        },
      ],

      stageTimeType: 1,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'PersonnelPerformanceReport') {
          this.stageTimeType = 1
          this.init()
        }
      },
      immediate: true,
    },
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
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      pageListPersonnelPerformanceReport(_searchParam)
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
      if (type === 4) {
        this.stageTimeType = undefined
        this.searchAction()
      } else {
        this.stageTimeType = this.stageTimeType === type ? undefined : type
        this.searchAction()
      }
      // this.stageTimeType = this.stageTimeType === type ? undefined : type
      // this.searchAction()
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
      exportExcelDatas(2, this.searchParam)
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
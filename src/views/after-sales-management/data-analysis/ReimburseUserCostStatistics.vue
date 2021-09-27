<template>
  <a-card :bordered="false">
    <a-row>
      <a-col :span="10">
        <a-form layout="inline">
          <a-form-item>
            <a-button-group>
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 3 }" @click="simpleSearch(3)"
                >上月</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 2 }" @click="simpleSearch(2)"
                >本月</a-button
              >
              <a-button type="primary" :class="{ currentDayWeekMonth: stageTimeType === 5 }" @click="simpleSearch(5)"
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
        </a-table>
      </a-col>
      <a-col :span="14">
        <div class="chart-wrapper">
          <h3 class="chart-title">报销金额(元)</h3>
          <template v-if="chartData && chartData.length > 0">
          <v-chart :forceFit="true" :height="chartHeight" :data="chartData" :scale="scale" :padding="padding">
            <v-tooltip />
            <v-axis dataKey="money" :label="labelFormat" :title="title" />
            <v-line position="userName*money" />
            <v-point position="userName*money" shape="circle" :label="labelInterval" />
          </v-chart>
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
import { Empty } from 'ant-design-vue'
import {
  reimburseUserCostStatistics,
  exportExcelDatas
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
    title: '售后人员',
    dataIndex: 'userName',
    width: '100px',
  },
  {
    title: '报销金额(元)',
    dataIndex: 'money',
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

const labelInterval = ['quantity', {
    useHtml: true,
    htmlTemplate: function htmlTemplate(text, item) {
      return '<span style="display: inline-block;width: max-content;">' + item.point.money + '元</span>';
    }
  }]
export default {
  name: 'reimburseUserCostStatistics',
  data() {
    return {
      pageTitle: '售后人员成本统计',
      columns: columns,
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      chartHeight: 600,
      padding: [50, 20, 50, 140],
      label,
      labelFormat,
      labelInterval,
      tickLine,
      title,

      scale: [
        {
          dataKey: 'userName',
          min: 0,
        },
        {
          dataKey: 'date',
          min: 0,
          max: 1,
        },
      ],

      stageTimeType: undefined,
      emptyImage:Empty.PRESENTED_IMAGE_SIMPLE,
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
      reimburseUserCostStatistics(_searchParam)
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
      this.stageTimeType = +type === 5 ? undefined : type
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

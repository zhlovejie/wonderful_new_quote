<template>
  <a-card :bordered="false">
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
  </a-card>
</template>

<script>
import {
  deviceArchivesWarrantyAnalyse,//数据分析-过保分析
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
    title: '机构',
    dataIndex: 'orgName',
    ellipsis: true,
  },
  {
    title: '小区',
    dataIndex: 'villageName',
    ellipsis: true,
  },{
    title: '设备名称',
    dataIndex: 'deviceName',
    ellipsis: true,
  },{
    title: '设备类型',
    dataIndex: 'deviceType',
    ellipsis: true,
  },{
    title: '主板号',
    dataIndex: 'mainBoardNo',
  },{
    title: '状态',
    dataIndex: 'deviceState',
    width:80
  },{
    title: '出厂日期',
    dataIndex: 'outTime',
    width:120
  },{
    title: 'SIM服务期限',
    dataIndex: 'cardServicePeriod',
    width:120
  },{
    title: '设备位置',
    dataIndex: 'deviceLocation',
    ellipsis: true,
  },{
    title: '过保日期',
    dataIndex: 'deviceWarrantyPeriod',
    width:120
  },
]

export default {
  name: 'DeviceArchivesWarrantyAnalyse',
  data() {
    return {
      pageTitle: '过保分析',
      columns: columns,
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      stageTimeType: 0,
    }
  },
  computed: {
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
      deviceArchivesWarrantyAnalyse(_searchParam)
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


<template>
  <!-- 我的任务单 -->
  <div class="record-new-list-wrapper">
    <div class="search-wrapper">
      <a-input
        placeholder="设备名称/设备编号模糊查询"
        v-model="queryParam.devNumOrName"
        allowClear
        style="width: 170px; margin-right: 10px"
      />
      <a-select
        placeholder="保养类型"
        v-model="queryParam.careType"
        :allowClear="true"
        style="width: 170px; margin-right: 10px"
      >
        <a-select-option :value="1">周</a-select-option>
        <a-select-option :value="2">月</a-select-option>
        <a-select-option :value="3">年</a-select-option>
      </a-select>
      <a-select
        placeholder="状态"
        v-model="queryParam.checkFlag"
        :allowClear="true"
        style="width: 170px; margin-right: 10px"
      >
        <a-select-option :value="0">待保养</a-select-option>
        <a-select-option :value="1">待验收</a-select-option>
        <a-select-option :value="2">已验收</a-select-option>
      </a-select>
      <a-input
        placeholder="保养人模糊查询"
        v-model="queryParam.careUserName"
        allowClear
        style="width: 170px; margin-right: 10px"
      />

      <a-input
        placeholder="验收负责人模糊查询"
        v-model="queryParam.checkUserName"
        allowClear
        style="width: 170px; margin-right: 10px"
      />
      <!-- <a-range-picker v-model="sDate" style="margin-right: 10px" /> -->
      <a-date-picker style="width: 170px; margin-right: 10px" placeholder="开始日期" v-model="startDate" />
      <a-date-picker style="width: 170px; margin-right: 10px" placeholder="结束日期" v-model="staticsDate" />

      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
        <template>
          <a-tab-pane key="1">
            <span slot="tab"> 本周 ( {{ Totalmessages.weekCount || 0 }} ) </span>
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab"> 全部 ( {{ Totalmessages.count || 0 }} ) </span>
          </a-tab-pane>
        </template>
      </a-tabs>
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
        <div slot="checkFlag" slot-scope="text, record">
          <a>{{ getStateText(text) }}</a>
        </div>
        <div slot="careType" slot-scope="text, record, index">
          <span>{{ record.careType === 1 ? '周 ' : record.careType === 2 ? '年' : '月' }}</span>
        </div>
        <div slot="action" slot-scope="text, record">
          <template v-if="$auth('equipmMaintenanceList:view')">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
          <template v-if="record.checkFlag == 0 && $auth('equipmMaintenanceList:handle')">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('handle', record)">处理</a>
          </template>
          <template v-if="record.checkFlag == 1 && $auth('equipmMaintenanceList:acceptance')">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('acceptance', record)">验收</a>
          </template>
        </div>
      </a-table>
    </div>
    <Appadd ref="appadd" @finish="searchAction" />
  </div>
</template>
<script>
import { pageDevelopmentCraftDevCareLog, listDevelopmentCraftDevCareLogCount } from '@/api/ProcessManagement'

import moment from 'moment'
import Appadd from './module/Appadd'
// import StatusRecord from './module/statusRecord'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '保养时间',
    dataIndex: 'careTime',
  },
  {
    align: 'center',
    title: '保养类型',
    dataIndex: 'careType',
    scopedSlots: { customRender: 'careType' },
  },
  // {
  //   align: 'center',
  //   title: '保养类型',
  //   dataIndex: 'sourceNum',
  // },
  {
    align: 'center',
    title: '设备编号',
    dataIndex: 'devNum',
  },
  {
    align: 'center',
    title: '设备名称',
    dataIndex: 'devName',
  },
  {
    align: 'center',
    title: '保养人',
    dataIndex: 'careUserName',
  },
  {
    align: 'center',
    title: '实际保养时间',
    dataIndex: 'careCreatedTime',
  },
  {
    align: 'center',
    title: '验收负责人',
    dataIndex: 'checkUserName',
  },
  {
    align: 'center',
    title: '验收时间',
    dataIndex: 'checkTime',
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'checkFlag',
    scopedSlots: { customRender: 'checkFlag' },
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'researchtaskmytasklist',
  components: {
    Appadd,
    // StatusRecord,
  },
  data() {
    return {
      tasks: 0,
      startDate: undefined,
      staticsDate: undefined,
      activeKey: 1,
      Totalmessages: {},
      queryParam: { current: 1 },
      personincharge: [],
      projectList: [],
      columns: columns,
      dataSource: [],
      pagination1: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      loading: false,
    }
  },
  computed: {
    searchParam() {
      return {
        beginTime: this.startDate instanceof moment ? this.startDate.format('YYYY-MM-DD') : undefined,
        endTime: this.staticsDate instanceof moment ? this.staticsDate.format('YYYY-MM-DD') : undefined,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'product-process-management_equipment-management_maintenance') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      // let queue = []
      // let task1 = task_performancegetSalerIds().then((res) => (that.personincharge = res.data))
      // queue.push(task1)
      that.searchAction()
      // return Promise.all(queue)
    },

    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign(
        {},
        { ...this.searchParam },
        { ...this.pagination1 },
        { ...this.queryParam },
        { periodType: this.activeKey },
        opt || {}
      )
      console.log('执行搜索...', _searchParam)
      that.loading = true
      pageDevelopmentCraftDevCareLog(_searchParam)
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
      listDevelopmentCraftDevCareLogCount().then((res) => {
        this.Totalmessages = res.data
      })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      let that = this
      that.pagination1.size = pagination.pageSize
      that.pagination1.current = pagination.current
      that.searchAction()
    },

    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      // if (this.activeKey !== 0) {
      //   this.approval_status = undefined
      // }
      // if (this.activeKey !== 0) {
      //   this.searchAction({ current: 1, status: this.activeKey })
      // } else {
      this.searchAction({ current: 1 })
      // }
    },
    doAction(type, record) {
      this.$refs.appadd.query(type, record)
    },

    getStateText(state) {
      let stateMap = {
        0: '待保养',
        1: '待验收',
        2: '已验收',
      }
      return stateMap[state] || `未知状态:${state}`
    },

    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style scoped>
.record-new-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>

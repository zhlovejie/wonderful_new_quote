<template>
  <!-- 任务绩效 -->
  <div class="record-new-list-wrapper">
    <div class="search-wrapper">
      <a-input
        placeholder="任务编号"
        v-model="queryParam.taskNum"
        allowClear
        style="width: 170px; margin-right: 10px"
      />
      <a-select
        placeholder="来源"
        v-model="queryParam.taskSource"
        :allowClear="true"
        style="width: 170px; margin-right: 10px"
      >
        <a-select-option :value="1">销售订单</a-select-option>
        <a-select-option :value="2">核价单</a-select-option>
      </a-select>
      <a-input
        placeholder="单据编号"
        v-model="queryParam.sourceNum"
        allowClear
        style="width: 170px; margin-right: 10px"
      />
      <a-select
        placeholder="销售负责人"
        showSearch
        :filterOption="filterOption"
        v-model="queryParam.salerId"
        :allowClear="true"
        style="width: 170px; margin-right: 10px"
      >
        <a-select-option v-for="item in personincharge" :key="item.id" :value="item.id">{{
          item.trueName
        }}</a-select-option>
      </a-select>

      <a-input
        placeholder="产品名称"
        v-model="queryParam.productName"
        allowClear
        style="width: 170px; margin-right: 10px"
      />
      <!-- <a-range-picker v-model="sDate" style="margin-right: 10px" /> -->
      <a-month-picker style="width: 170px; margin-right: 10px" placeholder="开始月份" v-model="startDate" />
      <a-month-picker style="width: 170px; margin-right: 10px" placeholder="结束月份" v-model="staticsDate" />

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
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <!-- <a-tab-pane tab="全部" key="0" /> -->
        <template>
          <a-tab-pane key="2">
            <span slot="tab"> 待认领 ( {{ Totalmessages.claimCount || 0 }} ) </span>
          </a-tab-pane>
          <a-tab-pane key="3">
            <span slot="tab"> 进行中 ( {{ Totalmessages.ongoingCount || 0 }} ) </span>
          </a-tab-pane>
          <a-tab-pane key="4">
            <span slot="tab"> 暂停 ( {{ Totalmessages.stopCount || 0 }} ) </span>
          </a-tab-pane>
          <a-tab-pane key="5">
            <span slot="tab"> 已完结 ( {{ Totalmessages.endCount || 0 }} ) </span>
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
        <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div slot="taskSource" slot-scope="text, record, index">
          <span>{{ text === 1 ? '销售订单' : '核价单' }}</span>
        </div>
        <div slot="action" slot-scope="text, record">
          <template v-if="activeKey === 2">
            <template>
              <a type="primary" @click="doAction('Dispatch', record)">认领</a>
            </template>
          </template>
          <template v-if="activeKey === 3">
            <template>
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
            <template>
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('suspend', record)">暂停</a>
            </template>
            <template>
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('giveUp', record)">放弃</a>
            </template>
            <template>
              <a-divider type="vertical" />
              <a type="primary" @click="showConfirm(record)">完结</a>
            </template>
          </template>
          <template v-if="activeKey === 4">
            <template>
              <a type="primary" @click="startup(record)">启动</a>
            </template>
            <template>
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('giveUp', record)">放弃</a>
            </template>
          </template>
          <template v-if="activeKey === 5">
            <template>
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
          </template>
        </div>
      </a-table>
    </div>
    <Appadd ref="appadd" @finish="searchAction" />
    <StatusRecord ref="statusRecord" />
  </div>
</template>
<script>
import {
  task_TaskInfoPage,
  task_performancegetSalerIds,
  task_countDevelopmentByStatus,
  task_listEndHis,
  task_listStartHis,
} from '@/api/researchManagement'
import moment from 'moment'
import Appadd from './module/Appadd'
import StatusRecord from './module/statusRecord'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '任务编号',
    dataIndex: 'taskNum',
  },
  {
    align: 'center',
    title: '来源',
    scopedSlots: { customRender: 'taskSource' },
  },
  {
    align: 'center',
    title: '单据编号',
    dataIndex: 'sourceNum',
  },
  {
    align: 'center',
    title: '销售负责人',
    dataIndex: 'salerName',
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
  },
  {
    align: 'center',
    title: '项目负责人',
    dataIndex: 'chargeName',
  },
  {
    align: 'center',
    title: '计划完成时间',
    dataIndex: 'explainFinishTime',
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交日期',
    dataIndex: 'createdTime',
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
    StatusRecord,
  },
  data() {
    return {
      tasks: 0,
      startDate: undefined,
      staticsDate: undefined,
      activeKey: 2,
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
        beginTime: this.startDate instanceof moment ? this.startDate.format('YYYY-MM') : undefined,
        endTime: this.staticsDate instanceof moment ? this.staticsDate.format('YYYY-MM') : undefined,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'research-task-my-task-list') {
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
      let queue = []
      let task1 = task_performancegetSalerIds().then((res) => (that.personincharge = res.data))
      queue.push(task1)
      this.searchAction()
      return Promise.all(queue)
    },

    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign(
        {},
        { ...this.searchParam },
        { ...this.pagination1 },
        { ...this.queryParam },
        { chargeId: that.userInfo.id, status: this.activeKey },
        opt || {}
      )
      console.log('执行搜索...', _searchParam)
      that.loading = true
      task_TaskInfoPage(_searchParam)
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
      task_countDevelopmentByStatus({ chargeId: that.userInfo.id }).then((res) => {
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
    //启动
    startup(record) {
      let that = this
      that.$success({
        okText: '确认',
        title: `确认完结此任务单${record.taskNum}吗`,
        content: '请确定相关数据已上传，保证数据无误方可完结此任务单。',
        onOk() {
          let values = {
            developmentTaskExcuteHis: {
              taskId: record.id,
              operationType: 4,
            },
          }
          task_listStartHis(values).then((res) => {
            that.searchAction()
            that.$message.info(res.msg)
          })
        },
      })
    },

    //完结
    showConfirm(record) {
      let that = this
      that.$success({
        okText: '确认',
        title: `确认完结此任务单${record.taskNum}吗`,
        content: '请确定相关数据已上传，保证数据无误方可完结此任务单。',
        onOk() {
          let values = {
            developmentTaskExcuteHis: {
              taskId: record.id,
              operationType: 4,
            },
          }
          task_listEndHis(values)
            .then((res) => {
              that.searchAction()
              that.$message.info(res.msg)
            })
            .catch((err) => (that.spinning = false))
        },
      })
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
    //派工
    approvalPreview(record) {
      this.$refs.statusRecord.init(record.id)
    },
    getStateText(state) {
      let stateMap = {
        1: '待派工',
        2: '待认领',
        3: '进行中',
        4: '暂停',
        5: '已完结',
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

<template>
  <!-- 任务单审核-->
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
      <a-select
        placeholder="状态"
        v-if="activeKey === 0"
        v-model="queryParam.operationStatus"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">审批通过</a-select-option>
        <a-select-option :value="3">审批不通过</a-select-option>
        <a-select-option :value="4">驳回</a-select-option>
      </a-select>

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
        <a-tab-pane tab="全部" key="0" />
        <template>
          <a-tab-pane tab="待审批" key="1" />
          <a-tab-pane tab="已审批" key="2" />
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
        <div slot="operationStatus" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div slot="operationType" slot-scope="text, record">
          <span>{{ getStateType(text) }}</span>
        </div>
        <div slot="taskSource" slot-scope="text, record, index">
          <span>{{ text === 1 ? '销售订单' : '核价单' }}</span>
        </div>
        <div slot="action" slot-scope="text, record">
          <template v-if="activeKey === 0 || activeKey === 2">
            <template>
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
          </template>
          <template v-if="activeKey === 1">
            <template>
              <a type="primary" @click="doAction('approval', record)">审批</a>
            </template>
          </template>
        </div>
      </a-table>
    </div>
    <Appadd ref="appadd" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import { task_hislistTaskExcuteHis, task_performancegetSalerIds } from '@/api/researchManagement'
import moment from 'moment'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import Appadd from './module/Appadd'
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
    title: '操作类型',
    dataIndex: 'operationType',
    scopedSlots: { customRender: 'operationType' },
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'operationStatus',
    scopedSlots: { customRender: 'operationStatus' },
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
    ApproveInfo,
  },
  data() {
    return {
      tasks: 0,
      startDate: undefined,
      staticsDate: undefined,
      activeKey: 0,
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
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'research-task-list-approval') {
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
        { ...this.pagination1 },
        { ...this.queryParam },
        { searchStatus: this.activeKey },
        opt || {}
      )
      // chargeId: that.userInfo.id,
      console.log('执行搜索...', _searchParam)
      that.loading = true
      task_hislistTaskExcuteHis(_searchParam)
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
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchAction({ current: 1 })
    },
    doAction(type, record) {
      if (type === 'view' && record.operationType === 2) {
        this.$refs.appadd.query('viewsuspend', record)
        return
      }
      if (type === 'approval' && record.operationType === 2) {
        this.$refs.appadd.query('approvalsuspend', record)
        return
      }
      if (type === 'view' && record.operationType === 5) {
        this.$refs.appadd.query('viewgiveUp', record)
        return
      }
      if (type === 'approval' && record.operationType === 5) {
        this.$refs.appadd.query('approvalgiveUp', record)
        return
      }
    },
    //审批流组件
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

    getStateType(state) {
      let stateMap = {
        0: '派工',
        1: '认领',
        2: '暂停',
        3: '启动',
        4: '完结',
        5: '放弃',
        6: '驳回',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '通过',
        3: '不通过',
        4: '驳回',
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

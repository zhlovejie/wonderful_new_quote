<template>
  <!-- 试用期调查表 -->
  <div class="probation-survey-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="员工名称模糊查询" v-model="person_name" allowClear style="width: 200px" />
      <a-select placeholder="选择部门" v-model="dep_id" :allowClear="true" style="width: 200px">
        <a-select-option v-for="item in depSelectDataSource" :key="item.id" :value="item.id">
          {{ item.departmentName }}
        </a-select-option>
      </a-select>
      <a-select
        v-if="activeKey === 0"
        placeholder="处理状态"
        :allowClear="true"
        v-model="approval_status"
        style="width: 120px"
      >
        <a-select-option :value="0">待提交</a-select-option>
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">通过</a-select-option>
        <a-select-option :value="3">不通过</a-select-option>
        <a-select-option :value="4">已撤回</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('probationSurvey:approval')">
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
        <div slot="state" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div slot="evaluation" slot-scope="text, record, index">
          <template v-if="record.evaluation !== 0">
            <a @click="evaluationPreview(record)">{{ getEvaluationText(text) }}</a>
          </template>
          <template v-else>{{ getEvaluationText(text) }}</template>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="activeKey === 0">
            <template v-if="$auth('probationSurvey:money-one') && record.state !== 0">
              <a type="primary" @click="doAction('approval_view', record)">查看</a>
            </template>
            <template v-else>
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>

            <template
              v-if="$auth('probationSurvey:Withdraw') && record.state === 1 && record.createdId === userInfo.id"
            >
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => confirmWithdraw(record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>

            <template
              v-if="
                $auth('probationSurvey:edit') &&
                (record.state === 3 || record.state === 0 || record.state === 4) &&
                record.showModifyButtonFlag === 1
              "
            >
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit', record)">{{ record.state === 3 ? '重新处理' : '处理' }}</a>
            </template>
          </template>
          <template v-if="activeKey === 1">
            <a type="primary" @click="doAction('approval_view', record)">查看</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval_approval', record)">审批</a>
          </template>
          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('approval_view', record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>

    <SurveyForm ref="surveyForm" @finish="searchAction()" />
    <SurveyFormApproval ref="surveyFormApproval" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
    <EvaluationView ref="evaluationView" />
  </div>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import { getProbationSurveyList, getProbationCancel } from '@/api/personnelManagement'
import SurveyForm from './module/SurveyForm'
import SurveyFormApproval from './module/SurveyFormApproval'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import EvaluationView from './module/EvaluationView'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '编号',
    dataIndex: 'probationCode',
    key: 'probationCode',
  },
  {
    align: 'center',
    title: '员工名',
    dataIndex: 'userName',
    key: 'userName',
    scopedSlots: { customRender: 'userName' },
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
    scopedSlots: { customRender: 'departmentName' },
  },
  {
    align: 'center',
    title: '岗位',
    key: 'stationName',
    dataIndex: 'stationName',
    scopedSlots: { customRender: 'stationName' },
  },
  {
    align: 'center',
    title: '入职日期',
    key: 'entryDate',
    dataIndex: 'entryDate',
    scopedSlots: { customRender: 'entryDate' },
  },
  {
    align: 'center',
    title: '处理状态',
    key: 'state',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
  },
  {
    align: 'center',
    title: '试用期考评',
    key: 'evaluation',
    dataIndex: 'evaluation',
    scopedSlots: { customRender: 'evaluation' },
  },
  {
    align: 'center',
    title: '申请人',
    dataIndex: 'createdName',
    key: 'createdName',
    scopedSlots: { customRender: 'createdName' },
  },
  {
    align: 'center',
    title: '申请时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
    scopedSlots: { customRender: 'createdTime' },
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'ProbationSurveyList',
  components: {
    SurveyForm: SurveyForm,
    SurveyFormApproval: SurveyFormApproval,
    ApproveInfo: ApproveInfo,
    EvaluationView: EvaluationView,
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      activeKey: 0,
      dep_id: undefined,
      person_name: undefined,
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      pagination1: { current: 1 },
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
        departmentId: this.dep_id,
        userName: this.person_name,
        state: this.approval_status,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'probation-survey') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    confirmWithdraw(record) {
      let that = this
      getProbationCancel(`id=${record.id}`).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    init() {
      let that = this
      //depSelectDataSource
      departmentList().then((res) => {
        that.depSelectDataSource = res.data
      })

      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination1 }, opt || {}, {
        approveStatus: that.activeKey,
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getProbationSurveyList(_searchParam)
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
    doAction(type, record) {
      console.log(type)
      //debugger
      if (type.startsWith('approval_')) {
        let _type = type.replace('approval_', '')
        this.$refs.surveyFormApproval.query(_type, record)
      } else {
        this.$refs.surveyForm.query(type, record)
      }
      //this.$message.info('功能尚未实现...')
    },
    getStateText(state) {
      let stateMap = {
        0: '待提交',
        1: '待审批',
        2: '通过',
        3: '不通过',
        4: '已撤回',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    getEvaluationText(evaluation) {
      let evaluationMap = {
        0: '无',
        1: '通过',
        2: '不通过',
      }
      return evaluationMap[evaluation] || `未知:${evaluation}`
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, approveStatus: this.activeKey })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    evaluationPreview(record) {
      this.$refs.evaluationView.query(record)
    },
  },
}
</script>
<style scoped>
.probation-survey-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.probation-survey-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
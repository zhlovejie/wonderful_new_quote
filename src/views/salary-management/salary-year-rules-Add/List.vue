<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-select
        style="width: 200px; margin-right: 10px"
        v-model="queryParam.departmentId"
        :allowClear="true"
        placeholder="请选择部门"
      >
        <a-select-option :value="undefined">请选择部门</a-select-option>
        <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>
      <a-input
        placeholder="员工姓名"
        v-model="queryParam.userName"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-select
        placeholder="状态"
        v-if="activeKey === 0"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">审批通过</a-select-option>
        <a-select-option :value="3">审批不通过</a-select-option>
        <a-select-option :value="4">已撤回</a-select-option>
        <a-select-option :value="5">已作废</a-select-option>
      </a-select>
      <a-select
        placeholder="薪资类型"
        v-model="queryParam.yearSalaryId"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option v-for="(item, index) in annual" :key="index" :value="item.id">{{
          item.ruleName
        }}</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <template v-if="$auth('year_Add:add')">
        <a-dropdown style="float: right">
          <a-button type="primary" @click="doAction('add', null)"> <a-icon type="plus" />新增 </a-button>
        </a-dropdown>
      </template>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('year_Add:approve')">
          <a-tab-pane tab="待我审批" key="1" />
          <a-tab-pane tab="我已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        v-if="$auth('year_Add:lists')"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="salaryType" slot-scope="text, record, index">
          <span>{{ text === 0 ? '周薪制薪资' : '年薪制薪资' }}</span>
        </div>

        <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="activeKey === 0">
            <template v-if="$auth('year_Add:view')">
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
            <template v-if="record.status === 2">
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定作废" ok-text="确定" cancel-text="取消" @confirm="confirmwaste(record)">
                <a type="primary">作废</a>
              </a-popconfirm>
            </template>
            <template v-if="record.status === 1 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <template v-if="$auth('year_Add:Withdraw')">
                <a-popconfirm title="是否确定撤回" ok-text="确定" cancel-text="取消" @confirm="confirmWithdraw(record)">
                  <a type="primary">撤回</a>
                </a-popconfirm>
              </template>
            </template>
            <template
              v-if="
                $auth('year_Add:edit-salary') &&
                (record.status === 3 || record.status === 4) &&
                +record.createdId === +userInfo.id
              "
            >
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit-salary', record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(record)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 1 && record.status === 1">
            <a type="primary" @click="doAction('edit', record)">审核</a>
          </template>

          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import { getDevisionList } from '@/api/systemSetting'
import { annual_ruleList } from '@/api/humanResources'
import {
  floorsAnnual_page,
  floorsAnnual_revocation,
  floorsAnnual_delete,
  floorsAnnual_cancel,
} from '@/api/bonus_management'
import AddForm from './AddForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import moment from 'moment'
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
    title: '部门',
    key: 'departmentName',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '岗位',
    key: 'stationName',
    dataIndex: 'stationName',
  },
  {
    align: 'center',
    title: '姓名',
    key: 'userName',
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '薪资类型',
    key: 'salaryType',
    dataIndex: 'salaryType',
    scopedSlots: { customRender: 'salaryType' },
  },
  {
    align: 'center',
    title: '周期（月）',
    key: 'cycle',
    dataIndex: 'cycle',
  },

  {
    align: 'center',
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'NoticeList',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
    // Approval: Approval,
  },
  data() {
    return {
      departmentList: [], // 部门列表
      annual: [], //年薪制规则
      visible: false,
      queryParam: {},
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      status: '',
      depId: '',
      activeKey: 0,
      selectedRowKeys: [],
      selectedRows: [],
      startDate: undefined,
      staticsDate: undefined,
      departmentList: [],
      rule_List: [],
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
      whole: true,
    }
  },
  computed: {
    // searchParam() {
    //   return {
    //     startDate: this.startDate instanceof moment ? this.startDate.format('YYYY-MM') : undefined,
    //     staticsDate: this.staticsDate instanceof moment ? this.staticsDate.format('YYYY-MM') : undefined,
    //   }
    // },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'salary-year-rules-Add') {
          this.init()
          annual_ruleList().then((res) => (this.annual = res.data))
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {
      let that = this
      getDevisionList().then((res) => {
        this.departmentList = res.data
      })
      that.searchAction()
    },

    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '通过',
        3: '审核未通过',
        4: '已撤回',
        5: '已作废',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    //审批流组件
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

    // 撤回
    confirmwaste(record) {
      let that = this
      floorsAnnual_cancel({ id: record.id }).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    // 撤回
    confirmWithdraw(record) {
      let that = this
      floorsAnnual_revocation({ id: record.id }).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    // 删除
    confirmDelete(record) {
      let that = this
      floorsAnnual_delete({ id: record.id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          that.$message.error(res.msg)
        }
      })
    },
    searchAction(opt) {
      let that = this
      that.selectedRowKeys = []
      that.selectedRows = []
      let _searchParam = Object.assign(
        {},
        { ...that.queryParam },
        { ...this.searchParam },
        { ...that.pagination1 },
        opt || {},
        {
          searchStatus: that.activeKey,
        }
      )
      that.loading = true
      floorsAnnual_page(_searchParam)
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
      this.$refs.addForm.query(type, record)
      //this.$message.info('功能尚未实现...')
    },
    tabChange(tagKey) {
      this.activeKey = +tagKey
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      this.selectedRowKeys = []
      this.selectedRows = []
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>

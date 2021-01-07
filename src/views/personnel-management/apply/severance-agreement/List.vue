<template>
  <!-- 离职协议 -->
  <div class="severance-agreement-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="责任人模糊查询" v-model="user_name" allowClear style="width: 180px"></a-input>
      <a-select placeholder="单据状态" :allowClear="true" v-model="operation_status" style="width: 120px">
        <a-select-option :value="0">未完结</a-select-option>
        <a-select-option :value="1">完结</a-select-option>
      </a-select>

      <a-select
        v-if="activeKey === 0"
        placeholder="处理状态"
        :allowClear="true"
        v-model="approval_status"
        style="width: 120px"
      >
        <a-select-option :value="0">待审批</a-select-option>
        <a-select-option :value="1">通过</a-select-option>
        <a-select-option :value="2">不通过</a-select-option>
        <a-select-option :value="3">已撤回</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
      <a-button
        class="a-button"
        style="float: right"
        type="primary"
        icon="plus"
        @click="doAction('add', null)"
        v-if="$auth('severanceAgreement:add')"
        >新增</a-button
      >
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <template v-if="$auth('severanceAgreement:approval')">
          <a-tab-pane tab="待我审批" key="1" />
          <a-tab-pane tab="我已审批" key="2" />
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

        <div slot="status" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStatusText(text) }}</a>
        </div>

        <div slot="isEnd" slot-scope="text, record, index">
          <template v-if="$auth('severanceAgreement:isEnd')">
            <a @click="isEndToggle(record)">{{ parseInt(text, 10) === 0 ? '未完结' : '完结' }}</a>
          </template>
          <template v-else>
            <span>{{ parseInt(text, 10) === 0 ? '未完结' : '完结' }}</span>
          </template>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 单据审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <template
              v-if="
                $auth('severanceAgreement:edit') &&
                (record.status === 2 || record.status === 3) &&
                record.showModifyButtonFlag === 1
              "
            >
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit', record)">修改</a>
            </template>
            <template v-if="record.status === 0 && record.createdId === userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => confirmWithdraw(record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
            <template
              v-if="$auth('severanceAgreement:del') && record.status !== 0 && record.showModifyButtonFlag === 1"
            >
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 1">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>

          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="searchAction()" />
    <ViewForm ref="viewForm" @finish="searchAction()" />
  </div>
</template>
<script>
import {
  personnelLeaveOfficeAgreementPageList,
  personnelLeaveOfficeAgreementChangeIsEnd,
  personnelLeaveOfficeAgreementCancel,
  deleteLeaveOfficeAgreement,
} from '@/api/personnelManagement'
import AddForm from './module/AddForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import ViewForm from './module/ViewForm'
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
    dataIndex: 'leaveOfficeCode',
    key: 'leaveOfficeCode',
  },
  {
    align: 'center',
    title: '责任人',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    align: 'center',
    title: '处理状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '单据状态',
    key: 'isEnd',
    dataIndex: 'isEnd',
    scopedSlots: { customRender: 'isEnd' },
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName',
    key: 'createdName',
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
  name: 'SeveranceAgreement',
  components: {
    AddForm: AddForm,
    ViewForm: ViewForm,
    ApproveInfo: ApproveInfo,
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      user_name: undefined,
      operation_status: undefined,
      approval_status: undefined,
      activeKey: 0,
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
        current: 1,
        userName: this.user_name,
        isEnd: this.operation_status,
        status: this.approval_status,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'severance-agreement') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
      //部门
      //departmentList().then(res => (that.depSelectDataSource = res.data))
      //事故异常类型
      //getDictionaryList({ parentId: 477 }).then(res => (that.accidentTypeSelectDataSource = res.data))
    },
    //撤回
    confirmWithdraw(record) {
      let that = this
      personnelLeaveOfficeAgreementCancel(`id=${record.id}`).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination1 }, opt || {}, {
        approveStatus: that.activeKey,
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      personnelLeaveOfficeAgreementPageList(_searchParam)
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
      let that = this
      //debugger
      //this.$refs.addForm.query(type, record)
      if (type === 'view') {
        that.$refs.viewForm.query(type, record)
        return
      }
      if (type === 'del') {
        deleteLeaveOfficeAgreement(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      } else {
        that.$refs.addForm.query(type, record)
        return
      }
      //this.$message.info('功能尚未实现...')
    },
    getStatusText(state) {
      let stateMap = {
        0: '待审批',
        1: '通过',
        2: '不通过',
        3: '已撤回',
      }
      return stateMap[state] || `未知状态:${state}`
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
    isEndToggle(record) {
      let that = this

      personnelLeaveOfficeAgreementChangeIsEnd({ id: record.id }).then((res) => {
        that.$message.info(res.msg)
        that.searchAction()
      })
    },
  },
}
</script>
<style scoped>
.severance-agreement-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.severance-agreement-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
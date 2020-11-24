<template>
  <!-- 调岗调薪申请 -->
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-input
        placeholder="员工名称模糊查询"
        v-model="person_name"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-select
        placeholder="选择状态"
        v-model="operation_status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="0">调岗</a-select-option>
        <a-select-option :value="1">调薪</a-select-option>
        <a-select-option :value="2">调岗调薪</a-select-option>
      </a-select>
      <a-select
        v-if="activeKey === 0"
        placeholder="处理状态"
        :allowClear="true"
        v-model="approval_status"
        style="width: 120px; margin-right: 10px"
      >
        <a-select-option :value="0">待审批</a-select-option>
        <a-select-option :value="1">通过</a-select-option>
        <a-select-option :value="2">不通过</a-select-option>
        <a-select-option :value="3">已撤回</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <a-dropdown style="float: right" v-if="$auth('adjustApply:add')">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="0">调岗申请</a-menu-item>
          <a-menu-item key="1">调薪申请</a-menu-item>
          <a-menu-item key="2">调岗调薪申请</a-menu-item>
        </a-menu>
        <a-button type="primary"> 新增 <a-icon type="down" /> </a-button>
      </a-dropdown>
      <!-- <a-button class="a-button" style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button> -->
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('adjustApply:approval')">
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

        <div slot="status" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStatusText(text) }}</a>
        </div>
        <div slot="operationStatus" slot-scope="text, record, index">
          <a href="javascript:void(0)">{{ getOperationStatus(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 单据审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <template
              v-if="
                $auth('adjustApply:edit') &&
                (record.status === 2 || record.status === 3) &&
                record.showModifyButtonFlag === 1 &&
                Number(record.createdId) === userInfo.id
              "
            >
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit', record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => confirmDelete(record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
            <template v-if="record.status === 0 && Number(record.createdId) === userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => confirmWithdraw(record)">
                <a type="primary" href="javascript:;">撤回</a>
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
  </div>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import {
  getPositionApplyListByPage,
  getPositionApplyListByCancel,
  getPositionyCancel,
  getPositionAndSalaryCancel,
  getPositionAndSalaryDelete,
  getPositionyDelete,
  getPositionApplyListDelete,
} from '@/api/personnelManagement'
import AddForm from './module/AddForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
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
    dataIndex: 'applyNum',
    key: 'applyNum',
  },
  {
    align: 'center',
    title: '员工名',
    dataIndex: 'applyUserName',
    key: 'applyUserName',
  },
  {
    align: 'center',
    title: '状态',
    key: 'operationStatus',
    dataIndex: 'operationStatus',
    scopedSlots: { customRender: 'operationStatus' },
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
    title: '申请人',
    dataIndex: 'createdUserName',
    key: 'createdUserName',
  },
  {
    align: 'center',
    title: '申请时间',
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
  name: 'BecomingApplyList',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      activeKey: 0,
      operation_status: undefined,
      person_name: undefined,
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      pagination1: {},
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
        operationStatus: this.operation_status,
        applyUserName: this.person_name,
        status: this.approval_status,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'adjust-apply') {
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
    },
    //撤回

    confirmWithdraw(record) {
      let that = this
      if (record.operationStatus === 0) {
        getPositionApplyListByCancel(`id=${record.id}`).then((res) => {
          this.searchAction()
          that.$message.info(res.msg)
        })
      } else if (record.operationStatus === 1) {
        getPositionyCancel(`id=${record.id}`).then((res) => {
          this.searchAction()
          that.$message.info(res.msg)
        })
      } else {
        getPositionAndSalaryCancel(`id=${record.id}`).then((res) => {
          this.searchAction()
          that.$message.info(res.msg)
        })
      }
    },
    //删除
    confirmDelete(record) {
      let that = this
      if (record.operationStatus === 0) {
        getPositionApplyListDelete(`id=${record.id}`).then((res) => {
          this.searchAction()
          that.$message.info(res.msg)
        })
      } else if (record.operationStatus === 1) {
        getPositionyDelete(`id=${record.id}`).then((res) => {
          this.searchAction()
          that.$message.info(res.msg)
        })
      } else {
        getPositionAndSalaryDelete(`id=${record.id}`).then((res) => {
          this.searchAction()
          that.$message.info(res.msg)
        })
      }
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getPositionApplyListByPage(_searchParam)
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
      this.$refs.addForm.query(type, record)
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
    getOperationStatus(flag) {
      let flagMap = {
        0: '调岗',
        1: '调薪',
        2: '调岗调薪',
      }
      return flagMap[flag] || `未知:${flag}`
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    handleMenuClick(e) {
      console.log('click', e)
      this.$refs.addForm.query('add', {
        operationStatus: parseInt(e.key, 10),
      })
    },
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-month-picker style="width: 200px; margin-right: 10px" v-model="queryParam.month" />
      <a-select
        placeholder="审核状态"
        v-if="activeKey === 0"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">审批通过</a-select-option>
        <a-select-option :value="3">审批不通过</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction"
        >查询</a-button
      >

      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('salaryDetails:approve')">
          <a-tab-pane tab="待审批" key="1" />
          <a-tab-pane tab="已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        v-if="$auth('salaryDetails:lists')"
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
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <template v-if="$auth('salaryDetails:download') && record.status === 2">
              <a-divider type="vertical" />
              <a type="primary" @click="outPort(record)">下载</a>
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
// import { departmentList } from '@/api/systemSetting'
import { wages_List, getExportList } from '@/api/bonus_management'
import AddForm from './module/Formadd'
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
    title: '日期',
    key: 'month',
    dataIndex: 'month',
  },

  {
    align: 'center',
    title: '审核状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
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
  },
  data() {
    return {
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
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'salary-details') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {
      let that = this
      that.searchAction()
    },

    // 下载
    outPort(record) {
      getExportList({ applyId: record.id })
        .then((res) => {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          let objectUrl = URL.createObjectURL(blob)
          window.location.href = objectUrl
        })
        .catch((err) => this.$message.error('下载异常'))
    },
    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '通过',
        3: '审核未通过',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    //审批流组件
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

    // 撤回
    // confirmWithdraw(record) {
    //   let that = this
    //   senior_worker_withdraw({ id: record.id }).then((res) => {
    //     this.searchAction()
    //     that.$message.info(res.msg)
    //   })
    // },
    searchAction(opt) {
      let that = this
      if (that.queryParam.Dates) {
        let date = that.queryParam.month.format('YYYY-MM')
        that.queryParam.accountDate = date
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      wages_List(_searchParam)
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
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
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

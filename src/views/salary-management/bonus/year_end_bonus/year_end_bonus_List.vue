<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-date-picker
        style="width: 200px; margin-right: 10px"
        mode="year"
        placeholder="请选择开始年份"
        format="YYYY"
        v-model="yearPick"
        :open="yearPickShow"
        @panelChange="handlePanelChange"
        @openChange="handleOpenChange"
      />
      <a-date-picker
        style="width: 200px; margin-right: 10px"
        mode="year"
        placeholder="请选择结束年份"
        format="YYYY"
        v-model="yearPick2"
        :open="yearPickShow2"
        @panelChange="handlePanelChange2"
        @openChange="handleOpenChange2"
      />
      <a-select
        placeholder="状态"
        v-if="activeKey === 0"
        v-model="queryParam.type"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">待处理</a-select-option>
        <a-select-option :value="2">完结</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
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
        <div slot="type" slot-scope="text, record">
          <a>{{ getStateText(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 公告审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="record.type === 1">
            <a type="primary" @click="doAction('handle', record)">处理</a>
          </template>
          <template v-else>
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
import { salary_bonus_annual_page } from '@/api/bonus_management'
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
    title: '日期(年)',
    dataIndex: 'applyDate',
    key: 'applyDate',
  },
  {
    align: 'center',
    title: '批次号',
    dataIndex: 'batchCode',
    key: 'batchCode',
  },
  {
    align: 'center',
    title: '合计',
    dataIndex: 'grantAmount',
    key: 'grantAmount',
  },
  {
    align: 'center',
    title: '状态',
    key: 'type',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' },
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
    dataIndex: 'createdTime',
    key: 'createdTime',
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
      depList: [],
      queryParam: { current: 1 },
      pagination1: {},
      yearPick: null, //年选择器的值
      yearPickShow: false, //年选择器的显示隐藏
      yearPick2: null, //年选择器的值
      yearPickShow2: false, //年选择器的显示隐藏
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
        if (to.name === 'salary_year_bonus') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    // 得到年份选择器的值
    handlePanelChange(value) {
      this.yearPick = value
      this.yearPickShow = false
    },
    handleOpenChange(status) {
      this.yearPickShow = status
    },
    // 得到年份选择器的值
    handlePanelChange2(value) {
      this.yearPick2 = value
      this.yearPickShow2 = false
    },
    handleOpenChange2(status) {
      this.yearPickShow2 = status
    },
    init() {
      let that = this
      that.searchAction()
    },
    getStateText(state) {
      let stateMap = {
        1: '待处理',
        2: '完结',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    searchAction(opt) {
      let that = this
      let arr1 = that.$_.cloneDeep(this.yearPick)
      let arr2 = that.$_.cloneDeep(this.yearPick2)
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 }, opt || {}, {
        startDate: arr1 !== undefined && arr1 !== null ? moment(arr1).format('YYYY') : undefined,
        endDate: arr2 !== undefined && arr2 !== null ? moment(arr2).format('YYYY') : undefined,
      })
      that.loading = true
      salary_bonus_annual_page(_searchParam)
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

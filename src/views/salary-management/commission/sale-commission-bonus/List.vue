<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-month-picker style="width: 200px" v-model="queryParam.month" />
      <a-select
        style="width: 200px; margin-left: 10px; margin-right: 10px"
        placeholder="选择部门"
        :allowClear="true"
        v-model="queryParam.departmentId"
      >
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>
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
        <a-select-option :value="4">已撤回</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <template v-if="$auth('commissionBonus:add')">
        <a-dropdown style="float: right">
          <a-button type="primary" @click="showModal()"> <a-icon type="plus" />新增 </a-button>
        </a-dropdown>
      </template>

      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <template v-if="$auth('commissionBonus:list')">
          <a-tab-pane tab="待我审批" key="1" />
          <a-tab-pane tab="我已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        v-if="$auth('commissionBonus:lists')"
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
          <!-- 公告审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <template v-if="$auth('commissionBonus:view')">
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
            <template v-if="record.status === 2 && $auth('commissionBonus:download')">
              <a-divider type="vertical" />
              <a type="primary" @click="outPort(record)">下载</a>
            </template>
            <template
              v-if="$auth('commissionBonus:Withdraw') && record.status === 1 && +record.createdId === +userInfo.id"
            >
              <a-divider type="vertical" />

              <a-popconfirm title="是否确定撤回" ok-text="确定" cancel-text="取消" @confirm="confirmWithdraw(record)">
                <a type="primary">撤回</a>
              </a-popconfirm>
            </template>
            <template
              v-if="
                $auth('commissionBonus:edit-salary') &&
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
    <a-modal v-model="visible" title="新增销售提成奖金" @ok="handleOk">
      <a-month-picker :disabled-date="disabledDate" style="width: 300px; margin-left: 90px" v-model="Dates" />
      <a-select
        style="width: 300px; margin-top: 30px; margin-left: 90px"
        placeholder="选择部门"
        :allowClear="true"
        v-model="Sector"
      >
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>
    </a-modal>
    <AddForm ref="addForm" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
// import { departmentList } from '@/api/systemSetting'
import {
  sale_PercentageList,
  bonus_getDepartmentByType,
  sale_checkSalerPercentApply,
  sale_Withdraw,
  sale_Remove,
  getSalerPercentageExcel,
} from '@/api/bonus_management'
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
    dataIndex: 'month',
    key: 'month',
  },

  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
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
    title: '提交人',
    key: 'createdUserName',
    dataIndex: 'createdUserName',
  },
  {
    align: 'center',
    title: '提交人时间',
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
      Dates: undefined,
      Sector: undefined,
      depList: [],
      queryParam: { current: 1 },
      pagination1: {},
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
        if (to.name === 'sale-commission') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    disabledDate(current) {
      return current && current > moment().subtract(30, 'days')
    },
    // 下载
    outPort(record) {
      getSalerPercentageExcel({ applyId: record.id })
        .then((res) => {
          // debugger
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          let objectUrl = URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.style = 'display: none'
          link.target = '_blank'
          link.href = objectUrl
          link.download = record.month + '销售提成表' // 自定义文件名
          link.click() // 下载文件
          URL.revokeObjectURL(objectUrl) // 释放内存
        })
        .catch((err) => this.$message.error(err.msg))
    },
    init() {
      let that = this
      that.searchAction()
      bonus_getDepartmentByType({ type: 1 }).then((res) => (this.depList = res.data))
    },
    showModal() {
      this.date = undefined
      this.Sector = undefined
      this.visible = true
    },
    handleOk() {
      let _that = this
      let date = moment(_that.Dates).format('YYYY-MM')
      if (_that.Dates && _that.Sector) {
        sale_checkSalerPercentApply({ month: date, departmentId: _that.Sector }).then((res) => {
          if (res.code === 200) {
            _that.visible = false
            _that.doAction('add', { month: date, departmentId: _that.Sector })
          } else {
            _that.$message.error(res.msg)
          }
        })
      } else {
        _that.$message.error('请选择月份或部门')
      }
    },
    // 删除
    confirmDelete(record) {
      let that = this
      sale_Remove(`id=${record.id}`).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },
    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '审核通过',
        3: '审核未通过',
        4: '已撤回',
        5: '已完结',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    //审批流组件
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

    // 撤回
    confirmWithdraw(record) {
      let that = this
      sale_Withdraw(`id=${record.id}`).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    searchAction(opt) {
      let that = this
      if (that.queryParam.month) {
        let date = moment(that.queryParam.month).format('YYYY-MM')
        that.queryParam.month = date
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      sale_PercentageList(_searchParam)
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

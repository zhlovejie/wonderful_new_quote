<template>
  <!-- 加班申请 -->
  <div class="wdf-custom-wrapper" id="attendance-over-time-apply">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="选择部门" v-model="searchParam.depId" :allowClear="true" style="width: 200px">
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input placeholder="员工名模糊查询" v-model="searchParam.userName" allowClear style="width: 200px" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="选择审批状态" v-model="searchParam.status" :allowClear="true" style="width: 200px">
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
            <a-select-option :value="4">已撤回</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-range-picker v-model="sDate" @change="rangePickerChange" style="width: 220px" :allowClear="true" />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
        <div class="action-wrapper" style="float: right" v-if="$auth('overworkApply:add')">
          <a-form-item>
            <a-button type="primary" icon="plus" @click="doAction('add', null)">新增</a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>

    <a-alert message="加班规则" type="warning" show-icon style="margin-top: 10px">
      <div slot="description">
        <div>
          1）加班单位：最小加班单位{{ ovwework.overWorkCaculatorType }}，超过下班时间{{
            ovwework.overWorkCaculatorType
          }}才记为加班。
        </div>
        <div>2）加班时间：可申请过去{{ ovwework.limitTime }}天内的加班，超过时间不予提交申请。</div>
      </div>
    </a-alert>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <template v-if="$auth('overworkApply:approval')">
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
        <div slot="editContent" slot-scope="text, record">
          <a href="javascript:void(0);" @click="doAction('editView', record)">查看</a>
        </div>
        <div slot="status" slot-scope="text, record">
          <a href="javascript:void(0);" @click="approvalPreview(record)">
            {{ { 1: '待审批', 2: '通过', 3: '不通过', 4: '已撤回' }[text] || '未知' }}
          </a>
        </div>
        <div slot="userName" slot-scope="text, record">
          {{ record.createdName }}
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>
          <template v-if="+activeKey === 1">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>

          <template v-if="+activeKey === 0">
            <template v-if="+record.status === 1 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
            <template v-if="[3,4].includes(+record.status)">
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
            <template v-if="(+record.status === 3 || +record.status === 4) && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit', record)">修改</a>
            </template>
          </template>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="searchAction({ current: 1 })" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
} from '@/api/systemSetting'
import {
  overworkApplyAddAndUpdate,
  overworkApplyApproval,
  overworkApplyDel,
  overworkApplyDetail,
  overworkApplyList,
  overworkApplyHours,
  overworkApplyWithdraw,
  overworkRuleList,
} from '@/api/attendanceManagement'
import AddForm from './AddForm'

import moment from 'moment'
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
    title: '员工名',
    scopedSlots: { customRender: 'userName' },
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'depName',
  },
  {
    align: 'center',
    title: '加班日期',
    dataIndex: 'date',
  },
  {
    align: 'center',
    title: '加班开始时间',
    dataIndex: 'beginTime',
  },
  {
    align: 'center',
    title: '加班结束时间',
    dataIndex: 'endTime',
  },
  {
    align: 'center',
    title: '加班时长',
    dataIndex: 'duration',
  },
  {
    align: 'center',
    title: '审批状态',
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
    title: '提交时间',
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
  name: 'attendance-rule-list-edit',
  components: {
    AddForm,
    ApproveInfo,
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      ovwework: {},
      pagination: {
        current: 1,
      },
      loading: false,
      searchParam: {},
      sDate: [undefined, undefined],
      activeKey: 0,
      depList: [],
      bindEnterFn: null,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'attendance-over-time-apply') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('#attendance-over-time-apply')
    that.bindEnterFn = (event) => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
    }
  },
  methods: {
    moment,
    init() {
      let that = this
      that.searchParam.searchStatus = that.activeKey
      let queue = []
      overworkRuleList().then((rs) => {
        that.ovwework = rs.data.records[0]
        that.ovwework.overWorkCaculatorType = that.getOverWorkCaculatorType(rs.data.records[0].overWorkCaculatorType)
      })
      let task1 = departmentList().then((res) => (that.depList = res.data))
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      overworkApplyList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    doAction(actionType, record) {
      let that = this
      if (['view', 'add', 'edit', 'approval'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record || {})
      } else if (actionType === 'del') {
        overworkApplyDel({ id: record.id })
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'withdraw') {
        overworkApplyWithdraw({ id: record.id })
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      }
    },
    getOverWorkCaculatorType(type) {
      return { 1: '按半小时加班', 2: '按小时加班', 3: '按半天加班', 4: '按天加班' }[type] || '未知'
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam.searchStatus = this.activeKey
      this.searchAction({ current: 1 })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    rangePickerChange(arrMoment, arrStrs) {
      if (Array.isArray(arrMoment)) {
        if (arrMoment.length === 2) {
          this.searchParam.beginTime = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.endTime = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.searchParam.beginTime = undefined
          this.searchParam.endTime = undefined
        }
      }
    },
  },

  beforeDestroy() {
    let that = this
    let ele = document.querySelector('#attendance-over-time-apply')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
  },
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>

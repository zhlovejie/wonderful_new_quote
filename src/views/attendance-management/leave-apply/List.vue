<template>
  <!-- 请假申请 -->
  <div class="wdf-custom-wrapper" id="attendance-leave-apply">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="员工名模糊查询" v-model="searchParam.userName" allowClear style="width: 200px" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="选择部门" v-model="searchParam.depId" :allowClear="true" style="width: 200px">
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-select placeholder="选择审批状态" v-model="searchParam.status" :allowClear="true" style="width: 200px">
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
            <a-select-option :value="4">已作废</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-range-picker v-model="sDate" @change="rangePickerChange" style="width: 220px" :allowClear="true" />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>

        <div class="action-wrapper" style="float: right" v-if="$auth('attenceLeaveApply:add')">
          <a-form-item>
            <a-button type="primary" icon="plus" @click="doAction('add', null)">新增</a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <template v-if="$auth('attenceLeaveApply:approval')">
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
            {{ { 1: '待审批', 2: '通过', 3: '不通过', 4: '已作废' }[text] || '未知' }}
          </a>
        </div>
        <div slot="userName" slot-scope="text, record">
          {{ record.createdName }}
        </div>

        <div slot="beginTime" slot-scope="text, record">
          {{ +record.holidayCaculatorType === 1 ? text : text.slice(0, 10) }}
        </div>
        <div slot="endTime" slot-scope="text, record">
          {{ +record.holidayCaculatorType === 1 ? text : text.slice(0, 10) }}
        </div>
        <div slot="leaveTime" slot-scope="text, record">
          {{ text }}{{ { 1: '天', 3: '小时' }[record.holidayUnitType] || '' }}
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="+activeKey === 1">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>
          <template v-if="+activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>

          <template v-if="+activeKey === 0">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <template v-if="(+record.status === 1 || +record.status === 2) && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
            <!--fix 1138 不通过的、作废的请假单才可以删除 -->
            <template v-if="(+record.status === 3 || +record.status === 4) && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
            <!-- <template v-if="(+record.status === 3 || +record.status === 4) && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit',record)">修改</a>
            </template> -->
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
  attenceLeaveApplyDel,
  attenceLeaveApplyList,
  attenceLeaveApplyWithdraw,
  attenceLeaveApplyTime,
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
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '请假类型',
    dataIndex: 'holidayName',
  },
  {
    align: 'center',
    title: '开始时间',
    dataIndex: 'beginTime',
    scopedSlots: { customRender: 'beginTime' },
  },
  {
    align: 'center',
    title: '结束时间',
    dataIndex: 'endTime',
    scopedSlots: { customRender: 'endTime' },
  },
  {
    align: 'center',
    title: '请假时长',
    dataIndex: 'leaveTime',
    scopedSlots: { customRender: 'leaveTime' },
  },
  {
    align: 'center',
    title: '审批状态',
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
  name: 'attendance-leave-apply-list',
  components: {
    AddForm,
    ApproveInfo,
  },
  data() {
    return {
      msg: '21321',
      duration: undefined,
      columns: columns,
      dataSource: [],
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `时长合计：${this.duration}小时   `, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
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
        if (to.name === 'attendance-leave-apply') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('#attendance-leave-apply')
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
      let task1 = departmentList().then((res) => (that.depList = res.data))
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination1 }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      attenceLeaveApplyTime(_searchParam).then((res) => {
        this.duration = res.data
      })
      attenceLeaveApplyList(_searchParam)
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
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    doAction(actionType, record) {
      let that = this
      if (['view', 'add', 'edit', 'approval'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record || {})
      } else if (actionType === 'del') {
        attenceLeaveApplyDel(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'withdraw') {
        attenceLeaveApplyWithdraw(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      }
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
    let ele = document.querySelector('#attendance-leave-apply')
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

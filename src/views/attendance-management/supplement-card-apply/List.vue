<template>
  <!-- 补卡申请 -->
  <div class="wdf-custom-wrapper" id="attendance-supplement-card-apply">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="选择部门" v-model="searchParam.depId" :allowClear="true" style="width: 180px">
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input placeholder="员工名模糊查询" v-model="searchParam.userName" allowClear style="width: 200px" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="异常类型" v-model="searchParam.thingType" :allowClear="true" style="width: 140px">
            <a-select-option :value="1">设备异常</a-select-option>
            <a-select-option :value="2">忘记打卡</a-select-option>
            <a-select-option :value="3">停电</a-select-option>
            <a-select-option :value="4">天气异常</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select placeholder="选择审批状态" v-model="searchParam.status" :allowClear="true" style="width: 140px">
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
        <div class="action-wrapper" style="float: right" v-if="$auth('resignApply:add')">
          <a-form-item>
            <a-button type="primary" icon="plus" @click="doAction('add', null)">新增</a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <a-alert message="补卡规则" type="warning" show-icon style="margin-top: 10px">
      <div slot="description">
        <div>
          1）每月可提交 {{ detail.permitRecardTims }}
          次补卡，超过次数后不可进行补卡申请。
        </div>
        <div>2）可申请过去{{ detail.permitDelayDayTims }}天内的补卡，超过时间未申请按旷工处理。</div>
      </div>
    </a-alert>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <template v-if="$auth('resignApply:approval')">
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
        <div slot="thingType" slot-scope="text, record">
          {{ { 1: '设备异常', 2: '忘记打卡', 3: '停电', 4: '天气异常' }[text] || '未知' }}
        </div>
        <div slot="exceptionType" slot-scope="text, record">
          {{ { 1: '上班未打卡', 2: '下班未打卡', 3: '迟到', 4: '早退', 5: '加班', 6: '人脸识别异常' }[text] || '未知' }}
        </div>

        <div slot="reason" slot-scope="text, record">
          <a-tooltip v-if="String(text).length > 15">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 15) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="+activeKey === 1">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>
          <template v-if="+activeKey === 2">
            <a type="primary" @click="doAction('view1', record)">查看</a>
          </template>

          <template v-if="+activeKey === 0">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <template v-if="+record.status === 1 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
            <template v-if="[3, 4].includes(+record.status)">
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
  attenceRecardRuleDetail,
  resignApplyDel,
  resignApplyList,
  resignApplyWithdraw,
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
    dataIndex: 'depName',
  },
  {
    align: 'center',
    title: '日期',
    dataIndex: 'happenDate',
  },
  {
    align: 'center',
    title: '异常事件',
    dataIndex: 'exceptionType',
    scopedSlots: { customRender: 'exceptionType' },
  },
  {
    align: 'center',
    title: '异常类型',
    dataIndex: 'thingType',
    scopedSlots: { customRender: 'thingType' },
  },
  {
    align: 'center',
    title: '缺卡原因',
    dataIndex: 'reason',
    scopedSlots: { customRender: 'reason' },
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
  name: 'attendance-supplement-card-apply',
  components: {
    AddForm,
    ApproveInfo,
  },
  data() {
    return {
      columns: columns,
      detail: {},
      dataSource: [],
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
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
        if (to.name === 'attendance-supplement-card-apply') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('#attendance-supplement-card-apply')
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
      attenceRecardRuleDetail().then((res) => (that.detail = res.data))
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
      resignApplyList(_searchParam)
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
      if (['view', 'add', 'edit', 'approval', 'view1'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record || {})
      } else if (actionType === 'del') {
        resignApplyDel({ id: record.id })
          .then((res) => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'withdraw') {
        resignApplyWithdraw({ id: record.id })
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
    let ele = document.querySelector('#attendance-supplement-card-apply')
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

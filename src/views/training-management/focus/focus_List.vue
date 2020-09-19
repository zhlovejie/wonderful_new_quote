<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-button-group>
            <a-button
              type="primary"
              :class="{currentDayWeekMonth:dayWeekMonth === 1}"
              @click="simpleSearch(1)"
            >今天</a-button>
            <a-button
              type="primary"
              :class="{currentDayWeekMonth:dayWeekMonth === 2}"
              @click="simpleSearch(2)"
            >本周</a-button>
            <a-button
              type="primary"
              :class="{currentDayWeekMonth:dayWeekMonth === 3}"
              @click="simpleSearch(3)"
            >本月</a-button>
          </a-button-group>
        </a-form-item>
        <a-form-item>
          <a-input v-model="trainName" placeholder="培训名称" style="width:200px;" :allowClear="true" />
        </a-form-item>
        <a-form-item label="日期">
          <a-range-picker v-model="sDate" style="width:280px;" />
        </a-form-item>
        <a-form-item>
          <template>
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item>
        <a-dropdown style="float:right;" v-if="$auth('focus:add')">
          <a-button type="primary" @click="toAdd('add',null)">
            <a-icon type="plus" />新增
          </a-button>
        </a-dropdown>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="全部" key="0" forceRender></a-tab-pane>
            <template v-if="$auth('focus:approval')">
              <a-tab-pane tab="待审批" key="1"></a-tab-pane>
              <a-tab-pane tab="已审批" key="2"></a-tab-pane>
            </template>
          </a-tabs>
        </div>
        <s-table
          v-if="$auth('focus:list')"
          style="margin-bottom: 24px"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="false"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="haveCheckFlag" slot-scope="text">
            <span v-if="text==0">无</span>
            <span v-if="text==1">有</span>
          </div>
          <div slot="status" slot-scope="text, record">
            <a @click="handleClick(record)" v-if="text==1">待审批</a>
            <a @click="handleClick(record)" v-if="text==2">通过</a>
            <a @click="handleClick(record)" v-if="text==3">不通过</a>
            <a @click="handleClick(record)" v-if="text==4">已撤回</a>
          </div>

          <span slot="action" slot-scope="text, record">
            <template v-if="audit==0||audit==2">
              <a type="primary" @click="toAdd('view',record)">查看</a>
            </template>
            <template
              v-if=" $auth('focus:Withdraw')&&audit==0&&record.status === 1 && +record.createdId  === +userInfo.id"
            >
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否确定撤回"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmWithdraw(record)"
              >
                <a type="primary">撤回</a>
              </a-popconfirm>
            </template>
            <template
              v-if=" $auth('focus:meetingEventId')&&audit==0 &&record.status == 2 && record.onlineFlag==0 && +record.createdId  === +userInfo.id"
            >
              <template v-if=" record.meetingEventId">
                <a-divider type="vertical" />
                <a type="primary" @click="doAction('edit',record)">修改会议事件</a>
              </template>
              <template v-else>
                <a-divider type="vertical" />
                <a type="primary" @click="doAction('add',record)">会议事件</a>
              </template>

              <template v-if="record.meetingNum">
                <a-divider type="vertical" />
                <a type="primary" @click="meeting('view',record)">会议记录</a>
              </template>
            </template>
            <template
              v-if="$auth('focus:edit-salary')&&audit==0&& record.status === 3||record.status === 4&& +record.createdId  === +userInfo.id "
            >
              <a-divider type="vertical" />
              <a type="primary" @click="toAdd('edit-salary',record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否确定删除"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmDelete(record)"
              >
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
            <template v-if="$auth('focus:examine')&&audit==1&&record.status === 1 ">
              <a type="primary" @click="toAdd('examine',record)">审核</a>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <common-step-form ref="commonStepForm" @finish="search()" />
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="search()" />
    <Meeting ref="meeting" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { dispersedList, dispersedwithdraw, dispersedDelete, meetingDetailByCode } from '@/api/training-management'
import CommonStepForm from './module/CommonStepForm'
import AddForm from './module/EventAdd'
import Meeting from './module/view'
import { getLoginUser } from '@api/systemSetting'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import moment from 'moment'
export default {
  name: 'DelayedPayment',
  components: {
    CommonStepForm,
    ApproveInfo,
    AddForm,
    STable,
    Meeting,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      queryParam: {
        searchStatus: 0,
        trainType: 1,
      },
      trainName: undefined,
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      customerName: undefined,
      sDate: [undefined, undefined],
      dayWeekMonth: 1,

      saleCustomers: [],
      audit: 0,
      show: true,
      userInfo: {},
      approvalStatusSelect: 0,
      // 表头
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          align: 'center',
          title: '培训编号',
          dataIndex: 'trainNum',
          key: 'trainNum',
        },
        {
          align: 'center',
          title: '培训名称',
          dataIndex: 'trainName',
          key: 'trainName',
        },
        {
          align: 'center',
          title: '会议负责人',
          dataIndex: 'lecturerUserName',
          key: 'lecturerUserName',
        },
        {
          align: 'center',
          title: '开始时间',
          key: 'beginTime',
          dataIndex: 'beginTime',
        },
        {
          align: 'center',
          title: '结束时间',
          key: 'endTime',
          dataIndex: 'endTime',
        },
        {
          align: 'center',
          title: '地点',
          key: 'meetingAddress',
          dataIndex: 'meetingAddress',
        },
        {
          align: 'center',
          title: '是否有考核',
          key: 'haveCheckFlag',
          dataIndex: 'haveCheckFlag',
          scopedSlots: { customRender: 'haveCheckFlag' },
        },

        {
          align: 'center',
          title: '审批状态',
          dataIndex: 'status',
          key: 'status',
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
          title: '提交时间',
          key: 'createdTime',
          dataIndex: 'createdTime',
        },
        {
          align: 'center',
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return dispersedList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'delayedPayment') {
        this.$refs.table.refresh(true)
      }
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    moment: moment,
    init() {
      // 获取当前登录用户信息
      getLoginUser().then((res) => {
        this.userInfo = res.data
      })
    },
    toAdd(type, record) {
      this.$refs.commonStepForm.query(type, record)
    },
    //撤回
    confirmWithdraw(record) {
      dispersedwithdraw({ trainId: record.id }).then((res) => {
        if (res.code === 200) {
          this.$message.info(res.msg)
          this.search()
        }
      })
    },
    // 列表删除
    confirmDelete(record) {
      dispersedDelete(`trainId=${record.id}`).then((res) => {
        if (res.code === 200) {
          this.$message.info(res.msg)
          this.search()
        }
      })
    },
    //会议事件新增
    doAction(actionType, record) {
      this.$refs.addForm.query(actionType, record)
    },

    search(opt = {}) {
      let beginTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        beginTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      this.queryParam = {
        searchStatus: this.audit,
        trainName: this.trainName,
        trainType: 1,
        beginTime: beginTime,
        endTime: endTime,
        dayWeekMonth: this.dayWeekMonth,
        ...opt,
      }
      this.$refs.table.refresh(true)
    },
    //审批流组件
    handleClick(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    //查看会议记录
    meeting(type, record) {
      meetingDetailByCode({ recordCode: record.meetingNum })
        .then((res) => {
          if (res.code === 200) {
            this.$refs.meeting.query(type, res.data)
          } else {
            this.$message.info(res.msg)
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    paramClick(key) {
      if (key === '1') {
        this.audit = 1
        this.show = false
      } else if (key === '2') {
        this.audit = 2
        this.show = false
      } else {
        this.show = true
        this.audit = 0
      }
      this.queryParam = { searchStatus: key, trainType: 1 }
      this.$refs.table.refresh(true)
    },

    simpleSearch(type) {
      this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
      console.log(type)
      this.search()
    },
  },
}
</script>

<style scoped>
.top-ation .a-input {
  width: 160px;
  margin: 0 8px 8px 0;
}

.a-select {
  margin-right: 8px;
}

.a-button {
  margin-right: 8px;
}

.fl-r {
  float: right;
}

.develop-wrap {
  background-color: #fff;
  padding: 12px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>

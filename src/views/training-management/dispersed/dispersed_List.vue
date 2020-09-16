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
          <a-input
            v-model="customerName"
            placeholder="培训名称"
            style="width:200px;"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item label="日期">
          <a-range-picker v-model="sDate" style="width:280px;" />
        </a-form-item>
        <a-form-item>
          <template v-if="$auth('payment:list')">
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item>
        <a-dropdown style="float:right;">
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
            <template v-if="$auth('payment:approval')">
              <a-tab-pane tab="待审批" key="1"></a-tab-pane>
              <a-tab-pane tab="已审批" key="2"></a-tab-pane>
            </template>
          </a-tabs>·
        </div>
        <s-table
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
          <!-- <span slot="customerName" slot-scope="text, record">
            <a @click="tenderingClick(record)">{{ text }}</a>
          </span>-->
          <!--<a slot="arrearsStatus" slot-scope="text, record" @click="checkIsEnd(record)">
            <span v-if="text==1">未结</span>
            <span v-if="text==2">已结</span>
          </a>-->
          <div slot="status" slot-scope="text, record">
            <a @click="handleClick(record)" v-if="text==1">待审批</a>
            <a @click="handleClick(record)" v-if="text==2">通过</a>
            <a @click="handleClick(record)" v-if="text==3">不通过</a>
            <a @click="handleClick(record)" v-if="text==4">已撤回</a>
            <a @click="handleClick(record)" v-if="text==4">已完结</a>
          </div>

          <!-- <div slot="delayedDays" slot-scope="text, record">{{calcDelayedDays(record)}}</div>
          <div slot="totalAmount" slot-scope="text, record">{{text | moneyFormatNumber}}</div>
          <div slot="delayedAmount" slot-scope="text, record">{{text | moneyFormatNumber}}</div>-->

          <span slot="action" slot-scope="text, record">
            <template v-if="audit==0||audit==2">
              <a type="primary" @click="doAction('view',record)">查看</a>
            </template>
            <template v-if=" audit==0&&record.status === 1 ">
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
            <template v-if=" audit==0 &&record.status === 2 ">
              <a-divider type="vertical" />
              <a type="primary" :href="record.planUrl">会议事件</a>
              <a-divider type="vertical" />
              <a type="primary" :href="record.planUrl">会议记录</a>
            </template>
            <template v-if="audit==0&& record.status === 3||record.status === 4 ">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit-salary',record)">修改</a>
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
            <template v-if="audit==1&&record.status === 1 ">
              <a type="primary" :href="record.planUrl">审核</a>
            </template>
            <!-- <template >
              <a @click="handleSee(record)">查看</a>
            </template>
            <a-divider v-if="audit==0&&record.approvalStatus==2" type="vertical" />
            <a v-if="audit==0&&record.approvalStatus==2" target="_blank" :href="record.wordUrl">欠款单</a>
            <a-divider v-if="audit==0&&record.approvalStatus==2" type="vertical" />
            <a
              v-if="audit==0&&record.approvalStatus==2"
              target="_blank"
              @click="UploadFile(record)"
            >上传</a>
            <template v-if="$auth('payment:edit')">
              <a-divider v-if="audit==1&&userInfo.id!=1" type="vertical" />
              <a v-if="audit==1&&userInfo.id!=1" @click="handleApproval(record)">审核</a>
            </template>
            <template v-if="$auth('payment:one')">
              <a-divider v-if="audit==0&&record.approvalStatus==3" type="vertical" />
              <a v-if="audit==0&&record.approvalStatus==3" @click="Resubmit(record)">重新提交</a>
            </template>-->
          </span>
        </s-table>
      </a-col>
    </a-row>
    <common-step-form ref="commonStepForm" />
    <ApproveInfo ref="approveInfoCard" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { dispersedList } from '@/api/training-management'
import CommonStepForm from './module/CommonStepForm'
import { getLoginUser } from '@api/systemSetting'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import moment from 'moment'
export default {
  name: 'DelayedPayment',
  components: {
    CommonStepForm,
    ApproveInfo,

    STable,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      // 查询参数
      url: 'https://view.officeapps.live.com/op/view.aspx?src=',
      queryParam: {
        // dayWeekMonth: 1,
        searchStatus: 0,
        trainType: 2,
      },
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      customerName: undefined,
      // delayedPaymentNum: undefined,
      sDate: [undefined, undefined],
      dayWeekMonth: 1,
      vueBoolean: this.$store.getters.vueBoolean,
      saleCustomers: [],
      audit: 0,
      show: true,
      arrearsState: 0,
      wordUrl: '',
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
          // key: 'title',
          scopedSlots: { customRender: 'trainNum' },
        },
        {
          align: 'center',
          title: '培训名称',
          dataIndex: 'trainName',
          scopedSlots: { customRender: 'trainName' },
        },
        {
          align: 'center',
          title: '会议负责人',
          dataIndex: 'lecturerUserName',
          scopedSlots: { customRender: 'lecturerUserName' },
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
          // scopedSlots: { customRender: 'endTime' },
        },
        {
          align: 'center',
          title: '地点',
          key: 'meetingAddress',
          dataIndex: 'meetingAddress',
          // scopedSlots: { customRender: 'meetingAddress' },
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
          dataIndex: 'createdUsername',
        },
        {
          align: 'center',
          title: '提交时间',
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

    search(opt = {}) {
      let beginTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        beginTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      this.queryParam = {
        // customerName: this.customerName,
        searchStatus: this.audit,
        // arrearsStatus: this.arrearsState,
        // delayedPaymentNum: this.delayedPaymentNum,
        trainType: 2,
        beginTime: beginTime,
        endTime: endTime,
        dayWeekMonth: this.dayWeekMonth,
        ...opt,
      }
      // if (this.audit == 0) {
      //   this.queryParam['approvalStatus'] = this.approvalStatusSelect
      // }
      this.$refs.table.refresh(true)
    },
    // onSelectChange(selectedRowKeys, selectedRows) {
    //   this.selectedRowKeys = selectedRowKeys
    //   this.selectedRows = selectedRows
    // },
    //审批流组件
    handleClick(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    // handleClick(record) {
    //   this.$refs.node.query(record)
    // },
    // handleSaveOk() {
    //   this.$refs.table.refresh(true)
    // },
    // handleSaveClose() {},
    // tenderingClick(record) {
    //   const data = { id: record.customerId }
    //   this.$refs.tenderingModel.look(data)
    // },
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
      this.queryParam = { searchStatus: key, trainType: 2 }
      this.$refs.table.refresh(true)
    },
    // handleSee(e) {
    //   debugger
    //   if (e.contractType === 1) {
    //     this.$router.push({ name: 'lookDelayedPayment', params: { record: e } })
    //   }
    //   if (e.contractType === 2) {
    //     this.$router.push({ name: 'lookSoftDelayedPayment', params: { record: e } })
    //   }
    // },
    // handleApproval(e) {
    //   if (e.contractType === 1) {
    //     this.$router.push({ name: 'lookDelayedPayment', params: { record: e, type: 'Approval' } })
    //   }
    //   if (e.contractType === 2) {
    //     this.$router.push({ name: 'lookSoftDelayedPayment', params: { record: e, type: 'Approval' } })
    //   }
    // },
    // Resubmit(e) {
    //   if (e.contractType === 1) {
    //     this.$router.push({ name: 'resubmit', params: { record: e } })
    //   }
    //   if (e.contractType === 2) {
    //     this.$router.push({ name: 'softResubmit', params: { record: e } })
    //   }
    // },
    // createPromise(e) {
    //   this.$router.push({ name: 'createPromise', params: { record: e } })
    // },
    // handleAuditOk() {
    //   this.$refs.table.refresh(true)
    // },
    // handleAuditClose() {
    //   this.$refs.table.refresh(true)
    // },
    // openModel() {
    //   this.$refs.invoiceContract.query()
    // },
    // checkIsEnd(record) {
    //   changeState(record).then((res) => {
    //     if (res.code === 200) {
    //       this.$refs.table.refresh(true)
    //     }
    //   })
    // },
    // UploadFile(record) {
    //   this.$refs.UploadFile.showForm(record.id)
    // },
    // calcDelayedDays(record) {
    //   var ptime = this.moment(record.promiseTime)
    //   var dtime = this.moment(record.delayedTime)
    //   if (!ptime.isValid() || !dtime.isValid) {
    //     return '-'
    //   }
    //   return moment(dtime).diff(moment(ptime), 'days')
    // },
    simpleSearch(type) {
      this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
      console.log(type)
      this.search()
    },
    /* handleAdd (record) {
      // 跳转到申请延迟付款单界面
      this.$router.push({ name: 'addSoftDelayedPayment', params: { id: record.id ,contractType:"2"} })
    }*/
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

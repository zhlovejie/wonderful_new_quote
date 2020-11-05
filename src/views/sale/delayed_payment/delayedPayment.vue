<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-button-group>
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 1 }" @click="simpleSearch(1)"
              >今天</a-button
            >
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 2 }" @click="simpleSearch(2)"
              >本周</a-button
            >
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 3 }" @click="simpleSearch(3)"
              >本月</a-button
            >
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 4 }" @click="simpleSearch(4)"
              >全部</a-button
            >
          </a-button-group>
        </a-form-item>
        <a-form-item>
          <a-input v-model="customerName" placeholder="客户名称模糊查询" style="width: 200px" :allowClear="true" />
        </a-form-item>
        <a-form-item>
          <a-input
            v-model="delayedPaymentNum"
            placeholder="延迟付款编号模糊查询"
            style="width: 200px"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item v-show="show">
          <a-select
            style="width: 150px"
            placeholder="审批状态"
            v-model="approvalStatusSelect"
            :allowClear="true"
            defaultValue="0"
          >
            <a-select-option :value="0">请选择审批状态</a-select-option>
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="日期">
          <a-range-picker v-model="sDate" style="width: 280px" />
        </a-form-item>
        <a-form-item>
          <template v-if="$auth('payment:list')">
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
          <!--          <div class="table-operator fl-r">-->
          <!--              <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>-->
          <!--          </div>-->
        </a-form-item>
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
            </template> </a-tabs
          >·
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
          <span slot="customerName" slot-scope="text, record">
            <a @click="tenderingClick(record)">{{ text }}</a>
          </span>
          <!--<a slot="arrearsStatus" slot-scope="text, record" @click="checkIsEnd(record)">
            <span v-if="text==1">未结</span>
            <span v-if="text==2">已结</span>
          </a>-->
          <div slot="approvalStatus" slot-scope="text, record">
            <a @click="handleClick(record)" v-if="text == 1">待审批</a>
            <a @click="handleClick(record)" v-if="text == 2">通过</a>
            <a @click="handleClick(record)" v-if="text == 3">拒绝</a>
            <a @click="handleClick(record)" v-if="text == 4">审批中</a>
            <a @click="handleClick(record)" v-if="text == 9">已撤回</a>
          </div>

          <div slot="delayedDays" slot-scope="text, record">
            {{ calcDelayedDays(record) }}
          </div>
          <div slot="totalAmount" slot-scope="text, record">{{ text | moneyFormatNumber }}</div>
          <div slot="delayedAmount" slot-scope="text, record">{{ text | moneyFormatNumber }}</div>

          <span slot="action" slot-scope="text, record">
            <a @click="handleSee(record)">查看</a>
            <template v-if="+audit === 0">
              <template v-if="record.approvalStatus == 1">
                <a-divider type="vertical"/>
                <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback',record)">
                  <a type="primary" href="javascript:;">撤回</a>
                </a-popconfirm>
              </template>
              <template v-if="record.approvalStatus == 2">
                <a-divider type="vertical"/>
                <a target="_blank" :href="record.wordUrl">欠款单</a>
                <a-divider type="vertical"/>
                <a target="_blank" @click="UploadFile(record)">上传</a>
              </template>
              <template v-if="+record.approvalStatus === 3 || +record.approvalStatus === 9">
                <a-divider type="vertical"/>
                <a @click="Resubmit(record)">重新提交</a>
              </template>
            </template>
            <template v-if="+audit === 1">
              <a-divider type="vertical" v-if="userInfo.id != 1" />
              <a v-if="userInfo.id != 1" @click="handleApproval(record)">审核</a>
            </template>
            <template v-if="+audit === 2"></template>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <InvestigateNode ref="node" />
    <Tendering ref="tenderingModel"></Tendering>
    <upload-file ref="UploadFile" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getDelayedList, changeState ,revocationDelayedPayment} from '@/api/delayedPayment'
import InvestigateNode from '../record/InvestigateNode'
import Tendering from '../record/TenderingUnit'
import { getLoginUser } from '@api/systemSetting'
import UploadFile from './modules/UploadFile'
import moment from 'moment'
export default {
  name: 'DelayedPayment',
  components: {
    UploadFile,
    Tendering,
    InvestigateNode,
    STable,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      // 查询参数
      url: 'https://view.officeapps.live.com/op/view.aspx?src=',
      queryParam: {
        dayWeekMonth: 1,
      },
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      customerName: undefined,
      delayedPaymentNum: undefined,
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
          title: '合同编号',
          dataIndex: 'contractNum',
          // key: 'title',
          scopedSlots: { customRender: 'contractNum' },
        },
        {
          title: '延迟付款单编号',
          dataIndex: 'delayedPaymentNum',
          scopedSlots: { customRender: 'delayedPaymentNum' },
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'customerName' },
        },
        {
          title: '承诺付款时间',
          dataIndex: 'promiseTime',
        },
        {
          align: 'center',
          title: '延迟天数',
          key: 'delayedDays',
          scopedSlots: { customRender: 'delayedDays' },
        },
        {
          align: 'center',
          title: '延迟付款金额',
          key: 'delayedAmount',
          dataIndex: 'delayedAmount',
          scopedSlots: { customRender: 'delayedAmount' },
        },
        {
          align: 'center',
          title: '总金额',
          key: 'totalAmount',
          dataIndex: 'totalAmount',
          scopedSlots: { customRender: 'totalAmount' },
        },

        {
          title: '单据状态',
          dataIndex: 'approvalStatus',
          scopedSlots: { customRender: 'approvalStatus' },
        },
        {
          title: '申请人',
          dataIndex: 'createName',
        },
        {
          title: '申请时间',
          dataIndex: 'createTime',
        },
        {
          title: '操作',
          dataIndex: 'id',
          width: '200px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDelayedList(Object.assign(parameter, this.queryParam)).then((res) => {
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
    search(opt = {}) {
      let startTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        startTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      this.queryParam = {
        customerName: this.customerName,
        audit: this.audit,
        arrearsStatus: this.arrearsState,
        delayedPaymentNum: this.delayedPaymentNum,
        startTime: startTime,
        endTime: endTime,
        dayWeekMonth: this.dayWeekMonth,
        ...opt,
      }
      if (this.audit == 0) {
        this.queryParam['approvalStatus'] = this.approvalStatusSelect
      }
      this.$refs.table.refresh(true)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleClick(record) {
      this.$refs.node.query(record)
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
    handleSaveClose() {},
    tenderingClick(record) {
      const data = { id: record.customerId }
      this.$refs.tenderingModel.look(data)
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
      this.queryParam = { audit: key }
      this.$refs.table.refresh(true)
    },
    handleSee(e) {
      debugger
      if (e.contractType === 1) {
        this.$router.push({ name: 'lookDelayedPayment', params: { record: e } })
      }
      if (e.contractType === 2) {
        this.$router.push({ name: 'lookSoftDelayedPayment', params: { record: e } })
      }
    },
    handleApproval(e) {
      if (e.contractType === 1) {
        this.$router.push({ name: 'lookDelayedPayment', params: { record: e, type: 'Approval' } })
      }
      if (e.contractType === 2) {
        this.$router.push({ name: 'lookSoftDelayedPayment', params: { record: e, type: 'Approval' } })
      }
    },
    Resubmit(e) {
      if (e.contractType === 1) {
        this.$router.push({ name: 'resubmit', params: { record: e } })
      }
      if (e.contractType === 2) {
        this.$router.push({ name: 'softResubmit', params: { record: e } })
      }
    },
    createPromise(e) {
      this.$router.push({ name: 'createPromise', params: { record: e } })
    },
    handleAuditOk() {
      this.$refs.table.refresh(true)
    },
    handleAuditClose() {
      this.$refs.table.refresh(true)
    },
    openModel() {
      this.$refs.invoiceContract.query()
    },
    checkIsEnd(record) {
      changeState(record).then((res) => {
        if (res.code === 200) {
          this.$refs.table.refresh(true)
        }
      })
    },
    UploadFile(record) {
      this.$refs.UploadFile.showForm(record.id)
    },
    calcDelayedDays(record) {
      var ptime = this.moment(record.promiseTime)
      var dtime = this.moment(record.delayedTime)
      if (!ptime.isValid() || !dtime.isValid) {
        return '-'
      }
      return moment(dtime).diff(moment(ptime), 'days')
    },
    simpleSearch(type) {
      if (type === 4) {
        this.dayWeekMonth = undefined
        this.search()
      } else {
        this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
        this.search()
      }
    },
    /* handleAdd (record) {
      // 跳转到申请延迟付款单界面
      this.$router.push({ name: 'addSoftDelayedPayment', params: { id: record.id ,contractType:"2"} })
    }*/
    doAction(type,record){
      let that = this
      if(type === 'reback'){
        revocationDelayedPayment({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.search()
        })
        return
      }
    }
    
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

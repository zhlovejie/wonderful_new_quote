<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-button-group>
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 2 }" @click="simpleSearch(2)"
              >本周</a-button
            >
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 3 }" @click="simpleSearch(3)"
              >本月</a-button
            >
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 1 }" @click="simpleSearch(1)"
              >全部</a-button
            >
          </a-button-group>
        </a-form-item>
        <a-form-item>
          <a-input v-model="trainName" placeholder="培训名称" style="width: 200px" :allowClear="true" />
        </a-form-item>
        <a-form-item label="日期">
          <a-range-picker v-model="sDate" style="width: 280px" />
        </a-form-item>
        <a-form-item>
          <template>
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div style="height: 50px"></div>
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
          <div slot="onlineFlag" slot-scope="text">
            <span v-if="text == 0">线下</span>
            <span v-if="text == 1">线上</span>
          </div>
          <div slot="haveCheckFlag" slot-scope="text">
            <span v-if="text == 0">无</span>
            <span v-if="text == 1">有</span>
          </div>

          <span slot="action" slot-scope="text, record">
            <template v-if="record.onlineFlag === 0">
              <a type="primary" @click="toAdd('view', record)">查看</a>
            </template>
            <template v-else-if="record.readFlag === 0">
              <a type="primary" @click="toAdd('examine', record)">处理</a>
            </template>
            <template v-else>
              <a type="primary" @click="toAdd('examine', record)">查看</a>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <common-step-form ref="commonStepForm" @finish="search()" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { meetingOaTrainInfo } from '@/api/training-management'
import CommonStepForm from './module/CommonStepForm'
import { getLoginUser } from '@api/systemSetting'
import moment from 'moment'
export default {
  name: 'DelayedPayment',
  components: {
    CommonStepForm,
    STable,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      queryParam: {
        current: 0,
        dayWeekMonth: 2,
      },
      trainName: undefined,
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      customerName: undefined,
      sDate: [undefined, undefined],
      dayWeekMonth: 2,

      saleCustomers: [],
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
          title: '类型',
          key: 'onlineFlag',
          dataIndex: 'onlineFlag',
          scopedSlots: { customRender: 'onlineFlag' },
        },

        {
          align: 'center',
          title: '讲师',
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
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return meetingOaTrainInfo(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'training-management_training') {
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
        trainName: this.trainName,
        beginTime: beginTime,
        endTime: endTime,
        dayWeekMonth: this.dayWeekMonth,
        ...opt,
      }
      this.$refs.table.refresh(true)
    },

    simpleSearch(type) {
      this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
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

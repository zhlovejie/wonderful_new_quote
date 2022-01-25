<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="refund-receipt-list-wrapper">
      <div class="search-wrapper">
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
        <a-input
          style="width: 150px; margin-right: 10px; margin-left: 10px"
          placeholder="物流单号"
          allowClear
          v-model="queryParam.logisticsOrderNo"
        />
        <a-range-picker @change="dateChange" allowClear style="width: 400px; margin-right: 10px" />
        <a-button
          class="a-button"
          style="margin-bottom: 20px; margin-left: 10px"
          type="primary"
          icon="search"
          @click="paramChangeHandler"
          >查询</a-button
        >
      </div>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <div class="main-wrapper">
        <a-alert :message="receiptAmount" type="info" style="float: left; width: 200px; margin: 5px 5px" />
        <a-alert :message="refundAmount" type="info" style="float: left; width: 200px; margin: 5px 5px" />

        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="false"
          :pagination="pagination"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="type" slot-scope="text, record, index">
            <span> {{ { 2: '已回款', 1: '未回款' }[text] || '未知' }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <a @click="Payment(record)">查看</a>
          </span>
        </s-table>
        <Application ref="application" @filet="paramChangeHandler"></Application>
      </div>
    </a-layout>
  </a-card>
</template>
<script>
import { getFeeProfitList, getAmount } from '@api/distribution-management'
import { STable } from '@/components'
import Application from './application'
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
    key: 'profitDate',
    dataIndex: 'profitDate',
  },
  {
    align: 'center',
    title: '物流单号',
    dataIndex: 'logisticsOrderNo',
    key: 'logisticsOrderNo',
  },
  {
    align: 'center',
    title: '我方管理费',
    dataIndex: 'adminPrice',
  },
  {
    align: 'center',
    title: '我方货物运输费',
    dataIndex: 'transportPrice',
    key: 'transportPrice',
  },
  {
    align: 'center',
    title: '净利润',
    dataIndex: 'netProfit',
    key: 'netProfit',
  },
  {
    align: 'center',
    title: '提成额',
    dataIndex: 'commissionPrice',
    key: 'commissionPrice',
  },
  {
    align: 'center',
    title: '回款状态',
    dataIndex: 'type',
    key: 'type',
    scopedSlots: { customRender: 'type' },
  },

  {
    align: 'center',
    title: '收款码',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'Order',
  components: {
    // 组件
    STable,
    Application,
  },
  data() {
    return {
      queryParam: {
        stageTimeType: 1,
      },
      receiptAmount: '',
      refundAmount: '',
      customers: [],
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
      dayWeekMonth: 1,
      // 表头
      columns: columns,
      // 初始化加载 必须为 Promise 对象
      loadData: (parameter) => {
        return getFeeProfitList(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res
          })
          .catch((error) => {
            this.loading = false
            console.error(error)
          })
      },
      customerSelectOptions: {
        wrapperStyle: {},
        formLayout: 'inline',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired: false,
        inputAllowClear: true,
      },
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'distribution_management_Netprofit') {
          this.paramChangeHandler()
        }
      },
      immediate: true,
    },
  },
  methods: {
    Payment(record) {
      this.$refs.application.query(record)
    },
    dateChange(date, dateString) {
      console.log(dateString)
      // this.$set(this.queryParam, 'rangeDate', date)
      this.$set(this.queryParam, 'beginDate', dateString[0])
      this.$set(this.queryParam, 'endDate', dateString[1])
    },
    //高级筛选返回数据
    paramChangeHandler(params) {
      this.queryParam = { ...this.queryParam, ...params, stageTimeType: this.dayWeekMonth }
      getAmount(this.queryParam).then((res) => {
        this.receiptAmount = `净利润（元）: ${res.data.netProfit}`
        this.refundAmount = `提成额（元）: ${res.data.commissionPrice}`
      })
      this.$refs.table.refresh(true)
    },
    simpleSearch(type) {
      if (type === 4) {
        this.queryParam.stageTimeType = undefined
        this.dayWeekMonth = undefined
        this.queryParam = { ...this.queryParam, stageTimeType: this.dayWeekMonth }
        this.paramChangeHandler()
      } else {
        this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
        this.queryParam = { ...this.queryParam, stageTimeType: this.dayWeekMonth }
        this.paramChangeHandler()
      }
    },
  },
}
</script>

<style scoped>
.order-search-wrapper >>> .ant-form-item {
  display: flex;
}

.order-search-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>

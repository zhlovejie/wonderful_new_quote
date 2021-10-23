
<template>
  <a-modal
    :width="1200"
    :title="`选择${modelTitle}`"
    v-model="priewVisible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <div class="search-options">
      <a-input class="main-items" style="margin-right: 10px" :placeholder="modelTitle" v-model="customerName" />
      <a-button type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
    <a-table
      :columns="columns"
      rowKey="id"
      :dataSource="saleCustomers"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :rowSelection="isCustomer ? null : { onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
      size="small"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="mailNum" slot-scope="text, record">
        <a v-if="isCustomer" @click="handlerSelected(record)">{{ text }}</a>
        <span v-else>{{ text }}</span>
      </div>

      <span slot="isTax" slot-scope="text, record">
        <span> {{ { 0: '含税', 1: '不含税' }[text] || '未知' }}</span>
      </span>
      <span slot="isPayment" slot-scope="text, record">
        <span v-if="text === 0" style="color: red">否</span>
        <span v-if="text === 1">是</span>
      </span>

      <span slot="paymentType" slot-scope="text, record">
        <span> {{ { 0: '完结付款', 1: '先付款', 2: '免付款' }[text] || '未知' }}</span>
      </span>

      <a-table
        slot="expandedRowRender"
        slot-scope="record, index, indent, expanded"
        :columns="innerColumns"
        :dataSource="record.productInfoList"
        :pagination="false"
        size="small"
      >
        <div slot="order" slot-scope="text, record, index">
          {{ index + 1 }}
        </div>
      </a-table>

      <p></p>

    </a-table>
  </a-modal>
</template>

<script>
import {
  receiveCustomerListReceiveCustomerMail,
  receiveWorkerListReceiveCustomerMail
} from '@/api/after-sales-management-custom'

const innerColumns = [
  {
    align: 'center',
    title: '序号',
    width: '80px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'materialModel'
  },
  {
    title: '单位',
    dataIndex: 'unit',
    scopedSlots: { customRender: 'unit' }
  },
  {
    title: '出货数量',
    dataIndex: 'sendQuantity'
  },
  {
    title: '已收数量',
    dataIndex: 'alreadyReceiveQuantity'
  },
  {
    title: '已免寄回数量',
    dataIndex: 'alreadyFreeQuantity'
  }
]


export default {
  name: 'PostList',
  data() {
    return {
      innerColumns,
      saleCustomers: [],
      consumerNam: null,
      consumerId: null,
      loading: false,
      pagination: {
        current: 1,
      },
      customerName: undefined,
      priewVisible: false,
      extendParam: {}, //扩展参数
      selectedRowKeys: [],
      selectedRows:[]
    }
  },
  computed: {
    searchParams: function () {
      return {
        accessoriesNum: this.customerName,
        mailNum: this.customerName,
      }
    },
    modelTitle(){
      return this.extendParam.__type === 1 ? '邮寄单编号' : '配件编号'
    },
    showColumns(){
      return this.extendParam.__type === 1 ? 'mailNum' : 'accessoriesNum'
    },
    columns(){
      let customer_columns = [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '邮寄单号',
          dataIndex: 'mailNum',
          scopedSlots: { customRender: 'mailNum' },
        },
        {
          title: '任务单编号',
          dataIndex: 'taskDocumentNum',
        },
        {
          title: '收件人姓名',
          dataIndex: 'recipientName',
        },
        {
          title: '联系电话',
          dataIndex: 'contactNumber',
          width: 100,
        },
        {
          title: '收件地址',
          dataIndex: 'address',
        },
        {
          title: '提交人',
          dataIndex: 'createdName',
        },
        {
          title: '提交时间',
          dataIndex: 'createdTime',
        }
      ]

      let sales_columns = [
        {
          title: '配件清单编号',
          dataIndex: 'accessoriesNum',
        },
        {
          title: '任务单编号',
          dataIndex: 'taskDocumentNum',
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
        },
        {
          title: '机构名称',
          dataIndex: 'orgName',
          width: 100,
        },
        {
          title: '销售负责人',
          dataIndex: 'saleUserName',
        },
        {
          title: '是否含税',
          dataIndex: 'isTax',
          scopedSlots: { customRender: 'isTax' },
        },
        {
          title: '金额（元）',
          dataIndex: 'totalAmount',
        },
        {
          title: '付款方式',
          dataIndex: 'paymentType',
          scopedSlots: { customRender: 'paymentType' },
        },
        {
          title: '是否付款',
          dataIndex: 'isPayment',
          scopedSlots: { customRender: 'isPayment' },
        },
        {
          title: '提交人',
          dataIndex: 'createdName',
        },
        {
          title: '提交时间',
          dataIndex: 'createdTime',
        }
      ]
      return this.isCustomer ? customer_columns : sales_columns
    },
    isCustomer(){
      return this.extendParam.__type === 1
    },
    isSales(){
      return this.extendParam.__type === 2
    }
  },
  methods: {
    handleSubmit(){
      this.$emit('selected',[...this.selectedRows])
      this.handleCancel()
    },
    handleCancel(){
      this.priewVisible = false
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    init(queryParam) {
      let that = this
      that.priewVisible = true
      that.extendParam = { ...queryParam }
      that.searchAction()
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    //点击查询
    searchAction() {
      const that = this
      that.loading = true
      let _param = Object.assign({}, that.pagination, that.searchParams, that.extendParam)
      console.log(_param)
      let api = _param.__type === 1
      ? receiveCustomerListReceiveCustomerMail
      : receiveWorkerListReceiveCustomerMail
      return api(_param)
        .then((res) => {
          that.saleCustomers = res.data.records
          that.loading = false
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          this.pagination = pagination
          return res.data
        })
        .catch((error) => {
          console.error(error)
          that.loading = false
        })
    },
    //选择客户
    handlerSelected(record) {
      this.$emit('selected',record)
      this.priewVisible = false
    },
  }
}
</script>

<style scoped>
.search-options {
  display: flex;
  margin-bottom: 10px;
}
.search-options .main-items {
  flex: 1;
}
</style>

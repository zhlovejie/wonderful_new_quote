<template>
  <div>
    <a-table
      :columns="columns"
      rowKey="id"
      :dataSource="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <a slot="customerName" slot-scope="text, record" @click="consumerInfo(record)">{{ text }}</a>

      <a slot="approvalStatus" slot-scope="text, record" @click="approvalPreview(record)">
        <span v-if="parseInt(text) === 0 || parseInt(text) == 4">待审批</span>
        <span v-else-if="parseInt(text) === 2">通过</span>
        <span v-else>不通过</span>
      </a>
      <div slot="contractStatus" slot-scope="text">
        <span v-if="text === -1">请选择合同状态</span>
        <span v-if="text === 0">未启动</span>
        <span v-if="text === 1">已启动</span>
        <span v-if="text === 2">已作废</span>
      </div>
      <div slot="freightCharge" slot-scope="text, record">
        <span>{{
          record.freightType === 0
            ? Math.ceil(record.isTax === 1 ? record.freightCharge * 1.13 : record.freightCharge) || 0
            : '0'
        }}</span>
      </div>
      <div class="action-btns" slot="action" slot-scope="text, record">
        <template v-if="$auth('distributionContract:edit')">
          <a type="primary" v-if="record.contractStatus !== 2" @click="showModal('approval', record)">审批</a>
          <a-divider v-if="record.contractStatus !== 2" type="vertical" />
          <a type="primary" @click="initPriewMessageData(record)">短信记录</a>
        </template>
      </div>
    </a-table>
    <a-modal title="客户信息" v-model="visible" :footer="null" :maskClosable="false">
      <p>客户名称：{{ customerName }}</p>
      <p>联系人：{{ linkManName }}</p>
      <p>联系方式：{{ linkManPhone }}</p>
      <p>微信号：{{ linkManWeChat }}</p>
      <p>地址：{{ customerAddress }}</p>
    </a-modal>
    <a-modal title="审批预览" v-model="priewVisible" :footer="null" :maskClosable="false">
      <a-table
        :columns="priewColumns"
        rowKey="id"
        :dataSource="priewData"
        :pagination="false"
        :loading="loading"
        size="small"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </a-modal>

    <a-modal title="短信记录" v-model="priewMessage" :width="800" :footer="null" :maskClosable="false">
      <a-table
        :columns="priewMessageColumns"
        rowKey="id"
        :dataSource="priewMessageData"
        :pagination="false"
        :loading="loading"
        size="small"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>

        <div slot="userTime" slot-scope="text, record">
          <span>{{ record.userTime }}分钟</span>
        </div>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { getSalesList, getsaveAdditionalClause, contractSms } from '../../../../api/contractListManagement'
import { getCustomerInfo } from '../../../../api/pricingModule'
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
    title: '合同编号',
    dataIndex: 'contractNum',
    key: 'contractNum',
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'saleCustomerName',
    key: 'saleCustomerName',
    scopedSlots: { customRender: 'customerName' },
  },
  {
    align: 'center',
    title: '对应销售',
    key: 'saleUserTrueName',
    dataIndex: 'saleUserTrueName',
    scopedSlots: { customRender: 'saleUserTrueName' },
  },
  {
    align: 'center',
    title: '预定最近交货日期',
    key: 'latelyDeliveryDate',
    dataIndex: 'latelyDeliveryDate',
  },
  {
    align: 'center',
    title: '运费(元)',
    key: 'freightCharge',
    dataIndex: 'freightCharge',
    scopedSlots: { customRender: 'freightCharge' },
    width: '100px',
  },
  {
    align: 'center',
    title: '审批状态',
    dataIndex: 'approvalStatus',
    key: 'approvalStatus',
    scopedSlots: { customRender: 'approvalStatus' },
  },
  {
    align: 'center',
    title: '合同状态',
    key: 'contractStatus',
    dataIndex: 'contractStatus',
    scopedSlots: { customRender: 'contractStatus' },
  },
  {
    align: 'center',
    title: '操作人',
    key: 'modifierName',
    dataIndex: 'modifierName',
  },
  {
    align: 'center',
    title: '操作时间',
    key: 'modifyTime',
    dataIndex: 'modifyTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
const priewColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '审核人',
    dataIndex: 'userName',
    key: 'userName',
    scopedSlots: { customRender: 'userName' },
  },
  {
    align: 'center',
    title: '审核时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    align: 'center',
    title: '备注',
    key: 'code',
    dataIndex: 'code',
  },
]
const priewMessageColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '合同编号',
    dataIndex: 'contractNum',
    key: 'contractNum',
  },
  {
    align: 'center',
    title: '催办人',
    key: 'receiveName',
    dataIndex: 'receiveName',
  },
  {
    align: 'center',
    title: '催办时间',
    key: 'receiveTime',
    dataIndex: 'receiveTime',
  },
  {
    align: 'center',
    title: '解决时间',
    key: 'finishTime',
    dataIndex: 'finishTime',
  },
  {
    align: 'center',
    title: '时长',
    key: 'userTime',
    dataIndex: 'userTime',
    scopedSlots: { customRender: 'userTime' },
  },
]

export default {
  name: 'ApprovalPending',
  components: {},
  props: {
    contractNum: {
      //属性传值：合同编号
      type: String,
      required: true,
    },
    customerId: {
      // type:Number,
      required: true,
    },
    contractStatus: {
      // type:Number,
      required: true,
    },
  },
  data() {
    return {
      data: [],
      columns: columns,
      priewColumns: priewColumns,
      priewMessageData: [],
      priewData: [],
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => '共' + total + '条数据', //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.getList()),
      },
      loading: false,
      visible: false,
      priewVisible: false, // 审批状态弹出层
      customerName: '', // 客户名称
      linkManName: '', // 联系人名称
      linkManPhone: '', // 联系人手机号
      customerAddress: '', // 联系地址
      linkManWeChat: '', // 联系人微信号
      status: 1,
      priewMessageData: [],
      priewMessage: false, //短信记录弹出层
      priewMessageColumns: priewMessageColumns,
    }
  },
  computed: {},
  watch: {},
  cerated() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 获取销售合同列表数据
      this.getList()
    },
    // 获取列表
    getList(params = {}) {
      params = {
        status: this.status,
        contractStatus: this.contractStatus, //合同状态：0未启动 1已启动，不传查所有
        current: params.current || 1,
        contractNum: this.contractNum || '', //不传入合同编号模糊获取到的是所有的信息
        customerId: this.customerId || '', //不传入客户id获取到的是所有的信息
        // contractNum:
      }
      let _searchParam = Object.assign({}, { ...params }, { ...this.pagination1 } || {})
      this.loading = true
      getSalesList(_searchParam)
        .then((res) => {
          console.log('获取销售合同列表结果', res)
          const pagination = { ...this.pagination }
          pagination.total = res.data.total || 0
          this.loading = false
          this.data = res.data.records
          console.log('获取销售合同列表结果', this.data)
          this.pagination = pagination
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.getList()
    },

    // 客户信息弹框
    consumerInfo(record) {
      this.visible = true
      const params = {
        id: record.customerId,
      }
      // 获取客户信息
      getCustomerInfo(params)
        .then((res) => {
          console.log('//获取客户信息', res)
          ;(this.customerName = res.data.customerName),
            (this.linkManName = res.data.linkManName),
            (this.linkManPhone = res.data.linkManPhone),
            (this.customerAddress = res.data.customerAddress),
            (this.linkManWeChat = res.data.linkManWeChat)
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    // 审批预览弹出层
    approvalPreview(record) {
      this.priewVisible = true
      const params = {
        contractId: record.id,
      }
      //获取审批预览信息
      getsaveAdditionalClause(params)
        .then((res) => {
          console.log('//获取审批预览信息', res)
          this.priewData = res.data
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    //短信弹出层
    initPriewMessageData(record) {
      this.priewMessage = true
      //获取审批预览信息
      contractSms(record.id, record.contractNum)
        .then((res) => {
          console.log('//获取审批预览信息--', JSON.stringify(res))
          this.priewMessageData = res.data
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
          this.priewMessageData = []
        })
    },
    // showModal(action, record){
    // if(record.contractAttribute===1){  //选择三方合同
    //   this.$router.push({name:'previewTripartiteContract',params:{queryOneData:record,action:action}})
    //   console.log('queryOneData:record',record)
    // }else{
    //   if(record.isTax ===0){    //含税--选择销售合同
    //     this.$router.push({name:'previewSalesContract',params:{queryOneData:record,action:action}})
    //     console.log('queryOneData:record',record)
    //   }else{
    //     this.$router.push({name:'previewProductOrderForm',params:{queryOneData:record,action:action}})
    //     console.log('queryOneData:record',record)
    //   }
    // }
    // },
    showModal(action, record) {
      if (record.contractAttribute === 1) {
        // 选择三方合同
        this.$router.push({ name: 'previewTripartiteContract', params: { queryOneData: record, action: action } })
      } else {
        if (record.isTax === 1) {
          // 含税--选择销售合同
          this.$router.push({ name: 'previewSalesContract', params: { queryOneData: record, action: action } })
        } else {
          this.$router.push({ name: 'previewProductOrderForm', params: { queryOneData: record, action: action } })
        }
      }
    },
    // 查看销售订单,跳转到销售订单页面，并向目标页面传递参数
    viewSalesOrders(record) {
      this.$router.push({ name: 'orderModule', params: { record: record, show: true } })
    },
    exportWord(record) {
      var link = document.createElement('a')
      link.href = record.wordUrl
      link.download = 'lslsls'
      link.target = '_blank'
      // 此写法兼容可火狐浏览器
      document.body.appendChild(link)
      var evt = document.createEvent('MouseEvents')
      evt.initEvent('click', false, false)
      link.dispatchEvent(evt)
      document.body.removeChild(link)
    },
  },
}
</script>

<style lang="less" scoped>
.action-btns button:not(:first-child) {
  margin-left: 8px;
}
</style>

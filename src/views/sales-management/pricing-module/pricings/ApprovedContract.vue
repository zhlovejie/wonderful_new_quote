<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :expandedRowKeys="expandedRowKeys"
      @expand="expandHandler"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <template slot="customerName" slot-scope="text, record">
        <span v-if="record.userSign === 2">***</span>
        <a @click="consumerInfo(record)" v-else>{{ text }}</a>
      </template>
      <a slot="valencyCode" slot-scope="text, record" @click="lookApplyNuclear(record)">{{ text }}</a>
      <a slot="valencyStatus" slot-scope="text, record" @click="approvalPreview(record)">
        <span v-if="text === 0">待接收</span>
        <span v-else-if="text === 1">已接收待核价</span>
        <span v-else-if="text === 2">驳回</span>
        <span v-else-if="text === 3">核价通过</span>
        <span v-else-if="text === 4">待生成代码</span>
        <span v-else-if="text === 5">代码已生成</span>
      </a>
      <div slot="explainText" slot-scope="text">
        <a-tooltip v-if="String(text).length > 10">
          <template slot="title">{{ text }}</template>
          {{ String(text).slice(0, 10) }}...
        </a-tooltip>
        <span v-else>{{ text }}</span>
      </div>
      <div slot="action" slot-scope="text, record">
        <a class="btn-action" type="primary" @click="lookApplyNuclear(record)">查看</a>
        <template v-if="record.valencyUserId === userInfo.id && record.valencyStatus === 4">
          <a-divider type="vertical" />
          <a class="btn-action" type="primary" @click="$refs.addCode.showForm(record.id, 'code')">生成代码</a>
        </template>
        <template v-if="record.valencyUserId === userInfo.id && record.valencyStatus >= 3">
          <a-divider type="vertical" />
          <a class="btn-action" type="primary" @click="updateNuclear(record)">修改</a>
        </template>
      </div>

      <a-table
        slot="expandedRowRender"
        slot-scope="record, index, indent, expanded"
        :columns="innerColumns"
        :dataSource="record.productListVos"
        :pagination="false"
        size="small"
      >
        <div slot="costPrice" slot-scope="text, record1">
          <span v-if="+record.userSign === 2">{{ record1.costPrice | moneyFormatNumber }}</span>
          <span v-else>***</span>
        </div>

        <div slot="aprice" slot-scope="text, record">
          <span>{{ record.aPrice | moneyFormatNumber }}</span>
        </div>
        <div slot="bprice" slot-scope="text, record">
          <span>{{ record.bPrice | moneyFormatNumber }}</span>
        </div>
        <div slot="cprice" slot-scope="text, record">
          <span>{{ record.cPrice | moneyFormatNumber }}</span>
        </div>
        <div slot="productName" slot-scope="text, record">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 10) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>
        <div slot="valencySpecs" slot-scope="text">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 10) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>

        <div slot="toolProductName" slot-scope="text">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 10) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>

        <div slot="toolProductStandard" slot-scope="text">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 10) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>

        <div slot="newBasisModel" slot-scope="text">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 10) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>

        <div slot="toolProductModel" slot-scope="text">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 10) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>
      </a-table>
    </a-table>
    <a-modal title="客户信息" v-model="visible" :footer="null" :maskClosable="false">
      <p>客户名称：{{ customerName }}</p>
      <p>联系人：{{ linkManName }}</p>
      <p>联系方式：{{ linkManPhone }}</p>
      <p>微信号：{{ linkManWeChat }}</p>
      <p>地址：{{ customerAddress }}</p>
    </a-modal>
    <a-modal title="审批预览" v-model="priewVisible" :footer="null" :maskClosable="false">
      <a-table :columns="priewColumns" rowKey="id" :dataSource="priewData" :pagination="false" :loading="loading">
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </a-modal>
    <add-code-and-name ref="addCode" @ok="getList" />
  </div>
</template>

<script>
import AddCodeAndName from './AddCodeAndName'
import { getCustomerInfo, getPriceList, getSaleValencyInfo } from '../../../../api/pricingModule'
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
    title: '核价编号',
    dataIndex: 'valencyCode',
    key: 'valencyCode',
    scopedSlots: { customRender: 'valencyCode' },
  },
  {
    align: 'center',
    title: '需求日期',
    key: 'demandTime',
    dataIndex: 'demandTime',
  },
  {
    align: 'center',
    title: '单据状态',
    dataIndex: 'valencyStatus',
    key: 'valencyStatus',
    scopedSlots: { customRender: 'valencyStatus' },
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'customerName',
    key: 'customerName',
    scopedSlots: { customRender: 'customerName' },
  },
  {
    align: 'center',
    title: '核价说明',
    dataIndex: 'explainText',
    key: 'explainText',
    scopedSlots: { customRender: 'explainText' },
  },
  {
    align: 'center',
    title: '提交人',
    key: 'applyUserName',
    dataIndex: 'applyUserName',
  },
  {
    align: 'center',
    title: '提交时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },

  // {
  //   align: 'center',
  //   title: '核价人',
  //   key: 'valencyUserName',
  //   dataIndex: 'valencyUserName',
  //   scopedSlots: { customRender: 'valencyUserName' }
  // },
  // {
  //   align: 'center',
  //   title: '接收时间',
  //   key: 'receiveTime',
  //   dataIndex: 'receiveTime'
  // },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
const innerColumns = [
  {
    align: 'center',
    title: '依据产品代码',
    dataIndex: 'toolProductModel',
    key: 'toolProductModel',
    width: '200px',
    scopedSlots: { customRender: 'toolProductModel' },
  },
  {
    align: 'center',
    title: '依据产品名称',
    dataIndex: 'toolProductName',
    key: 'toolProductName',
    scopedSlots: { customRender: 'toolProductName' },
    width: '200px',
  },
  {
    align: 'center',
    title: '依据规格型号',
    dataIndex: 'toolProductStandard',
    key: 'toolProductStandard',
    scopedSlots: { customRender: 'toolProductStandard' },
    width: '200px',
  },
  {
    align: 'center',
    title: '产品代码',
    dataIndex: 'newBasisModel',
    key: 'newBasisModel',
    width: '200px',
    scopedSlots: { customRender: 'newBasisModel' },
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    scopedSlots: { customRender: 'productName' },
    width: '200px',
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'valencySpecs',
    key: 'valencySpecs',
    scopedSlots: { customRender: 'valencySpecs' },
    width: '200px',
  },
  {
    align: 'center',
    title: '成本价',
    scopedSlots: { customRender: 'costPrice' },
    width: '120px',
  },
  {
    align: 'center',
    title: 'A价（元）',
    scopedSlots: { customRender: 'aprice' },
    width: '120px',
  },
  {
    align: 'center',
    title: 'B价（元）',
    scopedSlots: { customRender: 'bprice' },
    width: '120px',
  },
  {
    align: 'center',
    title: 'C价（元）',
    scopedSlots: { customRender: 'cprice' },
    width: '120px',
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
    title: '审核节点',
    dataIndex: 'code',
    key: 'code',
    scopedSlots: { customRender: 'code' },
  },
  {
    align: 'center',
    title: '审核时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
]
export default {
  name: 'ApprovedContract',
  components: { AddCodeAndName },

  data() {
    return {
      userInfo: this.$store.getters.userInfo,
      data: [],
      priewData: [],
      columns: columns,
      innerColumns: innerColumns,
      priewColumns: priewColumns,
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.getList()),
      },
      loading: false,
      visible: false,
      priewVisible: false,
      customerName: '', // 客户名称
      linkManName: '', // 联系人名称
      linkManPhone: '', // 联系人手机号
      customerAddress: '', // 联系地址
      linkManWeChat: '', // 联系人微信号
      valencyCode: '', // 核价编号
      searchParams: {},
      isExpanded: false, //是否展开列表子数据
      expandedRowKeys: [],
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
      // 获取核价单列表数据
      //this.getList()
    },
    // 获取列表
    getList(params = {}) {
      this.searchParams = Object.assign({}, { ...this.searchParams }, { ...this.pagination1 }, params)
      // params = {
      //   valencyCode: this.priceModelInput || '', // 不传入核价编号获取到的是所有的岗位信息
      //   customerName: this.customerInput || '', // 不传入客户名称模糊获取到的是所有的岗位信息
      //   current: params.current || 1,
      //   valencyStatus: 3
      // }
      this.loading = true
      console.log(this.searchParams)
      getPriceList(this.searchParams)
        .then((res) => {
          console.log('获取核价列表结果', res)
          const pagination = { ...this.pagination }
          pagination.total = res.data.total || 0
          this.loading = false
          this.data = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          this.expandedRowKeys = this.isExpanded ? this.data.map((item) => item.key) : []
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
    // 点击核价编号和查看按钮，查看核价订单
    lookApplyNuclear(record) {
      const id = record.id
      // 跳转到查看核价详情页面，并携带所要传递的参数传递到目标页面
      this.$router.push({ name: 'LookNuclearPrice', params: { id: id } }) // 跳转至ApplyNuclearPrice路由并传递一个数据
    },
    // 审批预览弹出层
    approvalPreview(record) {
      this.priewVisible = true
      const params = {
        id: record.id,
      }
      // 获取审批预览信息
      getSaleValencyInfo(params)
        .then((res) => {
          this.priewData = res.data
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    // 客户信息弹框
    consumerInfo(record) {
      this.visible = true
      const params = {
        id: record.consumerId,
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
    updateNuclear(record) {
      const id = record.id
      console.log('点击了核价按钮，跳转核价页面', id)
      // 跳转到核价页面，并携带所要传递的参数传递到目标页面
      this.$router.push({ name: 'NuclearPriceApproval', params: { id: id, type: 'update' } }) // 跳转至NuclearPriceApproval.vue路由并传递一个数据
    },
    expandHandler(expanded, record) {
      console.log(arguments)
      if (expanded) {
        this.expandedRowKeys = [...this.expandedRowKeys, record.key]
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter((val) => val !== record.key)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.btn-action ~ .btn-action {
  margin-left: 6px;
}
</style>

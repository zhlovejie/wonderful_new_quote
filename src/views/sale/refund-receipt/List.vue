<template>
  <!-- 退款单 -->
  <div class="refund-receipt-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="退款编号模糊查询" v-model="refundNum" style="width: 150px" />
      <a-select
        optionFilterProp="children"
        showSearch
        :allowClear="true"
        :filterOption="filterSalersOption"
        placeholder="请选择销售人员"
        style="width: 200px"
        v-model="saleUserId"
      >
        <a-select-option v-for="item in saleUser" :value="item.userId" :key="item.userId">{{
          item.salesmanName
        }}</a-select-option>
      </a-select>
      <a-select placeholder="选择退款类型" :allowClear="true" v-model="refundType" style="width: 200px">
        <a-select-option :value="1">代理保证金</a-select-option>
        <a-select-option :value="2">投标保证金</a-select-option>
        <a-select-option :value="3">退货款</a-select-option>
        <a-select-option :value="4">其他</a-select-option>
      </a-select>

      <a-select v-if="activeKey === 0" placeholder="处理状态" :allowClear="true" v-model="status" style="width: 120px">
        <a-select-option :value="0">待审批</a-select-option>
        <a-select-option :value="1">通过</a-select-option>
        <a-select-option :value="2">不通过</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button
        class="a-button"
        style="float: right"
        type="primary"
        icon="plus"
        @click="doAction('add', null)"
        v-if="$auth('refund:add')"
        >新增</a-button
      >
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('refund:approval')">
          <a-tab-pane tab="待审批" key="1" />
          <a-tab-pane tab="已审批" key="2" />
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

        <div slot="status" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStatusText(text) }}</a>
        </div>

        <div slot="refundType" slot-scope="text">
          <span>{{ getRefundTypeText(text) }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 单据审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <template v-if="$auth('refund:edit') && (+record.status === 2 || +record.status === 9)">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit', record)">修改</a>
            </template>
            <template v-if="record.status === 0">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
            <template v-if="+record.status === 2 || +record.status === 9">
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 1">
            <a type="primary" @click="doAction('view', record)">查看</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>

          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>
<script>
import { getListSaleContractUser } from '@/api/contractListManagement'
import { refundPageList, refundRevocation, refundDel } from '@/api/receipt'
import AddForm from './module/AddForm'
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
    title: '退款编号',
    dataIndex: 'refundNum',
    key: 'refundNum',
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    align: 'center',
    title: '对应销售',
    dataIndex: 'saleUserName',
    key: 'saleUserName',
  },
  {
    align: 'center',
    title: '退款类型',
    dataIndex: 'refundType',
    key: 'refundType',
    scopedSlots: { customRender: 'refundType' },
  },
  {
    align: 'center',
    title: '已收款金额',
    key: 'alreadyTaxAmount',
    dataIndex: 'alreadyTaxAmount',
  },
  {
    align: 'center',
    title: '开票金额',
    key: 'alreadyPaperAmount',
    dataIndex: 'alreadyPaperAmount',
  },
  {
    align: 'center',
    title: '退款总金额',
    key: 'refundAmountMoney',
    dataIndex: 'refundAmountMoney',
  },
  {
    align: 'center',
    title: '单据状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '申请人',
    dataIndex: 'createdUserName',
    key: 'createdUserName',
  },
  {
    align: 'center',
    title: '申请时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'refundReceipt',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
  },
  data() {
    return {
      refundNum: undefined,
      saleUserId: undefined,
      refundType: undefined,
      status: undefined,
      saleUser: [],
      approval_status: undefined,
      activeKey: 0,
      columns: columns,
      dataSource: [],
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      loading: false,
    }
  },
  computed: {
    searchParam() {
      return {
        refundNum: this.refundNum,
        saleUserId: this.saleUserId,
        refundType: this.refundType,
        status: this.status,
        searchStatus: this.approval_status,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'refundReceipt') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      getListSaleContractUser().then((res) => (that.saleUser = res.data))
      that.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      refundPageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
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
    doAction(type, record) {
      let that = this
      console.log(type)

      if (type === 'reback') {
        refundRevocation({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }

      if (type === 'del') {
        refundDel({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
      that.$refs.addForm.query(type, record)
    },
    getStatusText(state) {
      let stateMap = {
        0: '待审批',
        1: '通过',
        2: '不通过',
        9: '已撤回',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    getRefundTypeText(type) {
      let map = {
        1: '代理保证金',
        2: '投标保证金',
        3: '退货款',
        4: '其他',
      }
      return map[type] || `未知:${type}`
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style scoped>
.refund-receipt-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.refund-receipt-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>

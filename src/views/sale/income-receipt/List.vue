<template>
  <!-- 进款单 -->
  <div class="container-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="客户名称/个人名称模糊查询" :allowClear="true" v-model="customerName" style="width: 200px" />
      <a-input placeholder="认领人模糊查询" :allowClear="true" v-model="claimUserName" style="width: 200px" />
      <a-select placeholder="收款银行" :allowClear="true" v-model="accountId" style="width: 200px">
        <a-select-option :key="item.id" v-for="item in moneyTypes" :value="item.id">{{
          item.unitName
        }}</a-select-option>
      </a-select>
      <a-select placeholder="处理状态" :allowClear="true" v-model="status" style="width: 120px">
        <a-select-option :value="0">未认领</a-select-option>
        <a-select-option :value="1">已认领</a-select-option>
      </a-select>
      <a-range-picker v-model="sDate" />

      <a-button v-if="$auth('income:one')" class="a-button" type="primary" icon="search" @click="searchAction"
        >查询</a-button
      >
      <a-button
        class="a-button"
        style="float: right"
        type="primary"
        icon="plus"
        @click="doAction('add', null)"
        v-if="$auth('income:add')"
        >新增</a-button
      >
    </div>
    <div class="main-wrapper">
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
        <div slot="status" slot-scope="text, record">
          <span>{{ record.status === 0 ? '未认领' : '已认领' }}</span>
        </div>
        <div slot="amount" slot-scope="text, record">
          <span>{{ (record.amount || 0) | moneyFormatNumber }}</span>
        </div>
        <div slot="remark" slot-scope="text, record">
          <a-popover trigger="hover" v-if="record.remark && typeof record.remark === 'string'">
            <template slot="content">
              <p>{{ text }}</p>
            </template>
            <span>{{ text.length > 5 ? text.slice(-5) + '...' : text }}</span>
          </a-popover>
          <span v-else>无</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a
            v-if="$auth('income:edit') && userInfo.id === record.createdUserId"
            type="primary"
            @click="doAction('edit', record)"
            >修改</a
          >
          <template v-if="$auth('income:claim') && record.status === 0">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('get', record)">认领</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>
<script>
import { incomePageList, incomeClaim, getAccountBankList } from '@/api/receipt'
import AddForm from './module/AddForm'
import moment from 'moment'
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
    title: '进款单编号',
    dataIndex: 'incomeNum',
    key: 'incomeNum',
  },
  {
    align: 'center',
    title: '收款银行',
    dataIndex: 'accountName',
    key: 'accountName',
  },
  {
    align: 'center',
    title: '客户名称/个人名称',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    align: 'center',
    title: '收款日期',
    dataIndex: 'incomeTime',
    key: 'incomeTime',
  },
  {
    align: 'center',
    title: '账户',
    dataIndex: 'customerAccount',
    key: 'customerAccount',
  },
  {
    align: 'center',
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    scopedSlots: { customRender: 'amount' },
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    scopedSlots: { customRender: 'remark' },
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
    title: '认领人',
    dataIndex: 'claimName',
    key: 'claimName',
  },
  {
    align: 'center',
    title: '认领时间',
    key: 'claimTime',
    dataIndex: 'claimTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'presentReceipt',
  components: {
    AddForm,
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo,
      customerName: undefined,
      claimUserName: undefined,
      accountId: undefined,
      status: undefined,
      sDate: [undefined, undefined],
      moneyTypes: [],
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
      let startTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        startTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') + ' 00:00:00' : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') + ' 23:59:59' : undefined
      }
      return {
        customerName: this.customerName,
        claimUserName: this.claimUserName,
        accountId: this.accountId,
        status: this.status,
        incomeBeginTime: startTime,
        incomeEndTime: endTime,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'incomeReceipt') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      getAccountBankList().then((res) => (that.moneyTypes = res.data))
      that.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      incomePageList(_searchParam)
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
      if (type === 'get') {
        this.$confirm({
          title: '提示信息',
          content: '确定认领此进款单吗？',
          onOk() {
            incomeClaim({ incomeId: record.id }).then((res) => {
              console.log(res)
              if (res.code === 200) {
                that.$message.info(res.msg)
                that.searchAction()
              } else {
                that.$message.info(res.msg)
              }
            })
          },
          onCancel() {},
        })
      } else {
        that.$refs.addForm.query(type, record)
      }
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style scoped>
.container-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.container-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>

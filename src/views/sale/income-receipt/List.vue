<template>
  <!-- 进款单 -->
  <div class="container-list-wrapper">
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
      <a-button
        class="a-button"
        style="margin-bottom: 20px; margin-left: 10px"
        type="primary"
        icon="search"
        @click="openSearchModel"
        >高级筛选</a-button
      >
      <a-button class="a-button" type="primary" icon="download" @click="exportHandler">导出</a-button>
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
    <!-- <div class="search-wrapper">
      
      <a-input placeholder="客户/个人名称模糊查询" :allowClear="true" v-model="customerName" style="width: 200px" />
      <a-select
        optionFilterProp="children"
        showSearch
        :allowClear="true"
        :filterOption="filterSalersOption"
        placeholder="销售经理"
        style="width: 160px"
        v-model="saleUserId"
      >
        <a-select-option v-for="item in saleUser" :value="item.userId" :key="item.userId">{{
          item.salesmanName
        }}</a-select-option>
      </a-select>

      <a-input placeholder="认领人模糊查询" :allowClear="true" v-model="claimUserName" style="width: 160px" />
      <a-select placeholder="收款银行" :allowClear="true" v-model="accountId" style="width: 260px">
        <a-select-option :key="item.id" v-for="item in moneyTypes" :value="item.id">{{
          item.unitName
        }}</a-select-option>
      </a-select>
      <a-range-picker v-model="sDate" style="width: 200px"/>

      <a-button
        v-if="$auth('income:one')"
        class="a-button"
        type="primary"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <a-button class="a-button" type="primary" icon="download" @click="exportHandler">导出</a-button>
      <a-button
        class="a-button"
        style="float: right"
        type="primary"
        icon="plus"
        @click="doAction('add', null)"
        v-if="$auth('income:add')"
        >新增</a-button
      >
    </div> -->
    <div class="main-wrapper">
      <a-alert :message="searchTotalMoney" type="info" />
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="未认领" key="0" />
        <a-tab-pane tab="已认领" key="1" />
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

        <div slot="dicId" slot-scope="text, record">
          <span>{{ getMoneyCategorys(text) }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>
          <a
            v-if="+activeKey === 0 && $auth('income:edit') && userInfo.id === record.createdUserId"
            type="primary"
            style="margin-left: 10px"
            @click="doAction('edit', record)"
            >修改</a
          >
          <template v-if="+activeKey === 0 && record.status === 0 && $auth('income:claim')">
            <a type="primary" style="margin-left: 10px" @click="doAction('get', record)">认领</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction()" />
    <SearchForm ref="searchForm" @change="paramChangeHandler" />

    <a-modal
      v-model="moneyCategoryVisible"
      title="选择款项类别"
      :ok-button-props="{ props: { disabled: !moneyCategory } }"
      @ok="moneyCategoryHandleOk"
      @cancel="moneyCategoryHandleCancel"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <p>请先选择款项类别后，进行认领操作。</p>
      <div>
        <a-radio-group v-model="moneyCategory">
          <a-radio v-for="item in moneyCategorys" :key="item.id" :value="item.id"> {{ item.text }} </a-radio>
        </a-radio-group>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { incomePageList, incomeClaim, saleIncomeGetSumAmountByList } from '@/api/receipt'
import AddForm from './module/AddForm'
import moment from 'moment'
import SearchForm from './module/SearchForm'
// import { getListSaleContractUser } from '@/api/contractListManagement'
import { exprotAction } from '@/api/receipt'
import { getListByText } from '@/api/workBox'
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
    title: '销售经理',
    dataIndex: 'saleUserName',
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
    title: '分类',
    dataIndex: 'dicId',
    scopedSlots: { customRender: 'dicId' },
  },

  // {
  //   align: 'center',
  //   title: '单据状态',
  //   key: 'status',
  //   dataIndex: 'status',
  //   scopedSlots: { customRender: 'status' },
  // },
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
    SearchForm,
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo,
      // customerName: undefined,
      // claimUserName: undefined,
      // accountId: undefined,
      // status: undefined,
      // sDate: [undefined, undefined],
      // saleUserId: undefined,
      dayWeekMonth: 1,
      searchParam: { dayWeekMonth: 1 },
      moneyTypes: [],
      columns: columns,
      dataSource: [],
      //pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => {
          this.pagination = { ...this.pagination, pageSize }
          this.searchAction()
        },
      },
      loading: false,
      activeKey: 0,
      saleUser: [],
      searchTotalMoney: '',
      moneyCategorys: [],
      moneyCategory: undefined,
      moneyCategoryVisible: false,
      record: {},
    }
  },
  computed: {
    // searchParam() {
    //   let startTime = undefined,
    //     endTime = undefined
    //   if (Array.isArray(this.sDate) && this.sDate.length === 2) {
    //     startTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') + ' 00:00:00' : undefined
    //     endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') + ' 23:59:59' : undefined
    //   }
    //   return {
    //     current: 1,
    //     customerName: this.customerName,
    //     claimUserName: this.claimUserName,
    //     accountId: this.accountId,
    //     //status: this.status,
    //     incomeBeginTime: startTime,
    //     incomeEndTime: endTime,
    //     status: this.activeKey,
    //     saleUserId: this.saleUserId,
    //   }
    // },
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
    //高级筛选打开
    openSearchModel() {
      this.$refs.searchForm.query(this.activeKey)
    },
    //高级筛选返回数据
    paramChangeHandler(params) {
      this.searchParam = { ...this.searchParam, ...params, dayWeekMonth: this.dayWeekMonth }
      this.searchAction()
    },
    simpleSearch(type) {
      if (type === 4) {
        this.searchParam.dayWeekMonth = undefined
        this.dayWeekMonth = undefined
        this.searchParam = { ...this.searchParam, dayWeekMonth: this.dayWeekMonth }
        this.searchAction()
      } else {
        this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
        this.searchParam = { ...this.searchParam, dayWeekMonth: this.dayWeekMonth }
        this.searchAction()
      }
    },
    init() {
      let that = this
      // getAccountBankList().then((res) => (that.moneyTypes = res.data))
      // getListSaleContractUser().then((res) => (that.saleUser = res.data))

      getListByText({ text: '认领金额类型' }).then((res) => {
        that.moneyCategorys = res.data.records
      })

      that.searchAction()
    },
    searchAction(opt) {
      let that = this
      let { pageSize, current } = that.pagination
      let _searchParam = Object.assign(
        {},
        { ...that.searchParam },
        {
          size: pageSize,
          current,
        },
        opt || {},
        {
          searchStatus: that.activeKey,
        }
      )
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
          pagination.pageSize = +res.data.size
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))

      saleIncomeGetSumAmountByList(_searchParam)
        .then((res) => {
          console.log(that, res)
          if (+res.code !== 200) {
            let msg = `获取【汇总合计金额】接口出错，错误代码:${res.code} 错误消息：${res.msg}。`
            msg += `查询参数:${_searchParam}，`
            msg += '请与管理员联系，谢谢合作。'
            that.searchTotalMoney = 0
            that.$message.error(msg)
            return
          }
          that.searchTotalMoney = `本次搜索汇总合计金额：${that.$root._f('moneyFormatNumber')(res.data)}`
        })
        .catch((err) => {
          that.$message.error(err.message)
        })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = {
        ...this.pagination,
        pageSize: pagination.pageSize,
        current: pagination.current,
      }
      this.searchAction()
    },
    moneyCategoryHandleOk() {
      const that = this
      incomeClaim({ incomeId: that.record.id, amountType: that.moneyCategory }).then((res) => {
        console.log(res)
        that.$message.info(res.msg)
        if (res.code === 200) {
          that.searchAction()
        }
        that.moneyCategoryVisible = false
        that.moneyCategory = undefined
      })
    },
    moneyCategoryHandleCancel() {
      this.moneyCategoryVisible = false
      this.moneyCategory = undefined
    },
    doAction(type, record) {
      let that = this
      console.log(type)
      that.record = { ...record }
      if (type === 'get') {
        //that.moneyTypeHandleOk(record)
        that.moneyCategoryVisible = true
        return
      } else {
        that.$refs.addForm.query(type, record)
      }
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    tabChange(key) {
      this.activeKey = +key
      this.pagination = { ...this.pagination, current: 1 }
      this.searchAction()
    },
    async exportHandler() {
      const that = this
      let res = await exprotAction(9, { ...that.searchParam }, '进款单')
      console.log(res)
      that.$message.info(res.msg)
    },
    getMoneyCategorys(type) {
      let target = this.moneyCategorys.find((item) => +item.id === +type)
      return target ? target.text : '-'
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

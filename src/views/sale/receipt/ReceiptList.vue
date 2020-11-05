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
          <a-button class="a-button" type="primary" icon="search" @click="openSearchModel">高级筛选</a-button>
        </a-form-item>
        <!-- <a-form-item label="客户名称">
          <a-input v-model="customerName"/>
        </a-form-item>
        <a-form-item label="单据状态" v-show="showFlag">
          <a-select  v-model="approveStatus" style="width: 150px" >
            <a-select-option :value="0">请选择审批状态</a-select-option>
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>  </a-select>
        </a-form-item>
        <a-form-item>
          <template v-if="$auth('receipt:list')">
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item> -->
        <div class="table-operator fl-r">
          <a-dropdown>
            <a-menu slot="overlay" @click="handleAdd">
              <a-menu-item key="1"><a-icon type="file" />销售收款单</a-menu-item>
              <a-menu-item key="2"><a-icon type="file" />软件收款单</a-menu-item>
            </a-menu>
            <a-button type="primary" style="margin-left: 8px"> 新建 <a-icon type="plus" /> </a-button>
          </a-dropdown>
        </div>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="全部" key="0" forceRender> </a-tab-pane>

            <template v-if="$auth('receipt:approval')">
              <a-tab-pane tab="待审批" key="4"> </a-tab-pane>
              <a-tab-pane tab="已审批" key="2"> </a-tab-pane>
            </template>
          </a-tabs>
        </div>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :expandedRowKeys="expandedRowKeys"
          @expand="expandHandler"
        >
          <span slot="contractNum" slot-scope="text, record">
            <a @click="tendering(record)">{{ text }}</a>
          </span>
          <span slot="customerName" slot-scope="text, record">
            <a @click="tenderingClick(record)">{{ text }}</a>
          </span>
          <span slot="receiptTime" style="display: inline-block; width: 100px" slot-scope="text">
            {{ text.substr(0, 11) }}
          </span>
          <div slot="receiptStatus" slot-scope="text, record">
            <a @click="handleClick(record)" v-if="text == 1">待审批</a>
            <a @click="handleClick(record)" v-if="text == 2">通过</a>
            <a @click="handleClick(record)" v-if="text == 3">不通过</a>
            <a @click="handleClick(record)" v-if="text == 9">已撤回</a>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('receipt:one')">
              <a @click="handleVue(record)">查看</a>
            </template>
            <template v-if="$auth('receipt:edit') && audit">
              <a-divider type="vertical" />
              <a @click="handleAudit(record)">审核</a>
            </template>
            <template
              v-if="$auth('receipt:edit') && (+record.receiptStatus === 3 || +record.receiptStatus === 9) && userInfo.id === record.createdId"
            >
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">重新提交</a>
            </template>
            <template
              v-if="$auth('receipt:del') && !audit && userInfo.id === record.createdId && record.receiptStatus === 2"
            >
              <a-divider type="vertical" />
              <a class="delete" @click="() => del(record)">删除</a>
            </template>
            <template
              v-if="!audit && record.receiptStatus === 1"
            >
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback',record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
          </span>

          <a-table
            slot="expandedRowRender"
            slot-scope="record, index, indent, expanded"
            :columns="innerColumns"
            :dataSource="record.productList"
            :pagination="false"
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>
            <div slot="paidMoney1" slot-scope="text, record">
              <span>{{ record.paidMoney | moneyFormatNumber }}</span>
            </div>
            <div slot="paidType" slot-scope="text">
              <span>{{ getPayType(text) }}</span>
            </div>
            <div slot="freightCharge" slot-scope="text, record">
              <span>{{ record.freightCharge | moneyFormatNumber }}</span>
            </div>
            <div slot="settlementDiscount" slot-scope="text, record">
              <span>{{ record.settlementDiscount | moneyFormatNumber }}</span>
            </div>

            <div slot="productModel" slot-scope="text">
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 10) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
            <div slot="productName" slot-scope="text">
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 10) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
          </a-table>
        </a-table>
      </a-col>
    </a-row>
    <InvestigateNode ref="node" />
    <Tendering ref="tenderingModel"></Tendering>
    <SearchForm ref="searchForm" @change="paramChangeHandler" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { deleteReceipt, getContractOne, getServiceList,revocationReceipt } from '@/api/receipt'
import ReceiptAdd from './ReceiptAdd'
import InvestigateNode from '../record/InvestigateNode'
import Tendering from '../record/TenderingUnit'
import SearchForm from './SearchForm'

const innerColumns = [
  {
    align: 'center',
    title: '产品代码',
    dataIndex: 'productModel',
    key: 'productModel',
    width: '200px',
    scopedSlots: { customRender: 'productModel' },
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
    title: '金额',
    dataIndex: 'countMoney',
    key: 'countMoney',
    scopedSlots: { customRender: 'countMoney' },
    width: '120px',
  },
  {
    align: 'center',
    title: '结算方式',
    dataIndex: 'paidType',
    key: 'paidType',
    width: '100px',
    scopedSlots: { customRender: 'paidType' },
  },
  {
    align: 'center',
    title: '运费',
    dataIndex: 'freightCharge',
    key: 'freightCharge',
    scopedSlots: { customRender: 'freightCharge' },
    width: '120px',
  },
  {
    align: 'center',
    title: '本次实收金额',
    key: 'paidMoney1',
    scopedSlots: { customRender: 'paidMoney1' },
    width: '120px',
  },
  {
    align: 'center',
    title: '结算折扣金额',
    dataIndex: 'settlementDiscount',
    key: 'settlementDiscount',
    scopedSlots: { customRender: 'settlementDiscount' },
    width: '120px',
  },
]
export default {
  name: 'ReceiptList',
  components: {
    Tendering,
    InvestigateNode,
    ReceiptAdd,
    STable,
    SearchForm,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: {
        dayWeekMonth: 1,
      },
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      vueBoolean: this.$store.getters.vueBoolean,
      customerName: '',
      saleCustomers: [],
      approveStatus: 0,
      audit: false,
      showFlag: true,
      contractStatus: [
        {
          id: 0,
          name: '请选择状态',
        },
        {
          id: 1,
          name: '待审批',
        },
        {
          id: 2,
          name: '通过',
        },
        {
          id: 3,
          name: '不通过',
        },
      ],
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
          title: '收款编号',
          dataIndex: 'receiptCode',
        },
        {
          title: '合同编号',
          dataIndex: 'contractNum',
          scopedSlots: { customRender: 'contractNum' },
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'customerName' },
          width: '200px',
        },
        {
          title: '收款日期',
          dataIndex: 'receiptTime',
          scopedSlots: { customRender: 'receiptTime' },
          width: 100,
        },
        {
          title: '结算方式',
          dataIndex: 'moneyTypeName',
        },
        {
          title: '本次实收金额',
          dataIndex: 'paidMoney',
          scopedSlots: { customRender: 'paidMoney' },
        },
        {
          title: '单据状态',
          dataIndex: 'receiptStatus',
          scopedSlots: { customRender: 'receiptStatus' },
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

          scopedSlots: { customRender: 'action' },
        },
      ],
      innerColumns: innerColumns,
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('开始加载数据', JSON.stringify(this.queryParam))
        return getServiceList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      dayWeekMonth: 1,

      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      isExpanded: false, //是否展开列表子数据
      expandedRowKeys: [],
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'receiptList') {
          this.searchAction()
        }
      },
      immediate: true,
    },
  },
  methods: {
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getServiceList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })

          that.expandedRowKeys = that.isExpanded ? that.dataSource.map((item) => item.key) : []

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    handleAdd(e) {
      if (e.key === '1') {
        //点击返回，返回核价单列表页
        this.$router.push({ name: 'ReceiptAdd', params: { id: null, action: 'add', contractType: e.key } })
      }
      if (e.key === '2') {
        this.$router.push({ name: 'ReceiptSoftwareAdd', params: { id: null, action: 'add', contractType: e.key } })
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleClick(record) {
      console.log('JSON.stringify(record) :' + JSON.stringify(record))
      this.$refs.node.query(record)
      // this.searchAction()
    },
    handleSaveOk() {
      this.searchAction()
    },
    handleSaveClose() {},
    del(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除编号为: ${row.receiptCode} 的收款单吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          deleteReceipt({ id: row.id }).then((res) => {
            if (res.code == 200) {
              _this.searchAction()
            } else {
              _this.$message.error(res.msg)
            }
          })

          console.log('OK')
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    tendering(record) {
      console.log('record' + JSON.stringify(record))
      if (record.contractType === 2) {
        //软件合同
        this.$router.push({
          name: 'previewSoftwareContract',
          params: { id: record.contractId, action: 'view', from: 'receiptList' },
        })
      } else if (record.contractType === 1) {
        //销售合同  又细分 产品订货单、销售合同、三方合同
        getContractOne({ id: record.contractId }).then((res) => {
          if (res.data.contractAttribute === 1) {
            //选择三方合同
            this.$router.push({
              name: 'previewTripartiteContract',
              params: { queryOneData: res.data, from: 'receiptList' },
            })
            console.log('queryOneData:record', record)
          } else {
            if (res.data.isTax === 0) {
              //含税--选择销售合同
              this.$router.push({
                name: 'previewSalesContract',
                params: { queryOneData: res.data, from: 'receiptList' },
              })
              console.log('queryOneData:record', record)
            } else {
              this.$router.push({
                name: 'previewProductOrderForm',
                params: { queryOneData: res.data, from: 'receiptList' },
              })
              console.log('queryOneData:record', record)
            }
          }
        })
      } else {
        console.log('未知')
      }
    },
    tenderingClick(record) {
      console.log('record' + JSON.stringify(record))
      const data = { id: record.customerId }
      this.$refs.tenderingModel.look(data)
    },
    paramClick(key) {
      /*搜索框的显示判断，只有在全部一栏中时，才显示状态查询条件下拉列*/
      if (key == 0) {
        this.showFlag = true
      } else {
        this.showFlag = false
      }
      this.contractState = key

      if (key == 4) {
        this.audit = true
      } else {
        this.audit = false
      }

      this.queryParam.statue = key
      this.searchAction()
      console.log(key)
    },
    handleVue(e) {
      if (e.contractType === 1) {
        this.$router.push({ name: 'ReceiptVue', params: { id: e.id } })
      }
      if (e.contractType === 2) {
        this.$router.push({ name: 'ReceiptSoftwareVue', params: { id: e.id } })
      }
    },
    handleAudit(e) {
      console.log(JSON.stringify(e))
      if (this.$store.getters.userInfo.id == 1) {
        this.$message.info('你没有审批权限，不可以审批')
        return
      }
      if (e.contractType === 1) {
        this.$router.push({ name: 'ReceiptAudit', params: { id: e.id } })
      }
      if (e.contractType === 2) {
        this.$router.push({ name: 'ReceiptSoftwareAudit', params: { id: e.id } })
      }
    },
    handleAuditOk() {
      this.searchAction()
    },
    handleAuditClose() {
      this.searchAction()
    },
    handleEdit(record) {
      if (record.contractType === 1) {
        this.$router.push({ name: 'ReceiptAdd', params: { id: record.id, action: 'edit' } })
      }
      if (record.contractType === 2) {
        this.$router.push({ name: 'ReceiptSoftwareAdd', params: { id: record.id, action: 'edit' } })
      }
    },
    getPayType(type) {
      let m = {
        0: '全款',
        1: '质保金',
        2: '进度款',
        3: '验收款',
        4: '预付款',
        5: '提货款',
      }
      return m[type] || '未知'
    },
    openSearchModel() {
      this.$refs.searchForm.query()
    },
    paramChangeHandler(params) {
      this.isExpanded = true
      this.queryParam = { ...params }
      this.searchAction()
    },
    simpleSearch(type) {
      if (type === 4) {
        this.queryParam.dayWeekMonth = undefined
        this.dayWeekMonth = undefined
        this.queryParam = { ...this.queryParam, dayWeekMonth: this.dayWeekMonth }
        this.searchAction()
      } else {
        this.isExpanded = false
        this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
        this.queryParam = { ...this.queryParam, dayWeekMonth: this.dayWeekMonth }
        this.searchAction()
      }
    },

    expandHandler(expanded, record) {
      console.log(arguments)
      if (expanded) {
        this.expandedRowKeys = [...this.expandedRowKeys, record.key]
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter((val) => val !== record.key)
      }
    },
    doAction(type,record){
      let that = this
      if(type === 'reback'){
        revocationReceipt({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
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

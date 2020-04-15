<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline">
        <a-form-item>
          <a-button-group>
            <a-button type="primary" :class="{currentDayWeekMonth:dayWeekMonth === 1}" @click="simpleSearch(1)">今天</a-button>
            <a-button type="primary" :class="{currentDayWeekMonth:dayWeekMonth === 2}" @click="simpleSearch(2)">本周</a-button>
            <a-button type="primary" :class="{currentDayWeekMonth:dayWeekMonth === 3}" @click="simpleSearch(3)">本月</a-button>
          </a-button-group>

        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="openSearchModel">高级筛选</a-button>
        </a-form-item>
      </a-form>
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
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="customerName" slot-scope="text">
        <a-tooltip v-if="String(text).length > 15">
          <template slot="title">{{text}}</template>
          {{ String(text).slice(0,15) }}...
        </a-tooltip>
        <span v-else>{{text}}</span>
      </div>

      <a-table
        slot="expandedRowRender"
        slot-scope="record, index, indent, expanded"
        :columns="innerColumns"
        :dataSource="record.productList"
        :pagination="false"
        size="small"
      >
        <div slot="productName" slot-scope="text">
          <a-tooltip v-if="String(text).length > 15">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,15) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>
        <div slot="productStand" slot-scope="text">
          <a-tooltip v-if="String(text).length > 15">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,15) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>
        <div slot="productCode" slot-scope="text">
          <a-tooltip v-if="String(text).length > 15">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,15) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>
      </a-table>
    </a-table>
    <SearchForm ref="searchForm" @change="paramChangeHandler" />
  </a-card>
</template>

<script>
import { pageListSaleOrderReport, listTargetTaxRate } from '@/api/saleReport'
import SearchForm from './SearchForm'
import Accounting from 'accounting'
import { companyFormat } from '@/utils/util'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '订单编号',
    dataIndex: 'orderNum'
  },
  {
    title: '日期',
    dataIndex: 'orderCreatedTime'
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
    scopedSlots: { customRender: 'customerName' },
    width: '300px'
  },
  {
    title: '对应销售',
    dataIndex: 'saleUserName'
  },
  {
    align: 'center',
    title: '是否含运费',
    dataIndex: 'freightType'
  },
  {
    align: 'center',
    title: '运费金额',
    dataIndex: 'freightAmount'
  }
]

const innerColumns = [
  {
    align: 'center',
    title: '产品代码',
    dataIndex: 'productCode'
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    scopedSlots: { customRender: 'productName' },
    width: '200px'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'productStand',
    scopedSlots: { customRender: 'productStand' },
    width: '200px'
  },
  {
    align: 'center',
    title: '单位',
    dataIndex: 'company'
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'count'
  },
  {
    align: 'center',
    title: '含税单价',
    dataIndex: 'taxUnitPrice'
  },
  {
    align: 'center',
    title: '含税金额',
    dataIndex: 'taxAmount'
  },
  {
    align: 'center',
    title: '不含税单价',
    dataIndex: 'unitPrice'
  },
  {
    align: 'center',
    title: '不含税金额',
    dataIndex: 'amount'
  },
  {
    align: 'center',
    title: '产品代码',
    dataIndex: 'productCode',
    scopedSlots: { customRender: 'productCode' },
    width: '200px'
  },
  {
    align: 'center',
    title: '是否发货',
    dataIndex: 'sendFlag'
  },
  {
    align: 'center',
    title: '税率',
    dataIndex: 'taxRate'
  }
]

export default {
  name: 'SaleOrderReport',
  components: {
    SearchForm: SearchForm
  },
  data() {
    return {
      columns: columns,
      innerColumns: innerColumns,
      searchParam: {
        dayWeekMonth:1
      },
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      dayWeekMonth:1,
      isExpanded:false, //是否展开列表子数据
      expandedRowKeys:[]
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'SaleOrderReport') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.dayWeekMonth = 1 //默认为今天
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      pageListSaleOrderReport(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.freightType = item.freightType === 0 ? '是' : '否'
            item.freightAmount = Accounting.formatMoney(item.freightAmount || 0, '¥')
            item.productList.map(p => {
              p.company = companyFormat(p.company)
              p.unitPrice = Accounting.formatMoney(p.unitPrice || 0, '¥')
              p.taxUnitPrice = Accounting.formatMoney(p.taxUnitPrice || 0, '¥')
              p.amount = Accounting.formatMoney(p.amount || 0, '¥')
              p.taxAmount = Accounting.formatMoney(p.taxAmount || 0, '¥')
              p.taxRate = (p.taxRate || 0) + '%'
              p.sendFlag = p.sendFlag === 0 ? '否' : '是'
              return p
            })
            return item
          })

          that.expandedRowKeys = that.isExpanded ?  that.dataSource.map(item => item.key) : []

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    simpleSearch(type) {
      this.isExpanded = false
      this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
      this.searchParam.dayWeekMonth = this.dayWeekMonth
      this.searchAction()
    },
    openSearchModel() {
      this.$refs.searchForm.query()
    },
    paramChangeHandler(params) {
      this.searchParam = Object.assign({}, params)
      this.isExpanded = true
      this.searchAction()
    },
    expandHandler(expanded,record){
      console.log(arguments)
      if(expanded){
        this.expandedRowKeys = [...this.expandedRowKeys,record.key]
      }else{
        this.expandedRowKeys = this.expandedRowKeys.filter(val => val !== record.key)
      }
    }
  }
}
</script>

<style scoped>
  .currentDayWeekMonth{opacity: .7;}
</style>
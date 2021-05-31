<template>
  <a-modal title="选择合同" :width="800" v-model="visible" :maskClosable="false" @cancel="handleCancel" :footer="null">
    <div class="search-wrapper">
      <a-input
        placeholder="合同编号"
        :allowClear="true"
        v-model="searchParam.contractNum"
        style="width: 200px; margin-right: 20px; margin-bottom: 20px"
      />
      <a-select
        class="a-select"
        style="width: 200px; margin-right: 20px; margin-bottom: 20px"
        v-model="searchParam.userId"
        showSearch
        :allowClear="true"
        placeholder="销售人员"
        optionFilterProp="children"
        :filterOption="filterCustomerOption"
      >
        <a-select-option v-for="val in saleUsers" :key="val.userId" :value="val.userId">{{
          val.salesmanName
        }}</a-select-option>
      </a-select>

      <a-input
        placeholder="客户名称"
        :allowClear="true"
        v-model="searchParam.customerName"
        style="width: 200px; margin-right: 20px; margin-bottom: 20px"
      />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
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
      <div slot="contractNum" slot-scope="text, record">
        <a href="javascript:void(0);" @click="selected(record)">{{ text }}</a>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { refundGetApprovedSaleContract } from '@/api/receipt'
import { getListSalesman } from '@/api/contractListManagement'
let columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '合同编号',
    dataIndex: 'contractNum',
    scopedSlots: { customRender: 'contractNum' },
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
  },
  {
    title: '销售经理',
    dataIndex: 'saleUserName',
  },
]
export default {
  name: 'ContractSelect',
  data() {
    return {
      visible: false,
      loading: true,
      saleUsers: [],
      searchParam: {},
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      columns: columns,
      dataSource: [],
    }
  },
  methods: {
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      refundGetApprovedSaleContract(_searchParam)
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
    query(record) {
      this.visible = true
      getListSalesman().then((res) => {
        this.saleUsers = res.data
      })
      this.searchAction()
    },
    handleCancel() {
      this.visible = false
    },
    selected(record) {
      this.$emit('onSelect', record)
      this.handleCancel()
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    // 选择客户名称下拉框根据输入项进行筛选
    filterCustomerOption(input, option) {
      // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // option.componentOptions.children[0].text   结果是"郑州依依不舍"
    },
  },
}
</script>


<template>
  <a-modal title="选择产品" :width="800" v-model="priewVisible" :footer="null" :maskClosable="false">
    <div class="search-options">
      <a-input
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="产品代码"
        allowClear
        v-model="queryParam.productModel"
      />
      <a-input
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="产品名称"
        allowClear
        v-model="queryParam.productName"
      />
      <a-select
        placeholder="产品状态"
        v-model="queryParam.productType"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="0">常规产品</a-select-option>
        <a-select-option :value="1">非常规产品</a-select-option>
      </a-select>
      <a-button type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
    <a-table
      :columns="columns"
      rowKey="id"
      :dataSource="saleCustomers"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="name" slot-scope="text, record">
        <a @click="handlerSelected(record)">{{ text }}</a>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
// import { DistributionList } from '@/api/distribution-management'
import { oaSalaryInfo_list } from '@/api/bonus_management'

let columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    scopedSlots: { customRender: 'name' },
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
  },
  // {
  //   title: '规格型号',
  //   dataIndex: 'productStandard',
  //   key: 'productStandard',
  // },
]

export default {
  name: 'CustomerList',
  data() {
    return {
      columns,
      queryParam: {
        productModel: undefined,
        productName: undefined,
        productType: 0,
      },
      saleCustomers: [],
      consumerNam: null,
      consumerId: null,
      loading: false,
      pagination: {
        current: 1,
      },
      priewVisible: false,
    }
  },
  methods: {
    query() {
      let that = this
      that.priewVisible = true
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
      let _param = Object.assign({}, that.pagination, that.queryParam)
      that.loading = true
      return oaSalaryInfo_list(_param)
        .then((res) => {
          that.saleCustomers = res.data.records
          that.loading = false
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          this.pagination = pagination
        })
        .catch((error) => {
          console.error(error)
          that.loading = false
        })
    },
    //选择客户
    handlerSelected(record, index) {
      record.productType = this.queryParam.productType
      this.$emit('selected', record)
      this.priewVisible = false
    },
  },
}
</script>

<style scoped>
.search-options {
  display: flex;
}
.search-options .main-items {
  flex: 1;
}
</style>
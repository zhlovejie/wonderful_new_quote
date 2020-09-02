
<template>
  <a-modal title="承运方" v-model="priewVisible" :footer="null" :maskClosable="false">
    <div class="search-options">
      <a-input
        class="main-items"
        style="margin-right:10px;"
        placeholder="承运方名称"
        v-model="logisticsCompanyName"
      />
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
      <div slot="order" slot-scope="text,record,index">
        <span>{{ index+1 }}</span>
      </div>
      <div slot="name" slot-scope="text,record">
        <a @click="handlerSelected(record)">{{ text }}</a>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { DistributionList } from '@/api/distribution-management'

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
    title: '物流公司名称',
    dataIndex: 'logisticsCompanyName',
    key: 'logisticsCompanyName',
    scopedSlots: { customRender: 'name' },
  },
]

export default {
  name: 'CustomerList',
  data() {
    return {
      columns,
      saleCustomers: [],
      consumerNam: null,
      consumerId: null,
      loading: false,
      pagination: {
        current: 1,
      },
      logisticsCompanyName: undefined,
      priewVisible: false,
    }
  },
  computed: {
    searchParams: function () {
      return {
        logisticsCompanyName: this.logisticsCompanyName,
      }
    },
  },
  methods: {
    init(queryParam) {
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
      that.loading = true
      let _param = Object.assign({}, that.pagination, that.searchParams)
      console.log(_param)
      return DistributionList(_param)
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
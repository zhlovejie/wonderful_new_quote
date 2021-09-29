
<template>
  <a-modal title="选择" v-model="priewVisible" :footer="null" :maskClosable="false">
    <div class="search-options">
      <a-input class="main-items" style="margin-right: 10px" placeholder="名称" v-model="customerName" />
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
      <div slot="customerName" slot-scope="text, record">
        <a @click="handlerSelected(record)">{{ text }}</a>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import {
  receiveCustomerListReceiveAddCustomer,
  receiveWorkerListReceiveAddCustomer
} from '@/api/after-sales-management-custom'


export default {
  name: 'CustomerList',
  data() {
    return {
      saleCustomers: [],
      consumerNam: null,
      consumerId: null,
      loading: false,
      pagination: {
        current: 1,
      },
      customerName: undefined,
      priewVisible: false,
      extendParam: {}, //扩展参数
    }
  },
  computed: {
    searchParams: function () {
      return {
        name: this.customerName,
      }
    },
    columns(){
      let baseColumns = [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        }
      ]
      if(this.extendParam.__type === 1){
        baseColumns.push(
          {
            align: 'center',
            title: '客户名称',
            dataIndex: 'customerName',
            scopedSlots: { customRender: 'customerName' },
          }
        )
      }else{
        baseColumns.push(
          {
            align: 'center',
            title: '人员名称',
            dataIndex: 'userName',
            scopedSlots: { customRender: 'customerName' },
          }
        )
      }
      return baseColumns
    }
  },
  methods: {
    init(queryParam) {
      let that = this
      that.priewVisible = true
      that.extendParam = { ...queryParam }
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
      let _param = Object.assign({}, that.pagination, that.searchParams, that.extendParam)
      console.log(_param)
      let api = _param.__type === 1
      ? receiveCustomerListReceiveAddCustomer
      : receiveWorkerListReceiveAddCustomer
      return api(_param)
        .then((res) => {
          that.saleCustomers = res.data.records
          that.loading = false
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          this.pagination = pagination
          return res.data
        })
        .catch((error) => {
          console.error(error)
          that.loading = false
        })
    },
    //选择客户
    handlerSelected(record) {
      this.$emit('selected',record)
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


<template>
  <a-modal :title="`选择${modelTitle}`" v-model="priewVisible" :footer="null" :maskClosable="false">
    <div class="search-options">
      <a-input class="main-items" style="margin-right: 10px" :placeholder="modelTitle" v-model="customerName" />
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
      <div slot="mailNum" slot-scope="text, record">
        <a @click="handlerSelected(record)">{{ text }}</a>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import {
  receiveCustomerListReceiveCustomerMail,
  receiveWorkerListReceiveCustomerMail
} from '@/api/after-sales-management-custom'

export default {
  name: 'PostList',
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
        accessoriesNum: this.customerName,
      }
    },
    modelTitle(){
      return this.extendParam.__type === 1 ? '邮寄单编号' : '配件编号'
    },
    showColumns(){
      return this.extendParam.__type === 1 ? 'mailNum' : 'accessoriesNum'
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
      baseColumns.push(
        {
          align: 'center',
          title: this.modelTitle,
          dataIndex: this.showColumns,
          scopedSlots: { customRender: 'mailNum' },
        },
      )
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
      ? receiveCustomerListReceiveCustomerMail
      : receiveWorkerListReceiveCustomerMail
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

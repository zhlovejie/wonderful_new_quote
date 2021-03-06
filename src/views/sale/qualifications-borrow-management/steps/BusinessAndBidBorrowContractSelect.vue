<template>
  <a-modal
    title="选择协议"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <a-tabs :activeKey="activeKey" :defaultActiveKey="1" @change="tabChange">
      <a-tab-pane tab="经营借用协议" :key="1" />
      <a-tab-pane tab="投标借用协议" :key="2" />
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

      <div slot="customerName" slot-scope="text, record, index">
        <a href="javascript:void(0);" @click="clickVue(record)">{{ text }}</a>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { businessList, bidList } from '@/api/agencyContract'
const __API__ = { 1: businessList, 2: bidList }
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
    title: '协议编号',
    dataIndex: 'contractNum',
  },
  {
    align: 'center',
    title: '销售负责人',
    dataIndex: 'trueName',
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'customerName',
    scopedSlots: { customRender: 'customerName' },
  },
  {
    align: 'center',
    title: '信誉保证金(元)',
    dataIndex: 'earnestMoney',
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
  },
]
export default {
  name: 'BusinessAndBidBorrowContractSelect',
  data() {
    return {
      visible: false,
      dataSource: [],
      // 表头
      columns: columns,
      loading: false,
      queryParam: {
        queryType: 1, //我的
        status: 3, //已通过
        customerName: undefined, //客户名称
      },
      activeKey: 1,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
    }
  },
  methods: {
    // 获取列表
    search(params = {}) {
      const that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      __API__[that.activeKey](_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch((err) => (that.loading = false))
    },
    query(queryParam = {}) {
      this.visible = true
      this.queryParam = { ...this.queryParam, ...queryParam }
      this.$nextTick(() => this.search())
    },
    handleCancel() {
      this.visible = false
    },
    clickVue(data) {
      this.$emit('change', { ...data, __borrowProtocol: this.activeKey })
      this.handleCancel()
    },
    tabChange(key) {
      this.activeKey = +key
      this.pagination = { ...this.pagination, current: 1 }
      this.search()
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
  },
}
</script>

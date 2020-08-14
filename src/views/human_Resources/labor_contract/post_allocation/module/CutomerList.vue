<template>
  <a-modal
    title="选择合同"
    :width="600"
    v-model="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    :footer="null"
  >
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
        <a href="javascript:void(0);" @click="selected(record)">{{text}}</a>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { postAllocation_Version } from '@/api/humanResources'
// import { refundGetApprovedSaleContract } from '@/api/receipt'
let columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '合同协议名称',
    dataIndex: 'contractName',
    scopedSlots: { customRender: 'contractNum' },
  },
  {
    title: '版本号',
    dataIndex: 'version',
  },
]
export default {
  name: 'ContractSelect',
  data() {
    return {
      visible: false,
      loading: true,
      pagination: {
        current: 1,
      },
      columns: columns,
      dataSource: [],
    }
  },
  methods: {
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {}, {
        searchStatus: that.activeKey,
      })
      //   console.log('执行搜索...', _searchParam)
      that.loading = true
      postAllocation_Version(_searchParam)
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
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
  },
}
</script>

<template>
  <a-modal
    :title="modalTitle"
    :width="660"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      size="middle"
    >
      <div slot="operationType" slot-scope="text, record, index">
        <span v-if="text === 1">调休请假</span>
        <span v-if="text === 2"> 年假请假 </span>
        <span v-if="text === 3">加班 </span>
        <span v-if="text === 4">年假定时刷新</span>
      </div>
    </a-table>
  </a-modal>
</template>
<script>
import { annualLeave } from '@/api/personnelManagement'
const columns = [
  {
    align: 'center',
    title: '来源',
    dataIndex: 'operationType',
    scopedSlots: { customRender: 'operationType' },
  },
  {
    align: 'center',
    title: '变更时长(H)',
    dataIndex: 'changeAfterHours',
  },

  {
    align: 'center',
    title: '剩余时长(H)',
    dataIndex: 'changeHours',
  },
  {
    align: 'center',
    title: '操作时间',
    dataIndex: 'createdTime',
  },
]
export default {
  name: 'UpdateRecord',
  data() {
    return {
      visible: false,
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      searchParam: {},
    }
  },
  computed: {
    modalTitle() {
      return '变更记录'
    },
  },
  methods: {
    async query(type, record) {
      let that = this
      that.visible = true
      that.searchParam = { userId: record.userId }
      that.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      annualLeave(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>


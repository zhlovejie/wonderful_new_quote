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
    ></a-table>
  </a-modal>
</template>
<script>
import {comManageGroupRecordPage} from '@/api/communicationManagement'
const columns = [
  {
    align: 'center',
    title: '群名称',
    dataIndex: 'groupName'
  },
  {
    align: 'center',
    title: '群主',
    dataIndex: 'userName'
  },
  {
    align: 'center',
    title: '修改人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'createdTime'
  }
]
export default {
  name: 'UpdateRecord',
  data() {
    return {
      visible: false,
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchParam: {},
    }
  },
  computed: {
    modalTitle() {
      return '修改记录'
    }
  },
  methods: {
    async query(type, record) {
      let that = this
      that.visible = true
      that.searchParam = { groupId:record.id }
      that.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      comManageGroupRecordPage(_searchParam)
        .then(res => {
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
        .catch(err => (that.loading = false))
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    handleCancel(){
      this.visible = false
    }
  }
}
</script>


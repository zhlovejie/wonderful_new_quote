<template>
  <a-table
    :columns="columns"
    :dataSource="dataSource"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    size="small"
  >
    <div slot="order" slot-scope="text, record, index">
      <span>{{ index + 1 }}</span>
    </div>

    <div slot="oldMaterialCode" slot-scope="text, record, index">
      <div style="text-align:left;font-size:14px;">
        <p>物料代码:<a-tag color="#ccc">原 </a-tag>{{ record.oldMaterialCode }} → <a-tag color="#f50">新 </a-tag>{{ record.newMaterialCode }}</p>
        <p>
          <a-tag color="#ccc">原 </a-tag>规格型号:{{ record.oldMaterialSpecification }}
        </p>
        <p>
          <a-tag color="#f50">新 </a-tag>规格型号:{{ record.newMaterialSpecification }}
        </p>

        <p>变更原因:{{ record.reason }}</p>
        <p>提交人:{{ record.createdName }}&nbsp;&nbsp;&nbsp;&nbsp;提交时间:{{ record.createdTime }}</p>
      </div>
    </div>
  </a-table>
</template>

<script>
import { codeChangeLogPageList } from '@/api/routineMaterial'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '变更记录',
    dataIndex: 'oldMaterialCode',
    scopedSlots: { customRender: 'oldMaterialCode' }
  }
]
export default {
  name: 'CodeChangeRecords',
  inject: ['normalAddForm'],
  data() {
    return {
      loading: false,
      columns,
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      }
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    search(params = {}) {
      const that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      that.loading = true
      const _searchParam = Object.assign({ materialId: that.normalAddForm.detail.id }, paginationParam, params)
      codeChangeLogPageList(_searchParam)
        .then(res => {
          that.loading = false
          if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
            return
          }
          that.dataSource = res.data.records.map(item => {
            item.key = that._uuid()
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch(err => {
          console.error(err)
          that.loading = false
        })
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    }
  }
}
</script>

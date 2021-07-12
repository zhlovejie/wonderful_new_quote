<template>
  <a-card
    :bordered="false"
    class="project-management-Project-node"
  >
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item style="float:right;">
          <a-button
            type="primary"
            @click="doAction('add', null)"
          >新增</a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <div
        slot="order"
        slot-scope="text, record, index"
      >
        <span>{{ index + 1 }}</span>
      </div>

      <div
        slot="action"
        slot-scope="text, record, index"
      >
        <a
          type="primary"
          @click="doAction('view',record)"
        >查看</a>
        <a-divider type="vertical" />
        <a
          type="primary"
          @click="doAction('edit',record)"
        >修改</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="是否要删除此行？"
          @confirm="doAction('del',record)"
        >
          <a>删除</a>
        </a-popconfirm>
      </div>

    </a-table>

    <AddForm
      ref="addForm"
      @finish="finishHandler"
    />

  </a-card>
</template>

<script>
import {
  nodeInfoDetail,
  nodeInfoList,
  nodeInfoDelete,
  nodeInfoAdd,
  nodeInfoUpdate
} from '@/api/researchManagementByWzz'

import AddForm from './AddForm.vue'

const columns = [
  {
    align: 'center',
    title: '序号',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '节点选项',
    dataIndex: 'nodeName'
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdUserName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '修改人',
    dataIndex: 'modifyUserName'
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'project-management-Project-node',
  components: {
    AddForm
  },
  data() {
    return {
      // 表头
      columns,
      dataSource: [],

      loading: false,
      queryParam: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'project-management-Project-node') {
          this.init()
        }
      },
      immediate: true
    }
  },
  computed: {},
  methods: {
    init() {
      this.search()
    },
    search(params = {}) {
      const that = this
      that.loading = true
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const _searchParam = Object.assign({}, { ...that.queryParam },paginationParam, params)
      nodeInfoList(_searchParam)
        .then(res => {
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
    },
    async doAction(type, record) {
      const that = this
      if (['add', 'edit', 'view'].includes(type)) {
        that.$refs.addForm.query(type, { ...record })
      } else if (type === 'del') {
        nodeInfoDelete(`nodeId=${record.nodeId}`).then(res => {
          that.$message.info(res.msg)
          if (+res.code === 200) {
            that.finishHandler()
          }
        })
      }
    },
    finishHandler(param) {
      const that = this
      that.$nextTick(() => {
        that.search()
      })
    }
  }
}
</script>

<style scoped>
</style>


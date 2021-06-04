<template>
  <a-modal
    title="添加操作规程"
    :width="1050"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            placeholder="设备名称/设备编号模糊查询"
            v-model="searchParam.a"
            allowClear
            style="width:220px;"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="设备型号"
            v-model="searchParam.b"
            allowClear
            style="width:180px;"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="设备责任人"
            v-model="searchParam.c"
            allowClear
            style="width:180px;"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="searchAction({current:1})"
          >查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="main-wrapper">
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
          slot="meetingNum"
          slot-scope="text, record"
        >
          <a
            href="javascript:void(0);"
            @click="() => doAction(record)"
          >{{text}}</a>
        </div>
        <div
          slot="typeDicName"
          slot-scope="text, record"
        >
          <a
            href="javascript:void(0);"
            @click="() => doAction(record)"
          >{{text}}</a>
        </div>
        <div
          slot="departmentName"
          slot-scope="text, record"
        >
          <a
            href="javascript:void(0);"
            @click="() => doAction(record)"
          >{{text}}</a>
        </div>
        <div
          slot="status"
          slot-scope="text, record"
        >
          {{ {1:'正常',2:'报修中',3:'报废'}[text] }}
        </div>
      </a-table>
    </div>

  </a-modal>
</template>

<script>
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '设备编号',
    dataIndex: 'a1',
    scopedSlots: { customRender: 'meetingNum' }
  },
  {
    align: 'center',
    title: '设备名称',
    dataIndex: 'a2',
    scopedSlots: { customRender: 'typeDicName' }
  },
  {
    align: 'center',
    title: '设备型号',
    dataIndex: 'a3',
    scopedSlots: { customRender: 'departmentName' }
  },
  {
    align: 'center',
    title: '设备责任人',
    dataIndex: 'a4'
  },
  {
    align: 'center',
    title: '安装位置',
    dataIndex: 'a5'
  },
  {
    align: 'center',
    title: '设备状态',
    dataIndex: 'a6',
    scopedSlots: { customRender: 'status' }
  }
]
export default {
  data() {
    return {
      visible: false,
      columns: columns,
      dataSource: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      searchParam: {}
    }
  },
  methods: {
    query() {
      const that = this
      that.visible = true
      that.loading = true
      that.dataSource = [
        {
          a1: 'test1',
          a2: 'test2',
          a3: 'test3',
          a4: 'test4',
          a5: 'test5',
          a6: '1'
        }
      ]

      setTimeout(() => {
        that.loading = false
      }, 1500)
    },
    handleCancel() {
      this.visible = false
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, opt, paginationParam)
      that.loading = true
      getMeetingLeavePageList(_searchParam)
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

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    doAction(record) {
      this.$emit('change', record)
      this.handleCancel()
    }
  }
}
</script>

<style scoped>
</style>

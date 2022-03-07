<template>
  <!-- 工序管理 -->
  <a-modal
    title="选择工序"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :forceRender="true"
  >
  <div class="product-process-management_step-management">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="车间名称" v-model="searchParam.workshopId" allowClear style="width: 180px">
            <a-select-option v-for="item in workshop" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="工序代码/工序名称模糊查询"
            v-model="searchParam.process"
            allowClear
            style="width: 180px"
          />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
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
        :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </div>
  </div>
  </a-modal>
</template>

<script>
import {
  pageDevelopmentCraftProcessList,
  listDevelopmentCraftWorkshopList,
} from '@/api/ProcessManagement'

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
    title: '车间名称',
    dataIndex: 'workshopName',
  },
  {
    align: 'center',
    title: '工序代码',
    dataIndex: 'processNum',
  },
  {
    align: 'center',
    title: '工序名称',
    dataIndex: 'processName',
  }
]

export default {
  name: 'select-product-process',
  data() {
    return {
      visible: false,
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      searchParam: {},
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  methods: {
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    init() {
      const that = this
      that.visible = true
      listDevelopmentCraftWorkshopList().then((res) => {
        that.workshop = res.data
      })
      that.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, opt, paginationParam)
      that.loading = true
      pageDevelopmentCraftProcessList(_searchParam)
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
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleCancel(){
      this.visible = false
      this.$emit('change',[])
    },
    handleSubmit(){
      if(this.selectedRows.length === 0){
        this.$message.info('请选择工序')
        return
      }
      this.visible = false
      this.$emit('change',[...this.selectedRows])
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            placeholder="中控系统名称模糊查询"
            v-model="queryParam.configName"
            allowClear
            style="width: 250px"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            icon="search"
            @click="search({ current: 1 })"
          >查询</a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
    >
      <div
        slot="order"
        slot-scope="text, record, index"
      >
        <span>{{ index + 1 }}</span>
      </div>
    </a-table>

    <p style="text-align:center;margin-top:20px;">
      <a-button type="primary"  @click="stepAction('prev')">上一步</a-button>
      <a-button type="primary" :disabled="btnNextDisabled" @click="stepAction('next')" style="margin-left:10px;">下一步</a-button>
    </p>
  </a-card>
</template>

<script>
import {
  priceQuotedZktPageList
} from '@/api/productOfferManagement'


const columns = [
  {
    align: 'center',
    title: '序号',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '中控系统名称',
    dataIndex: 'configName'
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark'
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  inject:['addForm'],
  data() {
    return {
      // 表头
      columns,
      dataSource: [],

      loading: false,
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
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
  computed:{
    btnNextDisabled(){
      return this.selectedRows.length <= 0
    }
  },
  created(){
    this.search()
  },
  methods: {
    search(params = {}) {
      const that = this
      that.loading = true
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const _searchParam = Object.assign({}, { ...that.queryParam },paginationParam, params)
      priceQuotedZktPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = item.id
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
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    stepAction(type){
      const that = this
      if(type === 'next'){
        that.$emit('change','step2','next',[...that.selectedRows])
      }else if(type === 'prev'){
        that.$emit('change','step2','prev',null)
      }
    },
    fill(data){
      let {step2} = this.addForm.form
      this.selectedRowKeys = step2.map(item => item.itemConfigId)
      this.selectedRows = step2.map(item => {
        return {
          id:item.itemConfigId,
          configName:item.configName,
          configType:item.configType
        }
      })
    }
  }
}
</script>

<style scoped>
</style>


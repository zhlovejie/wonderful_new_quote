<template>
  <a-modal
    title="选择产品类型"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
  <div class="customer-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="产品类型模糊查询" v-model="typeName" allowClear style="width: 220px" />
      <a-button type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
    <div class="main-wrapper">
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
        <div slot="typeName" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="selectHandler(record)">{{text}}</a>
        </div>
      </a-table>
    </div>
  </div>
  </a-modal>


</template>
<script>
import { typeConfigPage, delTypeConfig } from '@/api/productOfferManagement'
let columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '产品类型名称',
    dataIndex: 'typeName',
    scopedSlots: { customRender: 'typeName' },
  },
  {
    align: 'center',
    title: '编码',
    dataIndex: 'code',
  },
  {
    align: 'center',
    title: '税率',
    dataIndex: 'taxRate',
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
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime',
  }
]
export default {
  data() {
    return {
      columns,
      typeName: undefined,
      dataSource: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      visible:false
    }
  },
  computed: {
    searchParam() {
      return {
        typeName: this.typeName,
      }
    },
  },
  methods: {
    query() {
      const that = this
      that.visible = true
      that.$nextTick(() => that.searchAction())
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt || {}, {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      typeConfigPage(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          try {
            //设置数据总条数
            const pagination = { ...that.pagination }
            pagination.total = res.data.total
            that.pagination = pagination
            //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
            //刷新也不显示数据
            let { current, pages } = res.data
            if (+pages > 0 && +current > +pages) {
              that.pagination = { ...pagination, current: pages }
              that.searchAction()
            }
          } catch (err) {
            console.log(err)
          }
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if (+pager.pageSize !== +pager._prePageSize) {
        //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = { ...this.pagination, ...pager }
      this.searchAction()
    },
    handleCancel(){
      this.visible = false
    },
    selectHandler(record){
      this.$emit('change',{...record})
      this.handleCancel()
    }
  }
}
</script>
<style scoped>
.customer-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.customer-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>

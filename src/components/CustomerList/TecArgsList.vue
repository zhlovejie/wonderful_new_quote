
<template>
  <!-- 主名、辅名版本 -->
  <a-modal title="选择技术参数" v-model="priewVisible" :footer="null" :maskClosable="false">
    <div class="search-options">
      <a-input class="main-items" style="margin-right:10px;" placeholder="技术参数" v-model="fileName" />
      <a-button  type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
    <a-table
      :columns="columns"
      rowKey="id"
      :dataSource="tableDataSource"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <div slot="order" slot-scope="text,record,index">
        <span>{{ index+1 }}</span>
      </div>
      <div slot="fileName" slot-scope="text,record">
        <a @click="handlerSelected(record)">{{ text }}</a>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { getFileManagementList } from '@/api/OperationalScheme'
let columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '参数名称',
    dataIndex: 'fileName',
    key: 'fileName',
    scopedSlots: { customRender: 'fileName' }
  },
  {
    align: 'center',
    title: '最后更新时间',
    dataIndex: 'modifierTime',
    key: 'modifierTime',
    scopedSlots: { customRender: 'modifierTime' }
  }
]

export default {
  name:'CustomerList',
  data(){
    return {
      columns,
      fetchURL:getFileManagementList,
      tableDataSource:[],
      loading:false,
      pagination: {},
      fileName:'',
      priewVisible:false
    }
  },
  methods:{
    init(queryParam = {fileName:this.fileName,current:1}){
      let that = this
      that.priewVisible = true
      that.loading = true
      return this.fetchURL(queryParam).then((res) => {
        that.tableDataSource = res.data.records
        that.loading = false
        const pagination = { ...that.pagination }
        pagination.total = res.data.total || 0
        this.pagination = pagination
        return res.data
      }).catch(error => {
        console.error(error)
        that.loading = false
      })
    },
    // 分页
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.init({fileName:this.fileName,current:pagination.current})
    },
    //点击查询
    searchAction(){ 
      const pager = { ...this.pagination }
      pager.current = 1
      this.pagination = pager
      this.init({fileName:this.fileName,current:1})
    },
    //选择客户
    handlerSelected(record,index){
      this.$emit('selected',record)
      this.priewVisible = false
    }
  }
}
</script>

<style scoped>
  .search-options {
    display: flex
  }
  .search-options .main-items{
    flex: 1;
  }
</style>
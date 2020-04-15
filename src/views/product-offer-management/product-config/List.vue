<template>
  <!-- 产品配置表 -->
  <div class="customer-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="配置名称模糊查询" v-model="itemName" allowClear style="width: 200px;"/>
      <a-input placeholder="备注模糊查询" v-model="remarks" allowClear style="width: 200px;"/>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
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
        <div slot="itemName" slot-scope="text, record, index">
          <a-tooltip v-if="String(text).length > 15">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,15) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>
        <div slot="remarks" slot-scope="text, record, index">
          <a-tooltip v-if="String(text).length > 15">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,15) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确认删除该条数据吗?"
            @confirm="() => doAction('del',record)"
          >
            <a type="primary" href="javascript:;">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction" />
  </div>
</template>
<script>

import {
  priceAdjustItemConfigList,
  priceAdjustItemConfigDelete
} from '@/api/productOfferManagement'
import AddForm from './module/AddForm'
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
    title: '配置名称',
    dataIndex: 'itemName',
    key: 'itemName',
    scopedSlots: { customRender: 'itemName' },
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
    scopedSlots: { customRender: 'remarks' },
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName',
    key: 'createdName',
    scopedSlots: { customRender: 'createdName' }
  },
  {
    align: 'center',
    title: '提交时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
    scopedSlots: { customRender: 'createdTime' }
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name:'productConfig',
  components:{
    AddForm
  },
  data(){
    return {
      itemName:undefined,
      remarks:undefined,
      columns:columns,
      dataSource:[],
      pagination:{
        current:1
      },
      loading:false
    }
  },
  computed:{
    searchParam(){
      return {
        itemName:this.itemName,
        remarks:this.remarks
      }
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'pom-product-config'){
          this.init()
        }
      },
      immediate:true
    }
  },
  methods:{
    init(){
      this.searchAction()
    },
    searchAction(opt){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.pagination},opt || {})
      console.log('执行搜索...',_searchParam)
      that.loading = true
      priceAdjustItemConfigList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.records.map((item,index) =>{
          item.key = item.id
          return item
        })
        //设置数据总条数
        const pagination = { ...that.pagination }
        pagination.total = res.data.total
        that.pagination = pagination
      }).catch(err => that.loading = false)
    },
    // 分页
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({current:pagination.current})
    },
    doAction(type,record){
      let that = this
      if(type === 'del'){
        priceAdjustItemConfigDelete({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        }).catch(err =>{
          that.$message.info(`错误：${err.message}`)
        })
        return
      }
      this.$refs.addForm.query(type,record)
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
  .main-wrapper{
    margin-top: 20px;
  }
</style>
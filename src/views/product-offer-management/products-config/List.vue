<template>
  <!-- 系列产品配置 -->
  <div class="customer-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="系列产品名称模糊查询" v-model="itemName" allowClear style="width: 200px;"/>
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
        <div slot="name" slot-scope="text, record, index">
          <span >{{text}}</span>
        </div>
        <div slot="type" slot-scope="text, record, index">
          {{record.type === 0 ? '是' : '否'}}
        </div>
        <div slot="model" slot-scope="text, record, index">
          <a-tooltip v-if="String(text).length > 15">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,15) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>
        <div slot="remarks" slot-scope="text, record, index">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,10) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>

        <div slot="optStand" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="doAction('viewOptStand',record)">查看</a>
        </div>
        <div slot="optSelect" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="doAction('viewOptSelect',record)">查看</a>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('editRecord',record)">修改记录</a>
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
    <!-- 添加、修改 -->
    <AddForm ref="addForm" @finish="searchAction" />
    <!-- 修改记录 -->
    <ViewUpdateRecord ref="viewUpdateRecord" />
    <!-- 查看标配、选配-->
    <ViewOption ref="viewOption" />
  </div>
</template>
<script>

import {
  priceAdjustProductConfigList,
  priceAdjustProductConfigDelete
} from '@/api/productOfferManagement'
import AddForm from './module/AddForm'
import ViewUpdateRecord from './module/ViewUpdateRecord'
import ViewOption from './module/ViewOption'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '系列产品名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    align: 'center',
    title: '系列产品型号',
    dataIndex: 'model',
    scopedSlots: { customRender: 'model' },
  },
  {
    align: 'center',
    title: '是否为产品',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' },
  },
  {
    align:'center',
    title:'竞争力',
    dataIndex:'priceCoefficientName'
  },
  {
    align: 'center',
    title: '标配项',
    scopedSlots: { customRender: 'optStand' },
  },
  {
    align: 'center',
    title: '选配项',
    scopedSlots: { customRender: 'optSelect' },
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remarks',
    scopedSlots: { customRender: 'remarks' },
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName',
    scopedSlots: { customRender: 'createdName' }
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
    scopedSlots: { customRender: 'createdTime' }
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name:'pomProductsConfig',
  components:{
    AddForm,
    ViewUpdateRecord,
    ViewOption
  },
  data(){
    return {
      itemName:undefined,
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
        name:this.itemName
      }
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'pom-products-config'){
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
      priceAdjustProductConfigList(_searchParam).then(res => {
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
        priceAdjustProductConfigDelete({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        }).catch(err =>{
          that.$message.info(`错误：${err.message}`)
        })
        return
      }else if(type === 'editRecord'){
        this.$refs.viewUpdateRecord.query({
          id:record.id,
          //mainBody 配置主体：1 中控系统 2 产品 3 系列产品
          //type  产品类型：0 产品 1 系列产品
          mainBody:2 
        })
        return 
      }else if(type === 'viewOptStand'){
        this.$refs.viewOption.query({
          id:record.id,
          type:1
        })
        return
      }else if(type === 'viewOptSelect'){
        this.$refs.viewOption.query({
          id:record.id,
          type:2
        })
        return
      }else if(type === 'add' || type === 'edit'){
        this.$refs.addForm.query(type,record)
        return
      }else{
        console.log(`不支持的type参数：${type}`)
      }
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
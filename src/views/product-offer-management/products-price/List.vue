<template>
  <!-- 产品价格配置表 -->
  <div class="customer-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="系列产品名称模糊查询" v-model="itemName" allowClear style="width: 200px;"/>
      <a-button type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="系列产品标配" key="1"/>
        <a-tab-pane tab="中控系统模块标配" key="2"/>
        <a-tab-pane tab="选配" key="3"/>
      </a-tabs>
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
          <a-tooltip v-if="String(text).length > 15">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,15) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>

        <div slot="price" slot-scope="text, record, index">
          {{text | moneyFormatNumber}}
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="record.pricingName">
            <a type="primary" @click="doAction('edit',record)">修改</a>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('editRecord',record)">修改记录</a>
          </template>
          <template v-else>
            <a type="primary" @click="doAction('price',record)">核价</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
    <!-- 修改记录 -->
    <ViewUpdateRecord ref="viewUpdateRecord" />
  </div>
</template>
<script>

import {
  priceAdjustPricingRecordList,
  priceAdjustPricingRecordDetail,
  priceAdjustPricingRecordPrice
} from '@/api/productOfferManagement'
import ViewUpdateRecord from './module/ViewUpdateRecord'
import AddForm from './module/AddForm'

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
    scopedSlots: { customRender: 'name' }
  },
  {
    align: 'center',
    title: '标配价格(元)',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    align: 'center',
    title: '核价人',
    dataIndex: 'pricingName',
  },
  {
    align: 'center',
    title: '核价时间',
    dataIndex: 'pricingTime'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name:'pom-products-price',
  components:{
    AddForm:AddForm,
    ViewUpdateRecord:ViewUpdateRecord
  },
  data(){
    return {
      activeKey:1,
      itemName:undefined,
      depSelectDataSource:[],
      postSelectDataSource:[],
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
        if(to.name === 'pom-products-price'){
          this.init()
        }
      },
      immediate:true
    },
    activeKey(newVal,oldVal){
      console.log(arguments)
      let txt = ['','系列产品名称','中控系统模块名称','配置名称'][newVal]
      let columns = [...this.columns]
      let target = columns.find(item => item.dataIndex === 'name')
      if(target){
        target.title = txt
        this.columns = [...columns]
      }
    }
  },
  methods:{
    init(){
      this.searchAction()
    },
    searchAction(opt){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.pagination},opt || {},{type:that.activeKey})
      console.log('执行搜索...',_searchParam)
      that.loading = true
      priceAdjustPricingRecordList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.records.map((item,index) =>{
          item.key = index + 1
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
      this.searchAction()
    },
    doAction(type,record){
      if(type === 'price' || type === 'edit'){
        record.__activeKey = this.activeKey
        record.__activeTxt = ['','系列产品名称','中控系统模块名称','配置名称'][this.activeKey]
        this.$refs.addForm.query(type,record)
      }else if(type === 'editRecord'){
        this.$refs.viewUpdateRecord.query({
          id:record.id,
          type:this.activeKey
        })
      }else{
        this.$message.info(`不支持的指令：${type}`)
      }
    },
    tabChange(tagKey){
      this.activeKey = parseInt(tagKey)
      this.pagination.current = 1
      this.searchAction()
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
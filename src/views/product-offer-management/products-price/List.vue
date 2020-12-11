<template>
  <!-- 产品价格配置表 -->
  <div class="customer-list-wrapper">
    <div class="search-wrapper">
      <a-input :placeholder="placeholder" v-model="itemName" allowClear style="width: 220px;"/>
      <a-select placeholder="是否核价" v-model="isNuclearPrice" style="width: 150px" :allowClear="true">
        <a-select-option :value="1">未核价</a-select-option>
        <a-select-option :value="2">已核价</a-select-option>
      </a-select>
      
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
          <span>{{text}}</span>
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
    <AddForm ref="addForm" @finish="searchAction()" />
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
      isNuclearPrice:undefined,
      depSelectDataSource:[],
      postSelectDataSource:[],
      dataSource:[],
      pagination:{
        current:1,
        _prePageSize: 10,
        pageSize:10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading:false,
      placeholder:'系列产品名称模糊查询'
    }
  },
  computed:{
    searchParam(){
      return {
        name:this.itemName,
        isNuclearPrice:this.isNuclearPrice
      }
    },
    columns(){
      let baseColumns = [
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
      let extendColumns = [...baseColumns]
      //系列产品名称 添加 系列产品型号
      extendColumns.splice(2,0,{align: 'center',title: '系列产品型号',dataIndex: 'model'})

      let targetColumns = +this.activeKey === 1 ? extendColumns : baseColumns

      //系列产品名称,中控系统模块名称 添加 竞争力
      if(+this.activeKey !== 3){
        targetColumns.splice(
          +this.activeKey === 1 ? 3 : 2
          ,0
          ,{align: 'center',title: '竞争力',dataIndex: 'priceCoefficientName'})
      }

      let txt = ['','系列产品名称','中控系统模块名称','配置名称'][this.activeKey]
      this.placeholder = `${txt}模糊查询`
      let columns = [...targetColumns]
      let target = columns.find(item => item.dataIndex === 'name')
      if(target){
        target.title = txt
      }
      return columns
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
    }
  },
  methods:{
    init(){
      this.searchAction()
    },
    searchAction(opt){
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
       }
      let _searchParam = Object.assign({},{...this.searchParam},paginationParam,opt || {},{type:that.activeKey})
      console.log('执行搜索...',_searchParam)
      that.loading = true
      priceAdjustPricingRecordList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.records.map((item,index) =>{
          item.key = index + 1
          return item
        })
        try{
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let {current,pages} = res.data
          if(+pages > 0 && +current > +pages){
            that.pagination = {...pagination,current:pages}
            that.searchAction()
          }
        }catch(err){
          console.log(err)
        }
      }).catch(err => that.loading = false)
    },
    // 分页
    handleTableChange (pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if(+pager.pageSize !== +pager._prePageSize){ //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = {...this.pagination,...pager}
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
<template>
  <!-- 产品报价列表 -->
  <div class="pom-products-quotation-list-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="报价单号" v-model="searchParam.quoteCode" allowClear style="width: 200px;"/>
      <a-input placeholder="询价方" v-model="searchParam.customerName" allowClear style="width: 200px;"/>
      <a-input placeholder="联系人" v-model="searchParam.customerContacts" allowClear style="width: 200px;"/>
      <a-input placeholder="产品名称" v-model="searchParam.productName" allowClear style="width: 200px;"/>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
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

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <a-divider type="vertical"  />
          <a-popconfirm
            title="是否要删除此行？"
            @confirm="doAction('del',record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <PriceFormPrint ref="priceFormPrint" />
  </div>
</template>
<script>
import PriceFormPrint from './module/PriceFormPrint'
import {
  priceAdjustProductQuoteList,
  priceAdjustProductQuoteDetail,
  priceAdjustProductQuoteDelete,
  priceAdjustProductQuoteDownload,
  priceAdjustProductQuoteAddOrUpdate
} from '@/api/productOfferManagement'


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
    title: '报价单号',
    dataIndex: 'quoteCode'
  },
  {
    align: 'center',
    title: '询价方',
    dataIndex: 'customerName'
  },
  {
    align: 'center',
    title: '联系人',
    dataIndex: 'customerContacts'
  },
  {
    align: 'center',
    title: '对应销售',
    dataIndex: 'saleUserName'
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
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name:'InterviewRecordList',
  components:{
    PriceFormPrint
  },
  data(){
    return {
      columns:columns,
      dataSource:[],
      pagination:{
        current:1
      },
      loading:false,
      searchParam:{}
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'pom-products-quotation-list4d0'){
          this.init()
        }
      },
      immediate:true
    }
  },
  methods:{
    init(){
      let that = this
      this.searchAction()
    },
    searchAction(opt){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.pagination},opt || {})
      console.log('执行搜索...',_searchParam)
      that.loading = true
      priceAdjustProductQuoteList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.records.map((item,index) =>{
          item.key = index + 1
          return item
        })
        //设置数据总条数
        const pagination = { ...that.pagination }
        pagination.total = res.data.total
        pagination.current = res.data.current || 1
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
      if(type === 'view'){
        that.$refs.priceFormPrint.query(type,record)
        return
      }
      if (type === 'del') {
        priceAdjustProductQuoteDelete({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      }
    }
  }
}
</script>
<style scoped>
  .pom-products-quotation-list-list-wrapper {
    background-color: #fff;
    padding: 10px 20px;
  }
  .pom-products-quotation-list-list-wrapper .search-wrapper * {
    margin: 10px 15px 0 0;
  }
  .main-wrapper{
    margin-top: 20px;
  }
</style>
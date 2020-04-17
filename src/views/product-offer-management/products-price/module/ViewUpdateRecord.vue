<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
    :footer="null"
  >
    <!-- 修改产品记录表 -->
    <div class="customer-list-wrapper">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input placeholder="变更人模糊查询" v-model="itemName" allowClear style="width: 180px;"/>
          </a-form-item>
          <a-form-item>
            <a-range-picker v-model="sDate" style="width:220px;" :allowClear="true"/>
          </a-form-item>
          <a-form-item>
            <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
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
          <div slot="order" slot-scope="text, record, index">
            {{ index + 1 }}
          </div>
          <div slot="price" slot-scope="text">
            {{text | moneyFormatNumber}}
          </div>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script>

import {
  priceAdjustPricingRecordPricingChangList //修改记录
} from '@/api/productOfferManagement'

const columns = [
  {
    align: 'center',
    title: '序号',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '配置价格',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '变更人',
    dataIndex: 'pricingName',
  },
  {
    title: '变更时间',
    dataIndex: 'pricingTime'
  }
]
export default {
  name:'ViewUpdateRecord',
  components:{

  },
  data(){
    return {
      visible:false,
      changeState:undefined,
      itemName:undefined,
      sDate:[],
      columns:columns,
      dataSource:[],
      pagination:{
        current:1
      },
      loading:false,
      extendSearchParam:{} //传入的搜索参数
    }
  },
  computed:{
    modalTitle(){
      return '操作记录'
    },
    searchParam(){
      let startTime =undefined,endTime=undefined
      if(Array.isArray(this.sDate) && this.sDate.length === 2){
        startTime = this.sDate[0].format('YYYY-MM-DD')
        endTime = this.sDate[1].format('YYYY-MM-DD')
      }
      return {
        changeState:this.changeState,
        createdName:this.itemName,
        startTime,
        endTime
      }
    }
  },
  methods:{
    init(){
      let that = this
    },
    searchAction(opt){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.extendSearchParam},{...this.pagination},opt || {})
      console.log('执行搜索...',_searchParam)
      that.loading = true
      priceAdjustPricingRecordPricingChangList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.records.map((item ,index) =>{
          item.key = index
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
    async handleOk(){
      let that = this
      that.handleCancel()
    },
    handleCancel(){
      this.$nextTick(() =>this.visible = false)
    },
    async query(searchParam){
      let that = this
      that.visible = true
      that.pagination.current = 1  
      that.extendSearchParam = Object.assign({},(searchParam || {}))
      that.searchAction()
    }
  }
}
</script>

<style scoped>
  .selected-wrapper{
    padding: 10px 20px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, .1);
  }
  .selected-wrapper .selected-tags{
    margin-top: 8px;
  }
</style>
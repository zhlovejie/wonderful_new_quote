<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false" 
    :footer="null"
  >
    <div class="customer-list-wrapper">
      <div class="search-wrapper">
        <a-input placeholder="产品名称，型号模糊查询" v-model="itemName" allowClear style="width: 200px;"/>
        <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      </div>
      <div class="main-wrapper">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading" 
          @change="handleTableChange" 
          size="middle"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="name" slot-scope="text, record, index">
            <a href="javascript:void(0);" @click="selectItem(record)">{{text}}</a>
          </div>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>
<script>

import {
  priceAdjustProductConfigList,
  priceAdjustProductConfigDetail
} from '@/api/productOfferManagement'

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
  }
]

export default {
  name:'SelectProduct',
  components:{
  },
  data(){
    return {
      itemName:undefined,
      columns:columns,
      dataSource:[],
      pagination:{
        current:1
      },
      loading:false,
      visible:false
    }
  },
  computed:{
    modalTitle(){
      return '选择系列产品'
    },
    searchParam(){
      return {
        name:this.itemName
      }
    }
  },
  methods:{
    query(){
      this.visible = true
      this.itemName = undefined
      this.$nextTick(() => this.searchAction())
    },
    handleCancel(){
      this.visible = false
    },
    selectItem(record){
      let that = this
      that.$emit('selected',record)
      that.handleCancel()

      // that.loading = true
      // priceAdjustProductConfigDetail({ id: record.id }).then(res => {
      //   that.loading = false
      //   let { optStandData, optSelectData, optChoiceData ,optControlData} = that.formatData(res.data.sysConfigList)
      //   that.$emit('selected',{
      //     name: res.data.name,
      //     model: res.data.model,
      //     type: res.data.type,
      //     remarks: res.data.remarks,
      //     sysConfigList:{
      //       optStand:optStandData,
      //       optSelect:optSelectData,
      //       optChoice:optChoiceData,
      //       optControl:optControlData
      //     }
      //   })
      //   that.handleCancel()
      // }).catch(err =>{
      //   that.$message.info(`请求失败：${err.message}`)
      // })
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
    formatData(data) {
      let formatDataItem = data => {
        //返回的列表数据格式转换成需要的数据格式
        return data.map((item, index) => {
          let _item = {
            id: item.itemId,
            itemName: item.name,
            key: item.itemId,
            order: index + 1,
            serialNum: index + 1,
            productId: item.productId,
            price:item.price 
          }
          if ([4, 5].includes(item.type)) {
            _item.isRequire = item.type === 4 ? true : false
          }
          return _item
        })
      }
      let optStandData = data
        .filter(item => item.mainBody === 2 && item.type === 1)
        .sort((a, b) => a.orderNo - b.orderNo)
      let optSelectData = data
        .filter(item => item.mainBody === 2 && item.type === 2)
        .sort((a, b) => a.orderNo - b.orderNo)
      let optControlData = data
        .filter(item => item.mainBody === 2 && item.type === 3)
        .sort((a, b) => a.orderNo - b.orderNo)

      let optChoiceData = data.filter(item => item.mainBody === 2 && [4, 5].includes(item.type))
      
      let groups = [...new Set(optChoiceData.map(item => item.groupId))].sort()
      let res = []
      groups.map(groupId => {
        let dataSource = optChoiceData.filter(item => item.groupId === groupId).sort((a, b) => a.orderNo - b.orderNo)
        if (dataSource.length > 0) {
          res.push({
            dataSource: formatDataItem(dataSource)
          })
        }
      })
      return {
        optStandData: formatDataItem(optStandData),
        optSelectData: formatDataItem(optSelectData),
        optControlData: formatDataItem(optControlData),
        optChoiceData: res
      }
    }
  }
}
</script>
<style scoped>
  .customer-list-wrapper {
    background-color: #fff;
  }
  .customer-list-wrapper .search-wrapper * {
    margin: 10px 15px 0 0;
  }
  .main-wrapper{
    margin-top: 10px;
  }
</style>
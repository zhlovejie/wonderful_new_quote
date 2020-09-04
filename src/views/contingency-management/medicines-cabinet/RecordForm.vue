
<template>
  <a-modal :title="modelTitle" v-model="priewVisible" :footer="null" :maskClosable="false">
    <a-table
      :columns="columns"
      rowKey="id"
      :dataSource="dataSource"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <div slot="order" slot-scope="text,record,index">
        <span>{{ index+1 }}</span>
      </div>
      <div slot="name" slot-scope="text,record">
        <!-- <a @click="handlerSelected(record)">{{ text }}</a> -->
        <a-dropdown>
          <a href="javascript:void(0);" style="text-align:left;">{{ text }}<a-icon type="down" style="margin-left:5px;" /></a>
          <a-menu slot="overlay">
            <a-menu-item v-for="(item, index) in record.customAlias" :key="index" @click="handlerSelected(record,index)">
              <template v-if="item._primary">
                <a-tag color="red">主</a-tag>
              </template>
              <template v-else>
                <a-tag color="pink">辅</a-tag>
              </template>
              {{item.name}}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { 
  emergencyCabinetReplenishmentList, //补货记录信息
  emergencyCabinetInventoryListByCabinet //货道情况
} from '@/api/contingencyManagement'

let columns_goodsRecord = [
  {
    align: 'center',
    title: '货道号',
    dataIndex: 'aisleNum'
  },
  {
    align: 'center',
    title: '商品名称',
    dataIndex: 'medicineName'
  },
  {
    align: 'center',
    title: '补货数量',
    dataIndex: 'replenishmentQuantity'
  },
  {
    align: 'center',
    title: '补货后商品库存',
    dataIndex: 'inventoryQuantity'
  },
  {
    align: 'center',
    title: '补货人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '补货时间',
    dataIndex: 'createdTime'
  }
]

let columns_aisleCase = [
  {
    align: 'center',
    title: '货道号',
    dataIndex: 'aisleNum'
  },
  {
    align: 'center',
    title: '商品名称',
    dataIndex: 'cabinetName'
  },
  {
    align: 'center',
    title: '货道容量',
    dataIndex: 'aisleCapacity'
  },
  {
    align: 'center',
    title: '商品库存',
    dataIndex: 'inventoryQuantity'
  }
]

export default {
  name:'RecordForm',
  data(){
    return {
      loading:false,
      pagination: {
        current:1
      },
      type:'',
      priewVisible:false,
      searchParams:{},
      dataSource:[]
    }
  },
  computed:{
    modelTitle(){
      let m = {
        'goodsRecord':'补货记录',
        'aisleCase':'货道情况'
      }
      return m[this.type]
    },
    columns(){
      return this.type === 'goodsRecord' ? columns_goodsRecord : columns_aisleCase
    },
    api(){
      return this.type === 'goodsRecord' ? emergencyCabinetReplenishmentList : emergencyCabinetInventoryListByCabinet
    }
  },
  methods:{
    query(type,record){
      let that = this
      that.type = type
      that.priewVisible = true
      that.searchParams = {
        cabinetId:record.id
      }
      that.searchAction()
    },
    // 分页
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    //点击查询
    searchAction(){ 
      const that = this
      that.loading = true
      let _param = Object.assign({},that.pagination,that.searchParams)
      console.log(_param)
      return that.api(_param).then((res) => {
        that.dataSource = res.data.records.map(item =>{
          return item
        })
        that.loading = false
        const pagination = { ...that.pagination }
        pagination.total = res.data.total || 0
        this.pagination = pagination
        return res.data
      }).catch(error => {
        console.error(error)
        that.loading = false
      })
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
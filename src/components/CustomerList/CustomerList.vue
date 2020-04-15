
<template>
  <!-- 主名、辅名版本 -->
  <a-modal title="选择客户" v-model="priewVisible" :footer="null" :maskClosable="false">
    <div class="search-options">
      <a-input class="main-items" style="margin-right:10px;" placeholder="客户名称" v-model="customerName" />
      <a-button  type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
    <a-table
      :columns="columns"
      rowKey="id"
      :dataSource="saleCustomers"
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
import { getcusSelectsListPage } from '@/api/contractListManagement'

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
    title: '客户名称',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' }
  }
]

export default {
  name:'CustomerList',
  data(){
    return {
      columns,
      saleCustomers:[],
      consumerNam:null,
      consumerId:null,
      loading:false,
      pagination: {
        current:1
      },
      customerName:undefined,
      priewVisible:false,
      extendParam:{} //扩展参数
    }
  },
  computed:{
    searchParams:function(){
      return {
        name:this.customerName
      }
    }
  },
  methods:{
    init(queryParam){
      let that = this
      that.priewVisible = true
      that.extendParam = {...queryParam}
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
      let _param = Object.assign({},that.pagination,that.searchParams,that.extendParam)
      console.log(_param)
      return getcusSelectsListPage(_param).then((res) => {
        // that.saleCustomers = res.data.records
        that.saleCustomers = res.data.records.map(item =>{
          let _customAlias = []
          _customAlias.push({name:item.name,_primary:true})
          let _alias = item.alias || ''
          let _aliasArr = _alias.split(',')
          if(_alias !== '' && _aliasArr.length > 0){
            _aliasArr.map(aliasStr =>_customAlias.push({name:aliasStr,_primary:false}))
          }
          item.customAlias = _customAlias
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
    },
    //选择客户
    handlerSelected(record,index){
      // this.$emit('selected',record)
      let _record = Object.assign({},record)
      _record.name = _record.customAlias[index].name
      this.$emit('selected',_record)
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
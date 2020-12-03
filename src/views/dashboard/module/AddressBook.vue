<template>
  <div class="customer-list-wrapper">
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading" 
        @change="handleTableChange" 
        size="middle"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </div>
  </div>
</template>
<script>

import {getAddressBookListWithUserName,getAddressBookListWithDeprtment} from '@/api/common'

const uuid = () => Math.random().toString(16).slice(-6) + Math.random().toString(16).slice(-6)
const columns = [
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'userName'
  },
  {
    align: 'center',
    title: '手机公号',
    dataIndex: 'commonMobile'
  },
  {
    align: 'center',
    title: '手机私号',
    dataIndex: 'privateMobile'
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName'
  }
]

export default {
  name:'AddressBook',
  props:{
    userName:{
      type:String,
      default:() => ''
    }
  },
  data(){
    return {
      columns:columns,
      dataSource:[],
      pagination:{
        current:1,
        size:'5'
      },
      loading:false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  mounted(){
    this.init()
  },
  watch:{
    userName(val){
      this.pagination = {current:1,size:'5'}
      this.init()
    }
  },
  methods:{
    init(){
      this.searchAction()
    },
    searchAction(opt){
      let that = this
      let _searchParam = {}
      that.loading = true

      let _api = null
      if(that.userName){
        _api = getAddressBookListWithUserName
        _searchParam = Object.assign({},{userName:that.userName},{...this.pagination},opt || {})
      }else{
        _api = getAddressBookListWithDeprtment
        _searchParam = Object.assign({},{departmentId:that.userInfo.departmentId},{...this.pagination},opt || {})
      }
      console.log('执行搜索...',_searchParam)
      _api(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.map((item,index) =>{
          item.key = uuid()
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
    }
  }
}
</script>

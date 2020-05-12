<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
  >
    <!-- 产品配置表 -->
    <div class="customer-list-wrapper">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input placeholder="配置名称模糊查询" v-model="itemName" allowClear style="width: 200px;"/>
          </a-form-item>
          <a-form-item>
            <a-input placeholder="备注模糊查询" v-model="remarks" allowClear style="width: 200px;"/>
          </a-form-item>
          <a-form-item>
            <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="selected-wrapper">
        <div class="selected-calc">
          已选择&nbsp;{{this.selectedRowKeys.length}}&nbsp;项
        </div>
        <!-- <div class="selected-tags" v-if="hasSelected">
          <a-tag closable color="#1890ff" @close="tagClose(item.key)" v-for="item in selectedRecord" :key="item.id">
            {{ item.itemName }}
          </a-tag>
        </div> -->
      </div>
      <div class="main-wrapper">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading" 
          @change="handleTableChange" 
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          size="small"
        >
          <!-- <div slot="itemName" slot-scope="text">
            <a-tooltip v-if="String(text).length > 15">
              <template slot="title">{{text}}</template>
              {{ String(text).slice(0,15) }}...
            </a-tooltip>
            <span v-else>{{text}}</span>
          </div>
          <div slot="remarks" slot-scope="text">
            <a-tooltip v-if="String(text).length > 15">
              <template slot="title">{{text}}</template>
              {{ String(text).slice(0,15) }}...
            </a-tooltip>
            <span v-else>{{text}}</span>
          </div> -->
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script>

import {
  priceAdjustItemConfigList
} from '@/api/productOfferManagement'

const columns = [
  {
    align: 'center',
    title: '序号',
    dataIndex: 'order',
    key: 'order',
    width:'70px'
  },
  {
    align: 'center',
    title: '配置名称',
    dataIndex: 'itemName',
    key: 'itemName',
    scopedSlots: { customRender: 'itemName' },
    width:'400px'
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
    scopedSlots: { customRender: 'remarks' },
    width:'200px'
  }
]
export default {
  name:'AddForm',
  components:{

  },
  data(){
    return {
      visible:false,
      itemName:undefined,
      remarks:undefined,
      columns:columns,
      dataSource:[],
      pagination:{
        current:1
      },
      loading:false,
      selectedRowKeys:[],
      selectedRecord:[], //显示用
      inputKey:null, //输入参数 原样返回
      extendSearchParam:{} //传入的搜索参数
    }
  },
  computed:{
    modalTitle(){
      return '产品配置'
    },
    searchParam(){
      return {
        itemName:this.itemName,
        remarks:this.remarks
      }
    },
    hasSelected(){
      return this.selectedRowKeys.length > 0
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
      priceAdjustItemConfigList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.records.map((item,index) =>{
          item.order = index + 1
          item.key = item.id
          return item
        })
        //设置数据总条数
        const pagination = { ...that.pagination }
        pagination.total = res.data.total
        that.pagination = pagination
      }).catch(err => that.loading = false)
    },
    onSelectChange(selectedRowKeys,selectedRecords) {
      let that = this
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      that.selectedRowKeys = selectedRowKeys

      let obj = {}
      let all = [...that.selectedRecord,...selectedRecords].reduce((accr,item,idx)=>{
        if(!obj[item.key]){
          accr.push(item)
          obj[item.key] = true
        }
        return accr
      },[]) 

      that.selectedRecord = all.filter(item =>that.selectedRowKeys.includes(item.key))
    },
    tagClose(key){
      this.selectedRecord = this.selectedRecord.filter(item =>item.key !== key)
      this.selectedRowKeys = this.selectedRecord.map(item =>item.key)
    },
    // 分页
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({current:pagination.current})
    },
    async handleOk(){
      let that = this
      that.handleCancel()
      that.$emit('select',{
        inputKey:that.inputKey, //输入参数原样返回
        selectedRecord:that.selectedRecord //输出参数
      })
    },
    handleCancel(){
      this.$nextTick(() =>this.visible = false)
    },
    async query(opt){
      //debugger
      let that = this
      let {key,searchParam,selected} = opt
      that.inputKey = key
      that.visible = true
      that.pagination.current = 1  
      that.extendSearchParam = Object.assign({},(searchParam || {}))
      that.selectedRowKeys = selected.map(item => item.key)
      that.selectedRecord = selected.map(item => Object.assign({},item))

      that.itemName = undefined
      that.remarks = undefined
      that.$nextTick(() => that.searchAction())
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
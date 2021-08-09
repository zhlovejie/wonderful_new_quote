<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
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
            <a-select v-model="changeState" :allowClear="true" style="width: 120px;" placeholder="变更">
              <a-select-option :value="1">添加</a-select-option>
              <a-select-option :value="2">删除</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select v-model="configType" :allowClear="true" style="width: 120px;" placeholder="配置类型">
              <a-select-option :value="0">标配</a-select-option>
              <a-select-option :value="1">选配</a-select-option>
              <a-select-option :value="2">中控</a-select-option>
            </a-select>
          </a-form-item>
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
          size="middle"
        >
          <div slot="order" slot-scope="text, record, index">
            {{ index + 1 }}
          </div>
          <div slot="changeState" slot-scope="text">
            {{parseInt(text,10) === 1 ? '添加' : '删除'}}
          </div>
          <div slot="configType" slot-scope="text">
            {{ {0:'标配',1:'选配',2:'中控'}[text] }}
          </div>

        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script>

import {
  productUpdateRecordList //修改记录
} from '@/api/productOfferManagement'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' },
    width:'70px'
  },
  {
    title: '变更',
    dataIndex: 'changeState',
    scopedSlots: { customRender: 'changeState' },
    width:'100px'
  },
  {
    title: '配置项',
    dataIndex: 'configName',
    width:'220px'
  },
  {
    title: '配置类型',
    dataIndex: 'configType',
    width:'100px',
    scopedSlots: { customRender: 'configType' },
  },
  {
    title: '变更人',
    dataIndex: 'createdName',
    width:'120px'
  },
  {
    title: '变更时间',
    dataIndex: 'createdTime',
    width:'180px'
  }
]
export default {
  data(){
    return {
      visible:false,
      changeState:undefined,
      itemName:undefined,
      configType:undefined,
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
        startTime = this.sDate[0] instanceof this.moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof this.moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      return {
        changeState:this.changeState,
        configType:this.configType,
        createdName:this.itemName,
        startTime,
        endTime
      }
    }
  },
  methods:{
    moment,
    init(){
      let that = this
    },
    searchAction(opt){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.extendSearchParam},{...this.pagination},opt || {})
      console.log('执行搜索...',_searchParam)
      that.loading = true
      productUpdateRecordList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.records.map((item,index) =>{
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
      that.resetForm()
      that.pagination.current = 1
      that.extendSearchParam = Object.assign({},(searchParam || {}))
      that.searchAction()
    },
    resetForm(){
      let that = this
      that.changeState = undefined
      that.itemName = undefined
      that.sDate = [undefined,undefined]
      that.dataSource = []
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

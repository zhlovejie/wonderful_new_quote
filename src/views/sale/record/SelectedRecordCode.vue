<template>
    <a-modal
      :title="modalTitle"
      :width="1000"
      :visible="visible"
      @cancel="handleCancel"
      :maskClosable="false" 
      :footer="null"
    >
    <div class="record-new-list-wrapper">
      <div class="search-wrapper">
        <a-input placeholder="项目名称模糊查询" v-model="projectName" allowClear style="width: 200px;margin-right:10px;"/>
        <a-input placeholder="项目地址模糊查询" v-model="projectAddress" allowClear style="width: 200px;margin-right:10px;"/>
        <label style="margin-right:5px;">截止日期</label>
        <a-range-picker v-model="sDate" style="margin-right:10px;" />
        <a-button class="a-button" type="primary" style="position: relative;top:-1px;" icon="search" @click="searchAction">查询</a-button>
      </div>
      <div class="main-wrapper">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading" 
          @change="handleTableChange"
        >
          <div slot="recordCode" slot-scope="text, record,">
            <a href="javascript:void(0);" @click="selectedAction(record)">{{text}}</a>
          </div>
          <div slot="projectSituation" slot-scope="text, record, index">
            <a-popover title="项目情况" trigger="hover">
              <template slot="content">
                <p>{{text || '无'}}</p>
              </template>
              <span>{{ text ? String(text).slice(0,10)+'...' : '无' }}</span>
            </a-popover>
          </div>
        </a-table>
      </div>
    </div>
    </a-modal>
</template>
<script>
import {
  saleRecordPageList,
  saleRecordDelete
} from '@/api/investigate'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '备案编号',
    dataIndex: 'recordCode',
    key: 'recordCode',
    scopedSlots: { customRender: 'recordCode' }
  },
  {
    align: 'center',
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName'
  },
  {
    align: 'center',
    title: '项目地址',
    key: 'projectAddress',
    dataIndex: 'projectAddress'
  },
  {
    align: 'center',
    title: '项目情况',
    key: 'projectSituation',
    dataIndex: 'projectSituation',
    scopedSlots: { customRender: 'projectSituation' }
  },
  {
    align: 'center',
    title: '截止日期',
    key: 'deadline',
    dataIndex: 'deadline'
  }
]

export default {
  name:'recordNewList',
  components:{
  },
  data(){
    return {
      visible:false,
      modalTitle:'选择备案编号',
      activeKey:0, //全部通过状态的授权
      status:1,
      projectName:undefined,
      projectAddress:undefined,
      sDate:[undefined,undefined],
      approval_status:undefined,
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
      let startTime = undefined,endTime = undefined
      if(Array.isArray(this.sDate) && this.sDate.length === 2){
        startTime = this.sDate[0] instanceof moment 
        ? this.sDate[0].format('YYYY-MM-DD') 
        : undefined
        endTime = this.sDate[1] instanceof moment 
        ? this.sDate[1].format('YYYY-MM-DD') 
        : undefined
      }
      return {
        projectName:this.projectName,
        projectAddress:this.projectAddress,
        searchStatus:this.approval_status,
        startTime:startTime,
        endTime:endTime,
        status:this.status
      }
    }
  },
  methods:{
    moment:moment,
    query(){
      let that = this
      this.visible = true
      this.searchAction()
    },
    searchAction(opt){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.pagination},opt || {},{searchStatus:that.activeKey})
      console.log('执行搜索...',_searchParam)
      that.loading = true
      saleRecordPageList(_searchParam).then(res => {
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
    handleCancel(){
      this.visible = false
    },
    selectedAction(record){
      this.$emit('selected',record)
      this.handleCancel()
    }
  }
}
</script>
<style scoped>
  .record-new-list-wrapper {
    background-color: #fff;
    padding: 10px 20px;
  }

  .main-wrapper{
    margin-top: 20px;
  }
</style>

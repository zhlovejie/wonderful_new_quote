<template>
  <!-- 岗位说明书 -->
  <div class="tool-post-explain-wrapper">
    <div class="search-wrapper">
      <a-select placeholder="选择部门" v-model="dep_id" @change="depChangeHandler" style="width: 200px">
        <a-select-option :value="0">请选择部门</a-select-option>
        <a-select-option 
          v-for="item in depSelectDataSource" 
          :key="item.id" 
          :value="item.id" 
        >
        {{item.departmentName}}
        </a-select-option>
      </a-select>

      
      <a-select placeholder="选择岗位" v-model="post_id" style="width: 200px">
        <a-select-option :value="0">请选择岗位</a-select-option>
        <a-select-option 
          v-for="item in postSelectDataSource" 
          :key="item.id" 
          :value="item.id" 
        >
        {{item.stationName}}
        </a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
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
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a type="primary" target="_blank" :href="record.wordUrl">下载</a>
        </div>
      </a-table>
    </div>

    <ToolPostExplainForm ref="toolPostExplainForm" @finish="searchAction()" />
  </div>
</template>

<script>
import {
  departmentList,//所有部门
  getStationList, //获取部门下面的岗位
  
} from '@/api/systemSetting'
import { getToolPostExplainList } from '@/api/toolPostExplain'
import ToolPostExplainForm from './modules/ToolPostExplainForm'

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
    title: '岗位编号',
    dataIndex: 'serialNumber',
    key: 'serialNumber'
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'depName',
    key: 'depName',
    scopedSlots: { customRender: 'depName' }
  },
  {
    align: 'center',
    title: '岗位名称',
    key: 'stationName',
    dataIndex: 'stationName',
    scopedSlots: { customRender: 'stationName' }
  },
  {
    align: 'center',
    title: '操作人',
    dataIndex: 'createdName',
    key: 'createdName',
    scopedSlots: { customRender: 'createdName' }
  },
  {
    align: 'center',
    title: '操作时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
    scopedSlots: { customRender: 'createdTime' }
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]


export default {
  name:'ToolPostExplain',
  components:{
    ToolPostExplainForm:ToolPostExplainForm
  },
  data(){
    return {
      dep_id:0,
      post_id:0,
      depSelectDataSource:[],
      postSelectDataSource:[],
      columns:columns,
      dataSource:[],
      pagination:{},
      loading:false,
      current:1
    }
  },
  computed:{
    searchParam(){
      return {
        depId:this.dep_id,
        stationId:this.post_id
      }
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'ToolPostExplain'){
          this.init()
        }
      },
      immediate:true
    }
  },
  methods:{
    init(){
      let that = this
      //depSelectDataSource
      departmentList().then(res =>{
        that.depSelectDataSource = res.data
      })
      
      this.searchAction()

    },
    searchAction(){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.pagination})
      console.log('执行搜索...',_searchParam)
      that.loading = true
      getToolPostExplainList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.map((item,index) =>{
          item.key = index + 1
          return item
        })
      }).catch(err => that.loading = false)
    },
    depChangeHandler(dep_id){
      let that = this
      that.postSelectDataSource = []
      that.post_id = 0
      getStationList({id:dep_id}).then(res =>{
        that.postSelectDataSource = res.data
      })
    },
    // 分页
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({current:pagination.current})
    },
    doAction(actionType,record){
      this.$refs.toolPostExplainForm.query({
        actionType:actionType,
        toolPostExplainId:record ? record.id : null
      })
    }
  }
}
</script>

<style scoped>
  .tool-post-explain-wrapper {
    background-color: #fff;
    padding: 10px 20px;
  }
  .tool-post-explain-wrapper .search-wrapper * {
    margin: 10px 15px 0 0;
  }
  .main-wrapper{
    margin-top: 20px;
  }
</style>
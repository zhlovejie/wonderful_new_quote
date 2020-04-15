<template>
  <!-- 面试记录 -->
  <div class="interview-record-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="员工名称模糊查询" v-model="person_name" allowClear style="width: 200px;"/>
      <a-input placeholder="手机号模糊查询" v-model="person_phone" allowClear style="width: 200px;"/>

      <a-select
        placeholder="选择岗位"
        :allowClear="true"
        v-model="stationId"
        style="width: 200px;" 
        showSearch 
        :filterOption="filterCustomerOption"
      >
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select>


      <!-- <a-cascader 
        style="width: 260px;" 
        v-model="stationId"
        :options="departmentOptions" 
        @change="departmentCascaderChange" 
        :loadData="departmentCascaderLoadData" 
        placeholder="选择岗位" 
      /> -->

      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
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

        <div slot="firstResult" slot-scope="text, record, index">
          <span>{{ getResultTxt(record.firstResult)}}</span>
        </div>

        <div slot="secondResult" slot-scope="text, record, index">
          <span>{{ getResultTxt(record.secondResult) }}</span>
        </div>

        <div slot="resumeUrl" slot-scope="text, record, index">
          <a href="javascript:void(0);" v-if="record.resumeUrl" @click="doAction('jl',record)">查看</a>
          <span v-else>无</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <template v-if="record.showModifyButtonFlag === 1">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit',record)">处理</a>
          </template>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction" />
    <XdocView ref="xdocView" />
  </div>
</template>
<script>
import {
  departmentList,//所有部门
  getStationList, //获取部门下面的岗位
  queryPositionList //获取部门下面的岗位
} from '@/api/systemSetting'
import {getInterviewRecordList} from '@/api/personnelManagement'
import AddForm from './module/AddForm'
import XdocView from '@/views/personnel-management/apply/severance-apply/module/XdocView'

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
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    align: 'center',
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    scopedSlots: { customRender: 'phone' }
  },
  {
    align: 'center',
    title: '应聘岗位',
    key: 'stationName',
    dataIndex: 'stationName',
    scopedSlots: { customRender: 'stationName' }
  },
  {
    align: 'center',
    title: '初试结果',
    dataIndex: 'firstResult',
    key: 'firstResult',
    scopedSlots: { customRender: 'firstResult' }
  },
  {
    align: 'center',
    title: '初试人员',
    dataIndex: 'firstName',
    key: 'firstName',
    scopedSlots: { customRender: 'firstName' }
  },
  {
    align: 'center',
    title: '初试日期',
    dataIndex: 'firstDate',
    key: 'firstDate',
    scopedSlots: { customRender: 'firstDate' }
  },
  {
    align: 'center',
    title: '复试结果',
    dataIndex: 'secondResult',
    key: 'secondResult',
    scopedSlots: { customRender: 'secondResult' }
  },
  {
    align: 'center',
    title: '复试人员',
    dataIndex: 'secondName',
    key: 'secondName',
    scopedSlots: { customRender: 'secondName' }
  },
  {
    align: 'center',
    title: '复试日期',
    dataIndex: 'secondDate',
    key: 'secondDate',
    scopedSlots: { customRender: 'secondDate' }
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
    title: '简历',
    key: 'resumeUrl',
    dataIndex: 'resumeUrl',
    scopedSlots: { customRender: 'resumeUrl' }
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
    AddForm:AddForm,
    XdocView:XdocView
  },
  data(){
    return {
      activeKey:0,
      stationId:undefined,
      person_name:undefined,
      person_phone:undefined,
      departmentOptions:[], //岗位 级联 部门岗位
      postSelectDataSource:[],
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
      return {
        name:this.person_name,
        phone:this.person_phone,
        stationId:this.stationId
      }
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'interview-record'){
          this.init()
        }
      },
      immediate:true
    }
  },
  methods:{
    init(){
      let that = this
      //岗位
      queryPositionList().then(res => that.postSelectDataSource = Object.values(res.data).flat())
      this.searchAction()
    },
    searchAction(opt){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.pagination},opt || {})
      console.log('执行搜索...',_searchParam)
      that.loading = true
      getInterviewRecordList(_searchParam).then(res => {
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


      //this.$refs.addForm.query('edit',{})
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
      if(type === 'jl'){
        this.$refs.xdocView.query(record.resumeUrl)
        return
      }
      this.$refs.addForm.query(type,record)
      //this.$message.info('功能尚未实现...')
    },
    getStateText(state){
      let stateMap = {
        0:'待提交',
        1:'待审批',
        2:'通过',
        3:'不通过'
      }
      return stateMap[state] || `未知状态:${state}`
    },
    getEvaluationText(evaluation){
      let evaluationMap = {
        0:'无',
        1:'通过',
        2:'不通过'
      }
      return evaluationMap[evaluation] || `未知:${evaluation}`
    },
    getResultTxt(result){
      if(result === 0){
        return '不通过'
      }else if(result === 1){
        return '通过'
      }else{
        return '-'
      }
    },
    filterCustomerOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  }
}
</script>
<style scoped>
  .interview-record-list-wrapper {
    background-color: #fff;
    padding: 10px 20px;
  }
  .interview-record-list-wrapper .search-wrapper * {
    margin: 10px 15px 0 0;
  }
  .main-wrapper{
    margin-top: 20px;
  }
</style>
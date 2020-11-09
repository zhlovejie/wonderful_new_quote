<template>
  <!-- 新项目备案 -->
  <div class="record-new-list-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="项目名称模糊查询" v-model="projectName" allowClear style="width: 200px;margin-right:10px;"/>
      <a-input placeholder="项目地址模糊查询" v-model="projectAddress" allowClear style="width: 200px;margin-right:10px;"/>
      <label style="margin-right:5px;">截止日期</label>
      <a-range-picker v-model="sDate" style="margin-right:10px;" />
      <a-select 
        v-if="activeKey === 0" 
        placeholder="处理状态"
        :allowClear="true" 
        v-model="status"
        style="width: 120px;margin-right:10px;"
      >
        <a-select-option :value="0">待审批</a-select-option>
        <a-select-option :value="1">通过</a-select-option>
        <a-select-option :value="2">不通过</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" style="position: relative;top:-1px;" icon="search" @click="searchAction">查询</a-button>
      
      <a-button class="a-button" style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0"/>
        <template v-if="$auth('recordNewList:approval')">
        <a-tab-pane tab="待审批" key="1"/>
        <a-tab-pane tab="已审批" key="2"/>
        </template>
      </a-tabs>
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
        
        <div slot="status" slot-scope="text, record, index">
          <a  @click="approvalPreview(record)" >{{ getStatusText(text) }}</a>
        </div>
        <div slot="projectSituation" slot-scope="text, record, index">
          <a-popover title="项目情况" trigger="hover">
            <template slot="content">
              <p>{{text || '无'}}</p>
            </template>
            <span>{{ text ? String(text).slice(0,10)+'...' : '无' }}</span>
          </a-popover>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 单据审批状态：0 待审批，1 审批通过，2 审批驳回  9已撤回-->
          <a type="primary" @click="doAction('view',record)">查看</a>
          <template v-if="activeKey === 0">
            
            <template v-if="record.status !== 0 && $auth('recordNewList:del')">
              <a-divider type="vertical"/>
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del',record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
            <template v-if="[2,9].includes(+record.status)">
              <a-divider type="vertical"/>
              <a type="primary" @click="doAction('edit',record)">修改</a>
            </template>
            <template v-if="record.status === 0">
              <a-divider type="vertical"/>
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback',record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 1">
            <a type="primary" @click="doAction('approval',record)">审批</a>
          </template>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="searchAction()"/>
  </div>
</template>
<script>
import {
  saleRecordPageList,
  saleRecordDelete,
  saleRecordRevocation
} from '@/api/investigate'
import AddForm from './module/AddForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo' 
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '备案编号',
    dataIndex: 'recordCode',
  },
  {
    align: 'center',
    title: '项目名称',
    dataIndex: 'projectName',
  },
  {
    align: 'center',
    title: '项目地址',
    dataIndex: 'projectAddress'
  },
  {
    align: 'center',
    title: '项目情况',
    dataIndex: 'projectSituation',
    scopedSlots: { customRender: 'projectSituation' }
  },
  {
    align: 'center',
    title: '截止日期',
    dataIndex: 'deadline'
  },
  {
    align: 'center',
    title: '处理状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    align: 'center',
    title: '操作人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '操作时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name:'recordNewList',
  components:{
    AddForm:AddForm,
    ApproveInfo:ApproveInfo
  },
  data(){
    return {
      activeKey:0,
      status:undefined,
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
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'recordNewList'){
          this.init()
        }
      },
      immediate:true
    }
  },
  methods:{
    moment:moment,
    init(){
      let that = this
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
    doAction(type,record){
      const that = this
      console.log(type)
      if(type === 'del'){
        saleRecordDelete({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        })
        return 
      }else if(type === 'reback'){
        saleRecordRevocation({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
      that.$refs.addForm.query(type,record)
      //this.$message.info('功能尚未实现...')
    },
    getStatusText(state){
      let stateMap = {
        0:'待审批',
        1:'通过',
        2:'驳回',
        9:'已撤回'
      }
      return stateMap[state] || `未知状态:${state}`
    },
    tabChange(tagKey){
      this.activeKey = parseInt(tagKey)
      if(this.activeKey !== 0){
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({current:1,searchStatus:this.activeKey})
    },
    approvalPreview(record){
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    handleMenuClick(e){
      console.log('click', e)
      this.$refs.addForm.query('add',{
        operationStatus:parseInt(e.key,10)
      })
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
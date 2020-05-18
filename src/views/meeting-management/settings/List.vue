<template>
  <!-- 会议设置 -->
  <div class="meeting-settings-wrapper">
    <div class="search-wrapper">
      <a-select
        placeholder="选择会议类别"
        v-model="meetingType"
        :allowClear="true"
        style="width: 150px"
      >
        <a-select-option v-for="item in meetingTypesList" :key="item.id" :value="item.id" >
          {{item.text}}
        </a-select-option>
      </a-select>

      <a-select
        placeholder="选择会议部门"
        v-model="depId"
        :allowClear="true"
        style="width: 150px"
      >
        <a-select-option
          v-for="item in depList"
          :key="item.id"
          :value="item.id"
        >
          {{item.departmentName}}
        </a-select-option>
      </a-select>

      <a-input placeholder="会议名称查询" v-model="meetingName" allowClear style="width:150px;" />
      <a-input placeholder="会议负责人查询" v-model="chargePersonName" allowClear style="width:150px;" />

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
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
        <div slot="checkFlag" slot-scope="text, record, index">
          <span>{{ text === 1 ? '有' : '无' }}</span>
        </div>
        
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical"  />
          <a-popconfirm
            title="是否要删除此行？"
            @confirm="doAction('del',record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
  </div>
</template>

<script>
import {
  departmentList,//所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import {
  meetingSetList,
  meetingSetDetail,
  meetingSetDelete,
  meetingSetSaveOrUpdate
} from '@/api/meetingManagement'
import AddForm from './module/AddForm'
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
    title: '会议类别',
    dataIndex: 'typeDicName'
  },
  {
    align: 'center',
    title: '会议部门',
    dataIndex: 'departmentName'
  },
  {
    align: 'center',
    title: '会议名称',
    dataIndex: 'name'
  },
  {
    align: 'center',
    title: '会议负责人',
    dataIndex: 'chargePersonName'
  },
  {
    align: 'center',
    title: '会议时间',
    dataIndex: 'setTimeStr'
  },
  {
    align: 'center',
    title: '是否有考核',
    dataIndex: 'checkFlag',
    scopedSlots: { customRender: 'checkFlag' }
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdUserName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name:'meetingManagementSettings',
  components:{
    AddForm
  },
  data(){
    return {
      depId:undefined,
      meetingType:undefined,
      meetingName:undefined,
      chargePersonName:undefined,

      meetingTypesList:[],
      depList:[],
      columns:columns,
      dataSource:[],
      pagination:{
        current:1
      },
      loading:false,
    }
  },
  computed:{
    searchParam(){
      return {
        departmentId:this.depId,
        typeDicId:this.meetingType,
        name:this.meetingName,
        chargePersonName:this.chargePersonName
      }
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'meetingManagementSettings'){
          this.init()
        }
      },
      immediate:true
    }
  },
  methods:{
    init(){
      //let that = this

      let that = this
      getDictionaryList({parentId:498}).then(res => that.meetingTypesList = res.data)
      departmentList().then(res => that.depList = res.data)
      this.searchAction()
    },
    searchAction(opt = {}){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.pagination},opt)
      console.log('执行搜索...',_searchParam)
      that.loading = true
      meetingSetList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.records.map((item,index) =>{
          item.key = index + 1
          return item
        })

        //设置数据总条数
        const pagination = { ...that.pagination }
        pagination.total = res.data.total || 0
        pagination.current = res.data.current || 1
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
    doAction(actionType,record){
      let that = this
      if(actionType === 'del'){
        console.log(record)
        meetingSetDelete(`id=${record.id}`).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
      this.$refs.addForm.query(actionType,record)
    }
  }
}
</script>

<style scoped>
  .meeting-settings-wrapper {
    background-color: #fff;
    padding: 10px 20px;
  }
  .meeting-settings-wrapper .search-wrapper * {
    margin: 10px 15px 0 0;
  }
  .main-wrapper{
    margin-top: 20px;
  }

</style>

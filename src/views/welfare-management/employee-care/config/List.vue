<template>
  <!-- 员工关怀 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
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
        <div slot="marry" slot-scope="text, record, index">
          {{text | moneyFormatNumber}}
        </div>
        <div slot="child" slot-scope="text, record, index">
          {{text | moneyFormatNumber}}
        </div>
        <div slot="sick" slot-scope="text, record, index">
          {{text | moneyFormatNumber}}
        </div>
        <div slot="funeral" slot-scope="text, record, index">
          {{text | moneyFormatNumber}}
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
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

    <AddForm ref="addForm" @finish="searchAction()" />

  </div>
</template>

<script>
import {
  departmentList,//所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import {
  caringSettingList,
  caringSettingDel,
  caringSettingAddOrUpdate
} from '@/api/welfareManagement'
import AddForm from './AddForm'

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
    title: '员工级别',
    dataIndex: 'userLevel'
  },
  {
    align: 'center',
    title: '结婚关怀',
    dataIndex: 'marry',
    scopedSlots: { customRender: 'marry' }
  },
  {
    align: 'center',
    title: '生子关怀',
    dataIndex:'child',
    scopedSlots: { customRender: 'child' }
  },
  {
    align: 'center',
    title: '生病关怀',
    dataIndex:'sick',
    scopedSlots: { customRender: 'sick' }
  },
  {
    align: 'center',
    title: '丧事关怀',
    dataIndex:'funeral',
    scopedSlots: { customRender: 'funeral' }
  },
  {
    align: 'center',
    title: '提交人',
    key: 'createdName',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '提交日期',
    key: 'createdTime',
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
  name:'welfare-management-employee-care-config',
  components:{
    AddForm:AddForm,
  },
  data(){
    return {
      depId:undefined,
      stationId:undefined,
      columns:columns,
      dataSource:[],
      depSelectDataSource:[],
      postSelectDataSource:[],
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
        stationId:this.stationId
      }
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'welfare-management-employee-care-config'){
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
      //depSelectDataSource
      departmentList().then(res =>{
        that.depSelectDataSource = res.data
      })
      this.searchAction()
    },
    searchAction(opt = {}){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.pagination},opt)
      console.log('执行搜索...',_searchParam)
      that.loading = true
      caringSettingList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.map((item,index) =>{
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
      if(actionType === 'edit' || actionType === 'add'){
        this.$refs.addForm.query(actionType,record)
      }
      else if(actionType === 'del'){
        caringSettingDel(`id=${record.id}`).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        }).catch(err =>{
          that.$message.info(`错误：${err.message}`)
        })
      }
      else{
        this.$message.info('功能尚未实现！')
      }
    },
    depChangeHandler(dep_id){
      let that = this
      that.postSelectDataSource = []
      return getStationList({id:dep_id}).then(res =>{
        that.postSelectDataSource = res.data
      })
    }
  }
}
</script>

<style scoped>
  .wdf-custom-wrapper {
    background-color: #fff;
    padding: 10px 20px;
  }
  .wdf-custom-wrapper .search-wrapper * {
    margin: 10px 15px 0 0;
  }
  .main-wrapper{
    margin-top: 20px;
  }
</style>

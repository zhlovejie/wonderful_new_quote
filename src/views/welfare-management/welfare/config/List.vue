<template>
  <!-- 福利标准 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-button v-if="dataSource.length === 0" style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
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
  birthdayWelfareSettingList,
  birthdayWelfareSettingDel,
  birthdayWelfareSettingAddOrUpdate
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
    title: '福利名称',
    dataIndex: 'welfareName'
  },
  {
    align: 'center',
    title: '金额(元)',
    dataIndex: 'money',
    scopedSlots: { customRender: 'money' }
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
  name:'welfare-management-welfare-config',
  components:{
    AddForm:AddForm,
  },
  data(){
    return {
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
        
      }
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'welfare-management-welfare-config'){
          this.init()
        }
      },
      immediate:true
    }
  },
  methods:{
    init(){
      let that = this
      this.searchAction()
    },
    searchAction(opt = {}){
      let that = this
      let _searchParam = Object.assign({},{...this.searchParam},{...this.pagination},opt)
      console.log('执行搜索...',_searchParam)
      that.loading = true
      birthdayWelfareSettingList(_searchParam).then(res => {
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
        birthdayWelfareSettingDel(`id=${record.id}`).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        }).catch(err =>{
          that.$message.info(`错误：${err.message}`)
        })
      }
      else{
        this.$message.info('功能尚未实现！')
      }
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

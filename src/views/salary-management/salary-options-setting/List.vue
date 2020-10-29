<template>
  <!-- 薪资项设置 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-select
        placeholder="选择部门"
        v-model="depId"
        :allowClear="true"
        showSearch
        optionFilterProp="children"
        :filterOption="selectFilter"
        style="width: 150px"
        @change="depChangeHandler"
      >
        <a-select-option
          v-for="item in depList"
          :key="item.id"
          :value="item.id"
        >
          {{item.departmentName}}
        </a-select-option>
      </a-select>

      <a-select 
        placeholder="选择岗位"
        v-model="postId"
        :allowClear="true" 
        showSearch
        optionFilterProp="children"
        :filterOption="selectFilter"
        style="width:200px;"
      >
        <a-select-option
          v-for="item in postList"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <a-button v-if="$auth('salary-options-setting:add')" style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
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
            <a type="primary"  @click="doAction('view',record)">查看</a>
            <template v-if="$auth('salary-options-setting:edit')">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit',record)">修改</a>
            </template>
            <template v-if="$auth('salary-options-setting:del')">
            <a-divider type="vertical"  />
            <a-popconfirm
              title="是否要删除此行？"
              @confirm="doAction('del',record)"
            >
              <a>删除</a>
            </a-popconfirm>
            </template>
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
import { getDictionary} from '@/api/common'
import {
  oaSalaryConsistAddOrUpdate,
  oaSalaryConsistDetail,
  oaSalaryConsistDel,
  oaSalaryConsistPageList,
  oaSalaryConsistIsAddByStationId,
  oaSalaryConsistValidate
} from '@/api/salaryManagement'
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
    title: '部门',
    dataIndex: 'departmentName'
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name:'salary-options-setting',
  components:{
    AddForm
  },
  data(){
    return {
      depId:undefined,
      postId:undefined,
      depList:[],
      postList:[],
      columns:columns,
      dataSource:[],
      pagination: {
        current: 1,
        size:"10",
        showSizeChanger: true,
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading:false,
      bindEnterFn: null,
    }
  },
  computed:{
    searchParam(){
      return {
        departmentId:this.depId,
        stationId:this.postId
      }
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'salary-options-setting'){
          this.init()
        }
      },
      immediate:true
    }
  },
  mounted() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    that.bindEnterFn = (event) => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
    }
  },
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
  },
  methods:{
    init(){
      let that = this
      //getDictionary({ text: '产品类型' }).then(res =>this.productTypes = res.data)
      departmentList().then(res => that.depList = res.data)
      this.searchAction()
    },
    searchAction(opt = {}){
      let that = this
      let paginationParam = {
        current:that.pagination.current || 1,
        size:that.pagination.size || 10
      }
      let _searchParam = Object.assign({},{...this.searchParam},paginationParam,opt)
      console.log('执行搜索...',_searchParam)
      that.loading = true
      oaSalaryConsistPageList(_searchParam).then(res => {
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

        //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
        //刷新也不显示数据
        let {current,pages} = res.data
        if(+pages > 0 && +current > +pages){
          that.pagination = {...pagination,current:pages}
          that.searchAction()
        }
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
    onShowSizeChangeHandler(current,pageSize){
      let pagination = {...this.pagination}
      pagination.current = current
      pagination.size = String(pageSize)
      this.pagination = pagination
      this.searchAction()
    },
    doAction(actionType,record){
      let that = this
      if(actionType === 'del'){
        console.log(record)
        oaSalaryConsistDel({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
      this.$refs.addForm.query(actionType,record)
    },
    depChangeHandler(dep_id) {
      let that = this
      return getStationList({ id: dep_id }).then(res => (that.postList = res.data))
    },
    selectFilter(input, option) {
      // 下拉框搜索
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
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

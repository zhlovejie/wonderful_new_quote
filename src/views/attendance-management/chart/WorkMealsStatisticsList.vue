<template>
  <!-- 工作餐统计 -->
  <div class="wdf-custom-wrapper" id="work-meals-statistics-list">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
            <a-button-group>
              <a-button type="primary" :class="{currentDayWeekMonth:+searchParam.isToday === 1}" @click="simpleSearch(1)">今天</a-button>
              <a-button type="primary" :class="{currentDayWeekMonth:+searchParam.isToday === 0}" @click="simpleSearch(0)">全部</a-button>
            </a-button-group>
          </a-form-item>
        <a-form-item>
          <a-input placeholder="员工名模糊查询" v-model="searchParam.userName" allowClear style="width:200px;" />
        </a-form-item>
        <a-form-item>
          <a-select 
            placeholder="选择部门"
            v-model="searchParam.depId"
            :allowClear="true" 
            style="width:200px;"
          >
            <a-select-option
              v-for="item in depList"
              :key="item.id"
              :value="item.id"
            >{{item.departmentName}}</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item>
          <a-range-picker v-model="sDate" @change="rangePickerChange" style="width:220px;" :allowClear="true"/>
        </a-form-item>
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="searchAction({current:1})"
          >查询</a-button>
        </a-form-item>

      </a-form>
    </div>
    <div class="main-wrapper">
      <h2>
        <span>数量(份)：{{mealInfo.workLunchEatNum || 0}}</span>
        <span style="margin-left:50px;">就餐(人)：{{mealInfo.workLunchNum || 0}}</span>
      </h2>
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
        <div slot="unum" slot-scope="text, record">
          {{text}}
        </div>
        <div slot="cnum" slot-scope="text, record">
          <a href="javascript:void(0);" @click="doAction('view',record)">{{text}}</a>
        </div>
        <div slot="isEat" slot-scope="text">
          {{+text === 1 ? '是' :'否'}}
        </div>
      </a-table>
    </div>
    <WorkMealView ref="workMealView" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
} from '@/api/systemSetting'
import WorkMealView from './WorkMealView'
import {
  getWorkLunchCensus, 
  getCustomerLunchById,
  getWorkLunchNum
} from '@/api/attendanceManagement'

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
    title: '日期',
    dataIndex:'orderDate'
  },
  {
    align: 'center',
    title: '员工名',
    dataIndex:'userName'
  },
  {
    align: 'center',
    title: '部门',
    dataIndex:'depName'
  },
  {
    align: 'center',
    title: '员工餐数量(份)',
    dataIndex:'unum',
    scopedSlots: { customRender: 'unum' }
  },
  {
    align: 'center',
    title: '客户餐数量(份)',
    dataIndex:'cnum',
    scopedSlots: { customRender: 'cnum' }
  },
  {
    align: 'center',
    title: '是否就餐',
    dataIndex:'isEat',
    scopedSlots: { customRender: 'isEat' }
  },
  {
    align: 'center',
    title: '就餐时间',
    dataIndex: 'eatTime'
  }
]

export default {
  name: 'work-meals-statistics-list',
  components: {
    WorkMealView
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchParam:{
        isToday:1
      },
      sDate:[undefined,undefined],
      activeKey:0,
      depList:[],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      mealInfo:{}
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'attendance-chart-work-meals-statistics') {
          this.init()
        }
      },
      immediate: true
    }
  },
  mounted(){
    let that = this
    let ele = document.querySelector('#work-meals-statistics-list')
    that.bindEnterFn = (event) =>{
      if(event.type === 'keyup' && event.keyCode === 13){ //Enter
        that.searchAction()
      }
    }
    if(ele){
      ele.addEventListener('keyup',that.bindEnterFn)
    }
  },
  methods: {
    init() {
      let that = this
      let queue = []
      let task1 = departmentList().then(res => (that.depList = res.data))
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    initWorkLunchNum(){
      let that = this
      getWorkLunchNum(Object.assign({},this.searchParam)).then(res =>{
        //console.log(res)
        that.mealInfo = res.data
      })
    },
    simpleSearch(type){
      this.searchParam = Object.assign({},searchParam,{isToday:+type})
      this.searchAction()
    },
    doAction(type,record){
      if(type === 'view'){
        this.$refs.workMealView.query(type,record)
        return
      }
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      that.initWorkLunchNum()
      getWorkLunchCensus(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    rangePickerChange(arrMoment,arrStrs){
      if(Array.isArray(arrMoment)){
        if(arrMoment.length === 2){
          this.searchParam.beginTime = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.endTime = arrMoment[1].format('YYYY-MM-DD')
        }else{
          this.searchParam.beginTime = undefined
          this.searchParam.endTime = undefined
        }
      }
    }
  },
  beforeDestroy(){
    let that = this
    let ele = document.querySelector('#work-meals-statistics-list')
    ele && that.bindEnterFn && ele.removeEventListener('keyup',that.bindEnterFn) 
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
.currentDayWeekMonth{opacity: .7;}
</style>

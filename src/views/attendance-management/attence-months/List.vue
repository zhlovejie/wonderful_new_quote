<template>
  <!-- 考勤月历 -->
  <div class="wdf-custom-wrapper" id="attence-months">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-month-picker v-model="searchParam.statiticsMonthDate" :allowClear="false" style="width:220px;" placeholder="选择月份" />
        </a-form-item>
        <a-form-item>
          <a-select 
            placeholder="选择部门"
            v-model="searchParam.departmentId"
            :allowClear="true" 
            style="width:160px;"
          >
            <a-select-option
              v-for="item in depList"
              :key="item.id"
              :value="item.id"
            >{{item.departmentName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input placeholder="员工名模糊查询" v-model="searchParam.userName" allowClear style="width:160px;" />
        </a-form-item>
        
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="searchAction({current:1})"
          >查询</a-button>

          <a-button
            class="a-button"
            type="primary"
            icon="download"
            style="margin-left:10px;"
          >下载</a-button>
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
        :scroll="{ x: 5000 }"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div v-for="item in extColumns" :key="item.dataIndex" :slot="'title'+item.dataIndex" style="color:#096dd9;">
          <div>{{item._date}}</div>
          <div>{{item._week}}</div>
        </div>
        <div v-for="item in extColumns" :key="item.dataIndex" :slot="item.dataIndex" slot-scope="text, record, index">
          <a-popover  title="操作" trigger="hover">
            <div slot="content">
              <template v-if="!['正常','休息'].includes(text)">
                <a @click="doAction('edit',record,item.dataIndex)">修改</a>
                <a-divider type="vertical" />
              </template>
              <a @click="doAction('view',record,item.dataIndex)">记录</a>
            </div>
            <div style="cursor: pointer;" v-html="formatHTML(text)" />
          </a-popover>
        </div>
      </a-table>
    </div>

    <EditForm ref="editForm" @finish="searchAction()"/>
  </div>
</template>

<script>
import {departmentList} from '@/api/systemSetting'
import {monthStatiticsList } from '@/api/attendanceManagement'
import moment from 'moment'
import EditForm from './EditForm'
let uuid = () =>Math.random().toString(32).slice(-10)

export default {
  name: 'attence-months',
  components: {
    EditForm
  },
  data() {
    return {
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchParam:{
        statiticsMonthDate:moment()
      },
      sDate:[undefined,undefined],
      activeKey:0,
      depList:[],
      bindEnterFn:null,
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'attence-months') {
          this.init()
        }
      },
      immediate: true
    }
  },
  computed:{
    columns(){
      let baseColumns = [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
          fixed: 'left'
        },
        {
          align: 'center',
          title: '工号',
          dataIndex:'jobNum',
          fixed: 'left',
          width: '100px',
        },
        {
          align: 'center',
          title: '姓名',
          dataIndex:'userName',
          fixed: 'left',
          width: '120px',
        },
        {
          align: 'center',
          title: '部门',
          dataIndex:'departmentName',
          fixed: 'left',
          width: '120px',
        },
      ]
      let dataColumns = []
      if(this.searchParam.statiticsMonthDate instanceof moment){
        let columns = this.initDate(this.searchParam.statiticsMonthDate.clone())
        dataColumns = columns.map(col =>{
          return {
            align:'center',
            //title:col.title,
            dataIndex:col.dataIndex,
            slots: { title: 'title'+col.dataIndex },
            scopedSlots: { customRender: col.dataIndex },
            width:'150px',
            isExtTitle: true,
            _date:col._date,
            _week:col._week
          }
        })
      }

      return [...baseColumns,...dataColumns]
    },

    extColumns(){
      return this.columns.filter(col => col.isExtTitle).map(col => Object.assign({},col))
    }
  },
  mounted(){
    let that = this
    let ele = document.querySelector('#attence-months')
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
    moment,
    init() {
      let that = this
      that.searchParam.searchStatus = that.activeKey
      let queue = []
      let task1 = departmentList().then(res => (that.depList = res.data))
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      if(_searchParam.statiticsMonthDate instanceof moment){
        _searchParam.statiticsMonthDate = _searchParam.statiticsMonthDate.format('YYYY-MM')
      }
      console.log('执行搜索...', _searchParam)
      that.loading = true
      monthStatiticsList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1

            if(Array.isArray(item.dayStatiticsList)){
              item.dayStatiticsList.map(v => {
                item[moment(v.statiticsDate).format('YYYYMMDD')] = v.signResult
                //.split(new RegExp('\n','g')).join('<br/>')
              })
            }


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
    doAction(actionType, record,dataIndex) {
      let that = this
      if(actionType === 'view'){
        return
      }
      if(actionType === 'edit'){
        let dayStatiticsList = record.dayStatiticsList
        let target = dayStatiticsList.find(item => moment(item.statiticsDate).format('YYYYMMDD') === dataIndex)
        if(target){
          that.$refs.editForm.query(that.$_.cloneDeep(target || {}))
        }
        return
      }
    },
    initDate(m){ //初始化数据结构 和 列头
      let columns = []
      let daysInMonth = m.daysInMonth()
      m.startOf('months').add(-1,'days')
      let weekMap = ["", "一", "二", "三", "四", "五", "六","日"]
      for(let i=0,len = daysInMonth;i<len;i++){
        m.add(1,'days')
        let _date = m.date()
        let _week = weekMap[m.isoWeekday()]
        columns.push({
          dataIndex:m.format('YYYYMMDD'),
          title:`${_date}/周${_week}`,
          _date:_date,
          _week:`周${_week}`
        })
      }
      return columns
    },
    formatHTML(str){
      return str ? str.split(RegExp('\n','g')).join('<br/>') :''
    },
  },
  
  beforeDestroy(){
    let that = this
    let ele = document.querySelector('#attence-months')
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

</style>

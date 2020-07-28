<template>
  <!-- 考勤异常事件 -->
  <div class="wdf-custom-wrapper" id="attendance-abnormal-events">
    <div class="search-wrapper">
      <a-form layout="inline">
        
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
          <a-select
            placeholder="异常类型"
            v-model="searchParam.exceptionType"
            :allowClear="true"
            style="width:120px;"
          >
            <a-select-option :value="1">上午未打卡</a-select-option>
            <a-select-option :value="2">下午未打卡</a-select-option>
            <a-select-option :value="3">迟到</a-select-option>
            <a-select-option :value="4">早退</a-select-option>
            <a-select-option :value="5">加班</a-select-option>
            <a-select-option :value="6">人脸识别异常</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item>
          <a-select
            placeholder="处理状态"
            v-model="searchParam.status"
            :allowClear="true"
            style="width:120px;"
          >
            <a-select-option :value="0">待处理</a-select-option>
            <a-select-option :value="1">已处理</a-select-option>
          </a-select>
        </a-form-item> -->
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
        <div slot="exceptionType" slot-scope="text, record">
          {{ {1:'上午未打卡',2:'下午未打卡',3:'迟到',4:'早退',5:'加班',6:'人脸识别异常'}[text] || '未知' }}
        </div>
        <div slot="status" slot-scope="text">
          {{ {0:'待处理',1:'已处理'}[text] || '未知' }}
        </div>
        <div slot="faceUrl" slot-scope="text, record">
          <img v-if="record.faceUrl" :src="text" style="width:48px;height:auto;overflow:hidden;" alt="">
          <span v-else>无</span>
        </div>
        
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="+record.exceptionType === 6">
            <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del',record)">
              <a type="primary" href="javascript:;">删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm title="确认处理该条数据吗?" @confirm="() => doAction('chuli',record)">
              <a type="primary" href="javascript:;">处理</a>
            </a-popconfirm>
          </template>
        </div>
      </a-table>
    </div>
    <DoForm ref="doForm" @finish="searchAction({current:1})" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
} from '@/api/systemSetting'
import {
  signExceptionList,signExceptionDel
} from '@/api/attendanceManagement'

import DoForm from './DoForm'

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
    title: '员工名',
    dataIndex:'userName'
  },
  {
    align: 'center',
    title: '部门',
    dataIndex:'departmentName'
  },
  {
    align: 'center',
    title: '异常事件类型',
    dataIndex:'exceptionType',
    scopedSlots: { customRender: 'exceptionType' }
  },
  {
    align: 'center',
    title: '照片',
    dataIndex:'faceUrl',
    scopedSlots: { customRender: 'faceUrl' }
  },
  {
    align: 'center',
    title: '异常日期',
    dataIndex:'happenDate'
  },
  {
    align: 'center',
    title: '异常时长(h)',
    dataIndex:'exceptionHourInfo'
  },
  {
    align: 'center',
    title: '处理状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'attendance-abnormal-events',
  components: {
    DoForm
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchParam:{},
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
        if (to.name === 'attendance-abnormal-events') {
          this.init()
        }
      },
      immediate: true
    }
  },
  mounted(){
    let that = this
    let ele = document.querySelector('#attendance-abnormal-events')
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
      console.log(111)
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
      console.log('执行搜索...', _searchParam)
      that.loading = true
      signExceptionList(_searchParam)
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
    doAction(actionType, record) {
      let that = this
      if(actionType === 'del'){
        signExceptionDel(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
          return
      }else if(actionType === 'chuli'){
        that.$refs.doForm.query(actionType,record)
        //signExceptionUpdate
      }
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    rangePickerChange(arrMoment,arrStrs){
      if(Array.isArray(arrMoment)){
        if(arrMoment.length === 2){
          this.searchParam.attenceBeginDate = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.attenceEndDate = arrMoment[1].format('YYYY-MM-DD')
        }else{
          this.searchParam.attenceBeginDate = undefined
          this.searchParam.attenceEndDate = undefined
        }
      }
    }
  },
  beforeDestroy(){
    let that = this
    let ele = document.querySelector('#attendance-abnormal-events')
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

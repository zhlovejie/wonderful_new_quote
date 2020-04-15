<template>
  <!-- 事故调查报告 -->
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :footer="null" 
    :maskClosable="false"
  >
    <div class="accident-report-list-wrapper">
      <div class="search-wrapper">
        <a-select
          placeholder="选择部门"
          :allowClear="true"
          v-model="dep_id"
          @change="depChangeHandler"
          style="width: 150px;"
        >
          <a-select-option
            v-for="item in depSelectDataSource"
            :key="item.id"
            :value="item.id"
          >{{item.departmentName}}</a-select-option>
        </a-select>
        <a-select placeholder="选择责任人" :allowClear="true" v-model="person_id" style="width: 150px;">
          <a-select-option
            v-for="item in personSelectDataSource"
            :key="item.id"
            :value="item.id"
          >{{item.trueName}}</a-select-option>
        </a-select>

        <a-select placeholder="异常类型" :allowClear="true" v-model="accident_type" style="width: 120px;">
          <a-select-option
            v-for="item in accidentTypeSelectDataSource"
            :key="item.id"
            :value="item.id"
          >{{item.text}}</a-select-option>
        </a-select>

        <!-- <a-select
          placeholder="处理状态"
          :allowClear="true"
          v-model="operation_status"
          style="width: 120px"
        >
          <a-select-option :value="0">待审批</a-select-option>
          <a-select-option :value="1">审批通过</a-select-option>
          <a-select-option :value="2">审批不通过</a-select-option>
        </a-select> -->

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

          <div slot="status" slot-scope="text, record, index">
            <span>{{ getStatusText(text) }}</span>
          </div>
          <div slot="dutyPersonName" slot-scope="text, record, index">
            <a href="javascript:void(0);" @click="selectedAction(record)">{{text}}</a>
          </div>
          
        </a-table>
      </div>
    </div>
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import { personIncidentPageList } from '@/api/personnelManagement'

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
    title: '编号',
    dataIndex: 'reportNum',
    key: 'reportNum'
  },
  {
    align: 'center',
    title: '责任人',
    dataIndex: 'dutyPersonName',
    key: 'dutyPersonName',
    scopedSlots: { customRender: 'dutyPersonName' }
  },
  {
    align: 'center',
    title: '责任部门',
    dataIndex: 'dutyDepartmentName',
    key: 'dutyDepartmentName'
  },
  {
    align: 'center',
    title: '异常类型',
    dataIndex: 'exceptionName',
    key: 'exceptionName'
  },
  {
    align: 'center',
    title: '发生事故时间',
    key: 'reportTime',
    dataIndex: 'reportTime'
  }
]

export default {
  name: 'BecomingApplyList',
  components: {},
  data() {
    return {
      depSelectDataSource: [],
      personSelectDataSource: [],
      accidentTypeSelectDataSource: [],
      dep_id: undefined,
      person_id: undefined,
      accident_type: undefined,
      activeKey: 3,
      columns: columns,
      dataSource: [],
      pagination: {
        current:1
      },
      loading: false,
      modalTitle:'',
      visible:false,
      decoratorKey:''
    }
  },
  computed: {
    searchParam() {
      return {
        dutyDepartmentId: this.dep_id,
        dutyPersonId: this.person_id,
        exceptionId: this.accident_type
      }
    }
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
      //部门
      departmentList().then(res => (that.depSelectDataSource = res.data))
      //事故异常类型
      getDictionaryList({ parentId: 477 }).then(res => (that.accidentTypeSelectDataSource = res.data))
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign(
        {},
        { ...this.searchParam },
        { ...this.pagination },
        opt || {},
        { searchStatus: that.activeKey }
      )
      console.log('执行搜索...', _searchParam)
      that.loading = true
      personIncidentPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
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
      this.searchAction()
    },
    getStatusText(state) {
      let stateMap = {
        0: '待审批',
        1: '通过',
        2: '不通过'
      }
      return stateMap[state] || `未知状态:${state}`
    },
    depChangeHandler(depId) {
      getUserByDep({ departmentId: depId }).then(res => (this.personSelectDataSource = res.data))
    },
    handleCancel() {
      this.visible = false
    },
    handleOk(){
      this.handleCancel()
    },
    selectedAction(record){
      this.visible = false 
      this.$emit('selectedAction',{decoratorKey:this.decoratorKey,record:record})
    },
    query(decoratorKey){
      this.decoratorKey = decoratorKey
      this.init()
      this.$nextTick(() =>this.visible = true)
    },
  }
}
</script>
<style scoped>
.accident-report-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.accident-report-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
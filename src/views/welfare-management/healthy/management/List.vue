<template>
  <!-- 体检管理 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-month-picker
        style="width:150px;"
        :allowClear="true"
        placeholder="请选择月份"
        v-model="createdMonth"
      />
      <a-select
        placeholder="选择部门"
        @change="depChangeHandler"
        v-model="depId"
        :allowClear="true"
        style="width: 150px"
      >
        <a-select-option
          v-for="item in depSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.departmentName}}</a-select-option>
      </a-select>

      <a-input style="width:150px;" placeholder="人员模糊查询" v-model="userName" :allowClear="true"/>

      <!-- <a-select
        style="width:150px;"
        placeholder="选择人员"
        v-model="userName"
        :allowClear="true"
        show-search
        :filter-option="filterOption"
      >
        <a-select-option v-for="item in userList" :key="item.id" :value="item.id">{{item.trueName}}</a-select-option>
      </a-select> -->

      <a-select style="width:150px;" placeholder="体检类别" v-model="checkupType" :allowClear="true">
        <a-select-option :value="1">工龄体检</a-select-option>
        <a-select-option :value="2">特殊岗位体检</a-select-option>
        <a-select-option :value="3">管理层休检</a-select-option>
        <a-select-option :value="4">入职体检</a-select-option>
      </a-select>

      <a-select
        style="width:150px;"
        placeholder="体检结果"
        v-model="checkupResult"
        :allowClear="true"
      >
        <a-select-option :value="0">无</a-select-option>
        <a-select-option :value="1">合格</a-select-option>
        <a-select-option :value="2">不合格</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <!-- <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button> -->
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
        <div slot="checkupType" slot-scope="text, record, index">
          {{ {1:'工龄体检',2:'特殊岗位体检',3:'管理层休检',4:'入职体检'}[text] || '未知' }}
        </div>
        <div slot="checkupResult" slot-scope="text, record, index">
          {{ {0:'无',1:'合格',2:'不合格'}[text] || '未知' }}
        </div>
        <div slot="checkupReport" slot-scope="text, record, index">
          <a v-if="text" target="_blank" :href="text">查看</a>
          <span v-else>无</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('upload',record)">上传</a>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep,
} from '@/api/systemSetting'
import { checkupManagementList, checkupManagementUploadReport } from '@/api/welfareManagement'
import AddForm from './AddForm'
import moment from 'moment'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '日期',
    dataIndex: 'createdMonth',
  },
  {
    align: 'center',
    title: '体检类别',
    dataIndex: 'checkupType',
    scopedSlots: { customRender: 'checkupType' },
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
    title: '姓名',
    dataIndex: 'userName'
  },
  {
    align: 'center',
    title: '体检结果',
    dataIndex: 'checkupResult',
    scopedSlots: { customRender: 'checkupResult' },
  },
  {
    align: 'center',
    title: '体检报告',
    dataIndex: 'checkupReport',
    scopedSlots: { customRender: 'checkupReport' },
  },
  {
    align: 'center',
    title: '体检上传日期',
    dataIndex: 'reportTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'welfare-management-healthy-management',
  components: {
    AddForm: AddForm,
  },
  data() {
    return {
      createdMonth: undefined,
      depId: undefined,
      userName: undefined,
      checkupType: undefined,
      checkupResult: undefined,

      columns: columns,
      dataSource: [],
      userList: [],
      depSelectDataSource: [],
      postSelectDataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
    }
  },
  computed: {
    searchParam() {
      return {
        createdMonth: this.createdMonth instanceof moment ? this.createdMonth.format('YYYY-MM') : undefined,
        depId: this.depId,
        userName: this.userName,
        checkupType: this.checkupType,
        checkupResult: this.checkupResult,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'welfare-management-healthy-management') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {
      let that = this
      departmentList().then((res) => {
        that.depSelectDataSource = res.data
      })
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      checkupManagementList(_searchParam)
        .then((res) => {
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
        .catch((err) => (that.loading = false))
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
      if (actionType === 'upload') {
        this.$refs.addForm.query(actionType, record)
      } else {
        this.$message.info('功能尚未实现！')
      }
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      getUserByDep({ departmentId: dep_id }).then((res) => (that.userList = res.data))
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
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
.main-wrapper {
  margin-top: 20px;
}
</style>

<template>
  <!-- 工资参照表 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-select placeholder="选择部门" v-model="depId" :allowClear="true" style="width: 250px">
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">
          {{ item.departmentName }}
        </a-select-option>
      </a-select>
      <!-- <a-select placeholder="假期类型" v-model="hoursType" :allowClear="true" style="width: 250px">
        <a-select-option :value="1">调休</a-select-option>
        <a-select-option :value="2">年假</a-select-option>
      </a-select> -->
      <a-input style="width: 250px" v-model="userName" placeholder="姓名模糊查询" :allowClear="true" />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
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
          <template>
            <a type="primary" @click="doAction('change', record)">变更</a>
          </template>
          <template>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit', record)">变更记录</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
    <RuleForm ref="ruleForm" @finish="searchAction" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'

import { annualLeaveList } from '@/api/personnelManagement'
// import { oaSalaryInfoStationStandardPageList, oaSalaryInfoStationStandardDel } from '@/api/salaryManagement'
import AddForm from './AddForm'
import RuleForm from './RuleForm'
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
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '可用调休（H）',
    dataIndex: 'restHours',
  },
  {
    align: 'center',
    title: '剩余年假（H）',
    dataIndex: 'yearHours',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'salary-reference-record',
  components: {
    AddForm,
    RuleForm,
  },
  data() {
    return {
      depId: undefined,
      hoursType: undefined,
      userName: undefined,
      meetingTypesList: [],
      depList: [],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
        size: '10',
        showSizeChanger: true,
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading: false,
      bindEnterFn: null,
    }
  },
  computed: {
    searchParam() {
      return {
        depId: this.depId,
        // hoursType: this.hoursType,
        userName: this.userName,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'personnel-annualLeave') {
          this.init()
        }
      },
      immediate: true,
    },
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
  methods: {
    init() {
      let that = this
      //getDictionaryList({parentId:498}).then(res => that.meetingTypesList = res.data)
      departmentList().then((res) => (that.depList = res.data))
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.size || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      annualLeaveList(_searchParam)
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

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.searchAction()
          }
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
    onShowSizeChangeHandler(current, pageSize) {
      let pagination = { ...this.pagination }
      pagination.current = current
      pagination.size = String(pageSize)
      this.pagination = pagination
      this.searchAction()
    },
    doAction(actionType, record) {
      if (actionType === 'change') {
        this.$refs.ruleForm.query(actionType, record)
      } else {
        this.$refs.addForm.query(actionType, record)
      }
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

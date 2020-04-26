<template>
  <!-- 工作周报设置 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
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

      <a-select placeholder="选择岗位" v-model="stationId" :allowClear="true" style="width: 180px">
        <a-select-option
          v-for="item in postSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.stationName}}</a-select-option>
      </a-select>
      <a-input placeholder="姓名模糊查询" v-model="userName" allowClear style="width:160px;" />
      <a-range-picker v-model="sDate" style="width:240px;" :allowClear="true" />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="我提交的" key="1" />
        <a-tab-pane tab="我的团队" key="2" />
      </a-tabs>
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
        <div slot="rebackFlag" slot-scope="text, record, index">
          <span>{{ record.rebackFlag === 0 ? '已提交' : '已撤回' }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>

          <template v-if="record.rebackFlag === 0">
            <a-divider type="vertical" />
            <a-popconfirm title="确定要撤回该周报吗？" @confirm="doAction('back',record)">
              <a>撤回</a>
            </a-popconfirm>
          </template>

          <template v-else>
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit',record)">修改</a>
          </template>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="doAction('del',record)">
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
  departmentList, //所有部门
  getStationList //获取部门下面的岗位
} from '@/api/systemSetting'
import { workReportSetWeekPage, workReportSetWeekDelete, workReportSetWeekRevocation } from '@/api/workReportManagement'
import AddForm from './module/AddForm'
import moment from 'moment'
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
    dataIndex: 'reportNum'
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName'
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName',
    key: 'stationName'
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'rebackFlag',
    key: 'rebackFlag',
    scopedSlots: { customRender: 'rebackFlag' }
  },
  {
    align: 'center',
    title: '提交人',
    key: 'createuserName',
    dataIndex: 'createuserName'
  },
  {
    align: 'center',
    title: '提交时间',
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
  name: 'reportWeekSet',
  components: {
    AddForm: AddForm
  },
  data() {
    return {
      activeKey: 1,
      depId: undefined,
      stationId: undefined,
      userName: undefined,
      sDate: [undefined, undefined],
      columns: columns,
      dataSource: [],
      depSelectDataSource: [],
      postSelectDataSource: [],
      pagination: {
        current: 1
      },
      loading: false
    }
  },
  computed: {
    searchParam() {
      let beginDate = undefined,
        endDate = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        beginDate = this.sDate[0] instanceof this.moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endDate = this.sDate[1] instanceof this.moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      return {
        listType: this.activeKey,
        userName: this.userName,
        beginDate: beginDate,
        endDate: endDate,
        departmentId: this.depId,
        stationId: this.stationId
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'wrm-report-week-set') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    init() {
      let that = this
      departmentList().then(res => {
        that.depSelectDataSource = res.data
      })
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      workReportSetWeekPage(_searchParam)
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
      if (actionType === 'view' || actionType === 'add') {
        this.$refs.addForm.query(actionType, record)
      } else if (actionType === 'del') {
        console.log(record)
        workReportSetWeekDelete({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'back') {
        workReportSetWeekRevocation({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            if (res.code === 200) {
              that.searchAction()
            }
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'edit') {
        that.$refs.addForm.query(actionType, record)
      } else {
        this.$message.info('功能尚未实现！')
      }
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      return getStationList({ id: dep_id }).then(res => {
        that.postSelectDataSource = res.data
      })
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchAction()
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
.main-wrapper {
  margin-top: 20px;
}
</style>

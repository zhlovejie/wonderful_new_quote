<template>
  <!-- 工作日报设置 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="申诉人模糊查询" v-model="userName" allowClear style="width:160px;" />
      <a-select
        placeholder="选择部门"
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

      <a-select placeholder="选择审批状态" v-model="state" :allowClear="true" style="width: 180px">
        <a-select-option value="1">待审批</a-select-option>
        <a-select-option value="2">通过</a-select-option>
        <a-select-option value="3">不通过</a-select-option>
      </a-select>
      <a-range-picker v-model="sDate" style="width:240px;" :allowClear="true" />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <a-tab-pane tab="待审批" key="1" />
        <a-tab-pane tab="已审批" key="2" />
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
        <div slot="reason" slot-scope="text, record, index">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{text}}</template>
            {{ String(text).slice(0,10) }}...
          </a-tooltip>
          <span v-else>{{text}}</span>
        </div>
        <div slot="fileUrl" slot-scope="text, record, index">
          <a v-if="text" :href="text" target="_blank" rel="noopener noreferrer">查看</a>
          <span v-else>无</span>
        </div>
        <div slot="state" slot-scope="text, record, index">
          {{getStateTxt(text)}}
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('approval',record)">审批</a>
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
import {
  customerAppealList,
  customerAppealDetail,
  customerAppealDelete,
  customerAppealApproval,
  customerAppealAdd
} from '@/api/customerReleaseRule'
import AddForm from './AddForm'
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
    title: '申诉人',
    dataIndex: 'createName'
  },
  {
    align: 'center',
    title: '申诉部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'customerName'
  },
  {
    align: 'center',
    title: '原因',
    dataIndex: 'reason',
    scopedSlots: { customRender: 'reason' }
  },
  {
    align: 'center',
    title: '附件',
    dataIndex: 'fileUrl',
    scopedSlots: { customRender: 'fileUrl' }
  },
  {
    align: 'center',
    title: '审批状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    align: 'center',
    title: '提交时间',
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
  name: 'customerAppeal',
  components: {
    AddForm: AddForm
  },
  data() {
    return {
      activeKey: 0,
      depId: undefined,
      state: undefined,
      userName: undefined,
      sDate: [undefined, undefined],
      columns: columns,
      dataSource: [],
      depSelectDataSource: [],
      postSelectDataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
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
        searchStatus: this.activeKey,
        createName: this.userName,
        startTime: beginDate,
        endTime: endDate,
        departmentId: this.depId,
        state:this.state
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'customerAppeal') {
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
      customerAppealList(_searchParam)
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
      this.searchAction()
    },
    doAction(actionType, record) {
      let that = this
      if (actionType === 'del') {
        customerAppealDelete(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      } 
      this.$refs.addForm.query(actionType, record)
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if(this.activeKey === 1){
        this.depId = undefined
        this.stationId = undefined
        this.userName = undefined
      }
      this.searchAction()
    },
    getStateTxt(state){
      return {1:'待审批',2:'通过',3:'不通过'}[state] || '未知'
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

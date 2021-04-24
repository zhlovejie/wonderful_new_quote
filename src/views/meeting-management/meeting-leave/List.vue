<template>
  <!-- 会议请假记录 -->
  <div class="meeting-records-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select placeholder="选择会议部门" v-model="depId" :allowClear="true" style="width: 160px">
            <a-select-option
              v-for="item in depList"
              :key="item.id"
              :value="item.id"
            >{{item.departmentName}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-input placeholder="会议名称模糊查询" v-model="meetingName" allowClear style="width:180px;" />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="申请人模糊查询" v-model="userName" allowClear style="width:180px;" />
        </a-form-item>
        <a-form-item>
          <a-select
            placeholder="状态"
            v-model="status"
            :allowClear="true"
            style="width: 150px"
          >
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
            <a-select-option :value="4">已撤回</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-range-picker v-model="sDate" style="width:260px;" :allowClear="true" />
        </a-form-item>

        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="searchAction({current:1})"
          >查询</a-button>
        </a-form-item>
        <!-- <div class="action-wrapper" style="float:right;">
          <a-form-item>
          <a-button type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
          </a-form-item>
        </div> -->
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="activeKey" :defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" :key="0" />
        <!-- <template v-if="$auth('cutCostRecord:approval')"> -->
          <a-tab-pane tab="待审批" :key="1" />
          <a-tab-pane tab="已审批" :key="2" />
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
        <div slot="statusTxt" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{text}}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">

          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view',record)">查看</a>
            <template v-if="+record.status === 3 || +record.status === 4">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit',record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="doAction('del',record)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>

            <template v-if="+record.status === 1">
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定撤回" ok-text="确定" cancel-text="取消" @confirm="doAction('reback',record)">
                <a type="primary">撤回</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 1">
            <a type="primary" @click="doAction('approval',record)">审批</a>
          </template>
          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view',record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm key="k1" ref="addForm" @finish="searchAction" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>

<script>
import {
  departmentList, //所有部门
} from '@/api/systemSetting'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import {
  delMeetingLeave,
  getMeetingLeavePageList,
  revocationMeetingLeave
} from '@/api/meetingManagement'
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
    title: '会议编号',
    dataIndex: 'meetingNum'
  },
  {
    align: 'center',
    title: '会议类别',
    dataIndex: 'typeDicName'
  },
  {
    align: 'center',
    title: '会议部门',
    dataIndex: 'departmentName'
  },
  {
    align: 'center',
    title: '会议名称',
    dataIndex: 'name'
  },
  {
    align: 'center',
    title: '请假事由',
    dataIndex: 'leaveReason'
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'statusTxt',
    scopedSlots: { customRender: 'statusTxt' }
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
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
  name: 'meeting-leave-record',
  components: {
    AddForm,
    ApproveInfo
  },
  data() {
    return {
      depId: undefined,
      meetingName: undefined,
      userName:undefined,
      status: undefined,
      sDate: [undefined, undefined],
      activeKey:0,
      depList: [],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
    }
  },
  computed: {
    searchParam() {
      let startTime = undefined,
        endTime = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        startTime = this.sDate[0] instanceof moment ? this.sDate[0].format('YYYY-MM-DD') : undefined
        endTime = this.sDate[1] instanceof moment ? this.sDate[1].format('YYYY-MM-DD') : undefined
      }
      return {
        depId: this.depId,
        meetingName: this.meetingName,
        userName: this.userName,
        status: this.status,
        beginTime: startTime,
        endTime: endTime,
        searchStatus:this.activeKey
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'meeting-leave-record') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    init() {
      const that = this
      departmentList().then(res => (that.depList = res.data))
      that.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, opt,paginationParam)
      that.loading = true
      getMeetingLeavePageList(_searchParam)
        .then(res => {
          that.loading = false
          const _m = {1:'待审批',2:'通过',3:'不通过',4:'已撤回',}
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.statusTxt = _m[item.status]
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
            that.search()
          }
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    doAction(actionType, record) {
      let that = this
      if (['view','add','edit','approval'].includes(actionType)) {
        this.$refs.addForm.query(actionType, record)
      } else if (actionType === 'del') {
        delMeetingLeave({id:record.id}).then(res => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }else if (actionType === 'reback') {
        revocationMeetingLeave({id:record.id}).then(res => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
      else {
        that.$message.info(`未知指令：${actionType}`)
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchAction({ current: 1})
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
  }
}
</script>

<style scoped>
.meeting-records-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>

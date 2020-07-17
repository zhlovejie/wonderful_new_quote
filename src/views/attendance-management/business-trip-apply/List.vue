<template>
  <!-- 出差申请 -->
  <div class="wdf-custom-wrapper" id="attendance-over-time-apply">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            placeholder="员工名模糊查询"
            v-model="searchParam.userName"
            allowClear
            style="width:200px;"
          />
        </a-form-item>
        <a-form-item>
          <a-select
            placeholder="选择审批状态"
            v-model="searchParam.status"
            :allowClear="true"
            style="width:200px;"
          >
            <a-select-option :value="0">待提交</a-select-option>
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
            <a-select-option :value="4">已撤回</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item hidden>
          <a-select
            placeholder="交通工具"
            v-model="searchParam.vehicleId"
            :allowClear="true"
            style="width:200px;"
          >
            <a-select-option
              v-for="item in vehicleList"
              :key="item.id"
              :value="item.id"
            >{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-range-picker
            v-model="sDate"
            @change="rangePickerChange"
            style="width:220px;"
            :allowClear="true"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            class="a-button"
            type="primary"
            icon="search"
            @click="searchAction({current:1})"
          >查询</a-button>
        </a-form-item>
        <div class="action-wrapper" style="float:right;" v-if="$auth('attenceTravelApply:add')">
          <a-form-item>
            <a-button type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('attenceTravelApply:approval')">
          <a-tab-pane tab="待审批" key="1" />
          <a-tab-pane tab="已审批" key="2" />
        </template>
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
        <div slot="editContent" slot-scope="text, record">
          <a href="javascript:void(0);" @click="doAction('editView',record)">查看</a>
        </div>
        <div slot="status" slot-scope="text, record">
          <a
            href="javascript:void(0);"
            @click="approvalPreview(record)"
          >{{ {0:'待提交',1:'待审批',2:'通过',3:'不通过',4:'已作废'}[text] || '未知' }}</a>
        </div>
        <div slot="financeStatus" slot-scope="text, record">
          <a
            href="javascript:void(0);"
            @click="financeStatusPreview(record)"
          >{{ {0:'未完结',1:'已完结'}[text] || '未知' }}</a>
        </div>

        <div slot="travelType" slot-scope="text">{{ {1:'出差',2:'公事外出'}[text] || '未知' }}</div>
        <div
          slot="travelUsers"
          slot-scope="text, record"
        >{{ Array.isArray(record.users) ? record.users.map(item =>item.userName).join(',') : '-'}}</div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          
          <template v-if="+activeKey === 1">
            <a type="primary" @click="doAction('approval',record)">审批</a>
          </template>

          <template v-if="+activeKey === 2">
            <a type="primary" @click="doAction('view',record)">查看</a>
          </template>

          <template v-if="+activeKey === 0">
            <a type="primary" @click="doAction('view',record)">查看</a>
            <template v-if="+record.status === 0 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit',record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确认提交该条数据吗?" @confirm="() => doAction('submit',record)">
                <a type="primary" href="javascript:;">提交</a>
              </a-popconfirm>
            </template>

            <template v-if="+record.status === 1 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw',record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>

            <template v-if="+record.financeStatus === 1 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del',record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template>

            <!--查看 修改:只添加行程 -->
            <template v-if="+record.status === 2 && !record.endTime">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('routeAdd',record)">添加行程</a>
            </template>

          </template>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="searchAction({current:1})" />
    <AddRoute ref="addRoute" />
    
    <FinanceForm ref="financeForm" @finish="searchAction({current:1})" />
  </div>
</template>

<script>
import {
  departmentList //所有部门
} from '@/api/systemSetting'
import {
  attenceTravelApplyDel,
  attenceTravelApplyList,
  attenceTravelApplyWithdraw,
  attenceTravelUserCheckUserTravel,
  attenceTravelApplySubmit
} from '@/api/attendanceManagement'
import AddForm from './AddForm'
import FinanceForm from './FinanceForm'
import AddRoute from './AddRoute'

import moment from 'moment'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import { getDictionaryList } from '@/api/workBox'

export default {
  name: 'business-trip-apply-list',
  components: {
    AddForm,
    ApproveInfo,
    FinanceForm,
    AddRoute
  },
  data() {
    return {
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchParam: {},
      sDate: [undefined, undefined],
      activeKey: 0,
      depList: [],
      vehicleList: [],
      bindEnterFn: null,
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  computed:{
    isFinance(){
      return this.userInfo.departmentName && this.userInfo.departmentName.includes('财务')
    },
    columns(){
      let columns = [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          align: 'center',
          title: '出差人员',
          scopedSlots: { customRender: 'travelUsers' }
        },
        {
          align: 'center',
          title: '出差类型',
          dataIndex: 'travelType',
          scopedSlots: { customRender: 'travelType' }
        },
        {
          align: 'center',
          title: '开始时间',
          dataIndex: 'startTime'
        },
        {
          align: 'center',
          title: '完结时间',
          dataIndex: 'endTime'
        },
        {
          align: 'center',
          title: '出发城市',
          dataIndex: 'beginAreaName'
        },
        {
          align: 'center',
          title: '审批状态',
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

      let financeColumn = {
        align: 'center',
        title: '财务状态',
        dataIndex: 'financeStatus',
        scopedSlots: { customRender: 'financeStatus' }
      }

      if(this.isFinance){ //财务人员 显示财务状态列
        columns.splice(columns.length - 1 ,0,financeColumn)
      }
      return columns
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'attendance-business-trip-apply') {
          this.init()
        }
      },
      immediate: true
    }
  },
  mounted() {
    let that = this
    let ele = document.querySelector('#attendance-over-time-apply')
    that.bindEnterFn = event => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
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
      let task2 = getDictionaryList({ parentId: 509 }).then(res => (that.vehicleList = res.data))
      queue.push(task2)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      attenceTravelApplyList(_searchParam)
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
      if (['view', 'add', 'edit', 'approval'].includes(actionType)) {
        if (actionType === 'add') {
          attenceTravelUserCheckUserTravel({ userId: that.userInfo.id }).then(res => {
            if (res.data) {
              that.$message.info('您还有未完结的出差申请，完结后方可继续申请流程')
              return
            }
            that.$warning({
              title: '风险告知',
              content: (
                <div class="__notice-wrapper">
                  <p>1.交通工具乘坐标准</p>
                  <p>火车(硬座、硬卧、软座)／动车、高铁二等座／轮船三等舱／长途汽车；</p>
                  <p>2.出差生活补贴(元／天)</p>
                  <p>一类地区270元　二类地区240元</p>
                  <p>一类地区(北京、上海、广东、深圳)</p>
                  <p>二类地区(除一类地区以外的城市)</p>
                  <p>3.市内交通(元／天)</p>
                  <p>凭票实报实销，当天上限为100元</p>
                  <p>4.工作时间</p>
                  <p>出差出发时间为10:30前无需打卡，否则至公司正常打上班卡．</p>
                  <p>出差返回时间为15:00前无需打卡，否则至公司正常打下班卡．</p>
                  <p>
                    注：请谨慎选择交通工具，超过标准不允报销；出差人员应在回公司７个工作日内办理报销事宜，否则影响下次提交申请．
                  </p>
                </div>
              ),
              width: 450,
              onOk: () => {
                console.log('11')
                that.$refs.addForm.query(actionType, record || {})
              }
            })
          })
          return
        }
        that.$refs.addForm.query(actionType, record || {})
      } else if (actionType === 'del') {
        attenceTravelApplyDel(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'withdraw') {
        attenceTravelApplyWithdraw(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else if (actionType === 'submit') {
        attenceTravelApplySubmit(`id=${record.id}`)
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      }else if(actionType === 'routeAdd'){ //添加行程
        that.$refs.addRoute.query(actionType,record)
      }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam.searchStatus = this.activeKey
      this.searchAction({ current: 1 })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    rangePickerChange(arrMoment, arrStrs) {
      if (Array.isArray(arrMoment)) {
        if (arrMoment.length === 2) {
          this.searchParam.startTime = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.endTime = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.searchParam.startTime = undefined
          this.searchParam.endTime = undefined
        }
      }
    },
    financeStatusPreview(record) {
      let _record = this.$_.cloneDeep(record || {})
      //for-test
      // _record.financeStatus = 1
      // _record.users = _record.users.map(u =>{
      //   u.financeStatus = 1
      //   return u
      // })
      this.$refs.financeForm.query(_record)
    },
    areaCascadeChange() {
      console.log(arguments)
    }
  },
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('#attendance-over-time-apply')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
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

.__notice-wrapper >>> p {
  margin-bottom: 0.5em;
}
</style>

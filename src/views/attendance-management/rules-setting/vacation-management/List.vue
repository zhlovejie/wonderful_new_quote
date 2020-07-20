<template>
  <!-- 节假日管理设置 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            placeholder="节假日组名称模糊查询"
            v-model="searchParam.festivalName"
            allowClear
            style="width:200px;"
          />
        </a-form-item>

        <a-form-item>
          <a-select
            placeholder="审批状态"
            v-model="searchParam.status"
            :allowClear="true"
            style="width:120px;"
          >
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
            <a-select-option :value="4">已撤回</a-select-option>
            <!-- <a-select-option :value="5">行程完结</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item label="时间">
          <a-range-picker
            v-model="sDate"
            @change="sDateChange"
            style="width:260px;"
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
        <div class="action-wrapper" style="float:right;">
          <a-form-item>
            <a-button type="primary" icon="plus" @click="doAction('add',null)">新增</a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('attendance-rules-setting-vacation-management:approval')">
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
        <div slot="status" slot-scope="text, record, index">
          <a
            href="javascript:void(0);"
            @click="approvalPreview(record)"
          >{{ {1:'待审批',2:'通过',3:'不通过',4:'已撤回',5:'行程完结'}[text] || '未知' }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- {1:'待审批',2:'通过',3:'不通过',4:'已撤回',5:'行程完结'} -->
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view',record)">查看</a>
            <template
              v-if="$auth('attendance-rules-setting-vacation-management:edit') && (record.status === 3 || record.status === 4)"
            >
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit',record)">修改</a>
            </template>
            <template v-if="record.status === 2">
              <template v-if="$auth('attendance-rules-setting-vacation-management:publish') && +record.isPublish !== 1">
                <a-divider type="vertical" />
                <a-popconfirm title="确认发布该条数据吗?" @confirm="() => doAction('publish',record)">
                  <a type="primary" href="javascript:;">发布</a>
                </a-popconfirm>
              </template>
              <template v-if="$auth('attendance-rules-setting-vacation-management:del')">
                <a-divider type="vertical" />
                <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del',record)">
                  <a type="primary" href="javascript:;">删除</a>
                </a-popconfirm>
              </template>
            </template>
            <template
              v-if="$auth('attendance-rules-setting-vacation-management:revocation') && record.status === 1 && +record.isReback !== 1 && +record.createdId === +userInfo.id"
            >
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('revocation',record)">
                <a type="primary" href="javascript:;">撤回</a>
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
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="searchAction({current:1})" />
  </div>
</template>

<script>
import {
  festivalRuleDel,
  festivalRuleList,
  festivalRulePublish,
  festivalRuleWithdraw
} from '@/api/attendanceManagement'
import AddForm from './AddForm'
import moment from 'moment'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
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
    title: '节假日名称',
    dataIndex: 'festivalName'
  },
  {
    align: 'center',
    title: '开始时间',
    dataIndex: 'beginDate'
  },
  {
    align: 'center',
    title: '结束时间',
    dataIndex: 'endDate'
  },
  {
    align: 'center',
    title: '总计(天)',
    dataIndex: 'days'
  },
  {
    align: 'center',
    title: '调休日期',
    dataIndex: 'changeRestDate'
  },
  {
    align: 'center',
    title: '审批状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
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
  name: 'vacation-management-list',
  components: {
    AddForm,
    ApproveInfo
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false,
      searchParam: {},
      activeKey: 0,
      sDate: [undefined, undefined],
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'attendance-rules-setting-vacation-management') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    init() {
      this.searchParam.searchStatus = this.activeKey
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      festivalRuleList(_searchParam)
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
      if (['add','view', 'edit', 'approval'].includes(actionType)) {
        that.$refs.addForm.query(actionType, record)
        return
      }
      if (actionType === 'del') {
        festivalRuleDel({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      }
      if (actionType === 'publish') {
        //发布
        festivalRulePublish({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      }
      if (actionType === 'revocation') {
        //撤回
        festivalRuleWithdraw({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
        return
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
    sDateChange(arrMoment, arrStrs) {
      this.searchParam = Object.assign({}, this.searchParam, {
        beginDate: arrStrs[0] || undefined,
        endDate: arrStrs[1] || undefined
      })
    }
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

<template>
  <!-- 降本考核 -->
  <div class="cut-cost-list-wrapper">
    <div class="search-wrapper">
      <a-range-picker v-model="sDate" style="width:260px;" :allowClear="true" />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('cutCostRuleRecord:approval')">
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
        <div slot="approveState" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div slot="totalBonus" slot-scope="text, record, index">{{text | moneyFormatNumber}}</div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <!--
            全部界面：
            待处理: 处理,查看
            待审批：撤回，查看
            审批通过：删除，查看
            审批不通过：修改，查看
            已撤回：修改，查看
            待审批界面：审批
            已审批界面：查看
          -->
          <template v-if="activeKey === 0">
            <a type="primary" @click="doAction('view',record)">查看</a>

            <template v-if="+record.approveState === 0 && isSelf(record.createdId)">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('use',record)">处理</a>
            </template>
            <template
              v-if="+record.approveState === 1 && isSelf(record.createdId) && +record.withdrawState === 0"
            >
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('back',record)">撤回</a>
            </template>
            <template v-if="+record.approveState === 2 && isSelf(record.createdId)">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('del',record)">删除</a>
            </template>
            <template
              v-if="(+record.approveState === 3 || +record.withdrawState === 1) && isSelf(record.createdId)"
            >
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit',record)">修改</a>
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
    <DisposeRuleForm ref="disposeRuleForm" @finish="searchAction" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import { depreciateRecordPage, depreciateRecordDelete, depreciateRecordRevocation } from '@/api/production/cutCost'
import DisposeRuleForm from './module/DisposeRuleForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
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
    title: '日期',
    dataIndex: 'recordDate'
  },
  {
    align: 'center',
    title: '降本激励总金额',
    dataIndex: 'totalBonus',
    scopedSlots: { customRender: 'totalBonus' }
  },
  {
    align: 'center',
    title: '审批状态',
    dataIndex: 'approveState',
    scopedSlots: { customRender: 'approveState' }
  },
  {
    align: 'center',
    title: '考核人',
    dataIndex: 'examineUserName'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'cutCostRuleRecord',
  components: {
    DisposeRuleForm: DisposeRuleForm,
    ApproveInfo: ApproveInfo
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      activeKey: 0,
      sDate: [
        moment()
          .startOf('months')
          .add({ months: -1 }),
        moment().startOf('months')
      ],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false
    }
  },
  computed: {
    searchParam() {
      let startDate = undefined,
        endDate = undefined
      if (Array.isArray(this.sDate) && this.sDate.length === 2) {
        startDate = this.sDate[0].format('YYYY-MM-DD')
        endDate = this.sDate[1].format('YYYY-MM-DD')
      }
      return {
        startDate: startDate,
        endDate: endDate,
        searchStatus: this.activeKey
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'cutCostRuleRecord') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {}, {
        searchStatus: that.activeKey
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      depreciateRecordPage(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            if (item.recordDate) {
              item.recordDate = moment(item.recordDate).format('YYYY-MM-DD')
            }
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
    doAction(type, record) {
      let that = this
      console.log(type)
      if (['add', 'view', 'edit', 'approval'].includes(type)) {
        this.$refs.disposeRuleForm.query(type, Object.assign({}, record, { __type: 2 }))
        return
      }
      if (type === 'use') {
        this.$refs.disposeRuleForm.query(type, Object.assign({}, record, { __type: 1 }))
        return
      }
      if (type === 'back') {
        this.$confirm({
          title: '警告',
          content: `确定要撤回该条记录吗?`,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            console.log('OK')
            depreciateRecordRevocation(`id=${record.id}`).then(res => {
              that.$message.info(res.msg)
              if (res.code !== 200) {
                return
              }
              that.searchAction()
            })
          },
          onCancel() {
            console.log('Cancel')
          }
        })
        return
      }
      if (type === 'del') {
        this.$confirm({
          title: '警告',
          content: `确定要删除该条记录吗?`,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            console.log('OK')
            depreciateRecordDelete(`id=${record.id}`).then(res => {
              that.$message.info(res.msg)
              if (res.code !== 200) {
                return
              }
              that.searchAction()
            })
          },
          onCancel() {
            console.log('Cancel')
          }
        })
        return
      }
    },
    getStateText(state) {
      let stateMap = {
        0: '待处理',
        1: '待审批',
        2: '通过',
        3: '不通过'
      }
      return stateMap[state] || `未知状态:${state}`
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    isSelf(createdId) {
      return +createdId === +this.userInfo.id
    }
  }
}
</script>
<style scoped>
.cut-cost-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.cut-cost-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
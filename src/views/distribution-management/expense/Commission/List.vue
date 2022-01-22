<template>
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <template v-if="dataSource.length === 0 && activeKey === 0">
        <a-dropdown style="float: right">
          <a-button type="primary" @click="doAction('add', null)"> <a-icon type="plus" />新增 </a-button>
        </a-dropdown>
      </template>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" key="0" />
        <template v-if="$auth('other:list')">
          <a-tab-pane tab="待我审批" key="1" />
          <a-tab-pane tab="我已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        v-if="$auth('other:lists')"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 公告审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <template>
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
            <template v-if="record.status === 1">
              <a-divider type="vertical" />
              <template>
                <a-popconfirm title="是否确定撤回" ok-text="确定" cancel-text="取消" @confirm="confirmWithdraw(record)">
                  <a type="primary">撤回</a>
                </a-popconfirm>
              </template>
            </template>
            <template v-if="record.status === 3 || record.status === 4">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit-salary', record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(record)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 1 && record.status === 1">
            <a type="primary" @click="doAction('edit', record)">审核</a>
          </template>

          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import { getFeeRuleList, getFeeRevocation, getFeedelFeeRule } from '@/api/distribution-management'
import AddForm from './module/Formadd'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
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
    title: '规则名称',
    dataIndex: 'ruleName',
    key: 'ruleName',
  },
  {
    align: 'center',
    title: '提成比例（%）',
    dataIndex: 'proportion',
    key: 'proportion',
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
  },

  {
    align: 'center',
    title: '审核状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'NoticeList',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
  },
  data() {
    return {
      visible: false,
      depList: [],
      queryParam: { current: 1 },
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      status: '',
      depId: '',
      activeKey: 0,
      rule_List: [],
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
      whole: true,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'distribution_management_Commission') {
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
      that.searchAction()
    },

    // 删除
    confirmDelete(record) {
      let that = this
      getFeedelFeeRule({ id: record.id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },
    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '审核通过',
        3: '审核未通过',
        4: '已撤回',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    //审批流组件
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

    // 撤回
    confirmWithdraw(record) {
      let that = this
      getFeeRevocation({ id: record.id }).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      getFeeRuleList(_searchParam)
        .then((res) => {
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
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },

    doAction(type, record) {
      this.$refs.addForm.query(type, record)
      //this.$message.info('功能尚未实现...')
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.topName {
  top: 230px !important;
}
.main-wrapper {
  margin-top: 20px;
}
</style>

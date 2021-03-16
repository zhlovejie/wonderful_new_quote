<template>
  <!-- 成品物料规则审核 -->
  <a-card :bordered="false">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input placeholder="代码模糊查询" v-model="queryParam.code" allowClear style="width: 150px" />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="名称模糊查询" v-model="queryParam.ruleName" allowClear style="width: 150px" />
        </a-form-item>
        <a-form-item label="审批状态" >
          <a-select style="width: 150px" v-model="queryParam.auditStatus" >
            <a-select-option :value="1">通过</a-select-option>
            <a-select-option :value="2">不通过</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="search({ current: 1 })">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button :disabled="btnDisable" type="primary" @click="passAction">通过</a-button>
        </a-form-item>
        <a-form-item>
          <a-button :disabled="btnDisable" type="primary" @click="noPassAction">不通过</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="main-wrapper">
      <a-tabs :activeKey="activeKey" :defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" :key="0" />
        <template v-if="$auth('attenceTravelApply:approval')">
          <a-tab-pane tab="待我审批" :key="1" />
          <a-tab-pane tab="我已审批" :key="2" />
        </template>
      </a-tabs>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange" 
        :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
      </a-table>
    </div>
    <Approval ref="approval" @opinionChange="opinionChange"/>
  </a-card>
</template>

<script>
import {
  materialRuleAuditAudit,
  materialRuleAuditPageList,
} from '@/api/routineMaterial'
import Approval from './Approval'

const columns = [
  {
    align: 'center',
    title: '代码',
    dataIndex: 'code'
  },
  {
    align: 'center',
    title: '路径',
    dataIndex: 'ruleName'
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'ruleName'
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
  }
]

export default {
  name: 'material-management-audit-RoutineList',
  components: {
    Approval
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      queryParam: {},
      activeKey: 0,
      columns,
      selectedRowKeys: [],
      selectedRows: [],

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
    btnDisable(){
      return this.selectedRows.length === 0
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'material-rule-management-audit-finished-product') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      const that = this
      that.queryParam = {...that.queryParam,searchStatus:that.activeKey}
      let queue = []
      that.search()
      return Promise.all(queue)
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    search(params = {}) {
      const that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      materialRuleAuditPageList(_searchParam)
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
            that.search()
          }
        })
        .catch((err) => (that.loading = false))
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    tabChange(tagKey) {
      this.activeKey = +tagKey
      this.queryParam = {...this.queryParam,searchStatus:this.activeKey}
      this.search({ current: 1 })
    },
    submitAction(opt) {
      const that = this
      let values = Object.assign({}, opt || {}, { approveId: 1111 })
      materialRuleAuditAudit(values)
        .then(res => {
          that.$message.info(res.msg)
          that.search()
        })
        .catch(err => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      this.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    }
  }
}
</script>


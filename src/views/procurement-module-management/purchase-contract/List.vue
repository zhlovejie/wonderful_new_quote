<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input placeholder="合同编号模糊查询" v-model="queryParam.keyword" allowClear style="width: 160px" />
          </a-form-item>
          <a-form-item>
            <a-input placeholder="采购需求单号模糊查询" v-model="queryParam.keyword" allowClear style="width: 160px" />
          </a-form-item>
          <a-form-item>
            <a-input placeholder="供应商名称模糊查询" v-model="queryParam.keyword" allowClear style="width: 160px" />
          </a-form-item>

          <a-form-item>
            <a-input placeholder="物料代码模糊查询" v-model="queryParam.keyword" allowClear style="width: 160px" />
          </a-form-item>
          <a-form-item>
            <a-input placeholder="物料名称模糊查询" v-model="queryParam.keyword" allowClear style="width: 160px" />
          </a-form-item>

          <a-form-item>
            <a-select placeholder="状态" style="width: 120px" allowClear v-model="queryParam.urgencyDegree">
              <a-select-option :value="0">待提交</a-select-option>
              <a-select-option :value="1">待审核</a-select-option>
              <a-select-option :value="2">通过</a-select-option>
              <a-select-option :value="3">不通过</a-select-option>
              <a-select-option :value="4">已撤回</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" icon="search" @click="search({ current: 1 })">查询</a-button>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" icon="search" @click="openSearch">筛选</a-button>
          </a-form-item>

          <a-form-item style="float:right;">
            <a-button type="primary" icon="plus" @click="doAction('add', null)">新增</a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="main-wrapper">
        <a-tabs :activeKey="activeKey" :defaultActiveKey="activeKey" @change="tabChange">
          <a-tab-pane tab="我的" :key="0" />
          <a-tab-pane tab="待我审批" :key="1" />
          <a-tab-pane tab="我已审批" :key="2" />
        </a-tabs>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <div slot="order" slot-scope="text, record, index">
            {{ index + 1 }}
          </div>
          <div slot="typePay" slot-scope="text, record, index">
            {{
              `${+record.taxType === 1 ? '含税' : '不含税'} &nbsp; ${+record.freightType === 1 ? '含运费' : '不含运费'}`
            }}
          </div>

          <div slot="freightFullAmount" slot-scope="text, record, index">
            {{ record.freightFullAmount | moneyFormatNumber }}
          </div>

          <div slot="contractAmount" slot-scope="text, record, index">
            {{ record.contractAmount | moneyFormatNumber }}
          </div>

          <div slot="status" slot-scope="text, record, index">
            <a href="javascript:void(0);" @click="approvalPreview(record)">
              {{ { 0: '待提交', 1: '待审批', 2: '通过', 3: '不通过', 4: '已撤销' }[text] || '未知状态' }}
            </a>
          </div>

          <a-table
            slot="expandedRowRender"
            slot-scope="record, index, indent, expanded"
            :columns="innerColumns"
            :dataSource="record.contractOrderDetailVos"
            :pagination="false"
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>

            <div slot="newPrice" slot-scope="text, record, index">
              {{ record.newPrice | moneyFormatNumber }}
            </div>
            <div slot="amount" slot-scope="text, record, index">
              {{ record.amount | moneyFormatNumber }}
            </div>
            <div slot="finishStatus" slot-scope="text, record, index">
              {{ { 1: '未完成', 2: '已完成' }[record.finishStatus] || '未完成' }}
            </div>
          </a-table>

          <div slot="action" slot-scope="text, record, index">
            <!--{{ { 0: '待提交', 1: '待审批', 2: '通过', 3: '不通过', 4: '已撤销' }[text] || '未知状态' }} -->

            <template v-if="+activeKey === 0">
              <a @click="doAction('view', record)">详情</a>
              <template v-if="[0, 3, 4].includes(+record.status)">
                <a-divider type="vertical" />
                <a @click="doAction('edit', record)">修改</a>
                <a-divider type="vertical" />
                <a @click="doAction('del', record)">删除</a>
              </template>
              <template v-if="+record.status === 1">
                <a-divider type="vertical" />
                <a @click="doAction('revocation', record)">撤回</a>
              </template>
              <template v-if="+record.status === 2">
                <a-divider type="vertical" />
                <a @click="doAction('change', record)">变更合同</a>
                <a-divider type="vertical" />
                <a v-download="record.contractUrl">下载</a>
                <a-divider type="vertical" />
                <a @click="doAction('files', record)">附件</a>
              </template>
            </template>
            <template v-if="+activeKey === 1">
              <a @click="doAction('approval', record)">审批</a>
            </template>
            <template v-if="+activeKey === 2">
              <a @click="doAction('view', record)">详情</a>
            </template>
            <a-divider type="vertical" />
            <a @click="doAction('files', record)">附件</a>
            <a-divider type="vertical" />
            <a-button type="primary" @click="doAction('preview', record)">合同预览</a-button>
          </div>
        </a-table>
      </div>
      <SearchForm ref="searchForm" @change="handleSearch" />
      <ApproveInfo ref="approveInfoCard" />
      <Files ref="files" />
    </a-spin>
  </a-card>
</template>

<script>
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import SearchForm from './SearchForm'
import Files from './modules/Files'
import {
  purchaseContractPageList,
  purchaseContractDel,
  purchaseContractRevocation
} from '@/api/procurementModuleManagement'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '采购合同编号',
    dataIndex: 'contractNum'
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName'
  },
  {
    title: '是否含税含运费',
    scopedSlots: { customRender: 'typePay' }
  },
  {
    title: '运费金额',
    dataIndex: 'freightFullAmount',
    scopedSlots: { customRender: 'freightFullAmount' }
  },
  {
    title: '合同总金额',
    dataIndex: 'contractAmount',
    scopedSlots: { customRender: 'contractAmount' }
  },
  {
    title: '签订日期',
    dataIndex: 'signDate'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]
const innerColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '采购需求单号',
    dataIndex: 'requestApplyNum'
  },
  // {
  //   title: '采购单状态',
  //   dataIndex: 'finishStatus',
  //   scopedSlots: { customRender: 'finishStatus' }
  // },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
  },
  {
    title: '单位',
    dataIndex: 'subUnit'
  },
  {
    title: '采购量',
    dataIndex: 'purchaseNum'
  },
  {
    title: '采购单价(元)',
    dataIndex: 'newPrice',
    scopedSlots: { customRender: 'newPrice' }
  },
  {
    title: '金额(元)',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' }
  }
]

export default {
  name: 'procurement-module-management-purchase-contract',
  components: {
    CommonDictionarySelect,
    ApproveInfo,
    SearchForm,
    Files
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      queryParam: {},
      activeKey: 0,
      columns,
      innerColumns,

      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      spinning: false,
      normalAddFormKeyCount: 1,
      userInfo: this.$store.getters.userInfo // 当前登录人
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'procurement-module-management-purchase-contract') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      const that = this
      that.tabChange(that.activeKey)
    },
    search(params = {}) {
      const that = this
      that.selectedRowKeys = []
      that.selectedRows = []

      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      that.loading = true
      purchaseContractPageList(_searchParam)
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

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          const { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch(err => {
          that.loading = false
          console.log(err)
        })
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
      let queryParam = { ...this.queryParam, searchStatus: this.activeKey }
      this.queryParam = queryParam
      this.selectedRowKeys = []
      this.selectedRows = []
      this.search({ current: 1 })
    },
    doAction(type, record) {
      const that = this
      if (['add', 'edit', 'view', 'approval', 'change'].includes(type)) {
        // that.$refs['addForm'].query(type, { ...record })
        that.$router.push({
          name: 'procurement-module-management-purchase-contract-action',
          params: {
            record: { ...record },
            action: type,
            from: 'procurement-module-management-purchase-contract'
          }
        })
        return
      } else if (type === 'del') {
        that.confirmModel({
          content: '确认执行删除操作吗?',
          success: () => {
            purchaseContractDel({ id: record.id })
              .then(res => {
                that.$message.info(res.msg)
                if (+res.code === 200) {
                  that.search()
                }
              })
              .catch(err => {
                console.error(err)
                that.$message.error(err)
              })
            return
          }
        })
        return
      } else if (type === 'revocation') {
        that.confirmModel({
          content: '确认执行撤回操作吗?',
          success: () => {
            purchaseContractRevocation({ id: record.id })
              .then(res => {
                that.$message.info(res.msg)
                if (+res.code === 200) {
                  that.search()
                }
              })
              .catch(err => {
                console.error(err)
                that.$message.error(err)
              })
            return
          }
        })
        return
      } else if (type === 'files') {
        that.$refs['files'].query({ ...record })
        return
      } else if (type === 'preview') {
        that.$router.push({
          name: 'procurement-module-management-purchase-contract-preview',
          params: {
            contractId: record.id,
            from: 'procurement-module-management-purchase-contract'
          }
        })
        return
      }
    },
    confirmModel(opt) {
      const that = this
      let { title, content, success, attrs } = opt
      that.$confirm({
        title: title || '提示',
        content: h => {
          return h('div', null, content)
        },
        onOk() {
          success && success()
        },
        onCancel() {},
        ...(attrs || {})
      })
      return
    },
    handleSearch(params) {
      this.queryParam = {
        ...this.queryParam,
        ...params
      }
      this.search()
    },
    openSearch() {
      this.$refs.searchForm.query()
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    }
  }
}
</script>
<style scoped>
.__table-footer-action-wrapper > * {
  margin-right: 10px;
}
</style>

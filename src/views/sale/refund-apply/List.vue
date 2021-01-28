<template>
  <!-- 返款申请 -->
  <div class="container-list-wrapper">
    <div class="search-wrapper">
      <a-input
        placeholder="客户名称模糊查询"
        :allowClear="true"
        v-model="searchParam.customerName"
        style="width: 200px"
      />
      <a-select
        optionFilterProp="children"
        showSearch
        :allowClear="true"
        :filterOption="filterSalersOption"
        placeholder="请选择销售人员"
        style="width: 200px"
        v-model="searchParam.saleUserId"
      >
        <a-select-option v-for="item in saleUser" :value="item.userId" :key="item.userId">{{
          item.salesmanName
        }}</a-select-option>
      </a-select>

      <a-select
        v-if="+activeKey === 0"
        placeholder="处理状态"
        :allowClear="true"
        v-model="searchParam.status"
        style="width: 120px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">通过</a-select-option>
        <a-select-option :value="3">不通过</a-select-option>
        <a-select-option :value="4">已撤回</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
      <a-button 
        v-if="$auth('sale-refund-apply-list:add')"
        class="a-button" 
        style="float: right" 
        type="primary" 
        icon="plus" 
        @click="doAction('add', null)"
      >新增</a-button
      >
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="activeKey" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="我的" :key="0" />
        <template v-if="$auth('sale-refund-apply-list:approve')">
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
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>

        <div slot="status" slot-scope="text, record, index">
          <a @click="approvalPreview(record)">{{ getStatusText(text) }}</a>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('preview', record)">预览</a>
          <template v-if="activeKey === 1">
            <template v-if="record.status === 1">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit', record)">修改</a>
            </template>
            <template v-if="record.status === 2">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
            <template v-if="record.status === 3">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('upload', record)">附件</a>
            </template>
            <template v-if="[4, 5].includes(+record.status)">
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit', record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del', record)">
                <a type="primary" href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 2">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>
        </div>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <AddForm ref="addForm" @finish="searchAction()" />
    <UploadFile ref="uploadFile" />
    <PreView ref="preView" />
  </div>
</template>
<script>
import {
  qualificationBorrowRebatesDelete,
  qualificationBorrowRebatesRevocation,
  qualificationBorrowRebatesPageList,
} from '@/api/receipt'

import { getListSaleContractUser } from '@/api/contractListManagement'
import AddForm from './module/AddForm'
import PreView from './module/View'
import UploadFile from './module/UploadFile'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'

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
    title: '返款编号',
    dataIndex: 'rebatesNum',
  },
  {
    align: 'center',
    title: '销售负责人',
    dataIndex: 'saleUserName',
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'customerName',
  },
  {
    align: 'center',
    title: '税率',
    dataIndex: 'taxRate',
  },
  {
    align: 'center',
    title: '付款金额(元)',
    dataIndex: 'paymentAmount',
  },
  {
    align: 'center',
    title: '单据状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: ' 提交人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: ' 提交时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'sale-refund-apply-list',
  components: {
    AddForm,
    ApproveInfo,
    PreView,
    UploadFile,
  },
  data() {
    return {
      searchParam: {},
      activeKey: 0,
      columns: columns,
      dataSource: [],
      saleUser: [],
      pagination1: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading: false,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'sale-refund-apply-list') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      getListSaleContractUser().then((res) => (that.saleUser = res.data))
      that.searchAction()
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.searchParam }, paginationParam, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      qualificationBorrowRebatesPageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.effective = `${item.effectiveStart} ~ ${item.effectiveEnd}`
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
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },

    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    doAction(type, record) {
      let that = this
      if (type === 'reback') {
        qualificationBorrowRebatesRevocation(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            if (+res.code === 200) {
              that.searchAction()
            }
          })
          .catch((err) => that.$message.error(err.message))
        return
      }
      if (type === 'del') {
        qualificationBorrowRebatesDelete(`id=${record.id}`)
          .then((res) => {
            that.$message.info(res.msg)
            if (+res.code === 200) {
              that.searchAction()
            }
          })
          .catch((err) => that.$message.error(err.message))
        return
      }
      if (type === 'preview') {
        this.$refs.preView.query(type, record)
        return
      }
      if (type === 'upload') {
        that.$refs.uploadFile.query(type, record)
        return
      }
      that.$refs.addForm.query(type, record)
    },
    getStatusText(state) {
      let stateMap = {
        1: '待审批',
        2: '通过',
        3: '不通过',
        4: '已撤回',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    tabChange(tagKey) {
      this.activeKey = +tagKey
      this.searchAction({ current: 1, queryType: this.activeKey })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style scoped>
.container-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.container-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>

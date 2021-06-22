<template>
  <a-card :bordered="false">
    <a-spin :spinning="spinning">
      <div class="search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              placeholder="BOM单组别名称"
              v-model="queryParam.groupName"
              allowClear
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="BOM单编号"
              v-model="queryParam.bomCode"
              allowClear
              style="width: 150px"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="工艺路线代码"
              v-model="queryParam.routeCode"
              allowClear
              style="width: 150px"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="工艺路线名称"
              v-model="queryParam.routeName"
              allowClear
              style="width: 150px"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="物料代码"
              v-model="queryParam.materialCode"
              allowClear
              style="width: 150px"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="物料名称"
              v-model="queryParam.materialName"
              allowClear
              style="width: 150px"
            />
          </a-form-item>
          <a-form-item v-if="+activeKey === 1">
            <a-select
              style="width: 150px"
              placeholder="审批状态"
              v-model="queryParam.status"
            >
              <a-select-option :value="0">待审核</a-select-option>
              <a-select-option :value="1">待审批</a-select-option>
              <a-select-option :value="2">通过</a-select-option>
              <a-select-option :value="3">不通过</a-select-option>
              <a-select-option :value="4">已反审核</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              icon="search"
              @click="search({ current: 1 })"
            >查询</a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="main-wrapper">
        <a-tabs
          v-if="status.isAction"
          :activeKey="activeKey"
          :defaultActiveKey="1"
          @change="tabChange"
        >
          <!-- <a-tab-pane tab="我的" :key="1" /> -->
          <!-- <template v-if="$auth('materialRuleAudit:approval')"> -->
          <a-tab-pane
            tab="待我审批"
            :key="1"
          />
          <a-tab-pane
            tab="我已审批"
            :key="2"
          />
          <!-- </template> -->
        </a-tabs>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <div
            slot="order"
            slot-scope="text, record, index"
          >
            <span>{{ index + 1 }}</span>
          </div>
          <div
            slot="modelType"
            slot-scope="text, record, index"
          >
            <a-tooltip>
              <template slot="title">
                {{ text }}
              </template>
              <span class="icon-required">查看</span>
              <a-icon
                type="question-circle"
                style="margin-left: 5px; color: #1890ff"
              />
            </a-tooltip>
          </div>
          <div
            slot="materialUnit"
            slot-scope="text, record, index"
          >
            {{ { 1: '支', 2: '把', 3: '件' }[text] }}
          </div>
          <div
            slot="materialProperty"
            slot-scope="text, record, index"
          >
            {{ {1:'自制',2:'外购',3:'委外',4:'标准件'}[text]}}
          </div>

          <div
            slot="status"
            slot-scope="text, record, index"
          >
            <a @click="approvalPreview(record)">{{ { 0:'待审核',1: '待审批', 2: '通过', 3: '不通过', 4: '已反审核' }[text] }}</a>
          </div>
          <div
            slot="action"
            slot-scope="text, record, index"
          >
            <a @click="doAction('view', record)">查看</a>
            <template v-if="$auth('materialForm:approval') && +record.status === 1">
              <a-divider type="vertical" />
              <a @click="doAction('approval', record)">审批</a>
            </template>
          </div>
        </a-table>
      </div>

      <ApproveInfo ref="approveInfoCard" />
      <NormalAddForm
        ref="normalAddForm"
        :key="normalAddFormKeyCount"
        @finish="() => init()"
      />
    </a-spin>
  </a-card>
</template>

<script>
// import { materialRuleAudit, materialRuleAuditBatch, materialRuleAuditPageList } from '@/api/routineMaterial'

import { pageMaterialForm } from '@/api/bomManagement'

import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import AddForm from './modules/AddForm'
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
    title: 'BOM单组别名称',
    dataIndex: 'groupName'
  },
  {
    align: 'center',
    title: 'BOM单编号',
    dataIndex: 'bomCode'
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'modelType',
    scopedSlots: { customRender: 'modelType' }
  },
  {
    align: 'center',
    title: '物料属性',
    dataIndex: 'materialProperty',
    scopedSlots: { customRender: 'materialProperty' }
  },
  {
    align: 'center',
    title: '工艺路线代码',
    dataIndex: 'routeCode'
  },
  {
    align: 'center',
    title: '工艺路线名称',
    dataIndex: 'routeName'
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
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'bom-management_approval',
  components: {
    ApproveInfo,
    NormalAddForm: AddForm
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      queryParam: {},
      activeKey: 0,
      columns,
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
      status: {
        isSubmit: false,
        isAction: false
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        const base = 'bom-management_approval_'
        const isAction = to.name === `${base}myaction`
        const isSubmit = to.name === `${base}mysubmit`
        this.status = {
          ...this.status,
          isSubmit,
          isAction
        }
        if (isSubmit) {
          this.activeKey = 0
          this.queryParam = { searchStatus: 0 }
          this.init()
        } else if (isAction) {
          this.activeKey = 1
          this.queryParam = { searchStatus: 1 }
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      const that = this
      that.search()
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
      pageMaterialForm(_searchParam)
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
      if (tagKey) {
        this.activeKey = +tagKey
      }
      this.queryParam = { ...this.queryParam, searchStatus: this.activeKey }
      this.search({ current: 1 })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    doAction(type, record) {
      const that = this

      that.$refs['normalAddForm'].query(type, {
        ...record,
        __selectItem: {
          title: record.groupName,
          value: record.groupId
        }
      })
    }
  }
}
</script>


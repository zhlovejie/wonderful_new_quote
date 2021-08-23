<template>
  <!-- 资产保修申请列表 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input placeholder="物料代码" v-model="searchParam.materialCode" :allowClear="true" style="width: 160px" />
      <a-input placeholder="物料名称" v-model="searchParam.materialName" :allowClear="true" style="width: 160px" />
      <a-select placeholder="审批状态" v-model="searchParam.status" :allowClear="true" style="width: 160px">
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">通过</a-select-option>
        <a-select-option :value="3">不通过</a-select-option>
      </a-select>

      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
      <template v-if="activeKey === 1 && $auth('salaryDetails:PassAction')">
        <a-button
          :disabled="selectedRows.length === 0"
          style="position: relative; top: -1px; margin-left: 10px"
          type="primary"
          @click="passAction"
          >通过</a-button
        >
        <a-button
          :disabled="selectedRows.length === 0"
          style="position: relative; top: -1px; margin-left: 10px"
          type="primary"
          @click="noPassAction"
          >不通过</a-button
        >
      </template>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('fixList-record:approval')">
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
        :rowSelection="
          activeKey === 1 ? { onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys } : null
        "
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="type" slot-scope="text, record, index">
          {{
            {
              1: '供应商',
              2: '品牌型号',
              3: '包装',
              4: '裸价',
              5: '发票',
              6: '安全库存',
              7: '质保期',
              8: '交货期',
              9: '物料税率',
            }[text] || '未知'
          }}
        </div>
        <div slot="emaeceLevel" slot-scope="text, record, index">{{ { 1: '一般', 2: '紧急' }[text] || '未知' }}</div>
        <div slot="status" slot-scope="text, record, index">
          <a href="javascript:void(0);" @click="approvalPreview(record)">{{
            { 1: '待审批', 2: '通过', 3: '不通过' }[text] || '未知'
          }}</a>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="+activeKey === 0">
            <template v-if="$auth('fixList-record:view')">
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
          </template>
          <template v-if="+activeKey === 1">
            <a type="primary" @click="doAction('approval', record)">审批</a>
          </template>

          <template v-if="+activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
      <ApproveInfo ref="approveInfoCard" />
      <Modal ref="modal" @files="searchAction"></Modal>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </div>
  </div>
</template>

<script>
import { getchange, approvalChange } from '@/api/routineMaterial'

import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import Modal from '../module/modal'
import Approval from './Approval'

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
    title: '物料名称',
    dataIndex: 'materialName',
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode',
  },

  {
    align: 'center',
    title: '采购要求变更类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' },
  },
  {
    align: 'center',
    title: '变更前',
    dataIndex: 'changeStart',
    // scopedSlots: { customRender: 'beforeType' },
  },
  {
    align: 'center',
    title: '变更后',
    dataIndex: 'changeEnd',
    // scopedSlots: { customRender: 'afterType' },
  },
  {
    align: 'center',
    title: '审核状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },

  {
    align: 'center',
    title: '申请人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '申请时间',
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
  name: 'asset-management-record',
  components: {
    ApproveInfo,
    Modal,
    Approval,
  },
  data() {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      columns: columns,
      dataSource: [],
      assetTypeList: [],
      pagination: {
        current: 1,
      },
      searchParam: {},
      loading: false,
      activeKey: 0,
      userInfo: this.$store.getters.userInfo,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'material-rule-management-approve') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    init() {
      let that = this
      //   let task1 = getDictionaryList({ parentId: 532 }).then((res) => (that.assetTypeList = res.data))
      that.tabChange(0)
    },
    searchAction(opt = {}) {
      let that = this
      that.selectedRowKeys = []
      that.selectedRows = []
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getchange(_searchParam)
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
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    doAction(type, record) {
      let that = this
      let react = {
        1: 'supplier',
        2: 'brand',
        3: 'packing',
        4: 'standard',
        5: 'invoice',
        6: 'stock',
        7: 'Warranty',
        8: 'delivery',
        9: 'taxRate',
      }
      this.$refs.modal.query(react[record.type], record, type)
      // if (['view', 'edit', 'approval', 'fix'].includes(type)) {
      //   //查看，编辑，审批，填写维修方案
      //   that.$refs.fixForm.query(type, record)
      //   return
      // }
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam.searchStatus = this.activeKey
      this.searchAction({ current: 1 })
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    //批量审批
    submitAction(opt) {
      let that = this
      that.spinning = true
      approvalChange(opt)
        .then((res) => {
          that.spinning = false
          // that.$message.info('提示： 批量审批请手动点击搜索查询')
          that.searchAction()
          // that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },

    passAction(opt = {}) {
      const that = this
      const ids = that.selectedRows.map((item) => {
        return {
          purchaseChangeId: item.purchaseChangeId,
          type: item.type,
        }
      })
      this.submitAction({ changeApprovalListVos: ids, commonApprovalVO: { isAdopt: 0, opinion: '通过' } })
    },
    noPassAction() {
      this.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      const that = this
      const ids = that.selectedRows.map((item) => {
        return {
          purchaseChangeId: item.purchaseChangeId,
          type: item.type,
        }
      })
      this.submitAction({ changeApprovalListVos: ids, commonApprovalVO: { isAdopt: 1, opinion: opinion } })
    },
  },
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

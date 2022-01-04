<template>
  <!-- 收料单 -->
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-input
        placeholder="供应商名称"
        v-model="queryParam.supplierName"
        allowClear
        style="width: 200px; margin-right: 10px"
        @change="changeHandler()"
      />
      <a-input
        placeholder="物料代码"
        v-model="queryParam.materialCode"
        allowClear
        @change="changeHandler()"
        style="width: 200px; margin-right: 10px"
      />

      <a-select
        placeholder="收料类型"
        v-model="queryParam.receiveType"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">采购订单</a-select-option>
        <a-select-option :value="2">委外订单</a-select-option>
      </a-select>
      <a-input
        placeholder="收料单号/采购单号"
        v-if="activeKey === 1"
        v-model="queryParam.orderNum"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-input
        placeholder="收料单编号"
        v-if="activeKey === 2"
        v-model="queryParam.recieveNum"
        allowClear
        style="width: 200px; margin-right: 10px"
      />
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchCheck({ current: 1 })"
        >查询</a-button
      >
      <a-button
        style="margin-left: 15px"
        type="primary"
        :disabled="!hasSelected"
        @click="doAction('Batch', selectedRows)"
      >
        批量确认收料
      </a-button>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="待收料" key="1" />
        <a-tab-pane tab="已收料" key="2" />
      </a-tabs>
      <a-table
        v-if="activeKey === 1"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="receiveType" slot-scope="text, record, index">
          <span>{{ { 1: '采购订单', 2: '委外订单' }[text] }}</span>
        </div>
        <div slot="emergenceLevel" slot-scope="text, record, index">
          <span>{{ { 1: '一般', 2: '加急', 3: '特急' }[text] }}</span>
        </div>
        <div slot="specification" slot-scope="text">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 10) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template>
            <a type="primary" @click="doAction('Receiving', record)">确认收料</a>
          </template>
        </div>
      </a-table>
      <a-table
        v-if="activeKey === 2"
        :columns="columns1"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="receiveType" slot-scope="text, record, index">
          <span>{{ { 1: '采购订单', 2: '委外订单' }[text] }}</span>
        </div>
        <div slot="emergenceLevel" slot-scope="text, record, index">
          <span>{{ { 1: '一般', 2: '加急', 3: '特急' }[text] }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template>
            <a type="primary" @click="doAction1('view', record)">详情</a>
          </template>
        </div>
        <div slot="specification" slot-scope="text">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 10) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>
      </a-table>
    </div>

    <AddForm ref="addForm" @filet="searchAction()" />
    <Formaddvive ref="formaddvive" @filet="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
  </div>
</template>
<script>
import { listReceive } from '@/api/storage'
import AddForm from './module/Formadd'
import Formaddvive from './module/Formaddvive'

import ApproveInfo from '@/components/CustomerList/Materialapproval'
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
    title: '收料单号',
    dataIndex: 'recieveNum',
    key: 'recieveNum',
  },
  {
    align: 'center',
    title: '收料类型',
    dataIndex: 'receiveType',
    key: 'receiveType',
    scopedSlots: { customRender: 'receiveType' },
  },
  {
    align: 'center',
    title: '采购单号/委托单号',
    dataIndex: 'orderNum',
    key: 'orderNum',
  },
  {
    align: 'center',
    title: '供应商名称',
    dataIndex: 'supplierName',
    key: 'supplierName',
  },
  {
    align: 'center',
    title: '紧急程度',
    dataIndex: 'emergenceLevel',
    key: 'emergenceLevel',
    scopedSlots: { customRender: 'emergenceLevel' },
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode',
    key: 'materialCode',
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName',
    key: 'materialName',
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'specification',
    key: 'specification',
    scopedSlots: { customRender: 'specification' },
  },
  {
    align: 'center',
    title: '包装方式',
    dataIndex: 'packageType',
    key: 'packageType',
  },
  {
    align: 'center',
    title: '包内数量',
    dataIndex: 'packageCount',
    key: 'packageCount',
  },
  {
    align: 'center',
    title: '采购数量',
    dataIndex: 'purchseCount',
    key: 'purchseCount',
  },
  {
    align: 'center',
    title: '到货数量',
    dataIndex: 'arrivalCount',
    key: 'arrivalCount',
  },
  {
    align: 'center',
    title: '申请人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '申请时间',
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
const columns1 = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '收料单号',
    dataIndex: 'recieveNum',
    key: 'recieveNum',
  },
  {
    align: 'center',
    title: '收料类型',
    dataIndex: 'receiveType',
    key: 'receiveType',
    scopedSlots: { customRender: 'receiveType' },
  },
  {
    align: 'center',
    title: '采购单号/委托单号',
    dataIndex: 'orderNum',
    key: 'orderNum',
  },
  {
    align: 'center',
    title: '供应商名称',
    dataIndex: 'supplierName',
    key: 'supplierName',
  },
  {
    align: 'center',
    title: '紧急程度',
    dataIndex: 'emergenceLevel',
    key: 'emergenceLevel',
    scopedSlots: { customRender: 'emergenceLevel' },
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode',
    key: 'materialCode',
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName',
    key: 'materialName',
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'specification',
    key: 'specification',
    scopedSlots: { customRender: 'specification' },
  },
  {
    align: 'center',
    title: '包装方式',
    dataIndex: 'packageType',
    key: 'packageType',
  },
  {
    align: 'center',
    title: '包内数量',
    dataIndex: 'packageCount',
    key: 'packageCount',
  },
  {
    align: 'center',
    title: '采购数量',
    dataIndex: 'purchseCount',
    key: 'purchseCount',
  },
  {
    align: 'center',
    title: '到货数量',
    dataIndex: 'arrivalCount',
    key: 'arrivalCount',
  },
  {
    align: 'center',
    title: '收料仓库',
    key: 'warehouseName',
    dataIndex: 'warehouseName',
  },
  {
    align: 'center',
    title: '收料数量',
    key: 'recieveCount',
    dataIndex: 'recieveCount',
  },

  {
    align: 'center',
    title: '收料人',
    key: 'receiveUserName',
    dataIndex: 'receiveUserName',
  },
  {
    align: 'center',
    title: '收料时间',
    dataIndex: 'receiveTime',
    key: 'receiveTime',
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
    Formaddvive,
  },
  data() {
    return {
      columns1,
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
      activeKey: 1,
      rule_List: [],
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      loading: false,
      whole: true,
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'stock_management_import_material_record') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    changeHandler() {
      this.searchAction()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      console.log(selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    init() {
      let that = this
      that.searchAction()
    },

    // 撤回
    confirmWithdraw(record) {
      let that = this
      translocateRevocation({ id: record.id }).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    searchCheck(opt) {
      this.isExpanded = true
      this.searchAction(opt)
    },
    searchAction(opt) {
      let that = this
      this.selectedRowKeys = []
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {}, {
        status: that.activeKey,
      })
      that.loading = true
      listReceive(_searchParam)
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
    },
    doAction1(type, record) {
      this.$refs.formaddvive.query(type, record)
    },

    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, status: this.activeKey })
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

<template>
  <!-- 配件清单 -->
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-input
            style="width: 200px"
            placeholder="任务单编号模糊查询"
            allowClear
            v-model="queryParam.taskDocumentNum"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="配件清单编号模糊查询"
            style="width: 200px"
            allowClear
            v-model="queryParam.accessoriesNum"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="客户名称/机构名称"
            style="width: 200px"
            allowClear
            v-model="queryParam.customerParameter"
          />
        </a-form-item>
        <a-form-item>
          <template>
            <a-button class="a-button" type="primary" icon="search" @click="searchCheck">查询</a-button>
          </template>
        </a-form-item>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="我的" key="0" forceRender> </a-tab-pane>

            <template v-if="$auth('detailed:handle')">
              <a-tab-pane tab="待处理" key="1"> </a-tab-pane>
              <a-tab-pane tab="已处理" key="2"> </a-tab-pane>
            </template>
          </a-tabs>
        </div>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :expandedRowKeys="expandedRowKeys"
          @expand="expandHandler"
        >
          <span slot="isTax" slot-scope="text, record">
            <span> {{ { 0: '含税', 1: '不含税' }[text] || '未知' }}</span>
          </span>
          <span slot="isPayment" slot-scope="text, record">
            <span v-if="text === 0" style="color: red">否</span>
            <span v-if="text === 1">是</span>
          </span>

          <span slot="paymentType" slot-scope="text, record">
            <span> {{ { 0: '完结付款', 1: '先付款', 2: '免付款', 3: '赠送' }[text] || '未知' }}</span>
          </span>
          <div slot="status" slot-scope="text, record">
            <a @click="handleClick(record)">{{
              { 1: '待处理', 2: '待完结', 3: '不通过', 4: '完结', 5: '已撤回' }[text] || '未知'
            }}</a>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="queryParam.searchStatus !== '1'">
              <a @click="handleAdd('veiw', record)">查看</a>
            </template>
            <template
              v-if="
                queryParam.searchStatus === '0' &&
                record.productInfoList.some((i) => i.isWarranty === 1) &&
                (record.paymentType === 0 || record.paymentType === 1)
              "
            >
              <a-divider type="vertical" />
              <a @click="accessorAdd('add', record)">配件销售合同</a>
            </template>
            <template v-if="queryParam.searchStatus === '1'">
              <a @click="handleAdd('edit', record)">处理</a>
            </template>
            <!-- 已处理 待完结 也显示处理按钮 -->
            <template v-if="+queryParam.searchStatus === 2 && +record.status === 2">
              <a-divider type="vertical" />
              <a @click="handleAdd('edit', record)">处理</a>
            </template>
            <template>
              <a-divider type="vertical" />
              <a @click="Payment(record)">付款码</a>
            </template>
          </span>

          <a-table
            slot="expandedRowRender"
            slot-scope="record, index, indent, expanded"
            :columns="innerColumns"
            :dataSource="record.productInfoList"
            :pagination="false"
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>

            <div slot="money" slot-scope="text, record, index">
              {{ record.isWarranty === 0 ? '0' : record.quantity * record.unitPrice }}
            </div>

            <div slot="deliveryMode" slot-scope="text, record, index">
              {{ { 0: '自带', 1: '邮寄' }[record.deliveryMode] || '未知' }}
            </div>
            <div slot="isWarranty" slot-scope="text, record, index">
              <span v-if="record.isWarranty === 0">否</span>
              <span v-if="record.isWarranty === 1" style="color: red">是</span>
            </div>
            <div slot="materialName" slot-scope="text">
              <a-tooltip v-if="String(text).length > 25">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 25) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
            <div slot="specification" slot-scope="text">
              <a-tooltip v-if="String(text).length > 25">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 25) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
            <div slot="specification" slot-scope="text">
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 10) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
          </a-table>
        </a-table>
      </a-col>
    </a-row>
    <AccessorForm ref="accessorForm" @filet="searchAction"></AccessorForm>
    <PartsForm ref="partsForm" @filet="searchAction"></PartsForm>
    <ApproveInfo ref="approveInfoCard" />
    <Application ref="application" @filet="searchAction"></Application>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import PartsForm from './partsForm'
import AccessorForm from './AccessorForm'

import Application from './application'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import { accessoriesManagementPage } from '@/api/after-sales-management'
const innerColumns = [
  {
    align: 'center',
    title: '序号',
    width: '80px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
    width: 150,
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' },
    width: 300,
  },
  {
    title: '规格型号',
    dataIndex: 'specification',
    scopedSlots: { customRender: 'specification' },
    width: 300,
  },
  {
    title: '单位',
    dataIndex: 'company',
  },
  {
    title: '数量',
    dataIndex: 'quantity',
  },
  {
    title: '单价（元）',
    dataIndex: 'unitPrice',
  },
  {
    title: '金额（元）',
    dataIndex: 'money',
    scopedSlots: { customRender: 'money' },
  },
  {
    title: '是否过保',
    scopedSlots: { customRender: 'isWarranty' },
  },
  {
    title: '带货方式',
    scopedSlots: { customRender: 'deliveryMode' },
  },
]
export default {
  name: 'ReceiptList',
  components: {
    // Tendering,
    // InvestigateNode,
    // ReceiptAdd,
    AccessorForm,
    Application,
    STable,
    ApproveInfo,
    PartsForm,
    // FormAdd,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: {
        searchStatus: '0',
      },
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      saleCustomer: 0,
      vueBoolean: this.$store.getters.vueBoolean,
      customerName: '',
      saleCustomers: [],
      approveStatus: 0,
      audit: false,
      showFlag: true,
      contractStatus: [
        {
          id: 0,
          name: '请选择状态',
        },
        {
          id: 1,
          name: '待审批',
        },
        {
          id: 2,
          name: '通过',
        },
        {
          id: 3,
          name: '不通过',
        },
      ],
      // 表头
      columns: [
        {
          title: '配件清单编号',
          dataIndex: 'accessoriesNum',
        },
        {
          title: '任务单编号',
          dataIndex: 'taskDocumentNum',
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          width: 200,
        },
        {
          title: '机构名称',
          dataIndex: 'orgName',
          width: 200,
        },
        {
          title: '销售负责人',
          dataIndex: 'saleUserName',
        },
        {
          title: '是否含税',
          dataIndex: 'isTax',
          scopedSlots: { customRender: 'isTax' },
        },
        {
          title: '金额（元）',
          dataIndex: 'totalAmount',
        },
        {
          title: '付款方式',
          dataIndex: 'paymentType',
          scopedSlots: { customRender: 'paymentType' },
        },
        {
          title: '是否付款',
          dataIndex: 'isPayment',
          scopedSlots: { customRender: 'isPayment' },
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '提交人',
          dataIndex: 'createdName',
        },
        {
          title: '提交时间',
          dataIndex: 'createdTime',
        },
        {
          title: '操作',
          dataIndex: 'id',

          scopedSlots: { customRender: 'action' },
        },
      ],
      innerColumns: innerColumns,
      selectedRowKeys: [],
      selectedRows: [],
      dayWeekMonth: 1,

      dataSource: [],
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      loading: false,
      isExpanded: false, //是否展开列表子数据
      expandedRowKeys: [],
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'access_sidewalk_detailedList') {
          this.searchAction()
        }
      },
      immediate: true,
    },
  },
  methods: {
    Payment(type, record) {
      this.$refs.application.query(type, record)
    },
    searchCheck() {
      this.isExpanded = true
      this.searchAction()
    },
    handleAdd(type, record) {
      this.$refs.partsForm.query(type, record)
    },
    accessorAdd(type, record) {
      this.$refs.accessorForm.query(type, record)
    },

    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      accessoriesManagementPage(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })

          that.expandedRowKeys = that.isExpanded ? that.dataSource.map((item) => item.key) : []

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
    paramClick(key) {
      this.queryParam = { ...this.queryParam, searchStatus: key }
      this.searchAction()
    },
    // handleAdd(type, record) {
    //   this.$refs.formadd.query()
    // },
    handleClick(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    del(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除编号为: ${row.receiptCode} 的收款单吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          deleteReceipt({ id: row.id }).then((res) => {
            if (res.code == 200) {
              _this.searchAction()
            } else {
              _this.$message.error(res.msg)
            }
          })

          console.log('OK')
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    expandHandler(expanded, record) {
      console.log(arguments)
      if (expanded) {
        this.expandedRowKeys = [...this.expandedRowKeys, record.key]
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter((val) => val !== record.key)
      }
    },
    doAction(type, record) {
      let that = this
      if (type === 'reback') {
        revocationReceipt({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
    },
  },
}
</script>

<style scoped>
.top-ation .a-input {
  width: 150px;
  margin: 0 5px 5px 0;
}

.a-select {
  margin-right: 5px;
}

.a-button {
  margin-right: 5px;
}

.fl-r {
  float: right;
}

.develop-wrap {
  background-color: #fff;
  padding: 12px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>

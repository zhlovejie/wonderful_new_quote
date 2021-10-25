<template>
  <!-- 邮寄记录 -->
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-input style="width: 200px" placeholder="任务单编号模糊查询" allowClear v-model="queryParam.taskNum" />
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
          <a-input
            placeholder="收件人姓名/联系电话"
            style="width: 200px"
            allowClear
            v-model="queryParam.recipientParameter"
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
          <a-tabs defaultActiveKey="2" @change="paramClick">
            <a-tab-pane tab="我的" key="2" forceRender> </a-tab-pane>

            <template v-if="$auth('mail:handle')">
              <a-tab-pane tab="待邮寄" key="0"> </a-tab-pane>
              <a-tab-pane tab="已邮寄" key="1"> </a-tab-pane>
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
            <span> {{ { 0: '完结付款', 1: '先付款', 2: '免付款' }[text] || '未知' }}</span>
          </span>
          <div slot="status" slot-scope="text, record">
            <span>{{ { 0: '待邮寄', 1: '已邮寄' }[text] || '未知' }}</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="queryParam.status !== '0'">
              <a @click="handleAdd('view', record)">查看</a>
            </template>
            <template v-if="queryParam.status === '0'">
              <a @click="handleAdd('edit', record)">处理</a>
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
              {{ index + 1 }}
            </div>

            <div slot="money" slot-scope="text, record, index">
              {{ record.isWarranty === 0 ? '0' : record.quantity * record.unitPrice }}
            </div>

            <div slot="deliveryMode" slot-scope="text, record, index">
              {{ text === 0 ? '自带' : '邮寄' }}
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
            <div slot="company" slot-scope="text">
              <a-tooltip v-if="String(text).length > 10">
                <template slot="title">{{ text }}</template>
                {{ String(text).slice(0, 10) }}...
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>

            <div slot="problemDescription" slot-scope="text">
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
    <PartsForm ref="partsForm" @filet="searchAction"></PartsForm>
    <ApproveInfo ref="approveInfoCard" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import { mailRecordPage } from '@/api/after-sales-management'
import PartsForm from './partsForm'
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
    scopedSlots: { customRender: 'company' },
  },
  {
    title: '数量',
    dataIndex: 'quantity',
  },
  {
    title: '单价（元）',
    dataIndex: 'unitPrice',
    width: 150,
  },
  {
    title: '金额（元）',
    dataIndex: 'money',
    scopedSlots: { customRender: 'money' },
  },
  {
    title: '是否过保',
    scopedSlots: { customRender: 'isWarranty' },
    width: 150,
  },
  {
    title: '带货方式',
    scopedSlots: { customRender: 'deliveryMode' },
    width: 150,
  },
]
export default {
  name: 'ReceiptList',
  components: {
    STable,
    ApproveInfo,
    PartsForm,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: {
        status: '2',
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
      // 表头
      columns: [
        {
          title: '邮寄单号',
          dataIndex: 'mailNum',
        },
        {
          title: '任务单编号',
          dataIndex: 'taskDocumentNum',
        },
        {
          title: '收件人姓名',
          dataIndex: 'recipientName',
        },
        {
          title: '联系电话',
          dataIndex: 'contactNumber',
          width: 100,
        },
        {
          title: '收件地址',
          dataIndex: 'address',
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
          title: '处理人',
          dataIndex: 'modifierName',
        },
        {
          title: '处理时间',
          dataIndex: 'modifyTime',
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
        if (to.name === 'access_sidewalk_mail') {
          this.searchAction()
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleAdd(type, record) {
      this.$refs.partsForm.query(type, record)
    },
    searchCheck() {
      this.isExpanded = true
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      mailRecordPage(_searchParam)
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
      this.queryParam = { ...this.queryParam, status: key }
      this.searchAction()
      console.log(key)
    },
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

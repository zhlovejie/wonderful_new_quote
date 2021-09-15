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
          <template v-if="$auth('receipt:list')">
            <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
          </template>
        </a-form-item>
        <!-- <div class="table-operator fl-r">
          <a-button type="primary" @click="handleAdd('add', null)" style="margin-left: 8px">
            新增 <a-icon type="plus" />
          </a-button>
        </div> -->
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="我的" key="0" forceRender> </a-tab-pane>

            <template v-if="$auth('receipt:approval')">
              <a-tab-pane tab="待我审批" key="4"> </a-tab-pane>
              <a-tab-pane tab="我已审批" key="2"> </a-tab-pane>
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
            <a @click="handleClick(record)">{{
              { 1: '待处理', 2: '待完结', 3: '不通过', 4: '完结', 5: '已撤回' }[text] || '未知'
            }}</a>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('receipt:one')">
              <a @click="handleVue(record)">查看</a>
            </template>
            <!-- <template v-if="$auth('receipt:edit') && audit">
              <a-divider type="vertical" />
              <a @click="handleAudit(record)">审核</a>
            </template>
            <template
              v-if="
                $auth('receipt:edit') &&
                (+record.receiptStatus === 3 || +record.receiptStatus === 9) &&
                userInfo.id === record.createdId
              "
            >
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">修改</a>
            </template>
            <template
              v-if="
                $auth('receipt:del') &&
                !audit &&
                userInfo.id === record.createdId &&
                (+record.receiptStatus === 3 || +record.receiptStatus === 9)
              "
            >
              <a-divider type="vertical" />
              <a class="delete" @click="() => del(record)">删除</a>
            </template>
            <template v-if="!audit && record.receiptStatus === 1">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template> -->
          </span>

          <a-table
            slot="expandedRowRender"
            slot-scope="record, index, indent, expanded"
            :columns="innerColumns"
            :dataSource="record.deviceInfoVoList"
            :pagination="false"
            size="small"
          >
            <div slot="order" slot-scope="text, record, index">
              <span>{{ index + 1 }}</span>
            </div>

            <div slot="isWarranty" slot-scope="text, record">
              <span v-if="text === 0">否</span>
              <span v-if="text === 1" style="color：red;">是</span>
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
    <!-- <InvestigateNode ref="node" />-->
    <!-- <FormAdd ref="formadd" @filet="searchAction"></FormAdd> -->
    <ApproveInfo ref="approveInfoCard" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
// import FormAdd from './FormAdd'
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
    align: 'center',
    title: '物料代码',
    dataIndex: 'mainBoardNo',
    key: 'mainBoardNo',
    width: '200px',
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '200px',
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'orgName',
    key: 'orgName',
    width: '120px',
  },
  {
    align: 'center',
    title: '单位',
    dataIndex: 'villageName',
    key: 'villageName',
    width: '100px',
    // scopedSlots: { customRender: 'paidType' },
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'deviceLocation',
    key: 'deviceLocation',
    width: '120px',
  },
  {
    align: 'center',
    title: '单价（元）',
    dataIndex: 'deviceLocation',
    key: 'deviceLocation',
    width: '120px',
  },
  {
    align: 'center',
    title: '金额（元）',
    dataIndex: 'deviceLocation',
    key: 'deviceLocation',
    width: '120px',
  },

  {
    align: 'center',
    title: '是否过保',
    dataIndex: 'isWarranty',
    key: 'isWarranty',
    scopedSlots: { customRender: 'isWarranty' },
    width: '120px',
  },
  {
    align: 'center',
    title: '带货方式',
    key: 'problemDescription',
    dataIndex: 'problemDescription',
    scopedSlots: { customRender: 'problemDescription' },
    width: '120px',
  },
]
export default {
  name: 'ReceiptList',
  components: {
    // Tendering,
    // InvestigateNode,
    // ReceiptAdd,
    STable,
    ApproveInfo,
    // FormAdd,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: {
        searchStatus: 0,
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
        },
        {
          title: '机构名称',
          dataIndex: 'orgName',
          width: 100,
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
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('开始加载数据', JSON.stringify(this.queryParam))
        return accessoriesManagementPage(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
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
      console.log(key)
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

<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-select v-model="queryParam.taskType" allowClear style="width: 150px" placeholder="任务单类型">
            <a-select-option :value="1"> 维修任务单</a-select-option>
            <a-select-option :value="2">产品调试任务单</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input style="width: 150px" placeholder="任务单编号模糊查询" allowClear v-model="queryParam.taskNum" />
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.saleUserId" allowClear style="width: 150px" placeholder="销售负责人">
            <a-select-option v-for="item in personincharge" :key="item.id" :value="item.id">{{
              item.trueName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="客户名称/机构名称"
            style="width: 150px"
            allowClear
            v-model="queryParam.orgNameOrCustomerName"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder="联系人/联系人电话模糊查询"
            style="width: 150px"
            allowClear
            v-model="queryParam.linkmanOrContactNumber"
          />
        </a-form-item>
        <a-form-item>
          <a-input placeholder="主板号模糊查询" allowClear style="width: 150px" v-model="queryParam.mainBoardNo" />
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.source" allowClear style="width: 150px" placeholder="来源">
            <a-select-option :value="1">400售后电话</a-select-option>
            <a-select-option :value="2">客户反馈</a-select-option>
            <a-select-option :value="3">第三方反馈</a-select-option>
            <a-select-option :value="4">销售部</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.isWarranty" allowClear style="width: 150px" placeholder="是否过保">
            <a-select-option :value="0">否</a-select-option>
            <a-select-option :value="1">是</a-select-option>
          </a-select>
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
            <template>
              <a-tab-pane key="2">
                <span slot="tab"> 进行中 ( {{ Totalmessages.ongoingNum || 0 }} ) </span>
              </a-tab-pane>
              <a-tab-pane key="4">
                <span slot="tab"> 已完结 ( {{ Totalmessages.endNum || 0 }} ) </span>
              </a-tab-pane>
              <a-tab-pane key="0">
                <span slot="tab"> 全部 ( {{ Totalmessages.allNum || 0 }} ) </span>
              </a-tab-pane>
            </template>
            <!-- <a-tab-pane tab="进行中" key="2"> </a-tab-pane>
            <a-tab-pane tab="已完结" key="4"> </a-tab-pane>
            <a-tab-pane tab="全部" key="0"> </a-tab-pane> -->
          </a-tabs>
        </div>
        <a-table
          v-if="queryParam.taskDetailStatus !== '4'"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :expandedRowKeys="expandedRowKeys"
          @expand="expandHandler"
        >
          <span slot="taskType" slot-scope="text, record">
            <span> {{ { 1: '维修任务单', 2: '产品调试任务单' }[text] || '未知' }}</span>
          </span>
          <span slot="source" slot-scope="text, record">
            <span> {{ { 1: '400售后电话', 2: '客户反馈', 3: '第三方反馈', 4: '销售部' }[text] || '未知' }}</span>
          </span>
          <div slot="taskStatus" slot-scope="text, record">
            <a @click="handleClick(record)">{{
              { 0: '待提交', 1: '待派工', 2: '待处理', 3: '已处理', 4: '已完结', 5: '驳回' }[text] || '未知'
            }}</a>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="queryParam.taskDetailStatus === '2'">
              <template v-if="record.taskStatus === 2">
                <a @click="handleAdd('veiw', record)">详情</a>
                <a-divider type="vertical" />
                <a @click="handleAdd('handle', record)">处理</a>
              </template>
              <template v-if="record.taskStatus === 3">
                <a @click="handleAdd('veiw', record)">详情</a>
              </template>
              <template>
                <a-divider type="vertical" />
                <a @click="apply('add', null)">申请客诉</a>
              </template>
              <template v-if="record.taskStatus === 3 && record.serviceMode === 0">
                <a-divider type="vertical" />
                <a @click="end(record)">完结</a>
              </template>
              <template v-if="record.taskStatus === 3 && record.serviceMode === 1">
                <a-divider type="vertical" />
                <a v-download="record.acceptanceUrl">验收单下载</a>
                <a-divider type="vertical" />
                <a @click="checkAdd('add', record)">验收单</a>
              </template>
              <template v-if="record.taskStatus === 3 && record.serviceType === 1">
                <a-divider type="vertical" />
                <a @click="Payment('add', record)">申请付款</a>
              </template>
              <template v-if="record.taskStatus === 3">
                <a-divider type="vertical" />
                <a @click="partsAdd('add', record)">配件申请</a>
              </template>
            </template>
            <template v-if="queryParam.taskDetailStatus === null">
              <a @click="handleAdd('veiw', record)">详情</a>
            </template>
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
        <a-table
          v-if="queryParam.taskDetailStatus === '4'"
          :columns="columns1"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :expandedRowKeys="expandedRowKeys"
          @expand="expandHandler"
        >
          <span slot="taskType" slot-scope="text, record">
            <span> {{ { 1: '维修任务单', 2: '产品调试任务单' }[text] || '未知' }}</span>
          </span>
          <span slot="source" slot-scope="text, record">
            <span> {{ { 1: '400售后电话', 2: '客户反馈', 3: '第三方反馈', 4: '销售部' }[text] || '未知' }}</span>
          </span>
          <div slot="taskStatus" slot-scope="text, record">
            <a @click="handleClick(record)">{{
              { 0: '待提交', 1: '待派工', 2: '待处理', 3: '已处理', 4: '已完结', 5: '驳回' }[text] || '未知'
            }}</a>
          </div>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleAdd('veiw', record)">详情</a>
            </template>
            <template v-if="record.serviceType === 1">
              <a-divider type="vertical" />
              <a @click="Payment('add', record)">申请付款</a>
            </template>
            <template>
              <a-divider type="vertical" />
              <a @click="checkAdd('add', record)">验收单</a>
            </template>
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
    <ActionForm ref="actionForm" @finish="() => searchAction()" />
    <FormAdd ref="formadd" @filet="searchAction"></FormAdd>
    <Application ref="application" @filet="searchAction"></Application>
    <PartsForm ref="partsForm" @filet="searchAction"></PartsForm>
    <Check ref="check" @filet="searchAction"></Check>
    <ApproveInfo ref="approveInfoCard" />
    <AfterVueOfAudit ref="afterVueOfAudit" @filet="searchAction"></AfterVueOfAudit>
    <Approval ref="approval" @opinionChange="searchAction" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import FormAdd from './FormAdd'
import Application from './application'
import PartsForm from './partsForm'
import Check from './check'
import ActionForm from '../../exception/ActionForm'
import { listUserBySale } from '@/api/systemSetting' //销售人员
import Approval from './Approval'
import AfterVueOfAudit from './mode/AfterVueOfAudit'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import {
  taskDocumentStatusNum,
  taskDocumentPage,
  revocationTaskDocument,
  submitTaskDocument,
  againDispatchTaskDocument,
  finishTaskDocument,
} from '@/api/after-sales-management'
const innerColumns = [
  {
    align: 'center',
    title: '序号',
    width: '80px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '主板号',
    dataIndex: 'mainBoardNo',
    key: 'mainBoardNo',
    width: '200px',
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '200px',
  },
  {
    align: 'center',
    title: '机构',
    dataIndex: 'orgName',
    key: 'orgName',
    width: '120px',
  },
  {
    align: 'center',
    title: '小区',
    dataIndex: 'villageName',
    key: 'villageName',
    width: '100px',
    scopedSlots: { customRender: 'paidType' },
  },
  {
    align: 'center',
    title: '地址',
    dataIndex: 'deviceLocation',
    key: 'deviceLocation',
    // scopedSlots: { customRender: 'freightCharge' },
    width: '120px',
  },
  {
    align: 'center',
    title: '问题描述',
    key: 'problemDescription',
    dataIndex: 'problemDescription',
    scopedSlots: { customRender: 'problemDescription' },
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
]
// 表头
const columns = [
  {
    title: '任务单类型',
    dataIndex: 'taskType',
    scopedSlots: { customRender: 'taskType' },
  },
  {
    title: '任务单编号',
    dataIndex: 'taskNum',
  },
  {
    title: '来源',
    dataIndex: 'source',
    scopedSlots: { customRender: 'source' },
    width: '200px',
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
    title: '联系人',
    dataIndex: 'linkman',
  },
  {
    title: '联系人电话',
    dataIndex: 'contactNumber',
  },
  {
    title: '状态',
    dataIndex: 'taskStatus',
    scopedSlots: { customRender: 'taskStatus' },
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
]
const columns1 = [
  {
    title: '任务单类型',
    dataIndex: 'taskType',
    scopedSlots: { customRender: 'taskType' },
  },
  {
    title: '任务单编号',
    dataIndex: 'taskNum',
  },
  {
    title: '来源',
    dataIndex: 'source',
    scopedSlots: { customRender: 'source' },
    width: '200px',
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
    title: '联系人',
    dataIndex: 'linkman',
  },
  {
    title: '联系人电话',
    dataIndex: 'contactNumber',
  },
  {
    title: '状态',
    dataIndex: 'taskStatus',
    scopedSlots: { customRender: 'taskStatus' },
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
    title: '完结时间',
    dataIndex: 'overTime',
  },
  {
    title: '操作',
    dataIndex: 'id',

    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'ReceiptList',
  components: {
    Approval,
    STable,
    ApproveInfo,
    FormAdd,
    AfterVueOfAudit,
    Application,
    PartsForm,
    Check,
    ActionForm,
  },
  data() {
    return {
      columns,
      columns1,
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: {
        taskDetailStatus: '2',
        myTask: 1,
      },
      recordResult: {},
      queryRecord: {},
      Totalmessages: {},
      contractState: 0,
      saleCustomer: 0,
      vueBoolean: this.$store.getters.vueBoolean,
      customerName: '',
      saleCustomers: [],
      personincharge: [],
      approveStatus: 0,
      audit: false,
      showFlag: true,

      innerColumns: innerColumns,
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('开始加载数据', JSON.stringify(this.queryParam))
        return taskDocumentPage(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],

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
        if (to.name === 'access_office_My-mission') {
          this.searchAction()
          listUserBySale().then((res) => (this.personincharge = res.data))
        }
      },
      immediate: true,
    },
  },
  methods: {
    searchCheck() {
      this.isExpanded = true
      this.searchAction()
    },
    apply(type, record) {
      let that = this
      that.$refs.actionForm.query(type, record)
    },
    noPassAction(type, record) {
      let that = this
      that.$refs.approval.query(type, record)
    },

    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination1 }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      taskDocumentPage(_searchParam)
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
      taskDocumentStatusNum(_searchParam).then((res) => {
        this.Totalmessages = res.data
      })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    paramClick(key) {
      if (key !== '0') {
        this.queryParam = { ...this.queryParam, taskDetailStatus: key }
      } else {
        this.queryParam = { ...this.queryParam, taskDetailStatus: null }
      }

      this.searchAction()
    },
    handleAdd(type, record) {
      if (record.taskType === 1) {
        this.$refs.formadd.query(type, record)
      } else {
        this.$refs.afterVueOfAudit.init(type, record)
      }
      // this.$refs.formadd.query(type, record)
    },

    Payment(type, record) {
      this.$refs.application.query(type, record)
    },
    partsAdd(type, record) {
      this.$refs.partsForm.query(type, record)
    },
    checkAdd(type, record) {
      this.$refs.check.query(type, record)
    },
    handleClick(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

    end(row) {
      const _this = this
      this.$confirm({
        title: '完结',
        content: `任务单[${row.taskNum}]服务方式为远程指导，是否更状态为完结！请确保此任务单已完成！`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用完结接口
          finishTaskDocument({ approveId: row.id, isAdopt: 1 }).then((res) => {
            if (res.code == 200) {
              _this.$message.info(res.msg)
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
      if (type === 'Reassignment') {
        againDispatchTaskDocument({ taskDocumentId: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
      if (type === 'reback') {
        revocationTaskDocument({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
      if (type === 'Document') {
        submitTaskDocument({ id: record.id }).then((res) => {
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

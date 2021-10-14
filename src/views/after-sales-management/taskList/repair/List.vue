<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
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
          <a-input
            placeholder="主板号模糊查询"
            allowClear
            style="width: 150px"
            v-model="queryParam.linkmanOrContactNumber"
          />
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
          <a-select v-model="queryParam.taskStatus" allowClear style="width: 150px" placeholder="状态">
            <a-select-option :value="0">待提交</a-select-option>
            <a-select-option :value="1">待派工</a-select-option>
            <a-select-option :value="2">待处理 </a-select-option>
            <a-select-option :value="3">已处理 </a-select-option>
            <a-select-option :value="4">已完结</a-select-option>
            <a-select-option :value="5">驳回</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <template>
            <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
          </template>
        </a-form-item>
        <div class="table-operator fl-r" v-if="$auth('repair:add')">
          <a-button type="primary" @click="handleAdd('add', null)" style="margin-left: 8px">
            新增 <a-icon type="plus" />
          </a-button>
        </div>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <a-table
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
              { 0: '待提交', 1: '待派工', 2: '待处理', 3: '已处理', 4: '已完结', 5: '驳回', 6: '完结' }[text] || '未知'
            }}</a>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('repair:veiw')">
              <a @click="handleAdd('veiw', record)">详情</a>
            </template>
            <template
              v-if="
                $auth('repair:edit') &&
                (+record.taskStatus === 0 || +record.taskStatus === 5) &&
                userInfo.id === record.createdId
              "
            >
              <a-divider type="vertical" />
              <a @click="handleAdd('edit-salary', record)">修改</a>
            </template>
            <template
              v-if="
                $auth('repair:del') &&
                !audit &&
                userInfo.id === record.createdId &&
                (+record.taskStatus === 0 || +record.taskStatus === 5)
              "
            >
              <a-divider type="vertical" />
              <a class="delete" @click="() => del(record)">删除</a>
            </template>
            <template
              v-if="
                $auth('repair:Document') &&
                !audit &&
                userInfo.id === record.createdId &&
                (+record.taskStatus === 0 || +record.taskStatus === 5)
              "
            >
              <a-divider type="vertical" />
              <a-popconfirm title="确认提交该条数据吗?" @confirm="() => doAction('Document', record)">
                <a type="primary" href="javascript:;">提交</a>
              </a-popconfirm>
            </template>
            <template v-if="$auth('repair:reback') && !audit && record.taskStatus === 1">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
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
    <!-- <InvestigateNode ref="node" />-->
    <FormAdd ref="formadd" @filet="searchAction"></FormAdd>
    <ApproveInfo ref="approveInfoCard" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import FormAdd from './FormAdd'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import { listUserBySale } from '@/api/systemSetting' //销售人员
import {
  taskDocumentPage,
  revocationTaskDocument,
  delTaskDocument,
  submitTaskDocument,
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
export default {
  name: 'ReceiptList',
  components: {
    // Tendering,
    // InvestigateNode,
    // ReceiptAdd,
    STable,
    ApproveInfo,
    FormAdd,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      // 查询参数
      queryParam: {
        taskType: 1,
      },
      personincharge: [],
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
      ],
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
        if (to.name === 'access_office_repair') {
          this.searchAction()
          listUserBySale().then((res) => (this.personincharge = res.data))
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
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    handleAdd(type, record) {
      this.$refs.formadd.query(type, record)
    },

    handleClick(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },

    del(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除编号为: ${row.taskNum} 的维修单吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          delTaskDocument({ id: row.id }).then((res) => {
            if (res.code == 200) {
              that.$message.info(res.msg)
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

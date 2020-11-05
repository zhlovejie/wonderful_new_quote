<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form class="search-from-wrapper" layout="inline" :form="form">
        <a-form-item label="项目名称">
          <a-input v-model="projectName" />
        </a-form-item>
        <a-form-item>
          <CustomerSelect
            ref="customerSelect"
            :options="customerSelectOptions"
            @selected="handleCustomerSelected"
            @inputClear="handleCustomerClear"
          />
        </a-form-item>
        <!-- <a-form-item label="投标单位名称">
          <a-select
            class="a-select"
            style="width: 150px"
            showSearch
            optionFilterProp="children"
            :filterOption="filterCustomerOption"
            v-model="saleCustomer"
            defaultValue="0">devision-management
            <a-select-option :value="0">请选择单位</a-select-option>
            <a-select-option v-for="val in saleCustomers" :key="val.id" :value="val.id">{{ val.name }}</a-select-option>
          </a-select>
        </a-form-item>-->
        <a-form-item label="授权合同状态">
          <a-select style="width: 150px" v-model="contractState" defaultValue="0">
            <a-select-option v-for="val in contractStatus" :key="val.id" :value="val.id">{{
              val.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <template v-if="$auth('investigate:list')">
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item>
      </a-form>
      <div class="operator-wrapper">
        <template v-if="$auth('investigate:add')">
          <!-- <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button> -->

          <a-dropdown>
            <a-menu slot="overlay" @click="handleMenuClick">
              <a-menu-item key="1">公司模板</a-menu-item>
              <a-menu-item key="2">指定模板</a-menu-item>
            </a-menu>
            <a-button type="primary"> 新增 <a-icon type="down" /> </a-button>
          </a-dropdown>
        </template>
      </div>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="全部" key="0" forceRender></a-tab-pane>

            <template v-if="$auth('investigate:approval')">
              <a-tab-pane tab="待审批" key="1"></a-tab-pane>
              <a-tab-pane tab="已审批" key="2"></a-tab-pane>
            </template>
          </a-tabs>
        </div>
        <s-table rowKey="id" ref="table" size="default" :columns="columns" :data="loadData" :alert="false">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="projectCode" slot-scope="text, record">
            <a @click="handleVue(record)">{{ text }}</a>
          </span>
          <span slot="modifyTime" slot-scope="text, record">
            {{ record.modifyTime || record.createdTime }}
          </span>

          <span slot="saleCustomerName" slot-scope="text, record">
            <a @click="tenderingClick(record)">{{ text }}</a>
          </span>
          <div slot="contractStatus" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
          </div>
          <div slot="states" slot-scope="text, record">
            <a @click="handleClick(record)" >{{ {1:'待审批',2:'通过',3:'不通过',9:'已撤回'}[text] }}</a>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="+approvalStatus === 0">
              <a @click="handleVue(record)">查看</a>

              <template v-if="record.approvalStatus == 2">
                <a-divider type="vertical" />
                <a target="_blank" :href="record.wordUrl">下载</a>
              </template>

              <template v-if="$auth('investigate:edit') && [3,9].includes(+record.approvalStatus)">
                <a-divider type="vertical" />
                <a @click="updateProject(record)">修改</a>
              </template>

              <template v-if="$auth('investigate:del') && record.approvalStatus == 2 && userInfo.id == record.createdId ">
                <a-divider type="vertical" />
                <a @click="() => del(record)">删除</a>
              </template>

              <template v-if="+record.approvalStatus === 1">
                <a-divider type="vertical"/>
                <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback',record)">
                  <a type="primary" href="javascript:;">撤回</a>
                </a-popconfirm>
              </template>

            </template>

            <template v-if="+approvalStatus === 1">
              <a @click="handleAudit(record)">审批</a>
            </template>

            <template v-if="+approvalStatus === 2">
              <a @click="handleVue(record)">查看</a>
            </template>

          </span>
        </s-table>
      </a-col>
    </a-row>
    <investigate-form ref="modal" @ok="handleSaveOk" @close="handleSaveClose"></investigate-form>
    <Tendering ref="tenderingModel"></Tendering>
    <InvestigateNode ref="node" />
    <InvestigateVue ref="investigateVue" />
    <InvestigateAudit ref="investigateAudit" @ok="handleAuditOk" @close="handleAuditClose" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { customerList, deleteInvestigate, getServiceList, goAdd ,investigateRevocation} from '@/api/investigate'
import InvestigateForm from './InvestigateAdd'
import Tendering from './TenderingUnit'
import InvestigateNode from './InvestigateNode'
import InvestigateVue from './InvestigateVue'
import InvestigateAudit from './InvestigateAudit'
import CustomerSelect from '@/components/CustomerList/CustomerSelect'

const statusMap = {
  2: {
    status: 'success',
    text: '已授权',
  },
  1: {
    status: 'error',
    text: '待授权',
  },
}

export default {
  name: 'InvestigateList',
  components: {
    InvestigateAudit,
    InvestigateVue,
    InvestigateNode,
    Tendering,
    InvestigateForm,
    STable,
    CustomerSelect,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo, // 当前登录人
      // 查询参数
      queryParam: {},
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      approvalStatus: 0,
      saleCustomer: 0,
      projectName: '',
      vueBoolean: this.$store.getters.vueBoolean,
      isLook: 0,
      saleCustomers: [],
      contractStatus: [
        {
          id: 0,
          name: '请选择状态',
        },
        {
          id: 1,
          name: '待授权',
        },
        {
          id: 2,
          name: '已授权',
        },
      ],
      // 表头
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '授权编号',
          dataIndex: 'authorizationCode',
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          // key: 'title',
          scopedSlots: { customRender: 'projectCode' },
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
        },
        {
          title: '招标单位名称',
          dataIndex: 'tenderingUnitName',
          scopedSlots: { customRender: 'tenderingUnitName' },
        },
        {
          title: '被授权单位名称',
          dataIndex: 'saleCustomerName',
          scopedSlots: { customRender: 'saleCustomerName' },
        },
        {
          title: '授权合同状态',
          dataIndex: 'contractStatus',
          scopedSlots: { customRender: 'contractStatus' },
        },
        {
          title: '审批进度',
          dataIndex: 'approvalStatus',
          scopedSlots: { customRender: 'states' },
        },
        {
          title: '操作人',
          dataIndex: 'modifierName',
        },
        {
          title: '操作时间',
          dataIndex: 'modifyTime',
          scopedSlots: { customRender: 'modifyTime' },
        },
        {
          title: '操作',
          dataIndex: 'id',
          width: '200px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getServiceList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      mounted() {},
      selectedRowKeys: [],
      selectedRows: [],
      customerSelectOptions: {
        showInputLabel: true,
        wrapperStyle: {},
        formLayout: 'horizontal',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired: false,
        inputAllowClear: true,
        inputLabel: '被授权单位名称',
        inputPlaceholder: '被授权单位名称',
      },
    }
  },
  beforeCreate() {
    // customerList().then((res) => {
    //   this.saleCustomers = res.data
    // })
  },
  filters: {
    // 过滤器,处理状态
    statusFilter(status) {
      return statusMap[status].text
    },
    statusTypeFilter(status) {
      return statusMap[status].status
    },
  },
  watch: {
    $route(to, from) {
      if (from.fullPath === '/sale/receipt/ReceiptAdd' || from.fullPath === '/sale/receipt/ReceiptAudit') {
        this.$refs.table.refresh(true)
      }
    },
  },
  methods: {
    search() {
      this.queryParam = {
        projectName: this.projectName,
        contractStatus: this.contractState,
        saleCustomerId: this.saleCustomer,
        approvalStatus: this.approvalStatus,
      }
      this.$refs.table.refresh(true)
    },
    handleAdd(type) {
      // goAdd().then(res => {

      // })
      this.$refs.modal.actionType = 'add'
      this.$refs.modal.templateType = type
      this.$refs.modal.edit({})
    },
    updateProject(record) {
      // goAdd().then(res => {

      // })
      this.$refs.modal.actionType = 'edit'
      this.$refs.modal.templateType = record.templateType
      this.$refs.modal.projectRecord = record
      this.$refs.modal.edit({})
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleClick(record) {
      this.$refs.node.query(record)
      // this.$refs.table.refresh(true)
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
    handleSaveClose() {},
    del(row) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除编号为: ${row.projectCode} 的备案吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          deleteInvestigate({ id: row.id }).then((res) => {
            _this.$refs.table.refresh(false)
          })
        },
      })
    },
    tenderingClick(record) {
      const data = { id: record.saleCustomerId }
      this.$refs.tenderingModel.look(data)
    },
    paramClick(key) {
      this.queryParam = { approvalStatus: key }
      this.approvalStatus = key
      if (key == 1) {
        this.isLook = 1
      } else if (key == 0) {
        this.isLook = 0
      } else if (key == 2) {
        this.isLook = 2
      }
      this.$refs.table.refresh(true)
    },
    handleVue(e) {
      this.$refs.investigateVue.qure(e)
    },
    handleAudit(e) {
      this.$refs.investigateAudit.qure(e)
    },
    handleAuditOk() {
      this.$refs.table.refresh(false)
    },
    handleAuditClose() {
      this.$refs.table.refresh(false)
    },
    filterCustomerOption(input, option) {
      // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // option.componentOptions.children[0].text   结果是"郑州依依不舍"
    },
    handleCustomerSelected(item) {
      this.saleCustomer = item.id
    },
    handleCustomerClear() {
      this.saleCustomer = 0
    },
    handleMenuClick(e) {
      this.handleAdd(parseInt(e.key, 10))
    },
    doAction(type,record){
      let that = this
      if(type === 'reback'){
        investigateRevocation({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.search()
        })
        return
      }
    }
  },
}
</script>

<style scoped>
.top-ation {
  display: -webkit-flex;
  display: flex;
}
.top-ation .search-from-wrapper {
  flex: 1;
}
.top-ation .operator-wrapper {
  line-height: 39.999px;
}

.top-ation .a-input {
  width: 160px;
  margin: 0 8px 8px 0;
}

.a-select {
  margin-right: 8px;
}

.a-button {
  margin-right: 8px;
}

.fl-r {
  float: right;
}

.develop-wrap {
  background-color: #fff;
  padding: 12px;
}
</style>

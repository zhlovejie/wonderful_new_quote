<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item label="客户名称">
          <a-input v-model="customerName" />
        </a-form-item>
        <a-form-item label="单据状态" v-show="showFlag">
          <a-select v-model="approveStatus" style="width: 150px">
            <a-select-option :value="0">请选择审批状态</a-select-option>
            <a-select-option :value="1">待审批</a-select-option>
            <a-select-option :value="2">通过</a-select-option>
            <a-select-option :value="3">不通过</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <template v-if="$auth('advances:list')">
            <a-button class="a-button" type="primary" icon="search" @click="search">查询</a-button>
          </template>
        </a-form-item>
        <div class="table-operator fl-r">
          <template v-if="$auth('advances:add')">
            <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
          </template>
        </div>
      </a-form>
    </div>
    <a-row>
      <a-col>
        <div>
          <a-tabs defaultActiveKey="0" @change="paramClick">
            <a-tab-pane tab="全部" key="0" forceRender> </a-tab-pane>

            <template v-if="$auth('advances:approval')">
              <a-tab-pane tab="待审批" key="4"> </a-tab-pane>
              <a-tab-pane tab="已审批" key="5"> </a-tab-pane>
            </template>
          </a-tabs>
        </div>
        <s-table
          style="margin-bottom: 24px"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="false"
          :pagination="pagination"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <span slot="advancesCode" slot-scope="text, record">
            <a @click="handleVue(record)">{{ text }}</a>
          </span>
          <span slot="contractNum" slot-scope="text, record">
            <a @click="tenderingClick(record)">{{ text }}</a>
          </span>
          <span slot="customerName" slot-scope="text, record">
            <a @click="tenderingClick(record)">{{ text }}</a>
          </span>
          <div slot="moneyType" slot-scope="text, record">
            <span v-if="text == 1">公户</span>
            <span v-if="text == 2">银行卡</span>
            <span v-if="text == 3">微信</span>
            <span v-if="text == 4">支付宝</span>
          </div>
          <div slot="advancesStatus" slot-scope="text, record">
            <a @click="handleClick(record)" v-if="+text === 1">待审批</a>
            <a @click="handleClick(record)" v-if="+text === 2">通过</a>
            <a @click="handleClick(record)" v-if="+text === 3">不通过</a>
            <a @click="handleClick(record)" v-if="+text === 9">已撤回</a>
          </div>
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('advances:one')">
              <a @click="handleVue(record)">查看</a>
            </template>
            <template v-if="$auth('advances:edit') && audit">
              <a-divider type="vertical" />
              <a @click="handleAudit(record)">审核</a>
            </template>
            <template
              v-if="$auth('advances:del') && !audit && userInfo.id === record.createdId && +record.advancesStatus === 2"
            >
              <a-divider type="vertical" />
              <a class="delete" @click="() => del(record)">删除</a>
            </template>
            <template
              v-if="
                $auth('advances:edit') &&
                (+record.advancesStatus === 3 || +record.advancesStatus === 9) &&
                userInfo.id === record.createdId
              "
            >
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">重新提交</a>
            </template>
            <template v-if="!audit && +record.advancesStatus === 1">
              <a-divider type="vertical" />
              <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback', record)">
                <a type="primary" href="javascript:;">撤回</a>
              </a-popconfirm>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
    <advances-add ref="add" @ok="handleSaveOk" @close="handleSaveClose"></advances-add>
    <advances-vue ref="advancesVue" @ok="handleSaveOk" @close="handleSaveClose"></advances-vue>
    <advances-audit ref="advanceAudit" @ok="handleAuditOk" @close="handleSaveClose"></advances-audit>
    <Tendering ref="tendering"></Tendering>
    <InvestigateNode ref="node"></InvestigateNode>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getServiceList, deleteById, revocationAdvances } from '@/api/advances'
import InvestigateNode from '../record/InvestigateNode'
import Tendering from '../record/TenderingUnit'
import AdvancesAdd from './AdvancesAdd'
import AdvancesVue from './AdvancesVue'
import AdvancesAudit from './AdvancesAudit'

export default {
  name: 'AdvancesList',
  components: {
    AdvancesAudit,
    AdvancesVue,
    AdvancesAdd,
    Tendering,
    InvestigateNode,
    STable,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      // 查询参数
      pagination: {
        showTotal: (total) => '共' + total + '条数据',
      },
      userInfo: this.$store.getters.userInfo,
      queryParam: {},
      recordResult: {},
      queryRecord: {},
      contractState: 0,
      vueBoolean: this.$store.getters.vueBoolean,
      saleCustomer: 0,
      customerName: '',
      saleCustomers: [],
      audit: false,
      showFlag: true,
      approveStatus: 0,
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
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '收款编号',
          dataIndex: 'advancesCode',
          // key: 'title',
          scopedSlots: { customRender: 'advancesCode' },
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'customerName' },
        },
        {
          title: '收款日期',
          dataIndex: 'receiptTime',
        },
        {
          title: '结算方式',
          dataIndex: 'bankName',
        },
        {
          title: '本次实收金额',
          dataIndex: 'paidMoney',
        },
        {
          title: '单据状态',
          dataIndex: 'advancesStatus',
          scopedSlots: { customRender: 'advancesStatus' },
        },
        {
          title: '申请人',
          dataIndex: 'createdName',
        },
        {
          title: '申请时间',
          dataIndex: 'createdTime',
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
        console.log('开始加载数据', JSON.stringify(this.queryParam))
        return getServiceList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res
        })
      },
      mounted() {},
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  methods: {
    search() {
      this.queryParam = {
        customerName: this.customerName,
        statue: this.contractState,
      }
      if (this.showFlag) {
        this.queryParam['approveStatus'] = this.approveStatus
      }
      this.$refs.table.refresh(true)
    },
    handleAdd() {
      this.$refs.add.add()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleClick(record) {
      console.log('JSON.stringify(record) :' + JSON.stringify(record))
      this.$refs.node.query(record)
      // this.$refs.table.refresh(true)
    },
    handleSaveOk() {
      console.log('handleSaveOk')
      this.$refs.table.refresh(true)
    },
    handleSaveClose() {
      this.$refs.table.refresh(true)
    },
    del(row) {
      const _this = this
      console.log(JSON.stringify(row))
      this.$confirm({
        title: '警告',
        content: `真的要删除编号为: ${row.advancesCode} 的收款单吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          deleteById({ id: row.id }).then((res) => {
            if (res.code === 200) {
              _this.$refs.table.refresh(true)
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
    tenderingClick(record) {
      console.log('record' + JSON.stringify(record))
      const data = { id: record.saleCustomerId }
      this.$refs.tendering.look(data)
    },
    paramClick(key) {
      if (key == 0) {
        this.showFlag = true
      } else {
        this.showFlag = false
      }

      if (parseInt(key) === 4) {
        this.audit = true
      } else {
        this.audit = false
      }
      this.contractState = key
      this.queryParam = { statue: key }
      this.$refs.table.refresh(true)
      console.log(key)
    },
    handleVue(e) {
      console.log(JSON.stringify(e))
      this.$refs.advancesVue.detail(e.id)
    },
    handleAudit(e) {
      console.log('handleAudit')
      if (this.userInfo.id === 1 || this.userInfo.id === 52) {
        this.$message.info('你没有审批权限，不可以审批')
        return
      }
      this.$refs.advanceAudit.detail(e.id)
    },
    handleAuditOk() {
      console.log('handleAuditOk')
      this.$refs.table.refresh(true)
    },
    handleAuditClose() {
      console.log('handleAuditClose')
      this.$refs.table.refresh(true)
    },
    handleEdit(e) {
      //this.$refs.advanceAudit.detail(e.id,'edit')

      this.$refs.add.add(e.id, 'edit')
    },
    doAction(type, record) {
      let that = this
      if (type === 'reback') {
        revocationAdvances({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.search()
        })
        return
      }
    },
  },
}
</script>

<style scoped>
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

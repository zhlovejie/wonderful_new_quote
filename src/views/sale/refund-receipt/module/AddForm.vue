<template>
  <a-modal :title="modalTitle" :width="1000" :visible="visible" @cancel="handleCancel" :maskClosable="false">
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>单据编号</td>
            <td colspan="2">
              <a-form-item>
                <a-input disabled v-decorator="['refundNum']" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['id']" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['instanceId']" />
              </a-form-item>
            </td>
            <td>退款类型</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  placeholder="选择退款类型"
                  :disabled="isDisabled"
                  v-decorator="['refundType', { rules: [{ required: true, message: '选择退款类型' }] }]"
                >
                  <a-select-option :value="1">代理保证金</a-select-option>
                  <a-select-option :value="2">投标保证金</a-select-option>
                  <a-select-option :value="3">退货款</a-select-option>
                  <a-select-option :value="4">其他</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>合同编号</td>
            <td colspan="2">
              <a-form-item>
                <a-input
                  read-only
                  :disabled="isDisabled"
                  :allowClear="true"
                  @change="handlerChange('contract', $event)"
                  placeholder="单击选择合同"
                  @click="openModel"
                  v-decorator="['contractNum', { rules: [{ required: false, message: '请选择合同' }] }]"
                />
              </a-form-item>
              <a-form-item hidden>
                <!-- <a-input v-decorator="['contractNum']" /> -->
                <a-input v-model="contractId" />
              </a-form-item>
            </td>
            <td>客户名称</td>
            <td colspan="2">
              <a-form-item>
                <a-input
                  placeholder="客户名称"
                  :allowClear="true"
                  @change="handlerChange('saleCustomerName', $event)"
                  v-decorator="['saleCustomerName', { rules: [{ required: true, message: '输入客户名称' }] }]"
                  read-only
                  :disabled="selectContract || isDisabled"
                  @click="openSystemUsers('saleCustomerName')"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>客户姓名</td>
            <td colspan="2">
              <a-form-item>
                <a-input
                  placeholder="客户姓名"
                  :allowClear="true"
                  :disabled="isDisabled"
                  v-decorator="['customerName', { rules: [{ required: true, message: '输入客户姓名' }] }]"
                />
              </a-form-item>
            </td>
            <td>联系方式</td>
            <td colspan="2">
              <a-form-item>
                <a-input
                  placeholder="联系方式"
                  :allowClear="true"
                  :disabled="isDisabled"
                  v-decorator="['customerTel', { rules: [{ required: true, message: '输入联系方式' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>收款单</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  mode="multiple"
                  placeholder="选择收款单"
                  :allowClear="true"
                  :disabled="isDisabled"
                  v-decorator="['receiptNum', { rules: [{ required: selectContract, message: '选择收款单' }] }]"
                >
                  <a-select-option
                    v-for="item in contractReceiptList"
                    :value="item.receiptCode"
                    :key="item.receiptCode"
                    >{{ item.receiptCode }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </td>
            <td>退款方式</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  placeholder="选择退款方式"
                  :disabled="isDisabled"
                  v-decorator="[
                    'refundMethod',
                    { initialValue: 1, rules: [{ required: true, message: '选择退款方式' }] },
                  ]"
                >
                  <a-select-option :value="1">公户退款</a-select-option>
                  <a-select-option :value="2">私户退款</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>退款总金额</td>
            <td colspan="2">
              <a-form-item>
                <a-input-number
                  style="width: 100%"
                  :disabled="isDisabled"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="['refundAmountMoney', { rules: [{ required: true, message: '请输入退款总金额' }] }]"
                  @change="refundAmountMoneyChange"
                />
              </a-form-item>
            </td>
            <td>大写</td>
            <td colspan="2">{{ refundAmountMoneyChinese }}</td>
          </tr>
          <tr>
            <td>币种</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  placeholder="选择币种"
                  :disabled="isDisabled"
                  v-decorator="['moneyType', { initialValue: 1, rules: [{ required: true, message: '选择币种' }] }]"
                >
                  <a-select-option :value="1">人民币</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>开户行及账号</td>
            <td colspan="2">
              <a-form-item>
                <a-input
                  placeholder="开户行及账号"
                  :disabled="isDisabled"
                  v-decorator="['account', { rules: [{ required: true, message: '输入开户行及账号' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>对应销售</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  optionFilterProp="children"
                  showSearch
                  :allowClear="true"
                  :disabled="isDisabled"
                  :filterOption="filterSalersOption"
                  placeholder="请选择销售人员"
                  v-decorator="['saleUserId', { rules: [{ required: true, message: '请选择销售人员' }] }]"
                >
                  <a-select-option v-for="item in saleUser" :value="item.userId" :key="item.userId">{{
                    item.salesmanName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>退款原因</td>
            <td colspan="2">
              <a-form-item>
                <a-select
                  placeholder="选择退款原因"
                  :disabled="isDisabled"
                  v-decorator="['refundReason', { rules: [{ required: true, message: '选择退款原因' }] }]"
                >
                  <a-select-option :value="1">代理保证金</a-select-option>
                  <a-select-option :value="2">投标保证金</a-select-option>
                  <a-select-option :value="3">退货款</a-select-option>
                  <a-select-option :value="4">其他</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="5">
              <a-form-item>
                <a-textarea
                  placeholder="备注"
                  :disabled="isDisabled"
                  :rows="2"
                  v-decorator="['remarks', { rules: [{ required: false, message: '备注' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>预收款金额</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width: 100%"
                  :disabled="!(isApproval && taskFlag === 1)"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="[
                    'advanceReceiptAmount',
                    { rules: [{ required: isApproval && taskFlag === 1, message: '请输入预收款金额' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>已开票金额</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width: 100%"
                  :disabled="!(isApproval && taskFlag === 1)"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="[
                    'alreadyPaperAmount',
                    { rules: [{ required: isApproval && taskFlag === 1, message: '请输入已开票金额' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>已收税金金额</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width: 100%"
                  :disabled="!(isApproval && taskFlag === 1)"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="[
                    'alreadyTaxAmount',
                    { rules: [{ required: isApproval && taskFlag === 1, message: '请输入已收税金金额' }] },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
      <CustomerList ref="customerList" @selected="customerSelected" />
      <ReceiptSaleContract ref="receiptContract" @onSelect="contractChange" />
    </a-spin>
  </a-modal>
</template>

<script>
//退款单接口
import {
  refundDetail,
  refundSaveOrUpdate,
  refundApproval,
  refundGetApprovedSaleContract,
  refundGetSaleContractReceipt,
} from '@/api/receipt'
//销售人员接口
import { getListSaleContractUser } from '@/api/contractListManagement'
//数字转大写接口
import { turnTheCapital } from '@/api/contractListManagement'
import moment from 'moment'
import Approval from './Approval'
//客户列表选择
import CustomerList from '@/components/CustomerList/CustomerList'
//合同列表选择
import ReceiptSaleContract from './ContractSelect'

export default {
  name: 'AddForm',
  components: {
    Approval,
    CustomerList,
    ReceiptSaleContract,
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_refund-receipt_form' }),
      visible: false,
      actionType: 'add',
      opinion: '', //审批意见
      spinning: false,
      refundAmountMoneyChinese: '零',
      saleUser: [],
      contractReceiptList: [], //合同关联的收款单
      contractId: undefined, //合同编号 单独处理 控制依赖
      taskFlag: 0, //1为财务总账会计
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}退款单`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
    selectContract() {
      return this.contractId ? true : false
    },
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let task1 = getListSaleContractUser().then((res) => (that.saleUser = res.data))
      return Promise.all([task1])
    },
    async handleOk() {
      //debugger
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }

          if (values.refundType === 3 && values.contractNum === undefined) {
            return that.$message.error('请选择合同编号')
          }
          values.contractId = that.contractId
          //values.contractNum = that.contractNum || undefined
          if (values.receiptNum) {
            values.receiptNum = values.receiptNum.join(',')
          }

          //提交
          that.spinning = true
          refundSaveOrUpdate(values)
            .then((res) => {
              that.spinning = false
              console.log(res)
              if (res.code === 200) {
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              } else {
                that.$message.info(res.msg)
              }
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      //debugger
      console.log(arguments)

      let that = this
      that.resetData()
      that.actionType = type
      that.record = record || {}

      that.form.resetFields()
      await that.init()
      that.visible = true

      if (that.isAdd) {
        return
      }

      //填充数据
      let _param = {
        refundId: that.record.id,
      }
      const _detail = await refundDetail(_param).then((res) => res.data)
      that.taskFlag = _detail.taskFlag || 0
      let taskQueue = []
      taskQueue.push(that.refundAmountMoneyChange(_detail.refundAmountMoney || 0))
      if (_detail.contractId) {
        taskQueue.push(that.fillSaleContractReceipt(_detail.contractId))
      }
      await Promise.all(taskQueue)
      if (_detail.receiptNum) {
        _detail.receiptNum = _detail.receiptNum.split(',')
      }
      that.form.setFieldsValue(_detail)
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      refundApproval(values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(opt = {}) {
      if (this.taskFlag === 1) {
        //总账会计角色需要输入  预收款金额,已开票金额,已收税金金额
        let validateFields = ['advanceReceiptAmount', 'alreadyPaperAmount', 'alreadyTaxAmount']
        this.form.validateFields(validateFields, (err, values) => {
          if (!err) {
            opt.attachInfo = JSON.stringify({
              advanceReceiptAmount: this.form.getFieldValue('advanceReceiptAmount') || 0,
              alreadyPaperAmount: this.form.getFieldValue('alreadyPaperAmount') || 0,
              alreadyTaxAmount: this.form.getFieldValue('alreadyTaxAmount') || 0,
            })
            this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
          }
        })
      } else {
        this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
      }
    },
    noPassAction() {
      let that = this
      //that.opinion = ''
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
    openSystemUsers(decoratorKey) {
      //this.$refs.customerList.init()
      let saleUserId = this.form.getFieldValue('saleUserId')
      if (saleUserId && !this.selectContract) {
        this.$refs.customerList.init({ userId: saleUserId })
      } else if (!saleUserId && !this.selectContract) {
        this.$message.info('请选择对应销售后，再选择客户')
        return
      } else {
      }
    },
    customerSelected(record) {
      let that = this
      console.log(record)
      if (record) {
        that.form.setFieldsValue({
          saleCustomerName: record.name,
        })
      }
    },
    resetData() {
      let that = this
      that.visible = false
      that.actionType = 'add'
      that.opinion = '' //审批意见
      that.spinning = false
    },
    openModel() {
      this.$refs.receiptContract.query({ type: 1 })
    },
    contractChange(data) {
      const that = this
      console.log(data)
      //contractNumTxt
      that.contractId = data.id
      that.form.setFieldsValue({
        contractNum: data.contractNum,
        saleCustomerName: data.customerName,
      })
      that.fillSaleContractReceipt(data.id)
    },
    fillSaleContractReceipt(id) {
      const that = this
      that.contractReceiptList = []
      return refundGetSaleContractReceipt({ contractId: id }).then((res) => {
        that.contractReceiptList = res.data
      })
    },
    refundAmountMoneyChange(e) {
      console.log(e)
      return turnTheCapital({ money: e }).then((res) => (this.refundAmountMoneyChinese = res.data))
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handlerChange(key, event) {
      console.log(arguments)
      const that = this
      if (key === 'contract') {
        //清空合同操作
        that.contractReceiptList = [] //清空合同关联的收款单
        that.contractId = undefined
        that.form.setFieldsValue({
          contractNum: undefined,
          saleCustomerName: undefined,
          receiptNum: undefined,
        })
      } else {
        let obj = {}
        obj[key] = undefined
        that.form.setFieldsValue(obj)
      }
    },
  },
}
</script>

<style scoped>
.adjust-apply-list-wrapper .search-wrapper * {
  margin: 0;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
}
</style>

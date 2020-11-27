<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button
          key="submit"
          type="primary"
          icon="check"
          :loading="spinning"
          @click="passAction"
        >通过</a-button>
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
            <td>赠送编号</td>
            <td>
              <a-form-item>
                <a-input disabled v-decorator="['presentNum']" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['id']" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['instanceId']" />
              </a-form-item>
            </td>
            <td>合同编号</td>
            <td>
              <a-form-item>
                <a-input
                  read-only 
                  :disabled="isDisabled" 
                  :allowClear="true"
                  @change="handlerChange('contract',$event)"
                  placeholder="单击选择合同"
                  @click="openModel"
                  v-decorator="['contractNum',{rules: [{required: false,message: '请选择合同'}]}]"
                />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-model="contractId" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>客户名称</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="客户名称"
                  :allowClear="true"
                  @change="handlerChange('customerName',$event)"
                  v-decorator="['customerName',{rules: [{required: true,message: '输入客户名称'}]}]" 
                  disabled
                  @click="selectCustomer"
                />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['customerId']" />
              </a-form-item>
            </td>
            <td>对应销售</td>
            <td>
              <a-form-item>
                <a-select
                  optionFilterProp="children"
                  showSearch
                  :allowClear="true"
                  :filterOption="filterSalersOption" 
                  disabled 
                  placeholder="请选择销售人员"
                  v-decorator="['saleUserId',{rules: [{required: true,message: '请选择销售人员'}]}]"
                >
                  <a-select-option
                    v-for="item in saleUser"
                    :value="item.userId"
                    :key="item.userId"
                  >{{ item.salesmanName }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>赠送金额</td>
            <td colspan="3">
              <a-form-item>100%折扣</a-form-item>
            </td>
          </tr>
          <tr>
            <td>赠送原因</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  placeholder="赠送原因" 
                  :disabled="isDisabled" 
                  :rows="2"
                  v-decorator="['sendReason', { rules: [{ required: true, message: '赠送原因' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <ProductSelect ref="productSelect" :disabled="isDisabled" :productListDataSource="productListDataSource"/>

      <Approval ref="approval" @opinionChange="opinionChange" />
      <CustomerList ref="customerList" @selected="customerSelected" />
      <ReceiptSaleContract ref="receiptContract" @onSelect="contractChange" />
    </a-spin>
  </a-modal>
</template>

<script>
//赠送单接口
import { presentDetail, presentSaveOrUpdate, presentApproval } from '@/api/receipt'
//销售人员接口
import { getListSaleContractUser } from '@/api/contractListManagement'
import moment from 'moment'
import Approval from './Approval'
//客户列表选择
import CustomerList from '@/components/CustomerList/CustomerList'
//合同列表选择
import ReceiptSaleContract from './ContractSelect'

import ProductSelect from './ProductSelect'

export default {
  name: 'AddForm',
  components: {
    Approval,
    CustomerList,
    ReceiptSaleContract,
    ProductSelect
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_present-receipt_form' }),
      visible: false,
      actionType: 'add',
      opinion: '', //审批意见
      spinning: false,
      contractId: undefined,
      saleUser: [],
      productListDataSource:[]
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}赠送单`
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
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let task1 = getListSaleContractUser().then(res => (that.saleUser = res.data))
      return Promise.all([task1])
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      that.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          let _productListResult = that.$refs.productSelect.validate()
          if(_productListResult.errors){
            return 
          }
          values.presentProductList = _productListResult.values.map(item =>{
            return {
              presentId:undefined,
              productId:item.productId,
              productType:item.productType,
              targetId:item.targetId,
              targetOther:item.targetOther,
              count:item.count,
              unitPrice:item.unitPrice
            }
          })
          //提交
          that.spinning = true
          presentSaveOrUpdate(values)
            .then(res => {
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
            .catch(err => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.resetData()
      that.actionType = type
      that.record = record || {}

      that.form.resetFields()
      await that.init()
      that.visible = true
      if (that.isAdd) {
        that.productListDataSource = []
        return
      }
      //填充数据
      let _param = {
        presentId: that.record.id
      }
      const _detail = await presentDetail(_param).then(res => res.data)
      let taskQueue = []
      if (taskQueue.length > 0) {
        await Promise.all(taskQueue)
      }
      that.form.setFieldsValue(_detail)
      that.productListDataSource = _detail.productList.map(item => Object.assign({},item))
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      presentApproval(values)
        .then(res => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch(err => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
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
        opinion: opinion
      })
    },
    selectCustomer() {
      let saleUserId = this.form.getFieldValue('saleUserId')
      if(saleUserId && !this.selectContract){
        this.$refs.customerList.init({userId:saleUserId})
      }else if(!saleUserId && !this.selectContract){
        this.$message.info('请选择对应销售后，再选择客户')
        return
      }else{

      }
    },
    customerSelected(record) {
      let that = this
      console.log(record)
      if (record) {
        that.form.setFieldsValue({
          customerName: record.name,
          customerId:record.id
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
      that.contractId = data.id
      that.form.setFieldsValue({
        contractNum: data.contractNum,
        customerName: data.customerName,
        customerId:data.customerId,
        saleUserId:data.saleUserId
      })
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handlerChange(key, event) {
      console.log(arguments)
      const that = this
      if (key === 'contract') {
        //清空合同操作
        that.contractId = undefined
        that.form.setFieldsValue({
          contractNum: undefined,
          customerName: undefined,
          customerId:undefined
        })
      } else {
        let obj = {}
        obj[key] = undefined
        that.form.setFieldsValue(obj)
      }
    }
  }
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
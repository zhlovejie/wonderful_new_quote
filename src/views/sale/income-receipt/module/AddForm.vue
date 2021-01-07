<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:200px;">进款单编号</td>
            <td>
              <a-form-item>
                <a-input disabled v-decorator="['incomeNum']" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['id']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>收款银行</td>
            <td>
              <a-form-item>
                <a-select placeholder="收款银行" v-decorator="['accountId',{rules: [{required: true,message: '选择收款银行'}]}]">
                  <a-select-option
                    :key="item.id"
                    v-for="item in moneyTypes"
                    :value="item.id"
                  >{{item.unitName}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>客户名称/个人名称</td>
            <td>
              <!-- <a-form-item>
                <a-input
                  placeholder="客户名称"
                  :allowClear="true"
                  v-decorator="['customerName',{rules: [{required: true,message: '输入客户名称/个人名称'}]}]"
                />
              </a-form-item> -->


              <CustomerSelect
                ref="customerSelect"
                :options="customerSelectOptions"
                @selected="handleCustomerSelected"
              />
              <a-form-item hidden>
                <a-input 
                  placeholder="客户名称" 
                  :allowClear="true"
                  v-decorator="['customerName',{rules: [{required: true,message: '输入客户名称/个人名称'}]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>收款日期</td>
            <td>
              <a-form-item>
                <a-date-picker
                  style="width:100%;" 
                  :showTime="{ format: 'HH:mm' }"  
                  v-decorator="['incomeTime',{ initialValue:moment(),rules: [{required: true,message: '输入收款日期'}]}]"
                  format="YYYY-MM-DD HH:mm"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>账户</td>
            <td colspan="3">
              <a-form-item>
                <a-input v-decorator="['customerAccount',{rules: [{required: true,message: '输入账户'}]}]" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>金额</td>
            <td colspan="3">
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="0.1"
                  :precision="2"
                  placeholder="金额"
                  v-decorator="['amount', {rules: [{required: true, message: '请输入金额'}]}]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  placeholder="备注"
                  :rows="3"
                  v-decorator="['remark', { rules: [{ required: false, message: '备注' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { incomeDetail, incomeSaveOrUpdate, getAccountBankList } from '@/api/receipt'
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
export default {
  name: 'AddForm',
  components: {CustomerSelect},
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      actionType: 'add',
      spinning: false,
      moneyTypes: [],
      customerSelectOptions: {
        inputLabel: '',
        wrapperStyle: {
          width: '100%',
        },

        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired: true,
        inputAllowClear: false,
        inputDisable: false,
      },
      needOptions: {
        userId: undefined,
      },
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}进款单`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let task1 = getAccountBankList().then(res => (that.moneyTypes = res.data))
      return Promise.all([task1])
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      
      let customerSelectResult = await that.$refs.customerSelect.validate().then(res => res)
      


      that.form.validateFields((err, values) => {
        if (customerSelectResult.err) {
          return
        }
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          //提交
          values.incomeTime = values.incomeTime.format('YYYY-MM-DD HH:mm')
          that.spinning = true
          incomeSaveOrUpdate(values)
            .then(res => {
              that.spinning = false
              console.log(res)
              if (res.code === 200) {
                that.form.resetFields() // 清空表
                that.$refs.customerSelect && that.$refs.customerSelect.reset()
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
        return
      }
      //填充数据
      let _param = {
        incomeId: that.record.id
      }
      const _detail = await incomeDetail(_param).then(res => res.data)
      let taskQueue = []
      if (taskQueue.length > 0) {
        await Promise.all(taskQueue)
      }
      
      _detail.incomeTime = that.moment(_detail.incomeTime)
      that.form.setFieldsValue(_detail)
      that.$refs.customerSelect && that.$refs.customerSelect.fill({
        name:_detail.customerName,
        id:0
      })
    },
    resetData() {
      let that = this
      that.visible = false
      that.actionType = 'add'
      that.spinning = false
      that.$refs.customerSelect && that.$refs.customerSelect.reset()
    },
    handleCustomerSelected(item) {
      this.form.setFieldsValue({
        customerId: item && item.id ? item.id : undefined,
        customerName: item.name,
      })
    },
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

<template>
  <div style="margin-top: 20px">
    <a-form :form="form" class="wdf-custom-add-form-wrapper">
      <h3>基本信息</h3>
      <a-form-item hidden>
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item hidden>
        <a-input v-decorator="['instanceId']" />
      </a-form-item>
      <table class="custom-table custom-table-border">
        <tr>
          <td style="width: 15%">借用编号</td>
          <td style="width: 35%">
            <a-form-item>
              <a-input
                v-if="!isDisabled"
                :disabled="true"
                placeholder="系统自动生成"
                v-decorator="[
                  'borrowNum',
                  {
                    initialValue: detail.id || undefined,
                    rules: [{ required: false }],
                  },
                ]"
              />
              <span v-else>{{ detail.id }}</span>
            </a-form-item>
          </td>
          <td style="width: 15%">类型</td>
          <td style="width: 35%">
            <a-form-item>
              <a-select
                v-if="!isDisabled"
                :disabled="isEdit"
                :allowClear="true"
                v-decorator="[
                  'type',
                  { initialValue: detail.type, rules: [{ required: true, message: '请选择类型' }] },
                ]"
                placeholder="请选择类型"
              >
                <a-select-option :value="1">项目投标</a-select-option>
                <a-select-option :value="2">项目经营</a-select-option>
              </a-select>
              <span v-else>{{ { 1: '项目投标', 2: '项目经营' }[detail.type] }}</span>
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td style="width: 15%">销售经理</td>
          <td style="width: 35%">
            <a-form-item>
              <a-select
                v-if="!isDisabled"
                :disabled="isEdit"
                :allowClear="true"
                v-decorator="[
                  'userId',
                  { initialValue: detail.userId, rules: [{ required: true, message: '请选择类型' }] },
                ]"
                placeholder="请选择销售经理"
                @change="saleUserChange"
              >
                <a-select-option v-for="item in saleUsers" :value="item.userId" :key="item.userId">{{
                  item.salesmanName
                }}</a-select-option>
              </a-select>
              <span v-else>{{ detail.salesmanName }}</span>
            </a-form-item>
          </td>
          <td style="width: 15%">客户名称</td>
          <td style="width: 35%">
            <CustomerSelect
              v-if="!isDisabled"
              ref="customerSelect"
              :needOptions="needOptions"
              :options="customerSelectOptions"
              @selected="handleCustomerSelected" 
              @inputClear="inputClearHandler"
            />
            <a-form-item>
              <a-input
                v-if="!isDisabled"
                hidden
                v-decorator="[
                  'customerId',
                  { initialValue: detail.customerId, rules: [{ required: true, message: '请选择客户名称' }] },
                ]"
              />
              <span v-else>{{ detail.customerName }}</span>
            </a-form-item>
            <a-form-item hidden>
              <a-input v-decorator="['customerName', { initialValue: detail.customerName }]" />
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td>微信号</td>
          <td>
            <a-form-item>
              <a-input
                v-if="!isDisabled"
                type="text"
                v-decorator="[
                  'wxNum',
                  { initialValue: detail.wxNum, rules: [{ required: true, message: '填写微信号' }] },
                ]"
              />
              <span v-else>{{ detail.wxNum }}</span>
            </a-form-item>
          </td>
          <td>邮箱</td>
          <td>
            <a-form-item>
              <a-input
                v-if="!isDisabled"
                type="text"
                v-decorator="[
                  'email',
                  {
                    initialValue: detail.email,
                    rules: [{ required: true, message: '填写电子邮箱' }],
                  },
                ]"
              />
              <span v-else>{{ detail.email }}</span>
            </a-form-item>
          </td>
        </tr>

        <tr>
          <td style="width: 15%">合同属性</td>
          <td colspan="3">
            <a-form-item>
              <a-select
                v-if="!isDisabled"
                :disabled="isEdit"
                :allowClear="true"
                v-decorator="[
                  'contractProperty',
                  { initialValue: detail.contractProperty, rules: [{ required: true, message: '请选择合同属性' }] },
                ]"
                placeholder="请选择合同属性"
                @change="contractAttrChange"
              >
                <a-select-option :value="1">经销商合同</a-select-option>
                <a-select-option :value="2">代理合同</a-select-option>
                <a-select-option :value="3">战略合作协议</a-select-option>
              </a-select>
              <span v-else>{{ { 1: '经销商合同', 2: '代理合同', 3: '战略合作协议' }[detail.contractProperty] }}</span>
            </a-form-item>
          </td>
        </tr>
      </table>
    </a-form>
  </div>
</template>

<script>
//销售人员接口
import { getListSalesman } from '@/api/contractListManagement'
import moment from 'moment'

//客户列表选择
import CustomerSelect from '@/components/CustomerList/CustomerSelect'

export default {
  name: 'AddForm',
  components: {
    CustomerSelect,
  },
  data() {
    return {
      form: this.$form.createForm(this,{name:'qualifications-borrow-management-baseForm'}),
      visible: false,
      actionType: 'add',
      spinning: false,
      contractId: undefined,
      saleUsers: [],
      customerSelectOptions: {
        inputLabel: '',
        wrapperStyle: { flex: '1' },
        formLayout: 'inline',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired: true,
        inputAllowClear: true,
        inputDisable: false,
      },
      needOptions: {
        userId: undefined,
      },
      detail: {},
      record: {},
    }
  },
  computed: {
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
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let task1 = getListSalesman().then((res) => (that.saleUsers = res.data))
      return Promise.all([task1])
    },
    handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      return new Promise((resolve) =>{
        that.form.validateFields((err, values) => {
          if (!err) {
            resolve({ code: 200, values })
          } else {
            resolve({ code: 500, err })
          }
        })
      })
    },
    contractAttrChange(type) {
      this.$emit('contractAttrChange', type)
    },
    async query(type, record) {
      //debugger
      let that = this
      that.actionType = type
      that.record = record || {}
      that.detail = {}
      that.form.resetFields()
      await that.init()
      if (that.isAdd) {
        that.$refs.customerSelect && that.$refs.customerSelect.handleClear()
        return
      }
      //填充数据
      console.log(record)
        that.needOptions = { userId: record.userId }
        that.detail = record
        that.$refs.customerSelect &&
          that.$refs.customerSelect.fill({
            id: that.detail.customerId || undefined,
            name: that.detail.customerName,
          })
      //that.form.setFieldsValue(_detail)
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    saleUserChange(saleUserId) {
      //选择销售人员 填充对应的 微信和邮箱
      //特殊处理
      this.needOptions = { userId: saleUserId }
      this.$refs.customerSelect.handleClear()
      this.form.setFieldsValue({ customerId: undefined, customerName: undefined })
      let target = this.saleUsers.find((user) => +user.userId === parseInt(saleUserId))
      if (target) {
        let salesmanEmail = undefined,
          salesmanWechat = undefined
        if (target.email) {
          salesmanEmail = target.email
        } else if (target.userInfo && target.userInfo.email) {
          salesmanEmail = target.userInfo.email
        }
        salesmanEmail = salesmanEmail || undefined
        if (target.wxNum) {
          salesmanWechat = target.wxNum
        } else if (target.userInfo && target.userInfo.wxNum) {
          salesmanWechat = target.userInfo.wxNum
        }
        salesmanWechat = salesmanWechat || undefined
        this.form.setFieldsValue({ email: salesmanEmail, wxNum: salesmanWechat })
      }
    },
    handleCustomerSelected(item) {
      this.form.setFieldsValue({
        customerId: item && item.id ? item.id : undefined,
        customerName: item.name,
      })
    },
    inputClearHandler(){
      this.form.setFieldsValue({
        customerId: undefined,
        customerName: undefined,
      })
    }
  },
}
</script>

<style scoped>
.ant-upload-list-picture-card .ant-upload-list-item-info::before {
  left: 0;
}
</style>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 150px;
  text-align: left;
  padding-left: 20px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.customer-select-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}

.custom-table >>> .custom-table {
  margin-bottom: 0;
  margin: -1px;
}
</style>
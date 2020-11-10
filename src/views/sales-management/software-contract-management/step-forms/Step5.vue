<template>
  <div class="software-contract-step5-wrapper">
    <a-form :form="form">
      <a-form-item><a-input hidden type="text" v-decorator="['contractId']" /></a-form-item>
      <table class="custom-table custom-table-border">
        <caption>
          乙方信息
        </caption>
        <tbody>
          <tr>
            <td style="width: 300px">乙方信息(开票信息)</td>
            <td>
              <a-row :gutter="50">
                <a-col :span="12">
                  <a-form-item label="需方单位"
                    ><a-input
                      type="text"
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['demandUnit', { rules: [{ required: true, message: '请输入需方单位' }] }]"
                  /></a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="地址"
                    ><a-input
                      type="text"
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['address', { rules: [{ required: true, message: '请输入地址' }] }]"
                  /></a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="50">
                <a-col :span="12">
                  <a-form-item label="电话/传真"
                    ><a-input
                      type="text"
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['mobile', { rules: [{ required: true, message: '请输入电话/传真' }] }]"
                  /></a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="单位全称"
                    ><a-input
                      type="text"
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['unitFullName', { rules: [{ required: true, message: '请输入单位全称' }] }]"
                  /></a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="50">
                <a-col :span="12">
                  <a-form-item label="邮政编码"
                    ><a-input
                      type="text"
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['zipCode', { rules: [{ required: true, message: '请输入邮政编码' }] }]"
                  /></a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="开户行名称"
                    ><a-input
                      type="text"
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['openingBank', { rules: [{ required: true, message: '请输入开户行名称' }] }]"
                  /></a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="50">
                <a-col :span="12">
                  <a-form-item label="银行账号"
                    ><a-input
                      type="text"
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['bankCardAccount', { rules: [{ required: true, message: '请输入银行账号' }] }]"
                  /></a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="税号"
                    ><a-input
                      type="text"
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['dutyParagraph', { rules: [{ required: true, message: '请输入税号' }] }]"
                  /></a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="50">
                <a-col :span="12">
                  <a-form-item label="微信"
                    ><a-input
                      type="text"
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['wx', { rules: [{ required: true, message: '请输入微信' }] }]"
                  /></a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="电子邮箱"
                    ><a-input
                      type="text"
                      :disabled="this.$parent.routeParams.action === 'see'"
                      v-decorator="['email', { rules: [{ required: true, message: '请输入电子邮箱' }] }]"
                  /></a-form-item>
                </a-col>
              </a-row>
            </td>
          </tr>
        </tbody>
      </table>
    </a-form>

    <a-row type="flex">
      <a-col :span="24" justify="center" align="middle">
        <a-button style="margin-right: 8px" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getSoftwareContractQueryOne, saveSoftwareContractBInformation } from '@/api/contractListManagement'
import AFormItem from 'ant-design-vue/es/form/FormItem'
export default {
  name: 'Step5',
  components: { AFormItem },
  props: {
    queryonedata: {
      type: Object,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      id: 0,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const that = this
      that.id = that.queryonedata.id
      const params = { id: that.queryonedata.id }
      if (that.id > 0) {
        getSoftwareContractQueryOne(params)
          .then((res) => {
            console.log('res=======', res)
            that.queryOneData = res.data
            that.id = res.data.id
            that.form.setFieldsValue({ contractId: res.data.id })
            if (res.data.customerInfo !== null) {
              that.form.setFieldsValue({
                demandUnit: res.data.customerInfo.demandUnit,
                address: res.data.customerInfo.address,
                mobile: res.data.customerInfo.mobile,
                unitFullName: res.data.customerInfo.unitFullName,
                zipCode: res.data.customerInfo.zipCode,
                openingBank: res.data.customerInfo.openingBank,
                bankCardAccount: res.data.customerInfo.bankCardAccount,
                dutyParagraph: res.data.customerInfo.dutyParagraph,
                wx: res.data.customerInfo.wx,
                email: res.data.customerInfo.email,
              })
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },

    // 点击下一步
    nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveSoftwareContractBInformation(values)
            .then((res) => {
              console.log('校验成功，保存填写的信息，请求后端接口结果', res)
              that.id = res.data.id
              if (status != 1) {
                that.$emit('nextStep', { ...res.data })
              } else {
                that.$message.success('保存成功')
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
    },
    // 上一步
    prevStep() {
      const id = this.id
      this.$emit('prevStep', id)
    },
  },
}
</script>

<style scoped>
.software-contract-step5-wrapper >>> .ant-form-item {
  display: flex;
}
.software-contract-step5-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.software-contract-step5-wrapper >>> .ant-form-item-label {
  display: inline-block;
  width: 100px;
  text-align: left;
}
</style>

<template>
  <div class="software-contract-step1-wrapper">
    <a-form :form="form">
      <table class="custom-table custom-table-border">
        <caption>
          基本信息
        </caption>
        <tbody>
          <tr>
            <td style="width: 15%">合同编号</td>
            <td style="width: 35%">
              <a-form-item>
                <a-input type="text" v-decorator="['contractNum', { rules: [{ required: false }] }]" disabled />
              </a-form-item>
            </td>
            <td>客户名称</td>
            <td>
              <CustomerSelect
                ref="customerSelect"
                :options="customerSelectOptions"
                :needOptions="needOptions"
                @selected="handleCustomerSelected"
              />
              <div style="display: none">
                <a-form-item>
                  <a-input
                    :disabled="this.$parent.routeParams.action === 'see'"
                    type="text"
                    v-decorator="['customerId', { rules: [{ required: false }] }]"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input
                    :disabled="this.$parent.routeParams.action === 'see'"
                    type="text"
                    v-decorator="['customerName', { rules: [{ required: false }] }]"
                  />
                </a-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>开票类型</td>
            <td>
              <a-form-item>
                <a-radio-group
                  :disabled="this.$parent.routeParams.action === 'see'"
                  v-decorator="['billingType', { initialValue: '1' }]"
                >
                  <a-radio value="1">增票</a-radio>
                  <a-radio value="0">普票</a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
            <td>销售人员</td>
            <td>
              <a-form-item>
                <a-select
                  style="width: 100%"
                  optionFilterProp="children"
                  :filterOption="filterSalersOption"
                  :disabled="this.$parent.routeParams.action === 'see'"
                  showSearch
                  :allowClear="true"
                  v-decorator="[
                    'saleUserId',
                    { rules: [{ required: true, message: '请选择销售人员', pattern: /^[1-9]\d*$/ }] },
                  ]"
                  placeholder="请选择销售人员"
                  @change="saleUserChange"
                >
                  <a-select-option :value="0">请选择销售人员</a-select-option>
                  <a-select-option v-for="item in saleUser" :value="item.userId" :key="item.userId">{{
                    item.salesmanName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>产品</td>
            <td>垃圾分类系统管理软件</td>
            <td>签订日期</td>
            <td>
              <a-form-item>
                <a-date-picker
                  :disabled="this.$parent.routeParams.action === 'see'"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  :disabledTime="disabledDateTime"
                  v-decorator="[
                    'signDate',
                    { rules: [{ required: true, message: '请选择签订日期！' }], initialValue: signDate },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>甲方信息</td>
            <td colspan="3">
              <a-row :gutter="20" type="flex" class="ant-form-inline">
                <a-col>
                  <a-form-item label="微信号">
                    <a-input
                      :disabled="this.$parent.routeParams.action === 'see'"
                      type="text"
                      style="width: 250px"
                      v-decorator="['ourWx', { rules: [{ required: false, message: '请输入微信号' }] }]"
                    />
                  </a-form-item>
                </a-col>
                <a-col>
                  <a-form-item label="电子邮箱">
                    <a-input
                      :disabled="this.$parent.routeParams.action === 'see'"
                      type="text"
                      style="width: 250px"
                      v-decorator="['ourEmail', { rules: [{ required: false, message: '请输入电子邮箱' }] }]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </td>
          </tr>
        </tbody>
      </table>
    </a-form>
    <a-row type="flex">
      <a-col :span="24" justify="center" align="middle">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getListSaleContractUser, softwareContractSaveEssentialInformation } from '@/api/contractListManagement'

import moment from 'moment'
import CustomerSelect from '@/components/CustomerList/CustomerSelect'

export default {
  name: 'Step1',
  components: { CustomerSelect },
  props: {
    queryonedata: {
      type: Object,
    },
  },
  data() {
    return {
      // form
      form: this.$form.createForm(this),
      contractNum: this.queryonedata.contractNum, // 合同编号
      saleCustomers: {}, // 客户名称数组
      saleUser: {}, // 销售经理名称列表
      signDate: moment(), // 签订日期, 默认今天
      disabledDateTime: function () {},
      id: 0,
      customerSelectOptions: {
        showInputLabel: false,
        wrapperStyle: {
          width: '100%',
        },
        formLayout: 'horizontal',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired: true,
        inputAllowClear: false,
      },
      needOptions: {
        userId: undefined,
      },
    }
  },
  computed: {},
  watch: {
    queryonedata() {
      this.init()
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await Promise.all[this.getSalesList()]
      this.$nextTick(() => {
        let qt = this.queryonedata
        if (qt && qt.id && qt.id > 0) {
          let ourWx = '',
            ourEmail = ''
          try {
            //ourWx = qt.ourWx || qt.saleUser.userInfo.wxNum
            //ourEmail = qt.ourEmail || qt.saleUser.userInfo.email

            ourWx = qt.saleUser.userInfo.wxNum
            ourEmail = qt.saleUser.userInfo.email
          } catch (err) {
            //ourWx = qt.ourWx
            //ourEmail = qt.ourEmail
            ourWx = ''
            ourEmail = ''
          }
          this.form.setFieldsValue({
            id: qt.id,
            contractNum: qt.contractNum,
            billingType: String(qt.billingType),
            saleUserId: qt.saleUserId,
            signDate: moment(qt.signDate) || moment(),
            ourWx: ourWx,
            ourEmail: ourEmail,
          })
          if (qt.saleCustomer) {
            this.form.setFieldsValue({
              customerId: qt.saleCustomer.id,
              customerName: qt.saleCustomer.name,
            })
            this.$refs.customerSelect.fill({
              id: qt.saleCustomer.id,
              name: qt.saleCustomer.name,
            })
          }
        }
      })
    },
    filterSalersOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 点击下一步
    async nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this

      let csResult = await this.$refs.customerSelect.validate().then((res) => res)
      if (csResult.error) {
        return
      }
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          const params = {
            id: that.queryonedata.id,
            contractNum: that.queryonedata.contractNum,
            customerId: csResult.values.customerId,
            saleCustomerName: csResult.values.customerName,
            saleUserId: values.saleUserId,
            billingType: values.billingType,
            signDate: values.signDate.format('YYYY-MM-DD'), // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
            ourWx: values.ourWx,
            ourEmail: values.ourEmail,
          }

          if (that.$parent.routeParams.action === 'add') {
            params.contractModifyFlag = 0
          } else if (that.$parent.routeParams.action === 'edit') {
            params.contractModifyFlag = 1
          }

          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          softwareContractSaveEssentialInformation(params)
            .then((res) => {
              that.id = res.data.id
              that.form.setFieldsValue({
                contractNum: res.data.contractNum,
              })
              if (status != 1) {
                that.$emit('nextStep', { ...res.data })
              } else {
                that.$message.success('保存成功')
                that.queryonedata.id = res.data.id
                that.form.setFieldsValue({
                  id: res.data.id,
                })
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
    },
    finish() {
      this.currentTab = 0
    },
    // 获取所有销售经理经理和区域经理
    getSalesList(params = {}) {
      params = {
        name: '', // 销售经理经理和区域经理名字智能搜索
      }
      return getListSaleContractUser(params)
        .then((res) => {
          this.saleUser = res.data
          console.log(res.data)
          return res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    saleUserChange(saleUserId) {
      //选择销售人员 填充对应的 微信和邮箱
      //特殊处理
      this.needOptions = { userId: saleUserId }
      this.$refs.customerSelect.handleClear()
      this.form.setFieldsValue({
        customerId: undefined,
        customerName: undefined,
      })
      //debugger
      //特殊处理
      let target = this.saleUser.find((user) => user.userId === parseInt(saleUserId))
      console.log(target)
      if (target) {
        let { wxNum, email } = target.userInfo
        this.form.setFieldsValue({
          ourWx: wxNum,
          ourEmail: email,
        })
      }
    },
    handleCustomerSelected(item) {
      this.form.setFieldsValue({
        customerId: item.id,
        customerName: item.name,
      })
    },
  },
}
</script>

<style scoped>
.software-contract-step1-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
</style>

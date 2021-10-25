<template>
  <div class="customer-select-wrapper" :style="cOptions.wrapperStyle">
    <CustomerList ref="customerList" @selected="handlerCustomerSelected" />
    <a-form :form="form" :layout="cOptions.formLayout">
      <a-form-item
        :label="cOptions.showInputLabel ? cOptions.inputLabel : null"
        :label-col="cOptions.formItemLayout.labelCol"
        :wrapper-col="cOptions.formItemLayout.wrapperCol"
      >
        <a-input
          ref="myInput"
          style="width: 200px; margin-left: 15px"
          :readOnly="cOptions.inputReadonly"
          :disabled="cOptions.inputDisable"
          :style="cOptions.inputStyle"
          :placeholder="cOptions.inputPlaceholder"
          @click="handleCustomerClick"
          v-decorator="['customerName', { rules: [{ required: cOptions.inputRequired, message: '选择客户名称' }] }]"
        >
          <a-tooltip
            slot="suffix"
            title="清空"
            v-if="
              cOptions.inputAllowClear && this.form.getFieldValue('customerName') && cOptions.inputDisable === false
            "
          >
            <a-icon type="close-circle" @click="handleClear" />
          </a-tooltip>
        </a-input>

        <a-input style="display: none" v-decorator="['customerId']" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
// import { getcusSelectsListqueryOne } from '@/api/contractListManagement'
import CustomerList from './CustomerList'
export default {
  name: 'CustomerSelect',
  components: { CustomerList },
  props: ['options', 'needOptions'],
  data() {
    return {
      form: this.$form.createForm(this),
      userInfo: this.$store.getters.userInfo,
      cOptions: {
        wrapperStyle: {},
        formLayout: 'horizontal',
        formItemLayout: {
          labelCol: { span: 3 },
          wrapperCol: { span: 9 },
        },
        showInputLabel: true,
        inputLabel: '客户名称',
        inputDisable: false, //输入框是否禁用
        inputReadonly: true, //输入框是否只读
        inputStyle: {}, //输入框样式
        inputRequired: true, //是否验证
        inputAllowClear: false, //支持内容清空
        inputPlaceholder: '选择客户名称',
      },
    }
  },
  mounted() {
    this.cOptions = Object.assign({}, this.cOptions, this.options)
    console.log(this.cOptions)
  },
  methods: {
    handlerCustomerSelected(record) {
      console.log(record)
      let result = { id: record.id, name: record.name, address: record.address, saleUserId: record.userId }
      // getcusSelectsListqueryOne({ id: result.saleUserId }).then((res) => {
      //   console.log(res.data)
      // })

      this.fill(result)
      this.$emit('selected', result)
    },
    handleCustomerClick() {
      //特殊处理，，需要根据传过来的userId 来过滤列表
      if (this.userInfo.stationType === 2 || this.userInfo.stationType === 3) {
        this.$refs.customerList.init({ userId: this.userInfo.id })
      } else {
        this.$refs.customerList.init({ userId: this.userInfo.id })
      }
    },
    handleClear() {
      this.fill({ id: '', name: '' })
      this.$emit('inputClear')
    },
    validate() {
      let that = this
      return new Promise((resolve, reject) => {
        that.form.validateFields((err, values) => resolve({ err, values }))
      })
    },
    fill(obj) {
      //填充数据
      this.form.setFieldsValue({
        customerName: obj.name,
        customerId: obj.id,
      })
      this.$nextTick(() => {
        this.$refs.myInput.$forceUpdate()
      })
    },
    reset() {
      this.form.resetFields()
      this.$nextTick(() => {
        this.$refs.myInput.$forceUpdate()
      })
    },
  },
}
</script>

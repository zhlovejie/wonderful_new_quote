<template>
  <div class="purchase-contract-step4-wrapper">
    <h3>乙方信息</h3>
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <table class="custom-table custom-table-border">
        <tbody>
          <tr>
            <td style="width:150px;">
              <span><i class="wdf-required"></i>单位全称</span>
            </td>
            <td>
              <a-form-model-item prop="cfullName">
                <a-input v-model="form.cfullName" style="width:100%;" :allowClear="true" />
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span><i class="wdf-required"></i>地址</span>
            </td>
            <td>
              <a-form-model-item prop="address">
                <a-input v-model="form.address" style="width:100%;" :allowClear="true" />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">
              <span><i class="wdf-required"></i>手机号</span>
            </td>
            <td>
              <a-form-model-item prop="phone">
                <a-input v-model="form.phone" style="width:100%;" :allowClear="true" />
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span><i class="wdf-required"></i>微信号</span>
            </td>
            <td>
              <a-form-model-item prop="weChat">
                <a-input v-model="form.weChat" style="width:100%;" :allowClear="true" />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">
              <span><i class="wdf-required"></i>电子邮箱</span>
            </td>
            <td>
              <a-form-model-item prop="supplierEmail">
                <a-input v-model="form.supplierEmail" style="width:100%;" :allowClear="true" />
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span><i class="wdf-required"></i>邮政编号</span>
            </td>
            <td>
              <a-form-model-item prop="postalCode">
                <a-input v-model="form.postalCode" style="width:100%;" :allowClear="true" />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">
              <span><i class="wdf-required"></i>开户行名称</span>
            </td>
            <td>
              <a-form-model-item prop="bankName">
                <a-input v-model="form.bankName" style="width:100%;" :allowClear="true" />
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span><i class="wdf-required"></i>税号</span>
            </td>
            <td>
              <a-form-model-item prop="taxpayerNumber">
                <a-input v-model="form.taxpayerNumber" style="width:100%;" :allowClear="true" />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">
              <span><i class="wdf-required"></i>银行账号名称</span>
            </td>
            <td>
              <a-form-model-item prop="cardName">
                <a-input v-model="form.cardName" style="width:100%;" :allowClear="true" />
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span><i class="wdf-required"></i>银行账号</span>
            </td>
            <td>
              <a-form-model-item prop="cardNumber">
                <a-input v-model="form.cardNumber" style="width:100%;" :allowClear="true" />
              </a-form-model-item>
            </td>
          </tr>
        </tbody>
      </table>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'purchase-contract-step4',
  inject: ['addForm'],
  data() {
    return {
      form: {
        cfullName: undefined,
        address: undefined,
        phone: undefined,
        weChat: undefined,
        supplierEmail: undefined,
        postalCode: undefined,
        bankName: undefined,
        taxpayerNumber: undefined,
        cardName: undefined,
        cardNumber: undefined
      },
      rules: {
        cfullName: [{ required: true, message: '请输入单位全称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        weChat: [{ required: true, message: '请输入微信号', trigger: 'blur' }],
        supplierEmail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        postalCode: [{ required: true, message: '请输入邮政编号', trigger: 'blur' }],
        bankName: [{ required: true, message: '请输入开户行名称', trigger: 'blur' }],
        taxpayerNumber: [{ required: true, message: '请输入税号', trigger: 'blur' }],
        cardName: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
        cardNumber: [{ required: true, message: '请输入银行账号', trigger: 'blur' }]
      }
    }
  },
  activated() {
    console.log('stop4 activated called...')
    const that = this
    that.form = that.addForm.pick(that.addForm.submitParams, Object.keys(that.form))
    console.log(JSON.stringify(that.form, null, 2))
    if (that.addForm.isAdd) {
      console.log(JSON.stringify(that.form, null, 2))
    }
  },
  methods: {
    validate() {
      const that = this
      return new Promise(resolve => {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            let params = { ...that.form }
            console.log(JSON.stringify(params, null, 2))
            resolve({ hasError: false, data: params })
          } else {
            console.log('error submit!!')
            resolve({ hasError: true, data: {} })
            return false
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.purchase-contract-step4-wrapper {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
  .custom-table tr:nth-child(odd) {
    background-color: #f5f5f5;
  }
  .custom-table {
    th,
    td {
      padding: 5px;
    }
  }
  i.wdf-required::before {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    font-style: normal;
    line-height: 1;
    content: '*';
  }
}
</style>

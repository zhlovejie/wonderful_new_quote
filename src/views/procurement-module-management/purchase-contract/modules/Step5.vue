<template>
  <div class="purchase-contract-step5-wrapper">
    <h3>其他约定</h3>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="inline">
      <table class="custom-table custom-table-border">
        <tbody>
          <tr>
            <td style="width:200px;">
              <span><i class="wdf-required"></i>合同争议解决方式</span>
            </td>
            <td>
              <div style="text-">
                <a-form-model-item prop="disputeSolveType">
                  <a-radio-group v-model="form.disputeSolveType" :disabled="addForm.isDisabled">
                    <a-radio :value="1">向甲方所在地人民法院提起诉讼</a-radio>
                    <a-radio :value="2">向乙方所在地人民法院提起诉讼</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </div>
            </td>
          </tr>
          <tr>
            <td style="width:200px;">
              <span><i class="wdf-required"></i>签订形式</span>
            </td>
            <td>
              <a-form-model-item prop="signType">
                <a-radio-group v-model="form.signType" :disabled="addForm.isDisabled">
                  <a-radio :value="1">邮件</a-radio>
                  <a-radio :value="2">书面</a-radio>
                  <a-radio :value="3">微信</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </td>
          </tr>
          <tr v-if="+form.signType === 1">
            <td style="width:200px;">
              <span><i class="wdf-required"></i>双方邮箱信息</span>
            </td>
            <td>
              <div style="display:flex;">
                <a-form-model-item prop="nailEmail" label="甲方邮箱">
                  <a-input
                    :disabled="addForm.isDisabled"
                    v-model="form.nailEmail"
                    style="width:100%;"
                    :allowClear="true"
                  />
                </a-form-model-item>
                <a-form-model-item prop="secondEmail" label="乙方邮箱">
                  <a-input
                    :disabled="addForm.isDisabled"
                    v-model="form.secondEmail"
                    style="width:100%;"
                    :allowClear="true"
                  />
                </a-form-model-item>
              </div>
            </td>
          </tr>
          <tr v-if="+form.signType === 3">
            <td style="width:200px;">
              <span><i class="wdf-required"></i>双方微信信息</span>
            </td>
            <td>
              <div style="display:flex;">
                <a-form-model-item prop="nailWeChat" label="甲方微信">
                  <a-input
                    :disabled="addForm.isDisabled"
                    v-model="form.nailWeChat"
                    style="width:100%;"
                    :allowClear="true"
                  />
                </a-form-model-item>
                <a-form-model-item prop="secondWeChat" label="乙方微信">
                  <a-input
                    :disabled="addForm.isDisabled"
                    v-model="form.secondWeChat"
                    style="width:100%;"
                    :allowClear="true"
                  />
                </a-form-model-item>
              </div>
            </td>
          </tr>
          <tr>
            <td style="width:200px;">
              <span><i class="wdf-required"></i>鲜章</span>
            </td>
            <td>
              <a-form-model-item prop="freshChapterType">
                <a-radio-group :disabled="addForm.isDisabled" v-model="form.freshChapterType">
                  <a-radio :value="0">不要</a-radio>
                  <a-radio :value="1">要</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:200px;">
              <span><i class="wdf-required"></i>违约责任</span>
            </td>
            <td>
              <div>
                <div>
                  <span style="line-height:36px;">1.如甲方逾期支付货款，每逾期一日则按照未付金额的</span>
                  <span style="margin:0 5px;">
                    <a-form-model-item prop="unpaidFalsify" style="margin:0;">
                      <a-input-number
                        style="width:80px;"
                        :disabled="addForm.isDisabled"
                        v-model="form.unpaidFalsify"
                        :min="0"
                        :max="100"
                        :step="1"
                        :precision="0"
                        @change="handleExceptionPoints"
                      />
                      <span style="margin: 0 5px;">%</span>
                    </a-form-model-item>
                  </span>
                  <span style="line-height:36px;">支付违约金，但违约金总额不得超过合同总价款的</span>
                  <span style="margin:0 5px;">
                    <a-form-model-item prop="fullAmount" style="margin:0;">
                      <a-input-number
                        style="width:80px;"
                        :disabled="addForm.isDisabled"
                        v-model="form.fullAmount"
                        :min="0"
                        :max="100"
                        :step="1"
                        :precision="0"
                        @change="handleExceptionPoints"
                      />
                      <span style="margin: 0 5px;">%</span>
                    </a-form-model-item>
                  </span>
                  <span style="line-height:36px;"
                    >因乙方产品质量问题和延期交货等原因导致甲方逾期付款的甲方不承担任何违约责任。</span
                  >
                </div>
                <div>
                  <span style="line-height:36px;">2.如乙方逾期交货，每逾期一日则按照合同总价款的</span>
                  <span style="margin:0 5px;">
                    <a-form-model-item prop="breachContract" style="margin:0;">
                      <a-input-number
                        style="width:80px;"
                        :disabled="addForm.isDisabled"
                        v-model="form.breachContract"
                        :min="0"
                        :max="100"
                        :step="1"
                        :precision="0"
                        @change="handleExceptionPoints"
                      />
                      <span style="margin: 0 5px;">%</span>
                    </a-form-model-item>
                  </span>
                  <span style="line-height:36px;"
                    >支付违约金并赔偿因此给甲方造成的一切损失。（直接损失和间接损失）</span
                  >
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="hasExceptionPoints">
            <td style="width:200px;">
              <span><i class="wdf-required"></i>变更原因</span>
            </td>
            <td>
              <div class="block">
                <a-form-model-item
                  prop="changeReason"
                  style="dispaly:block;"
                  :rules="{
                    required: hasExceptionPoints,
                    message: '请输入变更原因',
                    trigger: 'blur'
                  }"
                >
                  <a-textarea
                    :disabled="addForm.isDisabled"
                    placeholder="变更原因"
                    :autoSize="true"
                    style="width:100%;"
                    v-model="form.changeReason"
                  />
                </a-form-model-item>
              </div>
            </td>
          </tr>
          <tr>
            <td style="width:200px;">
              <span>其他约定</span>
            </td>
            <td>
              <div class="block">
                <a-form-model-item prop="otherAppointStr">
                  <a-textarea
                    :disabled="addForm.isDisabled"
                    placeholder="其他约定"
                    :autoSize="true"
                    style="width:100%;"
                    v-model="form.otherAppointStr"
                  />
                </a-form-model-item>
              </div>
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
        disputeSolveType: 1,
        signType: 1,
        freshChapterType: 0
      },
      rules: {
        disputeSolveType: [{ required: true, message: '请选择合同争议解决方式', trigger: 'change' }],
        signType: [{ required: true, message: '请选择签订形式', trigger: 'change' }],
        nailEmail: [{ required: true, message: '请输入甲方邮箱', trigger: 'blur' }],
        secondEmail: [{ required: true, message: '请输入乙方邮箱', trigger: 'blur' }],
        nailWeChat: [{ required: true, message: '请输入甲方微信', trigger: 'blur' }],
        secondWeChat: [{ required: true, message: '请输入乙方微信', trigger: 'blur' }],
        freshChapterType: [{ required: true, message: '请选择鲜章', trigger: 'change' }],
        unpaidFalsify: [{ required: true, message: '请输入未付金额比例', trigger: 'blur' }],
        fullAmount: [{ required: true, message: '请输入合同总价款比例', trigger: 'blur' }]
        // changeReason: [{ required: true, message: '请输入变更原因', trigger: 'blur' }]
        // otherAppointStr: [{ required: true, message: '请输入其他约定', trigger: 'blur' }]
      },
      hasExceptionPoints: false
    }
  },
  activated() {
    console.log('stop5 activated called...')
    const that = this
    let result = that.addForm.pick(that.addForm.submitParams, ['otherAppoint','secondPartyInfo'])
    that.form = {
      ...result.otherAppoint,
    }

    if (that.addForm.isAdd) {
      that.form = {
        ...that.form,
        secondWeChat:result.secondPartyInfo.weChat,
        secondEmail:result.secondPartyInfo.supplierEmail
      }
    }
    that.handleExceptionPoints()
  },
  methods: {
    handleExceptionPoints() {
      const that = this
      let exceptionPoints = that.addForm.getExceptionPoints()
      that.hasExceptionPoints = !!exceptionPoints.find(e => e.abnormalType === '违约责任修改')
      that.addForm.hasExceptionPoints = that.hasExceptionPoints
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            let params = {
              otherAppoint: {
                ...that.form
              }
            }
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
.purchase-contract-step5-wrapper {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }
  .custom-table tr:nth-child(odd) {
    background-color: #f5f5f5;
  }
  .custom-table {
    th,
    td {
      padding: 10px 20px;
      text-align: left;
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
  .block {
    /deep/ .ant-form-item,
    /deep/ .ant-form-item-control-wrapper {
      display: block;
    }
  }
}
</style>

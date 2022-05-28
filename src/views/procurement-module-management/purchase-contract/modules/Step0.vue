<template>
  <div class="purchase-contract-step0-wrapper">
    <h3>基本信息</h3>
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <table class="custom-table custom-table-border">
        <tbody>
          <tr>
            <td style="width:15%;">
              <span>合同编号</span>
            </td>
            <td style="width:35%;">
              <a-form-model-item>
                {{ form.contractNum || '系统生成' }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span>供应商名称</span>
            </td>
            <td>
              <a-form-model-item>
                {{ form.supplierName }}
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">
              <span>是否含税</span>
            </td>
            <td>
              <a-form-model-item>
                <a-radio-group v-model="form.taxType" :disabled="addForm.isDisabled">
                  <a-radio :value="0">否</a-radio>
                  <a-radio :value="1">是</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span>发票类型</span>
            </td>
            <td>
              <a-form-model-item prop="invoiceType">
                {{ { 1: '不限', 2: '增值税专用发票', 3: '普通发票' }[form.invoiceType] }}
                <!-- <a-select placeholder="发票类型" v-model="form.invoiceType" :allowClear="true">
                  <a-select-option :value="1">不限</a-select-option>
                  <a-select-option :value="2">增值税专用发票</a-select-option>
                  <a-select-option :value="3">普通发票</a-select-option>
                </a-select> -->
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">
              <span>物料税率(%)</span>
            </td>
            <td>
              <a-form-model-item prop="materialRate">
                {{ form.materialRate }}
                <!-- <a-input-number
                  style="width:100%;"
                  v-model="form.materialRate"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="0"
                /> -->
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span>结算方式</span>
            </td>
            <td>
              <a-form-model-item prop="settlementMode">
                {{ { 0: '现款现货', 1: '账期结算' }[form.settlementMode] }}
                <!-- <a-select placeholder="结算方式" v-model="form.settlementMode" :allowClear="true">
                  <a-select-option :value="0">现款现货</a-select-option>
                  <a-select-option :value="1">账期结算</a-select-option>
                </a-select> -->
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">
              <span>是否含运费</span>
            </td>
            <td>
              <a-form-model-item prop="freightType">
                {{ { 0: '否', 1: '是' }[form.freightType] }}
                <!-- <a-radio-group v-model="form.freightType">
                  <a-radio :value="0">否</a-radio>
                  <a-radio :value="1">是</a-radio>
                </a-radio-group> -->
              </a-form-model-item>
            </td>

            <td style="width:150px;">
              <span>运费金额(元)</span>
            </td>
            <td>
              <a-form-model-item
                prop="freightFullAmount"
                :rules="{
                  required: +form.freightType === 1,
                  message: '请输入运费金额',
                  trigger: 'blur'
                }"
              >
                <a-input-number
                  v-if="+form.freightType === 1"
                  :disabled="addForm.isDisabled"
                  style="width:100%;"
                  v-model="form.freightFullAmount"
                  :min="0"
                  :step="1"
                  :precision="2"
                />
                <span v-else>无</span>
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">
              <span>运费税率(%)</span>
            </td>
            <td>
              <a-form-model-item
                prop="freightRate"
                :rules="{
                  required: +form.freightType === 1,
                  message: '请输入运费税率',
                  trigger: 'blur'
                }"
              >
                <a-input-number
                  v-if="+form.freightType === 1"
                  :disabled="addForm.isDisabled"
                  style="width:100%;"
                  v-model="form.freightRate"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="0"
                />
                <span v-else>无</span>
              </a-form-model-item>
            </td>

            <td style="width:150px;">
              <span>货运方式</span>
            </td>
            <td>
              <a-form-model-item prop="logisticsTypeId">
                <CommonDictionarySelect
                  placeholder="货运方式"
                  style="width: 100%;"
                  allowClear
                  :text="'物料类别'"
                  :dictionaryId.sync="form.logisticsTypeId"
                  :disabled="addForm.isDisabled"
                  @selected="handlerLogisticsTypeChange"
                />
                <!-- logisticsTypeName -->
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">
              <span>签订日期</span>
            </td>
            <td colspan="3">
              <a-form-model-item prop="signDate">
                <a-date-picker
                  v-model="form.signDate"
                  valueFormat="YYYY-MM-DD"
                  :class="{ 'sign-date-current': isSignDateCurrent, 'sign-date-no-current': !isSignDateCurrent }"
                  :allowClear="true"
                  :disabled="addForm.isDisabled"
                  @change="handleSignDateChange"
                />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">
              <span>采购员</span>
            </td>
            <td>
              <a-form-model-item>
                {{ form.purchaseUserName }}
              </a-form-model-item>
            </td>
            <td style="width:150px;">
              <span>采购员手机号</span>
            </td>
            <td>
              <a-form-model-item>
                {{ form.purchasePhone }}
              </a-form-model-item>
            </td>
          </tr>
        </tbody>
      </table>
    </a-form-model>
  </div>
</template>

<script>
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import moment from 'moment'
export default {
  name: 'purchase-contract-step0',
  components: {
    CommonDictionarySelect
  },
  inject: ['addForm'],
  data() {
    return {
      form: {
        contractNum: undefined,
        supplierName: '',
        taxType: 1,
        invoiceType: 1,
        materialRate: 0,
        settlementMode: undefined,
        freightType: undefined,
        freightFullAmount: 0,
        freightRate: 0,
        logisticsTypeId: undefined,
        logisticsTypeName: undefined,
        signDate: moment(),
        purchaseUserName: undefined,
        purchasePhone: undefined,
        purchaseUserId: undefined
      },
      rules: {
        materialRate: [{ required: true, message: '请输入物料税率', trigger: 'blur' }],
        settlementMode: [{ required: true, message: '请选择结算方式', trigger: 'change' }],
        freightType: [{ required: true, message: '请选择是否含运费', trigger: 'change' }],
        // freightFullAmount: [{ required: true, message: '请输入运费金额', trigger: 'blur' }],
        // freightRate: [{ required: true, message: '请输入运费税率', trigger: 'blur' }],
        logisticsTypeId: [{ required: true, message: '请选择货运方式', trigger: 'change' }],
        signDate: [{ required: true, message: '请选择签订日期', trigger: 'change' }]
      },
      isSignDateCurrent: false
    }
  },
  activated() {
    console.log('stop0 activated called...')
    const that = this
    that.form = that.addForm.pick(that.addForm.submitParams, Object.keys(that.form))
    console.log(JSON.stringify(that.form, null, 2))
    if (that.addForm.isAdd) {
      that.form = {
        contractNum: undefined,
        taxType: 1,
        invoiceType: 1,
        signDate: moment(),
        ...that.form
      }
      console.log(JSON.stringify(that.form, null, 2))
    }

    that.handleSignDateChange(that.form.signDate)
  },
  methods: {
    moment,
    handleSignDateChange(val) {
      let case1 = moment(val).format('YYYY-MM-DD')
      let case2 = moment().format('YYYY-MM-DD')
      this.isSignDateCurrent = case1 === case2
    },
    handlerLogisticsTypeChange() {
      this.form = {
        ...this.form,
        logisticsTypeId: record.id,
        logisticsTypeName: record.text
      }
    },
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
.purchase-contract-step0-wrapper {
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

  .sign-date-current {
    width: 100%;
  }

  .sign-date-no-current {
    width: 100%;
    color: red !important;
    /deep/ input.ant-calendar-picker-input {
      color: red !important;
    }
  }
}
</style>

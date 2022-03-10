<template>
  <div class="__fac_info_wrapper__">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <h2>收款方式</h2>
      <a-form-model-item label="收款方式" prop="settlementMode">
        <a-select style="width: 100%;" v-model="form.settlementMode">
          <a-select-option :value="0">现货现款</a-select-option>
          <a-select-option :value="1">帐期付款</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item v-if="+form.settlementMode === 1" label="票到付款周期" prop="paymentCycleId">
        <CommonDictionarySelect
          style="width: 100%;"
          placeholder="付款周期"
          :text="'付款周期'"
          :dictionaryId.sync="form.paymentCycleId"
          @selected="handlePaymentCycleChange"
        />
      </a-form-model-item>

      <div v-if="+form.settlementMode === 0">
      <a-row>
        <a-col :span="3"></a-col>
        <a-col :span="16">
          <div style="display:flex;line-height:40px;">
            <a-form-model-item label="">
              <a-checkbox :checked="!!form.padvanceType" @change="(e) => handleChkChange('padvanceType',e)"></a-checkbox>
            </a-form-model-item>

            <span style="margin:0 10px;">预付款:</span>
            <a-form-model-item label="" >
              <a-input-number
                :precision="2"
                :min="0"
                :max="100"
                v-model="form.padvanceProportion"
              />
            </a-form-model-item>
            <span style="margin:0 10px;">%</span>
          </div>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="3"></a-col>
        <a-col :span="16">
          <div style="display:flex;line-height:40px;">
            <a-form-model-item label="">
              <a-checkbox :checked="!!form.ccommodityType" @change="(e) => handleChkChange('ccommodityType',e)"></a-checkbox>
            </a-form-model-item>

            <span style="margin:0 10px;">提货款:</span>
            <a-form-model-item label="">
              <a-input-number
                :precision="2"
                :min="0"
                :max="100"
                v-model="form.ccommodityProportion"
              />
            </a-form-model-item>
            <span style="margin:0 10px;">%</span>
          </div>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="3"></a-col>
        <a-col :span="16">
          <div style="display:flex;line-height:40px;">
            <a-form-model-item label="">
              <a-checkbox :checked="!!form.ccollectType" @change="(e) => handleChkChange('ccollectType',e)"></a-checkbox>
            </a-form-model-item>

            <span style="margin:0 10px;">验收款:</span>
            <a-form-model-item label="">
              <a-input-number
                :precision="2"
                :min="0"
                :max="100"
                v-model="form.ccollectProportion"
              />
            </a-form-model-item>
            <span style="margin:0 10px;">%</span>

            <span style="margin:0 10px;">到货后</span>
            <a-form-model-item label="">
              <a-input-number
                :precision="0"
                :min="0"
                :max="99999"
                v-model="form.arrivalDay"
              />
            </a-form-model-item>
            <span style="margin:0 10px;">天</span>

          </div>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="3"></a-col>
        <a-col :span="16">
          <div style="display:flex;line-height:40px;">
            <a-form-model-item label="">
              <a-checkbox :checked="!!form.warrantyType" @change="(e) => handleChkChange('warrantyType',e)"></a-checkbox>
            </a-form-model-item>

            <span style="margin:0 10px;">质保金:</span>
            <a-form-model-item label="">
              <a-input-number
                :precision="2"
                :min="0"
                :max="100"
                v-model="form.warrantyProportion"
              />
            </a-form-model-item>
            <span style="margin:0 10px;">%</span>
          </div>
        </a-col>
      </a-row>
      </div>
      <h2>收款银行账号信息</h2>
      <a-form-model-item label="公司全称" prop="cfullName">
        <a-input v-model="form.cfullName" />
      </a-form-model-item>
      <a-form-model-item label="纳税人识别号" prop="taxpayerNumber">
        <a-input v-model="form.taxpayerNumber" />
      </a-form-model-item>
      <a-form-model-item label="开户行" prop="bankName">
        <a-input v-model="form.bankName" />
      </a-form-model-item>
      <a-form-model-item label="银行卡号" prop="cardNumber">
        <a-input v-model="form.cardNumber" />
      </a-form-model-item>
      <a-form-model-item label="财务联系方式" prop="fcontactMode">
        <a-input v-model="form.fcontactMode" />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
export default {
  name: 'cashInfo',
  components: {
    CommonDictionarySelect
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 16 },
      form: {
        
      },
      rules: {
        settlementMode:[
          { required: true, message: '请选择收款方式', trigger: 'change' }
        ],
        cfullName: [
          { required: true, message: '请输入公司全称', trigger: 'blur' }
        ],
        taxpayerNumber: [
          { required: true, message: '请输入纳税人识别号', trigger: 'blur' }
        ],
        cardNumber: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: '请输入开户行', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleChkChange(type,event){
      this.form = {
        ...this.form,
        [type]:event.target.checked ? 1 : 0
      }
    },
    handlePaymentCycleChange(record){
      this.form = {
        ...this.form,
        paymentCycle: record.text
      }
    },
    handleAction(type, obj, item) {
      const that = this
      if (type === 'add') {
        let list = [...that.form[obj]]
        let target = {
          key: that.$uuid(),
          name: '',
          tel: '',
          wxNo: '',
          email: ''
        }
        if (obj === 'salemanList') {
          target = {
            ...target,
            position: '',
            cardNo: ''
          }
        }
        list.push(target)
        that.form = {
          ...that.form,
          [obj]: list
        }
      } else if (type === 'del') {
        that.form = {
          ...that.form,
          [obj]: that.form[obj].filter(_item => _item.key !== item.key)
        }
      }
    },
    validate() {
      const that = this
      return new Promise(resolve => {
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({
              code:0,
              result:{
                facInfoPayBo:{...that.form}
              }
            })
          } else {
            resolve({
              code:500,
              result:{}
            })
          }
        });
      })
    }
  }
}
</script>

<style scoped>
.__fac_info_wrapper__ >>> .ant-form-item {
  margin-bottom: 0;
}
.steps-action {
  text-align: center;
  margin-top: 20px;
}
.steps-action >>> .ant-btn{
  margin:0 5px;
}

</style>

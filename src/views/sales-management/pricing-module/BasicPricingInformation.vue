<template>
  <a-form :form="form" class="form" >
    <a-row class="form-row" :gutter="16">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="核价编号" :label-col="{ span: 3}" :wrapper-col="{ span:9 }">
          <a-input v-decorator="['code', {initialValue: ''}]" placeholder="系统自动生成" disabled/>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="单据状态" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
          <a-input v-if="valencyStatus===0" v-decorator="['valencyStatus', {initialValue: ''}]" disabled/>
          <a-input v-else-if="valencyStatus===1" v-decorator="['valencyStatus', {initialValue: ''}]" disabled/>
          <a-input v-else-if="valencyStatus===2" v-decorator="['valencyStatus', {initialValue: ''}]" disabled/>
          <a-input v-else v-decorator="['valencyStatus', {initialValue: ''}]" disabled/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="12" :md="12" :sm="24">
        <CustomerSelect ref="customerSelect" />
        <!-- <a-form-item label="客户名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
          <a-select placeholder="请选择客户名称" v-decorator="[ 'consumerId', {rules: [{ required: true, message: '客户名称'}]} ]">
            <a-select-option v-for="item in saleCustomers" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item> -->
      </a-col>
      <a-col :lg="{span: 12}" :md="{span: 12}" :sm="24">
        <a-form-item label="需求日期" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
          <a-date-picker v-decorator="['demandTime', { rules: [{ required: true, message: '需求日期'}], initialValue: moment()}]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-button type="primary" @click="validForm" style="display: none;">验证表单</a-button>
  </a-form>
</template>

<script>
import moment from 'moment' 
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
export default {
  name: 'BasicPricingInformation',
  components: { CustomerSelect },
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      demandTime: moment(), // 需求日期
      saleCustomers: [],
      valencyStatus: 0
    }
  },
  watch: {
    data (newValue, oldValue) {
      console.log(newValue)
      const { code, saleCustomers, valencyStatus } = newValue
      this.saleCustomers = saleCustomers || []
      this.valencyStatus = valencyStatus
      let text = ''
      if (valencyStatus === 0) {
        text = '申请未提交'
      } else if (valencyStatus === 1) {
        text = '已接收待核价'
      } else if (valencyStatus === 2) {
        text = '驳回'
      } else {
        text = '合价通过'
      }

      this.$nextTick(() => {
        this.form.setFieldsValue({
          code,
          //saleCustomers,
          valencyStatus: text
        })
      })
    }
  },
  mounted () {},
  methods: {
    moment,
    validForm () {
      let that = this 
      that.form.validateFields((err, values) => {
        let data = {}
        that.$refs.customerSelect.validate().then(res =>{
          if(res.err){
            return
          }
          values.consumerId = res.values.customerId
          values.consumerName = res.values.customerName
          if (!err) { // 验证通过
            data = {
              status: 'success',
              ...values,
              valencyText: values.valencyStatus,
              valencyStatus: this.valencyStatus,
              demandTime: values.demandTime.format('YYYY-MM-DD')
            }
          } else {
            data = {
              status: 'error'
            }
          }
          this.$emit('custom-change', data)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>

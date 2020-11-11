<template>
  <a-form :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="核价编号" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
          <a-input v-decorator="['code', { initialValue: '' }]" placeholder="系统自动生成" disabled />
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="单据状态" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
          <a-input v-if="valencyStatus === 0" v-decorator="['valencyStatus', { initialValue: '' }]" disabled />
          <a-input v-else-if="valencyStatus === 1" v-decorator="['valencyStatus', { initialValue: '' }]" disabled />
          <a-input v-else-if="valencyStatus === 2" v-decorator="['valencyStatus', { initialValue: '' }]" disabled />
          <a-input v-else v-decorator="['valencyStatus', { initialValue: '' }]" disabled />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="销售人员" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
          <a-select
            optionFilterProp="children"
            showSearch
            :allowClear="true"
            :filterOption="filterSalersOption"
            v-decorator="['salerId', { rules: [{ required: true, message: '请选择销售人员', pattern: /^[1-9]\d*$/ }] }]"
            placeholder="请选择销售人员"
            @change="saleSelectChange"
            style="width: 60%"
          >
            <a-select-option :value="0">请选择销售人员</a-select-option>
            <a-select-option v-for="item in saleUser" :value="item.userId" :key="item.userId">{{
              item.salesmanName
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="客户名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
          <a-input
            class="a-input"
            style="width: 260px; cursor: pointer"
            title="选择客户名称"
            read-only
            placeholder="选择客户名称"
            @click="handleCustomerClick"
            v-decorator="['customerName', { rules: [{ required: true, message: '选择客户名称' }] }]"
          />

          <a-input style="display: none" v-decorator="['customerId']" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="{ span: 12 }" :md="{ span: 12 }" :sm="24">
        <a-form-item label="需求日期" :label-col="{ span: 3 }" :wrapper-col="{ span: 9 }">
          <a-date-picker
            v-decorator="['demandTime', { rules: [{ required: true, message: '需求日期' }], initialValue: moment() }]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-button type="primary" @click="validForm" style="display: none">验证表单</a-button>
    <CustomerList ref="customerList" @selected="handlerCustomerSelected" />
  </a-form>
</template>

<script>
import moment from 'moment'
import { getListSalesman } from '@/api/contractListManagement'
import CustomerList from '@/components/CustomerList/CustomerList'
export default {
  name: 'BasicPricingInformation',
  components: { CustomerList },
  props: {
    showSubmit: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      saleUser: {}, // 销售经理名称列表
      saleUserId: 0, // 选中的销售经理id
      demandTime: moment(), // 需求日期
      saleCustomers: [],
      valencyStatus: 0,
    }
  },
  watch: {
    data(newValue, oldValue) {
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
          valencyStatus: text,
        })
      })
    },
  },
  created() {
    this.getSalesList()
  },
  mounted() {},
  methods: {
    moment,
    handlerCustomerSelected(record) {
      console.log(record)
      this.customerName = record.name
      this.customerId = record.id
      this.form.setFieldsValue({
        customerName: record.name,
        customerId: record.id,
      })
    },
    handleCustomerClick() {
      //debugger
      if (!this.saleUserId) {
        this.$message.info('请选择销售人员后，再选择客户')
        return
      }
      this.$refs.customerList.init({ userId: this.saleUserId })
    },
    // 获取所有销售经理经理和区域经理
    getSalesList(params = {}) {
      params = {
        name: '', // 销售经理经理和区域经理名字智能搜索
      }
      return getListSalesman(params)
        .then((res) => {
          console.log('销售经理经理和区域经理', res)
          this.saleUser = res.data
          this.trueName = res.data.salesmanName
          this.saleUserId = res.data.userId
          return res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // 选择销售经理名称下拉框根据输入项进行筛选
    filterSalersOption(input, option) {
      // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // option.componentOptions.children[0].text
    },
    // 选择销售人员
    saleSelectChange(e) {
      this.saleUserId = e
      this.customerName = undefined
      this.customerId = undefined
      this.form.setFieldsValue({
        customerName: undefined,
        customerId: undefined,
      })
      console.log('选择销售人员', this.saleUserId)
    },
    validForm() {
      let that = this
      that.form.validateFields((err, values) => {
        let data = {}
        // that.$refs.customerSelect.validate().then((res) => {
        //   if (res.err) {
        //     return
        //   }
        // values.consumerId = res.values.customerId
        // values.consumerName = res.values.customerName
        if (!err) {
          // 验证通过
          data = {
            status: 'success',
            ...values,
            valencyText: values.valencyStatus,
            valencyStatus: this.valencyStatus,
            demandTime: values.demandTime.format('YYYY-MM-DD'),
          }
        } else {
          data = {
            status: 'error',
          }
        }
        this.$emit('custom-change', data)
      })
      // })
    },
  },
}
</script>

<style scoped>
</style>

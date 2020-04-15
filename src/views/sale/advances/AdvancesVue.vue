<template>
  <a-modal
    title="操作"
    :width="800"
    :style="{height: '550px'}"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :footer="null"
    v-model="visible">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12">
            <a-form-item
              label="项目编号">
              <a-input
                read-only="read-only"
                placeholder="项目编号"
                v-decorator="[ 'advancesCode']"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12">
            <a-form-item
              label="客户名称">
              <a-input
                read-only="read-only"
                placeholder="客户名称"
                v-decorator="[ 'customerName' ]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12">
            <a-form-item
              label="结算方式">
              <a-input
                read-only="read-only"
                placeholder="结算方式"
                v-decorator="[ 'bankName' ]"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12">
            <a-form-item
              label="收款帐号">
              <a-input
                read-only="read-only"
                placeholder="收款帐号"
                v-decorator="[ 'bankNum']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12">
            <a-form-item
              label="产品类别">
              <a-select
                disabled
                placeholder="产品类别"
                v-model="productType"
               >
                <a-select-option v-for="ptype in productTypes" :key="ptype.id" :value="ptype.id" >{{ ptype.text }}</a-select-option>
                <!--<a-select-option :value="1">常规产品</a-select-option>
                <a-select-option :value="2">非常规产品</a-select-option>-->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12">
            <a-form-item
              label="收款日期">
              <a-input
                read-only="read-only"
                placeholder="收款日期"
                v-decorator="[ 'receiptTime']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12">
            <a-form-item
              label="结算实收金额(元)">
              <a-input
                read-only="read-only"
                placeholder="结算实收金额"
                v-decorator="[ 'paidMoney', {rules: [{ required: true, message: '结算实收金额', whitespace: true}]} ]"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12">
            <a-form-item
              label="预收原因">
              <a-textarea
                read-only="read-only"
                v-decorator="['remark']"/>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { advancesDetail } from '@/api/advances'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { getDictionary} from '@/api/common'

export default {
  name: 'AdvancesVue',
  components: { ATextarea },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      queryBoolean: false,
      saleCustomers: [],
      moneyTypes: [],
      productTypes:[],
      customerId: '',
      accountNum: '',
      productType: 0,
      type: 0,
      address: '',
      form: this.$form.createForm(this)
    }
  },
  created (record) { // 初始化钩子,获取所有产品类型
    console.log("请求begin")
    getDictionary({ text: '产品类型' }).then(res => {
      this.productTypes = res.data
    })
  },
  methods: {
    detail (id) {
      this.visible = true
      const data = { 'id': id }
      advancesDetail(data).then((res) => {
        console.log("data:"+JSON.stringify(res.data))
        const record =  res.data;
        console.log("productType:" +res.data.productType);
        this.productType = res.data.productType
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...record })
        })
      })
    }
  }
}
</script>
<style>

</style>

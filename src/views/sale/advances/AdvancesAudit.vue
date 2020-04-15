<template>
  <a-modal
    title="操作"
    :width="800"
    :style="{height: '550px'}"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    v-model="visible">
    <template slot="footer">
      <a-button @click="handleCancel">不通过</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk('Y')">
        通过
      </a-button>
    </template>
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
                <a-select-option :value="1">常规产品</a-select-option>
                <a-select-option :value="2">非常规产品</a-select-option>
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
                v-decorator="[ 'paidMoney' ]"/>
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
    <a-modal
      title="不通过"
      @ok="handleOk('N')"
      @cancel="handleCancelTwo"
      :confirmLoading="confirmLoadingTwo"
      :maskClosable="false"
      v-model="visibleTwo">
      <a-spin :spinning="confirmLoadingTwo">
        <a-form :form="form2" class="form">
          <a-col>
            <a-form-item
              label="驳回原因">
              <a-input
                placeholder="驳回原因"
                v-decorator="[ 'rejected', {rules: [{ message: '请输入驳回原因', whitespace: true}]} ]"/>
              <a-alert v-if="hidden" type="error" message="请输入驳回原因" banner/>
            </a-form-item>
          </a-col>
        </a-form>
      </a-spin>
    </a-modal>
  </a-modal>

</template>

<script>

import { advancesDetail, advancesAudit } from '@/api/advances'
import ATextarea from 'ant-design-vue/es/input/TextArea'

export default {
  name: 'AdvancesAudit',
  components: { ATextarea },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      queryBoolean: false,
      confirmLoadingTwo: false,
      visibleTwo: false,
      saleCustomers: [],
      moneyTypes: [],
      customerId: '',
      accountNum: '',
      productType: 0,
      beforeValueBoolean: false,
      loading: false,
      hidden: true,
      type: 0,
      address: '',
      data: {},
      form: this.$form.createForm(this),
      form2: this.$form.createForm(this)
    }
  },
  methods: {
    detail (id) {
      this.visible = true
      const data = { 'id': id }
      advancesDetail(data).then((res) => {
        console.log(JSON.stringify(res.data))
        this.productType = res.data.productType
        this.data = res.data
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...res.data })
        })
      })
    },
    handleCancel (e) {
      console.log('handleCancel e' + JSON.stringify(e))
      console.log('handleCancel :' + JSON.stringify(this.data))
      this.hidden = false
      this.visibleTwo = true
      this.beforeValueBoolean = true
    },
    handleCancelTwo (e) {
      this.form2.resetFields()
    },
    handleOk (e) {
      let that = this
      if (this.beforeValueBoolean) {
        this.form2.validateFields((err, values) => {
          if (values.rejected === undefined || values.rejected === null || values.rejected === '') {
            this.hidden = true
            return
          }
          this.data.advancesStatus = 3
          this.$set(this.data, 'rejected', values.rejected)
        })
      } else {
        this.data.advancesStatus = 2
      }
      console.log(JSON.stringify(this.data))

      if(e === 'Y'){
        that.confirmLoading = true
      }else{
        that.confirmLoadingTwo = true
      }
      advancesAudit(this.data).then((res) => {
        
        if(e === 'Y'){
          that.confirmLoading = false
        }else{
          that.confirmLoadingTwo = false
        }

        if (res.code == 200) {
          this.form2.resetFields()
          this.$emit('close')
          this.visible = false
          this.visibleTwo = false
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err =>{
        if(e === 'Y'){
          that.confirmLoading = false
        }else{
          that.confirmLoadingTwo = false
        }
      })
    }
  }
}
</script>
<style>

</style>

<template>
  <a-modal
    :title="titile"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleCancel"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-card :bordered="false" >
      <div class="content">
        <step1 ref="step1" :customer="customer" v-if="currentTab === 0" @nextStep="nextStep"/>
        <step2 ref="step2" v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
        <step3 ref="result" :subType="subType" v-if="currentTab === 2" @toList="handleCancel"/>
      </div>
      <a-divider />
      <a-steps class="steps" :current="currentTab">
        <a-step title="填写客户信息" />
        <a-step title="填写联系人信息" />
        <a-step title="完成" />
      </a-steps>
    </a-card>
  </a-modal>
</template>

<script>
import Step1 from './AllCustomerForm'
import Step2 from './LinkmanForm'
import Step3 from '../../Result'
import { addCustomer, getOneCustomer, editCustomer } from '@/api/customer'
import { queryList } from '@/api/linkman'

export default {
  name: 'StepForm',
  components: {
    Step1,
    Step2,
    Step3
  },
  data () {
    return {
      visible: false, // 表单对话框是否可见
      titile: '',
      currentTab: 0,
      customer: {},
      linkmans: [],
      subType: 'add' // 新增还是修改的标记
    }
  },
  methods: {
    edit (cId) {
      this.visible = true
      this.subType = 'edit'
      this.titile = '修改客户'
      getOneCustomer({ 'cId': cId }).then(res => {
        if (res.code === 200) {
          this.$refs.step1.edit(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCancel () { // 关闭
      this.customer = {}
      this.linkmans = []
      this.currentTab = 0
      this.visible = false
      this.$emit('ok')
    },
    nextStep (values) {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
      if (this.currentTab === 1) {
        this.customer = values
        if (this.subType === 'edit') { // 如果是修改则需要查询出所有联系人
          queryList({ 'customerId': values.id }).then(res => {
            if (res.code === 200) {
              this.$refs.step2.edit(res.data, values.id)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      } else if (this.currentTab === 2) {
        this.linkmans = values
        var param = { customer: this.customer, linkmans: this.linkmans, isSecond: this.customer.isSecond, isAgency: this.customer.isAgency }
        if (this.subType === 'add') {
          addCustomer(param).then(res => {
            this.$refs.result.result(res)
          })
        } else if (this.subType === 'edit') {
          editCustomer(param).then(res => {
            this.$refs.result.result(res)
          })
        }
      }
    },
    prevStep () { // 上一步
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>

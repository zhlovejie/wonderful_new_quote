<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="wdf-custom-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">卡名</td>
            <td style="width:300px;">
              <a-form-item>
                <span v-if="isView || isRecharge">{{detail.cardName}}</span>
                <a-input
                  v-else
                  placeholder="卡名"
                  v-decorator="['cardName',{initialValue:detail.cardName,rules: [{required: true,message: '请输入卡名'}]}]"
                  :allowClear="true"
                  style="width:100%;"
                />
                
              </a-form-item>
            </td>
            
          </tr>
          <tr>
            <td style="width:120px;">卡号</td>
            <td>
              <a-form-item>
                <span v-if="isView || isRecharge">{{detail.cardCode}}</span>
                <a-input 
                  v-else
                  placeholder="卡号"
                  v-decorator="['cardCode',{initialValue:detail.cardCode,rules: [{required: true,message: '输入卡号'}]}]"
                  style="width:100%;"
                />
              </a-form-item>
            </td>
          </tr>
          <tr >
            <td>余额</td>
            <td >
              <a-form-item>
                <span v-if="isView || isRecharge">{{detail.cardRemain | moneyFormatNumber}}</span>
                <a-input-number 
                  v-else
                  placeholder="余额"
                  style="width:100%;"
                  :min="0"
                  :max="999999"
                  :step="1"
                  :precision="2" 
                  v-decorator="['cardRemain',{initialValue:detail.cardRemain ,rules: [{required: true,message: '输入余额'}]}]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr v-if="!isRecharge">
            <td>保管人</td>
            <td >
              <span v-if="isView || isRecharge">{{detail.careDepartmentName}}&nbsp;&nbsp;{{detail.careUserName}}</span>
              <template v-else>
                <DepUserSelect @change="depUserChange" :depId="detail.careDepartmentId" :userId="detail.careUserId" />
                <a-form-item hidden>
                  <a-input v-decorator="['careDepartmentId',{initialValue:detail.careDepartmentId}]" />
                </a-form-item>
                <a-form-item hidden>
                  <a-input v-decorator="['careUserId',{initialValue:detail.careUserId,rules: [{required: true,message: '选择保管人'}]}]" />
                </a-form-item>
              </template>
            </td>
          </tr>

          <tr v-if="isRecharge">
            <td>充值金额</td>
            <td >
              <a-form-item>
                <a-input-number 
                  placeholder="充值金额"
                  style="width:100%;"
                  :min="1000"
                  :max="20000"
                  :step="1"
                  v-decorator="['investAmount',{initialValue:detail.investAmount ,rules: [{required: true,message: '输入充值金额'}]}]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>

    </a-spin>
  </a-modal>
</template>
<script>

import {
  carOilInfoAddOrUpdate,
  carOilInvestAddOrUpdate
} from '@/api/vehicleManagement'
import DepUserSelect from '@/components/CustomerList/DepUserSelect'
import moment from 'moment'

function makeKey() {
  return Math.random().toString(32).slice(-10)
}

export default {
  name: 'AddForm',
  components: {
    DepUserSelect
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      spinning: false,
      type: 'view',
      record: {},
      detail: {}
    }
  },
  watch: {},
  computed: {
    isView() {
      return this.type === 'view'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isRecharge(){
      return this.type === 'recharge'
    },
    modalTitle() {
      let m = {
        'add':'新增',
        'view':'查看',
        'edit':'修改',
        'recharge':'充值',
      }
      return m[this.type]
    },
  },
  methods: {
    moment,
    async query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = Object.assign({}, record)
      that.detail = {}
      that.form.resetFields()
      await that.initData()
      
        that.spinning = true
        let _detail = null
        try {
          //_detail = await emergencyMedicineDetail({ id: record.id }).then((res) => res.data)
          _detail = Object.assign({},record)
          that.spinning = false
          that.detail = { ..._detail }
        } catch (err) {
          console.log(err)
          that.spinning = false
        }
      
    },
    initData() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },

    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true
          //debugger
          let _api = that.isRecharge ? carOilInvestAddOrUpdate : carOilInfoAddOrUpdate

          if(that.isRecharge){
            delete values.id
            values.cardId = that.record.id
          }

          _api(values)
            .then((res) => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    depUserChange(depId,userId){
      this.form.setFieldsValue({
        'careDepartmentId':depId,
        'careUserId':userId
      })
    }
  }
}
</script>
<style scoped>
.wdf-custom-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
.wdf-custom-form-wrapper >>> .custom-table td {
  padding: 5px 10px;
  text-align: center;
}

.wdf-custom-form-wrapper >>> .ant-upload-list-picture-card .ant-upload-list-item-info::before{
  left: 0;
}
</style>

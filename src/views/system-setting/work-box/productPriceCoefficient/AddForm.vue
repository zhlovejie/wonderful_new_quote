<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
    :confirmLoading="spinning" 
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">名称</td>
            <td>
              <a-form-item>
                <a-input v-decorator="['name',{rules: [{required: true,message: '输入名称'}]}]" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['id']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>系数</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="4"
                  v-decorator="['coefficient', { rules: [{ required: true, message: '请输入系数' }]}]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>税率</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="['tax', { rules: [{ required: true, message: '请输入税率' }]}]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>A类价格系数</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="['apriceCoefficient', { rules: [{ required: true, message: '请输入A类价格系数' }]}]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>B类价格系数</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="['bpriceCoefficient', { rules: [{ required: true, message: '请输入B类价格系数' }]}]"
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>C类价格系数</td>
            <td>
              <a-form-item>
                <a-input-number
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="['cpriceCoefficient', { rules: [{ required: true, message: '请输入C类价格系数' }]}]"
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
  productPriceCoefficientAddAndUpdate,
  productPriceCoefficientDetail,
} from '@/api/workBox'
import moment from 'moment'
export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      actionType: 'add',
      spinning: false
    }
  },
  computed: {
    modalTitle() {
      return this.isAdd ? '新增' : '修改'
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    }
  },
  methods: {
    moment: moment,
    disabledDate(current) {
      return current && current < this.moment().endOf('day')
    },
    init() {
      let that = this
      return Promise.all([])
    },
    async handleOk() {
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      that.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          values.type = that.record.type
          //提交
          that.spinning = true
          productPriceCoefficientAddAndUpdate(values)
            .then(res => {
              that.spinning = false
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch(err => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.form.resetFields()
      await that.init()
      that.visible = true
      if (that.isAdd) {
        return
      }
      //填充数据
      productPriceCoefficientDetail({id:that.record.id}).then(res =>{
        that.$nextTick(() => that.form.setFieldsValue(res.data))
      })
    }
  }
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
.add-form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}
</style>
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
            <td style="width:150px;">逾期天数(天):</td>
            <td>
              <a-form-item hidden>
                <a-input v-decorator="['id']" />
              </a-form-item>
              <a-form-item>
                <a-input-number 
                  :min="0"
                  :precision="0" 
                  step="1" 
                  style="width:100%;" 
                  v-decorator="['overdueDay',{rules: [{required: true,message: '请输入逾期天数'}]}]" 
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:150px;">罚款(元)</td>
            <td>
              <a-form-item>
                <a-input-number 
                  :min="0"
                  step="1" 
                  style="width:100%;" 
                  v-decorator="['forfeit',{rules: [{required: true,message: '请输入罚款'}]}]" 
                />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:150px;">是否转为公共客户</td>
            <td>
              <a-form-item>
                <a-radio-group v-decorator="['becomePublic', {rules: [{required: true,message: '请选择是否转为公共客户'}]}]">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="2">否</a-radio>
                </a-radio-group>
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
  customerPunishDetailAddOrUpdate
} from '@/api/customerReleaseRule'
import moment from 'moment'
export default {
  name: 'RuleForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      actionType: 'add',
      spinning: false,
      record:{}
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
      return this.actionType.toLowerCase().includes('add')
    },
    isEdit() {
      return this.actionType.toLowerCase().includes('edit')
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
          //debugger
          if(that.isAdd){
            values.ruleId = that.record.id
          }else if(that.isEdit){
            values.id = that.record.id
            values.ruleId = that.record.ruleId
          }
          
          //提交
          that.spinning = true
          customerPunishDetailAddOrUpdate(values)
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
      that.$nextTick(() => that.form.setFieldsValue(that.record))
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
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
            <td style="width:150px;">规则名称</td>
            <td>
              <a-form-item>
                <a-input v-decorator="['ruleName',{rules: [{required: true,message: '输入规则名称'}]}]" />
              </a-form-item>
              <a-form-item hidden>
                <a-input v-decorator="['id']" />
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
  customerPunishRuleAddOrUpdate
} from '@/api/customerReleaseRule'
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
          //提交
          that.spinning = true
          customerPunishRuleAddOrUpdate(values)
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
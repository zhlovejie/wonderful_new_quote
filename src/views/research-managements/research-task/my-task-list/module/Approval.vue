<template>
  <a-modal title="驳回意见" :width="600" :visible="visible" @ok="handleOk" @cancel="handleCancel" :maskClosable="false">
    <a-form :form="form" class="approval-modal-form-wrapper">
      <a-form-item>
        <a-textarea
          placeholder="驳回意见"
          :rows="2"
          v-decorator="['opinion', { rules: [{ required: true, message: '请输入驳回意见' }] }]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'ApprovalModal',
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this, { name: 'ApprovalModal' }),
    }
  },
  methods: {
    query(type, record) {
      console.log(record)
      this.form.resetFields() // 清空表
      this.visible = true
    },
    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          that.$emit('opinionChange', values.opinion)
          that.form.resetFields() // 清空表
          that.visible = false
        }
      })
    },
    handleCancel() {
      let that = this
      that.form.resetFields() // 清空表
      that.visible = false
    },
  },
}
</script>
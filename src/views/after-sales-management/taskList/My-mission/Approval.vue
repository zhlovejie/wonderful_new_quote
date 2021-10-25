<template>
  <a-modal
    :title="modalTitle"
    :width="500"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form :form="form" class="approval-modal-form-wrapper">
      <a-form-item>
        <a-textarea
          placeholder="原因（必填）"
          :rows="2"
          v-decorator="['opinion', { rules: [{ required: true, message: '请输入原因' }] }]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { rejectTaskDocument, overTaskDocument } from '@/api/after-sales-management'
export default {
  name: 'ApprovalModal',
  data() {
    return {
      visible: false,
      record: {},
      type: null,
      form: this.$form.createForm(this, { name: 'ApprovalModal' }),
    }
  },
  computed: {
    modalTitle() {
      let txt =
        this.type === 'reject'
          ? `确定要驳回任务单[${this.record.taskNum}]吗？`
          : `确定要完结任务单[${this.record.taskNum}]吗？`
      return `${txt}`
    },
  },
  methods: {
    query(type, record) {
      this.type = type
      this.record = record
      this.form.resetFields() // 清空表
      this.visible = true
    },
    submitActionrejectTaskDocument(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      rejectTaskDocument(values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('opinionChange')
        })
        .catch((err) => (that.spinning = false))
    },

    overTaskDocument(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      overTaskDocument(values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('opinionChange')
        })
        .catch((err) => (that.spinning = false))
    },

    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          if (this.type === 'reject') {
            this.submitActionrejectTaskDocument({
              isAdopt: 1,
              opinion: values.opinion,
            })
          }
          if (this.type === 'end') {
            this.overTaskDocument({
              isAdopt: 1,
              opinion: values.opinion,
            })
          }
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
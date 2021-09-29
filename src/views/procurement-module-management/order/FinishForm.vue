<template>
  <a-modal
    title="采购完成"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        class="ask-price-form-wrapper"
      >
        <a-form-model-item
          label="申请理由"
          prop="reason"
        >
          <a-input
            v-model="form.reason"
            type="textarea"
            placeholder="申请理由"
          />
        </a-form-model-item>
        <a-form-model-item label="申请人">
          {{userInfo.trueName}}
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { orderFinish} from '@/api/procurementModuleManagement'
export default {
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      form: {},
      rules: {
        reason: [{ required: true, message: '请输入申请理由' }]
      },
      visible: false,
      spinning: false,
      record: {},
      detail: {}
    }
  },
  computed: {
    footer() {
      const that = this
      const h = that.$createElement
      const btn = []
      btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
      btn.push(
        h(
          'a-button',
          {
            key: 'submit',
            on: { click: () => that.handleSubmit() },
            props: { type: 'primary', loading: that.spinning }
          },
          '提交'
        )
      )
      return btn
    }
  },
  methods: {
    query(record) {
      const that = this
      that.record = { ...record }
      that.visible = true
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            orderId: that.record.id,
            reason: that.form.reason
          }
          that.spinning = true
          orderFinish(params)
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finished')
                that.handleCancel()
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.info(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel() {
      this.resetForm()
      this.visible = false
    }
  }
}
</script>

<style scoped>
.ask-price-form-wrapper >>> .ant-card {
  margin-bottom: 20px;
}
.ask-price-form-wrapper >>> .ant-card:last-child {
  margin-bottom: 0;
}
.ask-price-form-wrapper >>> .ant-card .ant-card-body {
  padding: 10px 0;
}
.ask-price-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
</style>

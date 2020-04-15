<template>
  <a-modal
    title="填写放弃原因"
    :width="640"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
  >
    <div>
      <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
        <a-form-item label="放弃原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择放弃原因" v-decorator="['reason',{rules: [{required: true, message: '请选择放弃原因！'}]}]">
            <a-select-option v-for="reason in this.reasons" :key="reason.index" :value="reason.id">{{ reason.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="详情" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
          <a-textarea v-decorator="['content',{rules: [{required: true,max: 25,message: '请填写详情，最多25个字符！'}]}]"/>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { getDictionary } from '@/api/common'
import { giveUp } from '@/api/customer'

export default {
  name: 'GiveUp',
  components: { ATextarea },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      reasons: [], // 所有放弃客户打原因
      cId: 0
    }
  },
  created () {
    getDictionary({ text: '放弃客户原因' }).then(res => {
      this.reasons = res.data
    })
  },
  methods: {
    showForm (cId) {
      this.visible = true
      this.cId = cId
    },
    handleCancel () {
      this.form.resetFields() // 清空表
      this.visible = false
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields((errors, values) => {
        if (!errors) {
          this.$set(values, 'customerId', this.cId)
          giveUp({ giveUp: values, customerId: this.cId }).then(res => {
            if (res.code === 200) {
              this.visible = false
              this.$emit('ok')// 刷新父组件
            } else {
              this.$message.error(res.msg)
            }
            this.confirmLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

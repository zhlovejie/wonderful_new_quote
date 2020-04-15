<template>
  <a-modal
    :title="title"
    okText="保存"
    :width="540"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="工序名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input @blur="checkName()" v-decorator="['processName',{rules: [{required: true, min: 1, message: '工序名称不可为空！'}]}]"/>
        </a-form-item>
        <a-form-item label="是否需要图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['needPicture',{initialValue: 0}]">
            <a-radio :value="0">否</a-radio>
            <a-radio :value="1">是</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { checkProcessName, addOrUpdateProcess } from '@/api/production/retrospect'

export default {
  data () {
    return {
      title: '',
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
      layout: 'inline', // 表单布局方式
      ppId: 0
    }
  },
  name: 'CreateForm',
  methods: {
    add () { // 父页面点击新增调用
      this.title = '新增工序'
      this.visible = true
    },
    edit (record) { // 父页面点击修改调用
      this.title = '修改工序'
      this.visible = true
      this.ppId = record.ppId
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue({
          processName: record.processName,
          needPicture: record.needPicture
        })
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields((errors, values) => {
        if (!errors) {
          this.$set(values, 'ppId', this.ppId)
          addOrUpdateProcess(values).then(res => {
            if (res.code === 200) {
              this.handleCancel()
              this.$emit('ok')// 刷新父组件
            } else {
              this.$message.error(res.msg)
            }
          })
        }
        this.confirmLoading = false
      })
    },
    handleCancel () {
      this.form.resetFields() // 清空表
      this.visible = false
      this.ppId = 0
    },
    checkName () {
      var param = {}
      if (this.form.getFieldValue('processName') === undefined || this.form.getFieldValue('processName').length < 1) {
        return
      } else {
        param = { processName: this.form.getFieldValue('processName'), ppId: this.ppId }
      }
      checkProcessName(param).then(res => {
        if (res.code !== 200) {
          this.form.setFields({ 'processName': { value: '', errors: [{ 'message': res.msg, 'field': 'processName' }] } })
        }
      })
    }
  }
}
</script>

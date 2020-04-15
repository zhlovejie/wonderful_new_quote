<template>
  <a-modal
    title="新增软件产品"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="产品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择产品名称" v-decorator="['name',{rules: [{required: true, message: '请选择产品名称!'}]}]">
            <a-select-option v-for="name in softwareProductNames" :key="name.index" :value="name.id">{{ name.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="版本" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入版本" v-decorator="['version',{rules: [{required: true, message: '请输入版本！'}]}]"/>
        </a-form-item>
        <a-form-item label="功能点" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select mode="multiple" placeholder="请选择功能点" @change="handleChange" v-decorator="['function',{rules: [{required: true, message: '请选择功能点!'}]}]">
            <a-select-option v-for="sf in softwareFunctions" :key="sf.index" :value="sf.text">{{ sf.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addSoftwareProduct } from '@/api/workBox'
import { getDictionary } from '@/api/common'

export default {
  name: 'CreateForm',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      softwareProductNames: [], // 所有的软件产品名称
      softwareFunctions: [] // 所有的软件功能
    }
  },
  created (record) { // 初始化钩子,获取所有产品类型
    getDictionary({ text: '软件产品名称' }).then(res => {
      this.softwareProductNames = res.data
    })
    getDictionary({ text: '软件产品功能点' }).then(res => {
      this.softwareFunctions = res.data
    })
  },
  methods: {
    add () { // 父页面点击新增调用
      this.visible = true
    },
    handleSubmit () {
      this.form.setFieldsValue({
        'function': this.functions
      })
      const { form: { validateFields } } = this
      this.confirmLoading = true
      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields((errors, values) => {
        if (!errors) {
          addSoftwareProduct(values).then(res => {
            if (res.code === 200) {
              this.handleCancel()
              this.$emit('ok')// 刷新父组件
            } else {
              this.$message.error(res.msg)
            }
          }).catch(function (err) {
            console.log(err)
          })
        }
        this.confirmLoading = false
      })
    },
    handleChange(value) {
      this.functions = value.join(',')
    },
    handleCancel () {
      this.form.resetFields() // 清空表
      this.visible = false
    }
  }
}
</script>
<template>
  <a-modal title="新增" v-model="visible" @ok="handleSubmit()" okText="确认" cancelText="取消" :maskClosable="false">
    <a-form :form="form">
      <a-form-item label="上级" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <span>售后分析问题类型</span>
      </a-form-item>
      <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="['text', { rules: [{ required: true, message: '请输入名称！' }] }]" />
      </a-form-item>
      <a-form-item label="编码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="['code', { rules: [{ required: true, message: '请输入编码！' }] }]" />
      </a-form-item>
      <a-form-item label="备注" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-textarea v-decorator="['remarks', { rules: [{ required: false, message: '请输入编码！' }] }]" :rows="4" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getDictionaryByText, getDictionaryByCode, dictionaryAdd } from '@/api/workBox'
export default {
  name: 'EnterpriseSynopsis',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      parentId: '',
      form: this.$form.createForm(this),
    }
  },
  methods: {
    query(type, record) {
      this.form.resetFields() // 清空表
      this.visible = true
    },
    // 点击确定提交
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (err === true) {
          console.error('表单验证失败：', values)
          return false
        }
        const params = { text: values.text.trim() }
        let _this = this
        getDictionaryByCode({ code: 'After_sales_analysis01' }).then((res) => {
          this.parentId = res.data.id
        })
        getDictionaryByText(params).then((res) => {
          if (res.data.length > 0) {
            _this.$message.error('名称重复')
            return
          }
          _this.doAdd()
        })
      })
    },
    doAdd() {
      // 取数据
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          values.parentId = this.parentId
          dictionaryAdd(values)
            .then((res) => {
              if (res.code === 200) {
                this.visible = false
                this.$emit('ok')
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch((error) => {
              console.error(error)
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    close() {
      this.$emit('ok')
      this.fileList = []
      this.fileList1 = []
      this.form.resetFields() // 清空表
      this.visible = false
    },

    handleCancel() {
      this.close()
    },
  },
}
</script>

<style>
</style>

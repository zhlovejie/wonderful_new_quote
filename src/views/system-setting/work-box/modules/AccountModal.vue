<template>
  <a-modal
    v-if="visible"
    :title="titleType"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="id" hidden>
          <a-input v-decorator="['id', {}]"/>
        </a-form-item>
        <a-form-item
          label="单位名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入单位名称"
            v-decorator="['unitName', { rules: [{ required: true, message: '请输入单位名称!' }] }]"
           />
        </a-form-item>

        <a-form-item
          label="纳税人识别号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入纳税人识别号" 
            v-decorator="['taxPayer']"
            />
        </a-form-item>
        <a-form-item
          label="地址"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入地址"
            v-decorator="['address']"
            />
        </a-form-item>
        <a-form-item
          label="电话"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入电话"
            v-decorator="['tel']"
          />
        </a-form-item>
        <a-form-item
          label="开户行名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入开户行名称"
            v-decorator="['bankName']"/>
        </a-form-item>
        <a-form-item
          label="行号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入行号"
            v-decorator="['bankNum']"/>
        </a-form-item>
        <a-form-item
          label="账号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入账号"
            v-decorator="['accountNum', {
              rules: [{
                required: true, message: '请输入账号!',
              }]
            }]"/>
        </a-form-item>
      </a-form>
      <span style="color: #cf1322">*注：银行卡开户行/税号信息需要填写全部信息</span>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveBank, editBank } from '@/api/accountBank'

export default {
  name: 'AccountModal',
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
      visible: false,
      confirmLoading: false,
      addOredit: 'save',
      queryBoolean: false,
      titleType: ''
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    add (obj = {}) {
      this.addOredit = 'save'
      this.titleType = '新增'
      this.toolType = obj.toolType || '0'
      this.visible = true
    },
    edit (record) {
      console.log('record', record)
      this.titleType = '编辑'
      this.addOredit = 'edit'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },
    query (record) {
      this.queryBoolean = true
      this.addOredit = 'edit'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },
    close () {
      this.$emit('ok')
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          if (_this.addOredit == 'save') {
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            values.toolType = _this.toolType || 0
            saveBank(values).then((data) => {
              console.log('date', data)
              if (data.code == 200) {
                _this.$message.success('保存成功')
              } else {
                _this.$message.error(data.msg)
              }
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              _this.close()
            })
          } else if (this.addOredit == 'edit') {
            _this.$set(values, 'Authorization', _this.$store.getters.token)
            editBank(values).then((data) => {
              if (data.code == 200) {
                _this.$message.success('修改成功')
              } else {
                _this.$message.error(data.msg)
              }
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              _this.close()
            })
          }
        }
      }
      )
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>

<style scoped>

</style>

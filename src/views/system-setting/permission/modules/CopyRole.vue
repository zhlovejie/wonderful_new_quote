<template>
  <a-modal
    title="复制角色"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="部门">
          <a-select
            placeholder="请选择部门"
            v-decorator="['departmentId', { rules: [{ required: true, message: '请选择部门!' }] }]"
          >
            <a-select-option :value="0">请选择部门</a-select-option>
            <a-select-option v-for="item in options" :value="item.id" :key="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="角色">
          <a-input
            placeholder="请输入角色"
            v-decorator="['roleName', { rules: [{ required: true, message: '请输入角色!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getDevisionList, queryRoleMenu, saveRole } from '@/api/systemSetting'

export default {
  name: 'CopyModal',
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      form: this.$form.createForm(this),
      visible: false,
      options: [],
      confirmLoading: false,
      queryRole: [],
    }
  },
  created() {
    getDevisionList().then((res) => {
      this.options = res.data
    })
  },
  methods: {
    query(record) {
      //   this.queryBoolean = true
      //   console.log('query :' + JSON.stringify(record))
      //   this.mdl = Object.assign({}, record)
      this.visible = true
      queryRoleMenu({ id: record.id }).then((res) => {
        this.queryRole = res.data
      })
      //   this.$nextTick(() => {
      //     this.form.setFieldsValue({ ...record })
      //   })
    },

    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          if (values.roleName.length > 30) {
            _this.$message.error('角色名过长')
            return
          }
          values.saveTreeVo = {
            menuIdList: _this.queryRole,
            notAllMenuIdList: [],
          }
          _this.confirmLoading = true
          saveRole(values)
            .then((data) => {
              if (data.code == 200) {
                _this.$message.success('复制成功')
                _this.confirmLoading = false
                this.visible = true
                _this.$emit('ok')
              } else {
                _this.$message.error(data.msg)
                _this.confirmLoading = true
              }
            })
            .catch((err) => (that.visible = false))
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped>
</style>

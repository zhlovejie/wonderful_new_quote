<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
      >
        <a-form-model-item
          ref="groupName"
          label="组别名称"
          prop="groupName"
        >
          <a-input
            v-model="form.groupName"
            @blur="
            () => {
              $refs.groupName.onFieldBlur();
            }
          "
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { materialGroupAddOrUpdate } from '@/api/bomManagement'

export default {
  name: 'AddGroupForm',
  data() {
    return {
      modalTitle: '新增BOM组',
      visible: false,
      spinning: false,
      form: {},
      rules: {
        groupName: [{ required: true, message: '请输入组别名称', trigger: 'blur' }]
      },
      detail: {}
    }
  },
  computed: {},
  methods: {
    async query({__selectItem }) {
      const that = this
      that.visible = true
      that.detail = __selectItem
      that.form = {
        parentId: __selectItem.key
      }
    },

    handleSubmit() {
      const that = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.spinning = true
          materialGroupAddOrUpdate(that.form)
            .then(res => {
              that.spinning = false
              that.$message.success(res.msg)
              if (+res.code === 200) {
                that.$emit('finish', { key: that.detail.key })
                that.handleCancel()
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields()
      this.$nextTick(() => (this.visible = false))
    }
  }
}
</script>
<style scoped>
</style>

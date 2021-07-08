<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="测试项名称">
          <a-input
            placeholder="请输入测试项名称"
            v-decorator="[
              'testItemName',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入测试项名称!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="测试方法">
          <a-input
            placeholder="请输入测试方法"
            v-decorator="[
              'testMethod',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入测试方法!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="测试合格标准">
          <a-input
            placeholder="请输入测试合格标准"
            v-decorator="[
              'qualifiedStandard',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入测试合格标准!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="测试次数">
          <a-input
            placeholder="请输入测试次数"
            v-decorator="[
              'testNum',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入测试次数!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'FeasibilityForm',
  data() {
    return {
      visible: false,
      department: [],
      userList: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      form: this.$form.createForm(this),
      confirmLoading: false,
      actionType: 'add',
      detail: {},
    }
  },
  computed: {
    modalTitle() {
      return this.isAdd ? '新增测试项' : '修改测试项'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
  },
  methods: {
    query(actionType, record) {
      let that = this
      that.form.resetFields()
      that.visible = true
      that.actionType = actionType
      that.detail = Object.assign({}, record || {})
      if (that.isEdit) {
        that.$nextTick(() => that.form.setFieldsValue({ ...record }))
      }
    },
    handleOk() {
      const that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          that.$emit('ok', values)
          that.handleCancel()
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>



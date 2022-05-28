<template>
  <a-modal
    title="上传"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-form-model-item
        prop="fileName"
        label="文件名称"
        :rules="{
          required: true,
          message: '请输入文件名称',
          trigger: 'blur'
        }"
      >
        <a-input v-model="form.fileName" style="width:100%;" :allowClear="true" />
      </a-form-model-item>
      <a-form-model-item
        prop="fileUrl"
        label="文件"
        :rules="{
          required: true,
          message: '请上传文件',
          trigger: 'blur'
        }"
      >
        <UploadFile :config="uploadConfig" @change="fileChange" />
      </a-form-model-item>
      <a-form-model-item
        prop="remark"
        label="备注"
        style="dispaly:block;"
        :rules="{
          required: false,
          message: '请输入备注',
          trigger: 'blur'
        }"
      >
        <a-textarea placeholder="备注" :autoSize="true" style="width:100%;" v-model="form.remark" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import UploadFile from './UploadFile'
export default {
  name: 'UploadFileModel',
  components: {
    UploadFile
  },
  data() {
    return {
      form: {},
      rules: {},
      visible: false,
      uploadConfig: {
        maxFileCount: 1
      },
      record: {}
    }
  },
  methods: {
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.$emit('change', { record: that.record, form: { ...that.form } })
          that.handleCancel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    query(record) {
      this.record = record
      this.form = {}
      this.visible = true
    },
    fileChange(files) {
      if (Array.isArray(files) && files.length === 1) {
        let file = files[0]
        this.form = {
          ...this.form,
          fileName: file.name,
          fileUrl: file.url
        }
      } else {
        this.form = {
          ...this.form,
          fileName: '',
          fileUrl: ''
        }
      }
    }
  }
}
</script>

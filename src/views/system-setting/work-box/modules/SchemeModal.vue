<template>
  <a-modal
    v-if="visible"
    title="操作"
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
          <a-input v-decorator="['id', {}]" />
        </a-form-item>
        <a-form-item label="type" hidden>
          <a-input v-decorator="['type', {}]" />
        </a-form-item>
        <a-form-item label="文件名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="queryBoolean"
            placeholder="请输入文件名称"
            v-decorator="[
              'fileName',
              {
                rules: [
                  {
                    type: 'string',
                    message: '请输入正确文件名称!',
                  },
                  {
                    required: true,
                    message: '请输入文件名称!',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            v-if="type === 1 || type === 2 || type === 3"
            accept=".docx,.doc,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            name="files"
            :multiple="true"
            :action="this.uploadPath"
            :fileList="fileList"
            @change="handleChange"
          >
            <a-button> <a-icon type="upload" /> 上传（.docx、.doc类型） </a-button>
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel"> </a-modal>
          </a-upload>
          <a-upload
            v-if="type === 4 || type === 5"
            accept="image/*,.pdf"
            name="files"
            :multiple="true"
            :action="this.uploadPath"
            :fileList="fileList"
            @change="handleChange"
          >
            <a-button> <a-icon type="upload" /> 上传（.pdf、.png类型） </a-button>
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel"> </a-modal>
          </a-upload>
          <a-input type="hidden" v-decorator="['fileUrl', { rules: [{ required: true, message: '请选择文件！' }] }]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveFileManagement, editFileManagement } from '@/api/OperationalScheme'
import { getUploadPath } from '@/api/manage'

export default {
  name: 'SchemeModal',
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      visible: false,
      confirmLoading: false,
      addOredit: 'save',
      queryBoolean: false,
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      fileName: '',
      fileUrl: '',
      type: 0,
      id: 0,
      uploadPath: getUploadPath(),
    }
  },
  methods: {
    add: function (type) {
      this.visible = true
      this.addOredit = 'save'
      this.type = type
      this.$nextTick(() => {
        this.form.setFieldsValue({
          type: type,
        })
      })
    },
    edit: function (record) {
      console.log('record', record)
      this.addOredit = 'edit'
      this.type = +record.type
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          fileName: record.fileName,
          id: record.id,
          fileUrl: record.fileUrl,
        })
      })
      if (record.fileUrl != null && record.fileUrl.length > 0) {
        let fname = record.fileUrl.slice(record.fileUrl.lastIndexOf('/')+1) 
        fname = this.formatFileName(decodeURIComponent(fname))
        console.log(`fname:${fname}`)
        this.fileList = [
          {
            uid: this._uuid(),
            status: 'done',
            name: fname,
            url: record.fileUrl,
          }
        ]
        this.fileName = fname
        this.fileUrl = record.fileUrl
      }
    },
    close() {
      this.$emit('ok')
      this.visible = false
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          if (_this.addOredit == 'save') {
            saveFileManagement(values)
              .then((data) => {
                if (data.code == 200) {
                  _this.$message.success('保存成功')
                } else {
                  _this.$message.error(data.msg)
                }
              })
              .catch(() => {
                // Do something
              })
              .finally(() => {
                _this.confirmLoading = false
                // 清空表单
                _this.form.resetFields()
                // 清空图片
                this.fileList = []
                _this.close()
              })
          } else if (this.addOredit == 'edit') {
            editFileManagement(values)
              .then((data) => {
                if (data.code == 200) {
                  _this.$message.success('修改成功')
                } else {
                  _this.$message.error(data.msg)
                }
              })
              .catch(() => {
                // Do something
              })
              .finally(() => {
                _this.confirmLoading = false
                _this.form.resetFields()
                this.fileList = []
                _this.close()
              })
          }
        }
      })
    },
    previewCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      // 点击文件链接或预览图标时的回调
      this.previewVisible = true
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件必须小于10M!')
        return false
      }
    },
    handleChange({ file, fileList }) {
      // 上传中、完成、失败都会调用这个函数。
      fileList = fileList.slice(-1)
      if (file.status !== 'uploading') {
        console.log(file, fileList)
      }
      if (file != null && file.status === 'done') {
        // 状态有：uploading done error removed
        if (file.response.code === 200) {
          // 成功
          console.log('file.response.data[0]', file.response.data[0])
          this.form.setFieldsValue({ fileUrl: file.response.data[0].url })
        }
      } else if (file.status === 'removed') {
        // 删除清空
        this.form.setFieldsValue({ fileUrl: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    handleCancel() {
      this.close()
      this.fileList = []
    },
    formatFileName(fname){
      let reg = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g
      return fname.replace(reg,'')
    }
  },
}
</script>

<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.input_video {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
</style>

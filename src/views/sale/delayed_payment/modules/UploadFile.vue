<template>
  <a-modal
    title="上传文件"
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
        <a-row class="form-row" :gutter="24">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="欠款单文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-upload
                accept="multiple"
                name="files"
                :multiple="true"
                :action="this.uploadPath"
                :fileList="fileList"
                @change="handleChange">
                <a-button>
                  <a-icon type="upload" /> 上传
                </a-button>
                <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel" :maskClosable="false">
                </a-modal>
              </a-upload>
              <a-input type="hidden" v-decorator="['wordUrl', {rules: [{required: true,message: '请选择文件！'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </div>
  </a-modal>
</template>

<script>
import { getUploadPath } from '@/api/common'
import { changeWordUrl } from '@/api/delayedPayment'
export default {
  name: 'UploadFile',
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
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      fileList: [],
      fileName: '',
      fileUrl: '',
      id: 0,
      uploadPath: getUploadPath()
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    showForm (cId) {
      this.visible = true
      this.cId = cId
    },
    previewCancel () {
      this.previewVisible = false
    },
    handlePreview (file) { // 点击文件链接或预览图标时的回调
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      if (file != null && file.status === 'done') { // 状态有：uploading done error removed
        if (file.response.code === 200) { // 成功
          this.form.setFieldsValue({ wordUrl: file.response.data[0].url })
        }
      } else if (file.status === 'removed') { // 删除清空
        this.form.setFieldsValue({ wordUrl: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
    handleCancel () {
      this.form.resetFields() // 清空表
      this.fileList = []
      this.cId = 0
      this.previewImage = ''
      this.visible = false
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields((errors, values) => {
        if (!errors) {
          this.$set(values, 'delayedPaymentId', this.cId)
          changeWordUrl(values).then(res => {
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
        this.handleCancel()
      })
    }
  }
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
</style>

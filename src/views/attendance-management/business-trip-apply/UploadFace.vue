<template>
  <a-modal
    title="上传回程车票"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    okText="上传"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
  >
    <div>
      <a-form :form="form">
        <a-row class="form-row" :gutter="24">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <div class="clearfix">
                <a-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :file-list="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传回程车票</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancels">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import { getUploadPath2 } from '@/api/common'
import { attenceTravelApplyFinishTravel } from '@/api/attendanceManagement'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'UploadPhoto',

  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
      uploadUrl: getUploadPath2(),
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      layout: 'inline', // 表单布局方式
      record: {},
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }
  },
  methods: {
    query(record) {
      this.visible = true
      this.record = record || {}
      this.fileList = []
      this.previewImage = ''
    },
    handleCancels() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },

    handleUpload() {
      let that = this
      const { fileList } = this
      if (fileList.length > 0) {
        // `id=${that.record.id}&&ticketUrl=${that.fileList[0].response.data}`
        attenceTravelApplyFinishTravel(`id=${that.record.id}&ticketUrl=${that.fileList[0].response.data}`)
          .then((res) => {
            that.$message.info(res.msg)
            if (+res.code === 200) {
              // that.searchAction()
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish') // 刷新父组件
            }
          })
          .catch((err) => {
            that.$message.info(`错误：${err.message}`)
          })
      }
    },
    handleCancel() {
      this.form.resetFields() // 清空表
      this.fileList = []
      this.visible = false
      this.previewVisible = false
      this.confirmLoading = false
    },
    handleSubmit() {
      this.handleUpload()
    },
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
/* tile uploaded pictures */
.upload-list-inline >>> .ant-upload-list-item {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline >>> .ant-upload-animate-enter {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline >>> .ant-upload-animate-leave {
  animation-name: uploadAnimateInlineOut;
}
</style>

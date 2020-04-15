<template>
  <a-modal
    title="上传附件"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
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
                  name="files"
                  :fileList="fileList" 
                  :remove="handleRemove" 
                  :beforeUpload="beforeUpload" 
                  style="margin-left: 8px">
                  <a-button>选择文件</a-button>
                </a-upload>
              </div>
              <a-input type="hidden" v-decorator="['accessory']"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import { getUploadPath } from '@/api/common'
import {reserveUpdateResume} from '@/api/reserveApi'
export default {
  name: 'UploadPhoto',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 }
      },
      form: this.$form.createForm(this), // 只有这样注册后，才能通过表单拉取数据
      visible: false, // 表单对话框是否可见
      confirmLoading: false, // 确定按钮后是否显示加载图 loading
      layout: 'inline', // 表单布局方式
      uploadPath: getUploadPath(), // 上传图片的url
      fileList: [], // 图片文件集合
      aceptFileTypes:['.doc','.docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      record:{}
    }
  },
  methods: {
    showForm (record) {
      this.visible = true
      this.fileList = []
      this.record = record || {}
      if(this.record.resume){
        const url = this.record.resume
        const file = url.split('/')
        const fileName = file[file.length - 1]
        this.fileList = [{
          uid: 0,
          name: fileName,
          status: 'done',
          url: this.record.resume
        }]
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList
    },
    beforeUpload(file) {
      let _aceptFileTypes = this.aceptFileTypes
      const isDocType = _aceptFileTypes.includes(file.type)
      if (!isDocType) {
        this.$message.error('只支持上传.doc,.docx的Word文档!');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('Word文档必须小于10M!');
      }
      if(isDocType && isLt10M){
        this.fileList = [file]
      }
      return false
    },
    handleUpload() {
      let that = this
      const { fileList } = this;
      if(fileList.length === 0){
        that.$message.info('您还没有上传附件')
        return 
      }
      const formData = new FormData();
      formData.append('file',fileList[0])
      formData.append('reserveId',this.record.id)
      that.confirmLoading = true
      reserveUpdateResume(formData).then(res =>{
        that.confirmLoading = false
        that.visible = false
        this.$message.info(res.msg)
        that.$emit('finish')// 刷新父组件
      })
    },
    handleCancel () {
      this.form.resetFields() // 清空表
      this.fileList = []
      this.visible = false
      this.confirmLoading = false
    },
    handleSubmit () {
      this.handleUpload()
    },
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

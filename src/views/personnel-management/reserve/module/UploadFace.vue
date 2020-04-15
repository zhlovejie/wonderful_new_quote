<template>
  <a-modal
    title="上传人脸照片"
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
                  name="files"
                  :fileList="fileList" 
                  :remove="handleRemove" 
                  :beforeUpload="beforeUpload" 
                >
                  <div v-if="fileList.length < 1">
                    <a-button> <a-icon type="upload" /> 选择照片 </a-button>
                  </div>
                </a-upload>
              </div>
            </a-form-item>
          </a-col>
          <a-col :lg="24" :md="24" :sm="24" v-if="previewImage">
            <img :src="previewImage" style="width:80%;height:auto;overflow:hidden;box-shadow: 0 0 12px #ccc;border-radius: 3px;" alt="人脸照片" />
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import { getUploadPath } from '@/api/common'
import {reserveFaceAdd} from '@/api/reserveApi'
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
      fileList: [], // 图片文件集合
      record:{},
      previewImage:''
    }
  },
  methods: {
    query (record) {
      this.visible = true
      this.record = record || {}
      this.fileList = []
      this.previewImage = ''
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList
      this.previewImage = ''
    },
    beforeUpload(file) {
      let that = this
      let isAceptFileTpe = ['jpeg','png'].some(type => file.type.endsWith(type))
      if (!isAceptFileTpe) {
        this.$message.error('只支持上传.png,.jpg,.jpeg格式的图片!')
        return false 
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传图片必须小于10M!');
        return false 
      }
      that.fileList = [...this.fileList, file]
      let fileReader = new FileReader()
      fileReader.onload = function(e){
        that.previewImage = e.target.result
      }
      fileReader.readAsDataURL(file)
      return false
    },
    handleUpload() {
      let that = this
      const { fileList } = this;
      const formData = new FormData();
      formData.append('file',fileList[0])
      formData.append('userId',that.record.userId)
      that.confirmLoading = true
      reserveFaceAdd(formData).then(res =>{
        that.confirmLoading = false
        if(res.code === 200){
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')// 刷新父组件
        }else{
          that.$message.info(res.msg)
        }
      }).catch(err =>{
        console.log(err)
        that.$message.error(err.message)
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

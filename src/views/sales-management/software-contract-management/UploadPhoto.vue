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
            <a-form-item label="照片" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <div class="clearfix">
                <a-upload
                  accept="multiple"
                  name="files"
                  :action="this.uploadPath"
                  listType="picture-card"
                  :fileList="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 3">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">选择图片</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel" :maskClosable="false">
                  <img alt="图片" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
              <a-input type="hidden" v-decorator="['photo']"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="24">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <div class="clearfix">
                <!-- <a-upload
                  :action="this.uploadPath"
                  listType="picture"
                  :defaultFileList="accessoryList"
                  class="upload-list-inline"
                  @preview="accessoryPreview"
                  @change="accessoryChange"
                >
                  <a-button>
                    <a-icon type="upload" /> 上传
                  </a-button>
                </a-upload> -->
                
                <a-upload
                  accept="multiple"
                  name="files"
                  :action="this.uploadPath"
                  :fileList="accessoryList"
                  @change="accessoryChange" 
                >
                  <a-button> <a-icon type="upload" /> 选择文件 </a-button>
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
import { updateSoftwareContract } from '@/api/contractListManagement'

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
      previewVisible: false, // 图片预览框是否可见
      accessoryVisible: false, // 附件图片预览框是否可见
      previewImage: '', //  预览图片的src值
      accessorySrc: '', //  附件预览图片的src值
      fileList: [], // 图片文件集合
      accessoryList: [], // 附件文件集合
      photoUrls: '', // 已经上传的照片的url
      accessoryUrls: '', // 已经上传的附件的url
      cId: 0 // 合同id
    }
  },
  methods: {
    showForm (record) {
      this.visible = true
      this.cId = record.id
      var photos = record.photo
      if (photos != null && photos.length > 0) {
        const urls = photos.split(',')
        for (var i = 0; i < urls.length; i++) {
          const url = urls[i]
          const file = url.split('/')
          const fileName = file[file.length - 1]
          this.fileList[i] = {
            uid: i,
            name: fileName,
            status: 'done',
            url: url
          } // 图片预览缩略图
        }
        this.photoUrls = photos
      }
      var accessorys = record.accessory
      if (accessorys != null && accessorys.length > 0) {
        const urls = accessorys.split(',')
        for (var i = 0; i < urls.length; i++) {
          const url = urls[i]
          const file = url.split('/')
          const fileName = file[file.length - 1]
          this.accessoryList[i] = {
            uid: i,
            name: fileName,
            status: 'done',
            url: url
          } // 图片预览缩略图
        }
        this.accessoryUrls = accessorys
      }
    },
    previewCancel () {
      this.previewVisible = false
    },
    accessoryCancel () {
      this.accessoryVisible = false
    },
    handlePreview (file) { // 点击文件链接或预览图标时的回调
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    accessoryPreview (file) { // 点击文件链接或预览图标时的回调
      // this.$confirm({
      //   title: '下载文件',
      //   content: h => file.name,
      //   onOk() {
      //     window.location.href = file.url || file.thumbUrl
      //   },
      //   onCancel() {}
      // })
    },
    handleChange ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      if (file != null && file.status === 'done') { // 状态有：uploading done error removed
        if (file.response.code === 200) { // 成功
          if (this.photoUrls != '' && this.photoUrls.length > 0) {
            this.photoUrls += ',' + file.response.data[0].url
          } else {
            this.photoUrls = file.response.data[0].url
          }
        }
      } else if (file.status === 'removed') { // 删除清空
        let url = ''
        if (file.response !== undefined) {
          url = file.response.data[0].url
        } else {
          url = file.url
        }
        this.photoUrls = this.photoUrls.replace(',' + url, '')
        this.photoUrls = this.photoUrls.replace(url, '')
      } else if (file.status === 'error') {
        this.$message.error('上传图片失败！')
      }
      this.form.setFieldsValue({ photo: this.photoUrls })
      this.fileList = fileList // 展示照片墙
    },
    accessoryChange ({ file, fileList }) { // 上传中、完成、失败都会调用这个函数。
      if (file != null && file.status === 'done') { // 状态有：uploading done error removed
        if (file.response.code === 200) { // 成功
          if (this.accessoryUrls != '' && this.accessoryUrls.length > 0) {
            this.accessoryUrls += ',' + file.response.data[0].url
          } else {
            this.accessoryUrls = file.response.data[0].url
          }
        }
      } else if (file.status === 'removed') { // 删除清空
        let url = ''
        if (file.response !== undefined) {
          url = file.response.data[0].url
        } else {
          url = file.url
        }
        this.accessoryUrls = this.accessoryUrls.replace(',' + url, '')
        this.accessoryUrls = this.accessoryUrls.replace(url, '')
      } else if (file.status === 'error') {
        this.$message.error('上传附件失败！')
      }
      this.form.setFieldsValue({ accessory: this.accessoryUrls })
      this.accessoryList = fileList // 展示照片墙
    },
    handleCancel () {
      this.form.resetFields() // 清空表
      this.fileList = []
      this.accessoryList = []
      this.cId = 0
      this.previewImage = ''
      this.accessorySrc = ''
      this.visible = false
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      // 通过validateFields的方法，能够校验必填项是否有值，若无，则页面会给出警告！
      // 执行this.form.resetFields()，则会将表单清空。
      validateFields((errors, values) => {
        if (!errors) {
          this.$set(values, 'id', this.cId)
          this.$set(values, 'contractModifyFlag', 0)
          updateSoftwareContract(values).then(res => {
            if (res.code === 200) {
              this.visible = false
              this.$emit('ok')// 刷新父组件
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
      this.confirmLoading = false
    },
    splitStr (str) { // 去除最后的逗号
      if(str != '') {
        const lastChar = str.substring(str.length - 1, str.length)
        if (lastChar === ',') {
          str = str.substring(0, str.length - 1)
        }
        return str
      }
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

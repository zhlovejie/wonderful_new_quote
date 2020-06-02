<template>
  <a-modal
    title="上传产品图片"
    :width="500"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form>
      <a-form-item label="产品图片">
        <a-upload
          name="file"
          :action="uploadUrl"
          :multiple="false"
          :beforeUpload="beforeUpload"
          :fileList="fileList"
          @change="handleChange"
        >
          <a-button v-if="fileList.length === 0">
            <a-icon type="upload" />上传
          </a-button>
        </a-upload>
        <p>
          <img v-if="previewImage" :src="previewImage" alt="头像图片" style="max-width:80%;height:auto;overflow:hidden;" />
        </p>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getUploadPath2 } from '@/api/common'
export default {
  name: 'uploadFile',
  data() {
    return {
      uploadUrl: getUploadPath2(),
      fileList: [],
      visible:false,
      previewImage:''
    }
  },
  methods: {
    query(){
      this.fileList = []
      this.previewImage = ''
      this.visible = true
    },
    beforeUpload(file) {
      let that = this
      const isAceptFileTpe = ['jpeg','png','gif','bmp'].some(type => file.type.endsWith(type))
      if (!isAceptFileTpe) {
        this.$message.error('只支持上传.jpeg .png .gif .bmp 格式的图片!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件必须小于10M!')
      }
      return  isAceptFileTpe && isLt10M
    },
    handleChange(info) {
      let that = this
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList.filter(f => this.checkFile(f))
      
      let target = this.fileList.find(f => !!f.url)
      this.previewImage = target ? target.url : ''
    },
    checkFile(file) {
      const isAceptFileTpe = ['jpeg','png','gif','bmp'].some(type => file.type.endsWith(type))
      const isLt10M = file.size / 1024 / 1024 < 10
      return isAceptFileTpe && isLt10M
    },
    getFiles() {
      return this.fileList.map(f => Object.assign({}, f))
    },
    setFiles(files) {
      this.fileList = files.map(f => {
        return {
          uid: Math.random()
            .toString(16)
            .slice(-10),
          name: f.url,
          status: 'done',
          url: f.url
        }
      })
      let target = this.fileList.find(f => !!f.url)
      this.previewImage = target ? target.url : ''
    },
    handleOk(){
      this.$emit('change',[...this.fileList])
      this.handleCancel()
    },
    handleCancel(){
      this.$nextTick(() => this.visible = false)
    }
  }
}
</script>

<style scoped>
</style>
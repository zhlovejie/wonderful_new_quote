<template>
  <div class="upload-file-wrapper">
  <a-upload
    name="file"
    listType="picture-card"
    :action="uploadUrl"
    :multiple="false"
    :beforeUpload="beforeUpload"
    :fileList="fileList"
    @change="handleChange"
  >
    <div v-if="fileList.length < 1">
      <a-icon type="plus" />
      <div class="ant-upload-text">上传</div>
    </div>
  </a-upload>
  </div>
</template>

<script>
import { getUploadPath2 } from '@/api/common'
export default {
  name: 'uploadFile',
  data() {
    return {
      uploadUrl: getUploadPath2(),
      fileList: [],
      aceptFileTypes: [
        '.doc',
        '.docx',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
    }
  },
  methods: {
    beforeUpload(file) {
      //let _aceptFileTypes = this.aceptFileTypes
      // const isDocType = _aceptFileTypes.includes(file.type)
      // if (!isDocType) {
      //   this.$message.error('只支持上传.doc,.docx的word文档!')
      // }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件必须小于10M!')
      }
      return  isLt10M
    },
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-3)
      fileList = fileList.map(file => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList.filter(f => this.checkFile(f))
    },
    checkFile(file) {
      //const isDocType = this.aceptFileTypes.includes(file.type)
      const isLt10M = file.size / 1024 / 1024 < 10
      return isLt10M
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
    }
  }
}
</script>

<style scoped>
  .upload-file-wrapper >>> .ant-upload-list-picture-card .ant-upload-list-item-info:before{
    top:0;
    left: 0;
  }
</style>
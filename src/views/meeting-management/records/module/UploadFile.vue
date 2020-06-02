<template>
  <a-upload
    name="file"
    :action="uploadUrl"
    :multiple="false"
    :beforeUpload="beforeUpload"
    :fileList="fileList"
    @change="handleChange"
  >
    <a-button>
      <a-icon type="upload" />
      {{this.$attrs.txt || '上传'}}
    </a-button>
  </a-upload>
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
      let _aceptFileTypes = this.aceptFileTypes
      const isDocType = _aceptFileTypes.includes(file.type)
      if (!isDocType) {
        this.$message.error('只支持上传.doc,.docx的word文档!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件必须小于10M!')
      }
      return isDocType && isLt10M
    },
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList.filter(f => this.checkFile(f))
    },
    checkFile(file) {
      const isDocType = this.aceptFileTypes.includes(file.type)
      const isLt10M = file.size / 1024 / 1024 < 10
      return isDocType && isLt10M
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
</style>
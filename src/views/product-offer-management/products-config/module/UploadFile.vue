<template>
  <div>
    <a-upload
      name="file"
      :action="uploadUrl"
      :multiple="false"
      :beforeUpload="beforeUpload" 
      :fileList="fileList"
      @change="handleChange"
    >
      <a-button v-if="fileList.length === 0">
        <a-icon type="upload" />
        {{this.$attrs.txt || '上传'}}
      </a-button>
    </a-upload>
    <p v-if="previewImage">
      <img :src="previewImage" alt="头像图片" style="width:96px;height:auto;overflow:hidden;" />
    </p>
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
        '.',
        '.docx',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
    }
  },
  computed: {
    previewImage: {
      get() {
        if (Array.isArray(this.fileList) && this.fileList.length > 0) {
          return this.fileList[0].url
        }
        return ''
      },
      set(url) {
        return url
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isAceptFileTpe = ['jpeg', 'png', 'gif', 'bmp'].some(type => file.type.endsWith(type))
      if (!isAceptFileTpe) {
        this.$message.error('只支持上传.jpeg .png .gif .bmp 格式的图片!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件必须小于10M!')
        return false
      }
      return this.compressPictures(file)
    },
    handleChange(info) {
      console.log(arguments)
      let that = this
      let fileList = [...info.fileList]
      fileList = fileList.slice(-3)
      fileList = fileList.map(file => {
        if (file.response) {
          if (file.response.code === 200) {
            file.url = file.response.data
            that.previewImage = file.url
          } else {
            that.$message.info(file.response.msg || '上传失败，请稍后再试')
            that.previewImage = ''
          }
        }
        return file
      })
      this.fileList = [...fileList]
      //this.fileList = fileList.filter(f => this.checkFile(f))
    },
    checkFile(file) {
      const isAceptFileTpe = ['jpeg', 'png', 'gif', 'bmp'].some(type => file.type.endsWith(type))
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
          name: f.name || f.url,
          status: 'done',
          url: f.url
        }
      })
    },
    compressPictures(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader(),
          img = new Image()
        reader.readAsDataURL(file)
        reader.onload = e => {
          img.src = e.target.result
        }
        img.onload = function() {
          let canvas = document.createElement('canvas')
          let context = canvas.getContext('2d')
          let originWidth = this.width
          let originHeight = this.height
          let maxWidth = 300,
            maxHeight = 300
          let targetWidth = originWidth,
            targetHeight = originHeight
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              targetWidth = maxWidth
              targetHeight = Math.round(maxWidth * (originHeight / originWidth))
            } else {
              targetHeight = maxHeight
              targetWidth = Math.round(maxHeight * (originWidth / originHeight))
            }
          }
          canvas.width = targetWidth
          canvas.height = targetHeight
          context.clearRect(0, 0, targetWidth, targetHeight)
          context.drawImage(img, 0, 0, targetWidth, targetHeight)
          canvas.toBlob(
            blob => {
              let newFile = new File([blob], file.name, { type: file.type })
              //由于缺少uid 导致 上传文件列表 渲染失败
              newFile.uid = file.uid
              resolve(newFile)
            },
            file.type,
            0.92
          )
        }
        img.onerror = function(err) {
          reject(err)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
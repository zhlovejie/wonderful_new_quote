<template>
  <div style="overflow:hidden;">
    <a-upload
      name="file"
      list-type="picture-card"
      :action="uploadUrl"
      :multiple="false"
      :beforeUpload="beforeUpload" 
      :fileList="fileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 3">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          上传图片
        </div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>

  </div>
</template>

<script>

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

import { getUploadPath2 } from '@/api/common'
export default {
  name: 'uploadFile',
  data() {
    return {
      uploadUrl: getUploadPath2(),
      fileList: [],
      previewVisible:false,
      previewImage:''
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
      //return file
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange(info) {
      //console.log(arguments)
      let that = this
      let fileList = [...info.fileList]
      fileList = fileList.slice(-3)
      fileList = fileList.map(file => {
        if (file.response) {
          if (file.response.code === 200) {
            file.url = file.response.data
          } else {
            that.$message.info(file.response.msg || '上传失败，请稍后再试')
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
          name: f.url,
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
          let maxWidth = 1000,
            maxHeight = 1000
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
            0.7
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
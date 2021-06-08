<template>
  <div style="overflow: hidden" class="__wdf-custom-upload-wrapper">
    <a-upload
      name="file"
      :list-type="listType"
      :action="uploadUrl"
      :multiple="false"
      :beforeUpload="beforeUpload"
      :fileList="fileList"
      @preview="handlePreview"
      @change="handleChange"
      :class="{ 'ant-upload-list-hidden': !margeConfig.showFileList }"
    >
      <div v-if="fileList.length < margeConfig.maxFileCount">
        <a-button :type="margeConfig.btn.attr.type" :icon="margeConfig.btn.attr.icon">{{
          margeConfig.btn.text
        }}</a-button>
      </div>
    </a-upload>
    <template v-if="margeConfig.enablePreview">
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </template>
  </div>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

import { getUploadPath2 } from '@/api/common'
export default {
  name: 'uploadFile',
  props: ['config'],
  data() {
    return {
      uploadUrl: getUploadPath2(),
      fileList: [],
      previewVisible: false,
      previewImage: '',

      margeConfig: {
        maxFileCount: 1,
        btn: {
          text: '上传',
          attr: {
            icon: 'upload',
            type: 'link',
          },
        },
        fileType: 'file', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: true,
        fileValidate: () => true,
      },
    }
  },
  created() {
    this.margeConfig = Object.assign({}, this.margeConfig, this.config || {})
  },
  watch: {
    config: {
      handler: function (obj) {
        if (obj) {
          this.margeConfig = Object.assign({}, this.margeConfig, obj || {})
        }
      },
      immediate: true,
    },
  },
  computed: {
    listType() {
      return this.margeConfig.fileType === 'img' ? 'picture-card' : 'text'
    },
  },
  methods: {
    beforeUpload(file) {
      const that = this
      let { enableCompress, fileValidate } = that.margeConfig
      if (typeof fileValidate === 'function') {
        try {
          fileValidate(file)
        } catch (err) {
          that.$message.info(err.message)
          return false
        }
      }
      // const isAceptFileTpe = ['jpeg', 'png', 'gif', 'bmp'].some(type => file.type.endsWith(type))
      // if (!isAceptFileTpe) {
      //   this.$message.error('只支持上传.jpeg .png .gif .bmp 格式的图片!')
      // }
      // const isLt10M = file.size / 1024 / 1024 < 10
      // if (!isLt10M) {
      //   this.$message.error('上传文件必须小于10M!')
      //   return false
      // }
      return enableCompress ? that.compressPictures(file) : true
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      const that = this
      let { enablePreview } = that.margeConfig
      if (!enablePreview) {
        return
      }
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      that.previewImage = file.url || file.preview
      that.previewVisible = true
    },
    handleChange(info) {
      const that = this
      let fileList = [...info.fileList]
      fileList = fileList.slice(-3)
      fileList = fileList.map((file) => {
        if (file.response) {
          if (file.response.code === 200) {
            file.url = file.response.data
          } else {
            that.$message.info(file.response.msg || '上传失败，请稍后再试')
          }
        }
        return file
      })
      that.fileList = [...fileList]
      that.$emit('change', [...that.fileList])
    },
    getFiles() {
      return this.fileList.filter((f) => f.status === 'done').map((f) => Object.assign({}, f))
    },
    setFiles(files) {
      this.fileList = files.map((f) => {
        return {
          uid: f.uid || Math.random().toString(16).slice(-10),
          name: f.url,
          status: 'done',
          url: f.url,
        }
      })
    },
    compressPictures(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader(),
          img = new Image()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          img.src = e.target.result
        }
        img.onload = function () {
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
            (blob) => {
              let newFile = new File([blob], file.name, { type: file.type })
              //由于缺少uid 导致 上传文件列表 渲染失败
              newFile.uid = file.uid
              resolve(newFile)
            },
            file.type,
            0.7
          )
        }
        img.onerror = function (err) {
          reject(err)
        }
      })
    },
  },
}
</script>

<style scoped>
.__wdf-custom-upload-wrapper .ant-upload-list-hidden >>> .ant-upload-list {
  display: none;
}
</style>

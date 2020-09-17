<template>
  <div style="overflow:hidden;">
    <a-upload
      name="file"
      :listType="config.listType"
      :accept="fileTypes[config.accept].join(',')"
      :action="uploadUrl"
      :multiple="false"
      :beforeUpload="beforeUpload"
      :fileList="fileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < config.maxUploadCount">
        <a-button v-if="!isPictureCard">
          <a-icon type="upload" />
          {{config.btnText}}
        </a-button>
        <template v-else>
          <a-icon type="plus" />
          <div class="ant-upload-text">{{config.btnText}}</div>
        </template>
      </div>
    </a-upload>
    <a-modal
      v-if="config.enabledPreview"
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
    >
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
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
const fileTypes = {
  word: [
    '.doc',
    '.docx',
    //'.xml',
    //'application/msword',
    //'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  excel: [
    '.xls',
    '.xlsx',
    //'application/vnd.ms-excel',
    //'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  pdf: ['.pdf'],
  image: ['.jpg', '.jpeg', '.png'],
  all: ['*'],
}

export default {
  name: 'uploadFile',
  props: {
    opt: {
      type: Object,
      default: () => {
        return {}
      },
    }
  },
  data() {
    return {
      config: {},
      uploadUrl: getUploadPath2(),
      fileList: [],
      previewVisible: false,
      previewImage: '',
      fileTypes: Object.freeze(fileTypes),
    }
  },
  created() {
    this.initConfig()
  },
  watch: {
    opt(newVal) {
      this.initConfig(newVal)
    },
  },
  computed: {
    isPictureCard() {
      return this.config.listType === 'picture-card'
    },
  },
  methods: {
    initConfig(newVal = {}) {
      this.config = Object.assign(
        {
          btnText: '上传', //上传按钮文字
          accept: 'all', //接收文件类型
          maxFileSize: 10, //最大文件尺寸 10M
          maxUploadCount: 1, //最大上传文件个数
          enabledCompress: false, //启用压缩 ，适用jpg图片
          maxCompressWidth: 1000, //压缩图片最大宽度
          maxCompressHeight: 1000, //压缩图片最大高度
          enabledPreview: false, //启用图片预览
          listType: 'text', //上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
        },
        this.opt,
        newVal
      )
      this.fileList = this.config.fileList || []
    },
    checkFileType(file, accept) {
      let types = fileTypes[this.config.accept] || []
      if (types.includes('*')) {
        return { result: true, msg: '' }
      }
      return {
        result: types.some((_type) => file.name.endsWith(_type)),
        msg: `支持${types.join(',')}类型的文件`,
      }
    },
    checkFileSize(file) {
      return file.size / 1024 / 1024 < +this.config.maxFileSize
    },
    beforeUpload(file) {
      let { maxFileSize, accept, enabledCompress, maxCompressWidth, maxCompressHeight } = this.config
      let res = this.checkFileType(file, accept)
      if (!res.result) {
        this.$message.error(res.msg)
        return false
      }
      if (!this.checkFileSize(file)) {
        this.$message.error(`上传文件必须小于${maxFileSize}M!`)
        return false
      }
      return enabledCompress ? this.compressPictures(file, maxCompressWidth, maxCompressHeight) : file
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!this.config.enabledPreview) {
        return
      }
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange(info) {
      console.log(arguments)
      let that = this
      let fileList = [...info.fileList]
      fileList = fileList.slice(-that.config.maxUploadCount)
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
      this.fileList = [...fileList]
      //this.fileList = fileList.filter(f => this.checkFile(f))
    },
    getFiles() {
      return this.fileList.map((f) => Object.assign({}, f))
    },
    setFiles(files) {
      this.fileList = files.map((f) => {
        return {
          uid: Math.random().toString(16).slice(-10),
          name: f.url,
          status: 'done',
          url: f.url,
        }
      })
    },
    compressPictures(file, maxWidth = 1000, maxHeight = 1000) {
      let that = this
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
</style>
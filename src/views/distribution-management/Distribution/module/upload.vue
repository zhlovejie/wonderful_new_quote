<template>
  <a-upload
    name="file"
    :action="uploadUrl"
    :fileList="fileList"
    accept=".pdf, .doc, .docx"
    :before-upload="beforeUpload"
    @change="handleChange"
    :showUploadList="fileUrl"
  >
    <a-button class="a-button" type="upload" icon="upload">上传</a-button>
  </a-upload>
</template>
<script>
import { getUploadPath2 } from '@/api/common'
export default {
  name: 'BecomingForm',
  data() {
    return {
      uploadUrl: getUploadPath2(),
      fileList: [],
      fileUrl: false,
      ids: '',
    }
  },
  props: ['name', 'statusId'],
  watch: {
    statusId: function (val, oldVal) {
      this.ids = val || ''
    },
  },
  created() {
    this.ids = this.statusId
  },
  methods: {
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('文件大小不能超过10MB!')
      }
      return isLt10M
    },
    handleChange(info) {
      // console.log(arguments)
      let that = this
      that.fileUrl = true
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
          let arr = {
            url: file.response.data,
            statusType: this.ids,
            name: file.name,
          }
          that.$emit('getmsg', arr)
          that.fileUrl = false
        }
        return file
      })
      that.fileList = fileList
    },
    // //上传
    // normFile(e) {
    //   console.log('Upload event:', e)
    //   if (Array.isArray(e)) {
    //     return e
    //   }
    //   return e && e.fileList
    // },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>
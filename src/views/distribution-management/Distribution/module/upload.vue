<template>
  <a-upload name="file" :action="uploadUrl" :fileList="fileList" @change="handleChange">
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
      todayN: this.name,
    }
  },
  props: ['name'],
  watch: {
    fileName: function (val, oldVal) {
      this.fileList = val || []
    },
  },
  created() {
    this.fileList = this.fileName
  },
  methods: {
    handleChange(info) {
      // console.log(arguments)
      let that = this
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
          file.todayName = that.todayN
          that.$emit('getmsg', file)
        }
        return file
      })
      that.fileList = fileList
    },
    //上传
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
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
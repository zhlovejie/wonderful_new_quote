<template>
  <div style="overflow:hidden;" class="__wdf-custom-upload-wrapper">
    <a-upload
      name="file"
      :multiple="true"
      :beforeUpload="beforeUpload"
      class="ant-upload-list-hidden"
    >
      <div >
        <a-button type="link" icon="upload">上传</a-button>
      </div>
    </a-upload>
  </div>
</template>

<script>

import {
  importBomExcel
} from '@/api/researchManagementByWzz'
export default {
  props:['config'],
  data() {
    return {}
  },
  methods: {
    beforeUpload(file) {
      this.customUpload(file)
      return false
    },
    customUpload(file){
      const that = this
      let formData = new FormData()
      formData.append('file',file)
      importBomExcel(formData).then(res => {
        that.$emit('change',res.data)
      })
    }
  }
}
</script>

<style scoped>
  .__wdf-custom-upload-wrapper  .ant-upload-list-hidden >>> .ant-upload-list{
    display: none;
  }

</style>

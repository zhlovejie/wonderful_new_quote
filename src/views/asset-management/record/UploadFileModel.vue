<template>
  <a-modal
    title="上传凭证"
    :width="550"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <UploadFile ref="uploadFile" />
  </a-modal>
</template>
<script>
import { oaAssertsInfoRecoveUpload } from '@/api/assetManagement'
import UploadFile from './UploadFile'
import { file } from 'jszip/lib/object'
export default {
  name: 'upload-file-model',
  components:{UploadFile},
  data() {
    return {
      visible: false,
      record:{}
    }
  },
  methods: {
    async query(type,record={}) {
      let that = this
      that.visible = true
      that.record = Object.assign({},record)
    },
    handleSubmit() {
      let that = this
      let files = that.$refs.uploadFile.getFiles()
      let fileUrls = files.map(f => encodeURIComponent(f.url)).join(",")

      oaAssertsInfoRecoveUpload({
        id:that.record.id,
        fileUrl:fileUrls
      }).then(res =>{
        console.log(res)
        that.$message.info(res.msg)
        if(res.code === 200){
          that.$emit("finish")
          that.handleCancel()
        }
      }).catch(err =>{
        that.$message.error(err.message)
      })

    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    }
  }
}
</script>


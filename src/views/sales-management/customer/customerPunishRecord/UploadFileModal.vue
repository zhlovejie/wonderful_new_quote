<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
    :confirmLoading="spinning" 
  >
    <UploadFile ref="uploadFile" />
  </a-modal>
</template>

<script>
import UploadFile from '@/components/CustomerList/UploadFile'
import { customerPunishRecordUploadTicket } from '@/api/customerReleaseRule'
export default {
  name: 'uploadFileModal',
  components:{UploadFile},
  data() {
    return {
      modalTitle:'上传',
      visible:false,
      spinning:false,
      record:{}
    }
  },
  methods: {
    query(record ={}){
      this.record = {...record}
      this.visible = true
    },
    handleOk(){
      let id = this.record.id
      let files = this.$refs.uploadFile.getFiles()
      if(files.length === 0){
        this.$message.info('您还没有上传文件或上传文件失败！')
        return
      }
      let url = files[0].url
      customerPunishRecordUploadTicket(`id=${id}&url=${url}`).then(res =>{
        //console.log(res)
        this.$message.info(res.msg)
        if(+res.code === 200){
          this.visible = false
          this.$emit('uploaded')
        }
      })
    },
    handleCancel(){
      this.visible = false
    }
  }
}
</script>

<style scoped>
</style>
<template>
  <a-modal
    title="上传罚款单"
    :width="550"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <UploadFile ref="uploadFile" :opt="uploadFileOpt" />
  </a-modal>
</template>
<script>
import { carIllegalUpload } from '@/api/vehicleManagement'
import UploadFile from './UploadFile'

let uuid = () =>Math.random().toString(32).slice(-10)

export default {
  name: 'upload-file-model',
  components:{UploadFile},
  data() {
    return {
      visible: false,
      record:{},
      uploadFileOpt:{
        accept:'image',
        listType:'picture-card',
        maxUploadCount:1,
        enabledPreview:true,
        enabledCompress:true,
        fileList:[]
      }
    }
  },
  methods: {
    async query(type,record={}) {
      let that = this
      that.visible = true
      that.record = Object.assign({},record)

      if(that.record.punishUrl){
        let fileList = that.record.punishUrl.split(',').map(url => {
          return {
            uid: uuid(),
            name: decodeURIComponent(url),
            status: 'done',
            url: decodeURIComponent(url)
          }
        })
        that.uploadFileOpt = {...that.uploadFileOpt,fileList}
      }else{
        that.uploadFileOpt = {...that.uploadFileOpt,fileList:[]}
      }
      
    },
    handleSubmit() {
      let that = this
      let files = that.$refs.uploadFile.getFiles()
      let fileUrls = files.map(f => encodeURIComponent(f.url)).join(",")

      carIllegalUpload({
        id:that.record.id,
        punishUrl:fileUrls
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


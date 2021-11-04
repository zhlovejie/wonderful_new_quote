<template>
  <a-modal
    :title="modalTitle"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="800"
  >
    <h3>附件</h3>
    <div>
      <UploadFile
        ref="uploadFiles"
        :disabled="isDisabled"
        :config="uploadFileConfig"
        @change="(fileList) => fileChange(fileList,'file')"
      />
    </div>
    <h3>图纸</h3>
    <div>
      <UploadFile
        ref="uploadImage"
        :disabled="isDisabled"
        :config="uploadImageConfig"
        @change="(fileList) => fileChange(fileList,'image')"
      />
    </div>
    <h3>视频</h3>
    <div>
      <UploadFile
        ref="uploadVideo"
        :disabled="isDisabled"
        :config="uploadFileConfig"
        @change="(fileList) => fileChange(fileList,'video')"
      />
    </div>
  </a-modal>
</template>

<script>
import UploadFile from './UploadFile'
export default {
  name: 'upload-model',
  components: {
    UploadFile
  },
  data() {
    return {
      modalTitle:'上传',
      visible:false,
      uploadImageConfig: {
        maxFileCount: 3,
        fileType: 'img', // file img
        enableCompress: false,
        enablePreview: true,
        showFileList: true,
        fileValidate: () => true,
        btn: {
          text: '上传',
          attr: {
            icon: 'upload',
            type: 'link'
          }
        }
      },
      uploadFileConfig: {
        maxFileCount: 3,
        fileType: 'file', // file img
        enableCompress: false,
        enablePreview: false,
        showFileList: true,
        fileValidate: () => true,
        btn: {
          text: '上传',
          attr: {
            icon: 'upload',
            type: 'normal'
          }
        }
      },
      type:'add',
      record:{},
      file:'',
      image:'',
      video:''
    }
  },
  computed:{
    isAdd(){
      return this.type === 'add'
    },
    isEdit(){
      return this.type === 'edit'
    },
    isView(){
      return this.type === 'view'
    },
    isApproval(){
      return this.type === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    }
  },
  methods: {
    query(type,record,{file,image,video}){
      debugger
      const that = this
      that.type = type
      that.record = record

      that.file = file
      that.image = image
      that.video = video

      that.$nextTick(() => {
        that.$refs.uploadFiles.setFiles(
          that.file
          ? that.file.split(',').map(url => {
              return {uid:that._uuid(),url }
            })
          : []
        )
        that.$refs.uploadImage.setFiles(
          that.image
          ? that.image.split(',').map(url => {
              return {uid:that._uuid(),url }
            })
          : []
        )
        that.$refs.uploadVideo.setFiles(
          that.video
          ? that.video.split(',').map(url => {
              return {uid:that._uuid(),url }
            })
          : []
        )
      })

      that.visible = true
    },
    handleOk(){
      const that = this
      that.handleCancel()
      if(!that.isView){
        that.$emit('change',that.record,{
            file:that.file,
            image:that.image,
            video:that.video
          })
      }
    },
    handleCancel(){
      this.visible = false
    },
    fileChange(fileList, type) {
      this.[type] = fileList.map(f => f.url).join(',')
    }
  }
}
</script>

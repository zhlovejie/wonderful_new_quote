<template>
  <a-modal
    title="上传文件"
    :width="500"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form class="upload-form-wrapper">
        <a-form-item>
          <UploadFile ref="f1" txt="上传会议记录" />
        </a-form-item>
        <a-form-item>
          <UploadFile ref="f2" txt="上传考核文件" />
        </a-form-item>
        <a-form-item>
          <UploadFile ref="f3" txt="上传考核结果" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import UploadFile from './UploadFile'
import { meetingRecordUpload } from '@/api/meetingManagement'
export default {
  name: 'uploadFile',
  components: {
    UploadFile
  },
  data() {
    return {
      visible: false,
      spinning: false,
      record: {},
      form: this.$form.createForm(this)
    }
  },
  methods: {
    query(type, record) {
      let that = this
      that.record = record
      that.visible = true
      that.$nextTick(() => {
        //回显附件
        try{
          if(that.record.recordUrl){
            that.$refs.f1.setFiles([{ url:that.record.recordUrl }])
          }
          if(that.record.checkUrl){
            that.$refs.f2.setFiles([{ url:that.record.checkUrl }])
          }
          if(that.record.checkResultUrl){
            that.$refs.f3.setFiles([{ url:that.record.checkResultUrl }])
          }
        }catch(err){
          console.log(err)
        }
      })
    },
    handleOk() {
      let that = this
      let f1 = that.$refs.f1.getFiles()
      let recordUrl = Array.isArray(f1) && f1.length > 0 ? f1[0].url : undefined
      let f2 = that.$refs.f2.getFiles()
      let checkUrl = Array.isArray(f2) && f2.length > 0 ? f2[0].url : undefined
      let f3 = that.$refs.f3.getFiles()
      let checkResultUrl = Array.isArray(f3) && f3.length > 0 ? f3[0].url : undefined
      let values = {
        id: that.record.id,
        recordUrl: recordUrl,
        checkUrl: checkUrl,
        checkResultUrl: checkResultUrl
      }
      that.spinning = true
      meetingRecordUpload(values)
        .then(res => {
          that.spinning = false
          if (res.code === 200) {
            that.form.resetFields() // 清空表
            that.visible = false
            that.$message.success('操作成功')
            that.$emit('finish')
          } else {
            that.$message.warning(res.msg)
          }
        })
        .catch(err => (that.spinning = false))
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
</style>
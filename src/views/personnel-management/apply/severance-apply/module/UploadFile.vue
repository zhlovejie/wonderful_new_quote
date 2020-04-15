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

      <a-form :form="form" class="upload-form-wrapper">

        <a-form-item v-if="record.type === 1">
          <a-upload 
            name="file" 
            :action="uploadUrl" 
            :multiple="false"  
            :beforeUpload="beforeUpload" 
            :fileList="fileList_leaveTellBookUrl" 
            @change="handleChange_leaveTellBookUrl" 
          >
            <a-button><a-icon type="upload"/>上传辞退告知书</a-button>
          </a-upload>
          <a-input hidden v-decorator="['leaveTellBookUrl']" />
        </a-form-item>
        <a-form-item v-if="(record.type === 3 || record.type === 2)">
          <a-upload 
            name="file" 
            :action="uploadUrl" 
            :multiple="false"  
            :beforeUpload="beforeUpload" 
            :fileList="fileList_leaveReportBookUrl" 
            @change="handleChange_leaveReportBookUrl"
          >
            <a-button><a-icon type="upload" />上传辞职报告</a-button>
          </a-upload>
          <a-input hidden v-decorator="['leaveReportBookUrl']" />
        </a-form-item>
        <a-form-item v-if="record.type === 2">
          <a-upload 
            name="file" 
            :action="uploadUrl" 
            :multiple="false"  
            :beforeUpload="beforeUpload" 
            :fileList="fileList_leaveAgreeUrl" 
            @change="handleChange_leaveAgreeUrl"
          >
            <a-button><a-icon type="upload" />上传离职协议</a-button>
          </a-upload>
          <a-input hidden v-decorator="['leaveAgreeUrl']" />
        </a-form-item>
        <a-form-item >
          <a-upload 
            name="file" 
            :action="uploadUrl" 
            :multiple="false"  
            :beforeUpload="beforeUpload" 
            :fileList="fileList_goodsHandUrl"
            @change="handleChange_goodsHandUrl"
          >
            <a-button><a-icon type="upload" />上传物品交接单</a-button>
          </a-upload>
          <a-input hidden v-decorator="['goodsHandUrl']" />
        </a-form-item> 
      </a-form>
    </a-spin>
  </a-modal>  
</template>


<script>

import { getUploadPath2 ,getUploadPath } from '@/api/common'
import { uploadDocPersonnelLeaveApply } from '@/api/personnelManagement'
export default {
  name:'uploadFile',
  data(){
    return {
      visible:false,
      spinning:false,
      form: this.$form.createForm(this),
      uploadUrl:getUploadPath2(),
      fileList:[],
      fileList_leaveTellBookUrl:[],
      fileList_leaveReportBookUrl:[],
      fileList_leaveAgreeUrl:[],
      fileList_goodsHandUrl:[],
      aceptFileTypes:['.doc','.docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      record:{}
    }
  },
  methods:{
    query(record){
      let that = this
      that.record = record
      that.fileList_leaveTellBookUrl = []
      that.fileList_leaveReportBookUrl = []
      that.fileList_leaveAgreeUrl = []
      that.fileList_goodsHandUrl = []

      that.$nextTick(() => that.visible = true)
      // let target = {}
      // uploadItems.map(item => {
      //   let _item = Object.assign({},item)
      //   let arr = []
      //   if(_item.url){
      //     arr.push({
      //       uid:-1,
      //       name:`${_item.name}-${_item.url}`,
      //       status:'done',
      //       url:_item.url
      //     })
      //   }
      //   target[item.key] = arr
      // })
      // that.fileListObj = {...target}

      // this.$nextTick(() =>this.uploadItems = uploadItems)
    },
    handleOk(){
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          values.id = that.record.id
          values.type = that.record.type
          that.spinning = true
          uploadDocPersonnelLeaveApply(values).then(res => {
            that.spinning = false
            if(res.code === 200){
              that.form.resetFields() // 清空表
              that.visible = false 
              that.$message.success('操作成功')
              that.$emit('finish')
            }else{
              that.$message.warning(res.msg)
            }
          }).catch(err =>that.spinning = false)
        }
      })
    },
    handleCancel(){
      this.visible = false
    },

    beforeUpload(file) {
      // let _aceptFileTypes = this.aceptFileTypes
      // const isDocType = _aceptFileTypes.includes(file.type)
      // if (!isDocType) {
      //   this.$message.error('只支持上传.doc,.docx的word文档!');
      // }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传文件必须小于10M!');
      }
      //return isDocType && isLt10M;
      return isLt10M;
    },
    handleChange_leaveTellBookUrl({file,fileList}) {
      let that = this 
      that.fileList_leaveTellBookUrl = [...fileList.slice(-1)]
      console.log(fileList)
      if(fileList.length === 0){
        this.form.setFieldsValue({leaveTellBookUrl:undefined})
      }
      if(fileList.length > 0){
        let lastFile = fileList[fileList.length - 1]
        if(lastFile.status && lastFile.status === 'done'){
          this.form.setFieldsValue({leaveTellBookUrl:lastFile.response.data})
        }
      }
    },
    handleChange_leaveReportBookUrl({file,fileList}) {
      console.log(fileList)
      let that = this 
      that.fileList_leaveReportBookUrl = [...fileList.slice(-1)]
      if(fileList.length === 0){
        this.form.setFieldsValue({leaveReportBookUrl:undefined})
      }
      if(fileList.length > 0){
        let lastFile = fileList[fileList.length - 1]
        if(lastFile.status && lastFile.status === 'done'){
          this.form.setFieldsValue({leaveReportBookUrl:lastFile.response.data})
        }
      }
    },
    handleChange_leaveAgreeUrl({file,fileList}) {
      let that = this
      that.fileList_leaveAgreeUrl = [...fileList.slice(-1)]
      console.log(fileList)
      if(fileList.length === 0){
        this.form.setFieldsValue({leaveAgreeUrl:undefined})
      }
      if(fileList.length > 0){
        let lastFile = fileList[fileList.length - 1]
        if(lastFile.status && lastFile.status === 'done'){
          this.form.setFieldsValue({leaveAgreeUrl:lastFile.response.data})
        }
      }


    },
    handleChange_goodsHandUrl({file,fileList}) {
      let that = this
      that.fileList_goodsHandUrl = [...fileList.slice(-1)]
      console.log(fileList)
      if(fileList.length === 0){
        this.form.setFieldsValue({goodsHandUrl:undefined})
      }
      if(fileList.length > 0){
        let lastFile = fileList[fileList.length - 1]
        if(lastFile.status && lastFile.status === 'done'){
          this.form.setFieldsValue({goodsHandUrl:lastFile.response.data})
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
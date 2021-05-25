<template>
  <a-modal
    title="上传图纸"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form :form="form" class="routine-addform-wrapper">
      <a-form-item label="文件类型">
        <a-radio-group
          name="radioGroup"
          v-decorator="[
            'fileType',
            {
              initialValue: 2,
              rules: [{ required: true, message: '请选择文件类型' }],
            },
          ]"
        >
          <a-radio :value="1">PDF图纸</a-radio>
          <a-radio :value="2">3D图纸</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="上传文件">
        <UploadFile :config="uploadConfig" @change="fileChange" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import UploadFile from './UploadFile'
export default {
  name:"UploadFileModel",
  components:{
    UploadFile
  },
  data(){
    return {
      form: this.$form.createForm(this, { name: 'UploadFileModel' }),
      visible:false,
      uploadConfig:{
        maxFileCount:1
      }
    }
  },
  methods:{
    handleSubmit(){
      this.handleCancel()
    },
    handleCancel(){
      this.visible = false
    },
    query(){
      this.visible = true
    },
    fileChange(files){
      if(Array.isArray(files) && files.length === 1){
        let fileType = this.form.getFieldValue('fileType')
        this.$emit('change',{...files[0],__fileType:fileType})
      }else{
        this.$emit('change',null)
      }
    }
  }
}
</script>

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
      <a-form-item label="图纸类型" v-if="+type === 0">
        <a-radio-group
          name="radioGroup"
          v-decorator="[
            'fileType',
            {
              rules: [{ required: true, message: '请选择图纸类型' }],
            },
          ]"
        >
          <a-radio v-for="item in list" :key="item.id" :value="item.id">{{item.text}}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="文件名称">
        <a-input
          v-decorator="[
            'fileName',
            {
              rules: [{ required: true, message: '请输入图纸名称' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="上传文件">
        <UploadFile :config="uploadConfig" @change="fileChange" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import UploadFile from './UploadFile'
import { getDictionary } from '@/api/common'

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
      },
      list:[],
      type:null,
      fileInfo:null
    }
  },
  methods:{
    handleSubmit(){
      const that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          let typeName
          let {fileType,fileName} = values
          if(fileType){
            typeName = that.list.find(item => +item.id === +fileType).text
          }
          that.$emit('change',{...that.fileInfo,__fileType:fileType,__fileName:fileName,__typeName:typeName})
          that.$nextTick(() => that.visible = false)
        }
      });
    },
    handleCancel(){
      const that = this
      that.fileInfo = null
      that.$emit('change',null)
      that.$nextTick(() => that.visible = false)
    },
    async query(params={}){
      const that = this
      that.type = +params.type
      await getDictionary({ text: '工艺路线-图纸信息-图纸类型' }).then((res) => (that.list = res.data))
      that.visible = true
    },
    fileChange(files){
      const that = this
      if(Array.isArray(files) && files.length === 1){
        that.fileInfo = {...files[0]}
      }else{
        that.fileInfo = null
      }
    }
  }
}
</script>

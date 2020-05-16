<template>
  <a-modal
    title="新建文件夹"
    :width="450"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline"  class="reserve-add-form-wrapper">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="文件夹名称">
              <a-input style="width:260px;" v-decorator="['dirName',{rules: [{required: true,message: '输入文件夹名称'},{max:50,message:'文件夹名称最大支持50个字符'}]}]" placeholder="输入文件夹名称"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {docDirAdd} from '@/api/files-management'
export default {
  name:'AddDirectory',
  data(){
    return {
      form: this.$form.createForm(this, { name: 'add_directory_form' }),
      visible:false,
      spinning:false,
    }
  },
  methods:{
    query(opt){
      this.visible = true
    },
    handleSubmit(){
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true 
          docDirAdd(values).then(res =>{
            that.$message.info(res.msg)
            that.spinning = false
            that.handleCancel()
            that.$emit('finish')
          }).catch(err =>{
            that.spinning = false
          })
        }
      })
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    }
  }
}
</script>
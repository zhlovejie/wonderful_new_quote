<template>
  <a-modal
    :title="modalTitle"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      111111111
    </a-form-model>
  </a-modal>
</template>
<script>
import {
  checkInspectionBasisDetail,
  checkInspectionBasisAddOrUpdate,
} from '@/api/qualityManagement'
export default {
  data() {
    return {
      visible:false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {},
      rules: {
        termName: [
          { required: true, message: '请输入配置名称', trigger: 'blur' },
        ]
      },
      type:'add'
    }
  },
  computed:{
    modalTitle(){
      return this.isAdd ? '新增' : this.isEdit ? '编辑' : '查看'
    },
    isAdd(){
      return this.type === 'add'
    },
    isEdit(){
      return this.type === 'edit'
    },
    isView(){
      return this.type === 'view'
    }
  },
  methods: {
    query(type,record){
      const that = this
      that.type = type
      that.visible = true
      if(that.isAdd){

      }else{
        checkInspectionBasisDetail({id:record.id}).then(res => {
          that.form = res.data
        })
      }
    },
    handleOk() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          checkParameterTermAddOrUpdate({
            ...that.form
          }).then(res => {
            if(res.code === 200){
              that.$emit('ok')
              that.visible = false
            }
            that.$message.info(res.msg)
          }).catch(err => {
            that.$message.error(err.message)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    handleCancel(){
      this.resetForm()
      this.visible = false
    },
  },
};
</script>

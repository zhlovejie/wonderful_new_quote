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
      <a-form-model-item  label="上级配置" >
        <a-input
          v-model="form.parentTitle"
          disabled
        />
      </a-form-model-item>
      <a-form-model-item  label="配置名称" prop="termName">
        <a-input
          v-model="form.termName"
        />
      </a-form-model-item>
      <a-form-model-item label="备注" >
        <a-input v-model="form.remarks" type="textarea" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import {
  checkParameterTermDetail,
  checkParameterTermAddOrUpdate
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
      return this.isAdd ? '新增' : '编辑'
    },
    isAdd(){
      return this.type === 'add'
    },
    isEdit(){
      return this.type === 'edit'
    }
  },
  methods: {
    query(type,{record,node}){
      const that = this
      that.type = type
      that.visible = true
      that.form = {...record,parentId:node.value,parentTitle:node.title}
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

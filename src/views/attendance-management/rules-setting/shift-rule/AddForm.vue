<template>
  <a-modal
    :title="modalTitle"
    :width="450"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <h3 style="text-align:center;font-weight:blod;">考勤规则</h3>
      <a-form :form="form" layout="inline"  class="wdf-custom-add-form-wrapper">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item hidden>
              <a-input  v-decorator="['id']" />
            </a-form-item>
            <a-form-item label="班次名称">
              <a-input v-decorator="['className',{rules: [{required: true,message: '输入考勤规则'},{max:50,message:'考勤规则最大支持50个字符'}]}]" placeholder="输入考勤规则"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {classRuleDetail , classRuleAddAndUpdate} from '@/api/attendanceManagement'
export default {
  name:'shift-rule-list-add',
  data(){
    return {
      form: this.$form.createForm(this),
      visible:false,
      spinning:false,
      actionType:''
    }
  },
  computed:{
    modalTitle(){
      return this.isAdd ? '新增' : '修改'
    },
    isView(){
      return this.actionType === 'view'
    },
    isAdd(){
      return this.actionType === 'add'
    },
    isEdit(){
      return this.actionType === 'edit'
    },
  },
  methods:{
    query(type,record){
      this.actionType=type
      this.visible = true
      if(record){
        this.$nextTick(() => 
        {
          this.form.setFieldsValue(Object.assign({},record))
        })
      }
    },
    handleSubmit(){
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true 
          classRuleAddAndUpdate(values).then(res =>{
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
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item{
  display:flex;
}

.ant-form-item >>> .ant-form-item-label{
  width:80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper{
  flex:1;
}
</style>
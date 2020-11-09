<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
  >

  <template slot="footer">
    <template v-if="isApproval">
      <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
      <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
    </template>
    <template v-else>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
    </template>
  </template>


  <a-spin :spinning="spinning">

  <a-form :form="form" class="add-form-wrapper">
    <table class="custom-table custom-table-border">
      <tr>
        <td style="width:120px;">备案编号</td>
        <td>
          <a-form-item>
            <a-input hidden v-decorator="['id']"/>
          </a-form-item>
          <a-form-item>
            <a-input hidden v-decorator="['instanceId']"/>
          </a-form-item>
          <a-form-item>
            <a-input placeholder="备案编号" disabled  read-only v-decorator="['recordCode']"/>
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>项目名称</td>
        <td>
          <a-form-item>
          <a-input placeholder="项目名称" :disabled="isDisabled"  v-decorator="['projectName', { rules: [{ required: true, message: '项目名称' }] }]"/>
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>项目地址</td>
        <td>
          <a-form-item>
          <a-input placeholder="项目地址" :disabled="isDisabled"  v-decorator="['projectAddress', { rules: [{ required: true, message: '项目地址' }] }]"/>
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>项目情况</td>
        <td>
          <a-form-item>
          <a-textarea rows="3" placeholder="项目情况" :disabled="isDisabled"  v-decorator="['projectSituation', { rules: [{ required: true, message: '项目情况' }] }]"/>
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>项目截止日期</td>
        <td>
          <a-form-item>
            <a-date-picker 
              :disabled="isDisabled" 
              style="width:100%;" 
              v-decorator="['deadline',{initialValue:moment(),rules: [{required: true,message: '项目截止日期'}]}]" 
              format="YYYY-MM-DD"
            />
          </a-form-item>
        </td>
      </tr>
    </table>
  </a-form>
  <Approval ref="approval" @opinionChange="opinionChange" />
  </a-spin>
  </a-modal>
</template>

<script>
import {
  saleRecordSaveAndUpdate,
  saleRecordApproval
} from '@/api/investigate'

import moment from 'moment' 
import Approval from './Approval'
export default {
  name:'AddForm',
  components:{
    Approval:Approval
  },
  data(){
    return {
      form: this.$form.createForm(this, { name: 'add_adjust_form' }),
      visible:false,
      actionType:'add',
      opinion:'', //审批意见
      spinning:false,
    }
  },
  computed:{
    modalTitle(){
      let m = {'view':'查看','add':'新增','edit' : '修改','approval':'审批'}
      return `${m[this.actionType]}申请`
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
    isApproval(){
      return this.actionType === 'approval'
    },
    isDisabled(){ //此状态下表单元素被禁用
      return this.isView || this.isApproval
    }
  },
  methods:{
    moment:moment,
    init(){
      let that = this 
    },
    async handleOk(){
      //debugger
      let that = this
      if(that.isView){
        that.handleCancel()
        return 
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          values.deadline = that.moment(values.deadline).format('YYYY-MM-DD')
          that.spinning = true
          saleRecordSaveAndUpdate(values).then(res =>{
            that.spinning = false
            console.log(res)
            that.form.resetFields() // 清空表
            that.visible = false 
            that.$message.info(res.msg)
            that.$emit('finish')
          }).catch(err => that.spinning = false)
        }
      })
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    async query(type,record){
      let that = this
      that.actionType = type 
      that.record = {...record || {}}
      that.form.resetFields() 
      that.resetValues()
      await that.init() 
      that.visible = true
      if(type === 'add') return 



      that.record.deadline = that.moment(that.record.deadline)
      that.$nextTick(() => that.form.setFieldsValue(that.record))
    },
    submitAction(opt){
      let that = this
      let values = Object.assign({},opt || {},{id:that.record.id})
      that.spinning = true
      saleRecordApproval(values).then(res =>{
        that.spinning = false
        console.log(res)
        that.form.resetFields() // 清空表
        that.visible = false 
        that.$message.info(res.msg)
        that.$emit('finish')
      }).catch(err => that.spinning = false)
    },
    passAction(opt){
      this.submitAction(Object.assign({},{isAdopt:1,opinion:'通过'},opt || {}))
    },
    noPassAction(){
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion){ //审批意见
      this.submitAction({
        isAdopt:2,
        opinion:opinion
      })
    },

    resetValues(){
      
    }
  }
}
</script>

<style scoped>
.custom-table-border th,.custom-table-border td{
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table{
  margin-bottom: 0;
}
.custom-table >>> .custom-table{
  margin: -1px;
}

</style>
<template>
  <a-modal
    :title="modalTitle"
    :width="700"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <!-- <h3 style="text-align:center;font-weight:blod;">补卡规则</h3> -->
      <a-form :form="form" layout="inline"  class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]"/>
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td>规则名称</td>
            <td>
              <a-form-item>
                <a-input v-decorator="['ruleName',{initialValue:detail.ruleName,rules: [{required: true,message: '输入考勤规则'},{max:50,message:'考勤规则最大支持50个字符'}]}]" placeholder="输入考勤规则"/>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>限制补卡次数</td>
            <td style="text-align:left;">
              <a-form-item>
                <span>每月可提交</span>
                <a-input-number
                  style="width:100px;margin:0 7px;"
                  :min="0"
                  :max="100"
                  :step="1"
                  v-decorator="['permitRecardTims', {initialValue:detail.permitRecardTims,rules: [{ required: true, message: '请输入限制补卡次数' }]}]"
                />
                <span>次补卡（按自然月计算）</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>限制补卡时间</td>
            <td style="text-align:left;">
              <a-form-item>
                <span>可申请过去</span>
                <a-input-number
                  style="width:100px;margin:0 7px;"
                  :min="0"
                  :max="1000"
                  :step="1"
                  v-decorator="['permitDelayDayTims', {initialValue:detail.permitDelayDayTims,rules: [{ required: true, message: '请输入限制补卡时间' }]}]"
                />
                <span>天内的补卡（填写0，只能发起当天的补卡）</span>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {attenceRecardRuleAddOrUpdate} from '@/api/attendanceManagement'
export default {
  name:'supplement-card-rule-add',
  data(){
    return {
      form: this.$form.createForm(this),
      visible:false,
      spinning:false,
      actionType:'view',
      detail:{}
    }
  },
   computed:{
    modalTitle(){
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '修改'}补卡规则`
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
    query(type,record){
      this.actionType = type
      this.form.resetFields()
      this.$nextTick(() => this.visible = true)
      if(this.isAdd){
        this.detail = {}
        return
      }
      this.detail = Object.assign({},record)
    },
    handleSubmit(){
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true 
          attenceRecardRuleAddOrUpdate(values).then(res =>{
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
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.wdf-custom-add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.wdf-custom-add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
</style>
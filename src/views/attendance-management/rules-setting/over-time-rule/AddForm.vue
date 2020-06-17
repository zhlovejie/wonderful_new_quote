<template>
  <a-modal
    :title="modalTitle"
    :width="680"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline"  class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]"/>
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">规则名称</td>
            <td>
              <a-form-item>
                <a-input v-decorator="['ruleName',{initialValue:detail.ruleName,rules: [{required: true,message: '输入规则名称'}]}]" :allowClear="true"/>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">计算方式</td>
            <td>
              <a-form-item>
                按审批时长计算
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">计为调休方式</td>
            <td>
              <a-form-item>
                <span>按</span>
                <a-select 
                  placeholder="选择时长"
                  v-decorator="['exchangeType',{initialValue:detail.exchangeType,rules: [{required: true,message: '请选择时长'}]}]"
                  :allowClear="true" 
                  style="width:120px;margin:0 10px;"
                >
                  <a-select-option :value="1">调休0.5小时</a-select-option>
                  <a-select-option :value="2">调休1小时</a-select-option>
                  <a-select-option :value="3">调休1.5小时</a-select-option>
                </a-select>
                <span>计为调休时长</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">最小加班单位</td>
            <td>
              <a-form-item>
                <a-select 
                  placeholder="选择最小加班单位"
                  v-decorator="['overWorkCaculatorType',{initialValue:detail.overWorkCaculatorType,rules: [{required: true,message: '请选择最小加班单位'}]}]"
                  :allowClear="true" 
                >
                  <a-select-option :value="1">按半小时加班</a-select-option>
                  <a-select-option :value="2">按小时加班</a-select-option>
                  <a-select-option :value="3">按半天加班</a-select-option>
                  <a-select-option :value="4">按天加班</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">加班预警</td>
            <td>
              <a-form-item>
                <span>一周超过</span>
                <a-input-number
                  style="width:100px;margin:0 10px;"
                  :min="0"
                  :max="100"
                  :step="1"
                  v-decorator="['emergenceHous', {initialValue:detail.emergenceHous,rules: [{ required: true, message: '请输入加班预警' }]}]"
                />
                <span>小时</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">限制时间</td>
            <td>
              <a-form-item>
                <span>可申请过去</span>
                <a-input-number
                  style="width:100px;margin:0 10px;"
                  :min="0"
                  :max="100"
                  :step="1"
                  v-decorator="['limitTime', {initialValue:detail.limitTime,rules: [{ required: true, message: '请输入限制时间' }]}]"
                />
                <span>天内的加班（填写0，只能发起当天的加班）</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">加班餐补</td>
            <td>
              <a-form-item>
                <span>加班时长大于等于</span>
                <a-input-number
                  style="width:100px;margin:0 10px;"
                  :min="0"
                  :max="100"
                  :step="1"
                  v-decorator="['overWorkLunchHours', {initialValue:detail.overWorkLunchHours,rules: [{ required: true, message: '请输入加班餐补时长' }]}]"
                />
                <span>小时，计一次补餐</span>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {overworkRuleDetail , overworkRuleAddAndUpdate} from '@/api/attendanceManagement'
import moment from 'moment'
export default {
  name:'over-time-rule-add',
  data(){
    return {
      form: this.$form.createForm(this),
      visible:false,
      spinning:false,
      actionType:'view',
      detail:{},
      spinning:false
    }
  },
  computed:{
    modalTitle(){
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '修改'}加班规则`
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
    moment,
    query(type,record){
      let that = this
      
      this.actionType = type,
      this.detail = Object.assign({},record)
      this.form.resetFields()

      this.$nextTick(() => this.visible = true)
      if(this.isAdd){
        return
      }
      if(record){
        overworkRuleDetail({id:record.id}).then(res =>{
          //debugger
          that.detail = {...res.data}
          console.log(res)
        })
      }
    },
    handleSubmit(){
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true 

          overworkRuleAddAndUpdate(values).then(res =>{
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
  margin: 0;
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
  text-align: left;
}
</style>
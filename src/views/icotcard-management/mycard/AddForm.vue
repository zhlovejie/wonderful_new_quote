<template>
  <a-modal
    title="新增"
    :width="700"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template>
        <a-button key="back">取消</a-button>
        <a-button
          key="submit"
          type="primary"
          @click="handleSubmit"
          :loading="spinning"
        >保存</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">卡号</td>
            <td>
              <a-form-item>
                <a-input 
                  v-decorator="['cardno',{initialValue:form.cardno}]"
                  placeholder="卡号"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">iccid</td>
            <td>
              <a-form-item>
                <a-input 
                  v-decorator="['iccid',{initialValue:form.iccid}]"
                  placeholder="iccid"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
             <td style="width:120px;">运营商</td>
            <td>
              <a-form-item>
                <a-input
                  v-decorator="['operatortype',{initialValue:form.operatortype}]"
                  placeholder="运营商"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">发卡日期</td>
            <td>
              <a-form-item>
                 <a-date-picker @change='changeStartDate' />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">服务器止</td>
            <td>
              <a-form-item>
                 <a-date-picker @change='changeEndDate' />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">流量套餐</td>
            <td>
              <a-form-item>
                <a-input 
                  v-decorator="['flowPackages',{initialValue:form.flowPackages}]"
                  placeholder="输入流量套餐"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { addAndUpdateSimInformation } from '@/api/simCard'

import moment from 'moment'

export default {
  name: 'icotcard-management-mycard-add',
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      saledate:undefined,
      validdate:undefined,
      detail: {},
      record: {},
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  methods: {
    moment,
    showAddForm(){
      this.visible=true
      this.form.resetFields()
    },
    changeStartDate(data,dataStr){
      this.saledate=dataStr
    },
    changeEndDate(data,dataStr){
      this.validdate=dataStr
    },
    handleSubmit() {
      this.spinning=true
      this.form.validateFields((err, values) => {
        if (!err) {
          values['saledate']=this.saledate
          values['validdate']=this.validdate
          addAndUpdateSimInformation(values).then(res=>{
            if(res.code==200){
              this.$message.success(res.msg);
              this.$emit('finish')
              this.spinning=false
              this.visible=false
            }else{
              this.spinning=false
              this.$message.success(res.msg);
            }
          })
        }
      })
      
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
</style>
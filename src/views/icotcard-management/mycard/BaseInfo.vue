<template>
  <div class="icotcard-baseDetail">
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" >
        <div>
          <h3 style="font-weight:600;display:inline-block;">卡账号信息</h3>
          <a-button type="link" style="display:inline-block;" @click='changeForm'>修改</a-button>
        </div>
        <a-form-item label="卡号" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" style="width：200px">
          <a-input v-model="form.cardno" style="width:170px" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="iccid" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input v-model="form.iccid" style="width:170px" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="运营商" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input v-model="form.operatortype" style="width:170px" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="卡状态" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input v-model="form.status" style="width:170px" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="发卡日期">
          <a-date-picker @change="startDateChange" v-model="form.saledate" style="width:170px"/>
        </a-form-item>
        <a-form-item label="激活日期">
          <a-input style="width:170px" v-model="form.activationdate" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="服务期止">
          <a-date-picker @change="startDateChange" v-model="form.validdate" style="width:170px" />
        </a-form-item>
        <a-form-item label="活动状态">
          <a-input v-model="form.activestatus" :readOnly="formreadOnly" style="width:170px" />
        </a-form-item>
        <a-form-item label="卡内余额（元）">
          <a-input placeholder="卡内余额" v-model="form.cardaccount" style="width:170px" :readOnly="formreadOnly" />
        </a-form-item>
        <h3 style="font-weight:600">套餐信息</h3>
        <table class='baseDetail-table'>
          <tr>
            <td>套餐名称</td>
            <td>类型</td>
            <td>开始时间</td>
            <td>结束时间</td>
          </tr>
          <tr>
            <td>200M/</td>
            <td>流量</td>
            <td>开始时间</td>
            <td>结束时间</td>
          </tr>
        </table>
        <a-progress :strokeWidth=8 :percent="30" style="margin:20px 0"/>
        <h3 style="font-weight:600">卡所属信息</h3>
        <a-form-item label="所属机构">
          <a-input v-model="form.orgName" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="所属设备">
          <a-input v-model="form.manId" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="出厂日期">
          <a-input v-model="form.outTime" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="SIM卡有限期">
          <a-input v-model="form.beOverdueTime" :readOnly="formreadOnly" />
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import {addAndUpdateSimInformation,crrQueryCard} from '@/api/simCard'
export default {
  data() {
    return {
      spinning: false,
      formreadOnly:true,
      form: {},
    }
  },
  methods:{
    init(iccId){
      crrQueryCard({iccId}).then(res=>{
        this.form=res.data
      })
    },
    startDateChange(){

    },
    //修改
    changeForm(){
      
    }

  }
}
</script>

<style scoped>
.icotcard-baseDetail >>> .ant-form-item-label {
  width:100px;
}
.baseDetail-table td{
  width:100px;
}
</style>
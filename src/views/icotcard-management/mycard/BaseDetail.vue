<template>
  <div class="icotcard-baseDetail">
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" >
        <div>
          <h3 style="font-weight:600;display:inline-block;">卡账号信息</h3>
          <a-button type="link" style="display:inline-block;" @click='changeForm'>修改</a-button>
        </div>
        <a-form-item label="卡号" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" style="width：200px">
          <a-input  placeholder="卡号" v-model="form.cardNum" style="width:170px" />
        </a-form-item>
        <a-form-item label="iccid" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input placeholder="iccid" v-model="form.iccid" style="width:170px" />
        </a-form-item>
        <a-form-item label="运营商" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-select placeholder="运营商" v-model="form.cardState" style="width:170px">
            <a-select-option
              v-for="item in kkk"
              :key="item.id"
              :value="item.id"
            >{{item.stationName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="卡状态" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-select placeholder="活动状态" v-model="form.activeState" style="width:170px">
            <a-select-option v-for="item in jjj" :key="item.id" :value="item.id">{{item.state}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发卡日期">
          <a-date-picker @change="startDateChange" style="width:170px"/>
        </a-form-item>
        <a-form-item label="激活日期">
          <a-date-picker @change="startDateChange" style="width:170px" />
        </a-form-item>
        <a-form-item label="服务期止">
          <a-date-picker @change="startDateChange" style="width:170px" />
        </a-form-item>
        <a-form-item label="活动状态">
          <a-select placeholder="活动状态" v-model="form.cardState" style="width:170px">
            <a-select-option value=1>启动</a-select-option>
            <a-select-option value=2>未启动</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="卡内余额（元）">
          <a-input placeholder="卡内余额" v-model="form.money" style="width:170px" />
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
        <a-progress :strokeWidth=14 :percent="30" style="margin:20px 0"/>
        <h3 style="font-weight:600">卡所属信息</h3>
        <a-form-item label="所属机构">
          <a-input v-model="form.company" readonly />
        </a-form-item>
        <a-form-item label="所属设备">
          <a-input v-model="form.company" readonly />
        </a-form-item>
        <a-form-item label="出厂日期">
          <a-input v-model="form.company" readonly />
        </a-form-item>
        <a-form-item label="SIM卡有限期">
          <a-input v-model="form.company" readonly />
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spinning: false,
      formReadOnly:true,
      form: {},
      ddd:[
            {id:1,cardState:'激活'},
            {id:2,cardState:'未激活'},
        ],
        kkk:[
            {id:1,service:'中国电信'},
            {id:2,service:'中国联通'},
            {id:3,service:'中国移动'},
        ],
        jjj:[
          {id:1,state:'已激活'},
          {id:2,state:'未激活'},
        ]
    }
  },
  methods:{
    startDateChange(){

    },
    changeForm(){
      this.formReadOnly=false
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
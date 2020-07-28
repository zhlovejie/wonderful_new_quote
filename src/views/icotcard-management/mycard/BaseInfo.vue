<template>
  <div class="icotcard-baseDetail">
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" >
        <div>
          <h3 style="font-weight:600;display:inline-block;">卡账号信息</h3>
          <a-button type="link" style="display:inline-block;" @click='changeForm'>修改</a-button>
        </div>
        <a-form-item label="卡号" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" style="width：200px">
          <a-input v-decorator="['cardno',{initialValue:cardmsg.cardno}]" style="width:170px" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="iccid" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input v-decorator="['iccid',{initialValue:cardmsg.iccid}]" style="width:170px" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="运营商" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input v-decorator="['operatortype',{initialValue:cardmsg.operatortype}]" style="width:170px" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="卡状态" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input v-decorator="['status',{initialValue:cardmsg.status}]" style="width:170px" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="发卡日期">
          <!-- :default-value="moment(cardmsg.saledate,'YYYY-MM-DD')" -->
          <a-date-picker @change="startDateChange" v-decorator="['saledate',{initialValue:cardmsg.saledate ? moment(cardmsg.saledate,'YYYY-MM-DD') : undefined}]"   style="width:170px" ref='startDate'/>
        </a-form-item>
        <a-form-item label="激活日期">
          <a-input style="width:170px"  v-model="cardmsg.activationdate" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="服务期止">
          <!-- :default-value="moment(cardmsg.validdate,'YYYY-MM-DD')" -->
          <a-date-picker @change="endDateChange" v-decorator="['validdate',{initialValue:cardmsg.validdate ? moment(cardmsg.validdate,'YYYY-MM-DD') : undefined}]" style="width:170px" ref='endDate' />
        </a-form-item>
        <a-form-item label="活动状态">
          <a-input v-decorator="['activestatus',{initialValue:cardmsg.activestatus}]" :readOnly="formreadOnly" style="width:170px" />
        </a-form-item>
        <a-form-item label="卡内余额（元）">
          <a-input placeholder="卡内余额" v-decorator="['cardaccount',{initialValue:cardmsg.cardaccount}]" style="width:170px" :readOnly="formreadOnly" />
        </a-form-item>
        <h3 style="font-weight:600">套餐信息</h3>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
        >
        <div slot="packType">流量</div>
        </a-table>
        <a-progress :strokeWidth=8 :percent="usedNo" style="margin:20px 0"/>
        <h3 style="font-weight:600">卡所属信息</h3>
        <a-form-item label="所属机构">
          <a-input v-decorator="['orgName',{initialValue:cardmsg.orgName}]" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="所属设备">
          <a-input v-decorator="['manId',{initialValue:cardmsg.manId}]" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="出厂日期">
          <a-input v-decorator="['outTime',{initialValue:cardmsg.outTime}]" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="SIM卡有限期">
          <a-input v-decorator="['beOverdueTime',{initialValue:cardmsg.beOverdueTime}]" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item style="float:right">
            <a-button type="primary" v-if="showBtn" @click="updateSimInfo">
              保存
            </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import {addAndUpdateSimInformation,basicInformation} from '@/api/simCard'
import moment from 'moment';
const columns=[
  {
    align: 'center',
    title: '套餐名称',
    dataIndex: 'ptype',
  },
  {
    align: 'center',
    title: '类型',
    dataIndex: 'packType',
    scopedSlots: { customRender: 'packType' }
  },
  {
    align: 'center',
    title: '开始时间',
    dataIndex: 'enableTime',
  },
  {
    align: 'center',
    title: '结束时间',
    dataIndex: 'failureTime',
  },
]
export default {
  data() {
    return {
      spinning: false,
      formreadOnly:true,
      columns: columns,
      dataSource: [],
      form: this.$form.createForm(this),
      cardmsg:{},
      // 发卡日期
      saledate:'',
      defaultStart:moment(this.saledate, 'YYYY-MM-DD'),
      // 截止日期
      validdate:'',
      showBtn:false,
      iccid:'',
      usedNo:0,
      record:{},
    }
  },
  methods:{
    // 流量使用占比 a使用量 b总量
    usedFlow(a,b){
      return a/b*100
    },
    moment,
    init(record){
      this.record=record
      this.iccid=record.iccid
      this.spinning=true
      basicInformation({iccid:this.iccid}).then(res=>{
        if(res.code==200){
          this.spinning=false
          const packagemsg=res.data.packagemsg
          this.cardmsg=res.data.cardmsg
          this.saledate=res.data.cardmsg.saledate
          this.validdate=res.data.cardmsg.validdate
          this.dataSource=packagemsg.map((item, index) => {
            item.key = index + 1
            return item
          })
          this.usedNo=this.usedFlow(packagemsg.used,packagemsg.total)
        }else{
          this.spinning=false
          this.$message.warning(res.msg)
        }
      })
    },
    startDateChange(data,dataStr){
      this.saledate=dataStr
    },
    endDateChange(data,dataStr){
      this.validdate=dataStr
    },
    //修改
    changeForm(){
      this.$refs.startDate.focus()
      this.showBtn=true
    },
    updateSimInfo(){
      const params={}
      params.id=this.record.id
      params.saledate=this.saledate
      params.validdate=this.validdate
      this.spinning=true
      addAndUpdateSimInformation(params).then(res=>{
        if(res.code==200){
          this.$message.success(res.msg)
        }else{
          this.$message.warning(res.msg)
        }
        this.spinning=false
        this.showBtn=false
      })
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
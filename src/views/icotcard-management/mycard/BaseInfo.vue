<template>
  <div class="icotcard-baseDetail">
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline">
        <div>
          <h3 style="font-weight:600;display:inline-block;">卡账号信息</h3>
          <a-button type="link" style="display:inline-block;" @click="changeForm">修改</a-button>
        </div>
        <a-form-item label="卡号" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input
            v-decorator="['cardno',{initialValue:cardmsg.cardno}]"
            style="width:200px"
            :readOnly="formreadOnly"
          />
        </a-form-item>
        <a-form-item label="iccid" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input
            v-decorator="['iccid',{initialValue:cardmsg.iccid}]"
            style="width:200px"
            :readOnly="formreadOnly"
          />
        </a-form-item>
        <a-form-item label="运营商" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input
            v-decorator="['operatortype',{initialValue:cardmsg.operatortype}]"
            style="width:200px"
            :readOnly="formreadOnly"
          />
        </a-form-item>
        <a-form-item label="卡状态" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-input
            v-decorator="['status',{initialValue:cardmsg.status}]"
            style="width:200px"
            :readOnly="formreadOnly"
          />
        </a-form-item>
        <a-form-item label="发卡日期">
          <!-- :default-value="moment(cardmsg.saledate,'YYYY-MM-DD')" -->
          <a-date-picker
            @change="startDateChange"
            v-decorator="['saledate',{initialValue:cardmsg.saledate ? moment(cardmsg.saledate,'YYYY-MM-DD') : undefined}]"
            style="width:200px"
            ref="startDate"
          />
        </a-form-item>
        <a-form-item label="激活日期">
          <a-input style="width:200px" v-model="cardmsg.activationdate" :readOnly="formreadOnly" />
        </a-form-item>
        <a-form-item label="服务期止">
          <!-- :default-value="moment(cardmsg.validdate,'YYYY-MM-DD')" -->
          <a-date-picker
            @change="endDateChange"
            v-decorator="['validdate',{initialValue:cardmsg.validdate ? moment(cardmsg.validdate,'YYYY-MM-DD') : undefined}]"
            style="width:200px"
            ref="endDate"
          />
        </a-form-item>
        <a-form-item label="活动状态">
          <a-input
            v-decorator="['activestatus',{initialValue:cardmsg.activestatus}]"
            :readOnly="formreadOnly"
            style="width:200px"
          />
        </a-form-item>
        <a-form-item label="卡内余额(元)">
          <a-input
            v-decorator="['cardaccount',{initialValue:cardmsg.cardaccount}]"
            style="width:200px"
            :readOnly="formreadOnly"
          />
        </a-form-item>
        <h3 style="font-weight:600">套餐信息</h3>
        <a-table :columns="columns" :dataSource="dataSource" :pagination="false"></a-table>
        <div style="display:inline-block;width:50%;">
          <a-progress :strokeWidth="20" :percent="usedNo" style="margin:20px 0" />
        </div>
        <div
          style="display:inline-block;width:47%;margin-left:3%"
        >共 {{packageTotal}}MB,已使用 {{packageUsed}}MB,剩余 {{packageAllowance}}MB</div>
        <h3 style="font-weight:600">卡所属信息</h3>
        <a-form-item label="所属机构">
          <a-input
            v-decorator="['orgName',{initialValue:crrcardmsg.orgName}]"
            style="width:200px"
            :readOnly="formreadOnly"
          />
        </a-form-item>
        <a-form-item label="所属设备">
          <a-input
            v-decorator="['manId',{initialValue:crrcardmsg.manId}]"
            style="width:200px"
            :readOnly="formreadOnly"
          />
        </a-form-item>
        <a-form-item label="出厂日期">
          <a-input
            v-decorator="['outTime',{initialValue:crrcardmsg.outTime}]"
            style="width:200px"
            :readOnly="formreadOnly"
          />
        </a-form-item>
        <a-form-item label="SIM卡有限期">
          <a-input
            v-decorator="['beOverdueTime',{initialValue:crrcardmsg.beOverdueTime}]"
            style="width:200px"
            :readOnly="formreadOnly"
          />
        </a-form-item>
        <a-form-item style="float:right">
          <a-button type="primary" v-if="showBtn" @click="updateSimInfo">保存</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import { addAndUpdateSimInformation, basicInformation, getSimInformationFlow } from '@/api/simCard'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '套餐名称',
    dataIndex: 'ptype',
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
      formreadOnly: true,
      columns: columns,
      dataSource: [],
      form: this.$form.createForm(this),
      cardmsg: {},
      crrcardmsg:{},
      // 发卡日期
      saledate: '',
      // 截止日期
      validdate: '',
      showBtn: false,
      iccid: '',
      usedNo: 0,
      record: {},
      //流量总量
      packageTotal: 0,
      // 已使用
      packageUsed: 0,
      // 剩余
      packageAllowance: 0,
    }
  },
  methods: {
    // 流量使用占比 a使用量 b总量
    usedFlow(a, b) {
      return (a / b) * 100
    },
    // 流量kb转换Mb
    transMb(kb) {
      return kb / 1024
    },
    moment,
    init(record) {
      this.record = record
      this.iccid = record.iccid
      this.spinning = true
      let that = this
      basicInformation({ iccid: this.iccid }).then((res) => {
        that.spinning = false
        if (res.code == 200) {
          // 判断cardmsg packagemsg是否为null
          const packagemsg = res.data.packagemsg
          const cardmsg = res.data.cardmsg
          that.crrcardmsg = res.data.crrcardmsg
          if (!cardmsg && typeof cardmsg != 'undefined' && cardmsg != 0) {
            return
          } else {
            if(cardmsg.activationdate){
              cardmsg.activationdate = cardmsg.activationdate.slice(0,10)
            }
            this.cardmsg = cardmsg
            this.saledate = cardmsg.saledate.substr(0, 10)
            this.validdate = cardmsg.validdate.substr(0, 10)
            this.dataSource = packagemsg.map((item, index) => {
              item.key = index + 1
              return item
            })
            if (!packagemsg && typeof packagemsg != 'undefined' && packagemsg != 0) {
              retrun
            } else {
              let len = packagemsg.length - 1
              //流量总量
              let packtotal = this.transMb(packagemsg[len].total).toFixed(2)
              this.packageTotal = packtotal == 0 ? 0 : packtotal
              // 已使用
              let packused = this.transMb(packagemsg[len].used).toFixed(2)
              this.packageUsed = packused == 0 ? 0 : packused
              // 剩余
              let packallow = this.transMb(packagemsg[len].allowance).toFixed(2)
              this.packageAllowance = packallow == 0 ? 0 : packallow
              this.usedNo = 1 * this.usedFlow(this.packageUsed, this.packageTotal).toFixed(2)
            }
          }
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    startDateChange(data, dataStr) {
      this.saledate = dataStr
    },
    endDateChange(data, dataStr) {
      this.validdate = dataStr
    },
    //修改
    changeForm() {
      this.$refs.startDate.focus()
      this.showBtn = true
    },
    updateSimInfo() {
      const params = {}
      params.id = this.record.id
      params.saledate = this.saledate
      params.validdate = this.validdate
      this.spinning = true
      addAndUpdateSimInformation(params).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
        this.spinning = false
        this.showBtn = false
      })
    },
  },
}
</script>

<style scoped>
.icotcard-baseDetail >>> .ant-form-item-label {
  width: 100px;
  text-align: left;
}
.baseDetail-table td {
  width: 100px;
}
</style>
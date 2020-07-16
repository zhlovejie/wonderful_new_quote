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
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="时间范围">
              <a-range-picker
              dropdownClassName='myPicker'
                v-decorator="['sDate',{rules: [{required: true,message: '选择时间范围'},{
                validator:this.checkDate}]
                }]"
                format="MM-DD"
                style="width:100%;"
                :allowClear="true"

                @change="sdateChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="上班时间">
              <a-time-picker
                style="width:100%;"
                format="HH:mm:ss"
                v-decorator="['workBeginTime',{rules: [{required: true,message: '输入上班时间'}]}]"
                placeholder="输入上班时间"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="午休时间">
              <a-time-picker
                format="HH:mm:ss"
                v-decorator="['lunchBeginTime',{rules: [{required: true,message: '输入午休开始时间'}]}]"
                placeholder="开始时间"
              />
              <span style="margin:0 10px;">~</span>
              <a-time-picker
                format="HH:mm:ss"
                v-decorator="['lunchEndTime',{rules: [{required: true,message: '输入午休结束时间'}]}]"
                placeholder="结束时间"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="下班时间">
              <a-time-picker
                style="width:100%;"
                format="HH:mm:ss"
                v-decorator="['workEndTime',{rules: [{required: true,message: '输入下班时间'}]}]"
                placeholder="输入下班时间"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { 
  classRuleConfigDetail, 
  classRuleConfigAddAndUpdate,
  classRuleConfigValidationTime 
} from '@/api/attendanceManagement'
import moment from 'moment'

export default {
  name: 'shift-rule-list-add',
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
      spinning: false,
      validationTimeStatus:true
    }
  },
  computed: {
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '修改'}规则`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    }
  },
  methods: {
    checkDate(rule, value, callback) {
      if(value){
        const moment1 = value[0]._d.toLocaleDateString()
        const moment2 = value[1]._d.toLocaleDateString()
        if (moment1 === moment2) {
          callback('时间范围不能重复')
        } 
        callback()
      }else{
        callback()
      }
    },
    moment,
    query(type, record) {
      
      let that = this
      that.actionType = type
      that.detail = Object.assign({}, record)
      that.form.resetFields()
      that.validationTimeStatus = true

      that.$nextTick(() => (that.visible = true))
      if (that.isAdd) {
        return
      }
      if (record) {
        //this.form.setFieldsValue({className:record.className})
        classRuleConfigDetail({ id: record.id }).then(res => {
          //debugger

          let obj = {}
          let tmpYear = '2020-01-01 '
          //obj.beginDate = that.moment('2020'+res.data.beginDate+' 00:00:00')
          //obj.endDate = that.moment('2020'+res.data.endDate+' 00:00:00')
          //console.log('2020-'+res.data.beginDate+' 00:00:00')
          //console.log('2020-'+res.data.endDate+' 00:00:00')
          obj.sDate = [
            that.moment('2020-' + res.data.beginDate + ' 00:00:00'),
            that.moment('2020-' + res.data.endDate + ' 00:00:00')
          ]

          obj.workBeginTime = that.moment(tmpYear + res.data.workBeginTime)
          obj.workEndTime = that.moment(tmpYear + res.data.workEndTime)
          obj.lunchBeginTime = that.moment(tmpYear + res.data.lunchBeginTime)
          obj.lunchEndTime = that.moment(tmpYear + res.data.lunchEndTime)
          that.form.setFieldsValue(obj)
          // "beginDate": "06-16",
          // "endDate": "06-30",
          // "workBeginTime": "17:50:05",
          // "workEndTime": "19:52:06",
          // "lunchBeginTime": "17:50:05",
          // "lunchEndTime": "17:51:07"
          console.log(res)
        })
      }
    },
    handleSubmit() {
      let that = this
      console.log(this.detail)

      if(!that.validationTimeStatus){
        that.$message.info('日期范围有重复请重新选择')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true
          values.id=this.actionType==='edit'?this.detail.id:''
          values.classRuleId =this.actionType==='add'?that.detail.id:undefined
          values.beginDate = values.sDate[0].format('MM-DD')
          values.endDate = values.sDate[1].format('MM-DD')

          values.lunchBeginTime = values.lunchBeginTime.format('HH:mm:ss')
          values.lunchEndTime = values.lunchEndTime.format('HH:mm:ss')
          values.workBeginTime = values.workBeginTime.format('HH:mm:ss')
          values.workEndTime = values.workEndTime.format('HH:mm:ss')

          classRuleConfigAddAndUpdate(values)
            .then(res => {
              that.$message.info(res.msg)
              that.spinning = false
              that.handleCancel()
              that.$emit('finish')
            })
            .catch(err => {
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    sdateChange(arrMoment,arrStrs){
      //debugger
      let that = this
      if(arrMoment.length === 0){
        return
      }
      classRuleConfigValidationTime({
        beginDate:arrMoment[0].format('YYYY-MM-DD'),
        endDate:arrMoment[1].format('YYYY-MM-DD'),
        ruleId:that.detail.classRuleId,
        id:that.detail.classRuleDetailId
      }).then(res =>{
        console.log(res)
        that.validationTimeStatus = +res.code === 200
        if(!that.validationTimeStatus){
          that.$message.info(res.msg)
          //that.form.setFieldsValue({sDate:undefined})
        }
      })
    }
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}

</style>
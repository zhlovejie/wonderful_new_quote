<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction" >不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline"  class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]"/>
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">选择加班事件</td>
            <td>
              <a-form-item>
                <a-select 
                  v-if="!isDisabled"
                  :disabled="isEdit"
                  placeholder="加班事件"
                  v-decorator="['exceptionId',{initialValue:detail.exceptionId,rules: [{required: true,message: '请选择加班事件'}]}]"
                  :allowClear="true" 
                  style="width:100%;" 
                  @change="exceptionChange"
                >
                  <a-select-option v-for="item in exceptionList" :key="item.id" :value="item.id">
                    {{item.exceptionName}}
                    (
                      发生时间：{{item.happenDate}}
                    )
                  </a-select-option>
                </a-select>
                <span v-else>{{detail.exceptionName}}</span>
              </a-form-item>
            </td>
          </tr>
          
          <tr>
            <td style="width:120px;">开始时间</td>
            <td>
              <div style="display:flex;" v-if="!isDisabled">
                <a-form-item>
                  <a-date-picker 
                    v-decorator="['s_begin_date',{initialValue:detail.beginTime ? moment(detail.beginTime) : undefined,rules: [{required: true,message: '请选择日期'}]}]" 
                    @change="dateBeginPickerChange"
                  />
                </a-form-item>
                <a-form-item style="margin-left:10px;">
                  <a-time-picker 
                    :minute-step="5" 
                    :second-step="60" 
                    v-decorator="['s_begin_time',{initialValue:detail.beginTime ? moment(detail.beginTime) :undefined,rules: [{required: true,message: '请选择时间'}]}]" 
                    @change="dateBeginTimeChange"
                  />
                </a-form-item>
              </div>
              <a-form-item v-else>
                {{detail.beginTime}}
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">结束时间</td>
            <td>
              <div style="display:flex;" v-if="!isDisabled">
                <a-form-item>
                  <a-date-picker 
                    v-decorator="['s_end_date',{initialValue:detail.endTime ? moment(detail.endTime) : undefined,rules: [{required: true,message: '请选择日期'}]}]" 
                    @change="dateEndPickerChange"
                  />
                </a-form-item>
                <a-form-item style="margin-left:10px;">
                  <a-time-picker 
                    :minute-step="5" 
                    :second-step="60" 
                    v-decorator="['s_end_time',{initialValue:detail.endTime ? moment(detail.endTime) : undefined,rules: [{required: true,message: '请选择时间'}]}]" 
                    @change="dateEndTimeChange"
                  />
                </a-form-item>
              </div>
              <a-form-item v-else>
                {{detail.endTime}}
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">时长</td>
            <td>
              <a-form-item>
                <template v-if="duration.hour !== undefined">
                {{duration.hour + '小时 &nbsp;'+ (duration.isMeal === 1 ? '有餐补' : '无餐补')}}
                </template>
              </a-form-item>
            </td>
          </tr>
          <tr >
            <td style="width:120px;">加班原因</td>
            <td>
              <a-form-item>
                <a-textarea 
                  v-if="!isDisabled"
                  style="width:100%;"
                  placeholder="加班原因" 
                  :rows="2" 
                  v-decorator="['reason', { initialValue:detail.reason,rules: [{ required: true, message: '请输入加班原因' }] }]"
                />
                <span v-else>
                  {{detail.reason}}
                </span>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-modal>
</template>
<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'
import {
  overworkApplyDetail , 
  overworkApplyAddAndUpdate ,
  overworkApplyApproval,
  signExceptionByCondition,
  overworkApplyHours,
  overworkApplyInitTime
} from '@/api/attendanceManagement'
import Approval from './Approval'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name:'over-time-apply-add',
  components:{Approval},
  data(){
    return {
      form: this.$form.createForm(this),
      visible:false,
      spinning:false,
      actionType:'view',
      detail:{},
      record:{},
      spinning:false,
      exceptionList:[],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      sDate:{},
      duration:{}
    }
  },
  computed:{
    modalTitle(){
      let obj = {'view':'查看','add':'新增','edit':'修改','approval':'审批'}
      return `${obj[this.actionType]}加班申请`
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
  watch:{
    sDate(newDate,oldDate){
      let that = this
      let {beginDate,beginTime,endDate,endTime} = this.sDate
      if(beginDate && beginTime && endDate && endTime){
        let _beginDateStr = `${beginDate} ${beginTime}`
        let _endDateStr = `${endDate} ${endTime}`
        let _beginDate = moment(_beginDateStr)
        let _endDate = moment(_endDateStr)
        let diff = _endDate.diff(_beginDate,'minutes')
        if(diff <= 0){
          that.$message.info('结束时间必须大于开始时间')
          return
        }
        that.fetchOverworkApplyHours({
          beginTime:_beginDateStr,
          endTime:_endDateStr
        })
      }
    }
  },
  methods:{
    moment,
    init() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async query(type,record){
      //debugger
      let that = this
      
      that.actionType = type,
      that.record = Object.assign({},record)
      that.detail = {}
      that.sDate = {}
      that.duration = {}
      that.exceptionList = []
      that.form.resetFields()
      await that.init()
      await that.fetchSignExceptionByCondition(that.record.createdId || that.userInfo.id)
      that.visible = true
      if(that.isAdd){
        that.detail = {}
        return
      }
      overworkApplyDetail({id:record.id}).then(res =>{
        //debugger
        let data = res.data
        let beginTime = moment(data.beginTime)
        let endTime = moment(data.endTime)
        that.sDate = {
          beginDate:beginTime.format('YYYY-MM-DD'),
          beginTime:beginTime.format('HH:mm:ss'),
          endDate:endTime.format('YYYY-MM-DD'),
          endTime:endTime.format('HH:mm:ss'),
        }

        //异常事件修改的时候，已经使用掉，列表中已经没有该条异常事件 这里加上
        if(that.isEdit){
          let target = that.exceptionList.find(item => +item.id === +data.exceptionId)
          if(!target){
            let _exceptionList = [...that.exceptionList]
            _exceptionList.push({
              id:data.exceptionId,
              exceptionName:data.exceptionName,
              happenDate:moment(data.beginTime).format('YYYY-MM-DD')
            })
            _exceptionList.sort((a,b) => a.happenDate > b.happenDate)
            that.exceptionList = _exceptionList
          }
        }

        that.$nextTick(() => that.detail = {...data})
        //that.fetchOverworkApplyHours({beginTime,endTime})
        console.log(res)
      })
    },
    fetchSignExceptionByCondition(userId){
      return signExceptionByCondition({exceptionType:2,userId:userId}).then(res =>{
        this.exceptionList = res.data
      })
    },
    dateBeginPickerChange(date,dateStr){
      let sDate = {...this.sDate}
      sDate.beginDate = date ? dateStr : undefined
      this.sDate = sDate
    },
    dateBeginTimeChange(time,timeStr){
      let sDate = {...this.sDate}
      sDate.beginTime = time ? timeStr : undefined
      this.sDate = sDate
    },
    dateEndPickerChange(date,dateStr){
      let sDate = {...this.sDate}
      sDate.endDate = date ? dateStr : undefined
      this.sDate = sDate
    },
    dateEndTimeChange(time,timeStr){
      let sDate = {...this.sDate}
      sDate.endTime = time ? timeStr : undefined
      this.sDate = sDate
    },
    fetchOverworkApplyHours({beginTime,endTime}){
      let that = this
      overworkApplyHours({
        beginTime,
        endTime
      }).then(res =>{
        if(res.code !== 200){
          that.$message.info(res.msg)  
        }
        that.duration = {...res.data} || {}
      })
    },
    exceptionChange(val){
      let that = this
      let target = this.exceptionList.find(item => +item.id === +val)
      if(target){
        overworkApplyInitTime({
          userId:that.record.createdId || that.userInfo.id,
          attanceDate:moment(target.happenDate).format('YYYY-MM-DD')
        }).then(res =>{
          //console.log(res)
          if(res && res.data){
            if('signBeginDateTime' in res.data){
              let {signBeginDateTime} = res.data
              that.form.setFieldsValue({
                s_begin_date:moment(signBeginDateTime),
                s_begin_time:moment(signBeginDateTime),
              })
            }
            if('signEndDateTime' in res.data){
              let {signEndDateTime} = res.data
              that.form.setFieldsValue({
                s_end_date:moment(signEndDateTime),
                s_end_time:moment(signEndDateTime)
              })
            }
            if('signBeginDateTime' in res.data && 'signEndDateTime' in res.data){
              let {signBeginDateTime,signEndDateTime} = res.data
              that.sDate = {
                beginDate:moment(signBeginDateTime).format('YYYY-MM-DD'),
                beginTime:moment(signBeginDateTime).format('HH:mm:ss'),
                endDate:moment(signEndDateTime).format('YYYY-MM-DD'),
                endTime:moment(signEndDateTime).format('HH:mm:ss')
              }
            }
          }   
        })
      }
    },
    handleSubmit(){
      let that = this
      if(that.isView){
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          delete values.s_begin_date
          delete values.s_begin_time
          delete values.s_end_date
          delete values.s_end_time

          values.beginTime = `${that.sDate.beginDate} ${that.sDate.beginTime}`
          values.endTime = `${that.sDate.endDate} ${that.sDate.endTime}`
          
          if(values.beginTime >= values.endTime){
            that.$message.info('结束时间必须大于开始时间')
            return
          }
          if('hour' in that.duration && 'isMeal' in that.duration){
            values.duration = that.duration.hour
            values.isMeal = that.duration.isMeal
          }else{
            that.$message.info('时间范围小于加班最小时长')
            return
          }
          
          that.spinning = true 

          overworkApplyAddAndUpdate(values).then(res =>{
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
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      overworkApplyApproval(values)
        .then(res => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch(err => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
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
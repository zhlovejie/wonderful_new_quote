<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false" 
    :class="{'ant-modal_no_footer':isView}"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button
          key="submit"
          type="primary"
          icon="check"
          :loading="spinning"
          @click="passAction"
        >通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">选择请假类型</td>
            <td>
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  placeholder="请假类型"
                  v-decorator="['holidayId',{initialValue:detail.holidayId,rules: [{required: true,message: '请选择请假类型'}]}]"
                  :allowClear="true"
                  style="width:100%;"
                  @change="holidayChange"
                >
                  <a-select-option
                    v-for="item in holidayList"
                    :key="item.id"
                    :value="item.id"
                  >{{item.holidayName}}</a-select-option>
                </a-select>
                <span v-else>{{detail.holidayName}}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">开始时间</td>
            <td>
              <a-form-item>
                <a-date-picker
                  v-if="!isDisabled"
                  :format="dateFormat"
                  :show-time="showTime"
                  v-decorator="['beginTime',{initialValue:detail.beginTime ? moment(detail.beginTime) : undefined,rules: [{required: true,message: '请选择开始时间'}]}]"
                  @change="datePickerChange"
                  style="width:100%;"
                />
                <span v-else>{{+detail.holidayUnitType === 1 ? detail.beginTime.slice(0,10) : detail.beginTime}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">结束时间</td>
            <td>
              <a-form-item>
                <a-date-picker
                  v-if="!isDisabled"
                  :format="dateFormat"
                  :disabled-date="disabledDate"
                  :show-time="showTime"
                  v-decorator="['endTime',{initialValue:detail.endTime ? moment(detail.endTime) : undefined,rules: [{required: true,message: '请选择结束时间'}]}]"
                  style="width:100%;"
                  @change="datePickerChange"
                />
                <span v-else>{{+detail.holidayUnitType === 1 ? detail.endTime.slice(0,10) : detail.endTime}}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width:120px;">时长</td>
            <td>
              <a-form-item>{{leaveTime}}{{holidayTarget ? {1:'天',3:'小时'}[holidayTarget.holidayUnitType] || '' : ''}}</a-form-item>
            </td>
          </tr>
          <tr v-if="isYearHolidayOrLeaveHoliday">
            <td style="width:120px;">剩余可调休时间(小时)</td>
            <td>
              <a-form-item>{{userRestHours}}</a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">请假事由</td>
            <td>
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width:100%;"
                  placeholder="请假事由"
                  :rows="2"
                  v-decorator="['reason', { initialValue:detail.reason,rules: [{ required: true, message: '请输入请假事由' }] }]"
                />
                <span v-else>{{detail.reason}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">上传凭证</td>
            <td style="text-align:left;">
              <div class="clearfix" style="width:400px;overflow:hidden;">
                <a-upload
                  v-if="!isDisabled"
                  name="file"
                  :action="uploadPath"
                  :multiple="false"
                  :fileList="fileList"
                  @change="handleChange"
                >
                  <a-button type="dashed" icon="upload" v-if="!isView">上传文件</a-button>
                </a-upload>

                <div v-else>
                  <div v-for="f in fileList" :key="f.uid">
                    <!-- <a :href="f.url" target="_blank">{{f.name}}</a> -->
                    <img @click="() => previewVisible = true" alt="上传凭证" class="picture-card" :src="f.url" />
                    <a-modal :visible="previewVisible" :footer="null" @cancel="() => previewVisible = false">
                      <img alt="上传凭证" style="width: 100%" :src="f.url" />
                    </a-modal>
                  </div>
                </div>
              </div>
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
import { getUploadPath2 } from '@/api/common'
import {
  attenceLeaveApplyDetail,
  attenceLeaveApplyAddOrUpdate,
  attenceLeaveApplyApprove,
  attenceLeaveApplyAllHoliday,
  attenceLeaveApplyUserRestHoursRecord,
  attenceLeaveApplyComputeLeaveTime,
  attenceLeaveApplyCheckHolidayUsed
} from '@/api/attendanceManagement'
import Approval from './Approval'
import moment from 'moment'

let uuid = () =>
  Math.random()
    .toString(32)
    .slice(-10)

export default {
  name: 'attendance-leave-apply-add',
  components: { Approval },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
      record: {},
      spinning: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      uploadPath: getUploadPath2(),
      fileList: [],
      userRestHours: 0, //可调休时长
      leaveTime: 0, //自动计算时长
      holidayList: [],
      holidayTarget:null,
      isHolidayUsed: false, //是否已有该类型的请假单
      isYearHolidayOrLeaveHoliday: false, //年假或调休
      requireUpload:false, //婚假必须上次结婚证书
      previewVisible:false
    }
  },
  computed: {
    modalTitle() {
      let obj = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${obj[this.actionType]}请假申请`
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
    },
    isLeaveTimeThanUserRestHours() {
      //年假 调休 请假时长大于 可以调休时长
      return this.isYearHolidayOrLeaveHoliday && this.leaveTime > this.userRestHours
    },
    showTime(){
      if(this.holidayTarget){
        if(+this.holidayTarget.holidayCaculatorType === 2){
          return false
        }else if(+this.holidayTarget.holidayCaculatorType === 1){
          return { 
            defaultValue: moment('00:00:00', 'HH:mm:ss'),
            minuteStep:30,
            secondStep:60
          }
        }
      }
      return false
    },
    dateFormat(){
      if(this.holidayTarget){
        debugger
        if(+this.holidayTarget.holidayCaculatorType === 2){
          return 'YYYY-MM-DD'
        }else if(+this.holidayTarget.holidayCaculatorType === 1){
          return 'YYYY-MM-DD HH:mm:ss'
        }
      }
      return 'YYYY-MM-DD'
    }
  },
  watch: {
    isLeaveTimeThanUserRestHours(res) {
      if (res && (this.isAdd || this.isEdit)) {
        this.$message.info('请假时长大于可以调休时长，禁止操作')
      }
    }
  },
  methods: {
    moment,
    init() {
      let that = this
      let queue = []
      let task1 = attenceLeaveApplyAllHoliday().then(res => (that.holidayList = res.data))
      queue.push(task1)
      return Promise.all(queue)
    },
    disabledDate(current){
      //debugger
      let that = this
      let beginTime = that.form.getFieldValue('beginTime')
      if(
        beginTime instanceof moment && 
        this.holidayTarget !== null && 
        this.holidayTarget.legalDuration > 0 
      ){

        return current <= beginTime || current >= beginTime.clone().add(+this.holidayTarget.legalDuration,'days')
      }
      return false
    },
    holidayChange(val) {
      let that = this
      that.form.setFieldsValue({
        beginTime: undefined,
        endTime: undefined
      })
      that.leaveTime = 0
      that.userRestHours = 0

      let target = that.holidayList.find(item => +item.id === +val)
      if (!target) {
        console.log('获取请假类型失败=>', val)
        that.isHolidayUsed = false
        that.isYearHolidayOrLeaveHoliday = false
        that.holidayTarget = null
        that.requireUpload = false
        return
      }

      that.holidayTarget = Object.assign({},target)
      //目前婚假需要上传凭证
      that.requireUpload = that.holidayTarget.holidayName === '婚假'

      //4、法定假日（只能请一次）
      if (+target.holidayType === 4) {
        attenceLeaveApplyCheckHolidayUsed({
          holidayId: target.id,
          userId: that.record.createdId || that.userInfo.id
        }).then(res => {
          console.log(res)
          that.isHolidayUsed = res.data
          if (that.isHolidayUsed) {
            that.$message.info('系统检测到您有该类型的请假单，禁止操作')
          }
        })
      }

      //是否启用假期余额
      if (+target.userRemain === 1) {
        that.isYearHolidayOrLeaveHoliday = true
        attenceLeaveApplyUserRestHoursRecord({
          hourType: target.holidayType,
          userId: that.record.createdId || that.userInfo.id
        }).then(res => {
          console.log(res)
          that.userRestHours = res.data ? res.data.remainHours : 0
        })
      } else {
        that.isYearHolidayOrLeaveHoliday = false
      }
    },
    datePickerChange() {
      let that = this
      that.$nextTick(() => {
        let result = that.form.getFieldsValue(['beginTime', 'endTime'])
        if (result.beginTime instanceof moment && result.endTime instanceof moment) {
          let beginTime = result.beginTime.format('YYYY-MM-DD HH:mm:ss')
          let endTime = result.endTime.format('YYYY-MM-DD HH:mm:ss')
          attenceLeaveApplyComputeLeaveTime({
            beginTime,
            endTime,
            holidayCaculatorType:that.holidayTarget.holidayCaculatorType,
            holidayUnitType:that.holidayTarget.holidayUnitType,
          }).then(res => {
            that.leaveTime = res.data || 0
          })
        } else {
          that.leaveTime = 0
        }
      })
    },
    async query(type, record) {
      //debugger
      let that = this

      ;(that.actionType = type), (that.record = Object.assign({}, record))
      that.detail = {}
      that.fileList = []
      that.userRestHours = 0 //可调休时长
      that.leaveTime = 0 //自动计算时长
      that.holidayList = []
      that.isHolidayUsed = false
      that.isYearHolidayOrLeaveHoliday = false //年假或调休
      that.holidayTarget = null
      that.form.resetFields()
      await that.init()
      that.visible = true
      if (that.isAdd) {
        that.detail = {}
        return
      }
      
      that.spinning = true
      await attenceLeaveApplyDetail({ id: record.id }).then(res => {
        that.spinning = false
        //debugger
        let data = res.data
        if(!data){
          setTimeout(function(){
            that.visible = false
            that.$message.info('获取信息失败。')
          },500)
          return
        }
        that.detail = { ...data }

        let holidayTarget = that.holidayList.find(item => +item.id === +that.detail.holidayId)
        if(holidayTarget){
          that.holidayTarget = Object.assign({},holidayTarget)
        }
        
        that.isYearHolidayOrLeaveHoliday = ['年假', '调休'].includes(that.detail.holidayName)

        that.leaveTime = that.detail.leaveTime
        if (that.detail.docUrl) {
          that.fileList = that.detail.docUrl.split(',').map((url, index) => {
            let arr = url.split('/')
            let name = arr[arr.length - 1]
            return {
              uid: String(index + 1),
              name: name,
              status: 'done',
              url: url
            }
          })
        }

        if(data.userRemain && data.userRemain === 1){
          attenceLeaveApplyUserRestHoursRecord({
            hourType: that.holidayTarget.holidayType,
            userId: that.record.createdId || that.userInfo.id
          }).then(res => {
            console.log(res)
            that.userRestHours = res.data ? res.data.remainHours : 0
          })
        }
      }).catch(err =>{
        that.spinning = false
        that.$message.info(err.message)
      })
    },
    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      if (that.isHolidayUsed) {
        that.$message.info('系统检测到您有该类型的请假单，禁止操作')
        return
      }

      if (that.isLeaveTimeThanUserRestHours) {
        that.$message.info('请假时长大于可以调休时长，禁止操作')
        return
      }
      

      this.form.validateFields((err, values) => {
        if (!err) {
          values.beginTime = values.beginTime.format('YYYY-MM-DD HH:mm:ss')
          values.endTime = values.endTime.format('YYYY-MM-DD HH:mm:ss')

          let target = that.holidayList.find(item => +item.id === +values.holidayId)
          if (target) {
            debugger
            console.log('请假类型 =>', target)
            values.holidayName = target.holidayName
            values.holidayType = target.holidayType
            values.holidayUnitType = target.holidayUnitType
            //values.holidayCode = target.holidayCode
          } else {
            console.log('未找到请假类型')
          }

          values.leaveTime = that.leaveTime
          values.docUrl = that.fileList
            .filter(f => f.url)
            .map(f => f.url)
            .join(',')

          if(that.requireUpload && values.docUrl.length === 0){
            that.$message.info('婚假必须上传凭证')
            return
          }

          console.log('Received values of form: ', values)
          that.spinning = true
          attenceLeaveApplyAddOrUpdate(values)
            .then(res => {
              that.$message.info(res.msg)
              that.spinning = false
              if(+res.code === 200){
                that.handleCancel()
                that.$emit('finish')
              }
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
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      attenceLeaveApplyApprove(values)
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
    },
    handleChange(info) {
      console.log(arguments)
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList
    }
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
  text-align: left;
}


.picture-card{
  position: relative;
  height: 66px;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 0 3px #ddd;
}
</style>
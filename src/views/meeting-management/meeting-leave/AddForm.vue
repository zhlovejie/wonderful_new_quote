<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <a-form-item hidden>
          <a-input v-decorator="['meetingId', { initialValue: detail.meetingId }]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="wdf-column">开始时间</td>
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
                <span v-else>{{detail.beginTime}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">结束时间</td>
            <td>
              <a-form-item>
                <a-date-picker
                  v-if="!isDisabled"
                  :format="dateFormat"
                  :show-time="showTime"
                  v-decorator="['endTime',{initialValue:detail.endTime ? moment(detail.endTime) : undefined,rules: [{required: true,message: '请选择结束时间'}]}]"
                  style="width:100%;"
                  @change="datePickerChange"
                />
                <span v-else>{{detail.endTime}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">时长</td>
            <td>
              <a-form-item>
                <span>{{leaveTime}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">请假事由</td>
            <td>
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width:100%;"
                  placeholder="请假事由"
                  :rows="2"
                  v-decorator="['leaveReason', { initialValue:detail.leaveReason,rules: [{ required: true, message: '请输入请假事由' }] }]"
                />
                <span v-else>{{detail.leaveReason}}</span>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import {
  addAndUpdateMeetingLeave,
  approvalMeetingLeave,
  getMeetingLeaveDetail
} from '@/api/meetingManagement'
import moment from 'moment'
import Approval from './Approval'

export default {
  name: 'meeting-leave-record-AddForm',
  components: {
    Approval
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'meeting-leave-record-AddForm' }),
      visible: false,
      actionType: 'view',
      spinning: false,
      detail: {},
      leaveTime:''
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : this.isAdd ? '新增' : '编辑'
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
    isApproval(){
      return this.actionType === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    },
    dateFormat(){
      return 'YYYY-MM-DD HH:mm:ss'
    },
    showTime(){
      return {
        defaultValue: moment('00:00:00', 'HH:mm:ss'),
        minuteStep:30,
        secondStep:60
      }
    },
    footer() {
      let that = this
      const h = that.$createElement
      let btn = []
      if (that.isView) {
        return null
      } else if (that.isAdd || that.isEdit) {
        btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
        btn.push(
          h(
            'a-button',
            {
              key: 'submit',
              on: { click: () => that.handleOk() },
              props: { type: 'primary', loading: that.spinning },
            },
            '提交'
          )
        )
      } else if (that.isApproval) {
        btn.push(h('a-button', { key: 'no-pass', on: { click: that.noPassAction } ,props:{loading: that.spinning}}, '不通过'))
        btn.push(
          h(
            'a-button',
            { key: 'pass', on: { click: that.passAction }, props: { type: 'primary', loading: that.spinning } },
            '通过'
          )
        )
      }
      return btn
    },
  },
  methods: {
    moment,
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          values.beginTime = values.beginTime.format('YYYY-MM-DD HH:mm:ss')
          values.endTime = values.endTime.format('YYYY-MM-DD HH:mm:ss')
          that.spinning = true
          addAndUpdateMeetingLeave(values)
            .then((res) => {
              that.spinning = false
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      let that = this
      that.visible = true
      that.actionType = type
      that.leaveTime = ''
      that.detail = {}
      if(that.isAdd){
        let {id:meetingId,setTimeStr} = record
        let f = (str) => {
          let [ymd,sub] = str.split(' ')
          let [s,e] = sub.split('-')
          return {beginTime:`${ymd} ${s}:00`,endTime:`${ymd} ${e}:00`}
        }
        let {beginTime,endTime} = f(setTimeStr)
        that.detail = {
          meetingId,
          beginTime,
          endTime
        }
        that.leaveTime = that.calcTimes(that.moment(beginTime),that.moment(endTime))
      }else{
        await getMeetingLeaveDetail({id:record.id}).then(res =>{
          that.detail = res.data
          let {beginTime,endTime} = that.detail
          that.leaveTime = that.calcTimes(that.moment(beginTime),that.moment(endTime))
        })
      }
    },
    datePickerChange() {
      let that = this
      that.$nextTick(() => {
        let result = that.form.getFieldsValue(['beginTime', 'endTime'])
        if (result.beginTime instanceof moment && result.endTime instanceof moment) {
           that.leaveTime = that.calcTimes(result.beginTime,result.endTime)
        } else {
          that.leaveTime = ''
        }
      })
    },
    calcTimes(m1,m2){
      if (m1 instanceof moment && m2 instanceof moment) {
        let diff = m2.diff(m1,'minutes')
        return `${Math.floor(diff / 60)}小时${diff % 60}分钟`
      } else {
        return ''
      }
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.detail.id })
      that.spinning = true
      approvalMeetingLeave(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      //that.opinion = ''
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}

.wdf-column {
  width: 160px;
}
</style>

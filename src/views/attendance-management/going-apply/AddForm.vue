<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :class="{ 'ant-modal_no_footer': isView }"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 120px">开始时间</td>
            <td>
              <a-form-item>
                <a-date-picker
                  v-if="!isDisabled"
                  :format="dateFormat"
                  :show-time="showTime"
                  v-decorator="[
                    'startTime',
                    {
                      initialValue: detail.startTime ? moment(detail.startTime) : undefined,
                      rules: [{ required: true, message: '请选择开始时间' }],
                    },
                  ]"
                  @change="datePickerChange"
                  style="width: 100%"
                />
                <span v-else>{{
                  +detail.holidayUnitType === 1 ? detail.startTime.slice(0, 10) : detail.startTime
                }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 120px">结束时间</td>
            <td>
              <a-form-item>
                <a-date-picker
                  v-if="!isDisabled"
                  :format="dateFormat"
                  :disabled-date="disabledDate"
                  :show-time="showTime"
                  v-decorator="[
                    'endTime',
                    {
                      initialValue: detail.endTime ? moment(detail.endTime) : undefined,
                      rules: [{ required: true, message: '请选择结束时间' }],
                    },
                  ]"
                  style="width: 100%"
                  @change="datePickerChange"
                />
                <span v-else>{{ +detail.holidayUnitType === 1 ? detail.endTime.slice(0, 10) : detail.endTime }}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width: 120px">时长</td>
            <td>
              <a-form-item>{{ leaveTime }}小时</a-form-item>
            </td>
          </tr>
          <tr v-if="actionType === 'add'">
            <td style="width: 120px">是否使用公车</td>
            <td>
              <a-form-item>
                <a-radio-group v-model="bus">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="2"> 否 </a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>

          <tr v-if="detail.carDicNum !== null">
            <template v-if="actionType === 'add' && bus === 1">
              <td style="width: 120px">使用公车</td>
              <td>
                <a-form-item>
                  <a-select
                    v-if="!isDisabled"
                    placeholder="选择公车"
                    v-decorator="[
                      'carDicNum',
                      {
                        initialValue: detail.carDicNum ? +detail.carDicNum : undefined,
                        rules: [{ required: true, message: '选择公车' }],
                      },
                    ]"
                    :allowClear="true"
                    style="width: 334px"
                  >
                    <a-select-option v-for="item in carList" :key="item.id" :value="item.carCode">{{
                      item.carCode
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </template>
            <template v-else-if="detail.carDicNum !== null && actionType !== 'add'">
              <td style="width: 120px">使用公车</td>
              <td>
                <span>{{ detail.carDicNum }}</span>
              </td>
            </template>
          </tr>
          <tr>
            <td style="width: 120px">外出事由</td>
            <td>
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="外出事由"
                  :rows="2"
                  v-decorator="[
                    'reason',
                    { initialValue: detail.reason, rules: [{ required: true, message: '请输入外出事由' }] },
                  ]"
                />
                <span v-else>{{ detail.reason }}</span>
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
import { carInfoListWithoutPage } from '@/api/vehicleManagement'
import { going_detail, going_add, going_approve, attenceLeaveApplyComputeLeaveTime } from '@/api/attendanceManagement'
import Approval from './Approval'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

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
      bus: 2,
      vehicleId: '',
      carList: [], //公司车辆
      userInfo: this.$store.getters.userInfo, // 当前登录人
      leaveTime: 0, //自动计算时长
      holidayList: [],
      holidayTarget: null,
      requireUpload: false, //婚假必须上次结婚证书
      previewVisible: false,
    }
  },
  computed: {
    modalTitle() {
      let obj = { view: '查看', add: '新增', approval: '审批' }
      return `${obj[this.actionType]}外出申请`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
    showTime() {
      return {
        defaultValue: moment('00:00:00', 'HH:mm:ss'),
        minuteStep: 30,
        secondStep: 60,
      }
    },
    dateFormat() {
      return 'YYYY-MM-DD HH:mm:ss'
    },
  },

  methods: {
    moment,
    init() {
      let that = this
      carInfoListWithoutPage().then((res) => (that.carList = res.data))
    },
    disabledDate(current) {
      //debugger
      let that = this
      let startTime = that.form.getFieldValue('startTime')
      if (startTime instanceof moment && this.holidayTarget !== null && this.holidayTarget.legalDuration > 0) {
        return current <= startTime || current >= startTime.clone().add(+this.holidayTarget.legalDuration, 'days')
      }
      return false
    },

    datePickerChange() {
      let that = this
      that.$nextTick(() => {
        let result = that.form.getFieldsValue(['startTime', 'endTime'])
        if (result.startTime instanceof moment && result.endTime instanceof moment) {
          let beginTime = result.startTime.format('YYYY-MM-DD HH:mm:ss')
          let endTime = result.endTime.format('YYYY-MM-DD HH:mm:ss')
          attenceLeaveApplyComputeLeaveTime({
            beginTime,
            endTime,
            holidayCaculatorType: 1,
            holidayUnitType: 3,
          }).then((res) => {
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
      that.leaveTime = 0 //自动计算时长
      that.form.resetFields()
      await that.init()
      that.visible = true
      if (that.isAdd) {
        that.detail = {}
        return
      }
      await going_detail({ id: record.id }).then((res) => {
        //debugger
        let data = res.data
        that.detail = { ...data }

        that.leaveTime = that.detail.duration
      })
    },
    handleSubmit() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          values.startTime = values.startTime.format('YYYY-MM-DD HH:mm:ss')
          values.endTime = values.endTime.format('YYYY-MM-DD HH:mm:ss')
          values.duration = that.leaveTime
          console.log(values)
          that.spinning = true
          going_add(values)
            .then((res) => {
              that.$message.info(res.msg)
              that.spinning = false
              if (+res.code === 200) {
                that.handleCancel()
                that.$emit('finish')
              }
            })
            .catch((err) => {
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
      going_approve(values)
        .then((res) => {
          that.spinning = false
          console.log(res)
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

.picture-card {
  position: relative;
  height: 66px;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 0 3px #ddd;
}
</style>

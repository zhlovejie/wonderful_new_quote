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
        <a-button v-if="this.record.thingType !== 2" key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 120px">选择异常事件</td>
            <td>
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  :disabled="isEdit"
                  placeholder="异常事件"
                  v-decorator="[
                    'exceptionId',
                    { initialValue: detail.exceptionId, rules: [{ required: true, message: '请选择异常事件' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                  @change="exceptionChange"
                >
                  <a-select-option v-for="item in exceptionList" :key="item.id" :value="item.id">
                    {{ item.exceptionName }}
                    ( 类型：{{ getExceptionTypeTxt(item.exceptionType) }} 发生时间：{{ item.happenDate }}
                    )
                  </a-select-option>
                </a-select>
                <span v-else>{{ detail.exceptionName }}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td style="width: 120px">日期</td>
            <td>
              <a-form-item>
                {{ exceptionItem.happenDate }}
              </a-form-item>
            </td>
          </tr>
          <tr v-if="this.record.thingType !== 1">
            <td style="width: 120px">入厂时间</td>
            <td>
              <a-form-item>
                <a-time-picker
                  :disabled="isResignType.flag"
                  format="h:mm a"
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="参考时间"
                  :allowClear="true"
                  v-decorator="['resignTime', { rules: [{ required: true, message: '参考入厂时间' }] }]"
                />

                <span v-else>
                  {{ detail.resignTime }}
                </span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 120px">异常类型</td>
            <td>
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  placeholder="异常类型"
                  v-decorator="[
                    'thingType',
                    { initialValue: detail.thingType, rules: [{ required: true, message: '选择异常类型' }] },
                  ]"
                  :allowClear="true"
                  style="width: 100%"
                >
                  <a-select-option :value="1">设备异常</a-select-option>
                  <a-select-option :value="2">忘记打卡</a-select-option>
                  <a-select-option :value="3">停电</a-select-option>
                  <a-select-option :value="4">天气异常</a-select-option>
                </a-select>
                <span v-else>
                  {{ { 1: '设备异常', 2: '忘记打卡', 3: '停电', 4: '天气异常' }[detail.thingType] }}
                </span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 120px">缺卡原因</td>
            <td>
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="缺卡原因"
                  :rows="2"
                  v-decorator="[
                    'reason',
                    { initialValue: detail.reason, rules: [{ required: true, message: '请输入缺卡原因' }] },
                  ]"
                />
                <span v-else>
                  {{ detail.reason }}
                </span>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="isApproval && this.record.thingType !== 1">
            <td style="width: 120px">是否有凭证</td>
            <td>
              <a-form-item>
                <a-radio-group
                  name="radioGroup"
                  @change="isEvidences"
                  v-decorator="[
                    'isEvidence',
                    { initialValue: 0, rules: [{ required: false, message: '请选择是否有凭证' }] },
                  ]"
                >
                  <a-radio :value="0"> 有 </a-radio>
                  <a-radio :value="1"> 没有 </a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="isApproval && this.isEvidence === 0 && this.record.thingType !== 1">
            <td style="width: 120px">凭证</td>
            <td>
              <a-form-item>
                <a-upload
                  :action="uploadPath"
                  accept=".png, .jpg"
                  list-type="picture-card"
                  :file-list="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 5">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel1">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
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
  getUserByDep, //获取人员
} from '@/api/systemSetting'
import { getUploadPath2 } from '@/api/common'
import {
  resignApplyDetail,
  resignApplyAddAndUpdate,
  resignApplyApproval,
  signExceptionByCondition,
  overworkApplyHours,
  accessHumanCardInfo,
} from '@/api/attendanceManagement'
import Approval from './Approval'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'over-time-apply-add',
  components: { Approval },
  data() {
    return {
      form: this.$form.createForm(this),
      uploadPath: getUploadPath2(), // 上传图片的url
      fileList: [], //凭证
      previewVisible: false,
      isEvidence: 0,
      previewImage: '',
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
      record: {},
      isResignType: {},
      dataType: {},
      spinning: false,
      exceptionList: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      exceptionItem: {},
    }
  },
  computed: {
    modalTitle() {
      let obj = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${obj[this.actionType]}补卡申请`
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
  },
  methods: {
    moment,
    isEvidences(e) {
      this.isEvidence = e.target.value
    },

    init() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    async query(type, record) {
      //debugger
      let that = this

      ;(that.actionType = type), (that.record = Object.assign({}, record))
      that.detail = {}
      that.exceptionList = []
      that.form.resetFields()
      await that.init()
      await that.fetchSignExceptionByCondition(that.record.createdId || that.userInfo.id)
      that.visible = true
      if (that.isAdd) {
        that.detail = {}
        return
      }
      resignApplyDetail({ id: record.id }).then((res) => {
        //debugger
        let data = res.data
        this.dataType = res.data

        //异常事件修改的时候，已经使用掉，列表中已经没有该条异常事件 这里加上
        if (that.isEdit) {
          let target = that.exceptionList.find((item) => +item.id === +data.exceptionId)
          if (!target) {
            let _exceptionList = [...that.exceptionList]
            _exceptionList.push({
              id: data.exceptionId,
              exceptionName: data.exceptionName,
              happenDate: data.happenDate,
              exceptionType: data.exceptionType,
            })
            _exceptionList.sort((a, b) => a.happenDate > b.happenDate)
            that.exceptionList = _exceptionList
          }
        }

        that.exceptionItem = {
          happenDate: data.happenDate,
        }

        that.$nextTick(() => (that.detail = { ...data }))
        //data.exceptionId && that.exceptionChange(data.exceptionId)
        console.log(res)
      })
    },
    getExceptionTypeTxt(type) {
      return { 1: '上班未打卡', 2: '下班未打卡', 3: '迟到', 4: '早退', 5: '加班', 6: '人脸识别异常' }[type] || '未知'
    },
    fetchSignExceptionByCondition(userId) {
      return signExceptionByCondition({ exceptionType: 1, userId: userId }).then((res) => {
        this.exceptionList = res.data
      })
    },
    exceptionChange(val) {
      this.exceptionItem = { ...(this.exceptionList.find((item) => +item.id === +val) || {}) }
      accessHumanCardInfo({
        status: this.exceptionItem.exceptionType,
        date: this.exceptionItem.happenDate,
        userId: this.userInfo.id,
      }).then((res) => {
        console.log(res)
        this.isResignType = res.data
        this.form.setFieldsValue({
          resignTime: res.data.createdTime !== null ? moment(res.data.createdTime) : '',
        })
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
          console.log('Received values of form: ', values)
          let target = that.exceptionList.find((item) => +item.id === +values.exceptionId)
          if (target) {
            //把异常类型也传过去
            values.exceptionType = target.exceptionType
          }
          that.spinning = true
          values.isResignTime = this.isResignType.flag
          values.resignTime = this.exceptionItem.happenDate + ' ' + values.resignTime.format('hh:mm')
          resignApplyAddAndUpdate(values)
            .then((res) => {
              that.$message.info(res.msg)
              that.spinning = false
              that.handleCancel()
              that.$emit('finish')
            })
            .catch((err) => {
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.fileList = []
      this.detail = {}
      this.isEvidence = 0
      this.exceptionItem = {}
      this.$nextTick(() => (this.visible = false))
    },
    handleCancel1() {
      this.previewVisible = false
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      resignApplyApproval(values)
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
      if (this.record.thingType === 2) {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
            let target = this.exceptionList.find((item) => +item.id === +values.exceptionId)
            if (target) {
              //把异常类型也传过去
              values.exceptionType = target.exceptionType
            }
            values.isResignTime = this.isResignType.flag
            values.resignTime = this.detail.resignTime
            values.evidenceUrl = this.fileList[0].response.data
            let arr = {
              isAdopt: 0,
              opinion: '通过',
            }
            values = { ...this.dataType, ...values }
            this.submitAction(Object.assign({}, { commonApprovalVO: arr, resignApply: values }, opt || {}))
          }
        })
      } else {
        this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
      }
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      // 审批意见
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
</style>

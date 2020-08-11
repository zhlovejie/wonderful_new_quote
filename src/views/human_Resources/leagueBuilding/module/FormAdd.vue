<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button
          class="a-button"
          type="primary"
          icon="close"
          @click="noPassAction(recordDetails)"
        >不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>团建类别</td>
            <td>
              <a-form-item>
                <a-select
                  @change="department"
                  style="width: 350px;"
                  :allowClear="true"
                  placeholder="请选择团建类别"
                  v-decorator="['leagueType',{ rules: [{ required: true, message: '请选择团建类别' }] },]"
                >
                  <a-select-option :value="1">部门团建</a-select-option>
                  <a-select-option :value="2">公司团建</a-select-option>
                  <a-select-option :value="3">管理层团建</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>部门</td>
            <td>
              <a-form-item>
                <a-tree-select
                  v-decorator="['departmentIds']"
                  style="width: 100%"
                  :tree-data="treeData"
                  tree-checkable
                  search-placeholder="选择部门"
                  :disabled="isDisabled"
                  :dropdownStyle="{ maxHeight: '300px'}"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>开始时间</td>
            <td style="width: 400px;">
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
              <a-form-item v-else>{{detail.beginTime}}</a-form-item>
            </td>
            <td>结束时间</td>
            <td style="width: 350px;">
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
              <a-form-item v-else>{{detail.endTime}}</a-form-item>
            </td>
          </tr>
          <tr>
            <td>时长</td>
            <td>
              <a-form-item>
                <template
                  v-if="duration.hour !== undefined"
                >{{duration.hour + '小时'+duration.minute+'分钟'}}</template>
              </a-form-item>
            </td>
            <td>团建地点</td>
            <td colspan="1">
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder="团建地址"
                  :rows="3"
                  v-decorator="['address', { rules: [{ required: true, message: '请输入团建地址' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>团建费用(元)</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder="请输入费用"
                  :rows="3"
                  v-decorator="['expense', { rules: [{ required: true, message: '请输入费用' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>方案</td>
            <td colspan="3">
              <a-form-item>
                <a-upload
                  v-decorator="['planUrl',{ rules: [{ required: true, message: '请上传方案' }] },{valuePropName: 'fileList',getValueFromEvent: normFile,},]"
                  name="file"
                  :action="uploadUrl"
                >
                  <a-button>
                    <a-icon type="upload" />上传方案
                  </a-button>
                </a-upload>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  :disabled="isDisabled"
                  placeholder="备注"
                  :rows="3"
                  v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <!-- <Approval ref="approval" @opinionChange="opinionChange" /> -->
    </a-spin>
  </a-modal>
</template>
<script>
import { getDevisionList } from '@/api/systemSetting' //所有部门
import { getUploadPath2 } from '@/api/common'
import { leagueBuilding_Detail } from '@/api/humanResources'
import moment from 'moment'

// import Approval from './Approval'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT

export default {
  name: 'BecomingForm',
  components: {
    // Approval: Approval,
  },
  data() {
    return {
      // 部门列表
      departmentList: [],
      value: [],
      treeData: [],
      sDate: {},
      detail: {},
      duration: {},
      uploadUrl: getUploadPath2(),
      depSelectDataSource: [],
      SHOW_PARENT,
      visible: false,
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      recordDetails: {},
      record: {},
      isModified: false, //财务人员为 true
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改公告信息'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : '新增'
      return `${txt}公告信息`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isApproval() {
      //通过不通过
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    // disabled() {
    //   return this.isView || this.isApproval || this.isEditSalary
    // },
    isDisabled() {
      return this.isView || this.isEdit
    },
  },
  watch: {
    sDate(newDate, oldDate) {
      let that = this
      let { beginDate, beginTime, endDate, endTime } = this.sDate
      if (beginDate && beginTime && endDate && endTime) {
        let _beginDateStr = `${beginDate} ${beginTime}`
        let _endDateStr = `${endDate} ${endTime}`
        let _beginDate = moment(_beginDateStr)
        let _endDate = moment(_endDateStr)
        let diff = _endDate.diff(_beginDate, 'minutes')
        if (diff <= 0) {
          that.$message.info('结束时间必须大于开始时间')
          return
        }
        that.fetchOverworkApplyHours({
          beginTime: _beginDateStr,
          endTime: _endDateStr,
        })
      }
    },
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_leagueBuilding') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {},
    elementChange(key, val) {
      console.log(val)
      this[key] = val
    },
    scoreChange(type, event) {
      this[type] = parseInt(event, 10)
    },
    // moment:moment,
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      if (record !== null) {
        this.fillData()
      }
    },
    // 详情
    fillData() {
      let that = this
      let id = {
        id: this.record.id,
      }
      NoticeDetails(id).then((res) => {
        that.recordDetails = res.data
        that.form.setFieldsValue({
          title: res.data.title,
          releaseRange: res.data.releaseRangeList,
          content: res.data.content,
          deptId: res.data.deptList,

          // 'applyUserName':res.data.trueName
        })
      })
    },
    //上传
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },

    // 部门数据
    department(e) {
      if (e === 1) {
        let that = this
        let queue = []
        let task1 = getDevisionList().then((res) => {
          that.treeData = res.data.map((item) => {
            return {
              id: item.id,
              key: item.id,
              value: item.id,
              title: item.departmentName,
              isLeaf: false,
            }
          })
        })
        queue.push(task1)
        // getDevisionList().then((res) => {
        //   this.departmentList = res.data
        // })
      } else {
        this.treeData = []
      }
    },

    fetchOverworkApplyHours({ beginTime, endTime }) {
      let that = this
      let timeData = moment(endTime).diff(moment(beginTime), 'minutes')
      that.duration.hour = parseInt(timeData / 60)
      that.duration.minute = parseInt(timeData % 60)
      console.log(that.duration.hour, that.duration.minute)
    },
    dateBeginPickerChange(date, dateStr) {
      let sDate = { ...this.sDate }
      sDate.beginDate = date ? dateStr : undefined
      this.sDate = sDate
    },
    dateBeginTimeChange(time, timeStr) {
      let sDate = { ...this.sDate }
      sDate.beginTime = time ? timeStr : undefined
      this.sDate = sDate
    },
    dateEndPickerChange(date, dateStr) {
      let sDate = { ...this.sDate }
      sDate.endDate = date ? dateStr : undefined
      this.sDate = sDate
    },
    dateEndTimeChange(time, timeStr) {
      let sDate = { ...this.sDate }
      sDate.endTime = time ? timeStr : undefined
      this.sDate = sDate
    },

    handleOk() {
      console.log('你是要提交')
      let that = this
      // if (that.isView) {
      //   that.form.resetFields() // 清空表
      //   that.visible = false
      //   return
      // } else if (that.type === 'add' || that.type === 'edit-salary') {
      that.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          delete values.s_begin_date
          delete values.s_begin_time
          delete values.s_end_date
          delete values.s_end_time
          values.beginTime = `${that.sDate.beginDate} ${that.sDate.beginTime}`
          values.endTime = `${that.sDate.endDate} ${that.sDate.endTime}`
          if (values.beginTime >= values.endTime) {
            that.$message.info('结束时间必须大于开始时间')
            return
          }
          if (values.departmentIds) {
            values.departmentIds = values.departmentIds.toString()
          }
          values.planUrl = values.planUrl.fileList[0].response.data
          if (that.type === 'edit-salary') {
            values.id = that.recordDetails.id
          }
          leagueBuilding_Detail(values)
            .then((res) => {
              that.spinning = false
              values.planUrl = {}
              that.duration = {}
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch((err) => (that.spinning = false))
        }
      })
      // } else if (that.isEditSalary) {
      //   // that.updateUserBackCardSalary()
      // } else {
      //   that.form.resetFields() // 清空表
      //   that.visible = false
      // }
    },
    handleCancel() {
      this.form.resetFields() // 清空表
      this.visible = false
    },
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.recordDetails.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      console.log(values)
      that.spinning = true
      NoticeApproval(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        // opinion: '通过',
      })
    },
    noPassAction() {
      let that = this
      //that.opinion = ''
      that.$refs.approval.query()
      console.log(that.$refs.approval.query())
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
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>
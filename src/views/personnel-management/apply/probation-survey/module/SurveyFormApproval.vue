<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" :loading="spinning" @click="noPassAction"
          >不通过</a-button
        >
        <a-button class="a-button" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <!-- <a-row :gutter="16" v-if="isApproval">
      <a-col :span="24" style="text-align: right;">
        <a-button class="a-button" style="margin-right: 8px;" type="primary" icon="check" @click="passAction">通过</a-button>
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction">不通过</a-button>
      </a-col>
    </a-row> -->
      <a-form :form="form" class="survey-form-wrapper">
        <!-- <h3>员工试用期考查表</h3> -->
        <table class="custom-table custom-table-border">
          <tr>
            <td>编号</td>
            <td>
              <a-form-item>
                <a-input disabled v-decorator="['probationCode']" />
              </a-form-item>
            </td>
            <td>姓名</td>
            <td>
              <a-form-item>
                <a-input disabled v-decorator="['userName', { rules: [{ required: false, message: '请输入姓名' }] }]" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>车间主任／部门主管</td>
            <td>
              <a-form-item>
                <a-input disabled v-decorator="['leaderName']" />
              </a-form-item>
            </td>
            <td>入职日期</td>
            <td>
              <a-form-item>
                <a-date-picker
                  disabled
                  style="width: 100%"
                  v-decorator="[
                    'entryDate',
                    { initialValue: moment(), rules: [{ required: false, message: '输入入职日期' }] },
                  ]"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>本月出勤情况(天)</td>
            <td>
              <a-form-item>
                <a-input
                  disabled
                  v-decorator="['workDays', { rules: [{ required: false, message: '请输入本月出勤情况' }] }]"
                />
              </a-form-item>
            </td>
            <td colspan="2"></td>
          </tr>

          <tr>
            <td>试用期工作内容</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  placeholder="试用期工作内容"
                  :rows="5"
                  disabled
                  v-decorator="['jobContent', { rules: [{ required: true, message: '请输入试用期工作内容' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>试用期考核</td>
            <td colspan="3" style="padding: 0">
              <table class="custom-table" style="margin: -1px">
                <tr>
                  <th colspan="2">项目及观察要点</th>
                  <th>自评分数</th>
                  <th>车间主任／部门主管评分</th>
                </tr>
                <tr>
                  <td>知识与技能</td>
                  <td>完成岗位所必需的基本知识、专门知识和技能熟练的程序。</td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        disabled
                        @change="scoreChange('s1', $event)"
                        v-decorator="['userSkill', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="30">很好&nbsp;30分</a-select-option>
                        <a-select-option :value="25">好&nbsp;25分</a-select-option>
                        <a-select-option :value="20">较好&nbsp;20分</a-select-option>
                        <a-select-option :value="15">一般&nbsp;15分</a-select-option>
                        <a-select-option :value="10">差&nbsp;10分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        :disabled="isView || isDistribution"
                        @change="scoreChange('d1', $event)"
                        v-decorator="['leaderSkill', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="30">很好&nbsp;30分</a-select-option>
                        <a-select-option :value="25">好&nbsp;25分</a-select-option>
                        <a-select-option :value="20">较好&nbsp;20分</a-select-option>
                        <a-select-option :value="15">一般&nbsp;15分</a-select-option>
                        <a-select-option :value="10">差&nbsp;10分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td>与人协调能力</td>
                  <td>同事间的协调、协调客户关系及其他关系的能力。</td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        disabled
                        @change="scoreChange('s2', $event)"
                        v-decorator="['userCoordinate', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="15">很好&nbsp;15分</a-select-option>
                        <a-select-option :value="8">好&nbsp;8分</a-select-option>
                        <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                        <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                        <a-select-option :value="2">差&nbsp;2分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        :disabled="isView || isDistribution"
                        @change="scoreChange('d2', $event)"
                        v-decorator="['leaderCoordinate', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="15">很好&nbsp;15分</a-select-option>
                        <a-select-option :value="8">好&nbsp;8分</a-select-option>
                        <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                        <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                        <a-select-option :value="2">差&nbsp;2分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td>工作改进绩效</td>
                  <td>位达成工作目标或解决问题做思考及改进绩效程度。</td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        disabled
                        @change="scoreChange('s3', $event)"
                        v-decorator="['userImprove', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="10">很好&nbsp;10分</a-select-option>
                        <a-select-option :value="8">好&nbsp;8分</a-select-option>
                        <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                        <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                        <a-select-option :value="2">差&nbsp;2分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        :disabled="isView || isDistribution"
                        @change="scoreChange('d3', $event)"
                        v-decorator="['leaderImprove', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="10">很好&nbsp;10分</a-select-option>
                        <a-select-option :value="8">好&nbsp;8分</a-select-option>
                        <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                        <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                        <a-select-option :value="2">差&nbsp;2分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td>执行力</td>
                  <td>完成工作责任及贯彻指示命令的努力程度。</td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        disabled
                        @change="scoreChange('s4', $event)"
                        v-decorator="['userExecution', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="10">很好&nbsp;10分</a-select-option>
                        <a-select-option :value="8">好&nbsp;8分</a-select-option>
                        <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                        <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                        <a-select-option :value="2">差&nbsp;2分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        :disabled="isView || isDistribution"
                        @change="scoreChange('d4', $event)"
                        v-decorator="['leaderExecution', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="10">很好&nbsp;10分</a-select-option>
                        <a-select-option :value="8">好&nbsp;8分</a-select-option>
                        <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                        <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                        <a-select-option :value="2">差&nbsp;2分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td>工作效率</td>
                  <td>在一定时间内完成预定工作的量和速度。</td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        disabled
                        @change="scoreChange('s5', $event)"
                        v-decorator="['userEfficiency', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="15">很好&nbsp;15分</a-select-option>
                        <a-select-option :value="8">好&nbsp;8分</a-select-option>
                        <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                        <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                        <a-select-option :value="2">差&nbsp;2分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        :disabled="isView || isDistribution"
                        @change="scoreChange('d5', $event)"
                        v-decorator="['leaderEfficiency', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="15">很好&nbsp;15分</a-select-option>
                        <a-select-option :value="8">好&nbsp;8分</a-select-option>
                        <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                        <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                        <a-select-option :value="2">差&nbsp;2分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td>工作精确程度</td>
                  <td>工作有无错误，是否细心？就工作成果正确性的程序和效果加以考核。</td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        disabled
                        @change="scoreChange('s6', $event)"
                        v-decorator="['userAccuracy', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="20">很好&nbsp;20分</a-select-option>
                        <a-select-option :value="8">好&nbsp;8分</a-select-option>
                        <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                        <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                        <a-select-option :value="2">差&nbsp;2分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                  <td>
                    <a-form-item>
                      <a-select
                        style="width: 150px"
                        :disabled="isView || isDistribution"
                        @change="scoreChange('d6', $event)"
                        v-decorator="['leaderAccuracy', { rules: [{ required: true, message: '选择自评分数' }] }]"
                        placeholder="选择自评分数"
                      >
                        <a-select-option :value="20">很好&nbsp;20分</a-select-option>
                        <a-select-option :value="8">好&nbsp;8分</a-select-option>
                        <a-select-option :value="6">较好&nbsp;6分</a-select-option>
                        <a-select-option :value="4">一般&nbsp;4分</a-select-option>
                        <a-select-option :value="2">差&nbsp;2分</a-select-option>
                      </a-select>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">得分合计</td>
                  <td>{{ userTotalScore }}</td>
                  <td>{{ leaderTotalScore }}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>试用期状态</td>
            <td colspan="3">
              <a-form-item>
                <a-radio-group
                  @change="onChange"
                  :disabled="isView || isDistribution"
                  v-decorator="['probationState', { rules: [{ required: true, message: '请选择试用期状态' }] }]"
                >
                  <a-radio :value="1"> 通过</a-radio>
                  <a-radio :value="2"> 不通过 </a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>

          <tr v-if="textl == 2">
            <td>不通过原因</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  placeholder="不通过原因"
                  :rows="3"
                  :disabled="isView"
                  v-decorator="['noPassReason', { rules: [{ required: true, message: '请输入不通过原因' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>试用期总工资</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  :disabled="isView || isDistribution"
                  placeholder="试用期总工资"
                  style="width: 80%"
                  v-decorator="['probationSalary', { rules: [{ required: true, message: '请输入试用期总工资' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr v-if="!isApproval">
            <td>试用期基本工资</td>
            <td>
              <a-form-item>
                <a-select
                  placeholder="试用期基本工资"
                  style="width: 80%"
                  :disabled="isView"
                  v-decorator="['probationBasicSalary', { rules: [{ required: true, message: '选择试用期基本工资' }] }]"
                >
                  <a-select-option :value="2500">2500</a-select-option>
                  <a-select-option :value="2600">2600</a-select-option>
                  <a-select-option :value="2700">2700</a-select-option>
                  <a-select-option :value="2800">2800</a-select-option>
                  <a-select-option :value="3000">3000</a-select-option>
                  <a-select-option :value="3300">3300</a-select-option>
                  <a-select-option :value="3500">3500</a-select-option>
                  <a-select-option :value="4000">4000</a-select-option>
                  <a-select-option :value="4500">4500</a-select-option>
                  <a-select-option :value="5000">5000</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>试用期岗位工资</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isView"
                  placeholder="试用期岗位工资"
                  style="width: 80%"
                  v-decorator="[
                    'probationPostSalary',
                    { rules: [{ required: true, message: '请输入试用期岗位工资' }] },
                  ]"
                />
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
import moment from 'moment'
import {
  approvalLookProbationSurvey, //详情
  approvalProbationSurvey, //提交
  updateProbationById,
  updateHandleProbationSurvey,
} from '@/api/personnelManagement'
import Approval from './Approval'
export default {
  name: 'SurveyFormApproval',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      visible: false,
      textl: undefined,
      leaderName: '',
      userInfo: this.$store.getters.userInfo, // 当前登录人
      form: this.$form.createForm(this, { name: 'SurveyFormApproval' }),
      type: 'view',
      birthplaceOptions: [], //籍贯 级联 省市
      education: [],
      departmentDataSource: [], //岗位
      stationDataSource: [], //部门
      record: {},
      survey: {},
      s1: 0,
      s2: 0,
      s3: 0,
      s4: 0,
      s5: 0,
      s6: 0,
      d1: 0,
      d2: 0,
      d3: 0,
      d4: 0,
      d5: 0,
      d6: 0,
      opinion: '', //审批意见
      approvalModelOpen: false,
      wage: 0,
      spinning: false,
    }
  },
  computed: {
    modalTitle() {
      if (this.isDistribution) {
        return '试用期分配工资'
      }
      let txt = this.isView ? '查看' : '审批'
      return `${txt}试用期调查表`
    },
    isView() {
      return this.type === 'view'
    },
    isApproval() {
      return this.type === 'approval'
    },
    isDistribution() {
      return this.type === 'Distribution'
    },
    userTotalScore() {
      let c = 0
      c += parseInt(this.s1, 10)
      c += parseInt(this.s2, 10)
      c += parseInt(this.s3, 10)
      c += parseInt(this.s4, 10)
      c += parseInt(this.s5, 10)
      c += parseInt(this.s6, 10)
      return isNaN(c) ? 0 : c
    },
    leaderTotalScore() {
      let c = 0
      c += parseInt(this.d1, 10)
      c += parseInt(this.d2, 10)
      c += parseInt(this.d3, 10)
      c += parseInt(this.d4, 10)
      c += parseInt(this.d5, 10)
      c += parseInt(this.d6, 10)
      return isNaN(c) ? 0 : c
    },
    isPersonLeader() {
      //当前登录人是否为  该员工的上级领导
      return this.leaderName === this.userInfo.trueName
    },
  },
  methods: {
    onChange(checked) {
      console.log(checked)
      this.textl = checked.target.value
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
    scoreChange(type, event) {
      this[type] = parseInt(event, 10)
    },
    moment: moment,
    query(type, record) {
      this.visible = true
      this.opinion = ''
      this.type = type
      this.record = record
      this.fillData()
    },
    fillData() {
      approvalLookProbationSurvey({ id: this.record.id }).then((res) => {
        this.form.resetFields()
        let obj = Object.assign({}, res.data)
        this.survey = res.data
        obj.entryDate = this.moment(obj.entryDate)
        this.leaderName = res.data.leaderName
        let fillObj = {}
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (obj[key]) {
              fillObj[key] = obj[key]
            }
          }
        }
        this.textl = res.data.probationState
        this.$nextTick(() => {
          setTimeout(() => {
            this.form.setFieldsValue(fillObj)
            console.log(fillObj)
          }, 100)
        })
        this.wage = obj.wage
        this.s1 = obj.userSkill
        this.s2 = obj.userCoordinate
        this.s3 = obj.userImprove
        this.s4 = obj.userExecution
        this.s5 = obj.userEfficiency
        this.s6 = obj.userAccuracy

        this.d1 = obj.leaderSkill
        this.d2 = obj.leaderCoordinate
        this.d3 = obj.leaderImprove
        this.d4 = obj.leaderExecution
        this.d5 = obj.leaderEfficiency
        this.d6 = obj.leaderAccuracy
      })
    },
    submitAction(opt) {
      let that = this
      that.form.validateFields(async (err, values) => {
        if (!err) {
          let param = {
            id: that.record.id,
            isAdopt: opt.isAdopt,
            opinion: opt.opinion,
            probationSurveyApprovalLookVo: Object.assign({}, values),
          }
          // values.id = that.record.id
          // delete values.entryDate
          // values.isAdopt = opt.isAdopt
          // values.opinion = opt.opinion
          that.spinning = true

          let approvalResult = await approvalProbationSurvey(param)
            .then((res) => +res.code)
            .catch((err) => {
              console.log(err)
              return 500
            })
          let updateResult = await updateProbationById({ id: param.id, probationState: values.probationState })
            .then((res) => +res.code)
            .catch((err) => {
              console.log(err)
              return 500
            })
          that.spinning = false
          if (approvalResult === 200 && updateResult === 200) {
            that.form.resetFields() // 清空表
            that.visible = false
            that.$message.info('操作成功')
            that.$emit('finish')
          } else {
            that.$message.info('操作失败，请稍后再试。')
          }
        }
      })
    },
    passAction() {
      const that = this
      that.validateForm().then((hasError) => {
        if (!hasError) {
          that.submitAction({
            isAdopt: 0,
            opinion: '通过',
          })
        }
      })
    },
    noPassAction() {
      const that = this
      //that.opinion = ''
      that.validateForm().then((hasError) => {
        if (!hasError) {
          that.$refs.approval.query()
        }
      })
    },
    handleOk(isAdopt) {
      if (this.isDistribution) {
        let that = this
        that.form.validateFields((err, values) => {
          if (!err) {
            if (
              Number(values.probationSalary) !==
              Number(values.probationBasicSalary) + Number(values.probationPostSalary)
            ) {
              return this.$message.error('试用期总工资 = 试用期基本工资 + 试用期岗位工资')
            }
            let react = {
              id: that.record.id,
              probationSalary: values.probationSalary,
              probationBasicSalary: values.probationBasicSalary,
              probationPostSalary: values.probationPostSalary,
              userId: this.survey.userId,
            }

            updateHandleProbationSurvey(react).then((res) => {
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
          }
        })
      } else {
        this.handleCancel()
      }
      // let that = this
      // that.form.validateFields((err, values) => {
      //   if (!err) {

      //     values.id = that.record.id
      //     delete values.entryDate
      //     //values.entryDate = values.entryDate.format('YYYY-MM-DD')
      //     console.log('Received values of form: ', values)

      //     console.log('isAdopt:',isAdopt)
      //     if(isAdopt === 1 ){
      //       that.opinion = ''
      //       that.$refs.approval.query()
      //       that.approvalModelOpen = true
      //     }else if(isAdopt === 0){
      //       that.opinion = '通过'
      //     }

      //     if(that.approvalModelOpen){
      //       return
      //     }

      //     values.isAdopt = isAdopt
      //     values.opinion = that.opinion
      //     approvalProbationSurvey(values).then(res =>{
      //       console.log(res)
      //       that.form.resetFields() // 清空表
      //       that.visible = false
      //       that.$message.info(res.msg)
      //       that.$emit('finish')
      //     })
      //   }
      // })
    },
    handleCancel() {
      console.log('handleCancel called...')
      this.form.resetFields() // 清空表
      this.visible = false
    },

    action(values) {},
    validateForm() {
      const that = this
      return new Promise((resolve) => {
        that.form.validateFields((err) => {
          resolve(!!err)
        })
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
.survey-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
</style>

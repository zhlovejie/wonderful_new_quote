<template>
  <a-modal
    :title="modalTitle"
    :width="1045"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <!-- @click="passAction(2, '不通过')" -->
    <template slot="footer">
      <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction1">不通过</a-button>
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction">驳回</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction(0, '通过')">通过</a-button>
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
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>编号</td>
            <td colspan="5">{{ fullMemberCode }}</td>
          </tr>
          <tr>
            <td>申请人</td>
            <td>{{ proposerName }}</td>
            <td>性别</td>
            <td>{{ sex }}</td>
            <td>出生日期</td>
            <td>{{ birthDate }}</td>
          </tr>
          <tr>
            <td>籍贯</td>
            <td>{{ nativePlace }}</td>
            <td>学历</td>
            <td>{{ education }}</td>
            <td>试用期</td>
            <td>{{ probationType }}</td>
          </tr>
          <tr>
            <td>部门</td>
            <td>{{ departmentName }}</td>
            <td>岗位</td>
            <td>{{ stationName }}</td>
            <td>入职日期</td>
            <td>{{ entryDate }}</td>
          </tr>
          <tr>
            <td>部门经理评价</td>
            <td colspan="5" style="padding: 0">
              <table class="custom-table custom-table-border" style="margin: -1px">
                <tr>
                  <td colspan="4">考评项目</td>
                  <td>最高分值</td>
                  <td>实际评分</td>
                </tr>
                <tr>
                  <td colspan="4">1.工作能力(专业知识、工作效率、执行力、发展潜力)</td>
                  <td>20</td>
                  <td>
                    <a-form-item>
                      <a-input-number
                        style="width: 100px"
                        :disabled="disabled"
                        :min="0"
                        :max="20"
                        :step="1"
                        v-decorator="['workAbility']"
                        @change="elementChange('workAbility', $event)"
                      />
                      <!-- <a-input :disabled="disabled" @change="elementChange('workAbility',$event)" v-decorator="['workAbility', { rules: [{ required: false, message: '实际评分' }] }]"/> -->
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">2.工作态度(工作主动性、工作积极性、责任感)</td>
                  <td>10</td>
                  <td>
                    <a-form-item>
                      <a-input-number
                        style="width: 100px"
                        :disabled="disabled"
                        :min="0"
                        :max="10"
                        :step="1"
                        v-decorator="['workingAttitude']"
                        @change="elementChange('workingAttitude', $event)"
                      />
                      <!-- <a-input :disabled="disabled" @change="elementChange('workingAttitude',$event)" v-decorator="['workingAttitude', { rules: [{ required: false, message: '实际评分' }] }]"/> -->
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">3.稳定性</td>
                  <td>20</td>
                  <td>
                    <a-form-item>
                      <a-input-number
                        style="width: 100px"
                        :disabled="disabled"
                        :min="0"
                        :max="20"
                        :step="1"
                        v-decorator="['stability']"
                        @change="elementChange('stability', $event)"
                      />
                      <!-- <a-input :disabled="disabled" @change="elementChange('stability',$event)" v-decorator="['stability', { rules: [{ required: false, message: '实际评分' }] }]"/> -->
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">4.精神面貌及心理素质</td>
                  <td>10</td>
                  <td>
                    <a-form-item>
                      <a-input-number
                        style="width: 100px"
                        :disabled="disabled"
                        :min="0"
                        :max="10"
                        :step="1"
                        v-decorator="['psychological']"
                        @change="elementChange('psychological', $event)"
                      />
                      <!-- <a-input :disabled="disabled" @change="elementChange('psychological',$event)" v-decorator="['psychological', { rules: [{ required: false, message: '实际评分' }] }]"/> -->
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">5.个人修养(规章制度的遵守情况)</td>
                  <td>10</td>
                  <td>
                    <a-form-item>
                      <a-input-number
                        style="width: 100px"
                        :disabled="disabled"
                        :min="0"
                        :max="10"
                        :step="1"
                        v-decorator="['culture']"
                        @change="elementChange('culture', $event)"
                      />
                      <!-- <a-input :disabled="disabled" @change="elementChange('culture',$event)" v-decorator="['culture', { rules: [{ required: false, message: '实际评分' }] }]"/> -->
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">6.团队精神</td>
                  <td>10</td>
                  <td>
                    <a-form-item>
                      <a-input-number
                        style="width: 100px"
                        :disabled="disabled"
                        :min="0"
                        :max="10"
                        :step="1"
                        v-decorator="['teamSpirit']"
                        @change="elementChange('teamSpirit', $event)"
                      />
                      <!-- <a-input :disabled="disabled" @change="elementChange('teamSpirit',$event)" v-decorator="['teamSpirit', { rules: [{ required: false, message: '实际评分' }] }]"/> -->
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">7.沟通协调能力</td>
                  <td>10</td>
                  <td>
                    <a-form-item>
                      <a-input-number
                        style="width: 100px"
                        :disabled="disabled"
                        :min="0"
                        :max="10"
                        :step="1"
                        v-decorator="['communicationCoordination']"
                        @change="elementChange('communicationCoordination', $event)"
                      />
                      <!-- <a-input :disabled="disabled" @change="elementChange('communicationCoordination',$event)" v-decorator="['communicationCoordination', { rules: [{ required: false, message: '实际评分' }] }]"/> -->
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">8.身体健康状况</td>
                  <td>10</td>
                  <td>
                    <a-form-item>
                      <a-input-number
                        style="width: 100px"
                        :disabled="disabled"
                        :min="0"
                        :max="10"
                        :step="1"
                        v-decorator="['physicalCondition']"
                        @change="elementChange('physicalCondition', $event)"
                      />
                      <!-- <a-input :disabled="disabled" @change="elementChange('physicalCondition',$event)" v-decorator="['physicalCondition', { rules: [{ required: false, message: '实际评分' }] }]"/> -->
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td colspan="5">
                    <span style="padding: 0 5px">优秀(80分以上)</span>
                    <span style="padding: 0 5px">良(60-80分)</span>
                    <span style="padding: 0 5px">差(60分以下)</span>
                  </td>
                  <td>{{ totalScore }}</td>
                </tr>
                <tr>
                  <td>转正意见(建议转正日期)</td>
                  <td colspan="2">
                    <a-form-item>
                      <a-date-picker
                        :disabled="disabled"
                        style="width: 100%"
                        v-decorator="[
                          'fullMemberDay',
                          { initialValue: moment(), rules: [{ required: false, message: '输入入职日期' }] },
                        ]"
                        format="YYYY-MM-DD"
                      />
                    </a-form-item>
                  </td>
                  <td>转正后薪资</td>
                  <td colspan="2">
                    <a-form-item>
                      <a-select
                        placeholder="选择转正基本工资"
                        style="width: 100%"
                        :disabled="disabled"
                        v-decorator="[
                          'fullMemberBasicSalary',
                          { rules: [{ required: true, message: '请选择转正基本工资' }] },
                        ]"
                      >
                        <a-select-option :value="2500">2500</a-select-option>
                        <a-select-option :value="2600">2600</a-select-option>
                        <a-select-option :value="2700">2700</a-select-option>
                        <a-select-option :value="2800">2800</a-select-option>
                        <a-select-option :value="3000">3000</a-select-option>
                        <a-select-option :value="3300">3300</a-select-option>
                        <a-select-option :value="3500">3500</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item>
                      <a-input-number
                        style="width: 100%"
                        placeholder="转正岗位工资"
                        :disabled="disabled"
                        :min="0"
                        :max="100000000"
                        :step="1"
                        v-decorator="[
                          'fullMemberPostSalary',
                          { rules: [{ required: true, message: '输入转正岗位工资' }] },
                        ]"
                      />
                    </a-form-item>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>考评</td>
            <td colspan="5">
              <a-form-item>
                <a-textarea
                  placeholder="请输入考评"
                  :rows="5"
                  :disabled="disabled"
                  @change="elementChange('evaluation', $event)"
                  v-decorator="['evaluation', { rules: [{ required: true, message: '请输入考评' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <!-- <tr v-if="isEditSalary || isModified">
            <td>工资分配</td>
            <td colspan="5">
              <div class="bank-card-list-wrapper">
                <a-form-item label="卡1">
                  <a-input-number
                    style="width: 150px"
                    :disabled="isView"
                    :min="0"
                    :max="100000000"
                    :step="1"
                    v-decorator="['userBankCardList.0.salary']"
                  />
                  <a-input hidden v-decorator="['userBankCardList.0.id']" />
                </a-form-item>
                <a-form-item label="卡2">
                  <a-input-number
                    style="width: 150px"
                    :disabled="isView"
                    :min="0"
                    :max="100000000"
                    :step="1"
                    v-decorator="['userBankCardList.1.salary']"
                  />
                  <a-input hidden v-decorator="['userBankCardList.1.id']" />
                </a-form-item>
                <a-form-item label="卡3">
                  <a-input-number
                    style="width: 150px"
                    :disabled="isView"
                    :min="0"
                    :max="100000000"
                    :step="1"
                    v-decorator="['userBankCardList.2.salary']"
                  />
                  <a-input hidden v-decorator="['userBankCardList.2.id']" />
                </a-form-item>
              </div>
            </td>
          </tr> -->

          <!-- <tr>
            <td >分管总经理审批意见</td>
            <td >
              <a-form-item>
                <a-input  v-decorator="['c1', { rules: [{ required: false, message: '请输入审批意见' }] }]"/>
              </a-form-item>
            </td>
            <td >审批人</td>
            <td >
              <a-form-item>
                <a-input  v-decorator="['c2', { rules: [{ required: false, message: '请输入审批意见' }] }]"/>
              </a-form-item>
            </td>
            <td >日期</td>
            <td >
              <a-form-item>
                <a-date-picker 
                  disabled 
                  style="width:100%;" 
                  v-decorator="['entryDate',{initialValue:moment(),rules: [{required: false,message: '输入入职日期'}]}]" 
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td >股东会审核意见</td>
            <td >
              <a-form-item>
                <a-input  v-decorator="['c1', { rules: [{ required: false, message: '请输入审批意见' }] }]"/>
              </a-form-item>
            </td>
            <td >审批人</td>
            <td >
              <a-form-item>
                <a-input  v-decorator="['c2', { rules: [{ required: false, message: '请输入审批意见' }] }]"/>
              </a-form-item>
            </td>
            <td >日期</td>
            <td >
              <a-form-item>
                <a-date-picker 
                  disabled 
                  style="width:100%;" 
                  v-decorator="['entryDate',{initialValue:moment(),rules: [{required: false,message: '输入入职日期'}]}]" 
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td >人力资源部意见</td>
            <td >
              <a-form-item>
                <a-input  v-decorator="['c1', { rules: [{ required: false, message: '请输入审批意见' }] }]"/>
              </a-form-item>
            </td>
            <td >审批人</td>
            <td >
              <a-form-item>
                <a-input  v-decorator="['c2', { rules: [{ required: false, message: '请输入审批意见' }] }]"/>
              </a-form-item>
            </td>
            <td >日期</td>
            <td >
              <a-form-item>
                <a-date-picker 
                  disabled 
                  style="width:100%;" 
                  v-decorator="['entryDate',{initialValue:moment(),rules: [{required: false,message: '输入入职日期'}]}]" 
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </td>
          </tr> -->
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
      <Approvalt ref="approval1" @opinionChange1="opinionChange1" />
    </a-spin>
  </a-modal>
</template>
<script>
import moment from 'moment'

import {
  personnelFullMemberApply_HandleFullMemberApply, //转正详细
  personnelFullMemberApply_Save, //转正申请处理
  personnelFullMemberApply_ApprovalLook, //转正申请审批查看
  personnelFullMemberApply_Approval, //转正申请审批
  personnelFullMemberApply_updateUserBackCardSalary, //财务人员修改工资分配金额
} from '@/api/personnelManagement'
import Approval from './Approval'
import Approvalt from './Approva1'
export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
    Approvalt,
  },
  data() {
    return {
      visible: false,
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      nativePlaceOptions: [], //籍贯 级联 省市
      education: [],
      departmentDataSource: [], //岗位
      stationDataSource: [], //部门
      record: {},

      fullMemberCode: '',
      proposerName: '',
      sex: '',
      birthDate: '',
      nativePlace: '',
      education: '',
      probationType: '',
      departmentName: '',
      stationName: '',
      entryDate: '',

      workAbility: undefined,
      workingAttitude: undefined,
      stability: undefined,
      psychological: undefined,
      culture: undefined,
      teamSpirit: undefined,
      communicationCoordination: undefined,
      physicalCondition: undefined,

      fullMemberDay: undefined,
      fullMemberSalary: 0,
      evaluation: undefined,

      isModified: false, //财务人员为 true
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改工资分配'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '处理' : '审批'
      return `${txt}转正申请`
    },
    isView() {
      return this.type === 'view'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isApproval() {
      return this.type === 'approval'
    },
    isEditSalary() {
      return this.type === 'edit-salary'
    },
    disabled() {
      return this.isView || this.isApproval || this.isEditSalary
    },
    totalScore() {
      let c = 0
      c += parseInt(this.workAbility, 10) || 0
      c += parseInt(this.workingAttitude, 10) || 0
      c += parseInt(this.stability, 10) || 0
      c += parseInt(this.psychological, 10) || 0
      c += parseInt(this.culture, 10) || 0
      c += parseInt(this.teamSpirit, 10) || 0
      c += parseInt(this.communicationCoordination, 10) || 0
      c += parseInt(this.physicalCondition, 10) || 0
      return c || 0
    },
  },
  methods: {
    elementChange(key, val) {
      this[key] = val
    },
    scoreChange(type, event) {
      this[type] = parseInt(event, 10)
    },
    moment: moment,
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record

      this.fillData()
    },
    fillData() {
      let that = this
      let _api =
        that.record.state === 0
          ? personnelFullMemberApply_HandleFullMemberApply //待提交查看接口
          : personnelFullMemberApply_ApprovalLook //已提交查看接口

      that.spinning = true
      _api({ id: this.record.id })
        .then((res) => {
          that.spinning = false
          if (res.code !== 200) {
            that.$message.info(res.msg || '请求失败')
            return
          }
          let data = Object.assign({}, res.data)
          that.fullMemberCode = data.fullMemberCode
          that.proposerName = data.proposerName
          that.sex = data.sex === 0 ? '女' : '男'
          that.birthDate = data.birthDate
          //that.nativePlace = data.nativePlace
          that.nativePlace = data.birthplace ? data.birthplace.split(',').join(' ') : ''
          that.education = data.education
          that.probationType = formatProbationType(data.probationType)

          function formatProbationType(type) {
            let map = {
              0: '无',
              1: '1个月',
              2: '2个月',
              3: '3个月',
              4: '考查期',
            }
            return map[type]
          }
          that.departmentName = data.departmentName
          that.stationName = data.stationName
          that.entryDate = data.entryDate

          that.workAbility = data.workAbility
          that.workingAttitude = data.workingAttitude
          that.stability = data.stability
          that.psychological = data.psychological
          that.culture = data.culture
          that.teamSpirit = data.teamSpirit
          that.communicationCoordination = data.communicationCoordination
          that.physicalCondition = data.physicalCondition

          that.fullMemberSalary = data.fullMemberSalary
          that.evaluation = data.evaluation
          data.fullMemberDay = data.fullMemberDay ? that.moment(data.fullMemberDay) : that.moment()
          this.$nextTick(() => this.form.setFieldsValue(data))

          that.isModified = data.isModified || false
          if (Array.isArray(data.userBankCards)) {
            let _cardInfo = {}
            data.userBankCards.map((item, index) => {
              _cardInfo[`userBankCardList.${index}.id`] = item.id
              _cardInfo[`userBankCardList.${index}.salary`] = item.salary || 0
            })
            that.$nextTick(() =>
              that.form.setFieldsValue({
                ..._cardInfo,
                ...{
                  fullMemberBasicSalary: res.data.fullMemberBasicSalary,
                  fullMemberPostSalary: res.data.fullMemberPostSalary,
                },
              })
            )
          }
        })
        .catch((err) => (that.spinning = false))
    },
    handleOk() {
      let that = this
      if (that.isView) {
        that.form.resetFields() // 清空表
        that.visible = false
        return
      } else if (that.isEdit) {
        that.form.validateFields((err, values) => {
          if (!err) {
            values.id = that.record.id
            //delete values.entryDate
            values.fullMemberDay = this.moment(values.fullMemberDay)

            //提交状态 0 首次提交  1 驳回提交
            values.submitState = that.record.state === 0 ? 0 : 1
            that.spinning = true
            personnelFullMemberApply_Save(values)
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
      } else if (that.isEditSalary) {
        that.updateUserBackCardSalary()
      } else {
        that.form.resetFields() // 清空表
        that.visible = false
      }
    },
    handleCancel() {
      this.form.resetFields() // 清空表
      this.visible = false
    },
    submitAction(opt) {
      let that = this
      let values = {
        id: that.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      personnelFullMemberApply_Approval(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(type, isType) {
      this.submitAction({
        isAdopt: type,
        opinion: isType,
      })
    },
    noPassAction() {
      let that = this
      //that.opinion = ''
      that.$refs.approval.query()
    },
    noPassAction1() {
      let that = this
      //that.opinion = ''
      that.$refs.approval1.query()
    },
    opinionChange1(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 2,
        opinion: opinion,
      })
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
    updateUserBackCardSalary() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          let _userBankCardList = {
            userBankCardList: values.userBankCardList,
          }
          that.spinning = true
          personnelFullMemberApply_updateUserBackCardSalary(_userBankCardList)
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
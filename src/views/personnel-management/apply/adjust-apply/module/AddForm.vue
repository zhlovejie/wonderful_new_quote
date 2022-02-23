<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template v-if="isApproval && !isSelfApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">{{
          isSelfApproval ? '保存提交' : '确定'
        }}</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <!-- <a-row :gutter="16" v-if="isApproval && !isSelfApproval">
    <a-col :span="24" style="text-align: right;">
      <a-button class="a-button" style="margin-right: 8px;" type="primary" icon="check" @click="passAction">通过</a-button>
      <a-button class="a-button" type="primary" icon="close" @click="noPassAction">不通过</a-button>
    </a-col>
  </a-row> -->
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>员工名</td>
            <td>
              <a-form-item>
                <a-input hidden v-decorator="['id']" />
              </a-form-item>
              <a-form-item>
                <a-input hidden v-decorator="['applyUserId']" />
              </a-form-item>
              <a-form-item>
                <a-input hidden v-decorator="['instanceId']" />
              </a-form-item>
              <a-form-item>
                <a-input
                  placeholder="员工名"
                  :disabled="isDisabled"
                  read-only
                  @click="openSystemUsers('applyUserName')"
                  v-decorator="['applyUserName', { rules: [{ required: true, message: '员工名' }] }]"
                />
              </a-form-item>
            </td>
            <td>状态</td>
            <td>{{ operationStatusTxt }}</td>
          </tr>
          <template v-if="isPost">
            <tr>
              <td>原部门</td>
              <td>{{ oldDepartmentName }}</td>
              <td>原岗位</td>
              <td>{{ oldStationName }}</td>
            </tr>
            <tr>
              <td>调入部门</td>
              <td>
                <a-form-item>
                  <a-select
                    :disabled="isDisabled"
                    placeholder="选择部门"
                    @change="depChangeHandler"
                    v-decorator="['newDepartmentId', { rules: [{ required: true, message: '请选择部门' }] }]"
                  >
                    <a-select-option v-for="item in depSelectDataSource" :key="item.id" :value="item.id">
                      {{ item.departmentName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
              <td>调入岗位</td>
              <td>
                <a-form-item>
                  <a-select
                    :disabled="isDisabled"
                    placeholder="选择岗位"
                    style="width: 200px"
                    v-decorator="['newStationId', { rules: [{ required: true, message: '请选择岗位' }] }]"
                  >
                    <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">
                      {{ item.stationName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>拟入职日期</td>
              <!-- :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" -->
              <td>
                <a-form-item>
                  <a-date-picker
                    :disabled="isDisabled"
                    style="width: 100%"
                    v-decorator="[
                      'enterDate',
                      { initialValue: moment(), rules: [{ required: true, message: '输入拟入职日期' }] },
                    ]"
                    format="YYYY-MM-DD"
                  />
                </a-form-item>
              </td>
              <td>调入部门主管</td>
              <td>{{ newDepartmentManagerName }}</td>
            </tr>
            <tr>
              <td>调岗原因</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea
                    :disabled="isDisabled"
                    placeholder="调岗原因"
                    :rows="3"
                    v-decorator="['changeReason', { rules: [{ required: true, message: '调岗原因' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="4">自愿申请调岗并愿意接受所调新岗位的职责和薪资标准</td>
            </tr>
          </template>

          <template v-if="isSalary">
            <tr>
              <td>原部门</td>
              <td>{{ oldDepartmentName }}</td>
              <td>原岗位</td>
              <td>{{ oldStationName }}</td>
            </tr>
            <tr>
              <td>入职日期</td>
              <td>{{ salary_entryDate }}</td>
              <td>入职年限</td>
              <td>{{ salary_entryYears }}</td>
            </tr>
            <!-- <tr v-if="!isSelfApproval"> -->
            <tr>
              <td>原总薪资</td>
              <td>
                <a-form-item>
                  <a-input-number
                    placeholder="原总薪资"
                    style="width: 100%"
                    disabled
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['oldSalary', { rules: [{ required: true, message: '请输入原总薪资(元)' }] }]"
                  />
                </a-form-item>
              </td>
              <td>期望总薪资(元)</td>
              <td>
                <a-form-item>
                  <a-input-number
                    placeholder="期望总薪资"
                    style="width: 100%"
                    :disabled="isDisabled"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['expectSalary', { rules: [{ required: true, message: '请输入期望总薪资(元)' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>分配原总薪资</td>
              <td>
                <a-form-item>
                  <a-select
                    placeholder="选择基本工资"
                    :allowClear="true"
                    disabled
                    style="width: 33%"
                    v-decorator="['oldBasicSalary', { rules: [{ required: true, message: '选择基本工资' }] }]"
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

                  <a-input-number
                    placeholder="岗位工资"
                    style="width: 33%"
                    :allowClear="true"
                    :min="0"
                    disabled
                    :step="1"
                    :precision="2"
                    v-decorator="['oldPostSalary', { rules: [{ required: true, message: '请输入岗位工资(元)' }] }]"
                  />

                  <a-input-number
                    placeholder="考核工资"
                    style="width: 33%"
                    :allowClear="true"
                    :min="0"
                    disabled
                    :step="1"
                    :precision="2"
                    v-decorator="['oldAssessSalary', { rules: [{ required: false, message: '请输入考核工资(元)' }] }]"
                  />

                </a-form-item>
              </td>
              <td v-if="distribution">分配期望总薪资(元)</td>
              <td v-if="distribution">
                <a-form-item>
                  <a-select
                    placeholder="选择基本工资"
                    style="width: 33%"
                    :allowClear="true"
                    v-decorator="['expectBasicSalary', { rules: [{ required: true, message: '选择基本工资' }] }]"
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
                  <a-input-number
                    placeholder="岗位工资"
                    style="width: 33%"
                    :allowClear="true"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['expectPostSalary', { rules: [{ required: true, message: '请输入岗位工资(元)' }] }]"
                  />

                  <a-input-number
                    placeholder="考核工资"
                    style="width: 33%"
                    :allowClear="true"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['expectAssessSalary', { rules: [{ required: false, message: '请输入考核工资(元)' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr v-if="isSelfApproval">
              <td>工作业绩</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea
                    :disabled="isView || distribution"
                    placeholder="工作业绩"
                    :rows="3"
                    v-decorator="['attachInfo', { rules: [{ required: true, message: '工作业绩' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr v-if="!isSelfApproval">
              <td>工作业绩</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea
                    :disabled="isAdd || istext || isView || distribution"
                    placeholder="工作业绩"
                    :rows="3"
                    v-decorator="['jobResult', { rules: [{ required: false, message: '工作业绩' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr v-if="!isSelfApproval">
              <td>期望生效时间</td>
              <td colspan="3">
                <a-form-item>
                  <a-month-picker
                    :disabled="isDisabled"
                    :disabledDate="disabledDate"
                    style="width: 100%"
                    v-decorator="['expectDate', { rules: [{ required: true, message: '输入期望生效时间' }] }]"
                    format="YYYY-MM"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="4">自愿申请调岗并愿意接受所调新岗位的职责和薪资标准</td>
            </tr>
          </template>

          <template v-if="isPostAndSalary">
            <tr>
              <td>原部门</td>
              <td>{{ oldDepartmentName }}</td>
              <td>原岗位</td>
              <td>{{ oldStationName }}</td>
            </tr>
            <tr>
              <td>调入部门</td>
              <td>
                <a-form-item>
                  <a-select
                    :disabled="isDisabled"
                    placeholder="选择部门"
                    @change="depChangeHandler"
                    v-decorator="['newDepartmentId', { rules: [{ required: true, message: '请选择部门' }] }]"
                  >
                    <a-select-option v-for="item in depSelectDataSource" :key="item.id" :value="item.id">
                      {{ item.departmentName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
              <td>调入岗位</td>
              <td>
                <a-form-item>
                  <a-select
                    :disabled="isDisabled"
                    placeholder="选择岗位"
                    v-decorator="['newStationId', { rules: [{ required: true, message: '请选择岗位' }] }]"
                  >
                    <a-select-option v-for="item in postSelectDataSource" :key="item.id" :value="item.id">
                      {{ item.stationName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>拟入职日期</td>
              <td>
                <a-form-item>
                  <a-date-picker
                    :disabled="isDisabled"
                    style="width: 100%"
                    v-decorator="[
                      'nEnterDate',
                      { initialValue: moment(), rules: [{ required: true, message: '输入拟入职日期' }] },
                    ]"
                    format="YYYY-MM-DD"
                  />
                </a-form-item>
              </td>
              <td>调入部门主管</td>
              <td>{{ newDepartmentManagerName }}</td>
            </tr>
            <tr>
              <td>入职日期</td>
              <td>{{ salary_entryDate }}</td>
              <td>入职年限</td>
              <td>{{ salary_entryYears }}</td>
            </tr>
            <tr>
              <td>原总薪资</td>
              <td>
                <a-form-item>
                  <a-input-number
                    placeholder="原总薪资"
                    style="width: 100%"
                    disabled
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['oldSalary', { rules: [{ required: true, message: '请输入原总薪资(元)' }] }]"
                  />
                </a-form-item>
              </td>
              <td>期望总薪资(元)</td>
              <td>
                <a-form-item>
                  <a-input-number
                    placeholder="期望总薪资"
                    style="width: 100%"
                    :disabled="isDisabled"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['expectSalary', { rules: [{ required: true, message: '请输入期望总薪资(元)' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>分配原总薪资</td>
              <td>
                <a-form-item>
                  <a-select
                    placeholder="选择基本工资"
                    :allowClear="true"
                    disabled
                    style="width: 33%"
                    v-decorator="['oldBasicSalary', { rules: [{ required: true, message: '选择基本工资' }] }]"
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
                  <a-input-number
                    placeholder="岗位工资"
                    :allowClear="true"
                    disabled
                    style="width: 33%"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['oldPostSalary', { rules: [{ required: true, message: '请输入岗位工资(元)' }] }]"
                  />

                  <a-input-number
                    placeholder="考核工资"
                    :allowClear="true"
                    disabled
                    style="width: 33%"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['oldAssessSalary', { rules: [{ required: false, message: '请输入考核工资(元)' }] }]"
                  />
                </a-form-item>
              </td>
              <td v-if="distribution || (isView && this.record.status === 1)">分配期望总薪资(元)</td>
              <td v-if="distribution || (isView && this.record.status === 1)">
                <a-form-item>
                  <a-select
                    placeholder="选择基本工资"
                    :allowClear="true"
                    :disabled="isView"
                    style="width: 33%"
                    v-decorator="['expectBasicSalary', { rules: [{ required: true, message: '选择基本工资' }] }]"
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
                  <a-input-number
                    placeholder="岗位工资"
                    :allowClear="true"
                    :disabled="isView"
                    style="width: 33%"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['expectPostSalary', { rules: [{ required: true, message: '请输入岗位工资(元)' }] }]"
                  />
                  <a-input-number
                    placeholder="考核工资"
                    :allowClear="true"
                    :disabled="isView"
                    style="width: 33%"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['expectAssessSalary', { rules: [{ required: false, message: '请输入考核工资(元)' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>调岗调薪原因</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea
                    :disabled="isDisabled"
                    placeholder="调岗调薪原因"
                    :rows="3"
                    v-decorator="['changeReason', { rules: [{ required: true, message: '调岗调薪原因' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>期望生效时间</td>
              <td colspan="3">
                <a-form-item>
                  <a-month-picker
                    :disabled="isDisabled"
                    :disabledDate="disabledDate"
                    style="width: 100%"
                    v-decorator="['expectDate', { rules: [{ required: true, message: '输入期望生效时间' }] }]"
                    format="YYYY-MM"
                  />
                </a-form-item>
              </td>
            </tr>
          </template>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
      <SystemUserSelect ref="systemUserSelect" @selectSystemUsers="selectSystemUsers" />
    </a-spin>
  </a-modal>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'

import {
  //调岗
  getPositionChangeDetail,
  getPositionManager, //查询部门主管
  saveOrUpdatePositionChangeApply,
  approvePositionChangeAplly, //审批
  getApplyUserOrag,
  getDepartmentUser,
  //调薪
  getSalaryChangeDetail,
  saveOrUpdateSalaryChangeApply,
  approveSalaryChangeApply,
  saveOrChangeApply,
  //调岗调薪
  getPositionAndSalaryChangeDetail,
  saveOrUpdatePositionAndSalaryChangeApply,
  approvePositionAndSalaryChange,
  getSalaryBaseCommonByUserId,
  saveOrPositionAndSalaryChangeApply,
} from '@/api/personnelManagement'
import moment from 'moment'
import Approval from './Approval'
import SystemUserSelect from './SystemUserSelect'
export default {
  name: 'AddForm',
  components: {
    Approval: Approval,
    SystemUserSelect: SystemUserSelect,
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      applyUserId: undefined,
      education: [],
      depId: 0,
      postId: 0,
      depSelectDataSource: [],
      postSelectDataSource: [],
      postSelectDataSourceLevel: [],
      form: this.$form.createForm(this, { name: 'add_adjust_form' }),
      visible: false,
      actionType: 'add',
      operationStatus: 0, //0 调岗申请单， 1 调薪申请单，2 调岗调薪申请单
      opinion: '', //审批意见

      oldDepartmentName: '',
      oldStationName: '',
      oldStationId: undefined,
      newDepartmentManagerName: '',
      //调薪
      salary_entryDate: '',
      //毛家亮提交完后，对应的员工进入审批（这时的审批页面只有提交，没有驳回和通过），
      //详情接口返回的期望工资和原工资是-1
      isSelfApproval: false,
      spinning: false,
      taskFlag: 0, //1 调薪人自己节点  0其他人 默认其他人
      survey: {},
      record: {},
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批', distribution: '分配' }
      if (this.distribution) {
        return `${m[this.actionType]}${this.operationStatusTxt}薪资`
      } else {
        return `${m[this.actionType]}${this.operationStatusTxt}申请`
      }
    },
    operationStatusTxt() {
      let map = { 0: '调岗', 1: '调薪', 2: '调岗调薪' }
      return map[this.operationStatus]
    },
    isPost() {
      //调岗
      return this.operationStatus === 0 ? true : false
    },
    isSalary() {
      //调薪
      return this.operationStatus === 1 ? true : false
    },
    isPostAndSalary() {
      //调岗调薪
      return this.operationStatus === 2 ? true : false
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
    distribution() {
      return this.actionType === 'distribution'
    },
    istext() {
      return (
        (this.isEdit && this.userInfo.id === Number(this.record.createdId)) ||
        (this.isApproval && this.userInfo.id !== this.applyUserId)
      )
    },

    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval || this.distribution
    },
    salary_entryYears() {
      let that = this
      let _date = that.moment(that.salary_entryDate)
      if (!_date.isValid()) {
        return ''
      }
      let res = ''
      let _nowDate = that.moment()
      let diffMonths = _nowDate.diff(_date, 'months')
      let year = Math.floor(diffMonths / 12)
      let months = Math.floor(diffMonths % 12)
      if (year > 0) {
        res += `${year}年`
      }
      if (months > 0) {
        res += `${months}个月`
      }
      if (year <= 0 && months <= 0) {
        res = '不足一个月'
      }
      return res
    },
  },
  methods: {
    moment: moment,
    disabledDate(current) {
      return current && current < moment().startOf('month')
    },
    init() {
      let that = this
      return Promise.all([
        departmentList().then((res) => (that.depSelectDataSource = res.data)), //部门
      ])
    },
    depChangeHandler(dep_id) {
      let that = this
      that.postSelectDataSource = []
      //that.form.resetFields(['stationId'])//重置岗位下拉框
      that.form.resetFields(['newStationId']) //重置岗位下拉框

      getPositionManager({ departmentId: dep_id }).then((res) => {
        console.log(res)
        that.newDepartmentManagerName = res.data.trueName

        //res.data.departmentId
        //stationId
        //jobNum
        //mobile
      })

      return getStationList({ id: dep_id }).then((res) => {
        that.postSelectDataSource = res.data
      })
    },
    async handleOk() {
      let that = this
      debugger
      if (that.distribution) {
        this.form.validateFields((err, values) => {
          if (!err) {
            debugger
            if (Number(values.oldSalary) !== Number(values.oldBasicSalary) + Number(values.oldPostSalary) + Number(values.oldAssessSalary)) {
              return this.$message.error('原总工资 = 原基本工资 + 原岗位工资 + 原考核工资')
            }
            if (Number(values.expectSalary) !== Number(values.expectBasicSalary) + Number(values.expectPostSalary) + Number(values.expectAssessSalary)) {
              return this.$message.error('期待总工资 = 期待基本工资 + 期待岗位工资 + 期待考核工资')
            }
            let apiMap = {
              0: saveOrUpdatePositionChangeApply,
              1: saveOrChangeApply,
              2: saveOrPositionAndSalaryChangeApply,
            }
            let react = {
              id: that.record.id,
              oldBasicSalary: values.oldBasicSalary,
              oldPostSalary: values.oldPostSalary,
              oldAssessSalary:values.oldAssessSalary,
              oldSalary: values.oldSalary,
              expectSalary: values.expectSalary,
              expectPostSalary: values.expectPostSalary,
              expectBasicSalary: values.expectBasicSalary,
              expectAssessSalary:values.expectAssessSalary,
              applyUserId: this.survey.applyUserId,
            }
            console.log(react)
            apiMap[that.operationStatus](react)
              .then((res) => {
                that.spinning = false
                console.log(res)
                that.form.resetFields() // 清空表
                that.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              })
              .catch((err) => (that.spinning = false))
          }else{
            console.log(err)
          }
        })
        return
      }
      //员工审批调薪填写业绩的特别处理
      if (that.isApproval && that.isSelfApproval) {
        this.form.validateFields((err, values) => {
          if (!err) {
            that.passAction({ attachInfo: values.attachInfo })
          }else{
            console.log(err)
          }
        })
        return
      } else if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      let apiMap = {
        0: saveOrUpdatePositionChangeApply,
        1: saveOrUpdateSalaryChangeApply,
        2: saveOrUpdatePositionAndSalaryChangeApply,
      }
      console.log(that.operationStatus)
      this.form.validateFields((err, values) => {
        if (!err) {
          //调岗参数
          if (that.isPost || that.isPostAndSalary) {
            values.oldStationId = that.oldStationId
          }
          if (that.isSalary || that.isPostAndSalary) {
          }
          //提交
          that.spinning = true
          if(values.expectDate && values.expectDate instanceof moment){
            values.expectDate = values.expectDate.format('YYYY-MM') + '-01'
          }

          if(values.nEnterDate && values.nEnterDate instanceof moment){
            values.nEnterDate = values.nEnterDate.format('YYYY-MM-DD')
          }

          if(values.enterDate && values.enterDate instanceof moment){
            values.enterDate = values.enterDate.format('YYYY-MM-DD')
          }

          console.log(values)

          apiMap[that.operationStatus](values)
            .then((res) => {
              that.spinning = false
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch((err) => {
              that.spinning = false
              that.$message.error(err.message)
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      console.log(type)
      that.actionType = type
      that.record = record || {}
      that.operationStatus = record.operationStatus
      that.form.resetFields()
      that.resetValues()
      await that.init()
      that.visible = true
      if (type === 'add') return
      let apiMap = {
        0: getPositionChangeDetail,
        1: getSalaryChangeDetail,
        2: getPositionAndSalaryChangeDetail,
      }
      //填充数据
      let data = await apiMap[that.operationStatus]({ applyId: that.record.id })
        .then((res) => res.data)
        .catch((err) => null)
      if (data === null) {
        that.$message.error('获取数据失败，请稍后再试')
        return
      }
      that.survey = data
      that.taskFlag = data.taskFlag || 0
      //填充调岗
      if (that.isPost || that.isPostAndSalary) {
        that.oldDepartmentName = data.oldDepartmentName
        that.oldStationName = data.oldStationName
        that.oldStationId = data.oldStationId
        that.newDepartmentManagerName = data.newDepartmentManagerName
        data.nEnterDate = data.nEnterDate ? that.moment(data.nEnterDate) : that.moment()
        await that.depChangeHandler(data.newDepartmentId)
      }
      if (that.isSalary || that.isPostAndSalary) {
        that.oldDepartmentName = data.oldDepartmentName || data.departmentName
        that.applyUserId = data.applyUserId
        that.oldStationName = data.oldStationName || data.stationName
        data.expectDate = data.expectDate ? that.moment(data.expectDate) : that.moment()
        if (data.expectSalary === -1 && data.oldSalary === -1) {
          that.isSelfApproval = true
        }
        data.attachInfo = data.jobResult
      }
      //debugger
      if (data.enterDate) {
        let _date = that.moment(data.enterDate)
        that.salary_entryDate = _date.isValid() ? that.moment(data.enterDate).format('YYYY-MM-DD') : ''
      }

      //taskFlag = 1 时为调薪调岗本人登录，需要隐藏原薪资和期望薪资
      if (data.taskFlag && data.taskFlag === 1) {
        data.oldSalary = '***'
        data.expectSalary = '***'
        // that.form.setFieldsValue({
        //   oldSalary:'***',
        //   expectSalary:'***'
        // })
      }
      that.form.setFieldsValue(data)
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      let apiMap = {
        0: approvePositionChangeAplly,
        1: approveSalaryChangeApply,
        2: approvePositionAndSalaryChange,
      }

      that.spinning = true
      apiMap[that.operationStatus](values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))

      // approvePersonAdvertInfo(values).then(res =>{
      //   console.log(res)
      //   that.form.resetFields() // 清空表
      //   that.visible = false
      //   that.$message.info(res.msg)
      //   that.$emit('finish')
      // })
    },
    passAction(opt) {
      //员工审批调薪填写业绩的特别处理
      if (this.isApproval && this.userInfo.id === this.applyUserId) {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.submitAction(
              Object.assign({}, { isAdopt: 0, opinion: '通过', attachInfo: values.jobResult }, opt || {})
            )
          }
        })
      } else {
        this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
      }
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
    selectSystemUsers({ decoratorKey, record }) {
      let that = this
      console.log(decoratorKey, record)
      if (record) {
        that.form.setFieldsValue({
          applyUserId: record.id,
          applyUserName: record.trueName,
        })
        that.oldDepartmentName = record.department.departmentName
        that.oldStationName = record.station.stationName
        that.oldStationId = record.station.id

        let _date = that.moment(record.entryDate)
        that.salary_entryDate = _date.isValid() ? that.moment(record.entryDate).format('YYYY-MM-DD') : ''

        getSalaryBaseCommonByUserId({ userId: record.id }).then((res) => {
          // debugger
          if (res && res.data) {
            that.form.setFieldsValue({
              oldBasicSalary: res.data.realityBasicSalary,
              oldPostSalary: res.data.realityPostSalary,
              oldAssessSalary:res.data.realityAssessSalary,
              oldSalary: Number(res.data.realityBasicSalary) + Number(res.data.realityPostSalary)+ Number(res.data.realityAssessSalary),
            })
          }
        })
      }
    },
    openSystemUsers(decoratorKey) {
      this.$refs.systemUserSelect.query(decoratorKey)
    },

    resetValues() {
      let that = this
      that.oldDepartmentName = ''
      that.oldStationName = ''
      that.oldStationId = undefined
      that.newDepartmentManagerName = ''
      //调薪
      that.salary_entryDate = ''
    },
  },
}
</script>

<style scoped>
.adjust-apply-list-wrapper .search-wrapper * {
  margin: 0;
}
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
}
</style>

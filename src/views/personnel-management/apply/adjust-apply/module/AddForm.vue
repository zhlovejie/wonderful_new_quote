<template>
  <a-modal
    :title="modalTitle"
    :width="850"
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
                    v-decorator="['changeReason', { rules: [{ required: isSelfApproval, message: '调岗原因' }] }]"
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
              <td>原薪资</td>
              <td>
                <a-form-item>
                  <!-- <a-input :disabled="isDisabled"  placeholder="原薪资"  v-decorator="['oldSalary', { rules: [{ required: true, message: '原薪资' }] }]"/> -->
                  <a-input-number
                    style="width: 100%"
                    :disabled="isDisabled"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['oldSalary', { rules: [{ required: true, message: '请输入原薪资' }] }]"
                  />
                </a-form-item>
              </td>
              <td>期望薪资(元)</td>
              <td>
                <a-form-item>
                  <!-- <a-input :disabled="isDisabled"  placeholder="期望薪资(元)"  v-decorator="['expectSalary', { rules: [{ required: true, message: '期望薪资(元)' }] }]"/> -->
                  <a-input-number
                    style="width: 100%"
                    :disabled="isDisabled"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['expectSalary', { rules: [{ required: true, message: '期望薪资(元)' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr v-if="isSelfApproval">
              <td>工作业绩</td>
              <td colspan="3">
                <a-form-item>
                  <a-textarea
                    :disabled="isView"
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
                    :disabled="isAdd || istext || isView"
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
                  <a-date-picker
                    :disabled="isDisabled"
                    style="width: 100%"
                    v-decorator="[
                      'expectDate',
                      { initialValue: moment(), rules: [{ required: true, message: '输入期望生效时间' }] },
                    ]"
                    format="YYYY-MM-DD"
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
              <td>原薪资</td>
              <td>
                <a-form-item>
                  <!-- <a-input :disabled="isDisabled" placeholder="原薪资"  v-decorator="['oldSalary', { rules: [{ required: true, message: '原薪资' }] }]"/> -->
                  <a-input-number
                    style="width: 100%"
                    :disabled="isDisabled"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['oldSalary', { rules: [{ required: true, message: '原薪资(元)' }] }]"
                  />
                </a-form-item>
              </td>
              <td>期望薪资(元)</td>
              <td>
                <a-form-item>
                  <!-- <a-input :disabled="isDisabled" placeholder="期望薪资(元)"  v-decorator="['expectSalary', { rules: [{ required: true, message: '期望薪资(元)' }] }]"/> -->
                  <a-input-number
                    style="width: 100%"
                    :disabled="isDisabled"
                    :min="0"
                    :step="1"
                    :precision="2"
                    v-decorator="['expectSalary', { rules: [{ required: true, message: '期望薪资(元)' }] }]"
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
                    v-decorator="['changeReason', { rules: [{ required: false, message: '调岗调薪原因' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>期望生效时间</td>
              <td colspan="3">
                <a-form-item>
                  <a-date-picker
                    :disabled="isDisabled"
                    style="width: 100%"
                    v-decorator="[
                      'expectDate',
                      { initialValue: moment(), rules: [{ required: true, message: '输入期望生效时间' }] },
                    ]"
                    format="YYYY-MM-DD"
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
  //调岗调薪
  getPositionAndSalaryChangeDetail,
  saveOrUpdatePositionAndSalaryChangeApply,
  approvePositionAndSalaryChange,
  getSalaryBaseCommonByUserId,
} from '@/api/personnelManagement'
import moment from 'moment'
import Approval from './Approval'
import SystemUserSelect from '@/components/CustomerList/SystemUserSelect'
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
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}${this.operationStatusTxt}申请`
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
    istext() {
      return (
        (this.isEdit && this.userInfo.id === Number(this.record.createdId)) ||
        (this.isApproval && this.userInfo.id !== this.applyUserId)
      )
    },

    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
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
      //debugger
      let that = this

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
          debugger
          if (res && res.data) {
            let salary = res.data.realitySalary || undefined
            that.form.setFieldsValue({ oldSalary: salary })
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
<template>
  <a-modal 
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction" v-if="taskFlag >= 4">不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">{{taskFlag >= 4 ? '通过' : '提交'}}</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <!-- <a-row :gutter="16" v-if="isApproval">
        <a-col :span="24" style="text-align: right;">
          <a-button
            class="a-button"
            style="margin-right: 8px;"
            type="primary"
            icon="check"
            @click="passAction"
          >{{taskFlag >= 4 ? '通过' : '提交'}}</a-button>
          <a-button v-if="taskFlag >= 4" class="a-button" type="primary" icon="close" @click="noPassAction">不通过</a-button>
        </a-col>
      </a-row> -->
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>编号</td>
            <td>
              <a-form-item>
                <a-input disabled v-decorator="['reportNum']" />
                <a-input hidden v-decorator="['instanceId']" />
                
              </a-form-item>
            </td>
            <td>发生时间</td>
            <td>
              <a-form-item>
                <a-date-picker
                  :disabled="isDisabled"
                  style="width:100%;"
                  v-decorator="['reportTime',{initialValue:moment(),rules: [{required: true,message: '输入发生时间'}]}]"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>提出部门</td>
            <td>
              <a-form-item>{{createUserDepartmentName}}</a-form-item>
            </td>
            <td>报告人</td>
            <td>{{createUserName}}</td>
          </tr>
          <tr>
            <td>异常类型</td>
            <td>
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  placeholder="异常类型"
                  v-decorator="['exceptionId', { rules: [{ required: true, message: '异常类型' }] }]"
                >
                  <a-select-option
                    v-for="item in accidentTypeSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>紧急程度</td>
            <td>
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  placeholder="紧急程度"
                  v-decorator="['emergentLevel',{initialValue:0,rules: [{required: false,message: '紧急程度'}]}]"
                >
                  <a-select-option :value="1">紧急</a-select-option>
                  <a-select-option :value="0">一般</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>损失类型</td>
            <td>
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  placeholder="损失类型"
                  v-decorator="['loseTypeId',{rules: [{required: true,message: '损失类型'}]}]"
                >
                  <a-select-option
                    v-for="item in lossTypeSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>影响程度</td>
            <td>
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  placeholder="影响程度"
                  v-decorator="['affectLevel',{initialValue:0,rules: [{required: false,message: '影响程度'}]}]"
                >
                  <a-select-option :value="0">轻微</a-select-option>
                  <a-select-option :value="1">一般</a-select-option>
                  <a-select-option :value="2">严重</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>责任部门</td>
            <td>
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  placeholder="选择部门"
                  @change="depChangeHandler"
                  v-decorator="['dutyDepartmentId', { rules: [{ required: true, message: '选择部门' }] }]"
                >
                  <a-select-option :value="0">请选择部门</a-select-option>
                  <a-select-option
                    v-for="item in depSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.departmentName}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
            <td>责任人</td>
            <td>
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  placeholder="选择责任人"
                  v-decorator="['dutyPersonId', { rules: [{ required: true, message: '选择责任人' }] }]"
                >
                  <a-select-option
                    v-for="item in personSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.trueName}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>事故情况说明</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  :disabled="isDisabled"
                  placeholder="事故情况说明"
                  :rows="3"
                  v-decorator="['incidentDesc', { rules: [{ required: true, message: '事故情况说明' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr >
            <td>事故处置</td>
            <td colspan="3" style="text-align:left;">
              <div class="task-flag-1" >
                <div>解决方案</div>
                <a-form-item>
                  <a-textarea 
                    :disabled="isView || taskFlag !== 1" 
                    placeholder="解决方案"
                    :rows="3"
                    v-decorator="['solutionExplan', { rules: [{ required: false, message: '解决方案' }] }]"
                  />
                </a-form-item>
              </div>
              <a-row>
                <a-col :span="24" >
                  <a-form-item label="是否关联其他部门" style="display:flex;">
                    <a-radio-group 
                      :disabled="isView || taskFlag !== 1" 
                      name="haveSecurity"
                      @change="relationDepartmentChangeHandler"
                      v-decorator="['isRelationDepartment',{initialValue:1,rules: [{required: false,message: '选择是否关联其他部门'}]}]"
                    >
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :span="24" v-if="isRelationDepartment">
                  <a-form-item label="关联部门" style="display:flex;">
                    <a-select 
                      :disabled="isView || taskFlag !== 1" 
                      placeholder="选择关联部门"
                      style="width:250px;"
                      v-decorator="['relationDepartmentId', { rules: [{ required: false, message: '选择关联部门' }] }]"
                    >
                      <a-select-option
                        v-for="item in relationDepartmentDataSource"
                        :key="item.id"
                        :value="item.id"
                      >{{item.departmentName}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="24" v-if="isRelationDepartment">
                  <a-form-item>
                    <a-textarea 
                      :disabled="isView || taskFlag !== 2" 
                      placeholder="关联部门解决方案"
                      :rows="3"
                      v-decorator="['relationSolution', { rules: [{ required: false, message: '关联部门解决方案' }] }]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <div class="task-flag-1" >
                <div>责任认定及处理结果</div>
                <a-form-item>
                  <a-textarea 
                    :disabled=" isView || taskFlag !== 3" 
                    placeholder="责任认定及处理结果"
                    :rows="3"
                    v-decorator="['dutyDesc', { rules: [{ required: false, message: '责任认定及处理结果' }] }]"
                  />
                </a-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  :disabled="isDisabled"
                  placeholder="备注"
                  :rows="2"
                  v-decorator="['remark', { rules: [{ required: false, message: '备注' }] }]"
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
import { mapGetters } from 'vuex'
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import {
  getPersonnelIncidentInvReportDetail,
  saveOrUpdatePersonnelIncidentInvReport,
  taskQueryPersonnelIncidentInvReport,
  approvePersonnelIncidentInvReport
} from '@/api/personnelManagement'
import moment from 'moment'
import Approval from './Approval'
import SystemUserSelect from '@/components/CustomerList/SystemUserSelect'
export default {
  name: 'AddForm',
  components: {
    Approval: Approval
  },
  data() {
    return {
      education: [],
      depId: 0,
      postId: 0,
      depSelectDataSource: [],
      personSelectDataSource: [],
      accidentTypeSelectDataSource: [], //事故类型
      lossTypeSelectDataSource: [], //损失类型
      relationDepartmentDataSource: [], //关联部门
      isRelationDepartment: true, //是否关联部门
      form: this.$form.createForm(this, { name: 'add_adjust_form' }),
      visible: false,
      actionType: 'add',
      operationStatus: 0, //0 调岗申请单， 1 调薪申请单，2 调岗调薪申请单
      opinion: '', //审批意见
      spinning: false,
      taskFlag: 0, //当前节点信息：1 责任部门领导 2 关联部门领导 3 提交部门领导   \
      createUserDepartmentName: '',
      createUserName: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}事故调查报告`
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
    }
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      return Promise.all([
        departmentList().then(res => {
          that.depSelectDataSource = res.data
          that.relationDepartmentDataSource = res.data.map(item => Object.assign({}, item))
        }), //部门
        getDictionaryList({ parentId: 477 }).then(res => (that.accidentTypeSelectDataSource = res.data)),
        getDictionaryList({ parentId: 485 }).then(res => (that.lossTypeSelectDataSource = res.data))
      ])
    },
    depChangeHandler(depId) {
      getUserByDep({ departmentId: depId }).then(res => (this.personSelectDataSource = res.data))
    },
    async handleOk() {
      //debugger
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          //提交
          that.spinning = true
          saveOrUpdatePersonnelIncidentInvReport(values)
            .then(res => {
              that.spinning = false
              console.log(res)
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch(err => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      //debugger
      console.log(arguments)
      
      let that = this
      that.resetData()
      that.actionType = type
      that.record = record || {}

      that.form.resetFields()
      await that.init()
      that.visible = true

      if (that.isAdd) {
        console.log(that.userInfo)
        that.createUserDepartmentName = that.userInfo.departmentName
        that.createUserName = that.userInfo.trueName
        return 
      }

      //填充数据
      getPersonnelIncidentInvReportDetail({ applyId: that.record.id }).then(res => {
        console.log(res)
        let data = res.data
        that.taskFlag = data.taskFlag || 0
        data.reportTime = that.moment(data.reportTime)
        that.createUserDepartmentName = data.createUserDepartmentName
        that.createUserName = data.createUserName
        that.isRelationDepartment = data.isRelationDepartment
        getUserByDep({ departmentId: data.dutyDepartmentId }).then(res => {
          that.personSelectDataSource = res.data
          that.form.setFieldsValue(data)
        })
      })
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      approvePersonnelIncidentInvReport(values)
        .then(res => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch(err => (that.spinning = false))

      // approvePersonAdvertInfo(values).then(res =>{
      //   console.log(res)
      //   that.form.resetFields() // 清空表
      //   that.visible = false
      //   that.$message.info(res.msg)
      //   that.$emit('finish')
      // })
    },
    passAction(opt = {}) {
      let taskFlag = this.taskFlag
      //attachInfo
      if (taskFlag === 1) {
        opt.attachInfo = this.form.getFieldValue('solutionExplan')
        opt.attachId = this.form.getFieldValue('relationDepartmentId')
      } else if (taskFlag === 2) {
        //opt.isRelationDepartment = this.form.getFieldValue('isRelationDepartment')
        opt.attachInfo = this.form.getFieldValue('relationSolution')
      } else if (taskFlag === 3) {
        opt.attachInfo = this.form.getFieldValue('dutyDesc')
      }
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
        opinion: opinion
      })
    },
    selectSystemUsers({ decoratorKey, record }) {
      let that = this
      console.log(decoratorKey, record)
      if (record) {
        that.form.setFieldsValue({
          applyUserId: record.id,
          applyUserName: record.trueName
        })
        that.oldDepartmentName = record.department.departmentName
        that.oldStationName = record.station.stationName
        that.oldStationId = record.station.id
        that.salary_entryDate = record.entryDate ? that.moment(record.entryDate) : that.moment()
      }
    },
    openSystemUsers(decoratorKey) {
      this.$refs.systemUserSelect.query(decoratorKey)
    },
    relationDepartmentChangeHandler(event) {
      console.log(event.target.value)
      this.isRelationDepartment = parseInt(event.target.value)
    },
    resetData(){
      let that = this
      that.education = []
      that.depId = 0
      that.postId = 0
      that.depSelectDataSource = []
      that.personSelectDataSource = []
      that.accidentTypeSelectDataSource = [] //事故类型
      that.lossTypeSelectDataSource = [] //损失类型
      that.relationDepartmentDataSource = [] //关联部门
      that.isRelationDepartment = true //是否关联部门
      that.visible = false
      that.actionType = 'add'
      that.operationStatus = 0 //0 调岗申请单， 1 调薪申请单，2 调岗调薪申请单
      that.opinion = '' //审批意见
      that.spinning = false
      that.taskFlag = 0 //当前节点信息：1 责任部门领导 2 关联部门领导 3 提交部门领导 
      that.createUserDepartmentName = ''
      that.createUserName = ''
    }
  }
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
<template>
  <a-modal
    :title="modalTitle"
    :width="500"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">离职类别</td>
            <td>
              <a-form-item>
                <a-select
                  :disabled="isDisabled"
                  v-decorator="['type', { rules: [{ required: true, message: '选择部门' }] }]"
                  placeholder="离职类别"
                  @change="typeChange"
                >
                  <a-select-option :value="1">事故型辞退</a-select-option>
                  <a-select-option :value="2">裁员型辞退</a-select-option>
                  <a-select-option :value="3">自愿离职</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="severanceType === 1">
            <td>事故调查报告</td>
            <td>
              <a-form-item>
                <a-input :disabled="isDisabled"   v-decorator="['reportName']" @click="openModuleSelectedAction('report')">
                  <a-tooltip slot="suffix" title="清空" v-if="!isDisabled">
                    <a-icon type="close-circle" style="color: rgba(0,0,0,.45)" @click="onChangeHandler('report')" />
                  </a-tooltip>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input hidden v-decorator="['reportId']"></a-input>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="severanceType === 2">
            <td>离职协议</td>
            <td>
              <a-form-item>
                <a-input :disabled="isDisabled"   v-decorator="['agreeName']" @click="openModuleSelectedAction('agree')">
                  <a-tooltip slot="suffix" title="清空" v-if="!isDisabled">
                    <a-icon type="close-circle" style="color: rgba(0,0,0,.45)" @click="onChangeHandler('agree')" />
                  </a-tooltip>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input hidden v-decorator="['agreeId']"></a-input>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>部门</td>
            <td>
              <a-form-item>
                <a-select
                  v-if="severanceType === 3"
                  :disabled="isDisabled"
                  placeholder="选择部门"
                  @change="depChangeHandler"
                  v-decorator="['depId', { rules: [{ required: true, message: '选择部门' }] }]"
                >
                  <a-select-option
                    v-for="item in depSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.departmentName}}</a-select-option>
                </a-select>
                <span v-else>{{dutyDepartmentName}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>岗位</td>
            <td >
              <a-form-item>
                <a-select
                  v-if="severanceType === 3"
                  :disabled="isDisabled"
                  placeholder="选择岗位"
                  @change="postChangeHandler"
                  v-decorator="['postId', { rules: [{ required: true, message: '选择岗位' }] }]"
                >
                  <a-select-option
                    v-for="item in postSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.stationName}}</a-select-option>
                </a-select>
                <span v-else>{{dutyStationName}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>人员</td>
            <td >
              <a-form-item>
                <a-select
                  v-if="severanceType === 3"
                  :disabled="isDisabled"
                  placeholder="选择人员"
                  v-decorator="['userId', { rules: [{ required: true, message: '选择人员' }] }]"
                >
                  <a-select-option
                    v-for="item in personSelectDataSource"
                    :key="item.id"
                    :value="item.id"
                  >{{item.trueName}}</a-select-option>
                </a-select>
                <span v-else>{{userName}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>离职日期</td>
            <td colspan="3">
              <a-form-item>
                <a-date-picker
                  :disabled="isDisabled"
                  style="width:100%;"
                  v-decorator="['leaveDate',{initialValue:moment(),rules: [{required: true,message: '离职日期'}]}]"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <SelectAccident ref="selectAccident" @selectedAction="selectedAction"/>
      <SelectSeverance ref="selectSeverance" @selectedAction="selectedAction"/>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep, //获取部门下人员
  getUserByStation //获取岗位下人员
} from '@/api/systemSetting'
import { getDictionaryList } from '@/api/workBox'
import {
  saveOrUpdatePersonnelLeaveApply
} from '@/api/personnelManagement'
import moment from 'moment'

import SelectAccident from './SelectAccident'
import SelectSeverance from './SelectSeverance'

export default {
  name: 'AddForm',
  components: {
    SelectAccident:SelectAccident,
    SelectSeverance:SelectSeverance
  },
  data() {
    return {
      depSelectDataSource: [],
      postSelectDataSource:[],
      personSelectDataSource: [],
      form: this.$form.createForm(this),
      visible: false,
      actionType: 'add',
      opinion: '', //审批意见
      spinning: false,
      identityCard:'',
      severanceType:undefined,
      dutyDepartmentName:'',
      dutyDepartmentId:'',
      dutyStationName:'',
      dutyStationId:'',
      userName:'',
      userId:''
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}离职申请`
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
        departmentList().then(res => {that.depSelectDataSource = res.data}), //部门
      ])
    },
    depChangeHandler(depId) {
      this.postSelectDataSource = []
      this.personSelectDataSource = []
      this.form.setFieldsValue({postId:undefined,userId:undefined})

      getStationList({ id: depId }).then(res => (this.postSelectDataSource = res.data))
    },
    postChangeHandler(stationId){
      this.personSelectDataSource = []
      this.form.setFieldsValue({userId:undefined})
      getUserByStation({ stationId: stationId, showLeaveFlag:1 }).then(res => (this.personSelectDataSource = res.data))
    },
    selectReports(){

    },
    selectAgrees(){

    },
    async handleOk() {
      //debugger
      let that = this
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {

        //debugger
        if (!err) {
          if (that.isEdit) {
            values.id = that.record.id
          }
          //提交
          values.leaveDate = values.leaveDate.format('YYYY-MM-DD')
          if(that.severanceType !== 3){
            values.dutyDepartmentId = that.dutyDepartmentId
            values.dutyStationId = that.dutyStationId
            values.userId = that.userId
          }

          console.log(values)
          that.spinning = true
          saveOrUpdatePersonnelLeaveApply(values)
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
      this.reset()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      //debugger
      console.log(arguments)
      let that = this
      that.reset()
      that.actionType = type
      that.record = record || {}
      await that.init()
      that.visible = true
      if (that.isAdd) return
      that.severanceType = Number(record.type)



      if(that.severanceType === 1 || that.severanceType === 2){
        that.dutyDepartmentName =that.record.userDepartmentName
        that.dutyDepartmentId = that.record.userDepartmentId
        that.dutyStationName = that.record.userStationName
        that.dutyStationId = that.record.userStationId
        that.userName = that.record.userName
        that.userId = that.record.userId
      }

      that.$nextTick(() =>{
        that.form.setFieldsValue({type:that.severanceType})
        if(that.record.leaveDate){
          that.form.setFieldsValue({
            leaveDate:that.moment(that.record.leaveDate)
          })
        }
        if(that.severanceType === 1){
          that.form.setFieldsValue({
            reportName:that.record.userName,
            reportId:that.record.reportId
          })
        }
        if(that.severanceType === 2){
          that.form.setFieldsValue({
            agreeName:that.record.userName,
            agreeId:that.record.agreeId
          })
        }
        if(that.severanceType === 3){
          Promise.all([
            departmentList().then(res => that.depSelectDataSource = res.data),
            getStationList({ id: that.record.userDepartmentId }).then(res => this.postSelectDataSource = res.data),
            getUserByStation({ stationId: that.record.userStationId, showLeaveFlag:1 }).then(res => this.personSelectDataSource = res.data)
          ]).then(res =>{
            that.form.setFieldsValue({
              depId:that.record.userDepartmentId,
              postId:that.record.userStationId,
              userId:that.record.userId
            })
          })
        }
      })
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      approveLeaveOfficeAgreement(values)
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
    openModuleSelectedAction(key){
      if(key === 'report'){
        this.$refs.selectAccident.query(key)
      }else if(key === 'agree'){
        this.$refs.selectSeverance.query(key)
      }
    },
    selectedAction({decoratorKey,record}){
      debugger
      let that = this
      console.log(decoratorKey,record)
      if(record){
        if(decoratorKey === 'report'){
          that.form.setFieldsValue({
            reportName:`${record.dutyPersonName}/${record.dutyDepartmentName}/${record.exceptionName}`,
            reportId:record.id
          })
          //事故调查表人员字段
          that.userName = record.dutyPersonName
          that.userId = record.dutyPersonId
        }else if(decoratorKey === 'agree'){
          that.form.setFieldsValue({
            agreeName:`${record.userName}/${record.leaveOfficeCode}`,
            agreeId:record.id
          })
          //离职协议人员字段
          that.userName = record.userName
          that.userId = record.userId
        }
        that.dutyDepartmentName = record.dutyDepartmentName
        that.dutyDepartmentId = record.dutyDepartmentId
        that.dutyStationName = record.dutyStationName
        that.dutyStationId = record.dutyStationId
      }
    },
    onChangeHandler(key){
      let that = this
      if(key === 'report'){
        that.form.setFieldsValue({reportName:undefined,reportId:undefined})
      }else if(key === 'agree'){
        that.form.setFieldsValue({agreeName:undefined,agreeId:undefined})
      }
    },
    typeChange(key){
      this.severanceType = parseInt(key,10)
    },
    reset(){
      this.form.resetFields()
      this.dutyDepartmentName = ''
      this.dutyDepartmentId = ''
      this.dutyStationName = ''
      this.dutyStationId = ''
      this.userName = ''
      this.userId = ''
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

.pay-item-wrapper{
  display: flex;
  line-height: 39px;
}
.pay-item-wrapper span{
  margin:0 5px;
}
</style>

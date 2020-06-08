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
    <template v-if="isApproval">
      <a-button key="back" icon="close" @click="noPassAction" >不通过</a-button>
      <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
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
  <a-form :form="form" class="add-form-wrapper">
    <table class="custom-table custom-table-border">
      <tr>
        <td>部门</td>
        <td >
          <a-form-item>
            <a-select 
              :disabled="isDisabled" 
              placeholder="选择部门"  
              @change="depChangeHandler" 
              v-decorator="['departmentId', { rules: [{ required: true, message: '请选择部门' }] }]"
            >
              <a-select-option 
                v-for="item in depSelectDataSource" 
                :key="item.id" 
                :value="item.id" 
              >
              {{item.departmentName}}
              </a-select-option>
              <a-select-option key="add" value="add">新增部门</a-select-option>
            </a-select>
          </a-form-item>
        </td>
        <td>岗位</td>
        <td>
          <a-form-item>
            <a-select 
              :disabled="isDisabled"  
              placeholder="选择岗位"  
              @change="stationChangeHandler" 
              v-decorator="['stationId', { rules: [{ required: true, message: '请选择岗位' }] }]"
            >
              <a-select-option 
                v-for="item in postSelectDataSource" 
                :key="item.id" 
                :value="item.id" 
              >
              {{item.stationName}}
              </a-select-option>
              <a-select-option key="add" value="add">新增岗位</a-select-option>
            </a-select>
          </a-form-item>
        </td>
      </tr>


        <tr v-if="isAddDepartment"  style="background-color:#faebd7;">
          <td>部门名称</td>
          <td>
            <a-form-item>
              <a-input v-decorator="['department.departmentName', { rules: [{ required: isAddDepartment, message: '部门名称' }] }]" />
            </a-form-item>
          </td>
          <td>上级部门</td>
          <td>
            <a-form-item>
              <a-select 
                placeholder="选择上级部门"  
                @change="addDepChangeHandler"
                v-decorator="['department.parentId', { rules: [{ required: isAddDepartment, message: '请选择上级部门' }] }]"
              >
                <a-select-option 
                  v-for="item in addDepSelectDataSource" 
                  :key="item.id" 
                  :value="item.id" 
                >
                {{item.departmentName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </td>
        </tr>
        <tr v-if="isAddDepartment" style="background-color:#faebd7;">
          <td>部门总经理</td>
          <td>
            <a-form-item>
              <a-input read-only @click="openSystemUsers('department.leaderName')" v-decorator="['department.leaderName', { rules: [{ required: isAddDepartment, message: '所属上级负责人' }] }]" />
            </a-form-item>
            <a-form-item>
              <a-input hidden v-decorator="['department.leader']" />
            </a-form-item>
          </td>
          <td>部门等级</td>
          <td>
            <a-form-item>
              <a-select placeholder="选择部门等级"   v-decorator="['department.level', { rules: [{ required: isAddStation, message: '请选择部门等级' }] }]">
                <a-select-option value="1">1</a-select-option>
                <a-select-option value="2">2</a-select-option>
                <a-select-option value="3">3</a-select-option>
                <a-select-option value="4">4</a-select-option>
                <a-select-option value="5">5</a-select-option>
                <a-select-option value="6">6</a-select-option>
              </a-select>
            </a-form-item>
          </td>
        </tr>
        <tr v-if="isAddDepartment" style="background-color:#faebd7;">
          <td>新增部门备注</td>
          <td colspan="3">
            <a-form-item>
              <a-input placeholder="部门备注" v-decorator="['department.remarks', { rules: [{ required: false, message: '新增部门备注' }] }]" />
            </a-form-item>
          </td>
        </tr>




      <tr v-show="isAddStation" style="background-color:#faebd7;">
        <td>岗位名称</td>
        <td>
          <a-form-item>
            <a-input v-decorator="['station.stationName', { rules: [{ required: isAddStation, message: '岗位名称' }] }]" />
          </a-form-item>
        </td>
        <td>上级岗位</td>
        <td>
          <a-form-item>
            <a-select 
              placeholder="选择上级岗位"  
              @change="addStationChangeHandler"
              v-decorator="['station.parentId', { rules: [{ required: isAddStation, message: '上级岗位' }] }]"
            >
              <a-select-option 
                v-for="item in addPostSelectDataSource" 
                :key="item.id" 
                :value="item.id" 
              >
              {{item.stationName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </td>
        
      </tr>
      <tr v-show="isAddStation" style="background-color:#faebd7;">
        <td>岗位设定人数</td>
        <td>
          <a-form-item>
            <!-- <a-input v-decorator="['station.setNum', { rules: [{ required: isAddStation, message: '请输入岗位设定人数' }] }]" /> -->

            <a-input-number 
              style="width:100%;" 
              :min="1" 
              :max="100000" 
              :step="1" 
              v-decorator="['station.setNum', { rules: [{ required: isAddStation, message: '请输入岗位设定人数' }] }]" 
            />
          </a-form-item>
        </td>
        <td>岗位等级</td>
        <td>
          <a-form-item>
          <a-select placeholder="选择岗位等级"   v-decorator="['station.level', { rules: [{ required: isAddStation, message: '选择岗位等级' }] }]">
            <a-select-option v-for="level in levelList" :key="level" :value="level">{{ level }}</a-select-option>
          </a-select>
          </a-form-item>
        </td>
      </tr>
      <tr v-show="isAddStation" style="background-color:#faebd7;">
        <td>新增岗位备注</td>
        <td colspan="3">
          <a-form-item>
            <a-input placeholder="岗位备注"  v-decorator="['station.remarks', { rules: [{ required: false, message: '新增岗位备注' }] }]" />
          </a-form-item>
        </td>
      </tr>


      <tr v-if="!isAddStation">
        <td>岗位信息</td>
        <td colspan="3" style="padding:13px 10px;">
          <span >岗位设定人数：{{settingStationNum}}&nbsp;&nbsp;在职人数：{{currentStationNum}}</span>
        </td>
      </tr>

      <tr>
        <td>需求人数</td>
        <td>
          <a-form-item>
          <a-input :disabled="isDisabled"  v-decorator="['needNum', { rules: [{ required: true, message: '请输入需求人数' }] }]" />
          </a-form-item>
        </td>
        <td>到岗日期</td>
        <td>
          <a-form-item>
            <a-date-picker 
              :disabled="isDisabled" 
              style="width:100%;" 
              v-decorator="['dutyDate',{initialValue:moment(),rules: [{required: true,message: '输入到岗日期'}]}]" 
              format="YYYY-MM-DD"
            />
          </a-form-item>
        </td>
      </tr>

      <tr>
        <td>性别要求</td>
        <td>
          <a-form-item >
            <a-select :disabled="isDisabled"  placeholder="选择性别" v-decorator="['needSex',{initialValue:1,rules: [{required: false,message: '选择性别'}]}]">
              <a-select-option :value="0">无</a-select-option>
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="2">女</a-select-option>
            </a-select>
          </a-form-item>
        </td>
        <td>年龄要求</td>
        <td>
          <a-form-item>
            <a-input :disabled="isDisabled"  v-decorator="['needAge', { rules: [{ required: false, message: '请输入年龄要求' }] }]" />
          </a-form-item>
        </td>
      </tr>

      <tr>
        <td>学历要求</td>
        <td>
          <a-form-item >
            <a-select :disabled="isDisabled"  v-decorator="['educationId',{rules: [{required: false,message: '选择学历要求'}]}]" placeholder="选择学历要求">
              <a-select-option v-for="(item, index) in education" :key="index" :value="item.id">{{item.text}}</a-select-option>
            </a-select>
          </a-form-item>
        </td>
        <td>专业</td>
        <td>
          <a-form-item>
            <a-input :disabled="isDisabled"  v-decorator="['major',{rules: [{required: false,message: '输入专业'}]}]" placeholder="输入专业"/>
          </a-form-item>
        </td>
      </tr>

      <tr>
        <td>婚姻状态</td>
        <td>
          <a-form-item >
            <a-select :disabled="isDisabled"  placeholder="选择婚姻状态" v-decorator="['maritalStatus',{initialValue:0,rules: [{required: false,message: '选择婚姻状态'}]}]">
              <a-select-option :value="0">未婚</a-select-option>
              <a-select-option :value="1">已婚</a-select-option>
              <a-select-option :value="2">不限</a-select-option>
            </a-select>
          </a-form-item>
        </td>
        <td>生育状态</td>
        <td>
          <a-form-item >
            <a-select :disabled="isDisabled"  placeholder="选择生育状态" v-decorator="['fertilityStatus',{initialValue:0,rules: [{required: false,message: '选择生育状态'}]}]">
              <a-select-option :value="0">未育</a-select-option>
              <a-select-option :value="1">已育</a-select-option>
              <a-select-option :value="2">不限</a-select-option>
            </a-select>
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>建议薪资</td>
        <td>
          <a-form-item>
            <!-- <a-input :disabled="isDisabled"  v-decorator="['salary',{rules: [{required: false,message: '输入建议薪资'}]}]" placeholder="输入建议薪资"/> -->
            <!-- <a-input-number style="width:100%;" :disabled="isDisabled" :min="0" :step="0.01" :precision=2 v-decorator="['salary', { rules: [{ required: true, message: '输入建议薪资(元)' }] }]"/> -->
            <a-input style="width:100%;" :disabled="isDisabled" v-decorator="['salary', { rules: [{ required: true, message: '输入建议薪资(元)' }] }]"/>
          </a-form-item>
        </td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>公司内部有无合适人员</td>
        <td>
          <a-form-item >
            <a-select :disabled="isDisabled"  placeholder="公司内部有无合适人员" @change="haveInnerFlagChange" v-decorator="['haveInnerFlag',{initialValue:0,rules: [{required: false,message: '公司内部有无合适人员'}]}]">
              <a-select-option :value="0">无</a-select-option>
              <a-select-option :value="1">有</a-select-option>
            </a-select>
          </a-form-item>
        </td>
        <td>人员名称</td>
        <td>
            <a-form-item >
              <a-input :disabled="haveInnerFlag != 1 || isView" placeholder="选择人员名称" read-only style="cursor: pointer;" @click="openSystemUsers('innerName')"  v-decorator="['innerName']" />
            </a-form-item>
            <a-form-item>
              <a-input hidden v-decorator="['innerId']" />
            </a-form-item>
        </td>
      </tr>





      <tr>
        <td>任职资格要求(技能/经验)</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isDisabled" 
              placeholder="任职资格要求(技能/经验)" 
              :rows="3" 
              v-decorator="['qualification', { rules: [{ required: false, message: '任职资格要求(技能/经验)' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>职位分析</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isDisabled" 
              placeholder="职位分析" 
              :rows="3" 
              v-decorator="['positionAna', { rules: [{ required: false, message: '职位分析' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>增补理由</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isDisabled" 
              placeholder="增补理由" 
              :rows="3" 
              v-decorator="['advertReason', { rules: [{ required: false, message: '增补理由' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>紧急程度</td>
        <td colspan="3">
          <a-form-item >
            <a-select :disabled="isDisabled" placeholder="紧急程度" v-decorator="['emergentLevel',{initialValue:1,rules: [{required: false,message: '紧急程度'}]}]">
              <a-select-option :value="0">加急</a-select-option>
              <a-select-option :value="1">急</a-select-option>
              <a-select-option :value="2">人才储备</a-select-option>
            </a-select>
          </a-form-item>
        </td>
      </tr>
    </table>
    <a-form-item>
      <a-input hidden v-decorator="['instanceId']" />
    </a-form-item>
    <SystemUserSelect ref="systemUserSelect" @selectSystemUsers="selectSystemUsers" />
  </a-form>
  <Approval ref="approval" @opinionChange="opinionChange" />
  </a-spin>
  </a-modal>
</template>

<script>
import {getDictionaryList} from '@/api/workBox'
import {
  addPersonAdvertInfo, //招聘申请的新增或修改
  approvePersonAdvertInfo, //审批
  deleteOrag, //删除部门或者岗位信息
  getDepartmentList, //查询部门列表
  getPersonAdvertInfoDetail, //查询招聘申请详情信息
  getStationExplain,//查询岗位在职资格说明
  getStationPersonNum, //查询岗位在职人数
  personnelFullMemberApply_GetDepartmentList,
  personnelFullMemberApply_GetStationList
} from '@/api/personnelManagement'

import { getParentStationList ,getSelectLevelList} from '@/api/systemSetting'

import SystemUserSelect from '@/components/CustomerList/SystemUserSelect'
import moment from 'moment' 
import Approval from './Approval'
export default {
  name:'AddForm',
  components:{
    SystemUserSelect:SystemUserSelect,
    Approval:Approval
  },
  data(){
    return {
      education:[],
      depSelectDataSource:[],
      postSelectDataSource:[],
      depID:undefined,
      postID:undefined,
      addDepSelectDataSource:[],
      addPostSelectDataSource:[],
      levelList:[], //岗位等级
      form: this.$form.createForm(this, { name: 'ToolPostExplainForm' }),
      visible:false,
      actionType:'add',
      toolPostExplainId:null,
      settingStationNum:0,
      currentStationNum:0,
      haveInnerFlag:0,
      isAddDepartment:false,
      isAddStation:false,
      opinion:'', //审批意见
      spinning:false
    }
  },
  computed:{
    modalTitle(){
      let m = {
        'view':'查看',
        'add':'新增',
        'edit' : '修改',
        'approval':'审批'
      }
      return `${m[this.actionType]}招聘申请`
    },
    isView(){
      return this.actionType === 'view'
    },
    isAdd(){
      return this.actionType === 'add'
    },
    isEdit(){
      return this.actionType === 'edit'
    },
    isApproval(){
      return this.actionType === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    }
  },
  methods:{
    moment:moment,
    init(){
      let that = this
      return Promise.all([
        personnelFullMemberApply_GetDepartmentList({adverInfoId:that.record.id}).then(res =>{
          that.depSelectDataSource = res.data
          that.addDepSelectDataSource = res.data.map(item =>{
            return Object.assign({},item)
          })
        }), //部门
        getDictionaryList({parentId:1}).then(res =>that.education = res.data),//学历
        getSelectLevelList().then(res =>that.levelList = res.data)
      ])
    },
    depChangeHandler(dep_id){
      let that = this
      that.depID = dep_id
      //重置岗位
      that.postSelectDataSource = []
      that.form.resetFields(['stationId'])
      that.isAddStation = false
      that.settingStationNum = 0
      that.currentStationNum = 0

      that.isAddDepartment = dep_id === 'add' ? true : false
      if(that.isAddDepartment) {
        that.addPostSelectDataSource = []
        return 
      } 
      
      return personnelFullMemberApply_GetStationList({adverInfoId:that.record.id,departmentId:dep_id}).then(res =>{
        that.postSelectDataSource = res.data
        that.addPostSelectDataSource = res.data.map(item => Object.assign({},item))
      })
    },
    stationChangeHandler(stationId){
      let that = this
      that.postID = stationId
      // if(stationId === 'add' && (that.isAddDepartment || that.depID === undefined)){
      //   that.$message.info('您还没有选择部门')
      //   that.$nextTick(() =>{
      //     that.form.resetFields(['stationId'])
      //     that.isAddStation = false
      //     that.settingStationNum = 0
      //     that.currentStationNum = 0
      //   })
      //   return
      // }
      that.isAddStation = stationId === 'add' ? true : false
      if(that.isAddStation) {
        if(that.addPostSelectDataSource.length === 0){ 
          that.$nextTick(() => that.form.setFieldsValue({'station.parentId':undefined}))
        }
        return 
      }
      getStationPersonNum({stationId:stationId}).then(res =>{
        let data = res.data
        that.settingStationNum = data.stationSetNum || 0
        that.currentStationNum = data.stationNum || 0 
        
      })

      getStationExplain({stationId:stationId}).then(res =>{
        let qualification = (res && res.data && res.data.qualification) || ''
        that.$nextTick(() => that.form.setFieldsValue({'qualification':qualification}))
      })
    },
    addDepChangeHandler(dep_id){
      let that = this
      return personnelFullMemberApply_GetStationList({adverInfoId:that.record.id,departmentId:dep_id}).then(res =>{
        that.addPostSelectDataSource = res.data.map(item => Object.assign({},item))
      })
    },
    addStationChangeHandler(stationId){
      let that = this
      getStationPersonNum({stationId:stationId}).then(res =>{
        let data = res.data
        that.settingStationNum = data.stationSetNum || 0
        that.currentStationNum = data.stationNum || 0
      })
    },
    async handleOk(){
      let that = this
      if(that.isView || that.isApproval){
        that.handleCancel()
        return 
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          if(that.isEdit){
            values.id = that.record.id
          }
          if(that.isAddDepartment){
            delete values.departmentId
          }else{
            delete values.department
          }
          if(that.isAddStation){
            delete values.stationId
          }else{
            delete values.station
          }
          
          //婚育情况   组合一起处理
          // let _fertility_marital_Status = values.fertility_marital_Status
          // if(_fertility_marital_Status !== null){
          //   if(String(_fertility_marital_Status).length === 1){
          //     _fertility_marital_Status = '0'+_fertility_marital_Status
          //   }
          //   let _res = _fertility_marital_Status.split('')
          //   values.maritalStatus = _res[0] //结婚情况
          //   values.fertilityStatus = _res[1] //生育情况
          //   delete values.fertility_marital_Status
          // }

          values.dutyDate = values.dutyDate.format("YYYY-MM-DD")
          console.log('Received values of form: ', values)
          that.spinning = true
          addPersonAdvertInfo(values).then(res =>{
            that.spinning = false
            if(res.code === 200){
              that.visible = false 
              that.$message.success('操作成功')

              that.$emit('finish')
            }else{
              that.$message.warning(res.msg)
            }
          })
          .catch(err => {
            that.spinning = false
            that.$message.error('操作失败')
          })
        }
      });
    },
    haveInnerFlagChange(flag){
      this.haveInnerFlag = flag
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    openSystemUsers(decoratorKey){
      this.$refs.systemUserSelect.query(decoratorKey)
    },
    selectSystemUsers({decoratorKey,record}){
      console.log(decoratorKey,record)
      if(record){
        if(decoratorKey === 'innerName'){
          this.form.setFieldsValue({
            'innerId':record.id,
            'innerName':record.trueName
          })
        }

        if(decoratorKey === 'department.leaderName'){
          this.form.setFieldsValue({
            'department.leader':record.id,
            'department.leaderName':record.trueName
          })
        }
      }
    },
    async query(type,record){
      //debugger
      
      let that = this
      that.actionType = type 
      that.record = record || {}
      that.form.resetFields()

      that.settingStationNum = 0
      that.currentStationNum = 0
      that.haveInnerFlag = 0
      that.isAddDepartment = false
      that.isAddStation = false

      await that.init() 
      that.visible = true

      that.$nextTick(() =>console.log(that.form.getFieldsValue()))
      if(that.isAdd) return 
      getPersonAdvertInfoDetail({advertId:that.record.id}).then(res =>{
        console.log(res)
        let data = Object.assign({},res.data)
        let stationId = data.stationId
        delete data.stationId

        data.dutyDate = that.moment(data.dutyDate)
        that.form.setFieldsValue(data)

        personnelFullMemberApply_GetStationList({adverInfoId:that.record.id,departmentId:data.departmentId}).then(res =>{
          that.postSelectDataSource = res.data
          that.addPostSelectDataSource = res.data.map(item => Object.assign({},item))
          that.form.setFieldsValue({stationId:stationId})

          getStationPersonNum({stationId:stationId}).then(res =>{
            let data = res.data
            that.settingStationNum = data.stationSetNum || 0
            that.currentStationNum = data.stationNum || 0
          })
        })
        
      })
    },
    submitAction(opt){
      let that = this
      let values = {
        approveId:that.record.id,
        isAdopt:opt.isAdopt,
        opinion:opt.opinion
      }
      that.spinning = true
      approvePersonAdvertInfo(values).then(res =>{
        that.spinning = false
        console.log(res)
        that.form.resetFields() // 清空表
        that.visible = false 
        that.$message.info(res.msg)
        that.$emit('finish')
      }).catch(err =>that.spinning = false)
    },
    passAction(){
      this.submitAction({
        isAdopt:0,
        opinion:'通过'
      })
    },
    noPassAction(){
      let that = this
      //that.opinion = ''
      that.$refs.approval.query()
    },
    opinionChange(opinion){ //审批意见
      this.submitAction({
        isAdopt:1,
        opinion:opinion
      })
    },
  }
}
</script>

<style scoped>
.custom-table-border th,.custom-table-border td{
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item{
  margin-bottom: 0;
}


.add-form-wrapper >>> .custom-table{
  margin-bottom: 0;
}
.custom-table >>> .custom-table{
  margin: -1px;
}

/*
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "id": 3,
        "adverNum": "ZP2020021101",
        "departmentId": 3,
        "departmentName": "销售二部",
        "stationId": 82,
        "stationName": "销售助理",
        "needNum": 1,
        "stationNum": 0,
        "dutyDate": "2020-02-11 00:00:00.0",
        "needSex": 1,
        "needAge": "30",
        "educationId": 2,
        "major": "销售",
        "maritalStatus": null,
        "fertilityStatus": 1,
        "salary": 5000,
        "haveInnerFlag": 0,
        "innerId": null,
        "innerName": null,
        "qualification": "任职资格要求(技能/经验)1111",
        "positionAna": "职位分析111",
        "advertReason": "增补理由1111",
        "emergentLevel": 2,
        "instanceId": "1482501",
        "status": 0,
        "oragAddFlag": 0
    }
}

*/
</style>
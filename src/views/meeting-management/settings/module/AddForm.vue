<template>
  <a-modal
    :title="modalTitle"
    :width="850"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
  >

  <!-- <template slot="footer">
    <template v-if="isApproval && !isSelfApproval">
      <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
      <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
    </template>
    <template v-else>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">{{isSelfApproval ? '保存提交' : '确定'}}</a-button>
    </template>
  </template> -->


  <a-spin :spinning="spinning">
  <a-form :form="form" class="add-form-wrapper">
    <a-form-item hidden>
      <a-input v-decorator="['id']"/>
    </a-form-item>
    <table class="custom-table custom-table-border">
      <tr>
        <td>会议类别</td>
        <td>
          <a-form-item>
            <a-select 
              :disabled="isDisabled" 
              placeholder="选择会议类别"
              v-decorator="['typeDicId', { rules: [{ required: true, message: '选择会议类别' }] }]"
              :allowClear="true"
            >
              <a-select-option v-for="item in meetingTypesList" :key="item.id" :value="item.id" >
                {{item.text}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </td>
        <td>会议部门</td>
        <td>
          <a-form-item>
            <a-select 
              :disabled="isDisabled" 
              placeholder="选择会议部门" 
              @change="depChange"
              v-decorator="['departmentId', { rules: [{ required: true, message: '选择会议部门' }] }]"
              :allowClear="true"
            >
              <a-select-option
                v-for="item in depList"
                :key="item.id"
                :value="item.id"
              >
                {{item.departmentName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>会议负责人</td>
        <td>
          <a-form-item>
            <a-input 
              placeholder="选择人员" 
              :disabled="isDisabled" 
              read-only 
              @click="openSystemUsers('chargePersonName')" 
              v-decorator="['chargePersonName', { rules: [{ required: true, message: '选择人员' }] }]"
            />
            <a-input hidden v-decorator="['chargePersonId']"/>
          </a-form-item>
        </td>
        <td>会议名称</td>
        <td>
          <a-form-item>
            <a-input 
              placeholder="会议名称" 
              :disabled="isDisabled" 
              v-decorator="['name', { rules: [{ required: true, message: '请输入会议名称' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <td>会议周期</td>
        <td>
          <a-form-item>
            <a-select
              placeholder="选择会议周期"
              :disabled="isDisabled" 
              @change="meetingCycleChange"
              v-decorator="['period', { rules: [{ required: true, message: '选择会议周期' }] }]"
              :allowClear="true"
            >
              <a-select-option :value="1">周循环</a-select-option>
              <a-select-option :value="2">月循环</a-select-option>
              <a-select-option :value="3">季循环</a-select-option>
              <a-select-option :value="4">年循环</a-select-option>
            </a-select>
          </a-form-item>
        </td>
        <td>会议时间</td>
        <td>
          <div class="meeting-date-wrapper" style="display:flex;">
              <a-form-item v-show="meetingCycle === 4">
                <a-select style="width:100px;" :disabled="isDisabled"  v-decorator="['monthRepeat', { rules: [{ required: meetingCycle === 4, message: '选择时间' }] }]">
                  <a-select-option v-for="(item,index) in monthLoop" :key="index" :value="index + 1">{{item}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <span style="margin:0 5px;"></span>
              </a-form-item>
              <a-form-item>
                <a-select style="width:100px;" :disabled="isDisabled"  v-decorator="['beginRepeat', { rules: [{ required: true, message: '选择时间' }] }]">
                  <a-select-option v-for="(item,index) in meetingCycleList" :key="index" :value="index + 1" >{{item}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <span style="margin:0 7px;">至</span>
              </a-form-item>
              <a-form-item>
                <a-select style="width:100px;" :disabled="isDisabled"  v-decorator="['endRepeat', { rules: [{ required: true, message: '选择时间' }] }]">
                  <a-select-option v-for="(item,index) in meetingCycleList" :key="index" :value="index + 1">{{item}}</a-select-option>
                </a-select>
              </a-form-item>
          </div>
        </td>
      </tr>
      <tr>
        <td>是否有考核</td>
        <td colspan="3">
          <a-form-item>
            <a-radio-group :disabled="isDisabled" v-decorator="['checkFlag',{initialValue: 0}]">
              <a-radio :value="1">有</a-radio>
              <a-radio :value="0">无</a-radio>
            </a-radio-group>
          </a-form-item>
        </td>
      </tr>
    </table>
  </a-form>
  <SystemUserSelect ref="systemUserSelect" @selectSystemUsers="selectSystemUsers" />
  </a-spin>
  </a-modal>
</template>

<script>
import {
  departmentList,//所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
//查询部门主管
import {getPositionManager } from '@/api/personnelManagement' 
import { getDictionaryList } from '@/api/workBox'
import { meetingSetDetail,meetingSetSaveOrUpdate } from '@/api/meetingManagement'
import moment from 'moment' 
import SystemUserSelect from '@/components/CustomerList/SystemUserSelect' 

function range(start,end,step=1,suffix=''){
  let i = start,len = end
  let res = []
  for(;i <= len;i+=step){
    res.push(i+''+suffix)
  }
  return res
}

export default {
  name:'AddForm',
  components:{
    SystemUserSelect:SystemUserSelect
  },
  data(){
    return {
      meetingTypesList:[],
      depList:[],

      form: this.$form.createForm(this),
      visible:false,
      actionType:'add',
      
      spinning:false,
      dayLoop:range(1,31,1,'号'),
      weekLoop:['周一','周二','周三','周四','周五','周六','周日'],
      monthLoop:range(1,12,1,'月'),
      meetingCycle:undefined
    }
  },
  computed:{
    modalTitle(){
      let m = {'view':'查看','add':'新增','edit' : '修改','approval':'审批'}
      return `${m[this.actionType]}`
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
    isDisabled(){ //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
    meetingCycleList(){
      if(this.meetingCycle === 1){
        return this.weekLoop
      }
      return this.dayLoop
    }
  },
  methods:{
    moment:moment,
    init(){
      let that = this
      return Promise.all([
        departmentList().then(res =>that.depList = res.data), //部门
        getDictionaryList({parentId:498}).then(res =>that.meetingTypesList = res.data) 
      ])
    },
    async handleOk(){
      let that = this
      if(that.isView || that.isApproval){
        that.handleCancel()
        return 
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          //提交
          if(+values.beginRepeat > +values.endRepeat){
            that.$message.info('会议时间设置不正确')
            return 
          }
          that.spinning = true
          console.log(values)
          meetingSetSaveOrUpdate(values).then(res =>{
            that.spinning = false
            console.log(res)
            that.form.resetFields() // 清空表
            that.visible = false 
            that.$message.info(res.msg)
            that.$emit('finish')
          }).catch(err => that.spinning = false)
        }
      })
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    async query(type,record){
      let that = this
      that.visible = true
      that.actionType = type 
      that.record = record || {}
      await that.form.resetFields() 
      that.meetingCycle = undefined
      await that.init() 
      if(type === 'add') return 
      //填充数据
      meetingSetDetail({id:that.record.id})
        .then(res =>{
          that.meetingCycle = +res.data.period
          that.$nextTick(() => that.form.setFieldsValue(Object.assign({},res.data)))
        })
        .catch(err => null)
    },
    selectSystemUsers({decoratorKey,record}){
      let that = this
      console.log(decoratorKey,record)
      if(record){
        that.form.setFieldsValue({
          chargePersonId:record.id,
          chargePersonName:record.trueName
        })
      }
    },
    openSystemUsers(decoratorKey){
      this.$refs.systemUserSelect.query(decoratorKey)
    },

    resetValues(){
      let that = this
      
    },
    depChange(dep_id){
      let that = this
      getPositionManager({departmentId:dep_id}).then(res =>{
        //console.log(res)
        that.form.setFieldsValue({
          chargePersonId: res.data.id,
          chargePersonName: res.data.trueName
        })
      })
    },
    meetingCycleChange(cycle){
      this.meetingCycle = +cycle
      this.$nextTick(() => this.form.setFieldsValue({
        beginRepeat:undefined,
        endRepeat:undefined,
        monthRepeat:undefined
      }))
    }
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

</style>
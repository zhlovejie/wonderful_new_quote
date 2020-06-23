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
        <a-button key="back" icon="close" @click="noPassAction" >不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline"  class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]"/>
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:120px;">考勤组名称</td>
            <td>
              <a-form-item>
                <a-input v-if="isAdd" v-decorator="['attanceName',{initialValue:detail.attanceName,rules: [{required: true,message: '输入考勤组名称'}]}]" :allowClear="true"/>
                <span v-else>{{detail.attanceName}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">班次</td>
            <td>
              <a-form-item>
                <a-select 
                  v-if="isAdd || isEdit"
                  placeholder="班次"
                  v-decorator="['classId',{initialValue:detail.classId || (banciList.length ? banciList[0].id : undefined),rules: [{required: true,message: '请选择班次'}]}]"
                  :allowClear="true" 
                  style="width:150px;"
                >
                  <a-select-option v-for="item in banciList" :key="item.id" :value="item.id">{{item.className}}</a-select-option>
                </a-select>

                <span v-else>{{detail.className || '-'}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">考勤类型</td>
            <td>
              <a-form-item>
                <span>按</span>
                <a-select 
                  v-if="isAdd || isEdit"
                  placeholder="考勤类型"
                  v-decorator="['attanceType',{initialValue:detail.attanceType,rules: [{required: true,message: '请考勤类型'}]}]"
                  :allowClear="true" 
                  style="width:120px;margin:0 10px;" 
                  @change="attanceTypeChange"
                >
                  <a-select-option :value="1">固定班制</a-select-option>
                  <a-select-option :value="2">排班制</a-select-option>
                  <a-select-option :value="3">自由工时</a-select-option>
                </a-select>
                <span v-else>
                  【{{ {1:'固定班制',2:'排班制',3:'自由工时'}[detail.attanceType] }}】
                </span>
                <span>计为调休时长</span>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="isFixedClass">
            <td style="width:120px;">工作日设置</td>
            <td>
              <a-form-item>
                <a-select 
                  v-if="isAdd || isEdit"
                  placeholder="选择最小加班单位"
                  v-decorator="['workDays',{initialValue:detail.workDays,rules: [{required: true,message: '请选择最小加班单位'}]}]"
                  :allowClear="true" 
                  mode="multiple"
                >
                  <a-select-option :value="1">周一</a-select-option>
                  <a-select-option :value="2">周二</a-select-option>
                  <a-select-option :value="3">周三</a-select-option>
                  <a-select-option :value="4">周四</a-select-option>
                  <a-select-option :value="5">周五</a-select-option>
                  <a-select-option :value="6">周六</a-select-option>
                  <a-select-option :value="7">周日</a-select-option>
                </a-select>
                <span v-else>{{workDaysFormat(detail.workDays)}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">加班时长处理</td>
            <td>
              <a-form-item>
                <a-select 
                  v-if="isAdd || isEdit"
                  style="width: 150px" 
                  placeholder="时长处理" 
                  v-decorator="['isFreeType',{initialValue:detail.isFreeType,rules: [{required: true,message: '请选择加班时长处理'}]}]"
                  :allowClear="true" 
                >
                  <a-select-option :value="0">不计入调休</a-select-option>
                  <a-select-option :value="1">计入调休</a-select-option>
                </a-select>
                <span v-else>{{{0:'不计入调休',1:'计入调休'}[detail.isFreeType]}}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">扣除规则</td>
            <td>
              <div style="display:flex;">
              <a-form-item>
                <a-select 
                  v-if="isAdd || isEdit"
                  style="width: 150px" 
                  placeholder="规则类型" 
                  v-decorator="['caculatorHousType',{initialValue:detail.caculatorHousType,rules: [{required: isFreeClass,message: '请选择规则类型'}]}]"
                  :allowClear="true" 
                >
                  <a-select-option :value="1">按月</a-select-option>
                  <a-select-option :value="2">按周</a-select-option>
                  <a-select-option :value="3">按日</a-select-option>
                </a-select>
                <span v-else>{{{1:'按月',2:'按周',3:'按日'}[detail.caculatorHousType]}}</span>
                
              </a-form-item>
              <a-form-item>
                <span style="margin:0 10px;">低于</span>
                <a-input-number 
                  v-if="isAdd || isEdit"
                  style="width:100px;margin:0 10px;"
                  :min="0"
                  :step="1"
                  v-decorator="['caculatorHous', {initialValue:detail.caculatorHous,rules: [{ required: isFreeClass, message: '请输入限制时间' }]}]"
                />
                <span v-else>【{{detail.caculatorHous}}】</span>
                <span>小时</span>
              </a-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td style="width:120px;">考勤组人员</td>
            <td>
              <a-form-item>
                <a-tree-select 
                  v-if="isAdd || isEdit"
                  v-model="authoritySaveBoList"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '280px', overflow: 'auto' }"
                  :tree-data="treeData"
                  tree-checkable
                  :show-checked-strategy="SHOW_PARENT"
                  :load-data="onLoadData" 
                  @change="treeSelectChange"
                />
                <span v-else>{{detail.attanceUsers}}</span>
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
  getUserByDep //获取人员
} from '@/api/systemSetting'
import {
  classRuleList,
  attenceDutyRuleDetail , 
  attenceDutyRuleAddAndUpdate ,
  attenceChangeApproveApprove,
  attenceDutyRuleHaveRule
} from '@/api/attendanceManagement'
import { TreeSelect } from 'ant-design-vue'
import Approval from './Approval'
import moment from 'moment'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name:'over-time-rule-add',
  components:{Approval},
  data(){
    return {
      form: this.$form.createForm(this),
      visible:false,
      spinning:false,
      actionType:'view',
      detail:{},
      record:{},
      spinning:false,
      
      authoritySaveBoList: [],
      SHOW_PARENT,
      treeData: [],
      banciList:[],
      attanceType:undefined

    }
  },
  computed:{
    modalTitle(){
      let obj = {'view':'查看','add':'新增','edit':'修改','approval':'审批'}
      return `${obj[this.actionType]}出勤规则`
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
    isFixedClass(){
      return +this.attanceType === 1
    },
    isFreeClass(){
      return +this.attanceType === 3
    }
  },
  methods:{
    moment,
    init() {
      let that = this
      let queue = []
      let task1 = departmentList().then(res => {
        that.treeData = res.data.map(item => {
          let _uuid = uuid()
          return {
            id: item.id,
            key: _uuid,
            value: _uuid,
            title: item.departmentName,
            isLeaf: false
          }
        })
      })
      queue.push(task1)

      let task2 = classRuleList().then(res => {
        that.banciList = res.data.records.map((item, index) => {
          item.key = index + 1
          return item
        })
      }).catch(err =>{
        console.log(err)
        that.banciList = [{
          id:1,
          className:'test'
        }]
      })

      queue.push(task2)

      return Promise.all(queue)
    },
    async query(type,record){
      //debugger
      let that = this
      
      that.actionType = type,
      that.record = Object.assign({},record)
      that.detail = Object.assign({},record)
      that.form.resetFields()
      that.authoritySaveBoList = []
      await that.init()
      that.visible = true
      if(that.isAdd){
        that.detail = {}
        return
      }
      if(record){
        if(record.__detail){
          that.detail = {...record.__detail}
          that.attanceType = that.detail.attanceType
          return
        }
        attenceDutyRuleDetail({id:record.id}).then(res =>{
          //debugger
          that.detail = {...res.data}
          if(that.isEdit){
            if(that.detail.workDays){
              that.detail.workDays = that.detail.workDays.split(',').map(v =>+v)
            }else{
              that.detail.workDays = []  
            }
            //回显出勤人员
              let queue = []
              that.treeData.map(item => {
                queue.push(that.onLoadData({dataRef: {id: item.id,value: item.trueName}}))
              })
              Promise.all(queue).then(() =>{
                //debugger
                let result = []
                let userList = [...res.data.userList]
                let deps = userList.filter(item => +item.bindingType === 1).map(item => item.bindingId)
                let usrs = userList.filter(item => +item.bindingType === 2).map(item => item.bindingId)
                let target_deps = that.treeData.filter(item => deps.includes(item.id)).map(item => item.value)
                let allUsers = that.flatten(that.treeData.map(item => [...item.children]))
                let target_usrs = allUsers.filter(item =>usrs.includes(item.id)).map(item => item.value)
                that.authoritySaveBoList = [...target_deps,...target_usrs]
              })
            //回显出勤人员 END
          }
          that.attanceType = that.detail.attanceType
          console.log(res)
        })
      }
    },
    handleSubmit(){
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          let _auth = that.makeAuth()
          if(_auth.length === 0 && that.isAdd){
            that.$message.info('请选择考勤组人员')
            return
          }
          console.log(_auth)
          if(that.isAdd || that.isEdit){
            let userList = []
            _auth.map(item =>{
              if(item.users.length === 0){
                userList.push({
                  bindingId:item.departmentId,
                  bindingType:1,
                  attanceId:that.detail.id
                })
              }else{
                item.users.split(',').map(u =>{
                  userList.push({
                    bindingId:u,
                    bindingType:2,
                    attanceId:that.detail.id
                  })
                })
              }
            })
            values.userList = userList
          }
          values.classId = values.classId || that.detail.classId
          values.workDays = Array.isArray(values.workDays) ? values.workDays.join(',') : ''

          console.log('Received values of form: ', values)
          that.spinning = true 

          attenceDutyRuleAddAndUpdate(values).then(res =>{
            that.$message.info(res.msg)
            that.spinning = false
            that.handleCancel()
            that.$emit('finish')
          }).catch(err =>{
            that.spinning = false
          })
        }
      })
    },
    handleCancel(){
      this.form.resetFields()
      this.$nextTick(() =>this.visible = false)
    },
    onLoadData(treeNode) {
      let that = this
      let { id, value } = treeNode.dataRef
      let treeData = [...that.treeData]
      let target = treeData.find(item => item.id === id)
      if (target.children) {
        return
      }
      if (target) {
        return getUserByDep({ departmentId: id }).then(res => {
          target.children = res.data.map(item => {
            let _uuid = uuid()
            return {
              id: item.id,
              key: _uuid,
              parentId: id,
              parentValue: value,
              value: _uuid,
              title: item.trueName,
              isLeaf: true
            }
          })
          that.treeData = [...treeData]
        })
      }
      return Promise.resolve([])
    },
    attanceTypeChange(v){
      this.attanceType = v
    },
    makeAuth() {
      let result = []
      let authoritySaveBoList = [...this.authoritySaveBoList]
      let nodes = this.treeData.map(item => {
        return { id: item.id, value: item.value }
      })

      let selectNodes = [], //选中的父节点列表
        selectLeafs = [] //选中的子节点列表
      authoritySaveBoList.map(v => {
        let target = nodes.find(n => n.value === v)
        if (target) {
          selectNodes.push(Object.assign({}, target))
        }
      })

      //let leafs = this.treeData.map(item => item.children || []).flat(3)
      let leafs = this.flatten(this.treeData.map(item => item.children || []))
      authoritySaveBoList.map(v => {
        let target = leafs.find(n => n.value === v)
        if (target) {
          selectLeafs.push(Object.assign({}, target))
          //选中子节点后并不包括父节点，这里加上父节点
          if (!selectNodes.find(n => n.value === target.parentValue)) {
            selectNodes.push({ id: target.parentId, value: target.parentValue })
          }
        }
      })

      selectNodes.map(item => {
        //父节点对应的子节点
        let _leafs = selectLeafs
          .filter(l => l.parentId === item.id)
          .map(item => item.id)
          .join(',')
        result.push({
          departmentId: +item.id, //部门
          users: _leafs //人员字符串
        })
      })
      return result
    },
    flatten(array) {
      var flattend = [];
      (function flat(array) {
        array.forEach(function(el) {
          if (Array.isArray(el)) flat(el);
          else flattend.push(el);
        });
      })(array);
      return flattend;
    },
    workDaysFormat(strs){
      let w = ['','周一','周二','周三','周四','周五','周六','周日']
      let str = ''
      return strs.split(',').map(s =>w[s]).join(',')
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.approvalId })
      that.spinning = true
      attenceChangeApproveApprove(values)
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
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    },
    treeSelectChange(value, label, extra){
      //console.log(arguments)
      let that = this
      //根据绑定类型和绑定的id判断该id是否已经有了出勤规则
      if(extra.checked === true){
        let {dataRef} = extra.triggerNode
        let values = {
          id:dataRef.id,
          type:dataRef.isLeaf ? 2 : 1
        }
        attenceDutyRuleHaveRule(values).then(res =>{
          //console.log(res)
          if(+res.code !== 200){
            that.$message.info(res.msg)
            that.authoritySaveBoList = that.authoritySaveBoList.filter(k => k !== dataRef.value)
          }
          //console.log(that.authoritySaveBoList)
        }).catch(err =>that.$message.error(err))
      }else{
        //console.log(that.authoritySaveBoList)
      }
      
    }
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item{
  display:flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label{
  width:80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper{
  flex:1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  text-align: left;
}
</style>
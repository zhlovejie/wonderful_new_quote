<template>

  <a-spin :spinning="spinning">

  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    class="routine-addform-wrapper-baseInnerData"
  >
    <h3>处理结果</h3>
    <table class="custom-table custom-table-border">
      <tbody>
        <tr>
          <td style="width:150px;">
            <span >原因归属</span>
          </td>
          <td>
            <a-form-model-item prop="reason">
              <CommonDictionarySelect
                v-if="!isDisabled"
                placeholder="原因归属"
                style="width: 100%;"
                :text="'售后原因归属'"
                :dictionaryId.sync="form.reason"
                @selected="handlerExceptionTypeChange"
              />
              <span v-else>{{form.reasonDicName}}</span>
            </a-form-model-item>
          </td>
        </tr>
        <tr>
          <td style="width:150px;">
            <span class="icon-required">异常原因分析</span>
          </td>
          <td >
            <a-form-model-item prop="analyse" >
              <a-textarea v-if="!isDisabled" placeholder="异常原因分析" allow-clear autoSize  v-model="form.analyse" />
              <span v-else> {{form.analyse}}</span>
            </a-form-model-item>
          </td>
        </tr>
        <tr>
          <td style="width:150px;">
            <span class="icon-required">围堵措施</span>
          </td>
          <td >
            <a-form-model-item prop="measure" >
              <a-textarea v-if="!isDisabled" placeholder="围堵措施" allow-clear autoSize  v-model="form.measure" />
              <span v-else> {{form.measure}}</span>
            </a-form-model-item>
          </td>
        </tr>
        <tr>
          <td style="width:150px;">
            <span class="icon-required">纠正方案</span>
          </td>
          <td >
            <a-form-model-item prop="scheme" >
              <a-textarea v-if="!isDisabled" placeholder="纠正方案" allow-clear autoSize  v-model="form.scheme" />
              <span v-else> {{form.scheme}}</span>
            </a-form-model-item>
          </td>
        </tr>

        <tr>
          <td style="width:150px;">
            <span class="icon-required">预计完善时间</span>
          </td>
          <td>
            <a-form-model-item prop="finishDate" >
              <a-date-picker v-if="!isDisabled"  style="width: 100%;" v-model="form.finishDate" />
              <span v-else>{{ form.finishDate }}</span>
            </a-form-model-item>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>责任判定</h3>

    <p v-if="!isDisabled">
      <a-select
        style="width:200px;"
        placeholder="选择部门"
        v-model="depId"
        @change="e => depChangeHandler(e)"
      >
        <a-select-option
          v-for="item in depList"
          :key="item.id"
          :value="item.id"
        >{{item.departmentName}}</a-select-option>
      </a-select>

      <a-select
        style="width:450px;margin:0 10px;"
        placeholder="选择人员"
        mode="multiple"
        v-model="users"
      >
        <a-select-option
          v-for="item in userList"
          :key="item.id"
          :value="item.id"
        >{{item.trueName}}</a-select-option>
      </a-select>

      <a-button type="primary" @click="moneyListAction('add')">添加</a-button>
    </p>
    <table class="custom-table custom-table-border">
      <tbody>
        <tr>
          <th>序号</th>
          <th>责任人</th>
          <th>处罚金额</th>
          <th>原因</th>
          <th v-if="!isDisabled">操作</th>
        </tr>
        <tr v-for="(item,idx) in form.responsibilityList" :key="item.key">
          <td>{{idx + 1}}</td>
          <td>{{item.userName}}</td>
          <td>
            <a-form-model-item
              :prop="'responsibilityList.' + idx + '.penalty'"
              :rules="{
                required: true,
                message: '请输入罚款金额',
                trigger: 'blur',
              }"
            >
              <a-input-number
                v-if="!isDisabled"
                v-model="item.penalty"
                style="width:120px;"
                :min="0"
                :max="1000000000"
                :step="1"
                :precision="2"
              />
              <span v-else>{{item.penalty | moneyFormatNumber}}</span>
            </a-form-model-item>
          </td>
          <td>
            <a-form-model-item >
              <a-textarea
               v-if="!isDisabled"
               placeholder="纠正方案"
               allow-clear
               autoSize
               v-model="item.reason"
               :prop="'responsibilityList.' + idx + '.reason'"
                :rules="{
                  required: true,
                  message: '请输入纠正方案',
                  trigger: 'blur',
                }"
              />
              <span v-else> {{form.reason}}</span>
            </a-form-model-item>
          </td>
          <td v-if="!isDisabled">
            <a href="javascript:void(0);" @click="moneyListAction('remove',item.key)">删除</a>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="isHandle" style="text-align:center;">
      <a-button key="cancel" @click="() => handleCancel()">取消</a-button>
      <a-button style="margin:0 10px;" key="save" type='primary' :loading="spinning" @click="() => handleSubmit(1)">保存</a-button>
      <a-button key="submit" type='primary' :loading="spinning" @click="() => handleSubmit(2)">提交审批</a-button>
    </p>
  </a-form-model>

  </a-spin>

</template>
<script>
import { getDictionary } from '@/api/common'
import CommonDictionarySelect from '@/components/CustomerList/CommonDictionarySelect'
import moment from 'moment'
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'
import {
  exceptionReportSaveAndUpdateDispose,
} from '@/api/after-sales-management-custom'

export default {
  name: 'handleExceptionForm',
  components:{
    CommonDictionarySelect,
  },
  inject:['actionForm'],
  props:{
    type:{
      type:String,
      default:'add'
    },
    detail:{
      type:Object,
      default: () => {}
    }
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        responsibilityList:[]
      },
      rules: {
        analyse:[
          { required: true, message: '请选择异常原因分析', trigger: 'change' }
        ],
        finishDate:[
          { required: true, message: '请选择预计完善时间', trigger: 'change' }
        ],
        measure:[
           { required: true, message: '请输入围堵措施', trigger: 'change' }
        ],
        scheme:[
          { required: true, message: '请输入纠正方案', trigger: 'change' }
        ],
        reason:[
          { required: true, message: '请选择原因归属', trigger: 'change' }
        ]
      },
      spinning:false,
      visible:false,

      depList: [],
      userList:[],
      depId:undefined,
      users:[]
    }
  },
  computed: {
    isAdd(){
      return this.type === 'add'
    },
    isEdit(){
      return this.type === 'edit'
    },
    isView(){
      return this.type === 'view'
    },
    isHandle(){
      return this.type === 'handle'
    },
    isApproval(){
      return this.type === 'approval'
    },
    isDisabled(){
      return this.isView || this.isApproval
    }
  },
  created() {
    this.initDepList()
  },
  watch:{
    detail:{
      handler(){
        this.query()
      },
      immediate:true
    }
  },
  methods: {
    query(){
      const that = this

      let responsibilityList = []
      if(that.detail && that.detail.departmentVoList){
        that.detail.departmentVoList.map(dep => {
          dep.responsibilityList && dep.responsibilityList.map(user => {
            user.userName = `${user.depName}/${user.userName}`
            responsibilityList.push({...user})
          })
        })
      }
      that.form = {...that.detail,responsibilityList}
      if(that.actionForm.isHandle){
        that.form = {...that.form,exceptionId:that.actionForm.detail.id}
      }
    },
    reset() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel(){
      const that = this
      that.form = {}
      that.visible = false
      that.$emit('finish')
    },
    handleSubmit(operationType){
      const that = this
      that.$refs['ruleForm'].validate(valid => {
        if (valid) {
          that.spinning = true
          let params = {...that.form,operationType}
          params.finishDate = params.finishDate.format('YYYY-MM-DD')
          exceptionReportSaveAndUpdateDispose(params).then(res => {
            that.spinning = false
            that.$message.info(res.msg)
            if(res.code === 200){
              that.$emit('finish')
              that.handleCancel()
            }
          }).catch(err => {
            that.spinning = false
            that.$message.error(err)
            that.$emit('finish')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    initDepList() {
      //部门  id,departmentName
      return departmentList().then(res => (this.depList = res.data))
    },
    initUserList(depId) {
      //人员 id,trueName
      if (!depId) {
        this.userList = []
        return
      }
      return getUserByDep({ departmentId: depId }).then(res => res.data)
    },
    handlerExceptionTypeChange(record){
      this.form = {
        ...this.form,
        reason:record.id,
        reasonDicName:record.text
      }
    },
    async depChangeHandler(depId) {
      const that = this
      const userList = await that.initUserList(depId)
      that.userList = userList
      that.users = []
    },
    moneyListAction(type,key){
      const that = this
      if(type === 'add'){
        let depItem = that.depList.find(item => item.id === that.depId)
        if(!depItem){
          return
        }
        let users = []
        that.users.map(userId => {
          let _u = that.userList.find(user => user.id === userId)
          if(_u){
            users.push({
              depId:depItem.id,
              userId:_u.id,
              userName:`${_u.departmentName}/${_u.trueName}`,
              penalty:0,
              reason:'',
              key:that._uuid()
            })
          }
        })

        let responsibilityList = [...(that.form.responsibilityList || [])]
        users.map(u => {
          if(!responsibilityList.find(user => user.userId === u.userId)){
            responsibilityList.push(u)
          }
        })

        that.form = {
          ...that.form,
          responsibilityList
        }
      }else if(type === 'remove'){
        let responsibilityList = [...(that.form.responsibilityList || [])]
        responsibilityList = responsibilityList.filter(item => item.key !== key)
        that.form = {
          ...this.form,
          responsibilityList
        }
      }
    }
  }
}
</script>

<style scoped>
.routine-addform-wrapper-baseInnerData >>> .ant-form-item {
  display: flex;
  margin: 0;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-label {
  width: auto;
  text-align: left;
}
.routine-addform-wrapper-baseInnerData >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px;
}
.custom-table-border caption {
  text-align: left;
}
.icon-required::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>

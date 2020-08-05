<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false" 
    :confirmLoading="spinning" 
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction">通过</a-button>
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
        <td>标题</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isDisabled" 
              placeholder="标题" 
              :rows="3" 
              v-decorator="['title', { rules: [{ required: false, message: '标题' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
             <tr>
        <td>消息</td>
        <td colspan="3">
          <a-form-item>
            <a-textarea 
              :disabled="isDisabled" 
              placeholder="消息" 
              :rows="3" 
              v-decorator="['content', { rules: [{ required: false, message: '消息' }] }]"
            />
          </a-form-item>
        </td>
      </tr>
                 <tr>
        <td>发布范围</td>
        <td colspan="3">
          <a-form-item>
          <a-checkbox-group v-decorator="['releaseRange']">
        <a-checkbox value="1">
          公告栏
        </a-checkbox>
        <a-checkbox value="2">
          app消息
        </a-checkbox>
        <a-checkbox value="3">
          短信通知
        </a-checkbox>
      </a-checkbox-group>
          </a-form-item>
        </td>
      </tr>
        <tr>
        <td>选择人员</td>
        <td colspan="3">
          <a-form-item>
              <a-tree-select
    v-model="depSelectDataSource"
    style="width: 100%"
    :tree-data="treeData"
    tree-checkable
    :show-checked-strategy="SHOW_PARENT"
    search-placeholder="Please select"
  />
          </a-form-item>
        </td>
      </tr>
      
    
        </table>
      </a-form>
      <!-- <Approval ref="approval" @opinionChange="opinionChange" /> -->
    </a-spin>
  </a-modal>
</template>
<script>
import {
  departmentList,//所有部门
} from '@/api/systemSetting'
// import moment from 'moment' 


// import Approval from './Approval'
import { TreeSelect } from 'ant-design-vue';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default {
  name:'BecomingForm',
  components:{
    // Approval:Approval
  },
  data(){
    return {
        value: [],
      treeData:[],
      depSelectDataSource:[],
      SHOW_PARENT,
      visible:false,
      spinning:false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type:'view',
      record:{},
      isModified:false  //财务人员为 true
    }
  },
  computed:{
    modalTitle(){
      if(this.isEditSalary){
        return '修改公告信息'
      }
      let txt = this.isView ? '查看' : (this.isEdit ? '修改' : '新增')
      return `${txt}公告信息`
    },
    isView(){
      return this.type === 'view'
    },
    isEdit(){
      return this.type === 'edit'
    },
    isApproval(){
      return this.type === 'approval'
    },
    isEditSalary(){
      return this.type === 'edit-salary'
    },
    disabled(){
      return this.isView || this.isApproval || this.isEditSalary
    },
      isDisabled(){
      return this.isView || this.isApproval
    }
  },
 watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'human_Resources_notice'){
          this.init()
        }
      },
      immediate:true
    }
  },
  methods:{
    init(){
      let that = this
      let queue = []
      let task1 = departmentList().then(res =>{
        that.treeData = res.data.map(item => {
          console.log(item.departmentName);
          return {
            id: item.id,
            key: item.id,
            value: item.id,
            title: item.departmentName,
            isLeaf: false
          }
        })
      })
      
      queue.push(task1)
      console.log(queue);
    
    },
    elementChange(key,val){
      console.log(val)
      this[key] = val
    },
    scoreChange(type,event){
      this[type] = parseInt(event,10)
    },
    // moment:moment,
    query(type,record){
      this.visible = true
      this.type = type 
      this.record = record

      // this.fillData()
    },
   
    handleOk(){
      console.log('你是要提交')
      // let that = this
      // if(that.isView){
      //   that.form.resetFields() // 清空表
      //   that.visible = false
      //   return 
      // }else if(that.isEdit){
      //   that.form.validateFields((err, values) => {
      //     if (!err) {
      //       debugger
      //       console.log('Received values of form: ', values)
      //       values.id = that.record.id
      //       //delete values.entryDate
      //       // values.fullMemberDay = this.moment(values.fullMemberDay)
      //       console.log('Received values of form: ', values)

      //       //提交状态 0 首次提交  1 驳回提交
      //       values.submitState = that.record.state === 0 ? 0 : 1
      //       that.spinning = true
      //       personnelFullMemberApply_Save(values).then(res =>{
      //         that.spinning = false
      //         console.log(res)
      //         that.form.resetFields() // 清空表
      //         that.visible = false 
      //         that.$message.info(res.msg)
      //         that.$emit('finish')
      //       }).catch(err =>that.spinning = false)
      //     }
      //   })
      // }else if(that.isEditSalary){
      //   that.updateUserBackCardSalary()
      // }
      // else{
      //   that.form.resetFields() // 清空表
      //   that.visible = false
      // }
      
    },
    handleCancel(){
      this.form.resetFields() // 清空表
      this.visible = false
    },
    submitAction(opt){
      let that = this
      let values = {
        id:that.record.id,
        isAdopt:opt.isAdopt,
        opinion:opt.opinion
      }
      that.spinning = true
      personnelFullMemberApply_Approval(values).then(res =>{
        that.spinning = false
        console.log(res)
        that.form.resetFields() // 清空表
        that.visible = false 
        that.$message.info(res.msg)
        that.$emit('finish')
      }).catch(err =>that.spinning = false)
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
  /*自定义table样式*/
  .custom-table{
    margin-bottom:0;
  }

  .custom-table-border th,.custom-table-border td{
    padding: 5px 10px;
  }

  .custom-table >>> .custom-table{
    position: relative;
    top: 0;
    left: 0;
    width: calc(100% + 2px);
    margin-bottom: -2px;
  }
  .custom-table >>> .custom-table td{
    text-align:left;
  }
  .becoming-form-wrapper >>> .ant-form-item{
    margin-bottom: 0;
  }

  .bank-card-list-wrapper{
    display: flex;
  }
  .bank-card-list-wrapper >>> .ant-form-item{
    display: flex;
    margin: 0 7px;
  }
</style>
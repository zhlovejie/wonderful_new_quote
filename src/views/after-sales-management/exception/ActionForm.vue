<template>
  <a-modal
      :title="modalTitle"
      :width="1000"
      :visible="visible"
      :destroyOnClose="true"
      :footer="null"
      @cancel="handleCancel"
      :maskClosable="false"
    >
    <a-spin :spinning="spinning">
      <template v-if="[0,2].includes((+record.status || 0))">
        <AddForm :type="type" :detail="detail" @finish="handleFinish"/>
      </template>

      <template v-else>
        <AddForm type="view" :detail="detail" />
        <HandleForm
          v-if="(+record.status === 1 && isHandle) ||  [3,4,5,6,7].includes((+record.status || 0))"
          :type="type"
          :detail="detail.reportDisposeVo || {}"
          @finish="handleFinish"
          ref="handleForm"
        />
      </template>
      <div v-if="isView && detail.approveOpinion">
        <h3>处理结果审批</h3>
        <p>审批意见：{{detail.approveOpinion}}</p>
      </div>
      <div v-if="isApproval">
      <p >
        <h3>审批意见</h3>
        <a-form-model
          ref="approvalForm"
          :model="approvalForm"
          :rules="approvalRules"
          class="approval-modal-form-wrapper"
        >
          <a-form-model-item
            prop="opinion"
          >
            <a-textarea
              placeholder="审批意见"
              :rows="2"
              v-model="approvalForm.opinion"
            />
          </a-form-model-item>
        </a-form-model>
      </p>
      <p style="text-align:center;">
        <a-button :loading="spinning" @click="noPassAction">不通过</a-button>
        <a-button type="primary" :loading="spinning" @click="passAction" style="margin:0 10px;">通过</a-button>
      </p>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import AddForm from './AddForm'
import HandleForm from './HandleForm'
import {
  exceptionReportApproval,
  exceptionReportDetail,
} from '@/api/after-sales-management-custom'
export default {
  components:{
    AddForm,
    HandleForm
  },
  provide(){
    return {
      actionForm:this
    }
  },
  data(){
    return {
      type:'add',
      record:{},
      visible:false,
      spinning:false,
      detail:{},
      approvalForm:{},
      approvalRules:{
        opinion: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
      }
    }
  },
  computed:{
    modalTitle() {
      let m = {'add':'新增','edit':'编辑','view':'查看','approval':'审批','handle':'处理'}
      return `${m[this.type]}异常信息`
    },
    isAdd(){
      return this.type === 'add'
    },
    isEdit(){
      return this.type === 'edit'
    },
    isView(){
      return this.type === 'view'
    },
    isApproval(){
      return this.type === 'approval'
    },
    isHandle(){
      return this.type === 'handle'
    },
    isDisabled(){
      return this.isView || this.isApproval
    }
  },
  methods:{
    query(type,record={}){
      const that = this
      that.type = type
      that.record = {...record}
      that.visible = true

      if(!that.isAdd){
        that.spinning = true
        exceptionReportDetail({id:that.record.id}).then(res => {
          that.spinning = false
          that.detail = {
            ...res.data,
            source:record.source,
            taskId:record.taskId
          }
        }).catch(err => {
          that.spinning = false
          that.$message.error(err)
        })
      }else{
        that.detail = {...record}
        if(that.detail.approveOpinion){
          that.approvalForm = {
            ...that.approvalForm,
            opinion:that.detail.approveOpinion
          }
        }else{
          that.approvalForm = {
            ...that.approvalForm,
            opinion:''
          }
        }
      }
    },
    handleCancel(){
      this.visible = false
    },
    handleFinish(){
      this.handleCancel()
      this.$emit('finish')
    },
    //审批
    submitAction(opt) {
      let that = this
      that.$refs['approvalForm'].validate(valid => {
        if (valid) {
          let responsibilitySaveBoList = []
          try{
            responsibilitySaveBoList = that.$refs.handleForm.form.responsibilityList
          }catch(err){
            console.log(err)
            responsibilitySaveBoList = []
          }
          let parms = {
            ...opt,
            opinion:that.approvalForm.opinion,
            responsibilitySaveBoList,
            approveId: that.record.id
          }
          that.spinning = true
          exceptionReportApproval(parms)
            .then((res) => {
              that.spinning = false
              that.visible = false
              that.$message.info(res.msg)
              that.handleFinish()
            })
            .catch((err) => (that.spinning = false))
        }else{}
      })
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      this.submitAction({isAdopt: 1,opinion: '不通过' })
    }
  }
}
</script>
<style scoped>

</style>

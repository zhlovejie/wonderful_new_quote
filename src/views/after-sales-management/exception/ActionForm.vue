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
        />
      </template>
      <div v-if="detail.approveOpinion">
        <h3>处理结果审批</h3>
        <p>审批意见：{{detail.approveOpinion}}</p>
      </div>
      <p v-if="isApproval" style="text-align:center;">
        <a-button :loading="spinning" @click="noPassAction">不通过</a-button>
        <a-button type="primary" :loading="spinning" @click="passAction" style="margin:0 10px;">通过</a-button>
      </p>
    </a-spin>
    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-modal>
</template>
<script>
import AddForm from './AddForm'
import HandleForm from './HandleForm'
import Approval from './Approval'
import {
  exceptionReportApproval,
  exceptionReportDetail,
} from '@/api/after-sales-management-custom'
export default {
  components:{
    AddForm,
    HandleForm,
    Approval
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
      detail:{}
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
          that.detail = res.data
        }).catch(err => {
          that.spinning = false
          that.$message.error(err)
        })
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
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      exceptionReportApproval(values)
        .then((res) => {
          that.spinning = false
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      this.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  }
}
</script>
<style scoped>

</style>

<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-steps :current="currentStep" :size="sizeStep" :status="currentStatus" @change="(e) => stepChange(e, null)">
        <a-step title="签订合同" />
        <a-step title="签订资质借用协议" />
        <a-step title="代签购货合同" />
        <a-step title="销售合同" />
        <a-step title="产品售后服务外包协议" />
      </a-steps>
      <template v-if="+currentStep === 0">
        <Step1 ref="step1" :action="{isView,isAdd}" :detail="{...record,...detail}"/>
      </template>
      

      <p v-if="isView" style="text-align:center;">
        <a-button :disabled="currentStep === 0" @click="(e) => stepChange(e, -1)">上一步</a-button>
        <a-button style="margin-left:10px;" :disabled="currentStep === 5" @click="(e) => stepChange(e, 1)">下一步</a-button>
      </p>
      
    </a-spin>
  </a-modal>
</template>

<script>
import Step1 from './steps/Step1'
import { 
  borrowDetail, 
  borrowCheckContract,
  borrowBindingAgencyContract, 
  borrowBindingSaleContract
} from '@/api/qualificationsBorrowManagement'

export default {
  name: 'qualifications-borrow-management-list-add',
  components:{
    Step1
  },
  data() {
    return {
      visible: false,
      actionType: 'add',
      spinning: false,
      currentStep: -1,
      currentStatus: 'process',
      sizeStep: 'small',
      record:{},
      detail:{}
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${m[this.actionType]}资质借用管理`
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
    },
  },
  methods: {
    async query(type, record={}) {
      let that = this
      that.actionType = type
      that.visible = true
      that.record = {...record}
      that.detail = {}
      if(that.isAdd){
        that.currentStep = 0
      }else{
        let res = await borrowDetail({id:that.record.id}).then(res =>res.data)
        that.detail = res
        that.currentStep = +that.record.status - 1
      }
    },
    stepChange(e, step) {
      console.log(arguments)
      if (step !== null) {
        let currentStep = this.currentStep + step
        this.currentStep = currentStep
      }
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped>
</style>
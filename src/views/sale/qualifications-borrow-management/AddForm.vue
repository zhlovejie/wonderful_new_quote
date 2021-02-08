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
        <Step1 ref="step1" :actionType="actionType" :record="record" />
      </template>
      <template v-if="+currentStep === 1">
        <Step2 ref="step2" :actionType="actionType" :record="record" />
      </template>

      <p v-if="isView" style="text-align: center">
        <a-button :disabled="currentStep === 0" @click="(e) => stepChange(e, -1)">上一步</a-button>
        <a-button style="margin-left: 10px" :disabled="currentStep >= maxStep" @click="(e) => stepChange(e, 1)"
          >下一步</a-button
        >
      </p>
    </a-spin>
  </a-modal>
</template>

<script>
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import {
  borrowDetail,
  borrowCheckContract,
  borrowBindingAgencyContract,
  borrowBindingSaleContract,
} from '@/api/qualificationsBorrowManagement'
//1 经销商合同 id
import { dealerContractDetail } from '@/api/qualificationsBorrowManagement'
//1 战略合作协议 id
import { cooperationProtocolDetail } from '@/api/qualificationsBorrowManagement'
//1 代理合同 id
import { agencyContractDetail } from '@/api/agencyContract'
//2 投标借用协议 id
import { bidDetailBorrowId } from '@/api/agencyContract'
//2 经营借用协议 id
import { businessDetailBorrowId } from '@/api/agencyContract'
//3 代签购物合同的详情 purchaseContractId
//接口地址 /purchase-contract/getPurchaseContractDetail
//4 销售合同 

//5 投标借用详情 id
import { afterdetail } from '@/api/agencyContract'

const __APIS__ = {
    '1-1':dealerContractDetail,
    '1-2':cooperationProtocolDetail,
    '1-3':agencyContractDetail,
    '2-1':bidDetailBorrowId,
    '2-2':businessDetailBorrowId,
    '3':null,
    '4':null,
    '5':afterdetail
  }

export default {
  name: 'qualifications-borrow-management-list-add',
  components: {
    Step1,
    Step2
  },
  data() {
    return {
      visible: false,
      actionType: 'add',
      spinning: false,
      currentStep: -1,
      currentStatus: 'process',
      sizeStep: 'small',
      maxStep:-1,
      record: {}
    }
  },
  computed: {
    modalTitle() {
      let m = { view: '查看', add: '新增', do: '处理', approval: '审批' }
      return `${m[this.actionType]}资质借用管理`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isDo() {
      return this.actionType === 'do'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView 
    },
  },
  methods: {
    async query(type, record = {}) {
      let that = this
      that.actionType = type
      that.visible = true
      that.record = { ...record }
      /*
        检测是否存在当前状态对应的合同
        存在状态和合同不统一的问题，前一个合同审批通过后，状态更新为下个状态节点，但新的状态节点对应的合同尚未创建。
      */
      let _isCreatedContract = await that.isCreatedContract(that.record.id)
      console.log(`_isCreatedContract:${_isCreatedContract}`)
      that.record = {...that.record,isCreatedContract:_isCreatedContract}
      //if()
      that.maxStep = +that.record.status - 1
      if(!_isCreatedContract){
        that.maxStep = that.maxStep - 1
      }

      if (that.isDo) {
        //let res = await borrowDetail({ id: that.record.id }).then((res) => res.data)
        that.currentStep = +that.record.status - 1
      } else {
        that.currentStep = 0
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
    async isCreatedContract(borrowId){
      let {status,type,contractProperty} = this.record
      let key = null
      if(status === 1){
        key = `${status}-${contractProperty}`
      }else if(status === 2){
        key = `${status}-${type}`
      }else{
        key = `${status}`
      }
      if(__APIS__[key]){
        let startWidth2 = key.startsWith('2')
        let res = await __APIS__[key](startWidth2 ? {id:borrowId} : {id:-1,borrowId}).then(res => res)
        //统一返回接口数据 
        return +res.code === 200 && res.data && res.data !== null
      }
      return null
    }
  },
}
</script>

<style scoped>
</style>
<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-steps :current="currentStep" :size="sizeStep" :status="currentStatus" @change="(e) => stepChange(e, null)">
        <a-step title="签订合同" />
        <a-step title="签订借用协议" />
        <a-step title="代签购货合同" />
        <a-step title="销售合同" />
        <a-step title="产品售后服务外包协议" />
      </a-steps>
      <template v-if="+currentStep === 0">
        <Step1 ref="step1" key="step1" :actionType="actionType" :record="record" @end="endHandler" />
      </template>
      <template v-else-if="+currentStep === 1">
        <Step2 ref="step2" key="step2" :actionType="actionType" :record="record" @end="endHandler" />
      </template>
      <template v-else-if="+currentStep === 2">
        <Step3 ref="step3" key="step3" :actionType="actionType" :record="record" @end="endHandler" />
      </template>
      <template v-else-if="+currentStep === 3">
        <Step4 ref="step4" key="step4" :actionType="actionType" :record="record" @end="endHandler" />
      </template>
      <template v-else-if="+currentStep === 4">
        <Step5 ref="step5" key="step5" :actionType="actionType" :record="record" @end="endHandler" />
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
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
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
import { getPurchaseContractDetailByBorrowId } from '@/api/contractListManagement'
//接口地址 /purchase-contract/getPurchaseContractDetail
//4 销售合同

//5 产品售后服务外包协议详情 id
import { afterDetailBorrowId } from '@/api/agencyContract'

/*
经销商合同 详情
/dealerContract/detail
status 状态：1待提交，2待审批，3通过，4不通过，5已撤回

战略合作协议 详情
/cooperationProtocol/detail
status 状态：1待提交，2待审批，3通过，4不通过，5已撤回

代理合同
/agencyContract/detail
state 状态：1待提交，2待审批，3已撤回，4不通过，5通过

投标借用协议
/bid-borrow-protocol/getDetailBorrowId
status 状态：1待提交，2待审批，3通过，4不通过，5已撤回

经营借用协议
/business-borrow-protocol/getDetailBorrowId
status 状态：1待提交，2待审批，3通过，4不通过，5已撤回

代签购物合同的详情（通过资质借用id获取
/purchase-contract/getPurchaseContractDetailByBorrowId
purchaseContractDetailVo.status 状态：0待提交，1待审批，2通过，3不通过，4已撤回

产品售后服务外包协议详情
/after-outsource-protocol/detail
status 状态：1待提交，2待审批，3通过，4不通过，5已撤回
*/
const __APIS__ ={
  '1-1':{
    api:dealerContractDetail,
    name:'经销商合同',
    passStatus:3  //通过状态
  },
  '1-3':{
    api:cooperationProtocolDetail,
    name:'战略合作协议',
    passStatus:3
  },
  '1-2':{
    api:agencyContractDetail,
    name:'代理合同',
    passStatus:5
  },
  '2-1':{
    api:bidDetailBorrowId,
    name:'投标借用协议',
    passStatus:3
  },
  '2-2':{
    api:businessDetailBorrowId,
    name:'经营借用协议',
    passStatus:3
  },
  '3':{
    api:getPurchaseContractDetailByBorrowId,
    name:'代签购物合同',
    passStatus:2
  },
  '4':{
    api:function(){
      return new Promise(resolve =>{
        resolve({

        })
      })
    },
    name:'销售合同',
    passStatus:null
  },
  '5':{
    api:afterDetailBorrowId,
    name:'产品售后服务外包协议',
    passStatus:3
  }
}
export default {
  name: 'qualifications-borrow-management-list-add',
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5
  },
  provide() {
    return {
      rootInstanceFrom: this
    }
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

      that.record = { ...record }
      if(that.record.__step){
        that.visible = true
        that.maxStep = +that.record.status - 1
        that.$nextTick(() => that.currentStep = that.record.__step)
        return
      }

      if(that.record.id){
        let res = await borrowDetail({ id: that.record.id }).then((res) => res.data)
        that.record = {...that.record,...res}
      }

      let {status,type:contractType,contractProperty} = this.record
      let key = status === 1 ? `${status}-${contractProperty}` : status === 2 ? `${status}-${contractType}` : `${status}`

      /*
        检测是否存在当前状态对应的合同
        存在状态和合同不统一的问题，前一个合同审批通过后，状态更新为下个状态节点，但新的状态节点对应的合同尚未创建。
      */
      let {_isCreatedContract,data,isPass} = await that.isCreatedContract(that.record.id,key)
      console.log(`_isCreatedContract:${_isCreatedContract} , data:${data},isPass:${isPass}`)
      that.record = {...that.record,isCreatedContract:_isCreatedContract,contractData:data}

      if(that.isDo && isPass !== undefined && isPass === false){
        let {name:contractName} = __APIS__[key]
        that.$message.info(`【${contractName}】尚未审批完成，禁止操作。`)
        return
      }

      that.visible = true

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

      //that.currentStep = 3
    },
    async stepChange(e, step) {
      const that = this
      console.log(arguments)
      if (step !== null) {
        let currentStep = this.currentStep + step

        this.currentStep = currentStep
      }
    },
    handleCancel() {
      this.visible = false
    },
    async isCreatedContract(borrowId,key){
      if(__APIS__[key]){
        let {api,passStatus} = __APIS__[key]
        //销售合同执行绑定操作，订单已经生成，直接返回
        if(api === null){
          return {
            _isCreatedContract:true,
            data:null
          }
        }
        let startWidth = ['2','3','5'].some(v => key.startsWith(v))
        let res = await api(startWidth ? {id:borrowId} : {id:-1,borrowId}).then(res => res)
        let _isCreatedContract = +res.code === 200 && res.data && res.data !== null
        let obj = {
          _isCreatedContract,
          data:res.data
        }

        if(_isCreatedContract && res && res.data && ('status' in res.data || 'state' in res.data)){
          let status = res.data.status || res.data.state
          obj.isPass = passStatus === +status
        }
        //代签购货合同特殊处理
        if(_isCreatedContract && res && res.data && res.data.purchaseContractDetailVo){
          let status = res.data.purchaseContractDetailVo.status
          obj.isPass = passStatus === +status
        }
        //代签购货合同特殊处理 END

        //统一返回接口数据
        return obj
      }
      return {
        _isCreatedContract:false,
        data:null
      }
    },
    endHandler(step){
      const that = this
       if(step === 4){
        that.currentStep = that.currentStep + 1
      }else{
        that.visible = false
      }
      that.$emit('finish')
    }
  }
}
</script>

<style scoped>
</style>

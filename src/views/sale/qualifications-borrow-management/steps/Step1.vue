<template>
  <a-spin :spinning="spinning">
  <div>
    <BaseForm ref="baseForm" @contractAttrChange="contractAttrChange"/>
    <component 
      :is="currentComponent" 
      ref="currentComponent" 
      @click="handlerSubmitClick" 
    />
  </div>
  </a-spin>
</template>

<script>
import BaseForm from './BaseForm'
import Step11 from './Step1-1' //经销商合同
import Step12 from './Step1-2' //战略合作协议
import Step13 from './Step1-3' //代理合同
import moment from 'moment'
import { borrowDetail ,borrowBindingContract} from '@/api/qualificationsBorrowManagement'


import { 
  dealerContractPageList ,//经销商合同
  cooperationProtocolPageList//战略合作协议
} from '@/api/qualificationsBorrowManagement'

//代理合同
import { agencyContractPageList } from '@/api/agencyContract'

import {
  borrowCheckContract
} from '@/api/qualificationsBorrowManagement'


const __API__ = {1:dealerContractPageList,2:agencyContractPageList,3:cooperationProtocolPageList}

export default {
  name:'step',
  components:{
    BaseForm
  },
  props:{
    actionType:String,
    record:Object
  },
  data(){
    return {
      currentComponent:null,
      currentComponentTitle:'',
      detail:{},
      steps:{ 1:Step11,2:Step13,3:Step12 },
      spinning:false,
      isBinding:false,
      type:undefined
    }
  },
  watch:{
    actionType(){
      this.init()
    },
    record(){
      this.init()
    }
  },
  created(){
    this.init()
  },
  methods:{
    async init(){
      const that = this
      that.isBinding = false
      if(that.actionType === 'view'){
        if(!that.record || !that.record.id){
          return
        }
        let res = await borrowDetail({ id: that.record.id }).then((res) => res.data)
        that.detail = {...that.record,...res}
        that.currentComponent = null
        that.$refs.baseForm.query(that.actionType,{...that.detail})
        that.currentComponent = that.steps[that.detail.contractProperty]
        that.$nextTick(() =>{
          that.$refs.currentComponent.query(that.actionType,{id:-1,borrowId:that.detail.id})
        })
      }else{
        that.currentComponent = null
        that.$nextTick(() => {
          that.$refs.baseForm.query('add',{})
        })
      }
    },
    async contractAttrChange(type){
      const that = this
      that.type = type
      if(!type){
        that.currentComponent = null
        that.currentComponentTitle = ''
        return
      }
      that.currentComponent = that.steps[type]
      const record =  await that.fetchTarget(type)
      
      that.isBinding = !!(record && record.id)

      that.$nextTick(() =>{
        //选择对应的协议后，检测对应协议列表是否存在 已经审批通过，客户名称和销售经理都匹配的合同，存在则填充数据
        that.$refs.currentComponent.query('add',record || {})
      })
      that.currentComponentTitle = { 1: '经销商', 2: '代理', 3: '战略合作协议' }[type]
    },
    async handlerSubmitClick(values){
      let that = this
      let baseFormResult = await that.$refs.baseForm.handleOk()
      if(baseFormResult.code !== 200){
        return
      }
      let _values = {...baseFormResult.values,...values}
      _values.salesmanId = _values.userId
      _values.salesmanWechat = _values.wxNum
      _values.salesmanEmail = _values.email
      console.log(_values)
      //return
      let case1 = async function(){
        that.spinning = true
        let result = await that.$refs.currentComponent.handleOkSubmit(_values)
        that.spinning = false
        if(result.code !== 200){
          that.$message.info(result.msg)
          return
        }else{
          const h = that.$createElement;
          that.$info({
            title: '提示',
            content: h('div', {}, [
              h('p', `【${that.currentComponentTitle}合同】创建成功，等待合同审批通过后，在资质借用列表中，点击【处理】进行下一步操作。`)
            ]),
            onOk() {
              that.$emit('end',1)
            },
          });
        }
      }

      let case2 = async function(){
        that.spinning = true
        let customValues = {
          agencyContractId:_values.id,
          customerId:_values.customerId,
          customerName:_values.customerName,
          email:_values.email,
          userId:_values.userId,
          wxNum:_values.wxNum,
          borrowNum:_values.borrowNum,
          contractProperty:_values.contractProperty,
          type:_values.type
        }
        let result = await borrowBindingContract(customValues)
        that.spinning = false
        if(result.code !== 200){
          that.$message.info(result.msg)
          return
        }else{
          const h = that.$createElement;
          that.$info({
            title: '提示',
            content: h('div', {}, [
              h('p', `【${that.currentComponentTitle}合同】绑定成功，在资质借用列表中，点击【处理】进行下一步操作。`)
            ]),
            onOk() {
              that.$emit('end',1)
            },
          });
        }
      }
      // if(that.isBinding){
      //   const h = that.$createElement;
      //   that.$info({
      //     title: '提示',
      //     content: h('div', {}, [
      //       h('p', `系统检测到符合条件的【${that.currentComponentTitle}合同】，确认执行绑定操作吗？`)
      //     ]),
      //     onOk() {
      //       case2()
      //     },
      //   });
      // }else{
      //   case1()
      // }

      case1()
    },
    async fetchTarget(type){
      const that = this
      let {customerId} = await that.$refs.baseForm.getValues()
      let res = await borrowCheckContract({
        contractProperty:type,
        customerId
      }).then(res =>res.data)
      .catch(res => {
        console.log(res)
        return null
      })
      return res


      // const current = moment().startOf('days').format('YYYY-MM-DD')
      // const filters = {
      //   1:function(item){
      //     return item.signingDate >= item.effectiveStart && item.signingDate <= item.effectiveEnd
      //   },
      //   2:function(item){
      //     return current >= item.validityDateStart && current <= item.validityDateEnd
      //   },
      //   3:function(item){
      //     let target = moment(item.createdTime).add(+item.cooperationYear,'years').format('YYYY-MM-DD')
      //     return current <= target
      //   }
      // }
      
      // let searchParams = {
      //   customerName,
      //   salesmanId:userId,
      //   status:3
      // }
      // let res = await __API__[type](searchParams)
      // return res.data.find(item => filters[type](item))
    }
  }
}
</script>
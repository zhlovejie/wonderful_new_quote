<template>
  <div>
    <BaseForm ref="baseForm" @contractAttrChange="contractAttrChange"/>
    <component 
      :is="currentComponent" 
      ref="currentComponent" 
      @click="handlerSubmitClick" 
    />
  </div>
</template>

<script>
import BaseForm from './BaseForm'
import Step11 from './Step1-1' //经销商合同
import Step12 from './Step1-2' //战略合作协议
import Step13 from './Step1-3' //代理合同

import { borrowDetail } from '@/api/qualificationsBorrowManagement'

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
      detail:{},
      steps:{ 1:Step11,2:Step12,3:Step13 }
    }
  },
  watch:{
    actionType(){
      this.init()
    }
  },
  created(){
    this.init()
  },
  methods:{
    async init(){
      const that = this
      let res = await borrowDetail({ id: that.record.id }).then((res) => res.data)
      that.detail = {...that.record,...res}

      if(that.actionType === 'view'){
        that.currentComponent = null
        that.$refs.baseForm.query(that.actionType,{...that.detail})
        that.currentComponent = that.steps[that.detail.contractProperty]
        that.$nextTick(() =>{
          that.$refs.currentComponent.query(that.actionType,{id:-1,borrowId:that.detail.id})
        })
      }else{
        that.$refs.baseForm.query('add',{})
        that.currentComponent = null
      }
    },
    contractAttrChange(type){
      const that = this
      that.currentComponent = that.steps[type]
      that.$nextTick(() =>{
        that.$refs.currentComponent.query('add',{})
      })
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
      let result = await that.$refs.currentComponent.handleOkSubmit(_values)
      if(result.code !== 200){
        return
      }
      
    }
  }
}
</script>
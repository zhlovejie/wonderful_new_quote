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
      currentComponentTitle:'',
      detail:{},
      steps:{ 1:Step11,2:Step13,3:Step12 },
      spinning:false
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
      if(!that.record || !that.record.id){
        return
      }
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
      //debugger
      const that = this
      that.currentComponent = that.steps[type]
      that.$nextTick(() =>{
        that.$refs.currentComponent.query('add',{})
      })
      that.currentComponentTitle = { 1: '经销商合同', 2: '代理合同', 3: '战略合作协议' }[type]
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
      that.spinning = true
      let result = await that.$refs.currentComponent.handleOkSubmit(_values)
      that.spinning = false
      if(result.code !== 200){
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
  }
}
</script>
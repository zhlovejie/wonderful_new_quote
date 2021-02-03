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
import Step11 from './Step1-1'
import Step12 from './Step1-2'
import Step13 from './Step1-3'
export default {
  name:'step',
  components:{
    BaseForm
  },
  props:{
    action:Object,
    detail:Object
  },
  data(){
    return {
      currentComponent:null
    }
  },
  created(){
    // if(this.currentComponent === null){
    //   this.currentComponent = Step11
    // }


    //borrowId

    let that = this
    that.$nextTick(() =>{
      if(that.action.isView){
        //that.$refs.baseForm && that.$refs.baseForm.query('view',{id:-1,borrowId:that.detail.id})
        that.$refs.currentComponent && that.$refs.currentComponent.query('view',{id:-1,borrowId:that.detail.id})
      }else{
        that.$refs.baseForm && that.$refs.baseForm.query('add',{})
        //that.$refs.currentComponent && that.$refs.currentComponent.query('add',{})
      }
    })
  },
  methods:{
    contractAttrChange(type){
      let m = { 1:Step11,2:Step12,3:Step13 }
      this.currentComponent = m[type]
      this.$nextTick(() =>{
        this.$refs.currentComponent && this.$refs.currentComponent.query('add',{})
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

      let result = await that.$refs.currentComponent.handleOkSubmit(_values)
      if(result.code !== 200){
        return
      }
      
    }
  }
}
</script>
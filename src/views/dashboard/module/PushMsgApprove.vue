<template>
  <component :is="currentComponent" ref="currentComponent" @finish="finishAction"></component>
</template>

<script>
import ViewComponents from './PushMsgApproveForm'
export default {
  name:'PushMsgView',
  data(){
    return {
      currentComponent:null,
      forms:ViewComponents
    }
  },
  methods:{
    query(type,record){
      let {msgType,businessType,businessId} = record
      let that = this
      let res = that.forms[businessType]
      if(!res){
        that.$message.info('该类型的消息暂不支持处理，后面会陆续开放。')
        return 
      }
      //ROUTE:
      if(typeof res === 'string'){
        if(res.startsWith("ROUTE:")){
          that.$router.push({name:res.slice(6)})
        }
      }else{
        that.currentComponent = res
        this.$nextTick(() =>{
          this.$refs.currentComponent.query(type,{id:businessId})
        })
      }
    },
    finishAction(){
      this.$emit('finish')
    }
  }
}
</script>

<style scoped>

</style>
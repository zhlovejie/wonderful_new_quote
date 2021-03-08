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
      if(res && res._customRoute){ //自定义跳转 传参
        let params = res.props(businessId,type,'Workplace')
        that.$nextTick(() =>{
          that.$router.push({name: res.name,params })
        })
        return
      }else if(typeof res === 'string'){//ROUTE: 直接跳转
        if(res.startsWith("ROUTE:")){
          that.$router.push({name:res.slice(6),params:{from:'Workplace'}})
        }
      }else{ //对应组件处理
        that.currentComponent = res
        that.$nextTick(() =>{
          that.$refs.currentComponent.query(type,{id:businessId})
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
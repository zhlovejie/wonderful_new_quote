<template>
  <component :is="currentComponent" ref="currentComponent"></component>
</template>

<script>
import ViewComponents from './PushMsgViewComponents'
export default {
  name:'PushMsgView',
  components:{
    ...ViewComponents
  },
  data(){
    return {
      currentComponent:null,
    }
  },
  methods:{
    query(record){
      let {msgType,businessType,businessId} = record
      let that = this
      that.currentComponent = 'LevelApplyForm'
      this.$nextTick(() =>{
        this.$refs.currentComponent.query('view',{id:businessId})
      })
    }
  }
}
</script>

<style scoped>

</style>
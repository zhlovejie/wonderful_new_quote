<template>
  <div style="margin-top: 20px">
    
  </div>
</template>

<script>

export default {
  name:'step3',
  props:{
    actionType:String,
    record:Object
  },
  data(){
    return {

    }
  },
  created(){
    this.init()
  },
  watch:{
    actionType(){
      this.init()
    }
  },
  methods:{
    init(){
      const that = this
      let _actionType = that.actionType === 'view' ? 'view' : 'add'
      if(_actionType === 'add'){
        that.$router.push({
          name: 'basicInformation2',
          params: { id: null, action: actionType, from: 'contractBehalfList' },
        })
      }
    },
    finish(){
      console.log('over...')
    }
  }
}
</script>
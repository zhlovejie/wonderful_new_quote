<template>
  <div style="margin-top: 20px">
    <template v-if="isBidBorrow">
      <BidBorrow ref="bidBorrow" @finish="finish" />
    </template>
    <template v-if="isBusinessBorrow">
      <BusinessBorrow ref="businessBorrow" @finish="finish" />
    </template>
  </div>
</template>

<script>
import BusinessBorrow from './Step2-2'
import BidBorrow from './Step2-1'
export default {
  name:'step2',
  components:{
    BusinessBorrow,//经营借用协议
    BidBorrow, //投标借用协议
  },
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
  computed:{
    isBidBorrow(){
      return +this.record.type === 1
    },
    isBusinessBorrow(){
      return +this.record.type === 2
    }
  },
  watch:{
    actionType(){
      this.init()
    }
  },
  methods:{
    init(){
      const that = this
      let key = that.isBidBorrow ? 'bidBorrow' : 'businessBorrow'
      let _actionType = that.actionType === 'view' ? 'view' : 'add'
      that.$nextTick(() =>{
        that.$refs[key].query(
          _actionType,
          _actionType === 'add' ? {borrowId:that.record.id} : {id:that.record.id}
        )
      })
    },
    finish(){
      console.log('over...')
    }
  }
}
</script>
<template>
  <div class="data-time-picker-wrapper">
    <a-form-item>
      <a-date-picker :disabled="disabled" v-model="sDate" @openChange="handleStartOpenChange"/>
    </a-form-item>
    <a-form-item style="margin-left:10px;">
      <a-time-picker 
        :minute-step="5" 
        :second-step="60" 
        v-model="sTime" 
        :disabled="disabled || sDate === null"
        :allowClear="false"
        :open="endOpen" 
        @openChange="handleEndOpenChange"
        @change="handleEndChange"
      />
    </a-form-item>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name:'date-time-picker',
  props:{
    disabled:{
      type:Boolean,
      default:false
    },
    fill:{
      type:String,
      default:null
    }
  },
  data(){
    return {
      sDate:null,
      sTime:null,
      endOpen:false
    }
  },
  mounted(){
    this.init()
  },
  watch:{
    fill(newVal,oldVal){
      this.init()
    },
    sDate(){
      this.handleEndChange()
    },
    sTime(){
      this.handleEndChange()
    }
  },
  methods:{
    init(){
      let m = moment(this.fill)
      if(m.isValid()){
        this.sDate = m,this.sTime = m
      }
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    handleEndChange(){
      let sDate = this.sDate,sTime = this.sTime
      if(sDate !== null && sTime !== null){
        let d_str = `${sDate.format('YYYY-MM-DD')} ${sTime.format('HH:mm:ss')}`
        this.$emit('change',d_str)
      }
    }
  }
}
</script>

<style scoped>
.data-time-picker-wrapper{
  display: flex;
}
</style>
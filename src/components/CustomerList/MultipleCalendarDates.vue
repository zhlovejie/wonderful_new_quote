<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    class="multiple-calendar-wrapper"
  >
    <a-calendar >
      <div slot="dateCellRender" slot-scope="value" class="events">
        <a-checkbox v-model="dateObj[`${value.format('YYYY-MM-DD')}`]" @change="onChange(value,$event)" />
      </div>
    </a-calendar>
  </a-modal>
</template>
<script>
let uuid = () => Math.random().toString(32).slice(-10)
export default {
  name:'',
  data(){
    return {
      visible:false,
      dateObj:{}
    }
  },
  computed:{
    modalTitle(){
      return '选择日期'
    }
  },
  methods:{
    show(dateList){
      let that = this
      that.dateObj = {}
      that.visible = true
      if(Array.isArray(dateList) && dateList.length > 0){
        let obj = {}
        dateList.map(str =>obj[str] = true)
        that.$nextTick(() => that.dateObj = {...obj})
      }
    },
    handleOk(){
      let that = this
      let dateList = Object.keys(that.dateObj).filter(k =>that.dateObj[k])
      this.$emit('change',[...dateList])
      this.handleCancel()
    },
    handleCancel(){
      this.visible = false
    },
    onChange(m,event){
      let that = this
      that.dateObj[m.format('YYYY-MM-DD')] = event.target.checked
    }
  }
}
</script>
<style >
.multiple-calendar-wrapper  .ant-fullcalendar-fullscreen .ant-fullcalendar-month, 
.multiple-calendar-wrapper  .ant-fullcalendar-fullscreen .ant-fullcalendar-date,
.multiple-calendar-wrapper  .ant-fullcalendar-fullscreen .ant-fullcalendar-content{
  height: 60px !important; 
}
.multiple-calendar-wrapper .ant-fullcalendar-fullscreen .ant-radio-group-outline{
  display: none;/*隐藏年月切换*/
}
</style>
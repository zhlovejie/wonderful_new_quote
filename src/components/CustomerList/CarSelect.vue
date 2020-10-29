<template>
  <div class="car-select-wrapper">
    <a-modal
    title="选择车辆"
    :width="1050"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
  >
    <CarInfoList ref="carInfoList" :isForSelect="true" @select="selectHandler" />
  </a-modal>
  </div>
</template>

<script>
import CarInfoList from '@/views/vehicle-management/car-info-list/List'
export default {
  name:'carSelect',
  components:{CarInfoList},
  data(){
    return {
      visible:false
    }
  },
  methods:{
    query(){
      this.visible = true
      this.$nextTick(() => this.$refs.carInfoList.init())
    },
    handleCancel(){
      this.visible = false
    },
    selectHandler(record){
      this.handleCancel()
      this.$emit('select',record)
    }
  }
}
</script>

<style scoped>

</style>
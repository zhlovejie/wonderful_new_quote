<template>
  <a-modal title="客户信息" v-model="visible" :footer="null" :maskClosable="false">
    <p>客户名称：{{ customerInfo.customerName || '' }}</p>
    <p>联系人：{{ customerInfo.linkManName || '' }}</p>
    <p>联系方式：{{ customerInfo.linkManPhone || '' }}</p>
    <p>微信号：{{ customerInfo.linkManWeChat || '' }}</p>
    <p>地址：{{ customerInfo.customerAddress || '' }}</p>
  </a-modal>
</template>
<script>
import { getCustomerInfo } from '@/api/pricingModule'
export default {
  name:'CustomerInfo',
  data(){
    return {
      visible:false,
      customerInfo:{}
    }
  },
  mounted(){
    
  },
  methods:{
    init (customerId) {
      if(customerId === undefined) return 
      this.visible = true
      getCustomerInfo({id: customerId})
      .then(res => {
        console.log('获取客户信息', res)
        this.customerInfo = Object.assign({},res.data)
      })
      .catch(error => {
        console.error(error)
      })
    },
    setModel(type='show'){
      this.visible = String(type) === 'show' ? true : false
    }
  }
}
</script>
<style scoped>

</style>
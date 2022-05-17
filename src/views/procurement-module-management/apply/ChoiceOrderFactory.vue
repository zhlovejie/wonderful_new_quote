<template>
  <a-modal title="操作" :width="1000" :footer="null" v-model="visible" :maskClosable="false">
    <a-tabs :activeKey="activeKey" defaultActiveKey="InvoiceSaleContract" @change="tabChange">
      <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.name" />
    </a-tabs>
    <component :is="currentComponent" @change="change"></component>
  </a-modal>
</template>

<script>
//import invoicePresentOrder from './invoicePresentOrder'
import InvoiceSaleContract from './InvoiceSaleContract'
import SaleOrderReport from './SaleOrderReport'
export default {
  name: 'ChoiceOrderFactory',
  components: {
    InvoiceSaleContract,
    SaleOrderReport
    //invoicePresentOrder
  },
  data() {
    return {
      visible: false,
      activeKey: 'SaleOrderReport',
      tabs: [
        // {
        //   name: '合同',
        //   key: 'InvoiceSaleContract',
        // },
        {
          name: '选择订单',
          key: 'SaleOrderReport',
        },

        // ,{
        //   name:'赠送订单',
        //   key:'invoicePresentOrder'
        // }
      ],
      input:null
    }
  },
  computed: {
    currentComponent() {
      return this.activeKey
    },
  },
  methods: {
    tabChange(key) {
      this.activeKey = key
    },
    change(record) {
      this.$emit('change', {
        selectedKey: this.activeKey,
        record: record,
        input:this.input
      })
      this.visible = false
    },
    query(opt) {
      this.visible = true
      this.input = opt
    },
  },
}
</script>

<style scoped>
</style>


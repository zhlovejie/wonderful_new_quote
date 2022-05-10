<template>
  <a-modal title="操作" :width="1000" :footer="null" v-model="visible" :maskClosable="false">
    <a-tabs :activeKey="activeKey" defaultActiveKey="invoiceSaleContract" @change="tabChange">
      <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.name" />
    </a-tabs>
    <component :is="currentComponent" @change="change"></component>
  </a-modal>
</template>

<script>
//import invoicePresentOrder from './invoicePresentOrder'
import invoiceSaleContract from './invoiceSaleContract'
import { isOutboundByContractId } from '@api/invoice'

export default {
  name: 'ChoiceOrderFactory',
  components: {
    invoiceSaleContract,
    //invoicePresentOrder
  },
  data() {
    return {
      visible: false,
      activeKey: 'invoiceSaleContract',
      tabs: [
        {
          name: '合同',
          key: 'invoiceSaleContract',
        },
        // ,{
        //   name:'赠送订单',
        //   key:'invoicePresentOrder'
        // }
      ],
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
      isOutboundByContractId({ id: record.contractId }).then((res) => {
        if (res.data) {
          this.$message.info('合同存在未出库发货单，存在发货单的产品不能重复带入')
        }
      })
      this.$emit('change', {
        selectedKey: this.activeKey,
        record: record,
      })
      this.visible = false
    },
    query(opt) {
      this.visible = true
    },
  },
}
</script>

<style scoped>
</style>


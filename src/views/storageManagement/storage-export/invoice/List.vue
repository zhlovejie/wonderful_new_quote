<template>
  <div class="storage-exprot-invoice-wrapper">
    <InvoiceList ref="invoiceList" pageFrom="stock_management_export_invoice" />
  </div>
</template>
<script>
import InvoiceList from '@/views/sale/invoice/invoice.vue'
export default {
  name:'storage-exprot-invoice-list',
  components:{
    InvoiceList
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.name === 'stock_management_export_invoice') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods:{
    init(){
      const that = this
      that.$nextTick(() => {
        that.$refs.invoiceList && that.$refs.invoiceList.init()
      })
    }
  }
}
</script>
<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <div class="wrapper">
      报价....
    </div>
    <p style="text-align:center;margin-top:20px;">
      <a-button
        type="primary"
        @click="stepAction('prev')"
      >上一步</a-button>
      <a-button
        type="primary"
        @click="stepAction('next')"
        style="margin-left:10px;"
      >下一步</a-button>
    </p>
  </a-card>
</template>
<script>
import { typeConfigDetail } from '@/api/productOfferManagement'
export default {
  inject:['addForm'],
  data() {
    return {

    }
  },
  watch:{
    'addForm.currentStep':{
      handler(val, oldVal){
        if(val === 4){
          this.init()
        }
      },
      deep:true
    }
  },

  methods: {
    async init() {
      const that = this
      let {
        productTypeConfigId,
        productTypeConfigName
      } = this.addForm.form
      typeConfigDetail({ id: productTypeConfigId }).then((res) => {
        console.log(res.data)
        // that.form.setFieldsValue({
        //   code: res.data.code,
        //   typeName: res.data.typeName,
        //   taxRate: res.data.taxRate,
        //   lowPriceInterval: res.data.lowPriceInterval,
        // })
        // that.typeConfigRangeList = res.data.typeConfigRangeList
      })
    },
    stepAction(type) {
      const that = this
      if (type === 'next') {
        that.$emit('change', 'step5', 'next', null)
      } else if (type === 'prev') {
        that.$emit('change', 'step5', 'prev', null)
      }
    }
  }
}
</script>

<style scoped>
</style>


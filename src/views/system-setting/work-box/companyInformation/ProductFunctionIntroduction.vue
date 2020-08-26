<template>
  <div>
  <ProductOfferManagementProductConfig 
    ref="productOfferManagementProductConfig" 
    :isProductFunctionIntroduction="true" 
    @view="viewAction"
  />
  <Preview ref="preview"/>
  </div>
</template>

<script>
import ProductOfferManagementProductConfig from '@/views/product-offer-management/product-config/List'
import Preview from '../modules/SynopsisPreview'
export default {
  name: 'ProductFunctionIntroduction',
  components: {
    ProductOfferManagementProductConfig,
    Preview
  },
  data () {
    return {
      
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'ProductFunctionIntroduction'){
          this.init()
        }
      },
      immediate:true
    }
  },
  methods: {
    init(){
      let that = this
      that.$nextTick(() => {
        let target = that.$refs.productOfferManagementProductConfig
        target && target.searchAction()
      })
    },
    viewAction(record){
      this.$refs.preview.show(record)
    },
    
  }
}
</script>

<style scoped>

</style>

<template>
  <BaseAccountBank ref="baseAccountBank" :toolType="'1'" />
</template>
<script>
import BaseAccountBank from '@/views/system-setting/work-box/companyInformation/AccountBank'
export default {
  name:'ForeignTradeAccountBank',
  components:{BaseAccountBank},
  data(){
    return {

    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'ForeignTradeAccountBank') {
          this.init()
        }
      },
      immediate: true
    }
  },
  created(){
    this.init()
  },
  methods:{
    init(){
      this.$refs.baseAccountBank && this.$refs.baseAccountBank.handleSaveOk()
    }
  }
}
</script>
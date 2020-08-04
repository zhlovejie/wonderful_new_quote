<template>
  <BaseQualification ref="baseQualification" :toolType="'1'" />
</template>
<script>
import BaseQualification from '../work-box/Qualification'
export default {
  name:'ForeignTradeQualification',
  components:{BaseQualification},
  data(){
    return {

    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'ForeignTradeQualification') {
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
      this.$refs.baseQualification && this.$refs.baseQualification.handleSaveOk()
    }
  }
}
</script>
<template>
  <BaseEnterpriseVideo ref="baseEnterpriseVideo" :toolType="'1'" :informationType="'2'" />
</template>
<script>
import BaseEnterpriseVideo from '@/views/system-setting/work-box/companyInformation/EnterpriseVideo'
export default {
  name:'ForeignTradeEnterpriseVideo',
  components:{BaseEnterpriseVideo},
  data(){
    return {

    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'ForeignTradeEnterpriseVideo') {
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
      this.$refs.baseEnterpriseVideo && this.$refs.baseEnterpriseVideo.handleSaveOk()
    }
  }
}
</script>
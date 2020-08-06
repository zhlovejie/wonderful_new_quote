<template>
  <BaseEnterpriseVideo ref="baseEnterpriseVideo" :toolType="'0'" :informationType="'3'" />
</template>
<script>
import BaseEnterpriseVideo from '@/views/system-setting/work-box/companyInformation/EnterpriseVideo'
export default {
  name:'ProductPromotionVideo',
  components:{BaseEnterpriseVideo},
  data(){
    return {

    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'ProductPromotionVideo') {
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
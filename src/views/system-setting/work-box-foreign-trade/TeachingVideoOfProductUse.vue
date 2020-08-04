<template>
  <BaseEnterpriseVideo ref="baseEnterpriseVideo" :toolType="'1'" :informationType="'4'" />
</template>
<script>
import BaseEnterpriseVideo from '@/views/system-setting/work-box/companyInformation/EnterpriseVideo'
export default {
  name:'ForeignTradeTeachingVideoOfProductUse',
  components:{BaseEnterpriseVideo},
  data(){
    return {

    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'ForeignTradeTeachingVideoOfProductUse') {
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
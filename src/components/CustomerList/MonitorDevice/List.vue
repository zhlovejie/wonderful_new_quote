<template>
  <div class="wdf-custom-wrapper">
    <div class="main-wrapper">
      <!-- <h3>不知道如何使用？点击查看<a href="#" @click="showGuid">功能使用说明</a></h3> -->
      <div class="paly-wrapper" style="position: relative;">
        <!-- <a-spin :spinning="spinning" tip="监控设备正在初始化，请稍后..."> -->
          <div :id="playWind" ></div>
          <!-- <div v-show="hasError">
            <a-button @click="initCamera">重新加载监控</a-button>
          </div> -->
        <!-- </a-spin> -->
      </div>
    </div>
    <!-- <GuidForm ref="guidForm"/> -->
  </div>
</template>

<script>
import EZUIKit from 'ezuikit-js'
import CAMERA_API from './js/api'
import GuidForm from './Guid'
let player = null
export default {
  name: 'MonitorDeviceComponents',
  components:{GuidForm},
  props:{
    deviceKey:{
      type:[Number,String],
      default:() => 1
    },
    channelNo:{
      type:[Number,String],
      default:() => 1
    }
  },
  data() {
    return {
      spinning: false,
      hasError:false,
      playWind:'playwind'
    }
  },
  watch: {
    deviceKey: {
      handler: function (v) {
        this.playWind = `playwind-${v}-${this.channelNo}`
        this.initCamera()
      },
      immediate: true
    }
  },
  methods: {
    async initCamera() {
      let that = this
      let ele = document.querySelector(`#${that.playWind}`)
      if(ele){
        ele.innerHTML = ''
      }
      that.hasError = false
      that.spinning = true

      if(!that.deviceKey){
        console.log(`参数【deviceKey】缺失`)
        return
      }

      let { code, msg, accessToken, monitorUrl } = await CAMERA_API.util.getTokenAndUrl(that.deviceKey,that.channelNo)
      if (code !== 200) {
        that.spinning = false
        that.$message.error(msg)
        that.hasError = true
        return
      }
      console.log(`monitorUrl:${monitorUrl}`)
      that.$nextTick(() => {
        player = new EZUIKit.EZUIKitPlayer({
          id: that.playWind,
          accessToken: accessToken,
          url: monitorUrl,
          template: 'security', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
          // 视频上方头部控件
          //header: ['capturePicture', 'save', 'zoom'], // 如果templete参数不为simple,该字段将被覆盖
          //plugin: ['talk'],                       // 加载插件，talk-对讲
          // 视频下方底部控件
          //footer: ['hd', 'fullScreen'], // 如果template参数不为simple,该字段将被覆盖
          audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
          //autoplay: false,
          width: 550,
          height: 400,
          handleSuccess: that.handleCameraSuccess,
          handleError: that.handleCameraError,
        })
      })
    },
    handleCameraSuccess() {
      this.spinning = false
      if(player){
        player.autoResize()
      }
      return
    },
    handleCameraError() {
      this.spinning = false
      this.hasError = true
      return
    },
    showGuid(){
      this.$refs.guidForm.show()
    },
  },
  beforeDestroy(){
    const that = this
    if(player){
      try{
        player.stop()
      }catch(e){
        console.log(e)
      }
      finally{
        that.$nextTick(() => player = null)
      }
    }
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: transparent;
}
</style>

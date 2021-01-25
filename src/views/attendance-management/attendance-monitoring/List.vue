<template>
  <div class="wdf-custom-wrapper">
    <div class="main-wrapper">
      <h3>不知道如何使用？点击查看<a href="#" @click="showGuid">功能使用说明</a></h3>
      <div class="paly-wrapper" style="position: relative; width: 800px;height:600px;">
        <a-spin :spinning="spinning" tip="监控设备正在初始化，请稍后...">
          <div id="playWind"></div>
          <div v-show="hasError">
            <a-button @click="() => init()">重新加载监控</a-button>
          </div>
        </a-spin>
      </div>
    </div>
    <GuidForm ref="guidForm"/>
  </div>
</template>

<script>
import EZUIKit from 'ezuikit-js'
import CAMERA_API from './js/api'
import GuidForm from './Guid'
let player = null
export default {
  name: 'attendance-monitoring',
  components:{GuidForm},
  data() {
    return {
      spinning: false,
      hasError:false
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'attendance-monitoring') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    async init() {
      this.initCamera()
    },
    async initCamera() {
      let that = this
      let ele = document.querySelector('#playWind')
      if(ele){
        ele.innerHTML = ''
      }
      that.hasError = false
      that.spinning = true
      let { code, msg, accessToken, monitorUrl } = await CAMERA_API.util.getTokenAndUrl()
      if (code !== 200) {
        that.spinning = false
        that.$message.error(msg)
        that.hasError = true
        return
      }
      that.$nextTick(() => {
        player = new EZUIKit.EZUIKitPlayer({
          id: 'playWind',
          accessToken: accessToken,
          url: monitorUrl,
          template: 'security', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
          // 视频上方头部控件
          header: ['capturePicture', 'save', 'zoom'], // 如果templete参数不为simple,该字段将被覆盖
          //plugin: ['talk'],                       // 加载插件，talk-对讲
          // 视频下方底部控件
          footer: ['hd', 'fullScreen'], // 如果template参数不为simple,该字段将被覆盖
          audio: 0, // 是否默认开启声音 0 - 关闭 1 - 开启
          autoplay: false,
          width: 800,
          height: 600,
          handleSuccess: that.handleCameraSuccess,
          handleError: that.handleCameraError,
        })
      })
    },
    handleCameraSuccess(data) {
      this.spinning = false
      return
    },
    handleCameraError(data) {
      this.spinning = false
      this.hasError = true
      return
    },
    showGuid(){
      this.$refs.guidForm.show()
    }
  },
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 20px;
}
</style>
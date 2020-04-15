<template>
  <a-modal
    title="人脸采集"
    :width="500"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :loading="spinning"
  >
    <a-spin :spinning="spinning">
      <div class="camera-wrapper">
        <video id="video"></video>
        <canvas id="canvas"></canvas>
      </div>
      <div class="actions">
        <a-button type="primary" @click="openCamera" style="margin-right:10px;">开启摄像头</a-button>
        <a-button type="primary" @click="drawCanvasImage">采集图片</a-button>
      </div>
    </a-spin>
  </a-modal>
</template>
  <script>
export default {
  data() {
    return {
      videoWidth: 300,
      videoHeight: 300,
      visible: false,
      spinning: false,
      record: {},
      mediaStreamTrack:null,
      video:null,
      canvas:null,
      drawCanvasImageHandler:null
    }
  },
  methods: {
    query(record) {
      let that = this
      that.record = record
      that.visible = true
      that.$nextTick(() =>{
        that.video = document.getElementById('video')
        that.canvas = document.getElementById('canvas')
      })
    },
    openCamera(){
      let that = this
      getUserMedia({video: {width: that.videoWidth, height: that.videoHeight}}, success, error);
      //访问用户媒体设备的兼容方法
      function getUserMedia(constraints, success, error) {
          if (navigator.mediaDevices.getUserMedia) {
              //最新的标准API
              navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
          } else if (navigator.webkitGetUserMedia) {
              //webkit核心浏览器
              navigator.webkitGetUserMedia(constraints, success, error)
          } else if (navigator.mozGetUserMedia) {
              //firfox浏览器
              navigator.mozGetUserMedia(constraints, success, error);
          } else if (navigator.getUserMedia) {
              //旧版API
              navigator.getUserMedia(constraints, success, error);
          }
      }
      //成功回调
      function success(stream) {
        that.mediaStreamTrack = stream.getTracks()[0]
        that.video.srcObject = stream
        that.video.play()
        that.drawCanvasImageHandler = setInterval(that.drawCanvasImage, 100)
      }
      //失败回调
      function error(error) {
          console.log('失败');
          console.log("访问用户媒体设备失败", error);
      }
    },
    closeCamera(){
      if(this.mediaStreamTrack !== null){
        this.mediaStreamTrack.stop()
      }
    },
    drawCanvasImage(){
      let that = this
      const context = that.canvas.getContext('2d');
      context.drawImage(that.video, 0, 0, that.videoWidth, that.videoHeight, 0, 0, that.videoWidth, that.videoHeight);
      //获取图片，数据格式为base64
      const imageData = canvas.toDataURL("image/png");
      console.log(imageData)
    },
    handleOk() {
      this.handleCancel()
    },
    handleCancel() {
      if(this.drawCanvasImageHandler !== null){
        clearInterval(this.drawCanvasImageHandler)
      }
      this.closeCamera()
      this.$nextTick(() => this.visible = false)
    }
  }
}
</script>
<style scoped>
  .camera-wrapper{
    position: relative;
    width: 450px;
    height: 450px;
  }
  .camera-wrapper #video{
    position: absolute;
    width: 450px;
    height: 450px;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .camera-wrapper #canvas{
    position: absolute;
    width: 450px;
    height: 450px;
    top: 0;
    left: 0;
    z-index: 10;
  }

</style>
 

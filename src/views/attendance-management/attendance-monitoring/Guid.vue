<template>
  <a-modal
    title="考勤监控功能使用介绍"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false" 
    :footer="footer"
  >
  <div class="guid-wrapper">
    <p>截图功能：点击后会截取当前监控画面并弹出保存图片提示</p>
    <p>
      <img :src="capturePicture" alt="截图功能">
    </p>
    <p>录像功能：默认白色，点击后变成红色（红色表示正在录像中），再次点击后结束录像并弹出保存录像提示</p>
    <p>
      <img :src="video1" alt="录像功能">
    </p>
    <p>
      <img :src="video2" alt="录像功能">
    </p>
    <p>电子放大功能：点击后可在监控画面任何位置画出一个矩形，该矩形区域会被放大，再次点击后，画面恢复正常</p>
    <p>
      <img :src="zoom1" alt="电子放大功能">
    </p>
    <p>
      <img :src="zoom2" alt="电子放大功能">
    </p>
    <p>
      <img :src="zoom3" alt="电子放大功能">
    </p>
    <p>全屏功能：点击后监控画面切换为全屏显示，按【Esc】键退出全屏显示</p>
    <p>
      <img :src="fullScreen" alt="全屏功能">
    </p>
    <p>切换清晰度功能：有标清和高清两个选项，默认标清，点击后切换为高清，再次点击后切换为标清</p>
    <p>
      <img :src="toggleSdHd" alt="切换清晰度功能">
    </p>
    <p>回放功能：点击后弹出回放设置界面，选择回放开始时间和结束时间，回放类型有【云存储】(收费)和【SD卡/NVR】两个选项，我们选择【SD卡/NVR】即可，点击确认后开始回放监控，可拖动时间轴实时改变播放时间点，可点击【+】、【-】调整时间轴比例</p>
    <p>
      <img :src="playBack1" alt="回放功能">
    </p>
    <p>
      <img :src="playBack2" alt="回放功能">
    </p>
  </div>
  </a-modal>
</template>
<script>
import capturePicture from './img/1.png'

import video1 from './img/2.png'
import video2 from './img/2-1.png'
import zoom1 from './img/3.png'
import zoom2 from './img/3-1.png'
import zoom3 from './img/3-2.png'

import toggleSdHd from './img/4.png'

import playBack1 from './img/5.png'
import playBack2 from './img/5-1.png'

import fullScreen from './img/6.png'
export default {
  name:'camera-guid',
  data(){
    return {
      capturePicture,
      video1,
      video2,
      zoom1,
      zoom2,
      zoom3,
      fullScreen,
      toggleSdHd,
      playBack1,
      playBack2,
      visible:false,
    }
  },
  methods:{
    show(){
      this.visible = true
    },
    handleCancel(){
      this.visible = false
    },
    footer:function(){
      let that = this
      const h = that.$createElement;
      let buttons = []
      buttons.push(
        h('a-button',{
          key:'close',
          props:{
            type:'primary'
          },
          on:{
            click:that.handleCancel
          }
        },'关闭')
      )
      return h('div', {}, buttons)
    },
  }
}
</script>

<style scoped>
  .guid-wrapper{
    font-size: 18px;
  }
  .guid-wrapper >>> img {
    width: 70%;
    max-width: 800px;
  }
</style>

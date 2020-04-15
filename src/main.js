// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
//import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VideoPlayer from 'vue-video-player'

import viser from 'viser-vue'
Vue.use(Antd)
Vue.use(viser)

//提示信息垂直居中
Vue.prototype.$message.config({
  top:'calc(50% - 25px)',//消息距离顶部的位置
  duration:3, //多少秒后自动关闭
  maxCount:1 //最大显示数
})

// import vuePrint from 'vue-print-nb'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

Vue.use(VideoPlayer)
// Vue.use(vuePrint)

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')

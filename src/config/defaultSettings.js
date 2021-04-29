/**
 * 项目默认配置项
 * primaryColor - 默认主题色
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * autoHideHeader - 向下滚动时，隐藏 Header : boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */

export default {
  // baseURL: 'http://106.14.246.246:8091',    // 正式服
  // baseURL: 'http://192.168.13.158:8999/oa',
  //baseURL: 'http://192.168.13.2:8999/oa',
  //baseURL: 'http://192.168.13.197:8999/oa',
  // baseURL: 'http://192.168.13.158:8995/oa',
  //baseURL: 'http://106.14.194.64/cloud_new',
  baseURL: 'http://192.168.13.3:8999/oa',
  // baseURL: 'http://192.168.13.3:8999/oa',
  // baseURL: 'http://192.168.13.3:8999/oa' ,

  // baseURL: 'http://192.168.13.158:8995/oa',
  gaoPaiYiUploadProxyURL: 'http://localhost:8090/', //参考 GaoPaiYiUploadProxy.exe.config -> localServerUrl
  attendanceMonitoringConfig: { //考勤监控 摄像头信息
    appKey: 'd39b58df3a9b437cac8a0c6a120ef1eb',
    appSecret: 'bbe8423572c73f7ef47002d28852c26b',
    deviceSerial: 'E54619002'
  },
  primaryColor: '#1890FF', // primary color of ant design
  navTheme: 'dark', // theme for nav menu
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fixed', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: false, // sticky headergetInformationType
  fixSiderbar: true, // sticky siderbar
  autoHideHeader: false, //  auto hide header
  colorWeak: false,
  multiTab: false,
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
  // vue-ls options
  storageOptions: {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  }
}

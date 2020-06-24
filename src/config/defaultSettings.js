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
  //baseURL: 'http://localhost:8991/cloud',
  //baseURL: 'http://106.14.97.125/cloud',
  // baseURL:'http://192.168.99.166:8991/cloud',
  // baseURL: 'http://106.14.246.246:8091',    // 正式服
  //baseURL:'http://ihcvvw.natappfree.cc/oa',
  //baseURL: 'http://23yd043297.51mypc.cn/oa',   //张恒
  //baseURL:'http://192.168.99.166:8999/oa',
  //baseURL:'http://192.168.99.108:8999/oa',
  //baseURL:'http://192.168.99.166:8999/oa',
  baseURL: 'http://192.168.99.160:8995/', // 测试
  //baseURL:'http://192.168.99.118:8995/cloud_new',
  primaryColor: '#1890FF', // primary color of ant design
  navTheme: 'dark', // theme for nav menu
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fixed', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: false, // sticky headergetInformationType
  fixSiderbar: false, // sticky siderbar
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

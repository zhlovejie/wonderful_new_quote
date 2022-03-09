import Vue from 'vue'
import Router from 'vue-router'

// 生产环境使用
// import { constantRouterMap, asyncRouterMap } from '@/config/router.config'

// 开发环境 优化webpack 启动使用
import { constantRouterMap, asyncRouterMap } from '@/config/router.config.dev'

Vue.use(Router)

console.log(`constantRouterMap.concat(asyncRouterMap):${constantRouterMap.concat(asyncRouterMap).length}`)
export default new Router({
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(asyncRouterMap)
})

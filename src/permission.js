import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN, VUE_BOOLEAN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', '404'] // 没有重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`)
  if (Vue.ls.get(ACCESS_TOKEN)) {
    let currentUser = Vue.ls.get('CURRENT_USER')
    if (currentUser) {
      currentUser = JSON.parse(currentUser)
      store.commit('SET_CURRENT_USER', currentUser)
    }

    const vueBoolean = Vue.ls.get(VUE_BOOLEAN)
    store.commit('VUE_BOOLEAN', vueBoolean)

    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/dashboard/workplace' })
      NProgress.done()
    } else {
      if (store.getters.roles.length > 0) {
        next()
      } else {
        store
          .dispatch('GetInfo')
          .then(() => {
            //获取权限
            store.dispatch('GenerateRoutes').then(() => {
              //获取路由
              if (store.getters.roles.length === 0) {
                if (to.path === '/dashboard/workplace') {
                  next()
                } else {
                  next({ path: '/dashboard/workplace', replace: true, query: { t: Date.now() } })
                  NProgress.done()
                }
              } else {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                //router.addRoutes(store.getters.addRouters)
                // const redirect = decodeURIComponent(from.query.redirect || to.path)
                const redirect = decodeURIComponent(to.path)
                if (to.path === redirect) {
                  // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                  //next()
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                }
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

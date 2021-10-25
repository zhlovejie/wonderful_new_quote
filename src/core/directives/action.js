import Vue from 'vue'
import store from '@/store'

import system from '@/config/defaultSettings'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    const actionName = binding.arg
    const roles = store.getters.roles
    const elVal = vnode.context.$route.meta.permission
    const permissionId = elVal instanceof String && [elVal] || elVal
    roles.permissions.forEach(p => {
      if (!permissionId.includes(p.permissionId)) {
        return
      }
      if (p.actionList && !p.actionList.includes(actionName)) {
        el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      }
    })
  }
})

//新增下载文件指令 工具箱专用
//使用 v-download="url"
Vue.directive('download', {
  inserted: function (el, binding, vnode) {
    let tokenItem = localStorage.getItem('pro__Access-Token')
    let token = ''
    if (tokenItem) {
      try {
        token = JSON.parse(tokenItem).value
      } catch (err) {
        token = ''
      }
    }
    let param = []
    param.push(`Authorization=${token}`)
    param.push(`path=${encodeURIComponent(binding.value)}`)
    el.href = `${system.baseURL}/FileManagement/fileDownload?${param.join('&')}`
  },
  update: function (el, binding, vnode) {
    let tokenItem = localStorage.getItem('pro__Access-Token')
    let token = ''
    if (tokenItem) {
      try {
        token = JSON.parse(tokenItem).value
      } catch (err) {
        token = ''
      }
    }
    let param = []
    param.push(`Authorization=${token}`)
    param.push(`path=${encodeURIComponent(binding.value)}`)
    el.href = `${system.baseURL}/FileManagement/fileDownload?${param.join('&')}`
  }
})

export default action

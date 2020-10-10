import Vue from 'vue'
import { login, getInfo, logout, getUserPermission } from '@/api/login'
import { ACCESS_TOKEN, VUE_BOOLEAR } from '@/store/mutation-types'
import defaultHeadUrl from '@/assets/logo.png'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    timeFix:'',
    avatar: '',
    roles: [],
    info: {},
    currentUser: {},
    // vueBoolean: true
    vueBoolean: false
    // userId:'',
    // userName:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_CURRENT_USER: (state, user) => {
      state.currentUser = user
      state.name = user.trueName
      state.avatar = user.headUrl || defaultHeadUrl
    },
    VUE_BOOLEAN: (state, vueBoolean) => {
      state.vueBoolean = vueBoolean
    }
    // SET_USERID: (state, userId) => {
    //   state.userId = userId
    // },
    // SET_USERNAME: (state, userId) => {
    //   state.userId = userId
    // },

  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      //console.log('user.js .....', userInfo)
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          //请求成功，有可能校验失败
          //console.log(response)
          if(response && response.code === 200){
            const result = response.data
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set('CURRENT_USER', JSON.stringify(result.user), 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            commit('SET_CURRENT_USER', result.user)
            commit('SET_NAME', result.user.trueName)
            commit('SET_AVATAR', result.user.headUrl || defaultHeadUrl)
            Vue.ls.set('VUE_BOOLEAN', result.vueBoolean, 7 * 24 * 60 * 60 * 1000)
            commit('VUE_BOOLEAN', result.vueBoolean)
          }
          resolve(response)
        }).catch(error => {
          //请求出错
          console.log(error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserPermission().then(res => {
          const role = res.data.permissions
          commit('SET_ROLES', role)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        state.token = Vue.ls.get(ACCESS_TOKEN)
        Vue.ls.remove(ACCESS_TOKEN)
        logout(state.token).then(() => {
          resolve()
          setTimeout(() => {
            window.location.reload()
          }, 500)
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user

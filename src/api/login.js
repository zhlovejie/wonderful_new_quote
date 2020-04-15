import api from './index'
import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/verification/login',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return axios({
    // baseURL: '/mock',
    url: '/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout (token) {
  return axios({
    baseURL: system.baseURL,
    url: api.Logout,
    method: 'post',
    headers: {
      Authorization: token
    },
  })
}

// 随机数图片验证接口调取
export function turingNumber (param) {
  return axios({
    baseURL: system.baseURL,
    url: '/verification/captcha',
    method: 'get',
    params: param
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
// export function get2step (parameter) {
//   return axios({
//     url: api.twoStepCode,
//     method: 'post',
//     data: parameter
//   })
// }

// 获取登录人的route菜单列表
export function routerListByUser () {
  return axios({
    baseURL: system.baseURL,
    url: '/route/listByUser',
    method: 'get'
  })
}

// 获取登录人的权限集合
export function getUserPermission () {
  return axios({
    baseURL: system.baseURL,
    url: '/route/getUserPermission',
    method: 'get'
  })
}

//获取安卓版本下载地址
export function getAndroidQRCode(){
  return axios({
    baseURL: system.baseURL,
    url: '/android-version/getNewstApkUrl',
    method: 'get'
  })
}
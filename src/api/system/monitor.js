import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

//获取服务器信息
export function getServerInfo () {
  return axios({
    baseURL: system.baseURL,
    url: '/sysOnlineUser/getServerInfo',
    method: 'get'
  })
}

//获取在线人数
export function getOnlineUser (param) {
  return axios({
    baseURL: system.baseURL,
    url: '/sysOnlineUser/getOnlineUser',
    method: 'get',
    params: param
  })
}
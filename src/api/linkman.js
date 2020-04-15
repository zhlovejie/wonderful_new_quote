import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// eslint-disable-next-line no-unused-vars
const api = {
  queryList: '/linkman/queryList',
  del: '/linkman/del',
  checkPhone: '/linkman/checkPhone'
}

// 判断是否有重复的电话
export function checkPhone (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.checkPhone,
    method: 'get',
    params: param
  })
}

// 条件查询联系人列表
export function queryList (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.queryList,
    method: 'get',
    params: param
  })
}

// 删除联系人
export function delLinkman (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.del,
    method: 'post',
    data: param
  })
}

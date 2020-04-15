import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// 延时客户相关接口
const api = {
  saveDelayRecord: '/saleCustomerDelayRecord/saveCustomerDelayRecord',
  getSaleInfo: '/saleCustomerDelayRecord/getSaleUserInfo',
  listCustomerDelayRecord: '/saleCustomerDelayRecord/pageList'
}

// 新增客户延时
export function saveDelayRecord (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.saveDelayRecord,
    method: 'post',
    data: param
  })
}

// 获取客户延时列表
export function listCustomerDelayRecord (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.listCustomerDelayRecord,
    method: 'get',
    params: parameter
  })
}
// 根据客户id获取销售信息
export function getSaleInfo (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getSaleInfo,
    method: 'get',
    params: parameter
  })
}




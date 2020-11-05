import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

/**
 * 获取预收款单列表信息
 * @param parameter
 * @returns {*}
 */
export function getServiceList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/advances/pageList',
    method: 'get',
    params: parameter
  })
}

/**预收款单 撤回 */
export function revocationAdvances (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/advances/revocation',
    method: 'get',
    params: parameter
  })
}

/**
 * 去列表页面
 * @param parameter
 * @returns {*}
 */
export function goAdd (parameter) {
  console.log('advances goAdd' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/advances/goAdd',
    method: 'get'
  })
}

/**
 * 预收款单新增
 * @param parameter
 * @returns {*}
 */
export function advancesSave (parameter) {
  console.log('advances advancesSave' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/advances/advancesSave',
    method: 'post',
    data: parameter
  })
}

/**
 * 预收款单详情查询
 * @param parameter
 * @returns {*}
 */
export function advancesDetail (parameter) {
  console.log('advances advancesSave' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/advances/advancesDetail/' + parameter.id,
    method: 'get'
  })
}

/**
 * 预收款单详情查询
 * @param parameter
 * @returns {*}
 */
export function advancesAudit (parameter) {
  console.log('advances advancesAudit' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/advances/advancesAudit',
    method: 'post',
    data: parameter
  })
}

/**
 * 预收款单详情查询
 * @param parameter
 * @returns {*}
 */
export function deleteById (parameter) {
  console.log('advances advancesAudit' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/advances/delete/' + parameter.id,
    method: 'delete'
  })
}

/**
 * 预收款单更新
 * @param parameter
 * @returns {*}
 */
export function advancesUpdate (parameter) {
  debugger
  console.log('advances advancesUpdate' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/advances/updateAdvances',
    method: 'post',
    data: parameter
  })
}
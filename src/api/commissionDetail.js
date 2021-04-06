import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

/**
 * 产品提成明细-人员提成明细
 * @param {object} params
 * @returns
 */
export function realityPercentageHisDetail(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/percentageBouns/realityPercentageHis/getSaleOrderPercentageDifDetail',
    method: 'GET',
    params: params
  })
}

/**
 * 产品提成明细-人员提成列表
 * @param {object} params
 * @returns
 */
 export function realityPercentageHisList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/percentageBouns/realityPercentageHis/pageList',
    method: 'GET',
    params: params
  })
}

/**
 * 产品提成明细-差额记录明细
 * @param {object} params
 * @returns
 */
 export function percentageDifHisDetail(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/percentageBouns/percentageDifHis/difDetail',
    method: 'GET',
    params: params
  })
}


/**
 * 产品提成明细-差额记录列表
 * @param {object} params
 * @returns
 */
 export function percentageDifHisList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/percentageBouns/percentageDifHis/pageList',
    method: 'GET',
    params: params
  })
}


/**
 * 研发智能产品明细-部门提成明细详情
 * @param {object} params
 * @returns
 */
 export function developmentRealityPercentageHisDetail(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/percentageBouns/developmentRealityPercentageHis/getSaleOrderPercentageDifDetai',
    method: 'GET',
    params: params
  })
}

/**
 * 研发智能产品明细-部门提成明细列表
 * @param {object} params
 * @returns
 */
 export function developmentRealityPercentageHisList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/percentageBouns/developmentRealityPercentageHis/pageList',
    method: 'GET',
    params: params
  })
}

/**
 * 研发智能产品明细-差额记录明细
 * @param {object} params
 * @returns
 */
 export function developmentDifPercentageHisDetail(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/percentageBouns/developmentDifPercentageHis/difDetail',
    method: 'GET',
    params: params
  })
}

/**
 * 研发智能产品明细-差额记录列表
 * @param {object} params
 * @returns
 */
 export function developmentDifPercentageHisList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/percentageBouns/developmentDifPercentageHis/pageList',
    method: 'GET',
    params: params
  })
}

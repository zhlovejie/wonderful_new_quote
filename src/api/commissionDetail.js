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

/**
 * 销售部订单提成分析表-详情
 * @param {object} params
 * @returns
 */
 export function saleOrderPercentageAnalysysDetail(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/percentageBouns/saleOrderPercentageAnalysys/getOrderDetail',
    method: 'GET',
    params: params
  })
}

/**
 * 销售部订单提成分析表-列表
 * @param {object} params
 * @returns
 */
 export function saleOrderPercentageAnalysysList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/percentageBouns/saleOrderPercentageAnalysys/pageList',
    method: 'GET',
    params: params
  })
}



//销售提成奖金
/** 销售提成的审批 */
export function approvalSalaryMonthInstanceApply (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/oa-salary-saler-bouns-apply/approvalSalaryMonthInstanceApply',
    method: 'post',
    data: parameter
  })
}

/** 销售提成数据的导出下载 */
export function exportSalaryExcel(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/oa-salary-saler-bouns-apply/exportSalaryExcel',
    method: 'GET',
    responseType: 'blob',
    params: params
  })
}

/** 销售提成业绩详情查询 */
export function getOaSalarySalerBounsApplyDetail(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/oa-salary-saler-bouns-apply/getOaSalarySalerBounsApplyDetail',
    method: 'GET',
    params: params
  })
}

/** 销售提成业绩分页列表 */
export function getOaSalarySalerBounsApplyPageList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/oa-salary-saler-bouns-apply/pageList',
    method: 'GET',
    params: params
  })
}

/** 销售提成业绩申请的删除 */
export function removeSalarySalerBounsApply (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/oa-salary-saler-bouns-apply/removeSalarySalerBounsApply',
    method: 'post',
    data: parameter
  })
}

/** 销售提成业绩申请的撤回 */
export function withdrawSalarySalerBounsApply (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/oa-salary-saler-bouns-apply/withdrawSalarySalerBounsApply',
    method: 'post',
    data: parameter
  })
}

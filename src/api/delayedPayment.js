import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

/**
 * 延迟付款单列表
 * @param parameter
 * @returns {*}
 */
export function getDelayedList (parameter) {
  console.log('getDelayedList  : ' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/delayedPayment/getPageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 延迟付款单编号
 * @param parameter
 * @returns {*}
 */
export function getDelayedNum (parameter) {
  console.log('getDelayedNum  : ' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/delayedPayment/getDelayedNum',
    method: 'get',
    params: parameter
  })
}

/**
 * 根据合同id获取当前已发货产品列表
 * @param parameter
 * @returns {*}
 */
export function getDeliverProductList (parameter) {
  console.log('getDeliverProductList manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/invoice/getListByContractId',
    method: 'get',
    params: parameter
  })
}
/**
 * 根据合同id获取合同信息
 * @param parameter
 * @returns {*}
 */
export function getContractById (parameter) {
  console.log('getContractById manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/queryOne',
    method: 'get',
    params: parameter
  })
}

export function getUnshipped (parameter) {
  console.log('getUnshipped manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/delayedProduct/getUnshipped',
    method: 'get',
    params: parameter
  })
}

/**
 * 保存延迟付款单产品信息
 * @param parameter
 * @returns {*}
 */
export function saveDelayedPayment (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/delayedPayment/saveDelayedPayment',
    method: 'post',
    data: parameter
  })
}
/**
 * 审批
 * @param parameter
 * @returns {*}
 */
export function auditDelayed (parameter) {
  console.log('auditDelayed manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/delayedPayment/auditDelayed',
    method: 'post',
    data: parameter
  })
}
/**
 * 重新提交/修改延迟发货单
 * @param parameter
 * @returns {*}
 */
export function updateDelayedPayment (parameter) {
  console.log('updateDelayedPayment manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/delayedPayment/updateDelayedPayment',
    method: 'post',
    data: parameter
  })
}
/**
 * 改变发货单状态
 * @param parameter
 * @returns {*}
 */
export function changeState (parameter) {
  console.log('changeState manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/delayedPayment/changeState',
    method: 'post',
    data: parameter
  })
}
/**
 * 上传欠款单
 * @param parameter
 * @returns {*}
 */
export function changeWordUrl (parameter) {
  console.log('changeState manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/delayedDebt/changeWordUrl',
    method: 'post',
    data: parameter
  })
}


/**
 * 根据软件合同id获取软件合同信息
 * @param parameter
 * @returns {*}
 */
export function getSoftContractById (parameter) {
  console.log('getSoftContractById manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/queryOne',
    method: 'get',
    params: parameter
  })
}
/**延时付款单 撤回 */
export function revocationDelayedPayment (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/delayedPayment/revocation',
    method: 'get',
    params: parameter
  })
}

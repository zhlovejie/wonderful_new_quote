import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

export function deleteInvoice (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/invoice/delete',
    method: 'post',
    data: parameter
  })
}

// 获取发货单列表
export function getInvoiceList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/invoice/getPageList',
    method: 'get',
    params: parameter
  })
}
// 获取发货编号
export function getInvoiceNum (parameter) {
  console.log('获取发货编号', parameter)
  return axios({
    baseURL: system.baseURL,
    url: '/invoice/invoiceNum',
    method: 'get',
    params: parameter
  })
}
/**
 * 发货单 查询合同列表
 * @param parameter
 * @returns {*}
 */
export function invoiceSaleContract (parameter) {
  console.log('invoiceSaleContract manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/listContract',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取合同详细信息
 * @param parameter
 * @returns {*}
 */
export function getContractOne (parameter) {
  console.log('getContractOne manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/queryOne',
    method: 'get',
    params: parameter
  })
}

/**
 * 添加发货单数据
 * @param parameter
 * @returns {*}
 */
export function save (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/invoice/save',
    method: 'post',
    data: parameter
  })
}

/**
 * 驳回重新提交发货单数据
 * @param parameter
 * @returns {*}
 */
export function updateInvoice (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/invoice/updateInvoice',
    method: 'post',
    data: parameter
  })
}


/**
 * 审批
 * @param parameter
 * @returns {*}
 */
export function auditInvoice (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/invoice/auditInvoice',
    method: 'post',
    data: parameter
  })
}
/**
 * 修改状态，是否完结
 * @param parameter
 * @returns {*}
 */
export function update (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/invoice/update',
    method: 'post',
    data: parameter
  })
}

/**
 * 根据发货单获取发货产品
 * @param parameter
 * @returns {*}
 */
export function getProductById (parameter) {
  console.log('getProductById manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/invoiceProduct/getProductById',
    method: 'get',
    params: parameter
  })
}

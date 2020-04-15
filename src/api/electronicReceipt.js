import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

export function deleteReceipt (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/electronicReceipt/delete',
    method: 'post',
    data: parameter
  })
}

export function getReceiptList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/electronicReceipt/query',
    method: 'get',
    params: parameter
  })
}
export function goDownload (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/electronicReceipt/download',
    method: 'post',
    data: parameter
  })
}
export function saveReceipt (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/electronicReceipt/save',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
// 根据输入金额，自动转换成大写
export function getRmb (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/electronicReceipt/rmb',
    method: 'get',
    params: parameter
  })
}
export function getReceiptCode (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/electronicReceipt/ReceiptCode',
    method: 'get',
    params: parameter
  })
}
export function listSaleUser (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salesman/getAllSalesman',
    method: 'get',
    params: parameter
  })
}

/**
 * 电子收据 查询合同列表
 * @param parameter
 * @returns {*}
 */
export function receiptSaleContract (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/listContract',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取所有客户
 * @param parameter
 * @returns {*}
 */
export function receiptSaleCustomer (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/customer/listCustomer',
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
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/queryOne',
    method: 'get',
    params: parameter
  })
}

/**
 * 根据获取财务章
 * @param parameter
 * @returns {*}
 */
export function getByCode (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/commonSeal/getByCode',
    method: 'get',
    params: parameter
  })
}

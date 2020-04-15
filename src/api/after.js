
import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

/**
 * 获取售后任务单列表信息
 * @param parameter
 * @returns {*}
 */
export function getServiceList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/after-sale/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 去新增页面
 * @param parameter
 * @returns {*}
 */
export function goAdd (parameter) {
  console.log('goAdd manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/after-sale/goAdd',
    method: 'get',
    params: parameter
  })
}

/**
 * 查询发货单列表
 * @param parameter
 * @returns {*}
 */
export function listInvoiceByContractId (parameter) {
  console.log('listInvoiceByContractId manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/invoice/listInvoiceByContractId/' + parameter.id,
    method: 'get'
  })
}

/**
 * 保存发货单据
 * @param parameter
 * @returns {*}
 */
export function afterSave (parameter) {
  console.log('afterSave manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/after-sale/save',
    method: 'post',
    data: parameter
  })
}

/**
 * 根据id查询发货单详情
 * @param parameter
 * @returns {*}
 */
export function detailById (parameter) {
  console.log('detailById manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/after-sale/detailById/' + parameter.id,
    method: 'get'
  })
}

/**
 * 根据id查询发货单详情
 * @param parameter
 * @returns {*}
 */
export function afterAudit (parameter) {
  console.log('afterAudit manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/after-sale/afterAudit/',
    method: 'put',
    data: parameter
  })
}

/**
 * 查询售后人员（全部）
 * @param parameter
 * @returns {*}
 */
export function listUserByAfterSale (parameter) {
  console.log('listUserByAfterSale manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/user/listUserByAfterSale/',
    method: 'get'
  })
}

/**
 * 删除单据
 * @param parameter
 * @returns {*}
 */
export function deleteAfterSale (parameter) {
  console.log('deleteAfterSale manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/after-sale/deleteSaleAfter/' + parameter.id,
    method: 'delete'
  })
}

/**
 * 修改单据
 * @param parameter
 * @returns {*}
 */
export function updateAfterSale (parameter) {
  console.log('updateSaleAfter manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/after-sale/updateSaleAfter/',
    method: 'put',
    data: parameter
  })
}

/**
 * 保存发货单据
 * @param parameter
 * @returns {*}
 */
export function afterUpdate (parameter) {
  console.log('afterUpdate manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/after-sale/update',
    method: 'post',
    data: parameter
  })
}

/**
 * 根据发货单获取发货产品
 * @param parameter
 * @returns {*}
 */
export function invoiceDetailById (parameter) {
  console.log('invoiceDetailById manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/invoice/detailById/' + parameter.id,
    method: 'get'
  })
}
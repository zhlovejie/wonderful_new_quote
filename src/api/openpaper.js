import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

/**
 * 获取软件合同和开票单相关的详情
 * @param {id} parameter 
 */
export function softwareContractDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/getForOpenPaper',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取开票申请单列表信息
 * @param parameter
 * @returns {*}
 */
export function getServiceList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/openpaper/list',
    method: 'get',
    params: parameter
  })
}

/**
 * 去新增页面
 * @param parameter
 * @returns {*}
 */
export function goAdd () {
  return axios({
    baseURL: system.baseURL,
    url: '/openpaper/goAdd',
    method: 'get'
  })
}

/**
 * 获取合同详细信息
 * @param parameter
 * @returns {*}
 */
export function getContractOne (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/queryOne',
    method: 'get',
    params: parameter
  })
}

/**
 * 保存开票申请单
 * @param parameter
 * @returns {*}
 */
export function openPaperSave (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/openpaper/addPaper',
    method: 'post',
    data: parameter
  })
}

/**
 * 保存开票申请单
 * @param parameter
 * @returns {*}
 */
export function openPaperDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/openpaper/detail/' + parameter.id,
    method: 'get'
  })
}


/**
 * 获取录入开票单时录入的产品信息列表
 * @param parameter
 * @returns {*}
 */
export function getPaperProduct (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/openpaper/listPaperProduct/',
    method: 'get',
    params:parameter
  })
}



/**
 * 开票申请单审核
 * @param parameter
 * @returns {*}
 */
export function openPaperAudit (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/openpaper/openPaperAudit',
    method: 'put',
    data: parameter
  })
}

/**
 * 开票申请单删除
 * @param parameter
 * @returns {*}
 */
export function openPaperDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/openpaper/openPaperDelete/' + parameter.id,
    method: 'delete'
  })
}

/**
 * 开票更新
 * @param parameter
 * @returns {*}
 */
export function updatePaper (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/openpaper/updatePaper',
    method: 'post',
    data: parameter
  })
}

/**开票单 撤回 */
export function revocationOpenpaper (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/openpaper/revocation',
    method: 'get',
    params: parameter
  })
}



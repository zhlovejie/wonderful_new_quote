import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

// 核价模块接口

// 核价人添加产品代码和名称
export function addCodeAndName(parameter) {
  console.log('param===', parameter)
  return axios({
    baseURL: system.baseURL,
    url: '/api/saleValency/addCodeAndName',
    method: 'post',
    data: parameter
  })
}

// 核价单提交人员提交申请产品代码和名称
export function applyForCode(parameter) {
  console.log('param===', parameter)
  return axios({
    baseURL: system.baseURL,
    url: '/api/saleValency/applyForCode',
    method: 'post',
    data: parameter
  })
}

// 根据核价单查询核价产品列表
export function listByValency(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleValencyProduct/listByValency',
    method: 'get',
    params: parameter
  })
}

// 获取核价列表
export function getPriceList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/api/saleValency',
    method: 'get',
    params: parameter
  })
}

// 获取核价流水号、客户信息下拉、核价用户下拉列表
export function getSelectsList() {
  return axios({
    baseURL: system.baseURL,
    url: '/api/saleValency/getValencyCode',
    method: 'get'
  })
}

// 核价订单添加(申请)
export function priceOrderAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/api/saleValency',
    method: 'post',
    data: parameter
  })
}

// 新增修改统一使用 核价订单添加 (申请)
export function saleValencySaveAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/api/saleValencySaveAndUpdate',
    method: 'post',
    data: parameter
  })
}

// 获取客户信息
export function getCustomerInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/customer/getById/${parameter.id}`,
    method: 'get'
  })
}

// 获取节点信息 审批预览
export function getSaleValencyInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/api/saleValency/node/${parameter.id}`,
    method: 'get'
  })
}

// 调取订单详情查询 接口
export function getlookApplyNuclear(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/api/saleValency/${parameter.id}`,
    method: 'get'
  })
}
// 订单接受或者驳回
export function ifReception(parameter) {
  return axios({
    baseURL: system.baseURL,
    // url: '/api/saleValency',
    url: '/api/saleValencyUpdateStatus',
    method: 'PUT',
    data: parameter
  })
}

// 核价订单删除 接口
export function deleteNuclear(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/api/deleteSaleValency/${parameter.id}`,
    method: 'DELETE'
  })
}
// 核价保存
export function saveProduct(parameter) {
  console.log('在接口的js里面打印parameter', parameter)
  return axios({
    baseURL: system.baseURL,
    url: '/api/saleValency/audit',
    method: 'PUT',
    data: parameter
  })
}
// 核价重新提交
export function commit(parameter) {
  console.log('在接口的js里面打印parameter', parameter)
  return axios({
    baseURL: system.baseURL,
    url: '/api/saleValency/commit',
    method: 'PUT',
    data: parameter
  })
}

// 校验产品代码是否重复
export function isRepeatCode(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/api/saleValency/isRepeatCode?newBasisModel=${parameter.newBasisModel}`,
    method: 'get'
  })
}


// 核价修改
export function updateValencyProduct(parameter) {
  console.log('在接口的js里面打印parameter', parameter)
  return axios({
    baseURL: system.baseURL,
    url: '/api/saleValency/updateValencyProduct',
    method: 'POST',
    data: parameter
  })
}

/**核价单 撤回 */
export function revocationPriceList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/api/revocation',
    method: 'get',
    params: parameter
  })
}

//根据核价单id获取没有生成任务单的核价产品
///
export function listValencyDevelopment(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'api/listValencyDevelopment',
    method: 'get',
    params: parameter
  })
}
//任务单新增
export function taskaddAndUpdateDevelopment(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-info/addAndUpdateDevelopment',
    method: 'POST',
    data: parameter
  })
}

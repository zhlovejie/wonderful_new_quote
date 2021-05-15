import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// eslint-disable-next-line no-unused-vars
const api = {
  getDepList: '/customer/getDepList',
  getAllSalesMan: '/salesman/getAllSalesman',
  getArea: '/areaDic/queryList',
  addCustomer: '/customer/add',
  delCustomer: '/customer/del',
  checkName: '/customer/checkName',
  giveUp: '/customer/giveUp',
  allAgency: '/customer/allAgency',
  salesJurisdiction: '/salesman/salesJurisdiction',
  getOneCustomer: '/customer/getOneCustomer',
  editCustomer: '/customer/edit',
  getCustomerVo: '/customer/getCustomerVo',
  getCommonList: '/customer/getCommonList',
  getChangeRecord: '/customerChange/getChangeRecord',
  getALLList: '/customer/getAllList',
  getAllEnter: '/customer/getAllEnter',
  addContactNum: '/customer/addContactNum',
  reAllocate: '/customer/reAllocate',
  callRecordList: '/callRecord/recordList',
  extractCustomer: '/customer/extractCustomer',
  modifyRemainingTime:'/customer/modifyRemainingTime'
}

// 提取客户
export function extractCustomer (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.extractCustomer,
    method: 'get',
    params: param
  })
}

// 根据客户获取该客户的通话记录
export function callRecordList (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.callRecordList,
    method: 'get',
    params: param
  })
}

// 客服人员联系公共客户觉得有价值之后重新分配客户
export function reAllocate (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.reAllocate,
    method: 'post',
    params: param
  })
}

// 增加客服人员打过电话的次数（+1）
export function addContactNum (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.addContactNum,
    method: 'post',
    params: param
  })
}

// 获取所有客户录入人
export function getAllEnter () {
  return axios({
    baseURL: system.baseURL,
    url: api.getAllEnter,
    method: 'get'
  })
}

// 获取所有客户列表
export function getAllList (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getALLList,
    method: 'get',
    params: param
  })
}

// 获取客户变更记录
export function getChangeRecord (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getChangeRecord,
    method: 'get',
    params: param
  })
}

// 获取公共客户分页列表
export function getCommonList (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getCommonList,
    method: 'get',
    params: param
  })
}

// 获取单个客户信息详情
export function getCustomerVo (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getCustomerVo,
    method: 'get',
    params: param
  })
}

/**修改和客户的剩余联系时长 */
export function modifyRemainingTime (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.modifyRemainingTime,
    method: 'POST',
    data: param
  })
}

// 修改客户
export function editCustomer (param) {
  return axios({
    baseURL: system.baseURL,
    headers: {
      Authorization: param.token
    },
    url: api.editCustomer,
    method: 'post',
    data: param
  })
}

// 获取单个客户信息
export function getOneCustomer (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getOneCustomer,
    method: 'get',
    params: param
  })
}

// 查询当前用户的销售相关权限
export function salesJurisdiction () {
  return axios({
    baseURL: system.baseURL,
    url: api.salesJurisdiction,
    method: 'get'
  })
}

// 获取所有代理商
export function allAgency () {
  return axios({
    baseURL: system.baseURL,
    url: api.allAgency,
    method: 'get'
  })
}

// 销售人员放弃客户
export function giveUp (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.giveUp,
    method: 'post',
    data: parameter
  })
}

// 部门客户列表
export function getDepList (parameter) {
  return axios({
    headers: {
      'Authorization': parameter.token
    },
    baseURL: system.baseURL,
    url: api.getDepList,
    method: 'get',
    params: parameter
  })
}

// 所有销售人员
export function getAllSalesMan (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getAllSalesMan,
    method: 'get',
    params: param
  })
}

// 根据父id查询区域
export function getArea (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getArea,
    method: 'get',
    params: param
  })
}

// 新增客户
export function addCustomer (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.addCustomer,
    method: 'post',
    data: param
  })
}

// 删除客户
export function delCustomer (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.delCustomer,
    method: 'post',
    params: param
  })
}

// 判断是否有重复的客户名
export function checkName (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.checkName,
    method: 'get',
    params: param
  })
}

/** 未维护获知渠道列表 */
export function customerListForLearn (param) {
  return axios({
    baseURL: system.baseURL,
    url: '/customer/listForLearn',
    method: 'get',
    params: param
  })
}

/** 获取重复的客户 */
export function customerrepetitionNames (param) {
  axios.timeout = 300000
  return axios({
    baseURL: system.baseURL,
    url: '/customer/repetitionNames',
    method: 'get',
    params: param
  })
}

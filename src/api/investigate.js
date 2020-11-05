import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

export function getServiceList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/investigate/query',
    method: 'get',
    // headers: {
    //   Authorization: parameter.token
    // },
    params: parameter
  })
}

export function goAdd (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/investigate/goAdd',
    method: 'get',
    params: parameter
  })
}

export function investigateSave (parameter) {
  const token = parameter.token
  return axios({
    baseURL: system.baseURL,
    url: '/investigate/save',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: parameter
  })
}

//修改项目备案
export function investigateUpdate (parameter) {
  const token = parameter.token
  return axios({
    baseURL: system.baseURL,
    url: '/investigate/updateInvestigate',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: parameter
  })
}

export function deleteInvestigate (parameter) {
  const url = '/investigate/delete/' + parameter.id
  return axios({
    baseURL: system.baseURL,
    url: url,
    method: 'delete'
  })
}

export function saleCustomerLook (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/customer/getById/' + parameter.saleCustomerId,
    method: 'get'
  })
}

export function queryByCustomerId (parameter) {
  const url = '/customer/getById/' + parameter.id
  return axios({
    baseURL: system.baseURL,
    url: url,
    method: 'get'
  })
}

export function getNodeList (parameter) {
  const url = '/investigate/getNode/' + parameter.instanceId
  return axios({
    baseURL: system.baseURL,
    url: url,
    method: 'get'
  })
}

export function getInvestigate (parameter) {
  const url = '/investigate/getInvestigate/' + parameter.id + '/' + parameter.type
  return axios({
    baseURL: system.baseURL,
    url: url,
    method: 'get'
  })
}

export function auditInvestigate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/investigate/auditInvestigate',
    method: 'post',
    data: parameter
  })
}

export function customerList () {
  return axios({
    baseURL: system.baseURL,
    url: '/customer/listAll',
    method: 'get'
  })
}


//--------------------新项目备案----------------
//项目备案列表
export function saleRecordPageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRecord/getPageList',
    method: 'get',
    params: parameter
  })
}
//项目备案删除
export function saleRecordDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRecord/delRecord',
    method: 'get',
    params: parameter
  })
}
//项目备案新增和修改
export function saleRecordSaveAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRecord/saveAndUpdateRecord',
    method: 'post',
    data: parameter
  })
}
//项目备案审批
export function saleRecordApproval (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRecord/Approval',
    method: 'post',
    data: parameter
  })
}
//--------------------新项目备案--END-----------

//项目备案撤回
export function saleRecordRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRecord/revocation',
    method: 'get',
    params: parameter
  })
}

//项目授权撤回
export function investigateRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/investigate/revocation',
    method: 'get',
    params: parameter
  })
}
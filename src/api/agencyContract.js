import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'
// 代签合同接口
export function purchaseList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/purchase-contract/pageList',
    method: 'get',
    params: params
  })
}




//产品售后服务外包协议列表
export function afterList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/after-outsource-protocol/pageList',
    method: 'get',
    params: params
  })
}

// 投标借用撤回
export function afterrevocation(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/after-outsource-protocol/revocation',
    method: 'post',
    data: params
  })
}
// 投标借用删除
export function afterdelete(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/after-outsource-protocol/delete',
    method: 'post',
    data: params
  })
}
// 投标借用详情
export function afterdetail(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/after-outsource-protocol/detail',
    method: 'get',
    params: params
  })
}

// 投标借用修改 新增
export function afteraddOrUpdate(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/after-outsource-protocol/addOrUpdate',
    method: 'post',
    data: params
  })
}
// 投标借用审批
export function afteraddOrapprove(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/after-outsource-protocol/approve',
    method: 'post',
    data: params
  })
}








// 投标借用列表 
export function bidList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/bid-borrow-protocol/pageList',
    method: 'get',
    params: params
  })
}
// 投标借用撤回
export function bidrevocation(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/bid-borrow-protocol/revocation',
    method: 'post',
    data: params
  })
}
// 投标借用删除
export function biddelete(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/bid-borrow-protocol/delete',
    method: 'post',
    data: params
  })
}
// 投标借用列表详情 
export function biddetail(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/bid-borrow-protocol/detail',
    method: 'get',
    params: params
  })
}
// 投标借用修改
export function bidaddOrUpdat(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/bid-borrow-protocol/addOrUpdate',
    method: 'post',
    data: params
  })
}
// 投标借用审批
export function bidapprove(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/bid-borrow-protocol/approve',
    method: 'post',
    data: params
  })
}









// 经营借用列表
export function businessList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/business-borrow-protocol/pageList',
    method: 'get',
    params: params
  })
}

// 经营借用列表详情 
export function businessdetail(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/business-borrow-protocol/detail',
    method: 'get',
    params: params
  })
}
// 经营借用列表撤回
export function businessrevocation(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/business-borrow-protocol/revocation',
    method: 'post',
    data: params
  })
}
// 经营借用列表修改
export function businessaddOrUpdate(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/business-borrow-protocol/addOrUpdate',
    method: 'post',
    data: params
  })
}
// 经营借用列表审批
export function businessapprove(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/business-borrow-protocol/approve',
    method: 'post',
    data: params
  })
}
// 经营借用删除
export function businessdelete(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/business-borrow-protocol/delete',
    method: 'post',
    data: params
  })
}






//代理合同接口

/**新增或修改 */
export function agencyContractAddOrUpdate(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/addOrUpdate',
    method: 'post',
    data: params
  })
}

export function agencyContractApprove(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/approve',
    method: 'post',
    data: params
  })
}

export function agencyContractDel(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/delete',
    method: 'post',
    data: params
  })
}

export function agencyContractDetail(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/detail',
    method: 'get',
    params: params
  })
}

/**获取合同流水号 */
export function agencyContractGenerateContractNum(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/generateContractNum',
    method: 'get',
    params: params
  })
}

export function agencyContractPageList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/pageList',
    method: 'get',
    params: params
  })
}

export function agencyContractGenerateFDF(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/generateFDF',
    method: 'post',
    data: params
  })
}

export function agencyContractRevocation(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/revocation',
    method: 'post',
    data: params
  })
}


export function agencyContractAttachmentAddOrUpdate(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContractAttachment/addOrUpdate',
    method: 'post',
    data: params
  })
}

export function agencyContractAttachmentDel(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContractAttachment/delete',
    method: 'post',
    data: params
  })
}

export function agencyContractAttachmentList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContractAttachment/list',
    method: 'post',
    data: params
  })
}

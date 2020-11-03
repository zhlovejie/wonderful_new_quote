import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'
//代理合同接口

/**新增或修改 */
export function agencyContractAddOrUpdate (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/addOrUpdate',
    method: 'post',
    data: params
  })
}

export function agencyContractApprove (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/approve',
    method: 'post',
    data: params
  })
}

export function agencyContractDel (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/delete',
    method: 'post',
    data: params
  })
}

export function agencyContractDetail (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/detail',
    method: 'get',
    params: params
  })
}

/**获取合同流水号 */
export function agencyContractGenerateContractNum (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/generateContractNum',
    method: 'get',
    params: params
  })
}

export function agencyContractPageList (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/pageList',
    method: 'get',
    params: params
  })
}

export function agencyContractGenerateFDF (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/generateFDF',
    method: 'post',
    data: params
  })
}

export function agencyContractRevocation (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/revocation',
    method: 'post',
    data: params
  })
}


export function agencyContractAttachmentAddOrUpdate (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContractAttachment/addOrUpdate',
    method: 'post',
    data: params
  })
}

export function agencyContractAttachmentDel (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContractAttachment/delete',
    method: 'post',
    data: params
  })
}

export function agencyContractAttachmentList (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContractAttachment/list',
    method: 'post',
    data: params
  })
}
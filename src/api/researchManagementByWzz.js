import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

//---------------------项目节点选项配置-----------------------

//模式详情查询
export function schemeNodeRelationDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-scheme-node-relation/getSchemeNodeInfoDetail',
    method: 'get',
    params: parameter
  })
}

//模式列表查询
export function schemeNodeRelationList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-scheme-node-relation/listSchemeNodeRelation',
    method: 'get',
    params: parameter
  })
}

export function schemeNodeRelationDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-scheme-node-relation/removeSchemeNodeInfo',
    method: 'post',
    data: parameter
  })
}

export function schemeNodeRelationAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-scheme-node-relation/saveSchemeNodeInfo',
    method: 'post',
    data: parameter
  })
}

export function schemeNodeRelationUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-scheme-node-relation/updateSchemeNodeInfo',
    method: 'post',
    data: parameter
  })
}

//---------------------项目节点选项配置-----------------------

//---------------------项目节点关联项配置-----------------------

export function nodeInfoDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/node-info/getNodeInfoDetail',
    method: 'get',
    params: parameter
  })
}

export function nodeInfoList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/node-info/listNodeInfo',
    method: 'get',
    params: parameter
  })
}

export function nodeInfoDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/node-info/removeNodeInfo',
    method: 'post',
    data: parameter
  })
}

export function nodeInfoAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/node-info/saveNodeInfo',
    method: 'post',
    data: parameter
  })
}

export function nodeInfoUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/node-info/updateNodeInfo',
    method: 'post',
    data: parameter
  })
}

//---------------------项目节点关联项配置-----------------------

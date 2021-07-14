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

export function nodeInfoListAll(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/node-info/listNodeInfoAll',
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


//---------------------项目列表(项目进度管理)-----------------------

//分页查询项目列表(管理人员所用)
export function listProjectAllPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-all-info/listProjectAllInfo',
    method: 'get',
    params: parameter
  })
}

//查询项目详情
export function listProjectAllDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-all-info/getProjectAllInfoDetail',
    method: 'get',
    params: parameter
  })
}

//项目新增
export function listProjectAllAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-all-info/saveProductAllInfo',
    method: 'post',
    data: parameter
  })
}

//项目修改
export function listProjectAllUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-all-info/updateProductAllInfo',
    method: 'post',
    data: parameter
  })
}

//完结项目
export function finishProjectStatus(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-all-info/finishProjectStatus',
    method: 'post',
    data: parameter
  })
}

//更换项目负责人
export function changeProductChargeUser(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/project/development-project-all-info/changeProductChargeUser',
    method: 'post',
    data: parameter
  })
}

//---------------------项目列表(项目进度管理)-----------------------

import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

//研发管理
//---------------------图纸权限-----------------------
export function blueprintPermissionList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintPermission/pageList',
    method: 'get',
    params: parameter
  })
}

export function blueprintPermissionDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintPermission/delete',
    method: 'post',
    data: parameter
  })
}

export function blueprintPermissionAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintPermission/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

//---------------------图纸权限 END-----------------------

//---------------------图纸管理-----------------------
export function blueprintMenuTreeList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/treeList',
    method: 'get',
    params: parameter
  })
}
export function blueprintMenuPageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/pageList',
    method: 'get',
    params: parameter
  })
}

export function blueprintMenuDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/detail',
    method: 'get',
    params: parameter
  })
}

export function blueprintMenuDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/delete',
    method: 'get',
    params: parameter
  })
}

export function blueprintMenuAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------图纸管理 END-----------------------
import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// 菜单路由模块接口
const api = {
  routeListPage: '/route/listPage',
  listByUser: '/route/listByUser',
  routeTreeList: '/route/treeList',
  saveRoute: '/route/save',
  checkCode: '/route/checkCode',
  deleteRoute: '/route/del',
  updateRoute: '/route/update',
  getById: '/route/getById',
  checkName: 'route/checkName'
}
// 根据id查询
export function getById (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getById,
    method: 'get',
    params: param
  })
}

// 获取登录人的树形菜单列表
export function listByUser (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.listByUser,
    method: 'get',
    params: param
  })
}

// 菜单分页列表
export function routeListPage (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.routeListPage,
    method: 'get',
    params: param
  })
}

// 树形列表
export function routeTreeList () {
  return axios({
    baseURL: system.baseURL,
    url: api.routeTreeList,
    method: 'get'
  })
}

// 新增
export function saveRoute (data) {
  return axios({
    baseURL: system.baseURL,
    url: api.saveRoute,
    method: 'post',
    data: data
  })
}

// 判断是否有重复的路由名称
export function checkName (data) {
  return axios({
    baseURL: system.baseURL,
    url: api.checkName,
    method: 'get',
    params: data
  })
}

// 判断是否有重复的菜单编码
export function checkCode (data) {
  return axios({
    baseURL: system.baseURL,
    url: api.checkCode,
    method: 'get',
    params: data
  })
}

// 删除
export function deleteRoute (data) {
  return axios({
    baseURL: system.baseURL,
    url: api.deleteRoute,
    method: 'post',
    data: data
  })
}

// 更新
export function updateRoute (data) {
  return axios({
    baseURL: system.baseURL,
    url: api.updateRoute,
    method: 'post',
    data: data
  })
}

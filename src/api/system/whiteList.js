import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// 白名单模块接口
const api = {
  listPage: '/whiteList/listPage',
  save: '/whiteList/save',
  getOne: '/whiteList/getOne',
  modify: '/whiteList/modify',
  del: '/whiteList/del'
}

// 分页列表
export function listPage (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.listPage,
    method: 'get',
    params: param
  })
}

// 分页列表
export function getOne (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getOne,
    method: 'get',
    params: param
  })
}

// 新增
export function save (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.save,
    method: 'post',
    data: param
  })
}

// 修改
export function modify (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.modify,
    method: 'post',
    data: param
  })
}
// 删除
export function del (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.del,
    method: 'get',
    params: param
  })
}

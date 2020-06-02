import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// 白名单模块接口
const api = {
  listPage: '/sysJob/listJobPage',
  save: '/sysJob/addJob',
  getOne: '/sysJob/getJobDetail',
  modify: '/sysJob/updateJob',
  del: '/sysJob/removeJob',
  pauseOne: '/sysJob/pauseJob',
  resumeOne: '/sysJob/resumeJob',
  pauseAll: '/sysJob/pauseAll',
  resumeAll: '/sysJob/resumeAll'
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
    method: 'post',
    data: param
  })
}

// 暂停单个任务
export function pauseOne (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.pauseOne,
    method: 'post',
    data: param
  })
}

// 恢复单个任务
export function resumeOne (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.resumeOne,
    method: 'post',
    data: param
  })
}

// 暂停全部任务
export function pauseAll () {
  return axios({
    baseURL: system.baseURL,
    url: api.pauseAll,
    method: 'post'
  })
}

// 恢复全部任务
export function resumeAll () {
  return axios({
    baseURL: system.baseURL,
    url: api.resumeAll,
    method: 'post'
  })
}

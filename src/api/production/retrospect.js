import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// 产品追溯模块接口
const api = {
  toProcessList: '/productProcess/toList',
  checkProcessName: '/productProcess/checkName',
  addOrUpdateProcess: '/productProcess/addOrUpdate',
  deleteProcess: '/productProcess/delete',
  toCodeList: '/productCode/toPClist',
  getProcessByCode: '/codeProcess/processList',
  deleteCode: '/productCode/delete',
  checkCodeName: '/productCode/checkCode',
  getAllCodeAndProcess: '/productCode/getAllCodeAndProcess',
  addOrUpdateCode: '/productCode/addOrUpdate',
  toRecordList: '/productRecord/toPCList',
  getProcessByMid: '/productRecord/getProcess',
  deleteRecord: '/productRecord/delete',
  deleteCodeProcess: '/codeProcess/delete'
}

// 软删除产品档案
export function deleteRecord (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.deleteRecord,
    method: 'post',
    params: param
  })
}

// 根据主板号获取工序
export function getProcessByMid (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getProcessByMid,
    method: 'get',
    params: param
  })
}

// 产品档案分页列表
export function toRecordList (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.toRecordList,
    method: 'get',
    params: param
  })
}

// 新增或修改产品代码
export function addOrUpdateCode (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.addOrUpdateCode,
    method: 'post',
    data: param
  })
}

// 硬删除一条产品代码和工序关联的数据
export function deleteCodeProcess (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.deleteCodeProcess,
    method: 'post',
    params: param
  })
}

// 所有的产品代码和工序
export function getAllCodeAndProcess (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getAllCodeAndProcess,
    method: 'get',
    params: param
  })
}

// 判断是否有重复的产品代码名
export function checkCodeName (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.checkCodeName,
    method: 'get',
    params: param
  })
}

// 软删除产品代码
export function deleteCode (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.deleteCode,
    method: 'post',
    params: param
  })
}

// 根据产品代码获取工序
export function getProcessByCode (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getProcessByCode,
    method: 'get',
    params: param
  })
}

// 获取产品代码分页列表
export function toCodeList (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.toCodeList,
    method: 'get',
    params: param
  })
}

// 获取工序分页列表
export function toProcessList (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.toProcessList,
    method: 'get',
    params: param
  })
}

// 判断是否有重复的工序名
export function checkProcessName (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.checkProcessName,
    method: 'get',
    params: param
  })
}

// 新增或者修改
export function addOrUpdateProcess (param) {
  console.log('param', param)
  return axios({
    baseURL: system.baseURL,
    url: api.addOrUpdateProcess,
    method: 'post',
    data: param
  })
}

// 软删除产品工序
export function deleteProcess (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.deleteProcess,
    method: 'post',
    params: param
  })
}

// 导入工序
export function importProductProcess (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productProcess/importExcel',
    method: 'post',
    responseType:'blob',
    data: parameter
  })
}

// 导出产品代码
export function exportProductCode () {
  return `${system.baseURL}/productCode/exportExcel`
}

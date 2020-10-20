import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// 销售人员相关接口
const api = {
  getAllSalesman: '/salesman/getAllSalesman',
  addSalesman: '/salesman/add',
  delSalesman: '/salesman/del',
  editSalesman: '/salesman/edit',
  getOneSalesman: '/salesman/getOneSalesman',
  getAllUser: '/user/getList'
}

// 修改除销售人员
export function editSalesman (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.editSalesman,
    method: 'post',
    data: param
  })
}

// 软删除销售人员
export function delSalesman (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.delSalesman,
    method: 'post',
    data: param
  })
}

// 根据用户id查询销售人员信息
export function getOneSalesman (userId) {
  return axios({
    baseURL: system.baseURL,
    url: api.getOneSalesman,
    method: 'get',
    params: userId
  })
}

//  新增销售人员
export function addSalesman (salesman) {
  return axios({
    baseURL: system.baseURL,
    url: api.addSalesman,
    method: 'post',
    data: salesman
  })
}

// 获取所有销售人员
export function getAllSalesman () {
  return axios({
    baseURL: system.baseURL,
    url: api.getAllSalesman,
    method: 'get'
  })
}

// 获取所有人员
export function getAllUser () {
  return axios({
    baseURL: system.baseURL,
    url: api.getAllUser,
    method: 'get'
  })
}

// 根据领导人id，获取领导人部门下所有销售助理
export function getSaleAssistant (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/salesman/getSaleAssistant',
    method: 'get',
    params:params
  })
}

import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// 获取资质认证列表
export function getQualificationList (parameter) {
  console.log('获取资质认证列表', parameter)
  return axios({
    baseURL: system.baseURL,
    url: '/qualification/toList',
    method: 'get',
    params: parameter
  })
}
// 从字典表获取资质类型列表
export function getQualificationType (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualification/getQualificationType',
    method: 'get',
    params: parameter
  })
}
// 新增资质认证
export function saveQualification (data) {
  console.log('新增资质认证', data)
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/qualification/add',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
// 修改资质认证
export function editQualification (data) {
  console.log('修改资质认证', data)
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/qualification/edit',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
// 删除资质认证
export function delQualification (data) {
  console.log('删除资质认证', data)
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/qualification/del',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}

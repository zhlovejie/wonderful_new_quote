import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'
//监控管理

export function monitoringEquipmentDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/monitoringEquipment',
    method: 'GET',
    params: parameter
  })
}

export function monitoringEquipmentAdd (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/monitoringEquipment',
    method: 'POST',
    data: parameter
  })
}

export function monitoringEquipmentUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/monitoringEquipment',
    method: 'PUT',
    data: parameter
  })
}

export function monitoringEquipmentDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/monitoringEquipment?id=${parameter.id}`,
    method: 'DELETE'
  })
}

export function monitoringEquipmentList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/monitoringEquipment/list',
    method: 'GET',
    params: parameter
  })
}


export function monitoringEquipmentTypeList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/monitoringEquipmentType',
    method: 'GET',
    params: parameter
  })
}

export function monitoringEquipmentTypeAdd (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/monitoringEquipmentType',
    method: 'POST',
    data: parameter
  })
}

export function monitoringEquipmentTypeUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/monitoringEquipmentType',
    method: 'PUT',
    data: parameter
  })
}

export function monitoringEquipmentTypeDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/monitoringEquipmentType?id=${parameter.id}`,
    method: 'DELETE'
  })
}

export function monitoringEquipmentTreeList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/monitoringEquipment/treeList',
    method: 'GET',
    params: parameter
  })
}


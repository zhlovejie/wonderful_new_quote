import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
import {CancelToken} from 'axios'

// 获取部门列表
export function getToolPostExplainList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/toolPostExplain/getPageList',
    method: 'get',
    params: parameter
  })
}

// 获取岗位说明详细
export function getToolPostExplainById (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/toolPostExplain/getInfoById',
    method: 'get',
    params: parameter
  })
}

// 新增岗位说明
export function addToolPostExplain (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/toolPostExplain/addPostExplain',
    method: 'post',
    data: parameter
  })
}


// 修改岗位说明
export function editToolPostExplain (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/toolPostExplain/editPostExplain',
    method: 'post',
    data: parameter
  })
}

// 岗位说明书编号验重
export function verificationSerialNumber (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/toolPostExplain/verification',
    method: 'get',
    params: parameter
  })
}

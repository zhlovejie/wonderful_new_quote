import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
import {CancelToken} from 'axios'

// 人员储备上传
export function reserveImportExcel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/importExcel',
    method: 'post',
    responseType:'blob',
    data: parameter
  })
}

// 人员储备新增或修改
export function reserveAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

//删除人员储备信息 reserveId
export function deleteReserve (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/deleteReserve',
    method: 'get',
    params: parameter
  })
}

// 人员入职
export function reserveDoEntry (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/doEntry',
    method: 'post',
    data: parameter
  })
}

// 下载列表导出excel 
export function reserveExportExcel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/exportExcel',
    method: 'get',
    params: parameter
  })
}

// 获取入职后的用户详情 reserveId
export function reserveGetDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/getDetail',
    method: 'get',
    params: parameter
  })
}

//入职操作时，回显之前储备的用户信息
export function getEntityBeforeDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/getEntityBeforeDetail',
    method: 'get',
    params: parameter
  })
}

//获取人脸识别码 无参数
export function getFaceNo (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/getFaceNo',
    method: 'post',
    data: parameter
  })
}

// 人员储备列表
export function getReserveList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/pageList',
    method: 'get',
    params: parameter
  })
}

//更改已入职人员信息
export function reserveUpdateEntity (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/updateEntity',
    method: 'post',
    data: parameter
  })
}

//上传个人简历
// export function reserveUpdateResume (parameter) {
//   return axios({
//     baseURL: system.baseURL,
//     url: '/reserve/updateResume',
//     method: 'post',
//     data: parameter
//   })
// }

export function reserveUpdateResume (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/updateResume',
    method: 'post',
    data: parameter,
    config:{
      headers: { "Content-Type": "multipart/form-data" }
    }
  })
}

//采集人脸信息，传入照片返回特征值
export function reserveFaceAdd (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/faceAdd',
    method: 'post',
    data: parameter,
    config:{
      headers: { "Content-Type": "multipart/form-data" }
    }
  })
}

//检索人脸，传入照片返回匹配用户
export function reserveFaceSearch (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reserve/faceSearch',
    method: 'post',
    data: parameter,
    config:{
      headers: { "Content-Type": "multipart/form-data" }
    }
  })
}



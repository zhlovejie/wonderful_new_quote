import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
const api = {
  accessVehicle: '/vehicle/oa-access-vehicle-control/page', //车辆列表员工车
  accessVehicleCarList: '/vehicle/oa-access-vehicle-control/pageCarList', //车辆列表班车
  accessControlList: '/vehicle/oa-access-vehicle-control-record/page', //车辆信息类表
  accessExcel: '/vehicle/oa-access-vehicle-control-record/foreign/exportExcel', //车辆信息下载
  getDictionaryList: '/dictionary/getListByCode', //总车辆 
  getPage: '/human/oa-access-human-decency/page', //人行闸机信息列表
  getExportExcel: '/human/oa-access-human-decency/exportExcel', //人行闸机信息列表

}
//车辆列表员工车
export function accessPage(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.accessVehicle,
    method: 'get',
    params: parameter
  })
}

//车辆列表班车
export function accessPageCarList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.accessVehicleCarList,
    method: 'get',
    params: parameter
  })
}

//车辆信息班车
export function accessControlList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.accessControlList,
    method: 'get',
    params: parameter
  })
}

/**下载 */
export function accessExportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.accessExcel,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

// 数据字典

export function getDictionaryList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getDictionaryList,
    method: 'get',
    params: parameter
  })
}

// 人行闸机信息列表
export function getPage(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getPage,
    method: 'get',
    params: parameter
  })
}
// 下载人行闸机信息列表
export function getExportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getExportExcel,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
const api = {
  accessVehicle: '/vehicle/oa-access-vehicle-control/page', //车辆列表员工车
  accessVehicleCarList: '/vehicle/oa-access-vehicle-control/pageCarList', //车辆列表班车
  accessControlList: '/vehicle/oa-access-vehicle-control-record/page', //车辆信息类表
  accessExcel: '/vehicle/oa-access-vehicle-control-record/foreign/exportExcel', //车辆信息下载
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

/**考勤月历下载 */
export function accessExportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.accessExcel,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

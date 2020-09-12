import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------车辆列表-----------------------

export function carInfoList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-info/getCarInfoPageList',
    method: 'get',
    params: parameter
  })
}

/**获取所有车辆保管人 */
export function carUserList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-info/getCareUserList',
    method: 'get',
    params: parameter
  })
}

export function carInfoDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-info/delCarInfo',
    method: 'get',
    params: parameter
  })
}

export function carInfoAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-info/addAndUpdateCarInfo',
    method: 'post',
    data: parameter
  })
}

//---------------------车辆列表---END--------------------
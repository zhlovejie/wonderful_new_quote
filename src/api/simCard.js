import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'


// 物联网sim卡列表
export function getSimInformationList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/SimInformation/sim-information/getSimInformationList',
    method: 'get',
    params: parameter
  })
}

// 物联网sim卡新增修改
export function addAndUpdateSimInformation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/SimInformation/sim-information/addAndUpdateSimInformation',
    method: 'post',
    data: parameter
  })
}

// 根据卡号查询卡信息
export function crrQueryCard (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/SimInformation/sim-information/crrQueryCard',
    method: 'get',
    params: parameter
  })
}
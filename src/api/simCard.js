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
export function basicInformation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/SimInformation/sim-information/basicInformation',
    method: 'get',
    params: parameter
  })
}

// 消费详情不带分页列表 导出使用
export function getSimInformationExportList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/consumptionDetail/consumption-detail/getSimInformationExportList',
    method: 'get',
    params: parameter
  })
}

// 消费详情获取累计流量和当前流量
export function getSimInformationFlow(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/consumptionDetail/consumption-detail/getSimInformationFlow',
    method: 'get',
    params: parameter
  })
}

// 消费详情分页列表
export function consumeDetailList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/consumptionDetail/consumption-detail/getSimInformationList',
    method: 'get',
    params: parameter
  })
}

// 扣费详情 不带分页导出用
export function getDeductionDetailExportList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/deductionDetail/deduction-detail/getDeductionDetailExportList',
    method: 'get',
    params: parameter
  })
}

// 扣费详情分页列表
export function getDeductionDetailList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/deductionDetail/deduction-detail/getDeductionDetailList',
    method: 'get',
    params: parameter
  })
}
import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

//---------------------物流管理模块-----------------------
/**配货站信息列表接口 */
export function DistributionList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-distribution-station/page',
    method: 'get',
    params: parameter
  })
}

/**配货站新增修改 */
export function DistributionAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-distribution-station/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**配货站信息详情接口 */
export function DistributionInfot(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-distribution-station/info',
    method: 'get',
    params: parameter
  })
}
/** 配货站信息删除接口 */
export function DistributionDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/logistics/logistics-distribution-station/del',
    method: 'delete',
    params: parameter

  })
}



/**物流信息列表接口 */
export function logisticsList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-information/page',
    method: 'get',
    params: parameter
  })
}


/** 物流信息列表删除接口 */
export function logisticsDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-information/del',
    method: 'delete',
    params: parameter

  })
}


/**身份证信息查询 */
export function getCardNo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-pilot/getCardNo',
    method: 'get',
    params: parameter
  })
}
// 

/**自动生成编号 */
export function logisticsNum(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-information/logisticsNum',
    method: 'get',
    params: parameter
  })
}
/**物流信息保存 */
export function logisticsPreservation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-information/addAndUpdate',
    method: 'post',
    data: parameter
  })
}

/**物流信息详情 */
export function getQueryOne(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-information/info',
    method: 'get',
    params: parameter
  })
}

/**承运方下拉列表 */
export function stationList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-distribution-station/list',
    method: 'get',
    params: parameter
  })
}
/**发货单列表 */
export function getList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-invoice/selectListByPage',
    method: 'get',
    params: parameter
  })
}

// 
/**回访记录 */
export function returnVisit(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-return-visit-record/list',
    method: 'get',
    params: parameter
  })
}

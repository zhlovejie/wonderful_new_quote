import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------产品配置-----------------------
// 获取产品配置列表
export function priceAdjustItemConfigList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustItemConfig/itemConfigList',
    method: 'get',
    params: parameter
  })
}

// 删除产品配置
export function priceAdjustItemConfigDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustItemConfig/delItemConfig',
    method: 'get',
    params: parameter
  })
}

// 新增或者修改产品配置
export function priceAdjustItemConfigAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustItemConfig/addAndUpdate',
    method: 'post',
    data: parameter
  })
}

//---------------------产品配置-----------------------

//---------------------中控系统模块配置清单------------

/**中控配置列表 */
export function priceAdjustZktConfigList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustZktConfig/getZktConfigList',
    method: 'get',
    params: parameter
  })
}

/**中控配置根据id获取详情 */
export function priceAdjustZktConfigDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustZktConfig/getZktConfig',
    method: 'get',
    params: parameter
  })
}

/**中控配置删除 */
export function priceAdjustZktConfigDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustZktConfig/delZktConfig',
    method: 'get',
    params: parameter
  })
}

/**中控配置新增或修改 */
export function priceAdjustZktConfigAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustZktConfig/ZktConfigAddAndUpdate',
    method: 'post',
    data: parameter
  })
}

/**根据id和类型查看修改记录 */
export function priceAdjustUpdateRecordList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustUpdateRecord/getUpdateRecordList',
    method: 'get',
    params: parameter
  })
}



//---------------------中控系统模块配置清单-END--------


//---------------------系列产品配置清单------------
/**系列产品配置列表 */
export function priceAdjustProductConfigList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/productConfigList',
    method: 'get',
    params: parameter
  })
}

/**系列产品配置根据id获取详情 */
export function priceAdjustProductConfigDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/getProductConfig',
    method: 'get',
    params: parameter
  })
}

/**系列产品配置删除 */
export function priceAdjustProductConfigDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/delProductConfig',
    method: 'get',
    params: parameter
  })
}
/**系列产品新增或修改产品配置 */
export function priceAdjustProductConfigAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/productConfigAddAndUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------系列产品配置清单-END--------


//---------------------产品价格配置------------
/**获取核价列表，根据主框架类型 */
export function priceAdjustPricingRecordList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustPricingRecord/getPricingList',
    method: 'get',
    params: parameter
  })
}

/**根据id和类型获取核价配置信息 */
export function priceAdjustPricingRecordDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustPricingRecord/getPricingInfo',
    method: 'get',
    params: parameter
  })
}

/**根据id和类型进行核价 */
export function priceAdjustPricingRecordPrice (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustPricingRecord/pricingPrice',
    method: 'get',
    params: parameter
  })
}

/**根据id和类型获取变更记录 */
export function priceAdjustPricingRecordPricingChangList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustPricingRecord/getPricingChangList',
    method: 'get',
    params: parameter
  })
}
//---------------------产品价格配置-END--------
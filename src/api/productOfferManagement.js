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
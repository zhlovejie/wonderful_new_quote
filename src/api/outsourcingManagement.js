import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------加工商信息列表-----------------------




/**加工商信息列表 - 新增或修改 */
export function facInfoAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

/**加工商信息列表 - 审批 */
export function facInfoApprove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info/approve',
    method: 'post',
    data: parameter
  })
}

/**加工商信息列表 - 详情 */
export function facInfoDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info/getFacInfoDetail',
    method: 'get',
    params: parameter
  })
}

/**加工商信息列表 - 导入加工商信息 */
export function facInfoImportFacInfoExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info/importFacInfoExcel',
    method: 'post',
    data: parameter
  })
}


/**加工商信息列表 - 分页列表 */
export function facInfoPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info/listFacInfo',
    method: 'get',
    params: parameter
  })
}

/**加工商信息列表 - 删除 */
export function facInfoDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/outsource/fac-info/remove?${parameter}`,
    method: 'post',
  })
}

/**加工商信息列表 - 启用或禁用加工商  0禁用 1 启用*/
export function facInfoStartOrStop(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info/startOrStop',
    method: 'post',
    data: parameter
  })
}

/**加工商信息列表 - 撤回加工商信息单 */
export function facInfoWithdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/outsource/fac-info/withdraw?${parameter}`,
    method: 'post',
    data: parameter
  })
}
//---------------------加工商信息列表----END-------------------

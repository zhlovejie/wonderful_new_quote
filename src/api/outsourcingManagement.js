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


//---------------------加工需求单--------------------------

/**加工需求单 - 新增或修改 */
export function facinfoneedAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info-need/addFacInfoNeed',
    method: 'post',
    data: parameter
  })
}

/**加工需求单 - 审批 */
export function facinfoneedApprove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info-need/approve',
    method: 'post',
    data: parameter
  })
}

/**加工需求单 - 查询工艺资料信息 */
export function getCraftFile(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info-need/getCraftFile',
    method: 'get',
    params: parameter
  })
}

/**加工需求单 - 详情 */
export function facinfoneedDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info-need/getFacInfoNeedDetail',
    method: 'get',
    params: parameter
  })
}

/**加工需求单 - 分页列表 */
export function facinfoneedPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info-need/listFacInfoNeed',
    method: 'get',
    params: parameter
  })
}

/**加工需求单 - 根据物料id和物料类型查询其所有子物料：原材料部分使用 */
export function listMaterialFormChildDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info-need/listMaterialFormChildDetail',
    method: 'get',
    params: parameter
  })
}

/**加工需求单 - 删除 */
export function facinfoneedDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info-need/remove',
    method: 'post',
    data: parameter
  })
}

/**加工需求单 - 修改加工数量 */
export function facinfoneedUpdateCount(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info-need/updateCount',
    method: 'post',
    data: parameter
  })
}

/**加工需求单 - 修改 */
export function facinfoneedUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info-need/updateFacInfoNeed',
    method: 'post',
    data: parameter
  })
}

/**加工需求单 - 撤回 */
export function facinfoneedWithdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/outsource/fac-info-need/withdraw',
    method: 'post',
    data: parameter
  })
}
//---------------------加工需求单----END-------------------





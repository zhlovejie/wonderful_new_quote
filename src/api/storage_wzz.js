import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

const baseURL = system.materialBaseUrl
//仓储管理-入库申请列表接口
export function storageList(parameter) {
  return axios({
    baseURL,
    url: '/storageList/listStorage',
    method: 'get',
    params: parameter
  })
}

//仓储管理-入库 - 统一撤回
export function storageRevocation(parameter) {
  return axios({
    baseURL,
    url: '/storageList/revocation',
    method: 'get',
    params: parameter
  })
}

//仓储管理-入库申请列表接口
export function storageDelete(parameter) {
  return axios({
    baseURL,
    url: '/storageList/delete',
    method: 'get',
    params: parameter
  })
}

// 查询入库申请的物料信息
export function storageMaterialList(parameter) {
  return axios({
    baseURL,
    url: '/storageList/storageMaterialList',
    method: 'get',
    params: parameter
  })
}

// 仓储管理-赠品入库申请表接口 - 新增或修改
export function giftSaveAndUpdate(parameter) {
  return axios({
    baseURL,
    url: '/storageGiveApply/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
// 仓储管理-赠品入库申请表接口 - 撤回新增或修改
export function giftRevocation(parameter) {
  return axios({
    baseURL,
    url: '/storageGiveApply/revocation',
    method: 'get',
    params: parameter
  })
}

// 仓储管理-赠品入库申请表接口 - 详情
export function giftDetail(parameter) {
  return axios({
    baseURL,
    url: '/storageGiveApply/getDetail',
    method: 'get',
    params: parameter
  })
}

// 仓储管理-赠品入库申请表接口 - 审批
export function giftApproval(parameter) {
  return axios({
    baseURL,
    url: '/storageGiveApply/approval',
    method: 'post',
    data: parameter
  })
}


// 入库仓库
export function getWarehouseList(parameter) {
  return axios({
    baseURL,
    url: '/base/management/getList',
    method: 'get',
    params: parameter
  })
}

//-------仓储管理-产成品返修入库申请表接口

/**仓储管理-产成品返修入库申请表接口 - 添加修改 */
export function storageRepairAddOrUpdate(parameter) {
  return axios({
    baseURL,
    url: '/storageRepairApply/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**仓储管理-产成品返修入库申请表接口 - 撤回 */
export function storageRepairRevocation(parameter) {
  return axios({
    baseURL,
    url: '/storageRepairApply/revocation',
    method: 'get',
    params: parameter
  })
}

/**仓储管理-产成品返修入库申请表接口 - 详情 */
export function storageRepairDetail(parameter) {
  return axios({
    baseURL,
    url: '/storageRepairApply/getDetail',
    method: 'get',
    params: parameter
  })
}

/**仓储管理-产成品返修入库申请表接口 - 审批 */
export function storageRepairApproval(parameter) {
  return axios({
    baseURL,
    url: '/storageRepairApply/approval',
    method: 'post',
    data: parameter
  })
}

/**仓储管理-不良品入库申请表接口 - 新增或修改 */
export function storageRejectsAddOrUpdate(parameter) {
  return axios({
    baseURL,
    url: '/storageRejectsApply/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}

/**仓储管理-不良品入库申请表接口 - 撤回 */
export function storageRejectsRevocation(parameter) {
  return axios({
    baseURL,
    url: '/storageRejectsApply/revocation',
    method: 'get',
    params: parameter
  })
}

/**仓储管理-不良品入库申请表接口 - 详情 */
export function storageRejectsDetail(parameter) {
  return axios({
    baseURL,
    url: '/storageRejectsApply/getDetail',
    method: 'get',
    params: parameter
  })
}

/**仓储管理-不良品入库申请表接口 - 审批 */
export function storageRejectsApproval(parameter) {
  return axios({
    baseURL,
    url: '/storageRejectsApply/approval',
    method: 'post',
    data: parameter
  })
}
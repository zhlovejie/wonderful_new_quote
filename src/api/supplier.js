import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
let materialBaseUrl = system.materialBaseUrl
// eslint-disable-next-line no-unused-vars
const api = {
  manageSupplier: '/manageSupplier/page',
  SupplierRevocation: '/manageSupplier/revocation',
  saveAndUpdate: '/manageSupplier/saveAndUpdate',
  exportExcelMax: '/manageSupplier/exportExcelMax',
  exportExcelMin: '/manageSupplier/exportExcelMin',
  importExcelMax: '/manageSupplier/importExcelMax',
  importExcelMin: '/manageSupplier/importExcelMin',
  getDetail: '/manageSupplier/getDetail',
  getdelete: '/manageSupplier/delete',
  getlierOffer: '/manageSupplierOffer/page',
  pageOrderList: '/manageSupplier/pageOrderList',
  listMaterialReceivingRecord: '/warehouse/receive/listReceive',
  listQualityInspectionRecord: '/quality-material-source-check/supplierMaterialPageList',
  listManageSupplierOfferLog: '/manageSupplierOffer/listManageSupplierOfferLog',
  listManageapproval: '/manageSupplier/approval',
  materialSuplierEnable: '/manageSupplier/materialSuplierEnable',
  materialenable: '/manageSupplier/enable',



}

// 物料供应商
export function materialenable(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.materialenable,
    method: 'post',
    data: parameter
  })
}

// 物料供应商列表
export function materialSuplierEnable(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.materialSuplierEnable,
    method: 'get',
    params: parameter
  })
}

//供应商审批
export function listManageapproval(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.listManageapproval,
    method: 'post',
    data: parameter
  })
}
// 物料报价维修历史记录
export function listManageSupplierOfferLog(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.listManageSupplierOfferLog,
    method: 'get',
    params: parameter
  })
}


// 质检记录
export function listQualityInspectionRecord(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.listQualityInspectionRecord,
    method: 'get',
    params: parameter
  })
}
// 收料记录
export function listMaterialReceivingRecord(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.listMaterialReceivingRecord,
    method: 'get',
    params: parameter
  })
}
// 根据供应商或物料id查询采购记录
export function pageOrderList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.pageOrderList,
    method: 'get',
    params: parameter
  })
}

//供应商报价记录
export function getlierOffer(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.getlierOffer,
    method: 'get',
    params: parameter
  })
}
//供应商删除
export function getdelete(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.getdelete,
    method: 'get',
    params: parameter
  })
}
//供应商详情
export function getDetail(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.getDetail,
    method: 'get',
    params: parameter
  })
}
//小供应商导入
export function importExcelMin(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.importExcelMin,
    method: 'post',
    responseType: 'blob',
    data: parameter
  })
}
//一般供应商导入
export function importExcelMax(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.importExcelMax,
    method: 'post',
    responseType: 'blob',
    data: parameter
  })
}

/**下载小供应商模板*/
export function exportExcelMin(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.exportExcelMin,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}
/**下载一般供应商模板*/
export function exportExcelMax(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.exportExcelMax,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}
//供应商列表
export function manageSupplier(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.manageSupplier,
    method: 'get',
    params: parameter
  })
}
//供应商撤回
export function SupplierRevocation(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.SupplierRevocation,
    method: 'get',
    params: parameter
  })
}
//供应商新增
export function saveAndUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.saveAndUpdate,
    method: 'post',
    data: parameter
  })
}

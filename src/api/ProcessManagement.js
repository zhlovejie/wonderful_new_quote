import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

// eslint-disable-next-line no-unused-vars
//  工艺管理
const api = {
  pageDevelopmentCraftWorkshopList: '/craft/development-craft-workshop/pageDevelopmentCraftWorkshopList',
  listDevelopmentCraftWorkshopList: '/craft/development-craft-workshop/listDevelopmentCraftWorkshopList',
  pageDevelopmentdelete: '/craft/development-craft-workshop/delete',
  getDetailDevelopmentCraftWorkshop: '/craft/development-craft-workshop/getDetailDevelopmentCraftWorkshop',
  gsaveOrUpdate: '/craft/development-craft-workshop/saveOrUpdate',
  pageDevelopmentCraftModel: '/craft/development-craft-model/pageDevelopmentCraftModel',
  saveOrUpdate: '/craft/development-craft-model/saveOrUpdate',
  getDetailDevelopmentCraftProcess: '/craft/development-craft-model/getDetailDevelopmentCraftProcess',
  getDetailDelete: '/craft/development-craft-model/delete',
  pageDevelopmentCraftProcessList: '/craft/development-craft-process/pageDevelopmentCraftProcessList',
  pageDevelopmentCraftProcessDelete: '/craft/development-craft-process/delete',
  pageDevelopmentCraftProcessSaveOrUpdate: '/craft/development-craft-process/saveOrUpdate',
  pageDevelopmentCraftProcessDetail: '/craft/development-craft-process/getDetailDevelopmentCraftProcess',
  pageExportExcel: '/craft/development-craft-process/exportExcel',
  pageImportExcel: '/craft/development-craft-process/importExcel',
  pageDevelopmentCraftDev: '/developmentCraftDev/pageDevelopmentCraftDev',
  pageDevesaveOrUpdate: '/developmentCraftDev/saveOrUpdate',
  pageDevesaveCraftDev: '/developmentCraftDev/getDetailDevelopmentCraftDev',
  pageDevesaveDelete: '/developmentCraftDev/delete',
  pageDevesaveScrap: '/developmentCraftDev/scrap',
  pageacceptanceCheck: '/developmentCraftDev/acceptanceCheck',
  pageacceptanceGuarantee: '/developmentCraftDev/guarantee',
  pageDevelopmentCraftDevRecoveApply: '/craft/development-craft-dev-recove-apply/pageDevelopmentCraftDevRecoveApply',
  pageDevelopmentDetail: '/craft/development-craft-dev-recove-apply/getDetailDevelopmentCraftDevRecoveApply',
  pageDevelopmentgetRevocation: '/craft/development-craft-dev-recove-apply/getRevocation',
  pageDevelopmentRevocation: '/craft/development-craft-dev-recove-apply/revocation',
  pageDevelopmentConcludeRevocation: '/craft/development-craft-dev-recove-apply/concludeRevocation',
  pageDevelopmentApproval: '/craft/development-craft-dev-recove-apply/approval',
  pageDevelopmenthandleRevocation: '/craft/development-craft-dev-recove-apply/handleRevocation',
  pageDevelopmenthandleUploadRevocation: '/craft/development-craft-dev-recove-apply/uploadRevocation',
  pageDevelopmentCraftDevCareLog: '/craft/development-craft-dev-care-log/pageDevelopmentCraftDevCareLog',
  listDevelopmentCraftDevCareLogCount: '/craft/development-craft-dev-care-log/listDevelopmentCraftDevCareLogCount',
  getDetailDevelopmentCraftDevCareLog: '/craft/development-craft-dev-care-log/getDetailDevelopmentCraftDevCareLog',
  updateDevelopmentCraftDevCareLog: '/craft/development-craft-dev-care-log/updateDevelopmentCraftDevCareLog',












}
/*修改接口（处理checkFlag=1，验收checkFlag=2)*/
export function updateDevelopmentCraftDevCareLog(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.updateDevelopmentCraftDevCareLog,
    method: 'post',
    data: parameter
  })
}
// 查询保养日志详情
export function getDetailDevelopmentCraftDevCareLog(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getDetailDevelopmentCraftDevCareLog,
    method: 'get',
    params: parameter
  })
}
// 保养总数
export function listDevelopmentCraftDevCareLogCount(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.listDevelopmentCraftDevCareLogCount,
    method: 'get',
    params: parameter
  })
}
// 保养列表
export function pageDevelopmentCraftDevCareLog(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentCraftDevCareLog,
    method: 'get',
    params: parameter
  })
}

//上传凭证
export function pageDevelopmenthandleUploadRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmenthandleUploadRevocation,
    method: 'get',
    params: parameter
  })
}
//填写维修方案
export function pageDevelopmenthandleRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmenthandleRevocation,
    method: 'get',
    params: parameter
  })
}
/*设备维修审批*/
export function pageDevelopmentApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentApproval,
    method: 'post',
    data: parameter
  })
}

//完结
export function pageDevelopmentConcludeRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentConcludeRevocation,
    method: 'get',
    params: parameter
  })
}

//撤回
export function pageDevelopmentRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentRevocation,
    method: 'get',
    params: parameter
  })
}
//查看凭证
export function pageDevelopmentgetRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentgetRevocation,
    method: 'get',
    params: parameter
  })
}

//分页查询设备保修申请单
export function pageDevelopmentDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentDetail,
    method: 'get',
    params: parameter
  })
}
//分页查询设备保修申请单
export function pageDevelopmentCraftDevRecoveApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentCraftDevRecoveApply,
    method: 'get',
    params: parameter
  })
}

/*报修 新增或修改*/
export function pageacceptanceGuarantee(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageacceptanceGuarantee,
    method: 'post',
    data: parameter
  })
}
//设备列表验收
export function pageacceptanceCheck(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageacceptanceCheck,
    method: 'get',
    params: parameter
  })
}

//设备列表报废
export function pageDevesaveScrap(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevesaveScrap,
    method: 'get',
    params: parameter
  })
}
//设备列表删除
export function pageDevesaveDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevesaveDelete,
    method: 'get',
    params: parameter
  })
}

//查看设备信息详情
export function pageDevesaveCraftDev(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevesaveCraftDev,
    method: 'get',
    params: parameter
  })
}
//设备列表新增修改
export function pageDevesaveOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevesaveOrUpdate,
    method: 'post',
    data: parameter
  })
}


//分页查询设备信息
export function pageDevelopmentCraftDev(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentCraftDev,
    method: 'get',
    params: parameter
  })
}
//分页查询车间管理信息
export function pageDevelopmentCraftWorkshopList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentCraftWorkshopList,
    method: 'get',
    params: parameter
  })
}
//全部车间管理信息
export function listDevelopmentCraftWorkshopList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.listDevelopmentCraftWorkshopList,
    method: 'get',
    params: parameter
  })
}


//删除车间管理信息
export function pageDevelopmentdelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentdelete,
    method: 'get',
    params: parameter
  })
}
//查看车间管理详情
export function getDetailraftWorkshop(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getDetailDevelopmentCraftWorkshop,
    method: 'get',
    params: parameter
  })
}
//新增活修改车间管理
export function gsaveOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.gsaveOrUpdate,
    method: 'post',
    data: parameter
  })
}

//分页查询模具信息
export function pageDevelopmentCraftModel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentCraftModel,
    method: 'get',
    params: parameter
  })
}

//新增活修改模具管理
export function saveOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.saveOrUpdate,
    method: 'post',
    data: parameter
  })
}
//详情模具信息
export function getDetailDevelopmentCraftProcess(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getDetailDevelopmentCraftProcess,
    method: 'get',
    params: parameter
  })
}
//删除模具信息
export function getDetailDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getDetailDelete,
    method: 'get',
    params: parameter
  })
}

//分页查询工序信息
export function pageDevelopmentCraftProcessList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentCraftProcessList,
    method: 'get',
    params: parameter
  })
}
//删除工序信息
export function pageDevelopmentCraftProcessDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentCraftProcessDelete,
    method: 'get',
    params: parameter
  })
}
//新增或修改工序信息
export function pageDevelopmentCraftProcessSaveOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentCraftProcessSaveOrUpdate,
    method: 'post',
    data: parameter
  })
}
//查看工序信息详情
export function pageDevelopmentCraftProcessDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageDevelopmentCraftProcessDetail,
    method: 'get',
    params: parameter
  })
}
//工序模板下载
export function pageExportExcel(url, params) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageExportExcel,
    method: 'get',
    responseType: 'blob',
    params: params
  })
}
//工序信息导入
export function pageImportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pageImportExcel,
    method: 'post',
    responseType: 'blob',
    data: parameter
  })
}

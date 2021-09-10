import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
const baseurl = system.baseURL
const api = {
  afterSaleAnalysisPage: '/csupport/after-sale-analysis/afterSaleAnalysisPage', //售后分析列表
  addAndUpdateAnalysis: '/csupport/after-sale-analysis/addAndUpdateAnalysis', //售后分析列表
  delAnalysis: '/csupport/after-sale-analysis/delAnalysis', //售后分析列表
  taskDocumentPage: '/csupport/task-document/taskDocumentPage', //维修任务单申请列表
  accessoriesManagementPage: '/csupport/accessories-management/accessoriesManagementPage', //配件清单列表
  accessoriesCollectionPage: '/csupport/accessories-collection-detail/accessoriesCollectionPage', //收款明细
  getOrgNamePage: '/csupport/device-archives/getOrgNamePage', //机构名称
  getNewDeviceInfoByMainBoardNo: '/csupport/device-archives/getNewDeviceInfoByMainBoardNo', //根据主板号获取信息
  addAndUpdateTaskDocument: '/csupport/task-document/addAndUpdateTaskDocument', //新增维修单申请
  delTaskDocument: '/csupport/task-document/delTaskDocument', //维修任务单删除
  revocationTaskDocument: '/csupport/task-document/revocationTaskDocument', //维修任务单撤回
  taskDocumentDetail: '/csupport/task-document/taskDocumentDetail', //维修任务单详情






}
//维修任务单详情
export function taskDocumentDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.taskDocumentDetail,
    method: 'get',
    params: parameter
  })
}
//维修任务单撤回
export function revocationTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.revocationTaskDocument,
    method: 'get',
    params: parameter
  })
}
//维修任务单删除
export function delTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.delTaskDocument,
    method: 'get',
    params: parameter
  })
}
//售后分析新增修改
export function addAndUpdateTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.addAndUpdateTaskDocument,
    method: 'post',
    data: parameter
  })
}
//根据主板号获取信息
export function getNewDeviceInfoByMainBoardNo(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getNewDeviceInfoByMainBoardNo,
    method: 'get',
    params: parameter
  })
}

//机构名称
export function getOrgNamePage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getOrgNamePage,
    method: 'get',
    params: parameter
  })
}
//收款明细列表
export function accessoriesCollectionPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.accessoriesCollectionPage,
    method: 'get',
    params: parameter
  })
}
//配件清单列表
export function accessoriesManagementPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.accessoriesManagementPage,
    method: 'get',
    params: parameter
  })
}
//维修任务单申请列表
export function taskDocumentPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.taskDocumentPage,
    method: 'get',
    params: parameter
  })
}
//售后分析列表删除
export function delAnalysis(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.delAnalysis,
    method: 'get',
    params: parameter
  })
}
//售后分析新增修改
export function addAndUpdateAnalysis(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.addAndUpdateAnalysis,
    method: 'post',
    data: parameter
  })
}
//售后分析列表
export function afterSaleAnalysisPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.afterSaleAnalysisPage,
    method: 'get',
    params: parameter
  })
}

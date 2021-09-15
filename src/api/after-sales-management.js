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
  getOrgNamePage: '/csupport/device-archives/getOrgNameList', //机构名称
  getVillageNameList: ' /csupport/device-archives/getVillageNameList', //机构下面的小区
  getNewDeviceInfoByMainBoardNo: '/csupport/device-archives/getNewDeviceInfoByMainBoardNo', //根据主板号获取信息
  addAndUpdateTaskDocument: '/csupport/task-document/addAndUpdateTaskDocument', //新增维修单申请
  delTaskDocument: '/csupport/task-document/delTaskDocument', //维修任务单删除
  revocationTaskDocument: '/csupport/task-document/revocationTaskDocument', //维修任务单撤回
  taskDocumentDetail: '/csupport/task-document/taskDocumentDetail', //维修任务单详情
  submitTaskDocument: '/csupport/task-document/submitTaskDocument', //维修任务单提交审核
  mailRecordPage: '/csupport/accessories-mail-record/mailRecordPage', //邮寄记录
  networkManagementPage: '/csupport/network-management/networkManagementPage', //网点列表
  addAndUpdateNetworkManagement: '/csupport/network-management/addAndUpdateNetworkManagement', //个人网点新增
  networkManagementDetail: '/csupport/network-management/networkManagementDetail', //个人网点新增
  enterpriseNetworkPage: '/csupport/network-management/enterpriseNetworkPage', //企业网点列表
  addAndUpdateEnterpriseNetwork: '/csupport/network-management/addAndUpdateEnterpriseNetwork', //企业网点新增
  revocationEnterpriseNetwork: '/csupport/network-management/revocationEnterpriseNetwork', //企业网点撤回
  delNetworkManagement: '/csupport/network-management/delNetworkManagement', //企业网点新增
  approvalEnterpriseNetwork: '/csupport/network-management/approvalEnterpriseNetwork', //企业网点审批
  networkPaymentRequestPage: '/csupport/network-payment-request/networkPaymentRequestPage', //付款记录
  listUserByAfterSale: '/user/listUserByAfterSale', //付款记录
  networkManagementList: 'csupport/network-management/networkManagementList', //网点管理 不分页
  dispatchTaskDocument: '/csupport/task-document/dispatchTaskDocument', //网点管理 不分页
  overTaskDocument: '/csupport/task-document/overTaskDocument', //任务单完结
  rejectTaskDocument: '/csupport/task-document/rejectTaskDocument', //任务单完结
  againDispatchTaskDocument: '/csupport/task-document/againDispatchTaskDocument', //任务单重新派工
  handleTaskDocument: '/csupport/task-document/handleTaskDocument', //任务单处理
  getDeviceArchivesPage: '/csupport/device-archives/getDeviceArchivesPage', //设备档案
  getDeviceTypeList: '/csupport/device-archives/getDeviceTypeList', //获取设备类型
  getDeviceStateList: '/csupport/device-archives/getDeviceStateList', //获取设备状态
  getDeviceArchivesDetailVo: '/csupport/device-archives/getDeviceArchivesDetailVo', //设备状态详情
  getMaintenanceRecordPage: '/csupport/device-maintenance-record/getMaintenanceRecordPage', //维修记录
  getReplacementListingPage: '/csupport/device-replacement-listing/getReplacementListingPage', //更换记录







}

//更换记录
export function getReplacementListingPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getReplacementListingPage,
    method: 'get',
    params: parameter
  })
}
//维修记录
export function getMaintenanceRecordPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getMaintenanceRecordPage,
    method: 'get',
    params: parameter
  })
}
//机构下面的小区
export function getVillageNameList(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getVillageNameList,
    method: 'get',
    params: parameter
  })
}
//设备详情
export function getDeviceArchivesDetailVo(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getDeviceArchivesDetailVo,
    method: 'get',
    params: parameter
  })
}
//设备状态
export function getDeviceStateList(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getDeviceStateList,
    method: 'get',
    params: parameter
  })
}
//设备类型
export function getDeviceTypeList(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getDeviceTypeList,
    method: 'get',
    params: parameter
  })
}
//设备档案
export function getDeviceArchivesPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getDeviceArchivesPage,
    method: 'get',
    params: parameter
  })
}
//任务单处理
export function handleTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.handleTaskDocument,
    method: 'post',
    data: parameter
  })
}
//任务单重新派工
export function againDispatchTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.againDispatchTaskDocument,
    method: 'get',
    params: parameter
  })
}
//驳回
export function rejectTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.rejectTaskDocument,
    method: 'post',
    data: parameter
  })
}
//完结
export function overTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.overTaskDocument,
    method: 'post',
    data: parameter
  })
}
//派工
export function dispatchTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.dispatchTaskDocument,
    method: 'post',
    data: parameter
  })
}
//网点管理 不分页
export function networkManagementList(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.networkManagementList,
    method: 'get',
    params: parameter
  })
}
//售后人员
export function listUserByAfterSale(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.listUserByAfterSale,
    method: 'get',
    params: parameter
  })
}
//付款记录
export function networkPaymentRequestPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.networkPaymentRequestPage,
    method: 'get',
    params: parameter
  })
}
//企业网点审批
export function approvalEnterpriseNetwork(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.approvalEnterpriseNetwork,
    method: 'post',
    data: parameter
  })
}
//企业网点删除
export function delNetworkManagement(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.delNetworkManagement,
    method: 'get',
    params: parameter
  })
}
//企业网点撤回
export function revocationEnterpriseNetwork(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.revocationEnterpriseNetwork,
    method: 'get',
    params: parameter
  })
}
//企业网点新增
export function addAndUpdateEnterpriseNetwork(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.addAndUpdateEnterpriseNetwork,
    method: 'post',
    data: parameter
  })
}
//企业网点列表
export function enterpriseNetworkPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.enterpriseNetworkPage,
    method: 'get',
    params: parameter
  })
}
//个人网点详情
export function networkManagementDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.networkManagementDetail,
    method: 'get',
    params: parameter
  })
}
//个人网点新增
export function addAndUpdateNetworkManagement(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.addAndUpdateNetworkManagement,
    method: 'post',
    data: parameter
  })
}
//邮寄记录列表
export function networkManagementPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.networkManagementPage,
    method: 'get',
    params: parameter
  })
}

//邮寄记录列表
export function mailRecordPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.mailRecordPage,
    method: 'get',
    params: parameter
  })
}
//维修任务单提交审核
export function submitTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.submitTaskDocument,
    method: 'get',
    params: parameter
  })
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

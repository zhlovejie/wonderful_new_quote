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
  getVillageNameList: '/csupport/device-archives/getVillageNameList', //机构下面的小区
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
  finishTaskDocument: '/csupport/task-document/finishTaskDocument', //任务单正常完结
  addAndUpdateNetworkPaymentRequest: '/csupport/network-payment-request/addAndUpdateNetworkPaymentRequest', //付款申请
  networkPaymentRequestDetail: '/csupport/network-payment-request/networkPaymentRequestDetail', //付款申请详情
  revocationNetworkPaymentRequest: '/csupport/network-payment-request/revocationNetworkPaymentRequest', //付款申请撤回
  delNetworkPaymentRequest: '/csupport/network-payment-request/delNetworkPaymentRequest', //付款申请删除
  approvalNetworkPaymentRequest: '/csupport/network-payment-request/approvalNetworkPaymentRequest', //付款申请审批
  acceptanceCheckDetail: '/csupport/task-document/acceptanceCheckDetail', //验收单详情
  addAndUpdateAccessoriesManagement: '/csupport/accessories-management/addAndUpdateAccessoriesManagement', //配件清单申请
  accessoriesManagementDetail: '/csupport/accessories-management/accessoriesManagementDetail', //配件清单详情
  approvalAccessoriesManagement: '/csupport/accessories-management/approvalAccessoriesManagement', //配件清单处理
  acceptanceCheckTaskDocument: '/csupport/task-document/acceptanceCheckTaskDocument', //验收单
  mailRecordDetail: '/csupport/accessories-mail-record/mailRecordDetail', //邮寄详情
  addAndHandleMailRecord: '/csupport/accessories-mail-record/addAndHandleMailRecord', //邮寄处理
  taskDocumentStatusNum: '/csupport/task-document/taskDocumentStatusNum', //任务数量
  updateTaskDocument: '/csupport/task-document/updateTaskDocument', //任务修改
  getAliPayQrCode: '/csupport/accessories-management/getAliPayQrCode', //支付宝
  getWxPayQrCode: '/csupport/accessories-management/getWxPayQrCode', //微信
  accessoriesAddOrUpdate: '/csupport/accessories-contract/addOrUpdate', //配件销售合同新增或修改
  accessoriesgetListByPage: '/csupport/accessories-contract/getListByPage', //配件销售合同分页列表
  accessoriesRevocation: '/csupport/accessories-contract/revocation', //配件销售合同撤回
  accessoriesGetDetailById: '/csupport/accessories-contract/getDetailById', //配件销售合同详情
  accessoriesdelById: '/csupport/accessories-contract/delById', //配件销售合同删除
  accessoriesApproval: '/csupport/accessories-contract/approval', //配件销售合同审批
  accessoriesgetCustomerById: '/csupport/accessories-contract/getCustomerById', //根据客户id获取最新的客户开票信息



}
//根据客户id获取最新的客户开票信息
export function accessoriesgetCustomerById(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.accessoriesgetCustomerById,
    method: 'get',
    params: parameter
  })
}

//配件销售合同审批
export function accessoriesApproval(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.accessoriesApproval,
    method: 'post',
    data: parameter
  })
}
//配件销售合同删除
export function accessoriesdelById(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.accessoriesdelById,
    method: 'get',
    params: parameter
  })
}

//配件销售合同详情
export function accessoriesGetDetailById(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.accessoriesGetDetailById,
    method: 'get',
    params: parameter
  })
}
//配件销售合同撤回
export function accessoriesRevocation(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.accessoriesRevocation,
    method: 'post',
    data: parameter
  })
}
//配件销售合同分页列表
export function accessoriesgetListByPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.accessoriesgetListByPage,
    method: 'get',
    params: parameter
  })
}
//配件销售合同新增或修改
export function accessoriesAddOrUpdate(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.accessoriesAddOrUpdate,
    method: 'post',
    data: parameter
  })
}
//微信
export function getWxPayQrCode(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getWxPayQrCode,
    method: 'get',
    params: parameter
  })
}

//支付宝
export function getAliPayQrCode(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.getAliPayQrCode,
    method: 'get',
    params: parameter
  })
}

//任务修改
export function updateTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.updateTaskDocument,
    method: 'post',
    data: parameter
  })
}
//邮寄详情
export function taskDocumentStatusNum(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.taskDocumentStatusNum,
    method: 'get',
    params: parameter
  })
}
//邮寄处理
export function addAndHandleMailRecord(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.addAndHandleMailRecord,
    method: 'post',
    data: parameter
  })
}
//邮寄详情
export function mailRecordDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.mailRecordDetail,
    method: 'get',
    params: parameter
  })
}
//验收单
export function acceptanceCheckTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.acceptanceCheckTaskDocument,
    method: 'post',
    data: parameter
  })
}
//配件清单处理
export function approvalAccessoriesManagement(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.approvalAccessoriesManagement,
    method: 'post',
    data: parameter
  })
}
//配件清单详情
export function accessoriesManagementDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.accessoriesManagementDetail,
    method: 'get',
    params: parameter
  })
}
//配件清单申请
export function addAndUpdateAccessoriesManagement(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.addAndUpdateAccessoriesManagement,
    method: 'post',
    data: parameter
  })
}
//验收单详情
export function acceptanceCheckDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.acceptanceCheckDetail,
    method: 'get',
    params: parameter
  })
}
//付款申请审批
export function approvalNetworkPaymentRequest(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.approvalNetworkPaymentRequest,
    method: 'post',
    data: parameter
  })
}
//付款申请删除
export function delNetworkPaymentRequest(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.delNetworkPaymentRequest,
    method: 'get',
    params: parameter
  })
}
//付款申请撤回
export function revocationNetworkPaymentRequest(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.revocationNetworkPaymentRequest,
    method: 'get',
    params: parameter
  })
}
//付款申请详情
export function networkPaymentRequestDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.networkPaymentRequestDetail,
    method: 'get',
    params: parameter
  })
}
//付款申请
export function addAndUpdateNetworkPaymentRequest(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.addAndUpdateNetworkPaymentRequest,
    method: 'post',
    data: parameter
  })
}
//任务单正常完结
export function finishTaskDocument(parameter) {
  return axios({
    baseURL: baseurl,
    url: api.finishTaskDocument,
    method: 'post',
    data: parameter
  })
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

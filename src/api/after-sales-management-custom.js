import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
const baseurl = system.baseURL

//售后管理-收件记录接口（客户）

/**未寄回配件记录 */
export function receiveCustomerNotReceiveList(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveCustomer/notReceiveList',
    method: 'get',
    params: parameter
  })
}
/**分页列表 */
export function receiveCustomerPageList(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveCustomer/pageList',
    method: 'get',
    params: parameter
  })
}
/**新增 */
export function receiveCustomerAdd(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveCustomer/saveReceiveCustomer',
    method: 'post',
    data: parameter
  })
}

/**新增时客户下拉列表查询 */
export function receiveCustomerListReceiveAddCustomer(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveCustomer/listReceiveAddCustomer',
    method: 'get',
    params: parameter
  })
}
/**新增时邮寄下拉列表查询 */
export function receiveCustomerListReceiveCustomerMail(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveCustomer/listReceiveCustomerMail',
    method: 'get',
    params: parameter
  })
}
/**新增时物料列表查询 */
export function receiveCustomerListReceiveCustomerMaterial(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveCustomer/listReceiveCustomerMaterial',
    method: 'get',
    params: parameter
  })
}


//售后管理-收件记录接口（客户） END

//售后管理-收件记录接口（售后）

/**新增 */
export function receiveWorkerAdd(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveWorker',
    method: 'post',
    data: parameter
  })
}

/**未寄回配件记录 */
export function receiveWorkerNotReceiveList(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveWorker/notReceiveList',
    method: 'get',
    params: parameter
  })
}
/**分页列表 */
export function receiveWorkerPageList(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveWorker/pageList',
    method: 'get',
    params: parameter
  })
}


/**新增时售后下拉列表查询 */
export function receiveWorkerListReceiveAddCustomer(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveWorker/listReceiveAddCustomer',
    method: 'get',
    params: parameter
  })
}
/**新增时配件下拉列表查询 */
export function receiveWorkerListReceiveCustomerMail(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveWorker/listReceiveCustomerMail',
    method: 'get',
    params: parameter
  })
}
/**新增时物料列表查询 */
export function receiveWorkerListReceiveCustomerMaterial(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/receiveWorker/listReceiveCustomerMaterial',
    method: 'get',
    params: parameter
  })
}

//售后管理-收件记录接口（售后） END


//售后异常报告单

/**审批 */
export function exceptionReportApproval(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/exceptionReport/approval',
    method: 'post',
    data: parameter
  })
}

/**手动完结异常报告单 */
export function exceptionReportFinishExceptionReport(parameter) {
  return axios({
    baseURL: baseurl,
    url: `/exceptionReport/finishExceptionReport?id=${parameter.id}`,
    method: 'post',
    data: parameter
  })
}

/**查询反馈记录 */
export function exceptionReportFeedback(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/exceptionReport/getExceptionFeedback',
    method: 'get',
    params: parameter
  })
}

/**详情查询 */
export function exceptionReportDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/exceptionReport/getReportDetail',
    method: 'get',
    params: parameter
  })
}

/**分页列表 */
export function exceptionReportPageList(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/exceptionReport/pageList',
    method: 'get',
    params: parameter
  })
}

/**处理或者重新处理异常报告单 */
export function exceptionReportSaveAndUpdateDispose(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/exceptionReport/saveAndUpdateDispose',
    method: 'post',
    data: parameter
  })
}

/**新增或保存异常报告单 */
export function exceptionReportSaveAndUpdateExceptionReport(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/exceptionReport/saveAndUpdateExceptionReport',
    method: 'post',
    data: parameter
  })
}

/**新增反馈记录 */
export function exceptionReportSaveExceptionFeedback(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/exceptionReport/saveExceptionFeedback',
    method: 'post',
    data: parameter
  })
}

/**撤回 */
export function exceptionReportWithdraw(parameter) {
  return axios({
    baseURL: baseurl,
    url: `/exceptionReport/withdraw?id=${parameter.id}`,
    method: 'post',
    data: parameter
  })
}
//售后异常报告单 END


//差旅报销单
export function reimburseAdd(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/reimburse/addAndUpdateReimburse',
    method: 'post',
    data: parameter
  })
}

export function reimburseApproval(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/reimburse/approvalReimburse',
    method: 'post',
    data: parameter
  })
}

export function reimburseDelete(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/reimburse/delReimburse',
    method: 'get',
    params: parameter
  })
}

export function reimburseDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/reimburse/reimburseDetail',
    method: 'get',
    params: parameter
  })
}

export function reimbursePageList(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/reimburse/reimbursePage',
    method: 'get',
    params: parameter
  })
}

export function reimburseWithdraw(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/reimburse/revocationReimburse',
    method: 'get',
    params: parameter
  })
}

export function reimburseSubmit(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/reimburse/submitReimburse',
    method: 'get',
    params: parameter
  })
}

export function travelListByUserIdForReimburse(parameter) {
  return axios({
    baseURL: baseurl,
    url: 'attenceTravelApply/travelListByUserIdForReimburse',
    method: 'get',
    params: parameter
  })
}

//差旅报销单END


//数据分析

/**数据分析-配件收款分析 */
export function accessoriesCollectionDetailCollectionAnalysis(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/accessories-collection-detail/collectionAnalysis',
    method: 'get',
    params: parameter
  })
}

/**数据分析-销售担保欠款 */
export function accessoriesManagementGuaranteeArrears(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/accessories-management/guaranteeArrears',
    method: 'get',
    params: parameter
  })
}

/**数据分析-销售担保欠款-合计 */
export function accessoriesManagementTotalAmount(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/accessories-management/totalAmount',
    method: 'get',
    params: parameter
  })
}

/**数据分析-售后成本统计 */
export function reimburseCostStatistics(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/reimburse/costStatistics',
    method: 'get',
    params: parameter
  })
}

/**数据分析-售后人员成本统计 */
export function reimburseUserCostStatistics(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/reimburse/userCostStatistics',
    method: 'get',
    params: parameter
  })
}

/**数据分析-客户验收分析 */
export function maintenanceTaskAcceptanceTaskAcceptance(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/maintenance-task-acceptance/taskAcceptancePage',
    method: 'get',
    params: parameter
  })
}

/**数据分析-过保分析 */
export function deviceArchivesWarrantyAnalyse(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/device-archives/warrantyAnalyse',
    method: 'get',
    params: parameter
  })
}

/**数据分析-过保统计 */
export function deviceArchivesWarrantyStatistics(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/csupport/device-archives/warrantyStatistics',
    method: 'get',
    params: parameter
  })
}


export function exportExcelDatas(key,params) {
  let map = {
    1:'/csupport/accessories-collection-detail/exportExcel',//售后管理-数据分析-配件收款分析-导出
    2:'/csupport/accessories-management/exportExcel',//数据分析-销售担保欠款-导出
    3:'/csupport/reimburse/exportExcel', //数据分析-售后成本统计-导出
    4:'/csupport/reimburse/userExportExcel', //数据分析-售后人员成本统计-导出
  }
  return axios({
    baseURL: system.baseURL,
    url: map[key],
    method: 'get',
    responseType:'blob',
    params: params
  })
}

//数据分析END

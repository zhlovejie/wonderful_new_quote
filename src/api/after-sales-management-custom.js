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
    url: '/exceptionReport/finishExceptionReport',
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
    url: '/exceptionReport/withdraw',
    method: 'post',
    data: parameter
  })
}
//售后异常报告单 END

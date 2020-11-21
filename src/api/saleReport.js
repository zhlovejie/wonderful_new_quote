import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

/**部门业绩分析统计报表分页列表 */
export function pageListDepartmentPerformanceReport (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/pageListDepartmentPerformanceReport',
    method: 'get',
    params: parameter
  })
}

/**发货分析统计报表分页列表 */
export function pageListInvoiceProductReport (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/pageListInvoiceProductReport',
    method: 'get',
    params: parameter
  })
}

/**人员业绩分析统计报表分页列表 */
export function pageListPersonnelPerformanceReport (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/pageListPersonnelPerformanceReport',
    method: 'get',
    params: parameter
  })
}
/**销售订单统计报表分页列表 */
export function pageListSaleOrderReport (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/pageListSaleOrderReport',
    method: 'get',
    params: parameter
  })
}

/**查询税率列表 */
export function listTargetTaxRate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/listTargetTaxRate',
    method: 'get',
    params: parameter
  })
}

/**下载部门业绩分析 、发货分析、人员业绩*/
export function exportExcelDatas(key,params) {
  let map = {
    1:'/saleReport/downInvoiceProductReport',
    2:'/saleReport/downPersonnelPerformanceReport',
    3:'/saleReport/downDepartmentPerformanceReport',
    4:'/saleReport/downSalesTop', //下载人员销售额排行榜
    5:'/reportRateMoney/exportReportRateMoney', //毛利率统计列表的下载
    6:'/reportRateMoney/exportReportProfitRateMoney' , //利润率统计列表的下载
    7:'/reportRateMoney/exportCollectReportRateMoney', //毛利率统计汇总列表的下载
    8:'/reportPerpareMoney/exportReportRateMoneyData', //预收账款分析
    9:'/reportPerpareMoney/exportReportRateMoneyCustomer', //客户预收款单
    10:'/reportPerpareMoney/exportReportRateMoneyContract' , //客户预收款单 合同列表
  }
  return axios({
    baseURL: system.baseURL,
    url: map[key],
    method: 'get',
    responseType:'blob',
    params: params
  })
}


/**人员销售额排行榜 */
export function salesTop (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/salesTop',
    method: 'get',
    params: parameter
  })
}

/**报表毛利率统计分页列表查询 */
export function grossMarginChartList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportRateMoney/pageListReportRateMoney',
    method: 'get',
    params: parameter
  })
}

/**报表毛利率统计汇总分页列表查询 */
export function grossMarginSummaryChartList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportRateMoney/pageListCollectReportRateMoney',
    method: 'get',
    params: parameter
  })
}

/**预收账款分析 */
export function pageListReportPrepareMoneyDate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportPerpareMoney/pageListReportPrepareMoneyDate',
    method: 'get',
    params: parameter
  })
}

/**客户预收款单 */
export function pageListReportRateMoneyCustomer (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportPerpareMoney/pageListReportRateMoneyCustomer',
    method: 'get',
    params: parameter
  })
}

/**客户预付款合同列表查询（合同信息） */
export function pageListReportPrepareMoneyContract (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportPerpareMoney/pageListReportPrepareMoneyContract',
    method: 'get',
    params: parameter
  })
}

/**客户预付款结算方式列表查询 */
export function pageListReportPrepareMoneyContractProduct (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportPerpareMoney/pageListReportPrepareMoneyContractProduct',
    method: 'get',
    params: parameter
  })
}

/**客户预付款收款列表查询 */
export function pageListReportPrepareMoneyContractRecieve (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportPerpareMoney/pageListReportPrepareMoneyContractRecieve',
    method: 'get',
    params: parameter
  })
}
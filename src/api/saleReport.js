import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
const api = {
  listSaleQuotaAnalysis: '/saleReport/listSaleQuotaAnalysis', // 销售额 对比分析
  listSaleQuotaAnalysisDetail: '/saleReport/listSaleQuotaAnalysisDetail', // 销售额 对比分析
  listSaleQuotaDownDetail: '/saleReport/downSaleQuotaAnalysisDetail', // 销售额 对比分析下载
  downDepartment: '/saleReport/downDepartmentPerformanceReport', // 部门业绩分析下载
  Statistical: '/saleReport/listSaleCategoryStatistical', // 销售类别统计
  downStatistical: '/saleReport/downSaleCategoryStatistical', // 销售类别统计


  SalesAnalysis: '/saleReport/listCustomerSalesAnalysis', // 客户销售额分析表
  listCustomerCategory: '/saleReport/listCustomerCategoryStatistical', //   客户销售额分析类别统计
  listCustomerProduct: '/saleReport/listCustomerProductStatistical', //   客户销售额分析产品统计
  downCustomerSalesAnalysis: '/saleReport/downCustomerSalesAnalysis', //   客户销售额分析下载
  downCustomerExponent: '/saleReport/downCustomerActivityExponent', //   客户活跃度分析下载
  listExponent: '/saleReport/listCustomerActivityExponent', //   客户活跃度分析下载
  getActivityFormula: '/reportActivity/activity-formula/getActivityFormula', //   获取计算公式
  saveAndUpdateFormula: '/reportActivity/activity-formula/saveAndUpdateFormula', //   计算公式新增修改
  reportActivityList: '/reportActivity/activity-exponent/listActivityExponent', //   活跃度指数设置列表
  saveAndUpdateIndexAdd: '/reportActivity/activity-exponent/saveAndUpdateIndex', //   活跃度指数设置新增修改
  saveAndUpdateIndexDelete: '/reportActivity/activity-exponent/delIndex', //   活跃度指数设置新增修改
  getOverdueWarningList: '/reportActivity/overdue-warning/getOverdueWarning', //   欠款超期预警设置
  UpdateOverdueWarning: '/reportActivity/overdue-warning/saveAndUpdateOverdueWarning', //   欠款超期预警设置新增修改




}

//   欠款超期预警设置新增修改
export function UpdateOverdueWarning(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.UpdateOverdueWarning,
    method: 'post',
    data: parameter
  })
}
//   欠款超期预警设置
export function getOverdueWarningList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getOverdueWarningList,
    method: 'get',
    params: parameter
  })
}

//  销售额 对比分析
export function listSaleQuotaAnalysis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.listSaleQuotaAnalysis,
    method: 'get',
    params: parameter
  })
}
//  销售额 对比分析详情
export function listSaleQuotaAnalysisDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.listSaleQuotaAnalysisDetail,
    method: 'get',
    params: parameter
  })
}
//销售额对比下载
export function listSaleQuotaDownDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.listSaleQuotaDownDetail,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

//部门分析下载
export function downDepartment(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.downDepartment,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

//销售类别统计
export function Statistical(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.Statistical,
    method: 'get',
    params: parameter
  })
}

//客户销售额分析表
export function SalesAnalysis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.SalesAnalysis,
    method: 'get',
    params: parameter
  })
}


//客户销售额分析类别统计
export function listCustomerCategory(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.listCustomerCategory,
    method: 'get',
    params: parameter
  })
}

// 客户销售额分析产品统计
export function listCustomerProduct(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.listCustomerProduct,
    method: 'get',
    params: parameter
  })
}

//客户分析下载
export function downCustomerSalesAnalysis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.downCustomerSalesAnalysis,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}
//客户活跃度分析下载
export function downCustomerExponent(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.downCustomerExponent,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

//销售类别下载
export function downStatistical(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.downStatistical,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

// 获取计算公式
export function getActivityFormula(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getActivityFormula,
    method: 'get',
    params: parameter
  })
}

// 获取计算公式
export function saveAndUpdateFormula(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.saveAndUpdateFormula,
    method: 'post',
    data: parameter
  })
}


// 获取活跃度指数
export function reportActivityList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.reportActivityList,
    method: 'get',
    params: parameter
  })
}



//活跃度指数设置新增修改
export function saveAndUpdateIndexAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.saveAndUpdateIndexAdd,
    method: 'post',
    data: parameter
  })
}
//活跃度指数设置删除
export function saveAndUpdateIndexDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.saveAndUpdateIndexDelete,
    method: 'post',
    data: parameter
  })
}








// 客户活跃度分析列表
export function listExponent(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.listExponent,
    method: 'get',
    params: parameter
  })
}







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
    11:'/customer/downloadLearnList', // 下载客户获知渠道统计表
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
    url: '/reportPerpareMoney/listReportPrepareMoneyDate',
    //url: '/reportPerpareMoney/pageListReportPrepareMoneyDate',
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

/**客户获知渠道统计列表 */
export function pageListReportStatisticsForLearn (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/customer/statisticsForLearn',
    method: 'get',
    params: parameter
  })
}


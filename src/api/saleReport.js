import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
const api = {
  listSaleQuotaAnalysis: '/saleReport/listSaleQuotaAnalysis', // 销售额 对比分析 
  listSaleQuotaAnalysisDetail: '/saleReport/listSaleQuotaAnalysisDetail', // 销售额 对比分析 
  listSaleQuotaDownDetail: '/saleReport/downSaleQuotaAnalysisDetail', // 销售额 对比分析下载 
  downDepartment: '/saleReport/downDepartmentPerformanceReport', // 部门业绩分析下载 
  Statistical: '/saleReport/listSaleCategoryStatistical', // 销售类别统计
  SalesAnalysis: '/saleReport/listCustomerSalesAnalysis', // 客户销售额分析表
  listCustomerCategory: '/saleReport/listCustomerCategoryStatistical', //   客户销售额分析类别统计
  listCustomerProduct: '/saleReport/listCustomerProductStatistical', //   客户销售额分析产品统计
  downCustomerSalesAnalysis: '/saleReport/downCustomerSalesAnalysis', //   客户销售额分析下载
  downCustomerExponent: '/saleReport/downCustomerActivityExponent', //   客户活跃度分析下载
  listExponent: '/saleReport/listCustomerActivityExponent', //   客户活跃度分析下载












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
export function pageListDepartmentPerformanceReport(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/pageListDepartmentPerformanceReport',
    method: 'get',
    params: parameter
  })
}

/**发货分析统计报表分页列表 */
export function pageListInvoiceProductReport(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/pageListInvoiceProductReport',
    method: 'get',
    params: parameter
  })
}

/**人员业绩分析统计报表分页列表 */
export function pageListPersonnelPerformanceReport(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/pageListPersonnelPerformanceReport',
    method: 'get',
    params: parameter
  })
}
/**销售订单统计报表分页列表 */
export function pageListSaleOrderReport(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/pageListSaleOrderReport',
    method: 'get',
    params: parameter
  })
}

/**查询税率列表 */
export function listTargetTaxRate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleReport/listTargetTaxRate',
    method: 'get',
    params: parameter
  })
}

/**下载部门业绩分析 、发货分析、人员业绩*/
export function exportExcelDatas(key, params) {
  let map = {
    1: '/saleReport/downInvoiceProductReport',
    2: '/saleReport/downPersonnelPerformanceReport',
    3: '/saleReport/downDepartmentPerformanceReport'
  }
  return axios({
    baseURL: system.baseURL,
    url: map[key],
    method: 'get',
    responseType: 'blob',
    params: params
  })
}

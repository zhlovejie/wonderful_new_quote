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
    3:'/saleReport/downDepartmentPerformanceReport'
  }
  return axios({
    baseURL: system.baseURL,
    url: map[key],
    method: 'get',
    responseType:'blob',
    params: params
  })
}


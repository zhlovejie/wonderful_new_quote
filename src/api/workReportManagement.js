import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

//---------------------工作上报设置-----------------------
/**工作上报设置分页列表 */
export function workReportSetPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportSet/getWorkReportSetByPage',
    method: 'get',
    params: parameter
  })
}
/**工作上报设置的删除 */
export function workReportSetDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportSet/removeWorkReport',
    method: 'get',
    params: parameter
  })
}

/**工作上报设置的新增或者修改 */
export function workReportSetSaveAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportSet/saveOrUpdateWorkReport',
    method: 'post',
    data: parameter
  })
}

//---------------------工作上报设置-END-------------------

//---------------------工作日报-----------------------
/**工作日报分页列表 */
export function workReportSetDailyPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportDaily/getWorkReportByPage',
    method: 'get',
    params: parameter
  })
}
/**获取日报详情 */
export function workReportSetDailyDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportDaily/getDetail',
    method: 'get',
    params: parameter
  })
}
/**新增或修改工作日报 */
export function workReportSetDailySaveAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportDaily/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
/**删除工作日报 */
export function workReportSetDailyDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportDaily/delete',
    method: 'get',
    params: parameter
  })
}

/**撤销日报 */
export function workReportSetDailyRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportDaily/revocation',
    method: 'get',
    params: parameter
  })
}
//---------------------工作日报-END-------------------


//---------------------工作周报-----------------------
/**周报列表 */
export function workReportSetWeekPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportWeek/pageList',
    method: 'get',
    params: parameter
  })
}
/**撤销周报 */
export function workReportSetWeekRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportWeek/revocation',
    method: 'get',
    params: parameter
  })
}
/**周报详情 */
export function workReportSetWeekDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportWeek/getDetail',
    method: 'get',
    params: parameter
  })
}
/**删除工作周报 */
export function workReportSetWeekDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportWeek/delete',
    method: 'get',
    params: parameter
  })
}
/**周报新增或修改 */
export function workReportSetWeekSaveAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportWeek/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------工作周报-END-------------------

//---------------------工作月报-----------------------
/**月报列表 */
export function workReportSetMonthPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportMonth/pageList',
    method: 'get',
    params: parameter
  })
}
/**撤销月报 */
export function workReportSetMonthRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportMonth/revocation',
    method: 'get',
    params: parameter
  })
}
/**月报详情 */
export function workReportSetMonthDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportMonth/getDetail',
    method: 'get',
    params: parameter
  })
}
/**删除工作月报 */
export function workReportSetMonthDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportMonth/delete',
    method: 'get',
    params: parameter
  })
}
/**月报新增或修改 */
export function workReportSetMonthSaveAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reportMonth/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------工作月报-END-------------------


import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------食堂菜单-----------------------
/**新增或修改 */
export function canteenMenuAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenMenu/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
/**审批 */
export function canteenMenuApprove (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenMenu/approve',
    method: 'post',
    data: parameter
  })
}

/**判断某一日期范围内是否已经有菜单 */
export function canteenMenuCheckDate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenMenu/checkDate',
    method: 'get',
    params: parameter
  })
}
/**删除食堂菜单 */
export function canteenMenuDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenMenu/delete',
    method: 'post',
    data: parameter
  })
}
/**获取食堂菜单详情 */
export function canteenMenuDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenMenu/getDetail',
    method: 'get',
    params: parameter
  })
}

/**获取食堂菜单分页列表 */
export function canteenMenuPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenMenu/pageList',
    method: 'get',
    params: parameter
  })
}
/**发布食堂菜单 */
export function canteenMenuPublish (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenMenu/publish',
    method: 'post',
    data: parameter
  })
}
/**撤销 */
export function canteenMenuRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenMenu/revocation',
    method: 'post',
    data: parameter
  })
}

//---------------------食堂菜单--END------------------

//---------------------食堂评价--END------------------
export function canteenEvaluateAdd (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenEvaluate/add',
    method: 'post',
    data: parameter
  })
}
export function canteenEvaluateDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenEvaluate/detail',
    method: 'get',
    params: parameter
  })
}

/**最近十条已发布的菜单列表 */
export function canteenEvaluateMenuList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenEvaluate/menuListForEvaluate',
    method: 'get',
    params: parameter
  })
}
/**分页列表 */
export function canteenEvaluatePage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/canteenEvaluate/pageList',
    method: 'get',
    params: parameter
  })
}
//---------------------食堂评价--END------------------
import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------我的资产-----------------------
/**我的资产列表分页条件查询 */
export function oaAssertsInfoMyAssertsList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-receive-history/getMyListAsserts',
    method: 'get',
    params: parameter
  })
}

/*查询资产*/
export function oaAssertsInfoMyAssertsAllList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-receive-history/getAllListAsserts',
    method: 'get',
    params: parameter
  })
}
/*资产新增*/
export function oaAssertsInfoAssertsAdd (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-info/saveAssertsInfo',
    method: 'post',
    data: parameter
  })
}

/*资产领取*/
export function oaAssertsInfoAssertsDraw (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-info/drawAssert',
    method: 'post',
    data: parameter
  })
}




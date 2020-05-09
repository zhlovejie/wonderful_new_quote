import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'


//---------------------客户释放---------------------------
/**客户释放规则详情 */
export function customerReleaseRuleDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerReleaseRule/detail',
    method: 'get',
    params: parameter
  })
}

/**删除客户释放规则 */
export function customerReleaseRuleDelete (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerReleaseRule/delete',
    method: 'post',
    data: params
  })
}

/**新增或者修改客户释放规则 */
export function customerReleaseRuleAddOrUpdate (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerReleaseRule/addOrUpdate',
    method: 'post',
    data: params
  })
}

//---------------------客户释放-END-----------------------

//---------------------客户申诉单---------------------------
export function customerAppealList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerAppeal/pageList',
    method: 'get',
    params: parameter
  })
}
/**客户申诉单详情 */
export function customerAppealDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerAppeal/detail',
    method: 'get',
    params: parameter
  })
}
/**删除客户申诉单 */
export function customerAppealDelete (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerAppeal/delete',
    method: 'post',
    data: params
  })
}
/**审批客户申诉单 */
export function customerAppealApproval (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerAppeal/approvalAppeal',
    method: 'post',
    data: params
  })
}
/**新增客户申诉单 */
export function customerAppealAdd (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerAppeal/add',
    method: 'post',
    data: params
  })
}
//---------------------客户申诉单-END-----------------------
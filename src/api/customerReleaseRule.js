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

//---------------------客户逾期处罚规则接口---------------------------
export function customerPunishRuleDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerPunishRule/detail',
    method: 'get',
    params: parameter
  })
}

export function customerPunishRuleDelete (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerPunishRule/delete',
    method: 'post',
    data: params
  })
}

export function customerPunishRuleAddOrUpdate (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerPunishRule/addOrUpdate',
    method: 'post',
    data: params
  })
}
//---------------------客户逾期处罚规则接口-END-----------------------

//---------------------客户逾期处罚规则详情接口---------------------------
export function customerPunishDetailList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerPunishDetail/list',
    method: 'get',
    params: parameter
  })
}

export function customerPunishDetailDelete (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerPunishDetail/delete',
    method: 'post',
    data: params
  })
}

export function customerPunishDetailAddOrUpdate (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerPunishDetail/addOrUpdate',
    method: 'post',
    data: params
  })
}

//---------------------客户逾期处罚规则详情接口-END-----------------------

//---------------------客户逾期处罚记录接口---------------------------
export function customerPunishRecordList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerPunishRecord/pageList',
    method: 'get',
    params: parameter
  })
}

export function customerPunishRecordDelete (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerPunishRecord/delete',
    method: 'post',
    data: params
  })
}

export function customerPunishRecordUploadTicket (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerPunishRecord/uploadTicket',
    method: 'post',
    data: params
  })
}

export function customerPunishRecordDownloadTemplate (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/customerPunishRecord/downloadTemplate',
    method: 'get',
    responseType: 'blob',
    params: params
  })
}
//---------------------客户逾期处罚记录接口-END-----------------------
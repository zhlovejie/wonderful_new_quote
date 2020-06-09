import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------降本记录-----------------------

/**降本记录新增或修改 */
export function depreciateApplyAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateApply/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

/**降本记录审批 */
export function depreciateApplyApprove (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateApply/approve',
    method: 'post',
    data: parameter
  })
}

/**降本记录删除 */
export function depreciateApplyDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateApply/delete',
    method: 'post',
    data: parameter
  })
}

/**降本记录详情 */
export function depreciateApplyDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateApply/detail',
    method: 'get',
    params: parameter
  })
}

/**获取提交应用页面所需的数据 */
export function depreciateApplyDetailUse (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateApply/detailForUse',
    method: 'get',
    params: parameter
  })
}

/**降本记录列表 */
export function depreciateApplyPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateApply/pageList',
    method: 'get',
    params: parameter
  })
}

/**降本记录撤回 */
export function depreciateApplyRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateApply/revocation',
    method: 'post',
    data: parameter
  })
}

/**降本记录应用 */
export function depreciateApplyUse (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateApply/use',
    method: 'post',
    data: parameter
  })
}

//---------------------降本记录--END------------------

//---------------------降本考核规则记录-----------------------
export function depreciateRuleAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateRule/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

export function depreciateRuleDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateRule/delete',
    method: 'post',
    data: parameter
  })
}

export function depreciateDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateRule/detail',
    method: 'get',
    params: parameter
  })
}

/**根据降本申请单查询参与人员列表  在未处理且未撤销的情况下调用 */
export function depreciateUserListByApply (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateUser/listByApply',
    method: 'get',
    params: parameter
  })
}

/**根据降本考核记录详情查询参与人员列表 其他的情况都调用 */
export function depreciateRecordUserListByDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateRecordUser/listByDetail',
    method: 'get',
    params: parameter
  })
}

//---------------------降本考核规则记录--END------------------

//---------------------降本考核记录-----------------------
export function depreciateRecordApprove (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateRecord/approve',
    method: 'post',
    data: parameter
  })
}

export function depreciateRecordDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateRecord/delete',
    method: 'post',
    data: parameter
  })
}

export function depreciateRecordDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateRecord/detail',
    method: 'get',
    params: parameter
  })
}

export function depreciateRecordDispose (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateRecord/dispose',
    method: 'post',
    data: parameter
  })
}

export function depreciateRecordPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateRecord/pageList',
    method: 'get',
    params: parameter
  })
}

export function depreciateRecordRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/depreciateRecord/revocation',
    method: 'post',
    data: parameter
  })
}
//---------------------降本考核记录-----------------------
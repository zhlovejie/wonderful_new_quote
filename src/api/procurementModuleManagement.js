import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

const materialBaseUrl = system.materialBaseUrl

/**详情 */
export function requestApplyDetail(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/requestApply',
    method: 'GET',
    params: parameter
  })
}
/**新增 */
export function requestApplyAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/requestApply',
    method: 'POST',
    data: parameter
  })
}
/**修改 */
export function requestApplyUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/requestApply',
    method: 'PUT',
    data: parameter
  })
}
/**删除 */
export function requestApplyDelete(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: `/requestApply?${parameter}`,
    method: 'DELETE'
  })
}

/**审批 */
export function requestApplyApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/requestApply/audit',
    method: 'POST',
    data: parameter
  })
}
/**撤销 */
export function requestApplyRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/requestApply/revocation',
    method: 'POST',
    data: parameter
  })
}

/**调整需求数量 */
export function requestApplyChangeNum(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/requestApply/changeRequestNum',
    method: 'POST',
    data: parameter
  })
}

/**分页列表，全部权限码：requestApply:all */
export function requestApplyPageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/requestApply/pageList',
    method: 'GET',
    params: parameter
  })
}

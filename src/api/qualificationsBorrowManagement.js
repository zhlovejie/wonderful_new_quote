import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

/**经销商合同 新增或修改 */
export function dealerContractAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dealerContract/addOrUpdate',
    method: 'post',
    data:parameter
  })
}

/**经销商合同 审批 */
export function dealerContractApprove (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dealerContract/approve',
    method: 'post',
    data:parameter
  })
}

/**经销商合同 删除 */
export function dealerContractDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dealerContract/delete',
    method: 'post',
    data:parameter
  })
}

/**经销商合同 撤销 */
export function dealerContractRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dealerContract/revocation',
    method: 'post',
    data:parameter
  })
}
/**经销商合同 详情 */
export function dealerContractDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dealerContract/detail',
    method: 'get',
    params:parameter
  })
}

/**经销商合同 获取合同流水号 */
export function dealerContractGenerateContractNum (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dealerContract/generateContractNum',
    method: 'get',
    params:parameter
  })
}

/**经销商合同 分页列表，所有权限码：dealerContract:all */
export function dealerContractPageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dealerContract/pageList',
    method: 'get',
    params:parameter
  })
}

/**经销商合同 添加附件 */
export function dealerContractAddAccessoryn (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dealerContract/addAccessory',
    method: 'post',
    data:parameter
  })
}


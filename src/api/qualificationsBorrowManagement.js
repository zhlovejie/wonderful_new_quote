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


/**战略合作协议 新增或修改 */
export function cooperationProtocolAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/cooperationProtocol/addOrUpdate',
    method: 'post',
    data:parameter
  })
}

/**战略合作协议 审批 */
export function cooperationProtocolApprove (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/cooperationProtocol/approve',
    method: 'post',
    data:parameter
  })
}

/**战略合作协议 删除 */
export function cooperationProtocolDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/cooperationProtocol/delete',
    method: 'post',
    data:parameter
  })
}

/**战略合作协议 撤销 */
export function cooperationProtocolRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/cooperationProtocol/revocation',
    method: 'post',
    data:parameter
  })
}
/**战略合作协议 详情 */
export function cooperationProtocolDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/cooperationProtocol/detail',
    method: 'get',
    params:parameter
  })
}

/**战略合作协议 获取合同流水号 */
export function cooperationProtocolGenerateContractNum (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/cooperationProtocol/generateProtocolNum',
    method: 'get',
    params:parameter
  })
}

/**战略合作协议 分页列表，所有权限码：cooperationProtocol:all */
export function cooperationProtocolPageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/cooperationProtocol/pageList',
    method: 'get',
    params:parameter
  })
}

/**战略合作协议 添加附件 */
export function cooperationProtocolAddAccessory (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/cooperationProtocol/addAccessory',
    method: 'post',
    data:parameter
  })
}


/**资质借用合同 绑定代理合同 */
export function borrowBindingAgencyContract (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/borrow/bindingAgencyContract',
    method: 'post',
    data:parameter
  })
}


/**资质借用合同 绑定销售合同 */
export function borrowBindingSaleContract (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/borrow/bindingSaleContract',
    method: 'post',
    data:parameter
  })
}
/**资质借用合同 判断客户是否签订了相关合同，如果是则返回合同 */
export function borrowCheckContract (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/borrow/checkContract',
    method: 'get',
    params:parameter
  })
}

/**资质借用合同 详情 */
export function borrowDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/borrow/detail',
    method: 'get',
    params:parameter
  })
}

/**资质借用合同 分页列表，所有权限码：borrow:all */
export function borrowPageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/borrow/pageList',
    method: 'get',
    params:parameter
  })
}


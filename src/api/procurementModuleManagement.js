import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

const materialBaseUrl = system.materialBaseUrl
/**采购申请单 */
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
/**采购申请单 END*/


/**采购报价单 */
  /**审核详情 */
  export function quotationDetail(parameter) {
    return axios({
      baseURL: materialBaseUrl,
      url: '/quotation',
      method: 'GET',
      params: parameter
    })
  }
  /**修改页面详情 */
  export function quotationDetailForUpdate(parameter) {
    return axios({
      baseURL: materialBaseUrl,
      url: '/quotation/detailForUpdate',
      method: 'GET',
      params: parameter
    })
  }
  /**新增 */
  export function quotationAdd(parameter) {
    return axios({
      baseURL: system.baseURL,
      url: '/quotation',
      method: 'POST',
      data: parameter
    })
  }
  /**修改 */
  export function quotationUpdate(parameter) {
    return axios({
      baseURL: system.baseURL,
      url: '/quotation',
      method: 'PUT',
      data: parameter
    })
  }
  /**审批 */
  export function quotationApproval(parameter) {
    return axios({
      baseURL: system.baseURL,
      url: '/quotation/audit',
      method: 'POST',
      data: parameter
    })
  }

  /**分页列表（待审批已审批和全部），全部列表权限码：quotation:all */
  export function quotationPageList(parameter) {
    return axios({
      baseURL: materialBaseUrl,
      url: '/quotation/pageList',
      method: 'GET',
      params: parameter
    })
  }

  /**公示列表 */
  export function quotationPublicPageList(parameter) {
    return axios({
      baseURL: materialBaseUrl,
      url: '/quotation/publicityList',
      method: 'GET',
      params: parameter
    })
  }
/**采购报价单 END*/


/**采购询价单 */
export function enquiryAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/enquiry',
    method: 'POST',
    data: parameter
  })
}
/**采购询价单 END*/


/**采购单 */
/**详情 */
export function orderDetail(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/order',
    method: 'GET',
    params: parameter
  })
}

/**新增 */
export function orderAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/order',
    method: 'POST',
    data: parameter
  })
}

/**根据物料id获取该物料最新采购价 */
export function getOrderLastPrice(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/order/getLastPrice',
    method: 'GET',
    params: parameter
  })
}

/**分页列表 */
export function orderPageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/order/pageList',
    method: 'GET',
    params: parameter
  })
}
/**采购单 END*/

/**报价异常信息接口 */
export function quotationExceptionAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quotationException',
    method: 'POST',
    data: parameter
  })
}
/**报价异常信息接口 END*/

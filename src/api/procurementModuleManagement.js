import { axios } from '@/utils/request'
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
    baseURL: materialBaseUrl,
    url: '/requestApply',
    method: 'POST',
    data: parameter
  })
}
/**修改 */
export function requestApplyUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
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
    baseURL: materialBaseUrl,
    url: '/requestApply/audit',
    method: 'POST',
    data: parameter
  })
}
/**撤销 */
export function requestApplyRevocation(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/requestApply/revocation',
    method: 'POST',
    data: parameter
  })
}

/**调整需求数量 */
export function requestApplyChangeNum(parameter) {
  return axios({
    baseURL: materialBaseUrl,
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

//根据物料查询相应的供应商列表
export function quotationSupplierList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/quotation/supplierList',
    method: 'GET',
    params: parameter
  })
}
//判断供应商是否有采购某一物料的资格，返回true为有资格
export function quotationCheckSupplier(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/quotation/checkSupplier',
    method: 'GET',
    params: parameter
  })
}

//获取最新采购单价
export function lastOrderPrice(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/quotation/lastOrderPrice',
    method: 'GET',
    params: parameter
  })
}

//待审批列表 是否有审批权限
export function hasAuthApprove(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/quotation/isApprove',
    method: 'GET',
    params: parameter
  })
}

//公示列表，是否有权限异议报价
export function hasAuthDiffOrder(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/quotation/isObjection',
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

/** 采购管理-采购需求驳回接口 */
export function quotationReject(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/reject',
    method: 'POST',
    data: parameter
  })
}

/**收料管理 */

//申请收料
export function receiveAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/receive',
    method: 'POST',
    data: parameter
  })
}

//新增收料单申请
export function receiveAddApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/receive/addReceive',
    method: 'POST',
    data: parameter
  })
}

//提货单列表查询
export function receivePageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/receive/listReceive',
    method: 'GET',
    params: parameter
  })
}

//批量更新收料单数量
export function updateReceiveNum(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/receive/updateReceiveNum',
    method: 'POST',
    data: parameter
  })
}
/**收料管理 END*/

/**提货单管理 */
//新增提货单申请
export function pickUpAddApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/pickUp/addPickUp',
    method: 'POST',
    data: parameter
  })
}
//提货单列表查询
export function pickUpPageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/pickUp/listPickUp',
    method: 'GET',
    params: parameter
  })
}
//添加提货单运费申请
export function updatePickUpFreigh(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/pickUp/updatePickUpFreigh',
    method: 'POST',
    data: parameter
  })
}
/**提货单管理 END*/

/**采购完成 */

//采购完成
export function orderFinish(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/orderFinish',
    method: 'POST',
    data: parameter
  })
}

//审批
export function orderFinishAudit(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/orderFinish/audit',
    method: 'POST',
    data: parameter
  })
}
//采购完成分页列表
export function orderFinishPageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/orderFinish/pageList',
    method: 'GET',
    params: parameter
  })
}

export function orderProcessList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/orderProcess/detail',
    method: 'GET',
    params: parameter
  })
}
/**采购完成 END */

/** 采购合同 */

/**新增或修改（变更） */
export function purchaseContractAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/purchase/contract/addOrUpdate',
    method: 'POST',
    data: parameter
  })
}

/**审批 */
export function purchaseContractApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/purchase/contract/approval',
    method: 'POST',
    data: parameter
  })
}

/**列表 */
export function purchaseContractList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/purchase/contract/contractListVo',
    method: 'GET',
    params: parameter
  })
}

/**删除 */
export function purchaseContractDel(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/purchase/contract/del',
    method: 'GET',
    params: parameter
  })
}

/**详情 */
export function purchaseContractDetail(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/purchase/contract/getDetailById',
    method: 'GET',
    params: parameter
  })
}

/**分页列表 */
export function purchaseContractPageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/purchase/contract/pageContractListVo',
    method: 'GET',
    params: parameter
  })
}

/**撤回 */
export function purchaseContractRevocation(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/purchase/contract/revocation',
    method: 'GET',
    params: parameter
  })
}

/**根据供应上id获取供应商信息（采购合同） */
export function getDetailBySupplierId(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/order/getDetailBySupplierId',
    method: 'GET',
    params: parameter
  })
}

/**采购订单位置->采购需求单列表(查询合同中产品信息) */
export function purchaseContractOrderList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/order/listRequestApplyOrChange',
    method: 'GET',
    params: parameter
  })
}

/**采购合同第二步 产品变更  刷新用 查询需求信息 */
export function purchaseContractOrderListRefresh(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/order/getRequestApplyOrChange',
    method: 'GET',
    params: parameter
  })
}

/**合同附件-新增 */
export function purchaseContractAttachmentAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/purchase/contract-attachment/addOrUpdate',
    method: 'POST',
    data: parameter
  })
}
/**合同附件-删除 */
export function purchaseContractAttachmentDel(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/purchase/contract-attachment/delById',
    method: 'GET',
    params: parameter
  })
}

/**合同附件-详情 */
export function purchaseContractAttachmentDetail(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/purchase/contract-attachment/getDetailById',
    method: 'GET',
    params: parameter
  })
}

/**合同附件-列表 */
export function purchaseContractAttachmentList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/purchase/contract-attachment/getList',
    method: 'GET',
    params: parameter
  })
}

/** 采购合同 END*/

/**采购订单位置->采购需求单列表 */
export function quotationRequestApplyPageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/order/listRequestApply',
    method: 'GET',
    params: parameter
  })
}

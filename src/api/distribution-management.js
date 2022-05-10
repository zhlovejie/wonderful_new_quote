import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'



//  根据物流拿去方数
export function listMaterialInfoByCodes(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: '/productMaterialInfo/listMaterialInfoByCodes',
    method: 'get',
    params: parameter
  })
}

//---------------------物流管理模块-----------------------
/**配货站信息列表接口 */
export function DistributionList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-distribution-station/page',
    method: 'get',
    params: parameter
  })
}

/**配货站新增修改 */
export function DistributionAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-distribution-station/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**配货站信息详情接口 */
export function DistributionInfot(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-distribution-station/info',
    method: 'get',
    params: parameter
  })
}
/** 配货站信息删除接口 */
export function DistributionDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-distribution-station/del',
    method: 'delete',
    params: parameter

  })
}



/**物流信息列表接口 */
export function logisticsList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-information/page',
    method: 'get',
    params: parameter
  })
}


/** 物流信息列表删除接口 */
export function logisticsDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-information/del',
    method: 'delete',
    params: parameter

  })
}


/**身份证信息查询 */
export function getCardNo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-pilot/getCardNo',
    method: 'get',
    params: parameter
  })
}
// 

/**自动生成编号 */
export function logisticsNum(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-information/logisticsNum',
    method: 'get',
    params: parameter
  })
}
/**物流信息保存 */
export function logisticsPreservation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-information/addAndUpdate',
    method: 'post',
    data: parameter
  })
}

/**物流信息详情 */
export function getQueryOne(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-information/info',
    method: 'get',
    params: parameter
  })
}

/**承运方下拉列表 */
export function stationList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-distribution-station/list',
    method: 'get',
    params: parameter
  })
}
/**发货单列表 */
export function getList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-invoice/selectListByPage',
    method: 'get',
    params: parameter
  })
}

// 
/**回访记录 */
export function returnVisit(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-return-visit-record-detail/getByIdQueryInfo',
    method: 'get',
    params: parameter
  })
}
/**物流报价记录 分页 */
export function logisticsOfferList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-offer/page',
    method: 'get',
    params: parameter
  })
}
/**物流报价记录 新增 */
export function logisticsSaveLogisticsOffer(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-offer/saveLogisticsOffer',
    method: 'post',
    data: parameter
  })
}
/**物流报价记录 详情 */
export function logisticgetDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-offer/getDetail',
    method: 'get',
    params: parameter
  })
}
/**物流报价记录 报价 修改 */
export function updateLogisticsOffer(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-offer/updateLogisticsOffer',
    method: 'post',
    data: parameter
  })
}
/**我方货物运输记录 分页 */
export function transportPage(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-product-transport/page',
    method: 'get',
    params: parameter
  })
}
/**新增物流单号查询接口 */
export function listInformation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-product-transport/listInformation',
    method: 'get',
    params: parameter
  })
}
/**我方货物运输记录 新增 */
export function saveProductTransport(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-product-transport/saveProductTransport',
    method: 'post',
    data: parameter
  })
}
/**我方货物运输记录删除 */
export function listInformationdelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-product-transport/delete',
    method: 'get',
    params: parameter
  })
}

/**回访规则列表查询 */
export function recordRuleList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-return-visit-record-rule/list',
    method: 'get',
    params: parameter
  })
}
/**回访规则 新增 */
export function ruleSaveAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-return-visit-record-rule/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**回访规则 删除 */
export function recordRuledelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-return-visit-record-rule/delete',
    method: 'get',
    params: parameter
  })
}
/**回访记录 */
export function listLogisticsReturnVisitRecordDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-return-visit-record-detail/listLogisticsReturnVisitRecordDetail',
    method: 'get',
    params: parameter
  })
}
/**提成规则分页*/
export function getFeeRuleList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-admin-fee-rule/getFeeRuleList',
    method: 'get',
    params: parameter
  })
}
/**提成规则撤回*/
export function getFeeRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-admin-fee-rule/revocation',
    method: 'get',
    params: parameter
  })
}
/**提成规则删除*/
export function getFeedelFeeRule(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-admin-fee-rule/delFeeRule',
    method: 'get',
    params: parameter
  })
}
/**提成规则 新增 */
export function addAndUpdateFeeRule(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-admin-fee-rule/addAndUpdateFeeRule',
    method: 'post',
    data: parameter
  })
}
/**提成规则 审批 */
export function addAndapproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-admin-fee-rule/approval',
    method: 'post',
    data: parameter
  })
}

/**净利润列表*/
export function getFeeProfitList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-admin-fee-profit/getFeeProfitList',
    method: 'get',
    params: parameter
  })
}
//微信
export function logisticsgetWxPayQrCode(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-admin-fee-profit/getWxPayQrCode',
    method: 'get',
    params: parameter
  })
}

//支付宝
export function logisticsgetAliPayQrCode(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-admin-fee-profit/getAliPayQrCode',
    method: 'get',
    params: parameter
  })
}

//金额
export function getAmount(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-admin-fee-profit/getAmount',
    method: 'get',
    params: parameter
  })
}
//明细
export function getCollectionDetailList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-collection-detail/getCollectionDetailList',
    method: 'get',
    params: parameter
  })
}
// 搬运管理
export function listCarryAdminInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-carry-admin-info/listCarryAdminInfo',
    method: 'get',
    params: parameter
  })
}
// 工价列表
export function adminList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-carry-admin-rule/list',
    method: 'get',
    params: parameter
  })
}
// 工价设置 新增
export function adminsaveAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-carry-admin-rule/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
// // 搬运管理详情
export function admingetDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-carry-admin-info/getDetail',
    method: 'get',
    params: parameter
  })
}

//下载
export function exportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/logistics/logistics-carry-admin-info/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

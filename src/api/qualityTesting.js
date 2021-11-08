import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
const baseURL = system.materialBaseUrl
const api = {
  quality_pageList: '/quality-material-source-check/pageList', //来料检验单分页列表的条件查询
  quality_getCheckDetail: '/quality-material-source-check/getCheckDetail', //来料检验单详情查询
  quality_getCheckDealCheck: '/quality-material-source-check/dealCheck', //处理或修改来料检验单
  quality_getCheckGetMaterialId: '/checkInspectionStandardSet/getMaterialIdStandardSetByMaterialId', //根据物料id查询检验标准详情
  quality_trust_pageList: '/quality-trust-check/pageList', //委外检验单分页列表的条件查询
  quality_trust_getCheckDetail: '/quality-trust-check/getCheckDetail', //委外检验单详情查询
  quality_trust_dealCheck: '/quality-trust-check/dealCheck', //处理或修改委外检验单
  quality_finish_pageList: '/quality-finish-check/pageList', //制程检验单分页列表的条件查询
  quality_finish_getCheckDetail: '/quality-finish-check/getCheckDetail', //制程检验单详情查询
  quality_finish_dealCheck: '/quality-finish-check/dealCheck', //处理或修改制程检验单
  quality_scrap_pageList: '/quality-scrap-check/pageList', //报废检验单分页列表的条件查询
  quality_scrap_getCheckDetail: '/quality-scrap-check/getCheckDetail', //报废检验单详情查询
  quality_scrap_dealCheck: '/quality-scrap-check/dealCheck', //处理或修改报废检验单
  qualitygetUnqualifityDealPage: '/quality-unqualifity-deal/getUnqualifityDealPage', //不良品分页列表
  getUnQualifityDealDetail: '/quality-unqualifity-deal/getUnQualifityDealDetail', //不良品详情
  addAndUpdateUnqualifityDeal: '/quality-unqualifity-deal/addAndUpdateUnqualifityDeal', //不良品详情
  getPurchaseDisputeDealPage: '/quality-purchase-dispute-deal/getPurchaseDisputeDealPage', //采购议价记录单列表
  getPurchaseDisputeDealDetail: '/quality-purchase-dispute-deal/getPurchaseDisputeDealDetail', //采购议价记录单详情
  addAndUpdatePurchaseDisputeDeal: '/quality-purchase-dispute-deal/addAndUpdatePurchaseDisputeDeal', //处理或修改采购议价记录单
  sourceFinishCheck: '/quality-material-source-check/finishCheck', //完结
  finishCheck: '/quality-trust-check/finishCheck', //完结


}
//处理或修改采购议价记录单
export function sourceFinishCheck(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.sourceFinishCheck,
    method: 'post',
    data: parameter
  })
}
//处理或修改采购议价记录单
export function finishCheck(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.finishCheck,
    method: 'post',
    data: parameter
  })
}
//处理或修改采购议价记录单
export function addAndUpdatePurchaseDisputeDeal(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.addAndUpdatePurchaseDisputeDeal,
    method: 'post',
    data: parameter
  })
}
//采购议价记录单详情
export function getPurchaseDisputeDealDetail(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.getPurchaseDisputeDealDetail,
    method: 'get',
    params: parameter
  })
}
//采购议价记录单列表
export function getPurchaseDisputeDealPage(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.getPurchaseDisputeDealPage,
    method: 'get',
    params: parameter
  })
}
//处理或修改报废检验单
export function addAndUpdateUnqualifityDeal(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.addAndUpdateUnqualifityDeal,
    method: 'post',
    data: parameter
  })
}
//不良品详情
export function getUnQualifityDealDetail(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.getUnQualifityDealDetail,
    method: 'get',
    params: parameter
  })
}
//不良品分页列表
export function qualitygetUnqualifityDealPage(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.qualitygetUnqualifityDealPage,
    method: 'get',
    params: parameter
  })
}

//报废检验单详情查询
export function quality_scrap_getCheckDetail(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_scrap_getCheckDetail,
    method: 'get',
    params: parameter
  })
}
//处理或修改报废检验单
export function quality_scrap_dealCheck(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_scrap_dealCheck,
    method: 'post',
    data: parameter
  })
}
//制程检验单详情查询
export function quality_scrap_pageList(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_scrap_pageList,
    method: 'get',
    params: parameter
  })
}
//制程检验单详情查询
export function quality_finish_getCheckDetail(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_finish_getCheckDetail,
    method: 'get',
    params: parameter
  })
}
//处理或修改制程检验单
export function quality_finish_dealCheck(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_finish_dealCheck,
    method: 'post',
    data: parameter
  })
}
//制程检验单分页列表的条件查询
export function quality_finish_pageList(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_finish_pageList,
    method: 'get',
    params: parameter
  })
}
//处理或修改委外检验单
export function quality_trust_dealCheck(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_trust_dealCheck,
    method: 'post',
    data: parameter
  })
}
//委外检验单详情查询
export function quality_trust_getCheckDetail(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_trust_getCheckDetail,
    method: 'get',
    params: parameter
  })
}
//委外检验单分页列表的条件查询
export function quality_trust_pageList(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_trust_pageList,
    method: 'get',
    params: parameter
  })
}

//根据物料id查询检验标准详情
export function quality_getCheckGetMaterialId(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_getCheckGetMaterialId,
    method: 'get',
    params: parameter
  })
}
//来料检验单分页列表的条件查询
export function quality_pageList(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_pageList,
    method: 'get',
    params: parameter
  })
}
//来料检验单详情查询
export function quality_getCheckDetail(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_getCheckDetail,
    method: 'get',
    params: parameter
  })
}
//处理或修改来料检验单
export function quality_getCheckDealCheck(parameter) {
  return axios({
    baseURL: baseURL,
    url: api.quality_getCheckDealCheck,
    method: 'post',
    data: parameter
  })
}

import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

const baseURL = system.materialBaseUrl
/* 委外管理-加工需求变更单-换料变更-Start */
// 换料单-列表（searchStatus审批状态：0 全部 1 待审批 2 已审批）
export function refuellingPageList(parameter) {
  return axios({
    baseURL,
    url: '/outsource/source-change-apply/listSourceChangeApply',
    method: 'get',
    params: parameter
  })
}
//换料单-详情
export function refuellingDetail(parameter) {
  return axios({
    baseURL,
    url: '/outsource/source-change-apply/getSourceChangeDetail',
    method: 'get',
    params: parameter
  })
}
//换料单-新增/编辑
export function refuellingAdd(parameter) {
  return axios({
    baseURL,
    url: '/outsource/source-change-apply/saveOrUpdateSourceChange',
    method: 'post',
    data: parameter
  })
}
// 换料单-根据单据id数组【idList】删除记录
export function refuellingDelete(parameter) {
  return axios({
    baseURL,
    url: `/outsource/source-change-apply/remove?${parameter}`,
    method: 'post',
    data: {}
  })
}
// 换料单-根据单据id撤回记录
export function refuellingWithdraw(parameter) {
  return axios({
    baseURL,
    url: `/outsource/source-change-apply/withdraw?id=${parameter.id}`,
    method: 'post',
    data: {}
  })
}
// 换料单-审批
export function refuellingApprove(parameter) {
  return axios({
    baseURL,
    url: '/outsource/source-change-apply/approve',
    method: 'post',
    data: parameter
  })
}
//换料单-首次变更报价，数据回显
export function refuellingInfo(parameter) {
  return axios({
    baseURL,
    url: '/outsource/source-change-apply/getFirstNeedChangeQuotationVo',
    method: 'get',
    params: parameter
  })
}
// 换料单-变更报价
export function refuellingQuotationSave(parameter) {
  return axios({
    baseURL,
    url: '/outsource/source-change-apply/saveQuotation',
    method: 'post',
    data: parameter
  })
}
// 获取订单最新的成品物料、原材料、送取方式信息（换料和补料所用）
export function getOrderChangeInfo(parameter) {
  return axios({
    baseURL,
    url: '/outsource/order-newst-finish-material/getOrderChangeNewst',
    method: 'get',
    params: parameter
  })
}
// 获取订单最新的成品物料、原材料、送取方式信息（工序变更所用)
export function getOrderChangeCraftInfo(parameter) {
  return axios({
    baseURL,
    url: '/outsource/order-newst-finish-material/getOrderChangeNewstWithCraft',
    method: 'get',
    params: parameter
  })
}
/* 委外管理-加工需求变更单-换料变更-End */

/* 委外管理-加工需求变更单-工序变更单-Start */
//工序变更单-列表（searchStatus审批状态：0 全部 1 待审批 2 已审批）
export function craftPageList(parameter) {
  return axios({
    baseURL,
    url: '/outsource/craft-change-apply/listCraftChangeApply',
    method: 'get',
    params: parameter
  })
}
//工序变更单-详情
export function craftDetail(parameter) {
  return axios({
    baseURL,
    url: '/outsource/craft-change-apply/getCraftChangeDetail',
    method: 'get',
    params: parameter
  })
}
//工序变更单-新增/编辑
export function craftAdd(parameter) {
  return axios({
    baseURL,
    url: '/outsource/craft-change-apply/saveOrUpdateCraftChange',
    method: 'post',
    data: parameter
  })
}
//工序变更单-根据单据id数组【idList】删除记录
export function craftDelete(parameter) {
  return axios({
    baseURL,
    url: `/outsource/craft-change-apply/remove?${parameter}`,
    method: 'post',
    data: {}
  })
}
//工序变更单-根据单据id撤回记录
export function craftWithdraw(parameter) {
  return axios({
    baseURL,
    url: `/outsource/craft-change-apply/withdraw?id=${parameter.id}`,
    method: 'post',
    data: {}
  })
}
// 工序变更单-审批
export function craftApprove(parameter) {
  return axios({
    baseURL,
    url: '/outsource/craft-change-apply/approve',
    method: 'post',
    data: parameter
  })
}
//工序变更单-首次变更报价，数据回显
export function craftInfo(parameter) {
  return axios({
    baseURL,
    url: '/outsource/craft-change-apply/getFirstNeedChangeQuotationVo',
    method: 'get',
    params: parameter
  })
}
//工序变更单-变更报价
export function craftQuotationSave(parameter) {
  return axios({
    baseURL,
    url: '/outsource/craft-change-apply/saveQuotation',
    method: 'post',
    data: parameter
  })
}
//工序变更单-根据物料id和type 获取工序 和 属性/参数
export function getCraftFile(parameter) {
  return axios({
    baseURL,
    url: '/outsource/fac-info-need/getCraftFile',
    method: 'get',
    params: parameter
  })
}
/* 委外管理-加工需求变更单-工序变更单-End */

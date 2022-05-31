import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

const baseURL = system.materialBaseUrl
/* 仓库管理-出库-原料出库申请单-Start */
// 原料出库申请单-列表（待出库/已出库）
export function materialOutPageList(parameter) {
  return axios({
    baseURL,
    url: '/outsource/ex-warehouse/getListByPage',
    method: 'get',
    params: parameter
  })
}
// 原料出库申请单-根据单据id删除记录
export function materialOutDelete(parameter) {
  return axios({
    baseURL,
    url: '/outsource/ex-warehouse/delById',
    method: 'get',
    params: parameter
  })
}
//原料出库申请单-详情
export function materialOutDetail(parameter) {
  return axios({
    baseURL,
    url: '/outsource/ex-warehouse/getDetailById',
    method: 'get',
    params: parameter
  })
}
//原料出库申请单-新增/编辑
export function materialOutAdd(parameter) {
  return axios({
    baseURL,
    url: '/outsource/ex-warehouse/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//原料出库申请单-新增-根据订单id（传参orderId）获取原材料
export function getOrderMaterialExit(parameter) {
  return axios({
    baseURL,
    url: '/outsource/order-newst-finish-material/getOrderMaterialExit',
    method: 'get',
    params: parameter
  })
}
//原料出库申请单-筛选-原料加工商和订单分页列表 type 1 加工商 2订单
export function getFacAndOrderList(parameter) {
  return axios({
    baseURL,
    url: '/outsource/ex-warehouse/getOutSourceFacAndOrderList',
    method: 'get',
    params: parameter
  })
}
/* 仓库管理-出库-原料出库申请单-End */

/* 质量管理-入库检验记录单-出库原料质检-Start*/
// 出库原料质检-列表（待处理/已处理）
export function materialTestPageList(parameter) {
  return axios({
    baseURL,
    url: '/outsource/inspection/getListByPage',
    method: 'get',
    params: parameter
  })
}
// 出库原料质检-根据单据id删除记录
export function materialTestDelete(parameter) {
  return axios({
    baseURL,
    url: '/outsource/inspection/delById',
    method: 'get',
    params: parameter
  })
}
//出库原料质检-详情
export function materialTestDetail(parameter) {
  return axios({
    baseURL,
    url: '/outsource/inspection/getDetailById',
    method: 'get',
    params: parameter
  })
}
//出库原料质检-新增/编辑
export function materialTestAdd(parameter) {
  return axios({
    baseURL,
    url: '/outsource/inspection/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
/* 质量管理-入库检验记录单-出库原料质检-End*/

/* 质量管理-入库检验记录单-委外原料首检-Start*/
// 委外原料首检-列表（待处理/已处理）
export function materialFirstPageList(parameter) {
  return axios({
    baseURL,
    url: '/outsource/first-inspection/getListByPage',
    method: 'get',
    params: parameter
  })
}
// 委外原料首检-根据单据id删除记录
export function materialFirstDelete(parameter) {
  return axios({
    baseURL,
    url: '/outsource/first-inspection/delById',
    method: 'get',
    params: parameter
  })
}
//委外原料首检-详情
export function materialFirstDetail(parameter) {
  return axios({
    baseURL,
    url: '/outsource/first-inspection/getDetailById',
    method: 'get',
    params: parameter
  })
}
//委外原料首检-新增/编辑
export function materialFirstAdd(parameter) {
  return axios({
    baseURL,
    url: '/outsource/first-inspection/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
/* 质量管理-入库检验记录单-委外原料首检-End*/

/* 仓储管理-出库-交接单-Start*/
// 交接单-列表
export function materialHandoverPageList(parameter) {
  return axios({
    baseURL,
    url: '/outsource/hand-note/getListByPage',
    method: 'get',
    params: parameter
  })
}
// 交接单-根据单据id删除记录
export function materialHandoverDelete(parameter) {
  return axios({
    baseURL,
    url: '/outsource/hand-note/delById',
    method: 'get',
    params: parameter
  })
}
//交接单-详情
export function materialHandoverDetail(parameter) {
  return axios({
    baseURL,
    url: '/outsource/hand-note/getDetailById',
    method: 'get',
    params: parameter
  })
}
//交接单-新增/编辑
export function materialHandoverAdd(parameter) {
  return axios({
    baseURL,
    url: '/outsource/hand-note/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
/* 仓储管理-出库-交接单-End*/

/* 物流管理-派送单-Start*/
// 派送单-列表
export function givePageList(parameter) {
  return axios({
    baseURL,
    url: '/outsource/delivery-note/getListByPage',
    method: 'get',
    params: parameter
  })
}
// 派送单-根据单据id删除记录
export function giveDelete(parameter) {
  return axios({
    baseURL,
    url: '/outsource/delivery-note/delById',
    method: 'get',
    params: parameter
  })
}
//派送单-详情
export function giveDetail(parameter) {
  return axios({
    baseURL,
    url: '/outsource/delivery-note/getDetailById',
    method: 'get',
    params: parameter
  })
}
//派送单-新增/编辑
export function giveAdd(parameter) {
  return axios({
    baseURL,
    url: '/outsource/delivery-note/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//派送单-新增-获取采购人员列表
export function purchaseList(parameter){
  return axios({
    baseURL,
    url: '/user/depUserByUserId',
    method: 'get',
    params: parameter
  })
}
/* 物流管理-派送单-End*/

/* 物流管理-提货单-Start*/
// 提货单-列表
export function takePageList(parameter) {
  return axios({
    baseURL,
    url: '/outsource/pick-up/getListByPage',
    method: 'get',
    params: parameter
  })
}
// 提货单-根据单据id删除记录
export function takeDelete(parameter) {
  return axios({
    baseURL,
    url: '/outsource/pick-up/delById',
    method: 'get',
    params: parameter
  })
}
//提货单-详情
export function takeDetail(parameter) {
  return axios({
    baseURL,
    url: '/outsource/pick-up/getDetailById',
    method: 'get',
    params: parameter
  })
}
//提货单-新增/编辑
export function takeAdd(parameter) {
  return axios({
    baseURL,
    url: '/outsource/pick-up/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
/* 物流管理-提货单-End*/
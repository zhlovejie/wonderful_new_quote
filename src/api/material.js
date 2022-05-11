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
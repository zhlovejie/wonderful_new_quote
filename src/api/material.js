import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

const baseURL = system.materialBaseUrl
/* 仓库管理-出库-原料出库申请单-开始 */
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

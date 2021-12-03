import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
let materialBaseUrl = system.materialBaseUrl
// eslint-disable-next-line no-unused-vars
const api = {
  // 仓库管理
  getListByPage: '/base/management/getListByPage', // 仓库管理列表
  getList: '/base/management/getList', // 仓库管理不分页
  addOrUpdate: '/base/management/addOrUpdate', // 仓库管理新增
  getDetailById: '/base/management/getDetailById', // 仓库管理详情
  delValidation: '/base/management/delValidation', // 删除验证（有下级不能删除）
  delById: '/base/management/delById', // 删除
  //片区管理
  ReservoiListByPage: '/base/reservoir-area/getListByPage', // 片区管理列表
  ReservoiGetList: '/base/reservoir-area/getList', // 片区管理列表
  ReservoiAddOrUpdatee: '/base/reservoir-area/addOrUpdate', // 片区管理新增
  ReservoigetDetailById: '/base/reservoir-area/getDetailById', // 片区详情
  ReservoidelValidation: '/base/reservoir-area/delValidation', // 片区删除验证
  ReservoidelById: '/base/reservoir-area/delById', // 片区删除
  // 立货架管理
  StereoscopicgetListByPage: '/base/stereoscopic-location/getListByPage', // 立货架管理
  StereoscopicaddOrUpdate: '/base/stereoscopic-location/addOrUpdate', // 立货架新增
  StereoscopicgetDetailById: '/base/stereoscopic-location/getDetailById', // 立货架详情
  StereoscopicdelValidation: '/base/stereoscopic-location/delValidation', // 立货架删除验证
  StereoscopicdelById: '/base/stereoscopic-location/delById', // 立货架删除
  // 巷道管理
  roadwaygetListByPage: '/base/roadway/getListByPage', // 巷道管理
  roadwayAddOrUpdate: '/base/roadway/addOrUpdate', // 巷道管理新增
  roadwaygetDetailById: '/base/roadway/getDetailById', // 巷道管理详情
  roadwaydelById: '/base/roadway/delById', // 巷道管理删除
  roadwaygetList: '/base/roadway/getList', // 巷道管理不分页
  //货架管理
  shelvesList: '/base/shelves/getListByPage', // 巷道货架管理管理
  shelvesaddOrUpdate: '/base/shelves/addOrUpdate', // 巷道货架新增
  shelvesDetailById: '/base/shelves/getDetailById', // 巷道货架详情
  shelvesdelValidation: '/base/shelves/delValidation', // 巷道货架删除验证
  shelvesdelById: '/base/shelves/delById', // 巷道货架删除
  // 平面库位管理
  planegetListByPage: '/base/plane-location/getListByPage', // 平面库位列表
  planegetaddOrUpdate: '/base/plane-location/addOrUpdate', // 平面库位新增
  planegetgetDetailById: '/base/plane-location/getDetailById', // 平面库位详情
  planegetdelValidation: '/base/plane-location/delValidation', // 平面库位删除验证
  planegetdelById: '/base/plane-location/delById', // 平面库位删除
  // 容器/托盘管理
  palletgetListByPage: '/base/container-pallet/getListByPage', // 容器/托盘管理列表
  palletgetDetailById: '/base/container-pallet/getDetailById', // 容器/托盘管理详情
  palletaddOrUpdate: '/base/container-pallet/addOrUpdate', // 容器/托盘管理新增
  palletdelValidation: '/base/container-pallet/delValidation', // 容器/托盘管理删除验证
  palletdelById: '/base/container-pallet/delById', // 容器/托盘管理删除
  palletunbindById: '/base/container-pallet/unbindById', // 容器/托盘管理解绑
  // 站台管理 
  platformgetListByPage: '/base/platform/getListByPage', // 站台管理列表
  platformaddOrUpdate: '/base/platform/addOrUpdate', // 站台管理列表新增
  platformgetDetailById: '/base/platform/getDetailById', // 站台管理列表详情
  platformdelById: '/base/platform/delById', // 站台管理列表删除
  // 即时库存
  inventorygetListByPage: '/inventory/instant-position/getListByPage', // 即时库存列表
  exportInstantPositionList: '/inventory/instant-position/exportInstantPositionList', // 即时库存列表导出

}
// 消费详情不带分页列表 导出使用
export function exportInstantPositionList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.exportInstantPositionList,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

// 站台管理列表删除
export function inventorygetListByPage(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.inventorygetListByPage,
    method: 'get',
    params: parameter
  })
}
// 站台管理列表删除
export function platformdelById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.platformdelById,
    method: 'get',
    params: parameter
  })
}
// 站台管理列表详情
export function platformgetDetailById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.platformgetDetailById,
    method: 'get',
    params: parameter
  })
}
// 站台管理列表新增
export function platformaddOrUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.platformaddOrUpdate,
    method: 'post',
    data: parameter
  })
}
// 站台管理列表
export function platformgetListByPage(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.platformgetListByPage,
    method: 'get',
    params: parameter
  })
}
// 容器/托盘管理解绑
export function palletunbindById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.palletunbindById,
    method: 'get',
    params: parameter
  })
}
// 容器/托盘管理删除
export function palletdelById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.palletdelById,
    method: 'get',
    params: parameter
  })
}
// 容器/托盘管理删除验证
export function palletdelValidation(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.palletdelValidation,
    method: 'get',
    params: parameter
  })
}
// 容器/托盘管理新增
export function palletaddOrUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.palletaddOrUpdate,
    method: 'post',
    data: parameter
  })
}
// 容器/托盘管理详情
export function palletgetDetailById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.palletgetDetailById,
    method: 'get',
    params: parameter
  })
}
// 容器/托盘管理列表
export function palletgetListByPage(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.palletgetListByPage,
    method: 'get',
    params: parameter
  })
}

// 平面库位删除
export function planegetdelById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.planegetdelById,
    method: 'get',
    params: parameter
  })
}
// 平面库位删除验证
export function planegetdelValidation(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.planegetdelValidation,
    method: 'get',
    params: parameter
  })
}
// 平面库位详情
export function planegetgetDetailById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.planegetgetDetailById,
    method: 'get',
    params: parameter
  })
}
// 平面库位新增
export function planegetaddOrUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.planegetaddOrUpdate,
    method: 'post',
    data: parameter
  })
}
// 平面库位列表
export function planegetListByPage(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.planegetListByPage,
    method: 'get',
    params: parameter
  })
}
// 巷道货架删除
export function shelvesdelById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.shelvesdelById,
    method: 'get',
    params: parameter
  })
}
// 巷道货架删除验证
export function shelvesdelValidation(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.shelvesdelValidation,
    method: 'get',
    params: parameter
  })
}
// 巷道货架详情
export function shelvesDetailById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.shelvesDetailById,
    method: 'get',
    params: parameter
  })
}
// 巷道货架新增
export function shelvesaddOrUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.shelvesaddOrUpdate,
    method: 'post',
    data: parameter
  })
}
//  货架管理
export function shelvesList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.shelvesList,
    method: 'get',
    params: parameter
  })
}
//  立货架删除
export function StereoscopicdelById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.StereoscopicdelById,
    method: 'get',
    params: parameter
  })
}
//  立货架删除验证
export function StereoscopicdelValidation(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.StereoscopicdelValidation,
    method: 'get',
    params: parameter
  })
}
//  立货架详情
export function StereoscopicgetDetailById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.StereoscopicgetDetailById,
    method: 'get',
    params: parameter
  })
}
// 立货架新增
export function StereoscopicaddOrUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.StereoscopicaddOrUpdate,
    method: 'post',
    data: parameter
  })
}
//  库区管理不分页
export function ReservoiGetList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.ReservoiGetList,
    method: 'get',
    params: parameter
  })
}
//  巷道管理不分页
export function roadwaygetList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.roadwaygetList,
    method: 'get',
    params: parameter
  })
}
//  巷道管理删除
export function roadwaydelById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.roadwaydelById,
    method: 'get',
    params: parameter
  })
}
//  巷道管理详情
export function roadwaygetDetailById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.roadwaygetDetailById,
    method: 'get',
    params: parameter
  })
}
// 巷道管理新增
export function roadwayAddOrUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.roadwayAddOrUpdate,
    method: 'post',
    data: parameter
  })
}
//  巷道管理
export function roadwaygetListByPage(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.roadwaygetListByPage,
    method: 'get',
    params: parameter
  })
}
//  立货架管理
export function StereoscopicgetListByPage(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.StereoscopicgetListByPage,
    method: 'get',
    params: parameter
  })
}
// 片区删除验证
export function ReservoidelValidation(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.ReservoidelValidation,
    method: 'get',
    params: parameter
  })
}
// 片区删除
export function ReservoidelById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.ReservoidelById,
    method: 'get',
    params: parameter
  })
}
// 片区详情
export function ReservoigetDetailById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.ReservoigetDetailById,
    method: 'get',
    params: parameter
  })
}
// 片区管理新增
export function ReservoiAddOrUpdatee(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.ReservoiAddOrUpdatee,
    method: 'post',
    data: parameter
  })
}
// 片区管理列表
export function ReservoiListByPage(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.ReservoiListByPage,
    method: 'get',
    params: parameter
  })
}
// 仓库管理不分页
export function getList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.getList,
    method: 'get',
    params: parameter
  })
}
// 删除
export function delById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.delById,
    method: 'get',
    params: parameter
  })
}
// 删除验证（有下级不能删除）
export function delValidation(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.delValidation,
    method: 'get',
    params: parameter
  })
}
// 仓库管理详情
export function getDetailById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.getDetailById,
    method: 'get',
    params: parameter
  })
}
// 仓库管理新增
export function addOrUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.addOrUpdate,
    method: 'post',
    data: parameter
  })
}
// 仓库管理列表
export function getListByPage(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.getListByPage,
    method: 'get',
    params: parameter
  })
}

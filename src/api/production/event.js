import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// 生产事件上报模块接口
const api = {
  getPcList: '/productEvent/getPcList',
  getDepManager: '/department/getDepManager',
  savePrincipal: '/eventPrincipal/save',
  solveEvent: '/eventPrincipal/pcSolveEvent',
  responsiblesByPrincipal: '/eventResponsible/listByPrincipal',
  pcPunish: '/productEvent/pcPunish',
  getPunishView: '/productEvent/getPunishView',
  ticketListByEvent: '/eventTicket/listByEvent',
  getProductByMainboard: '/productEvent/getProductByMainboard'
}

// 根据主板号获取上报事件相关数据
export function getProductByMainboard (params) {
  return axios({
    baseURL: system.baseURL,
    url: api.getProductByMainboard,
    method: 'get',
    params: params
  })
}

// 根据事件获取所有的罚款单
export function ticketListByEvent (params) {
  return axios({
    baseURL: system.baseURL,
    url: api.ticketListByEvent,
    method: 'get',
    params: params
  })
}

// 查询质量主管处罚或者董事长结案的结果
export function getPunishView (params) {
  return axios({
    baseURL: system.baseURL,
    url: api.getPunishView,
    method: 'get',
    params: params
  })
}

// 量主管处罚或者董事长结案事件
export function pcPunish (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.pcPunish,
    method: 'post',
    data: param
  })
}

// 根据负责人表id去查询该负责人指定的所有责任人
export function responsiblesByPrincipal (data) {
  return axios({
    baseURL: system.baseURL,
    url: api.responsiblesByPrincipal,
    method: 'get',
    params: data
  })
}

// 部门主管解决质量事件(pc)
export function solveEvent (data) {
  return axios({
    baseURL: system.baseURL,
    url: api.solveEvent,
    method: 'post',
    data: data
  })
}

// 新增质量事件负责人（质量主管分配事件）
export function savePrincipal (data) {
  return axios({
    baseURL: system.baseURL,
    url: api.savePrincipal,
    method: 'post',
    data: data
  })
}

// 获取所有部门和对应的部门领导人
export function getDepManager () {
  return axios({
    baseURL: system.baseURL,
    url: api.getDepManager,
    method: 'get'
  })
}

// 分页列表
export function getPcList (param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getPcList,
    method: 'get',
    params: param
  })
}

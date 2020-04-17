import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
import {CancelToken} from 'axios'

// 获取部门列表
export function getDevisionManagementList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/department/query',
    method: 'get',
    params: parameter
  })
}

// 获取用户列表
export function getUserList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/user/query',
    method: 'get',
    params: parameter
  })
}

// 获取部门下面的所有人员
export function getUserByDep (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/user/userByDep',
    method: 'get',
    params: parameter
  })
}

//删除角色
export function deleteRole (parameter) {
  console.log('deleteRole  : ' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/Role/delete',
    method: 'post',
    params: parameter
  })
}

// 获取部门下面的所有人员  stationId
export function getUserByStation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/user/userByStation',
    method: 'get',
    params: parameter
  })
}

// 条件收索
export function getList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/user/queryList',
    method: 'get',
    params: parameter
  })
}
// 无分页列表
export function getUserListNoPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/user/getList',
    method: 'get',
    params: parameter
  })
}
// 获取部门树
export function gettreeList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/department/queryTree',
    method: 'get',
    params: parameter
  })
}

// 获取全部部门
export function getDevisionList () {
  return axios({
    baseURL: system.baseURL,
    url: '/department/queryAllList',
    method: 'get'
  })
}
// 修改部门信息
export function departmentModify (data) {
  const token = data.Authorization

  return axios({
    baseURL: system.baseURL,
    url: '/department/modify',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
// 部门-新建部门
export function departmentAdd (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/department/save',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}

// 获取岗位列表
export function getpositionManagementList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/station/query',
    method: 'get',
    params: parameter
  })
}

// 获取岗位管理页面下拉 选择部门
export function getSelectdepartmentList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/department/queryList',
    method: 'get',
    params: parameter
  })
}

// 获取部门列表
export function departmentList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/department/queryList',
    method: 'get',
    params: parameter
  })
}
// 获取岗位列表
export function stationList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/station/queryList',
    method: 'get',
    params: parameter
  })
}
// 新增岗位
export function positionAdd (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/station/save',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
// 修改岗位信息
export function positionModify (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/station/modify',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}

// 获取父岗位 下拉列表
export function getParentStationList (parameter) {
  return axios({
    baseURL: system.baseURL,
    //url: '/station/queryByDepartmentId',
    url:'/station/getStationByDepartmentId',
    method: 'get',
    params: parameter
  })
}

// 添加用户
export function userAdd (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/user/save',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
// 修改用户
export function userModify (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/user/modify',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
// 修改用户状态
export function modifyStatus (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/user/modifyStatus',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}

// 获取岗位管理弹窗 选择等级
export function getSelectLevelList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/station/queryStationLevel',
    method: 'get',
    params: parameter
  })
}
// 获取用户工号
export function getJobNum (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/user/getJobNum',
    method: 'get',
    params: parameter
  })
}

export function getRoleManagementList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/Role/query',
    method: 'get',
    params: parameter
  })
}
// 根据id获取角色
export function queryOne (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/Role/queryOne',
    method: 'get',
    params: parameter
  })
}
// 修改角色
export function editRole (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/Role/modify',
    method: 'post',
    data: parameter
  })
}
// 新增保存角色
export function saveRole (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/Role/save',
    method: 'post',
    data: parameter
  })
}
// 获取部门下所有角色
export function queryRoleListById (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/Role/queryList',
    method: 'get',
    params: parameter
  })
}

/**
 * 根据角色id获取菜单权限
 * @returns {*}
 */
export function queryRoleMenu (parameter) {
  // 发送 get 请求
  return axios({
    baseURL: system.baseURL,
    url: '/Role/queryRoleMenu',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改权限
 * @param parameter
 * @returns {*}
 * @constructor
 */
export function editAuthority (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/route/saveRoleRoute',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改权限 该请求可以被取消
 * @param parameter
 * @returns {*}
 * @constructor
 */
export function editAuthorityWithCancel (parameter,callback) {
  return axios({
    baseURL: system.baseURL,
    url: '/route/saveRoleRoute',
    method: 'post',
    data: parameter,
    cancelToken: new CancelToken(function executor(c) {
      callback(c)
    })
  })
}

// 系统用户模块
// 获取部门下所有岗位
export function queryPositionList () {
  return axios({
    baseURL: system.baseURL,
    url: '/department/queryDepForStation',
    method: 'get'
  })
}
// 系统用户模块，根据部门id，获取部门下相应的岗位下拉列表
export function getStationList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/station/queryByDepartment',
    method: 'get',
    params: parameter
  })
}

// 获取所有销售人员
export function listUserBySale () {
  return axios({
    baseURL: system.baseURL,
    url: '/user/listUserBySale',
    method: 'get'
  })
}
// 获取当前登录人员信息
export function getLoginUser () {
  return axios({
    baseURL: system.baseURL,
    url: '/user/loginUser',
    method: 'get'
  })
}
//获取系统日志分页列表
export function getSysLogList(parameter){
  return axios({
    baseURL: system.baseURL,
    url: '/syslog/listLogPage',
    method: 'get',
    params: parameter
  })
}
//删除系统日志
export function deleteSysLog(parameter){
  return axios({
    baseURL: system.baseURL,
    url: '/syslog/deleteLog',
    method: 'post',
    params: parameter
  })
}
//重置密码
export function initializePassword(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/user/initializePassword',
    method: 'get',
    params: parameter
  })
}

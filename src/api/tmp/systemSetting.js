import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

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
  console.log('请求token:', token)
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

// 获取岗位管理弹窗 选择等级
// export function getSelectLevelList (parameter) {
//   return axios({
//     baseURL: system.baseURL,
//     url: '/station/queryStationLevel',
//     method: 'get',
//     params: parameter
//   })
// }

// 获取父岗位 下拉列表
export function getParentStationList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/station/queryByDepartmentId',
    method: 'get',
    params: parameter
  })
}

export function getRoleManagementList (parameter) {
  console.log('getRoleManagementList manages : ' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/Role/query',
    method: 'get',
    params: parameter
  })
}
// 根据id获取角色
export function queryOne (parameter) {
  console.log('queryOne manages : ' + JSON.stringify(parameter))
  // 发送 POST 请求
  return axios({
    baseURL: system.baseURL,
    url: '/Role/queryOne',
    method: 'get',
    params: parameter
  })
}

// 修改角色
export function editRole (parameter) {
  console.log('editTreePro manages : ' + JSON.stringify(parameter))
  // 发送 POST 请求
  const token = parameter.Authorization
  console.log('请求token:', token)
  return axios({
    baseURL: system.baseURL,
    url: '/Role/modify',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: parameter
  })
}

// 新增保存角色
export function saveRole (parameter) {
  console.log('editTreePro manages : ' + JSON.stringify(parameter))
  const token = parameter.Authorization
  console.log('请求token:', token)
  // 发送 POST 请求
  return axios({
    baseURL: system.baseURL,
    url: '/Role/save',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: parameter
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

// 获取岗位管理弹窗 选择等级
export function getSelectLevelList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/station/queryStationLevel',
    method: 'get',
    params: parameter
  })
}

import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  uploadPath: system.baseURL + '/upload/fileList',
  uploadVideoPath: system.baseURL + '/upload/fileVideo',
  uploadApkPath: system.baseURL + '/common/uploadFile'
}

export default api

export function getApkUploadPath (parameter) {
  return api.uploadApkPath
}

export function getUploadPath (parameter) {
  return api.uploadPath
}
export function getUploadVideoPath (parameter) {
  return api.uploadVideoPath
}

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  console.log('getServiceList' + JSON.stringify(parameter))
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  console.log('manages : ' + parameter)
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

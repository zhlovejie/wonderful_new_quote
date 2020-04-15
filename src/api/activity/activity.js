import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//查找流程定义列表
export function getActivitiProcDef (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/activity/listActivitiProcDef',
    method: 'get',
    params: parameter
  })
}
//流程定义，上传文件定义流程
export function uploadFile () {
  return system.baseURL + '/activity/uploadBpmn'
}
//读取资源文件
export function resourceRead (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/activity/resource/read',
    method: 'get',
    params: parameter
  })
}
//级联删除部署的流程
export function deleteDeployment (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/activity/deleteDeployment',
    method: 'get',
    params: parameter
  })
}

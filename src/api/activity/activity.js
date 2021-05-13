import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
const materialBaseUrl = system.materialBaseUrl
//查找流程定义列表
export function getActivitiProcDef(parameter, type) {
  return axios({
    baseURL: type === 0 ? system.baseURL : materialBaseUrl,
    url: '/activity/listActivitiProcDef',
    method: 'get',
    params: parameter
  })
}
//流程定义，上传文件定义流程
export function uploadFile(type) {
  debugger
  return type === 0 ? system.baseURL + '/activity/uploadBpmn' : materialBaseUrl + '/activity/uploadBpmn'
}
//读取资源文件
export function resourceRead(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/activity/resource/read',
    method: 'get',
    params: parameter
  })
}
//级联删除部署的流程
export function deleteDeployment(parameter, type) {
  return axios({
    baseURL: type === 0 ? system.baseURL : materialBaseUrl,
    url: '/activity/deleteDeployment',
    method: 'get',
    params: parameter
  })
}

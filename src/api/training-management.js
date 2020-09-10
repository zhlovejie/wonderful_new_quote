import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

/**  培训管理*/

// 获取文件夹
export function materialsList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-folder/listrainFolderByPage',
    method: 'get',
    params: parameter
  })
}
// 新增文件夹
export function materialsAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-folder/saveOrUpdateTrainFolder',
    method: 'post',
    data: parameter
  })
}


// 获取文件夹详情
export function materialsDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-folder/getFolderDetail',
    method: 'get',
    params: parameter
  })
}

// 获取文件夹上一级id
export function materialsId(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-folder/getFolderParentId',
    method: 'get',
    params: parameter
  })
}

// 新增 修改文件
export function materialsSaveOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-file/saveOrUpdateTrainFile',
    method: 'post',
    data: parameter
  })
}

// 、、文件详情
export function getFolderDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-file/getFolderDetail',
    method: 'get',
    params: parameter
  })
}

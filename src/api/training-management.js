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


// 文件夹 删除
export function materialsSaveOrRemove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-folder/removeOaTrainFolderById',
    method: 'post',
    data: parameter
  })
}
// 文件删除
export function materialsSaveOrDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-file/removeOaTrainFileById',
    method: 'post',
    data: parameter
  })
}


// 查询目录权限列表
export function getFolderlistrainList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-folder-permissions/listrainFolderByPage',
    method: 'get',
    params: parameter
  })
}


// 培训年计划方案接口

// 列表接口
export function annualList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-year-plan/pageList',
    method: 'get',
    params: parameter
  })
}

//新增 修改
export function annualAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-year-plan/saveOrUpdateTrainFile',
    method: 'post',
    data: parameter
  })
}

//撤回
export function annualPlan(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-year-plan/withdrawOaTrainYearPlan',
    method: 'post',
    data: parameter
  })
}

//删除 
export function annualRemove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-year-plan/removeTrainYearPlan',
    method: 'post',
    data: parameter
  })
}

//详情 
export function annualDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-year-plan/getTrainYearPlanDetail',
    method: 'get',
    params: parameter
  })
}
// 审批接口

export function annualisAdopt(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-year-plan/approvalTrainYearPlan',
    method: 'post',
    data: parameter
  })
}


//集中 分散培训列表
export function dispersedList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/pageList',
    method: 'get',
    params: parameter
  })
}


//集中 分散 新增 修改
export function dispersedAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/saveOrUpdateDisperseTrainContent',
    method: 'post',
    data: parameter
  })
}



//文件类别
export function dispersedForDipreseByPage(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-folder/listrainFolderForDipreseByPage',
    method: 'get',
    params: parameter
  })
}

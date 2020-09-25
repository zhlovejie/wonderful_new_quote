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


// 分散 新增 修改
export function dispersedAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/saveOrUpdateDisperseTrainContent',
    method: 'post',
    data: parameter
  })
}
//集中 分散 审核

export function dispersedExamine(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/approvalTrain',
    method: 'post',
    data: parameter
  })
}

//分散详情
export function dispersedDetailVo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/getOaTrainDisperseContentDetailVo',
    method: 'get',
    params: parameter
  })
}

//集中详情
export function focusDetailVo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/getOaTrainGroupContentDetail',
    method: 'get',
    params: parameter
  })
}



export function dispersedDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/removeTrainContent',
    method: 'post',
    data: parameter
  })
}


//集中分散的撤回
export function dispersedwithdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/withdrawOaTrainContent',
    method: 'get',
    params: parameter
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
//会议事件新增修改
export function dispersedMeetingEvent(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/saveOrUpdateOaTrainMeetingEvent',
    method: 'post',
    data: parameter
  })
}
//会议事件详情
export function meetingSetDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-record/getMeetingEventDetail',
    method: 'get',
    params: parameter
  })
}
//会议记录详情
export function meetingDetailByCode(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-record/getMeetingRecordDetailByCode',
    method: 'get',
    params: parameter
  })
}
//

// 集中 新增 修改
export function focusAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/saveOrUpdateGroupTrainContent',
    method: 'post',
    data: parameter
  })
}

//我的培训列表
export function meetingOaTrainInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-group-content/listOaMyTrainContentByPage',
    method: 'get',
    params: parameter
  })
}

//处理详情

export function meetinglistMyFile(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-file-history/listMyFile',
    method: 'get',
    params: parameter
  })
}

//处理接口
export function focusupdateFile(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-file-history/updateFileReadFlag',
    method: 'post',
    data: parameter
  })
}

// 文件阅读列查询

export function meetinglistMyFileWithoutDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-file-history/listMyFileWithoutDetail',
    method: 'get',
    params: parameter
  })
}


// 公开改私密
export function meetinglistMycheckCanModifyl(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-folder/checkCanModify',
    method: 'get',
    params: parameter
  })
}

//人员列表删除 
export function folderUser(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-folder-permissions/checkCanRemoveFolderUser',
    method: 'post',
    data: parameter
  })
}


//判读是否存在年份 

export function checkIfExistsYearPlan(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaTrainInfo/oa-train-year-plan/checkIfExistsYearPlan',
    method: 'get',
    params: parameter
  })
}

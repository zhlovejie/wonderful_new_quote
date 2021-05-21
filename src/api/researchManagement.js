import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

//研发管理
//---------------------图纸权限-----------------------
export function blueprintPermissionList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintPermission/pageList',
    method: 'get',
    params: parameter
  })
}

export function blueprintPermissionDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintPermission/delete',
    method: 'post',
    data: parameter
  })
}

export function blueprintPermissionAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintPermission/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

//---------------------图纸权限 END-----------------------

//---------------------图纸管理-----------------------
export function blueprintMenuTreeList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/treeList',
    method: 'get',
    params: parameter
  })
}
export function blueprintMenuPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/pageList',
    method: 'get',
    params: parameter
  })
}

export function blueprintMenuDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/detail',
    method: 'get',
    params: parameter
  })
}

export function blueprintMenuDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/delete',
    method: 'post',
    data: parameter
  })
}

export function blueprintMenuAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

// 获取上传图片的路径
export function getUploadPath() {
  return system.baseURL + '/rDFileUpload/uploadFile'
}

//自定义上传函数
export function customUpload(parameter, progressEventCallback) {
  return axios({
    baseURL: system.baseURL,
    url: '/rDFileUpload/uploadFile',
    method: 'post',
    //responseType:'blob',
    data: parameter,
    onUploadProgress: function (progressEvent) {
      if (progressEvent.lengthComputable) {
        progressEventCallback(progressEvent)
      }
    },
  })
}


//删除上传文件
export function blueprintFileDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/rDFileUpload/deleteFile',
    method: 'post',
    data: parameter
  })
}

export function duplicateCheck(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/duplicateCheck',
    method: 'get',
    params: parameter
  })
}

export function blueprintFileAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/add',
    method: 'post',
    data: parameter
  })
}

export function blueprintFileAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

export function blueprintFileDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/delete',
    method: 'post',
    data: parameter
  })
}

export function blueprintFileDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/detail',
    method: 'get',
    params: parameter
  })
}

export function blueprintFilePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/pageList',
    method: 'get',
    params: parameter
  })
}


export function blueprintFileDeleteBatch(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/deleteBatch',
    method: 'post',
    data: parameter
  })
}


//---------------------图纸管理 END-----------------------


//---------------------图纸反馈记录 --------------------------
export function blueprintFeedbackDispose(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFeedback/dispose',
    method: 'post',
    data: parameter
  })
}

export function blueprintFeedbackPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFeedback/pageList',
    method: 'get',
    params: parameter
  })
}
//---------------------图纸反馈记录 END-----------------------

//批量下载
export function blueprintFileDownloadZip(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/download/zip',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}



//----------------- 任务  奖金分配 -----------------------------
//分配奖金列表
export function task_bonus_sharesPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-performance-div/page',
    method: 'get',
    params: parameter
  })
}
//分配奖金总额
export function task_bonus_sharesPageSum(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-performance-div/pageSum',
    method: 'get',
    params: parameter
  })
}

// 任务绩效列表
export function task_performancePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-performance-conf/pageDevelopmentTaskPerformanceConfVo',
    method: 'get',
    params: parameter
  })
}
//配置详情
export function task_performancegetDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-performance-conf/getDetail',
    method: 'get',
    params: parameter
  })
}
//配置新增
export function task_performancegetaddUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-performance-conf/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
// 销售负责人
export function task_performancegetSalerIds(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-performance-conf/getSalerIds',
    method: 'get',
    params: parameter
  })
}
//项目负责人
export function task_performancegetgetChargeIds(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-performance-conf/getChargeIds',
    method: 'get',
    params: parameter
  })
}

// 任务单列表
export function task_TaskInfoPage(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-info/listDevelopmentTaskInfoPage',
    method: 'get',
    params: parameter
  })
}
// 任务单列表
export function task_countDevelopmentByStatus(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-info/countDevelopmentByStatus',
    method: 'get',
    params: parameter
  })
}
//审核查看
export function task_getTaskExcuteHisDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/getTaskExcuteHisDetail',
    method: 'get',
    params: parameter
  })
}
// 任务单查看
export function task_getDevelopmentTaskInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'developmentBouns/development-task-info/getDevelopmentTaskInfo',
    method: 'get',
    params: parameter
  })
}

//配置新增
export function task_appointHis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/appointHis',
    method: 'post',
    data: parameter
  })
}
//状态记录
export function task_listDevelopmentTaskHisById(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-info/listDevelopmentTaskHisById',
    method: 'get',
    params: parameter
  })
}

//我的任务单
export function task_listTaskExcuteHis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/listTaskExcuteHis',
    method: 'get',
    params: parameter
  })
}
//我的任务单认领
export function task_listclaimHis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/claimHis',
    method: 'post',
    data: parameter
  })
}
//我的任务单驳回
export function task_listoverruledHis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/overruledHis',
    method: 'post',
    data: parameter
  })
}
//  我的任务单完结
export function task_listEndHis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/endHis',
    method: 'post',
    data: parameter
  })
}

// 我的任务单暂停
export function task_listStopHis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/stopHis',
    method: 'post',
    data: parameter
  })
}
// 我的任务启动

export function task_listStartHis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/startHis',
    method: 'post',
    data: parameter
  })
}
// 我的任务单 放弃
export function task_listWaiveHis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/waiveHis',
    method: 'post',
    data: parameter
  })
}
// 任务单审核列表
export function task_hislistTaskExcuteHis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/listTaskExcuteHis',
    method: 'get',
    params: parameter
  })
}

// 我的任务单 放弃
export function task_approvalHis(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/developmentBouns/development-task-excute-his/approvalHis',
    method: 'post',
    data: parameter
  })
}

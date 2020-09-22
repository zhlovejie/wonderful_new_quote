import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

//研发管理
//---------------------图纸权限-----------------------
export function blueprintPermissionList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintPermission/pageList',
    method: 'get',
    params: parameter
  })
}

export function blueprintPermissionDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintPermission/delete',
    method: 'post',
    data: parameter
  })
}

export function blueprintPermissionAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintPermission/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

//---------------------图纸权限 END-----------------------

//---------------------图纸管理-----------------------
export function blueprintMenuTreeList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/treeList',
    method: 'get',
    params: parameter
  })
}
export function blueprintMenuPageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/pageList',
    method: 'get',
    params: parameter
  })
}

export function blueprintMenuDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/detail',
    method: 'get',
    params: parameter
  })
}

export function blueprintMenuDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/delete',
    method: 'post',
    data: parameter
  })
}

export function blueprintMenuAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintMenu/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

// 获取上传图片的路径
export function getUploadPath () {
  return system.baseURL + '/rDFileUpload/uploadFile'
}

//自定义上传函数
export function customUpload(parameter,progressEventCallback){
  return axios({
    baseURL: system.baseURL,
    url: '/rDFileUpload/uploadFile',
    method: 'post',
    //responseType:'blob',
    data: parameter,
    onUploadProgress:function(progressEvent){
        if(progressEvent.lengthComputable){ progressEventCallback(progressEvent)}
    },
  })
}


//删除上传文件
export function blueprintFileDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/rDFileUpload/deleteFile',
    method: 'post',
    data: parameter
  })
}



export function blueprintFileAdd (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/add',
    method: 'post',
    data: parameter
  })
}

export function blueprintFileAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

export function blueprintFileDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/delete',
    method: 'post',
    data: parameter
  })
}

export function blueprintFileDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/detail',
    method: 'get',
    params: parameter
  })
}

export function blueprintFilePageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/pageList',
    method: 'get',
    params: parameter
  })
}


export function blueprintFileDeleteBatch (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFile/deleteBatch',
    method: 'post',
    data: parameter
  })
}


//---------------------图纸管理 END-----------------------


//---------------------图纸反馈记录 --------------------------
export function blueprintFeedbackDispose (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFeedback/dispose',
    method: 'post',
    data: parameter
  })
}

export function blueprintFeedbackPageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/blueprintFeedback/pageList',
    method: 'get',
    params: parameter
  })
}
//---------------------图纸反馈记录 END-----------------------
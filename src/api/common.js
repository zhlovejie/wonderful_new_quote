import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

const api = {
  uploadPath: system.baseURL + '/upload/fileList',
  uploadPath2: system.baseURL + '/common/uploadFile',
  ueditorUploadPath: system.baseURL + '/ueditor/uploadImg',
  getDictionary: '/dictionary/getListByText',
  getAreaByParent: '/areaDic/queryList',
  getOneArea: '/areaDic/getOneArea',
  devUploadPath: system.baseURL + '/devFileUpload/uploadFile',
  devDelPath: system.baseURL + '/devFileUpload/deleteFile',
}

/**
 * 研发专用文件上传接口
 * @returns
 */
export function devFileUploadPath() {
  return api.devUploadPath
}

/**
 * 研发专用文件删除接口
 * @returns
 */
 export function devDelPath() {
  return api.devDelPath
}

// 获取上传图片的路径
export function getUploadPath2() {
  return api.uploadPath2
}

// 获取上传图片的路径
export function getUploadPath() {
  return api.uploadPath
}

// 获取ueditor上传图片的路径
export function getUeditorUploadPath() {
  return api.ueditorUploadPath
}

// 根据字典名获取该名称下的所有字典数据
export function getDictionary(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getDictionary,
    method: 'get',
    params: parameter
  })
}

// 根据父id查询区域
export function getAreaByParent(param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getAreaByParent,
    method: 'get',
    params: param
  })
}

// 根据id查询区域
export function getOneArea(param) {
  return axios({
    baseURL: system.baseURL,
    url: api.getOneArea,
    method: 'get',
    params: param
  })
}

//获取审批实例列表
export function findApprovedNodeList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/common/findApprovedNodeList',
    method: 'get',
    params: parameter
  })
}

export function customUpload(fileData) {
  return axios({
    baseURL: system.baseURL,
    url: api.uploadPath2,
    method: 'post',
    data: fileData
  })
}

/**高拍仪上传文件代理接口 */
export function gaopaiyiCustomUpload(url) {
  return axios({
    url: url,
    method: 'get'
  })
}
/**
 * 参考 GaoPaiYiUploadProxy.exe.config -> localServerUrl
 */
export function gaoPaiYiUploadProxyURL() {
  return system.gaoPaiYiUploadProxyURL
}

/**
 * base64上传接口
 * var formData = new FormData();
 * formData.append('picBase64',getbase64data())
 *
 * data:image/jpeg;base64,
 * @param {*} data
 */
export function customUploadBase64(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/common/uploadBase64Pic',
    method: 'post',
    data: data
  })
}

/**
 * @description 根据岗位编号查询对于的岗位等级
 * @param {object} params {id:stationID}
 */
export function queryStationLevel(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/station/queryOne',
    method: 'get',
    params: params
  })
}

export function getAllArea(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/areaDic/getAllArea',
    method: 'get',
    params: params
  })
}

/**获取推送消息 */
export function getPushMsg(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/pushMsg/msgList',
    method: 'get',
    params: params
  })
}
export function getPushShareMsg(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/pushMsg/msgShareList',
    method: 'get',
    params: params
  })
}

export function getPushMsgList(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/pushMsg/push-msg-user/type',
    method: 'get',
    params: params
  })
}

/**获取通讯录 */
export function getAddressBookListWithUserName(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/addressBook/getAddressBookListByUserName',
    method: 'get',
    params: params
  })
}

export function getAddressBookListWithDeprtment(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/addressBook/getMyDeprtmentAddressBookList',
    method: 'get',
    params: params
  })
}

export function userUpdatePassWord(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/user/resetPassword',
    method: 'POST',
    data: params
  })
}


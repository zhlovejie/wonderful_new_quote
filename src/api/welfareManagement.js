import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------体检设置-----------------------

/**体检设置分页列表 */
export function checkupSettingList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/checkupSetting/pageList',
    method: 'get',
    params: parameter
  })
}

export function checkupSettingDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/checkupSetting/delete',
    method: 'post',
    data: parameter
  })
}

export function checkupSettingAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/checkupSetting/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

//---------------------体检设置--END---------------------

//---------------------体检周期设置--------------------------
export function checkupCycleList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/checkupCycle/pageList',
    method: 'get',
    params: parameter
  })
}

export function checkupCycleDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/checkupCycle/delete',
    method: 'post',
    data: parameter
  })
}

export function checkupCycleAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/checkupCycle/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------体检周期设置--END---------------------

//---------------------体检管理--------------------------
export function checkupManagementList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/checkupManagement/pageList',
    method: 'get',
    params: parameter
  })
}

export function checkupManagementUploadReport (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/checkupManagement/uploadReport',
    method: 'post',
    data: parameter
  })
}
//---------------------体检管理--END---------------------


//---------------------关怀设置--------------------------
export function caringSettingList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/caringSetting/pageList',
    method: 'get',
    params: parameter
  })
}

export function caringSettingDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/caringSetting/delete',
    method: 'post',
    data: parameter
  })
}

export function caringSettingAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/caringSetting/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------关怀设置--END---------------------

//---------------------关怀修改记录--------------------------

export function caringSettingRecordList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/caringSettingRecord/pageList',
    method: 'get',
    params: parameter
  })
}
export function caringSettingRecordDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/caringSettingRecord/detail',
    method: 'get',
    params: parameter
  })
}
/*撤销*/
export function caringSettingRecordRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/caringSettingRecord/revocation',
    method: 'post',
    data: parameter
  })
}

export function caringSettingRecordDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/caringSettingRecord/delete',
    method: 'post',
    data: parameter
  })
}
/*审批*/
export function caringSettingRecordApprove (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/caringSettingRecord/approve',
    method: 'post',
    data: parameter
  })
}
//---------------------关怀修改记录--END---------------------


//---------------------礼品标准--------------------------
export function giftSettingList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/giftSetting/pageList',
    method: 'get',
    params: parameter
  })
}

export function giftSettingDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/giftSetting/delete',
    method: 'post',
    data: parameter
  })
}

export function giftSettingAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/giftSetting/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------礼品标准--END---------------------

//---------------------过节费标准--------------------------
export function festivalBonusSettingList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalBonusSetting/pageList',
    method: 'get',
    params: parameter
  })
}

export function festivalBonusSettingDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalBonusSetting/detail',
    method: 'get',
    params: parameter
  })
}

export function festivalBonusSettingDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalBonusSetting/delete',
    method: 'post',
    data: parameter
  })
}

export function festivalBonusSettingAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalBonusSetting/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------过节费标准--END---------------------


//---------------------过节费标准修改记录--------------------------

export function fbsRecordList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/fbsRecord/pageList',
    method: 'get',
    params: parameter
  })
}

export function fbsRecordDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/fbsRecord/detail',
    method: 'get',
    params: parameter
  })
}


export function fbsRecordRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/fbsRecord/revocation',
    method: 'post',
    data: parameter
  })
}

export function fbsRecordDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/fbsRecord/delete',
    method: 'post',
    data: parameter
  })
}

export function fbsRecordApprove (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/fbsRecord/approve',
    method: 'post',
    data: parameter
  })
}
//---------------------过节费标准修改记录--END---------------------


//---------------------生日福利标准--------------------------
export function birthdayWelfareSettingList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/birthdayWelfareSetting/pageList',
    method: 'get',
    params: parameter
  })
}

export function birthdayWelfareSettingDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/birthdayWelfareSetting/delete',
    method: 'post',
    data: parameter
  })
}

export function birthdayWelfareSettingAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/birthdayWelfareSetting/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------生日福利标准--END---------------------

//---------------------生日福利管理--------------------------

export function birthdayWelfareManagementList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/birthdayWelfareManagement/pageList',
    method: 'get',
    params: parameter
  })
}

export function birthdayWelfareManagementGetWelfare (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/birthdayWelfareManagement/getWelfare',
    method: 'post',
    data: parameter
  })
}

//---------------------生日福利管理--END---------------------


//---------------------年会福利管理--------------------------

export function annualMeetingSettingList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/annualMeetingSetting/pageList',
    method: 'get',
    params: parameter
  })
}

export function annualMeetingSettingDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/annualMeetingSetting/detail',
    method: 'get',
    params: parameter
  })
}

export function annualMeetingSettingAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/annualMeetingSetting/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

export function annualMeetingSettingApprove (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/annualMeetingSetting/approve',
    method: 'post',
    data: parameter
  })
}

export function annualMeetingSettingDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/annualMeetingSetting/delete',
    method: 'post',
    data: parameter
  })
}

export function annualMeetingSettingRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/annualMeetingSetting/revocation',
    method: 'post',
    data: parameter
  })
}
//---------------------年会福利管理--END---------------------




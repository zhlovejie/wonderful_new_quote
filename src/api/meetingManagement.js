import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------会议设置-----------------------

/**会议设置管理接口分页列表 */
export function meetingSetList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-set/pageList',
    method: 'get',
    params: parameter
  })
}
/**会议设置的详情接口 */
export function meetingSetDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-set/getMeetingDetail',
    method: 'get',
    params: parameter
  })
}

/**会议设置的删除 */
export function meetingSetDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-set/removeMeetingSet',
    method: 'post',
    data: parameter
  })
}

/**会议设置的新增或修改 */
export function meetingSetSaveOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-set/saveOrUpdateMeetingSet',
    method: 'post',
    data: parameter
  })
}

//---------------------会议设置-END-------------------


//---------------------会议记录-----------------------
/**会议记录管理接口分页列表 */
export function meetingRecordList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-record/pageList',
    method: 'get',
    params: parameter
  })
}
/**会议记录的详情接口 */
export function meetingRecordDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-record/getMeetingRecordDetail',
    method: 'get',
    params: parameter
  })
}

/**取消会议接口 */
export function meetingRecordCancel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-record/rejectMeetingRecord',
    method: 'post',
    data: parameter
  })
}

/**会议记录的新增或修改 */
export function meetingRecordSaveOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-record/saveOrUpdateMeetingRecord',
    method: 'post',
    data: parameter
  })
}

/**上传会议记录接口 */
export function meetingRecordUpload (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oa/oa-meeting-record/uploadMeetingRecordDoc',
    method: 'post',
    data: parameter
  })
}

//---------------------会议记录-END-------------------


//---------------------会议处罚规则-------------------
export function addAndUpdateMeetingPenaltyRules (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/meetting/oa-meeting-penalty-rules/addAndUpdateMeetingPenaltyRules',
    method: 'post',
    data: parameter
  })
}

export function delMeetingPenaltyRules (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/meetting/oa-meeting-penalty-rules/delMeetingPenaltyRules',
    method: 'get',
    params: parameter
  })
}

export function getMeetingPenaltyRulesPageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/meetting/oa-meeting-penalty-rules/getMeetingPenaltyRulesPageList',
    method: 'get',
    params: parameter
  })
}

//---------------------会议处罚规则-END-------------------

//---------------------会议请假记录-----------------------
export function addAndUpdateMeetingLeave (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/meetting/oa-meeting-leave/addAndUpdateMeetingLeave',
    method: 'post',
    data: parameter
  })
}

export function approvalMeetingLeave (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/meetting/oa-meeting-leave/approvalMeetingLeave',
    method: 'post',
    data: parameter
  })
}


export function delMeetingLeave (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/meetting/oa-meeting-leave/delMeetingLeave',
    method: 'get',
    params: parameter
  })
}

export function getMeetingLeaveDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/meetting/oa-meeting-leave/getMeetingLeaveDetail',
    method: 'get',
    params: parameter
  })
}

export function getMeetingLeavePageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/meetting/oa-meeting-leave/getMeetingLeavePageList',
    method: 'get',
    params: parameter
  })
}

export function revocationMeetingLeave (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/meetting/oa-meeting-leave/revocationMeetingLeave',
    method: 'get',
    params: parameter
  })
}

//---------------------会议请假记录-END-------------------

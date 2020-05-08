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
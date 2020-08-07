import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

//---------------------人力资源管理模块-----------------------
/**公告管理列表接口 */
export function NoticeList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/goticeManage/gotice-manage/getGoticeManageList',
    method: 'get',
    params: parameter
  })
}
/** 公告管理新增修改接口 */
export function NoticeAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/goticeManage/gotice-manage/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
/** 公告管理查看详情接口 */
export function NoticeDetails(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/goticeManage/gotice-manage/getGoticeManageInfo',
    method: 'get',
    params: parameter
  })
}
/** 公告管理审批接口 */
export function NoticeApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/goticeManage/gotice-manage/approvalGoticeManag',
    method: 'post',
    data: parameter
  })
}
/** 公告管理删除接口 */
export function NoticeDelete(parameter) {
  debugger
  return axios({
    baseURL: system.baseURL,
    url: '/goticeManage/gotice-manage/delGoticeManage',
    method: 'delete',
    params: parameter

  })
}
/** 公告管理发布 */
export function NoticeRelease(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/goticeManage/gotice-manage/releaseGoticeManage',
    method: 'get',
    params: parameter
  })
}
/** 公告管理撤回 */
export function NoticeWithdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/goticeManage/gotice-manage/withdrawGoticeManag',
    method: 'get',
    params: parameter
  })
}


/**社保管理 */

// 保险配置模列表 
export function securityInsurance_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/socialSecurity/insurance/getInsuranceList',
    method: 'get',
    params: parameter
  })
}

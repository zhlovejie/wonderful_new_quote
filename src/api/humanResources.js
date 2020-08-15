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

// 保险配置模新增 
export function securityInsurance_Add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/socialSecurity/insurance/addAndUpdate',
    method: 'post',
    data: parameter
  })
}

// 保险配置模详情
export function securityInsurance_Details(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/socialSecurity/insurance/getInsuranceId',
    method: 'get',
    params: parameter
  })
}
// 保险配置模删除
export function securityInsurance_Delete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/socialSecurity/insurance/delInsurance',
    method: 'get',
    params: parameter
  })
}

// 社保列表接口
export function securitySocial_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/socialSecurity/social-security/getSocialSecurityList',
    method: 'get',
    params: parameter
  })
}
// 社保新增修改接口
export function securitySocial_Add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/socialSecurity/social-security/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
// 社保详情接口
export function securitySocial_Details(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/socialSecurity/social-security/getSocialSecurityId',
    method: 'get',
    params: parameter
  })
}
// 社保删除接口
export function securitySocial_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/socialSecurity/social-security/delSocialSecurity',
    method: 'get',
    params: parameter
  })
}
// 社保查看接口
export function securitySocial_See(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/socialSecurity/social-security-info/getSocialSecurityInfoList',
    method: 'get',
    params: parameter
  })
}


// 团建列表接口
export function leagueBuilding_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/OaLeagueApply/league-apply/pageList',
    method: 'get',
    params: parameter
  })
}
// 团建新增修改接口
export function leagueBuilding_add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/OaLeagueApply/league-apply/saveOrUpdateLeagueDetail',
    method: 'post',
    data: parameter
  })
}

// 团建列表接口
export function leagueBuilding_Detail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/OaLeagueApply/league-apply/getLeagueDetail',
    method: 'get',
    params: parameter
  })
}

// 团建申请撤回
export function leagueBuilding_Apply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/OaLeagueApply/league-apply/withdrawLeagueApply',
    method: 'post',
    data: parameter
  })
}

/** 团建审批接口 */
export function leagueBuildingApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/OaLeagueApply/league-apply/approvalLeagueApply',
    method: 'post',
    data: parameter
  })
}
/** 团建照片上传接口 */
export function leagueBuildingUpload(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/OaLeagueApply/league-apply/uploadPicLeagueApply',
    method: 'post',
    data: parameter
  })
}

/** 团建申请删除接口 */
export function leagueBuildingRemove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/OaLeagueApply/league-apply/removeLeagueApply',
    method: 'post',
    data: parameter
  })
}

/** 岗位配置列表接口 */
export function postAllocation_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaContractStationMap/contract-station-map/pageList',
    method: 'get',
    params: parameter
  })
}

// 岗位配置下拉点击选择接口
export function postAllocation_Version(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaContractForm/contract-form/pageListNerVersion',
    method: 'get',
    params: parameter
  })
}

/** 岗位配置新增接口 */
export function postAllocation_Add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaContractStationMap/contract-station-map/saveContractStationMap',
    method: 'post',
    data: parameter
  })
}
// 岗位配置详情接口
export function postAllocation_Detail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaContractStationMap/contract-station-map/listContractFormListDetailVoByCondition',
    method: 'get',
    params: parameter
  })
}

/** 岗位配置修改接口 */
export function postAllocation_Update(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaContractStationMap/contract-station-map/updateContractStationMap',
    method: 'post',
    data: parameter
  })
}

/** 岗位配置删除接口 */
export function postAllocation_Remove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaContractStationMap/contract-station-map/removeContractStationMapByStation',
    method: 'post',
    data: parameter
  })
}


/** 合同协议列表接口 */
export function contractAgreement_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaContractForm/contract-form/pageList',
    method: 'get',
    params: parameter
  })
}

/** 合同协议新增修改接口 */
export function contractAgreement_Add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaContractForm/contract-form/saveOrUpdateContractForm',
    method: 'post',
    data: parameter
  })
}

/** 合同协议删除接口 */
export function contractAgreement_Remove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaContractForm/contract-form/removeContractForm',
    method: 'post',
    data: parameter
  })
}

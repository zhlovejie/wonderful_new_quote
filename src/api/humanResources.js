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
//人员储备模板接口
export function Personnel_Reserve(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaContractStationMap/contract-station-map/listContractFormMapByCondition',
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

/** 房间管理 列表接口 */
export function electricity_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room/pageRoom',
    method: 'get',
    params: parameter
  })
}
/** 房间号 列表接口 */
export function listRoom(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room/listRoom',
    method: 'get',
    params: parameter
  })
}

/** 房间新增接口 */
export function electricity_Add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}

/** 房间管理详情接口 */
export function electricity_Detail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room/getRoomInfo',
    method: 'get',
    params: parameter
  })
}

/** 房间管理删除接口 */
export function electricityDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room/delRoom',
    method: 'delete',
    params: parameter

  })
}

/** 房间入住详情接口 */
export function electricity_PageRoomUser(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room/listRoomUser',
    method: 'get',
    params: parameter
  })
}



/** 人员管理 列表接口 */
export function personnel_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-user/pageRoomUser',
    method: 'get',
    params: parameter
  })
}
/** 部门下人员列表接口 */
export function queryList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/user/getOnPositionList',
    method: 'get',
    params: parameter
  })
}
/** 人员新增接口 */
export function personnel_Add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-user/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
/** 人员退房接口 */
export function personnel_Check(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-user/checkOutRoomUser',
    method: 'get',
    params: parameter
  })
}

/** 人员删除接口 */
export function personnel_delete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-user/delRoomUser',
    method: 'get',
    params: parameter
  })
}



/** 电费管理 列表接口 */
export function room_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-electricity-fees/pageRoomElectricityFees',
    method: 'get',
    params: parameter
  })
}


/** 电费管理新增接口 */
export function room_Add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-electricity-fees/addRoomElectricityFees',
    method: 'post',
    data: parameter
  })
}
/** 电费配置 接口 */
export function room_update(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-electricity-fees/update',
    method: 'get',
    params: parameter
  })
}


/** 安全卫生考核列表接口 */
export function securityHealth_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-examine/page',
    method: 'get',
    params: parameter
  })
}

/** 安全卫生考核新增接口 */
export function securityHealth_List_Add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-examine/addRoomExamine',
    method: 'post',
    data: parameter
  })
}
/** 安全卫生考核详情接口 */
export function securityHealth_Detail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-examine/getRoomExamineId',
    method: 'get',
    params: parameter
  })
}
/** 安全卫生考核处理接口 */
export function securityHealth_List_update(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/room/room-examine/updateRoomExamine',
    method: 'post',
    data: parameter
  })
}

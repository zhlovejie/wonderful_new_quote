import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------班次设置-----------------------
/**班次规则列表 */
export function classRuleList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRule/class-rule/getClassRuleList',
    method: 'get',
    params: parameter
  })
}
/**删除班次规则 */
export function classRuleDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRule/class-rule/delClassRule',
    method: 'get',
    params: parameter
  })
}

/**班次规则详情 */
export function classRuleDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRule/class-rule/classRuleDetail',
    method: 'get',
    params: parameter
  })
}
/**班次规则新增或修改 */
export function classRuleAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRule/class-rule/addAndUpdateClassRule',
    method: 'post',
    data: parameter
  })
}


export function classRuleConfigList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRuleConfig/class-rule-config/getClassRuleConfigList',
    method: 'get',
    params: parameter
  })
}

export function classRuleConfigDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRuleConfig/class-rule-config/delClassRuleConfig',
    method: 'post',
    data: parameter
  })
}

export function classRuleConfigDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRuleConfig/class-rule-config/classRuleConfigDetail',
    method: 'get',
    params: parameter
  })
}
/**班次规则配置 */
export function classRuleConfigAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRuleConfig/class-rule-config/addAndUpdateClassRuleConfig',
    method: 'post',
    data: parameter
  })
}
//---------------------班次设置---END-----------------

//---------------------补卡规则-----------------------
export function attenceRecardRuleDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRecardRule/detail',
    method: 'get',
    params: parameter
  })
}

export function attenceRecardRuleDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRecardRule/delete',
    method: 'post',
    data: parameter
  })
}

export function attenceRecardRuleAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRecardRule/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------补卡规则--END------------------

//---------------------加班设置-----------------------
export function overworkRuleAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkRule/overwork-rule/addAndUpdateOverworkRule',
    method: 'post',
    data: parameter
  })
}

export function overworkRuleDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkRule/overwork-rule/delOverworkRule',
    method: 'get',
    params: parameter
  })
}

export function overworkRuleList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkRule/overwork-rule/getOverworkRuleList',
    method: 'get',
    params: parameter
  })
}

export function overworkRuleDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkRule/overwork-rule/overworkRuleDetail',
    method: 'get',
    params: parameter
  })
}
//---------------------加班设置--END------------------


//---------------------出勤规则设置-----------------------
export function attenceDutyRuleAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

export function attenceDutyRuleDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/delete',
    method: 'post',
    data: parameter
  })
}

export function attenceDutyRuleDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/detail',
    method: 'get',
    params: parameter
  })
}

export function attenceDutyRuleList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/pageList',
    method: 'get',
    params: parameter
  })
}
/**根据出勤规则获取需要排班的所有用户 */
export function attenceDutyRuleUsersForArrange (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/usersForArrange',
    method: 'get',
    params: parameter
  })
}

export function attenceChangeApproveApprove (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceChangeApprove/approve',
    method: 'post',
    data: parameter
  })
}

export function attenceChangeApproveDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceChangeApprove/detail',
    method: 'get',
    params: parameter
  })
}

export function attenceChangeApproveList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceChangeApprove/pageList',
    method: 'get',
    params: parameter
  })
}

/**根据出勤规则id和月份获取该规则下所有人员的排班信息 */
export function attenceArrangeUserList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceArrange/arrangeList',
    method: 'get',
    params: parameter
  })
}

/**排班 */
export function attenceArrangeDoArrange (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceArrange/doArrange',
    method: 'post',
    data: parameter
  })
}

/**根据绑定类型和绑定的id判断该id是否已经有了出勤规则 */
export function attenceDutyRuleHaveRule (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/haveRule',
    method: 'get',
    params: parameter
  })
}

//---------------------出勤规则设置--END------------------

//---------------------假期规则设置-----------------------

export function holidayRuleAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/holidayRule/holiday-rule/addAndUpdateHolidayRule',
    method: 'post',
    data: parameter
  })
}


export function holidayRuleDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/holidayRule/holiday-rule/delHolidayRule',
    method: 'get',
    params: parameter
  })
}

export function holidayRuleList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/holidayRule/holiday-rule/getHolidayRuleList',
    method: 'get',
    params: parameter
  })
}

export function holidayRuleDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/holidayRule/holiday-rule/holidayRuleDetail',
    method: 'get',
    params: parameter
  })
}
//---------------------假期规则设置--END------------------


//---------------------节假日设置-----------------------
export function festivalRuleAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/addAndUpdateFestivalRule',
    method: 'post',
    data: parameter
  })
}

export function festivalRuleApproval (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/approvalFestivalRule',
    method: 'post',
    data: parameter
  })
}

export function festivalRuleDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/delFestivalRule',
    method: 'get',
    params: parameter
  })
}

export function festivalRuleDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/getFestivalRuleDetail',
    method: 'get',
    params: parameter
  })
}

export function festivalRuleList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/getFestivalRuleList',
    method: 'get',
    params: parameter
  })
}
/**发布 */
export function festivalRulePublish (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/publishFestivalRule',
    method: 'get',
    params: parameter
  })
}
/**撤回 */
export function festivalRuleWithdraw (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/withdrawFestivalRule',
    method: 'get',
    params: parameter
  })
}
//---------------------节假日设置--END------------------

//---------------------加班申请-----------------------
export function overworkApplyAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/addAndUpdateOverworkApply',
    method: 'post',
    data: parameter
  })
}

export function overworkApplyApproval (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/approvalOverworkApply',
    method: 'post',
    data: parameter
  })
}

export function overworkApplyDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/delOverworkApply',
    method: 'get',
    params: parameter
  })
}

export function overworkApplyDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/getOverworkApplyDetail',
    method: 'get',
    params: parameter
  })
}

export function overworkApplyList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/getOverworkApplyList',
    method: 'get',
    params: parameter
  })
}

export function overworkApplyHours (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/overworkHours',
    method: 'get',
    params: parameter
  })
}

export function overworkApplyWithdraw (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/withdrawOverworkApply',
    method: 'get',
    params: parameter
  })
}

/**
 * 打卡异常列表的条件查询接口
 * exceptionType 异常类别查询：1 需要补卡申请的类别（诸如迟到、早退、缺卡） 2 加班时间
 * userId 	用户id
 * @param {object} parameter 
 */
export function signExceptionByCondition (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/exception/listSignExceptionByCondition',
    method: 'get',
    params: parameter
  })
}


//---------------------加班申请--END------------------
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
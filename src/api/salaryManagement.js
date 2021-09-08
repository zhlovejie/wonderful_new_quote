import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

// 薪资制规则列表

export function annual_rulePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/floorsAnnual/salary-floors-annual-rule/page',
    method: 'get',
    params: parameter
  })
}

// 薪资制规则新增修改
export function annual_rulePageAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/floorsAnnual/salary-floors-annual-rule/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
// 薪资制规则删除
export function annual_ruleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/floorsAnnual/salary-floors-annual-rule/del',
    method: 'get',
    params: parameter
  })
}



//---------------------工资参照表-----------------------
/**工资参照表列表分页条件查询 */
export function oaSalaryInfoStationStandardPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard/getStationStandardPageList',
    method: 'get',
    params: parameter
  })
}

/*工资参照表新增*/
export function oaSalaryInfoStationStandardAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard/addAndUpdateStationStandard',
    method: 'post',
    data: parameter
  })
}
/**根据部门id物理删除，直接从数据库中删除以及所关联的修改记录 */
export function oaSalaryInfoStationStandardDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard/delStationStandard',
    method: 'get',
    params: parameter
  })
}

/**根据部门id获取详情，岗位id不必传 */
export function oaSalaryInfoStationStandardDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard/getStationStandardDetail',
    method: 'get',
    params: parameter
  })
}
/**
 * @desc 根据部门id判断是否可以新增
 * @param {Object} parameter ->depId
 */
export function oaSalaryInfoStationStandardIsAddByDepId(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard/isAddByDepId',
    method: 'get',
    params: parameter
  })
}

/**根据部门id获取修改记录 */
export function oaSalaryInfoStationStationStandardChangList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard-change/getStationStandardChangList',
    method: 'get',
    params: parameter
  })
}

//---------------------薪资项设置-----------------------
export function oaSalaryConsistAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/addAndUpdateConsist',
    method: 'post',
    data: parameter
  })
}

export function oaSalaryConsistDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/consistDetail',
    method: 'get',
    params: parameter
  })
}

export function oaSalaryConsistDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/delConsist',
    method: 'get',
    params: parameter
  })
}

export function oaSalaryConsistPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/getConsistPageList',
    method: 'get',
    params: parameter
  })
}

/**岗位验重 */
export function oaSalaryConsistIsAddByStationId(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/isAddByStationId',
    method: 'get',
    params: parameter
  })
}
/**验证 */
export function oaSalaryConsistValidate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/validateConsist',
    method: 'get',
    params: parameter
  })
}
//---------------------薪资项设置-END----------------------




//多类补贴规则（1工伤 2代班 3 大夜班 4中夜班 5延时餐补）   补贴规则
export function nightRuleAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-night-rule/addAndUpdateNightRule',
    method: 'post',
    data: parameter
  })
}

export function nightRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-night-rule/delNightRule',
    method: 'get',
    params: parameter
  })
}

export function nightRulePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-night-rule/getNightRulePageList',
    method: 'get',
    params: parameter
  })
}
//多类补贴规则（1工伤 2代班 3 大夜班 4中夜班 5延时餐补）   补贴规则END

//岗位等级补贴规则（1 油补规则 2  通讯补贴 3 高级工程师补贴） 
export function levelRuleAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-level-rule/addAndUpdateLevelRule',
    method: 'post',
    data: parameter
  })
}

export function levelRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-level-rule/delLevelRule',
    method: 'get',
    params: parameter
  })
}

export function levelRulePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-level-rule/getLevelRulePageList',
    method: 'get',
    params: parameter
  })
}
//岗位等级补贴规则（1 油补规则 2  通讯补贴 3 高级工程师补贴） END


//工龄补贴规则
export function lengthServiceRuleAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-length-service-rule/addAndUpdateLengthServiceRule',
    method: 'post',
    data: parameter
  })
}

export function lengthServiceRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-length-service-rule/delLengthServiceRule',
    method: 'get',
    params: parameter
  })
}

export function lengthServiceRulePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-length-service-rule/getLengthServiceRulePageList',
    method: 'get',
    params: parameter
  })
}

export function lengthServiceRuleDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-length-service-rule/lengthServiceRuleDetail',
    method: 'get',
    params: parameter
  })
}
//工龄补贴规则END

//加班补贴规则
export function overWorkRuleAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-over-work-rule/addAndUpdateOverWorkRule',
    method: 'post',
    data: parameter
  })
}

export function overWorkRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-over-work-rule/delOverWorkRule',
    method: 'get',
    params: parameter
  })
}

export function overWorkRulePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-over-work-rule/getOverWorkRulePageList',
    method: 'get',
    params: parameter
  })
}
//加班补贴规则END


//交通补贴规则
export function trafficRuleAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-traffic-rule/addAndUpdateTrafficRule',
    method: 'post',
    data: parameter
  })
}

export function trafficRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-traffic-rule/delTrafficRule',
    method: 'get',
    params: parameter
  })
}

export function trafficRulePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-traffic-rule/getTrafficRulePageList',
    method: 'get',
    params: parameter
  })
}
//交通补贴规则END

//高温补贴规则
export function hignTemRuleRuleAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-hign-tem-rule/addAndUpdateHignTemRule',
    method: 'post',
    data: parameter
  })
}

export function hignTemRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-hign-tem-rule/delHignTemRule',
    method: 'get',
    params: parameter
  })
}

export function hignTemRulePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-hign-tem-rule/getHignTemRulePageList',
    method: 'get',
    params: parameter
  })
}
//高温补贴规则END

//油补申请
export function oilApplyAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-oil-apply/addAndUpdateOilApply',
    method: 'post',
    data: parameter
  })
}

export function oilApplyApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-oil-apply/approvalOilApply',
    method: 'post',
    data: parameter
  })
}

export function oilApplyDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-oil-apply/delOilApply',
    method: 'get',
    params: parameter
  })
}

export function oilApplyPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-oil-apply/getOilApplyPageList',
    method: 'get',
    params: parameter
  })
}

export function oilApplyRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-oil-apply/revocationOilApply',
    method: 'get',
    params: parameter
  })
}
export function pageAllowanceOilInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/allowanceRules/allowance-oil-info/pageAllowanceOilInfo',
    method: 'get',
    params: parameter
  })
}

export function exportAllowanceOilInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/allowanceRules/allowance-oil-info/exportAllowanceOilInfo',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}
//油补申请END

//通讯申请
export function ComApplyAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-com-apply/addAndUpdateComApply',
    method: 'post',
    data: parameter
  })
}

export function ComApplyApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-com-apply/approvalComApply',
    method: 'post',
    data: parameter
  })
}

export function ComApplyDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-com-apply/delComApply',
    method: 'get',
    params: parameter
  })
}

export function ComApplyPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-com-apply/getComApplyPageList',
    method: 'get',
    params: parameter
  })
}

export function ComApplyRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-com-apply/revocationComApply',
    method: 'get',
    params: parameter
  })
}
//通讯申请END


//代班补贴申请
export function SelinaApplyAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-selina-apply/addAndUpdateSelinaApply',
    method: 'post',
    data: parameter
  })
}

export function SelinaApplyApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-selina-apply/approvalSelinaApply',
    method: 'post',
    data: parameter
  })
}

export function SelinaApplyDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-selina-apply/delSelinaApply',
    method: 'get',
    params: parameter
  })
}
/**手动完结 */
export function SelinaApplyEnd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-selina-apply/endSelinaApply',
    method: 'get',
    params: parameter
  })
}

export function SelinaApplyPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-selina-apply/getSelinaApplyPageList',
    method: 'get',
    params: parameter
  })
}

export function SelinaApplyRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-selina-apply/revocationSelinaApply',
    method: 'get',
    params: parameter
  })
}

//代班补贴申请 END

//其他补贴申请 
export function OtherApplyAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-other-apply/addAndUpdateOtherApply',
    method: 'post',
    data: parameter
  })
}

export function OtherApplyApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-other-apply/approvalOtherApply',
    method: 'post',
    data: parameter
  })
}

export function OtherApplyDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-other-apply/delOtherApply',
    method: 'get',
    params: parameter
  })
}

export function OtherApplyPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-other-apply/getOtherApplyPageList',
    method: 'get',
    params: parameter
  })
}

export function OtherApplyRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-other-apply/revocationOtherApply',
    method: 'get',
    params: parameter
  })
}
//其他补贴申请 END


//工伤补贴申请 
export function InjuryApplyAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-injury-apply/addAndUpdateInjuryApply',
    method: 'post',
    data: parameter
  })
}

export function InjuryApplyApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-injury-apply/approvalInjuryApply',
    method: 'post',
    data: parameter
  })
}

export function InjuryApplyDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-injury-apply/delInjuryApply',
    method: 'get',
    params: parameter
  })
}

export function InjuryApplyPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-injury-apply/getInjuryApplyPageList',
    method: 'get',
    params: parameter
  })
}

export function InjuryApplyRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-allowance-injury-apply/revocationInjuryApply',
    method: 'get',
    params: parameter
  })
}
//工伤补贴申请 END

/**根据用户编号获取对应车牌号 */
export function getUserInfoById(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/user/getUserInfoById',
    method: 'get',
    params: parameter
  })
}

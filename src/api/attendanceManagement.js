import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


// 体温积累表

export function getTemperatureList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/temperature/temperature/page',
    method: 'get',
    params: parameter
  })
}




// 补卡罚款规则设置

export function getFineRuleList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/recardFineRule/recard-fine-rule/getFineRuleList',
    method: 'get',
    params: parameter
  })
}

// 补卡罚款规则设置删除

export function delFineRule(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/recardFineRule/recard-fine-rule/delFineRule',
    method: 'get',
    params: parameter
  })
}

// 补卡罚款规则设置添加规则

export function addAndUpdateFineConfig(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/recardFineConfig/recard-fine-config/addAndUpdateFineConfig',
    method: 'post',
    data: parameter
  })
}

//罚款规则列表

export function getFineConfigList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/recardFineConfig/recard-fine-config/getFineConfigList',
    method: 'get',
    params: parameter
  })
}
//删除
export function delFineConfig(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/recardFineConfig/recard-fine-config/delFineConfig',
    method: 'get',
    params: parameter
  })
}

export function addAndUpdateFineRule(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/recardFineRule/recard-fine-rule/addAndUpdateFineRule',
    method: 'post',
    data: parameter
  })
}
//罚款列表
export function getFineRecordList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/recardFineRecord/recard-fine-record/getFineRecordList',
    method: 'get',
    params: parameter
  })
}
// 入厂记录 
export function accessHumanCardInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/human/oa-access-human-decency/accessHumanCardInfo',
    method: 'post',
    data: parameter
  })
}






















//---------------------外出申请-----------------------
/** 外出申请列表  */


export function going_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceEgressApply/pageList',
    method: 'get',
    params: parameter
  })
}

/** 外出申请新增  */
export function going_add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceEgressApply/add',
    method: 'post',
    data: parameter
  })
}
/** 外出申请详情  */
export function going_detail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceEgressApply/detail',
    method: 'get',
    params: parameter
  })
}

/** 外出审批 */
export function going_approve(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceEgressApply/approve',
    method: 'post',
    data: parameter
  })
}

/**  删除外出申请 */

export function going_delete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceEgressApply/delete',
    method: 'post',
    data: parameter
  })
}

/**  撤销外出申请 */
export function going_cancel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceEgressApply/cancel',
    method: 'post',
    data: parameter
  })
}









//---------------------班次设置-----------------------
/**班次规则列表 */
export function classRuleList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRule/class-rule/getClassRuleList',
    method: 'get',
    params: parameter
  })
}
/**删除班次规则 */
export function classRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRule/class-rule/delClassRule',
    method: 'get',
    params: parameter
  })
}

/**班次规则详情 */
export function classRuleDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRule/class-rule/classRuleDetail',
    method: 'get',
    params: parameter
  })
}
/**班次规则新增或修改 */
export function classRuleAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRule/class-rule/addAndUpdateClassRule',
    method: 'post',
    data: parameter
  })
}


export function classRuleConfigList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRuleConfig/class-rule-config/getClassRuleConfigList',
    method: 'get',
    params: parameter
  })
}

export function classRuleConfigDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRuleConfig/class-rule-config/delClassRuleConfig',
    method: 'post',
    data: parameter
  })
}

export function classRuleConfigDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRuleConfig/class-rule-config/classRuleConfigDetail',
    method: 'get',
    params: parameter
  })
}
/**班次规则配置 */
export function classRuleConfigAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRuleConfig/class-rule-config/addAndUpdateClassRuleConfig',
    method: 'post',
    data: parameter
  })
}

/**效验时间 */
export function classRuleConfigValidationTime(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/classRuleConfig/class-rule-config/validationTime',
    method: 'get',
    params: parameter
  })
}

//---------------------班次设置---END-----------------

//---------------------补卡规则-----------------------
export function attenceRecardRuleDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRecardRule/detail',
    method: 'get',
    params: parameter
  })
}

export function attenceRecardRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRecardRule/delete',
    method: 'post',
    data: parameter
  })
}

export function attenceRecardRuleAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRecardRule/addOrUpdate',
    method: 'post',
    data: parameter
  })
}
//---------------------补卡规则--END------------------

//---------------------加班设置-----------------------
export function overworkRuleAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkRule/overwork-rule/addAndUpdateOverworkRule',
    method: 'post',
    data: parameter
  })
}

export function overworkRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkRule/overwork-rule/delOverworkRule',
    method: 'get',
    params: parameter
  })
}

export function overworkRuleList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkRule/overwork-rule/getOverworkRuleList',
    method: 'get',
    params: parameter
  })
}

export function overworkRuleDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkRule/overwork-rule/overworkRuleDetail',
    method: 'get',
    params: parameter
  })
}
//---------------------加班设置--END------------------


//---------------------出勤规则设置-----------------------
export function attenceDutyRuleAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

export function attenceDutyRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/delete',
    method: 'post',
    data: parameter
  })
}

export function attenceDutyRuleDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/detail',
    method: 'get',
    params: parameter
  })
}

export function attenceDutyRuleList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/pageList',
    method: 'get',
    params: parameter
  })
}
/**根据出勤规则获取需要排班的所有用户 */
export function attenceDutyRuleUsersForArrange(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/usersForArrange',
    method: 'get',
    params: parameter
  })
}

export function attenceChangeApproveApprove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceChangeApprove/approve',
    method: 'post',
    data: parameter
  })
}

export function attenceChangeApproveDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceChangeApprove/detail',
    method: 'get',
    params: parameter
  })
}

export function attenceChangeApproveList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceChangeApprove/pageList',
    method: 'get',
    params: parameter
  })
}

/**根据出勤规则id和月份获取该规则下所有人员的排班信息 */
export function attenceArrangeUserList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceArrange/arrangeList',
    method: 'get',
    params: parameter
  })
}

/**排班 */
export function attenceArrangeDoArrange(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceArrange/doArrange',
    method: 'post',
    data: parameter
  })
}

/**根据绑定类型和绑定的id判断该id是否已经有了出勤规则 */
export function attenceDutyRuleHaveRule(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/haveRule',
    method: 'get',
    params: parameter
  })
}

//---------------------出勤规则设置--END------------------

//---------------------假期规则设置-----------------------

export function holidayRuleAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/holidayRule/holiday-rule/addAndUpdateHolidayRule',
    method: 'post',
    data: parameter
  })
}


export function holidayRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/holidayRule/holiday-rule/delHolidayRule',
    method: 'get',
    params: parameter
  })
}

export function holidayRuleList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/holidayRule/holiday-rule/getHolidayRuleList',
    method: 'get',
    params: parameter
  })
}

export function holidayRuleDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/holidayRule/holiday-rule/holidayRuleDetail',
    method: 'get',
    params: parameter
  })
}
//---------------------假期规则设置--END------------------


//---------------------节假日设置-----------------------
export function festivalRuleAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/addAndUpdateFestivalRule',
    method: 'post',
    data: parameter
  })
}

export function festivalRuleApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/approvalFestivalRule',
    method: 'post',
    data: parameter
  })
}

export function festivalRuleDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/delFestivalRule',
    method: 'get',
    params: parameter
  })
}

export function festivalRuleDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/getFestivalRuleDetail',
    method: 'get',
    params: parameter
  })
}

export function festivalRuleList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/getFestivalRuleList',
    method: 'get',
    params: parameter
  })
}
/**发布 */
export function festivalRulePublish(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/publishFestivalRule',
    method: 'get',
    params: parameter
  })
}
/**撤回 */
export function festivalRuleWithdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/festivalRule/festival-rule/withdrawFestivalRule',
    method: 'get',
    params: parameter
  })
}
//---------------------节假日设置--END------------------

//---------------------加班申请-----------------------
export function overworkApplyAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/addAndUpdateOverworkApply',
    method: 'post',
    data: parameter
  })
}

export function overworkApplyApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/approvalOverworkApply',
    method: 'post',
    data: parameter
  })
}

export function overworkApplyDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/delOverworkApply',
    method: 'get',
    params: parameter
  })
}

export function overworkApplyDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/getOverworkApplyDetail',
    method: 'get',
    params: parameter
  })
}

export function overworkApplyList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/getOverworkApplyList',
    method: 'get',
    params: parameter
  })
}

export function overworkApplyHours(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/overworkHours',
    method: 'get',
    params: parameter
  })
}

export function overworkApplyWithdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/withdrawOverworkApply',
    method: 'get',
    params: parameter
  })
}
/**
 * 填充加班申请的 开始时间和结束时间
 * @param {*} parameter 
 */
export function overworkApplyInitTime(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/overworkApply/overwork-apply/getOverWorkApplyInitTime',
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
export function signExceptionByCondition(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/exception/listSignExceptionByCondition',
    method: 'get',
    params: parameter
  })
}


//---------------------加班申请--END------------------


//---------------------补卡申请-----------------------
export function resignApplyAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/resignApply/resign-apply/addAndUpdateResignApply',
    method: 'post',
    data: parameter
  })
}

export function resignApplyApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/resignApply/resign-apply/approvalResignApply',
    method: 'post',
    data: parameter
  })
}

export function resignApplyDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/resignApply/resign-apply/delResignApply',
    method: 'get',
    params: parameter
  })
}

export function resignApplyDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/resignApply/resign-apply/getResignApplyDetail',
    method: 'get',
    params: parameter
  })
}

export function resignApplyList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/resignApply/resign-apply/getResignApplyList',
    method: 'get',
    params: parameter
  })
}
/**根据用户id获取已提交次数 */
export function resignApplySubmittedCount(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/resignApply/resign-apply/submittedCount',
    method: 'get',
    params: parameter
  })
}

export function resignApplyWithdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/resignApply/resign-apply/withdrawResignApply',
    method: 'get',
    params: parameter
  })
}

//---------------------补卡申请--END------------------


//---------------------出差申请-----------------------

/**查询当前登录人最新的卡号 */
export function attenceTravelApplyGetNewstAccount(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceTravelApply/getNewstAccount',
    method: 'get',
    params: parameter
  })
}


/**添加行程 */
export function attenceTravelRouteAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'attenceTravelRoute/addRoute',
    method: 'post',
    data: parameter
  })
}


export function attenceTravelApplyAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'attenceTravelApply/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

export function attenceTravelApplyApprove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'attenceTravelApply/approve',
    method: 'post',
    data: parameter
  })
}

export function attenceTravelApplyDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'attenceTravelApply/delete',
    method: 'post',
    data: parameter
  })
}

export function attenceTravelApplyDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceTravelApply/detail',
    method: 'get',
    params: parameter
  })
}

/**财务完结 */
export function attenceTravelApplyFinanceFinish(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'attenceTravelApply/financeFinish',
    method: 'post',
    data: parameter
  })
}

/**结束出差 */
export function attenceTravelApplyFinishTravel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'attenceTravelApply/finishTravel',
    method: 'post',
    data: parameter
  })
}

export function attenceTravelApplyList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceTravelApply/pageList',
    method: 'get',
    params: parameter
  })
}
/**提交出差单 */
export function attenceTravelApplySubmit(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'attenceTravelApply/submit',
    method: 'post',
    data: parameter
  })
}
/**撤回 */
export function attenceTravelApplyWithdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'attenceTravelApply/withdraw',
    method: 'post',
    data: parameter
  })
}

//出差申请单里的出差人员接口

/**判断用户是否有未完结的出差，返回true则有，false为无 */
export function attenceTravelUserCheckUserTravel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceTravelUser/checkUserTravel',
    method: 'get',
    params: parameter
  })
}

/**根据出差单获取该出差单里的所有出差人员 */
export function attenceTravelUserGetUsersForTravel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceTravelUser/getUsersForTravel',
    method: 'get',
    params: parameter
  })
}

//---------------------出差申请--END------------------


//---------------------请假申请-----------------------
export function attenceLeaveApplyAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceLeaveApply/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

export function attenceLeaveApplyApprove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceLeaveApply/approve',
    method: 'post',
    data: parameter
  })
}
//计算请假时长
export function attenceLeaveApplyComputeLeaveTime(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceLeaveApply/computeLeaveTime',
    method: 'get',
    params: parameter
  })
}

export function attenceLeaveApplyDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceLeaveApply/delete',
    method: 'post',
    data: parameter
  })
}

export function attenceLeaveApplyDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceLeaveApply/detail',
    method: 'get',
    params: parameter
  })
}

export function attenceLeaveApplyList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceLeaveApply/pageList',
    method: 'get',
    params: parameter
  })
}

export function attenceLeaveApplyWithdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceLeaveApply/withdraw',
    method: 'post',
    data: parameter
  })
}

export function attenceLeaveApplyAllHoliday(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceLeaveApply/getAllHoliday',
    method: 'get',
    params: parameter
  })
}


/**
 * 可调休时长的查询
 * hourType 请假类型ID
 * userId
 */
export function attenceLeaveApplyUserRestHoursRecord(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/restHoursRecord/rest-hours-record/getUserRestHoursRecord',
    method: 'get',
    params: parameter
  })
}

/**
 * 判断用户当前年度是否有某类型的请假单（返回true则有：false则没有）
 * @param {string} holidayId
 * @param {string} userId
 */
export function attenceLeaveApplyCheckHolidayUsed(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceLeaveApply/checkHolidayUsed',
    method: 'get',
    params: parameter
  })
}

//---------------------请假申请--END------------------


//---------------------请假申请-----------------------

/**工作餐统计根据工作餐id获取客户餐详情pc */
export function getCustomerLunchById(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/orderLunch/order-lunch/getCustomerLunchById',
    method: 'get',
    params: parameter
  })
}

/**工作餐统计带分页pc */
export function getWorkLunchCensus(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/orderLunch/order-lunch/getWorkLunchCensus',
    method: 'get',
    params: parameter
  })
}

/**工作餐统计pc */
export function getWorkLunchNum(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/orderLunch/order-lunch/getWorkLunchNum',
    method: 'get',
    params: parameter
  })
}

//---------------------请假申请--END------------------

//---------------------考勤异常事件-----------------------
export function signExceptionList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/exception/listSignExceptionByPage',
    method: 'get',
    params: parameter
  })
}

/**处理 */
export function signExceptionUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/exception/updateSignException',
    method: 'post',
    data: parameter
  })
}

/**删除 */
export function signExceptionDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/exception/removeSignException',
    method: 'post',
    data: parameter
  })
}


//---------------------考勤异常事件--END------------------

//---------------------考勤月历-----------------------

/**考勤月历下载 */
export function attenceMonthStatiticsExportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/monthDayStatitics/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}


/**考勤月统计汇总分页查询 */
export function attenceMonthStatiticsCollectList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/monthDayStatitics/listAttenceMonthStatiticsCollectListVoByPage',
    method: 'get',
    params: parameter
  })
}

/**考勤月历分页查询 */
export function monthStatiticsList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/monthDayStatitics/listMonthStatiticsByPage',
    method: 'get',
    params: parameter
  })
}

/**考勤月汇总下载 */
export function attenceMonthStatiticsMonthExportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/monthDayStatitics/month/exportExcel',
    method: 'get',
    params: parameter
  })
}

/**考勤月历修改记录分页查询 */
export function attenceMonthStatiticsChangeUpdateList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/attenceMonthChange/listAttenceMonthStatiticsChangeListByPage',
    method: 'get',
    params: parameter
  })
}

/**考勤月历修改记录的新增 */
export function attenceMonthStatiticsChangeAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/attenceMonthChange/saveAttenceMonthStatiticsChange',
    method: 'post',
    data: parameter
  })
}
//---------------------考勤月历--END------------------

//--------------------人脸打卡记录---------------------

/** 打卡记录分页查询 */
export function getFaceRecordList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/sign-history/listSignHistoryByPage',
    method: 'get',
    params: parameter
  })
}

/** 打卡记录下载接口 */
export function DownFaceRecordList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/sign-history/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

/** 新增或者修改人脸打卡记录 */
export function doFaceRecord(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/sign-history/saveOrUpdateSignHistory',
    method: 'post',
    data: parameter
  })
}
//-------------------人脸打卡记录--END------------------

//--------------------考勤设备---------------------

/** 通过主板号查询设备信息 */
export function getDeviceDetailByMainBordNum(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/device-info/getDeviceDetailByMainBordNum',
    method: 'get',
    params: parameter
  })
}

/** 设备列表查询接口 */
export function getDeviceInfoList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/device-info/listDeviceInfoByPage',
    method: 'get',
    params: parameter
  })
}

/** 设备修改接口 */
export function updateDeviceInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/device-info/updateDeviceInfo',
    method: 'post',
    data: parameter
  })
}

/** 设备保存接口 */
export function saveDeviceInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/device-info/saveDeviceInfo',
    method: 'post',
    data: parameter
  })
}

/** 设备删除接口 */
export function removeDeviceInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/device-info/removeDeviceInfo',
    method: 'post',
    data: parameter
  })
}
//-------------------考勤设备--END------------------

//--------------------考勤统计---------------------

/** 考勤月统计汇总分页查询 */
export function getStatisticsList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/monthDayStatitics/listAttenceMonthStatiticsCollectListVoByPage',
    method: 'get',
    params: parameter
  })
}

/** 考勤月汇总下载 */
export function downStatisticsList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/monthDayStatitics/month/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}
//-------------------没设规则用户--END------------------
/** 没设规则用户 */
export function no_rules_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceDutyRule/listUserWithoutRule',
    method: 'get',
    params: parameter
  })
}


//-------------------调休规则设置-----------------------
export function attenceRestRuleDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRestRule/detail',
    method: 'get',
    params: parameter
  })
}

export function attenceRestRuleAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRestRule/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

export function attenceRestRuleDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRestRule/delete',
    method: 'post',
    data: parameter
  })
}



export function attenceRestTimeoutPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRestTimeout/pageList',
    method: 'get',
    params: parameter
  })
}

/**更新超时记录 */
export function attenceRestTimeoutUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/attenceRestTimeout/update',
    method: 'post',
    data: parameter
  })
}
//-------------------调休规则设置--END------------------

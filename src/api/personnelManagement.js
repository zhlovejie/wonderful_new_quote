import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------试用期调查表-----------------------
// 获取试用期调查表列表
export function getProbationSurveyList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/probationSurvey/getPageList',
    method: 'get',
    params: parameter
  })
}

//调查表申请撤回

export function getProbationCancel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/probationSurvey/cancel',
    method: 'post',
    data: parameter
  })
}



// 试用期调查表详情
export function handleProbationSurvey(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/probationSurvey/handleProbationSurvey',
    method: 'get',
    params: parameter
  })
}

// 审批查看试用期调查表
export function approvalLookProbationSurvey(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/probationSurvey/approvalLookProbationSurvey',
    method: 'get',
    params: parameter
  })
}

// 审批试用期调查表
export function approvalProbationSurvey(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/probationSurvey/approvalProbationSurvey',
    method: 'post',
    data: parameter
  })
}

// 提交处理结果试用期调查表
export function saveHandleProbationSurvey(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/probationSurvey/saveHandleProbationSurvey',
    method: 'post',
    data: parameter
  })
}
//试用期考评状态
export function getProbationEvaluationByProbationSurveyId(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/ProbationEvaluation/getProbationEvaluationByProbationSurveyId',
    method: 'get',
    params: parameter
  })
}

//查询本月出勤天数
export function getAttenceMonthStatiticsCollect(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sign/monthDayStatitics/getAttenceMonthStatiticsCollect',
    method: 'get',
    params: parameter
  })
}



//---------------------试用期调查表-END-------------------

// 人员储备新增或修改
// export function reserveAddOrUpdate (parameter) {
//   return axios({
//     baseURL: system.baseURL,
//     url: '/reserve/addOrUpdate',
//     method: 'post',
//     data: parameter
//   })
// }



// 面试记录列表
export function getInterviewRecordList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/interviewRecord/pageList',
    method: 'get',
    params: parameter
  })
}

// 新增面试记录
export function interviewRecordAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/interviewRecord/add',
    method: 'post',
    data: parameter
  })
}
// 修改面试记录
export function interviewRecordUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/interviewRecord/update',
    method: 'post',
    data: parameter
  })
}

// 面试记录详情
export function handleInterviewRecord(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/interviewRecord/handleInterviewRecord',
    method: 'get',
    params: parameter
  })
}



//----------------------招聘申请
//招聘申请的新增或修改
export function addPersonAdvertInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personAdvert/addPersonAdvertInfo',
    method: 'post',
    data: parameter
  })
}

//招聘申请的审批
export function approvePersonAdvertInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personAdvert/approvePersonAdvertInfo',
    method: 'post',
    data: parameter
  })
}

//删除部门或者岗位信息
export function deleteOrag(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/deleteOrag',
    method: 'get',
    params: parameter
  })
}

//查询招聘申请部门列表
export function getDepartmentList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/getDepartmentList',
    method: 'get',
    params: parameter
  })
}

//查询招聘申请详情信息
export function getPersonAdvertInfoDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/getPersonAdvertInfoDetail',
    method: 'get',
    params: parameter
  })
}

//查询岗位在职资格说明
export function getStationExplain(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/getStationExplain',
    method: 'get',
    params: parameter
  })
}

//查询招聘申请岗位列表
export function getStationList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/getStationList',
    method: 'get',
    params: parameter
  })
}

//查询岗位在职人数
export function getStationPersonNum(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/getStationPersonNum',
    method: 'get',
    params: parameter
  })
}

//招聘申请分页列表
export function pageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/pageList',
    method: 'get',
    params: parameter
  })
}

//招聘申请撤回
export function pageCancel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/cancel',
    method: 'post',
    data: parameter
  })
}
export function updateIsEnd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/updateIsEnd',
    method: 'get',
    params: parameter
  })
}
//----------------------招聘申请END


//----------------------转正申请

//新增部门，新增岗位 api  adverInfoId
export function personnelFullMemberApply_GetDepartmentList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/getDepartmentList',
    method: 'get',
    params: parameter
  })
}

export function personnelFullMemberApply_GetStationList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personAdvert/getStationList',
    method: 'get',
    params: parameter
  })
}
//新增部门，新增岗位 api END

//转正申请列表
export function personnelFullMemberApply_PageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personnelFullMemberApply/getPageList',
    method: 'get',
    params: parameter
  })
}
//转正申请撤回
export function personnelFullMemberApply_Cancel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personnelFullMemberApply/cancel',
    method: 'post',
    data: parameter
  })
}
//转正详细
export function personnelFullMemberApply_HandleFullMemberApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personnelFullMemberApply/handleFullMemberApply',
    method: 'get',
    params: parameter
  })
}
//转正处理
export function personnelFullMemberApply_Save(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personnelFullMemberApply/saveHandleProbationSurvey',
    method: 'post',
    data: parameter
  })
}

//转正申请审批查看
export function personnelFullMemberApply_ApprovalLook(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personnelFullMemberApply/approvalLookFullMemberApply',
    method: 'get',
    params: parameter
  })
}
//转正申请审批
export function personnelFullMemberApply_Approval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personnelFullMemberApply/approvalFullMemberApply',
    method: 'post',
    data: parameter
  })
}

//财务人员修改工资分配金额
export function personnelFullMemberApply_updateUserBackCardSalary(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personnelFullMemberApply/updateUserBackCardSalary',
    method: 'post',
    data: parameter
  })
}

//----------------------转正申请END

//----------------------调岗调薪接口

//调岗调薪申请分页列表
export function getPositionApplyListByPage(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionApply/getApplyListByPage',
    method: 'get',
    params: parameter
  })
}

//调岗调薪申请撤回

export function getPositionApplyListByCancel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionApply/cancel',
    method: 'post',
    data: parameter
  })
}


//调岗申请详情查询 applyId
export function getPositionChangeDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionApply/getPositionChangeDetail',
    method: 'get',
    params: parameter
  })
}

//查询部门主管
export function getPositionManager(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionApply/getPositionManager',
    method: 'get',
    params: parameter
  })
}

//调岗申请单的新增或者修改
export function saveOrUpdatePositionChangeApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionApply/saveOrUpdatePositionChangeApply',
    method: 'post',
    data: parameter
  })
}

//调岗申请单的审批
export function approvePositionChangeAplly(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionApply/approvePositionChangeAplly',
    method: 'post',
    data: parameter
  })
}

//查询申请用户的部门和岗位信息 //applyUserId
export function getApplyUserOrag(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionApply/getApplyUserOrag',
    method: 'get',
    params: parameter
  })
}
//查询申请用户的部门和岗位信息 //departmentId
export function getDepartmentUser(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionApply/getDepartmentUser',
    method: 'get',
    params: parameter
  })
}






//调薪申请详情查询
export function getSalaryChangeDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salaryApply/getSalaryChangeDetail',
    method: 'get',
    params: parameter
  })
}
//调薪申请单的新增或者修改
export function saveOrUpdateSalaryChangeApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salaryApply/saveOrUpdateSalaryChangeApply',
    method: 'post',
    data: parameter
  })
}

//调薪审批
export function approveSalaryChangeApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salaryApply/approveSalaryChangeApply',
    method: 'post',
    data: parameter
  })
}

//调岗调薪
export function getPositionAndSalaryChangeDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionAndSalaryApply/getPositionAndSalaryChangeDetail',
    method: 'get',
    params: parameter
  })
}

export function saveOrUpdatePositionAndSalaryChangeApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionAndSalaryApply/saveOrUpdatePositionAndSalaryChangeApply',
    method: 'post',
    data: parameter
  })
}

export function approvePositionAndSalaryChange(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/positionAndSalaryApply/approvePositionAndSalaryChange',
    method: 'post',
    data: parameter
  })
}
/**根据用户id获取基本工资 */
export function getSalaryBaseCommonByUserId(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-base-common/getSalaryBaseCommonByUserId',
    method: 'get',
    params: parameter
  })
}

//----------------------调岗调薪接口END


//----------------------组织架构

//部门组织架构
export function getDepStructure(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/orgStructure/getDepStructure',
    method: 'get',
    params: parameter
  })
}

//岗位组织架构
export function getStationStructure(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/orgStructure/getStationStructure',
    method: 'get',
    params: parameter
  })
}
//----------------------组织架构END

//----------------------事故调查报告

//事故调查报告分页列表
export function personIncidentPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personIncident/pageList',
    method: 'get',
    params: parameter
  })
}
//事故调查报告撤回
export function personIncidentPageCancel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personIncident/cancel',
    method: 'post',
    data: parameter
  })
}


//事故调查报告详情查询接口
export function getPersonnelIncidentInvReportDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personIncident/getPersonnelIncidentInvReportDetail',
    method: 'get',
    params: parameter
  })
}

//事故调查报告详情删除接口  applyId
export function deletePersonnelIncidentInvReport(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personIncident/deletePersonnelIncidentInvReport',
    method: 'get',
    params: parameter
  })
}

//事故调查报告的新增或者修改
export function saveOrUpdatePersonnelIncidentInvReport(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personIncident/saveOrUpdatePersonnelIncidentInvReport',
    method: 'post',
    data: parameter
  })
}

//事故调查报告单的审批
export function approvePersonnelIncidentInvReport(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personIncident/approvePersonnelIncidentInvReport',
    method: 'post',
    data: parameter
  })
}


//----------------------事故调查报告END


//----------------------离职协议

//获取离职协议列表
export function personnelLeaveOfficeAgreementPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personnelLeaveOfficeAgreement/getPageList',
    method: 'get',
    params: parameter
  })
}
//获取离职协议撤回
export function personnelLeaveOfficeAgreementCancel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personnelLeaveOfficeAgreement/cancel',
    method: 'post',
    data: parameter
  })
}

//获取已审批完的离职协议列表
export function personnelLeaveOfficeAgreementAllFinishPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personnelLeaveOfficeAgreement/getAllFinishPageList',
    method: 'get',
    params: parameter
  })
}

//获取离职协议详情  id
export function getLeaveOfficeAgreement(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personnelLeaveOfficeAgreement/getLeaveOfficeAgreement',
    method: 'get',
    params: parameter
  })
}

//变更单据状态是否完结 id
export function personnelLeaveOfficeAgreementChangeIsEnd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'personnelLeaveOfficeAgreement/changeIsEnd',
    method: 'get',
    params: parameter
  })
}

//新增离职协议或修改
export function addLeaveOfficeAgreementAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personnelLeaveOfficeAgreement/addLeaveOfficeAgreementAndUpdate',
    method: 'post',
    data: parameter
  })
}

//离职协议的审批
export function approveLeaveOfficeAgreement(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personnelLeaveOfficeAgreement/approveLeaveOfficeAgreement',
    method: 'post',
    data: parameter
  })
}
//----------------------离职协议END

//----------------------离职申请

//离职申请列表
export function personLeaveApplyPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personLeaveApply/pageList',
    method: 'get',
    params: parameter
  })
}
//离职申请的删除  applyId
export function deletePersonnelLeaveApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personLeaveApply/deletePersonnelLeaveApply',
    method: 'get',
    params: parameter
  })
}

export function saveOrUpdatePersonnelLeaveApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personLeaveApply/saveOrUpdatePersonnelLeaveApply',
    method: 'post',
    data: parameter
  })
}

//上传离职相关文档

export function uploadDocPersonnelLeaveApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/personLeaveApply/uploadDoc',
    method: 'post',
    data: parameter
  })
}


//----------------------离职申请END

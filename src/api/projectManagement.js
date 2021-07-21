import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

// eslint-disable-next-line no-unused-vars
//  项目管理
const api = {

  pageDevelopmentCraftDevRecoveApply: '/project/development-project-patent-apply/pageDevelopmentCraftDevRecoveApply',
  pageDevelopmentCraftSave: '/project/development-project-patent-apply/save',
  listProjectAllInfoDropDown: '/project/development-project-all-info/listProjectAllInfoDropDown',
  listProjectgetDetail: '/project/development-project-patent-apply/getDetail',
  listProjectgetDelete: '/project/development-project-patent-apply/delete',
  acceptDevelopmentProjectPatentApply: '/project/development-project-patent-apply/acceptDevelopmentProjectPatentApply',
  finishDevelopmentProjectPatentApply: '/project/development-project-patent-apply/finishDevelopmentProjectPatentApply',
  patentUploadDevelopmentProjectPatentApply: '/project/development-project-patent-apply/patentUploadDevelopmentProjectPatentApply',
  pageDevelopmentProjectCheckApply: '/project/development-project-check-apply/pageDevelopmentProjectCheckApply',
  pageDevelopmentSave: '/project/development-project-check-apply/save',
  pageDevelopmentgetDetail: '/project/development-project-check-apply/getDetail',
  pageDevelopmentgetDelete: '/project/development-project-check-apply/delete',
  acceptDevelopmentProjectCheckApply: '/project/development-project-check-apply/acceptDevelopmentProjectCheckApply',
  finishDevelopmentProjectCheckApply: '/project/development-project-check-apply/finishDevelopmentProjectCheckApply',
  managementUploadDevelopmentProjectCheckApply: '/project/development-project-check-apply/managementUploadDevelopmentProjectCheckApply',
  managementUpdate: '/project/development-project-check-apply/update',
  listMyProjectAllInfo: '/project/development-project-all-info/listMyProjectAllInfo',
  getDealChooseStageDetailWithAll: '/project/development-project-all-info/getDealChooseStageDetailWithAll',
  saveAndUpdate: '/project/development-project-design-review/saveAndUpdate',
  pageList: '/project/development-project-process-record/pageList',
  withDrawProjectStageApply: '/project/development-project-all-info/withDrawProjectStageApply',
  removeProjectStageApply: '/project/development-project-all-info/removeProjectStageApply',
  getApproveChooseStageDetail: '/project/development-project-all-info/getApproveChooseStageDetailWithAll',
  approveProjectStageApply: '/project/development-project-all-info/approveProjectStageApply',
  getDealEveryChooseStageDetail: '/project/development-project-all-info/getDealEveryChooseStageDetail',
  getDealEverySaveTrial: '/project/development-project-product-trial/saveTrial',
  savaAndUpdate: '/project/development-project-feasibility-test/savaAndUpdate',
  savaExportExcel: '/project/development-project-feasibility-test-result/exportExcel',
  updateTestesult: '/project/development-project-feasibility-test/updateTestesult',
  reviewSaveAndUpdate: '/project/development-project-feasibility-test-review/saveAndUpdate',
  stabilitySaveAndUpdate: '/project/development-project-stability-test/saveAndUpdate',
  stabilityupdateTestesult: '/project/development-project-stability-test/updateTestesult',
  getMeetingRecordDetail: '/project/development-project-all-info/getMeetingRecordDetail',
  stabilityReviewSaveAndUpate: '/project/development-project-stability-test-review/saveAndUpate',
  confPlanReview: '/confPlanReview',
  getCraftTask: '/craftDevelopment/getCraftTask',
  craftDevelopment: '/craftDevelopment',
  startTraining: '/craftSnapMeetingHis/startTraining',
  finishTraining: '/craftSnapMeetingHis/finishTraining',
  smallBatch: '/smallBatch',
  smallBatchReview: '/smallBatchReview',
  sampleShow: '/sampleShow',
  getPlan: '/smallBatch/getPlan',
  batch: '/batch',
  fileDesignDivConf: '/fileDesignDivConf',
  submitToAudit: '/fileDesignDivConf/submitToAudit',
  submitTolist: '/designFileMeetingHis/list',
  startTrainings: '/fileDesignDivConf/startTraining',
  finishTrainings: '/fileDesignDivConf/finishTraining',
  getProjectStageProcessDetail: '/project/development-project-stage-join/getProjectStageProcessDetail',
  developmentSaveAndUpdate: '/project/development-project-conf-plan-model-task/saveAndUpdate',
  findApprovedNodeList: '/common/findApprovedNodeList',







}



//获取审批实例列表
export function findApprovedNodeList(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.findApprovedNodeList,
    method: 'get',
    params: parameter
  })
}
/*新增修改配置方案研发*/
export function developmentSaveAndUpdate(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.developmentSaveAndUpdate,
    method: 'post',
    data: parameter
  })
}

/*
项目进程*/
export function getProjectStageProcessDetail(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.getProjectStageProcessDetail,
    method: 'get',
    params: parameter
  })
}

/*
结束培训*/
export function finishTrainings(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.finishTrainings,
    method: 'post',
    data: parameter
  })
}


/*
发起培训*/
export function startTrainings(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.startTrainings,
    method: 'post',
    data: parameter
  })
}

/*
获取培训记录*/
export function submitTolist(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.submitTolist,
    method: 'get',
    params: parameter
  })
}


/*
上传设计模块*/
export function submitToAudit(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.submitToAudit,
    method: 'post',
    data: parameter
  })
}


/** 配货站信息删除接口 */
export function fileDesignDivConfDelete(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.fileDesignDivConf,
    method: 'delete',
    params: parameter

  })
}

/*
上传设计模块*/
export function fileDesignDivConf(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.fileDesignDivConf,
    method: 'post',
    data: parameter
  })
}
/*
完结*/
export function batch(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.batch,
    method: 'post',
    data: parameter
  })
}
/*
获取生产计划相关内容*/
export function getPlan(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.getPlan,
    method: 'get',
    params: parameter
  })
}
/*
样品展示*/
export function sampleShow(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.sampleShow,
    method: 'post',
    data: parameter
  })
}

/*
小批量生产评审新增*/
export function smallBatchReview(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.smallBatchReview,
    method: 'post',
    data: parameter
  })
}
/*
小批量接口新增*/
export function smallBatch(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.smallBatch,
    method: 'post',
    data: parameter
  })
}
/*
结束培训*/
export function finishTraining(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.finishTraining,
    method: 'post',
    data: parameter
  })
}

/*
发起培训*/
export function startTraining(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.startTraining,
    method: 'post',
    data: parameter
  })
}


/*
工艺研发新增修改*/
export function craftDevelopment(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.craftDevelopment,
    method: 'post',
    data: parameter
  })
}

/*
获取工艺任务单*/
export function getCraftTask(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.getCraftTask,
    method: 'get',
    params: parameter
  })
}
/*
配置方案研发评审新增修改*/
export function confPlanReview(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.confPlanReview,
    method: 'post',
    data: parameter
  })
}
/*
稳定性测试结果评审新增修改*/
export function stabilityReviewSaveAndUpate(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.stabilityReviewSaveAndUpate,
    method: 'post',
    data: parameter
  })
}
/*
会议详情*/
export function getMeetingRecordDetail(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.getMeetingRecordDetail,
    method: 'get',
    params: parameter
  })
}

/*
稳定性测试结果*/
export function stabilityupdateTestesult(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.stabilityupdateTestesult,
    method: 'post',
    data: parameter
  })
}
/*
稳定性测试新增修改*/
export function stabilitySaveAndUpdate(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.stabilitySaveAndUpdate,
    method: 'post',
    data: parameter
  })
}
/*
可行性测试结果评审*/
export function reviewSaveAndUpdate(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.reviewSaveAndUpdate,
    method: 'post',
    data: parameter
  })
}
/*
可行性测试结果*/
export function updateTestesult(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.updateTestesult,
    method: 'post',
    data: parameter
  })
}
/**下载测试报告*/
export function savaExportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.savaExportExcel,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}
/*
可行性新增或修改*/
export function savaAndUpdate(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.savaAndUpdate,
    method: 'post',
    data: parameter
  })
}


/*
新增产品试制*/
export function getDealEverySaveTrial(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.getDealEverySaveTrial,
    method: 'post',
    data: parameter
  })
}
/*
通过项目id查询单个阶段的详情信息(显示按钮)*/
export function getDealEveryChooseStageDetail(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.getDealEveryChooseStageDetail,
    method: 'get',
    params: parameter
  })
}
/*
审批各个阶段的提交(通过和不通过按钮)*/
export function approveProjectStageApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.approveProjectStageApply,
    method: 'post',
    data: parameter
  })
}
/*
通过项目id查询各个阶段的详情信息(审批按钮)*/
export function getApproveChooseStageDetail(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.getApproveChooseStageDetail,
    method: 'get',
    params: parameter
  })
}
/*
删除各个阶段的提交(删除按钮)*/
export function removeProjectStageApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.removeProjectStageApply,
    method: 'post',
    data: parameter
  })
}

/*
撤回各个阶段的提交(撤回按钮)*/
export function withDrawProjectStageApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.withDrawProjectStageApply,
    method: 'post',
    data: parameter
  })
}

/*
新增和修改设计方案联合评审*/
export function saveAndUpdate(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.saveAndUpdate,
    method: 'post',
    data: parameter
  })
}
/*
我的项目处理详情*/
export function getDealChooseStageDetailWithAll(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.getDealChooseStageDetailWithAll,
    method: 'get',
    params: parameter
  })
}
/*
我的项目列表*/
export function listMyProjectAllInfo(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.listMyProjectAllInfo,
    method: 'get',
    params: parameter
  })
}
/*
项目审核列表*/
export function pageList(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageList,
    method: 'get',
    params: parameter
  })
}
/*
检验报告修改*/
export function managementUpdate(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.managementUpdate,
    method: 'post',
    data: parameter
  })
}
/*
检验报告上传*/
export function managementUploadDevelopmentProjectCheckApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.managementUploadDevelopmentProjectCheckApply,
    method: 'post',
    data: parameter
  })
}

/*
检验报告完结*/
export function finishDevelopmentProjectCheckApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.finishDevelopmentProjectCheckApply,
    method: 'get',
    params: parameter
  })
}
/*
检验报告接受*/
export function acceptDevelopmentProjectCheckApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.acceptDevelopmentProjectCheckApply,
    method: 'get',
    params: parameter
  })
}

/*
检验报告删除*/
export function pageDevelopmentgetDelete(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentgetDelete,
    method: 'get',
    params: parameter
  })
}

/*
检验报告详情*/
export function pageDevelopmentgetDetail(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentgetDetail,
    method: 'get',
    params: parameter
  })
}
/*
检验报告新增*/
export function pageDevelopmentSave(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentSave,
    method: 'post',
    data: parameter
  })
}

/*
检验报告*/
export function pageDevelopmentProjectCheckApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentProjectCheckApply,
    method: 'get',
    params: parameter
  })
}

/*
项目专利上传*/
export function patentUploadDevelopmentProjectPatentApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.patentUploadDevelopmentProjectPatentApply,
    method: 'post',
    data: parameter
  })
}

/*
项目专利申请完结*/
export function finishDevelopmentProjectPatentApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.finishDevelopmentProjectPatentApply,
    method: 'get',
    params: parameter
  })
}

/*
项目专利申请接受*/
export function acceptDevelopmentProjectPatentApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.acceptDevelopmentProjectPatentApply,
    method: 'get',
    params: parameter
  })
}
/*
项目专利申请删除*/
export function listProjectgetDelete(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.listProjectgetDelete,
    method: 'get',
    params: parameter
  })
}
/*
项目专利申请详情*/
export function listProjectgetDetail(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.listProjectgetDetail,
    method: 'get',
    params: parameter
  })
}
/*
分页查询项目专利申请*/
export function pageDevelopmentCraftDevRecoveApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentCraftDevRecoveApply,
    method: 'get',
    params: parameter
  })
}
/*
新增项目专利申请*/
export function pageDevelopmentCraftSave(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentCraftSave,
    method: 'post',
    data: parameter
  })
}
/* 申请立项项目*/
export function listProjectAllInfoDropDown(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.listProjectAllInfoDropDown,
    method: 'get',
    params: parameter
  })
}

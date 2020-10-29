import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//---------------------奖金模块-----------------------
/**研发列表接口 */
export function oaSalaryInfo_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-percentage-rule/page',
    method: 'get',
    params: parameter
  })
}
//验证重复产品
export function oaSalaryIsSalary(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-percentage-rule/isSalaryBounsPercentageRule',
    method: 'post',
    data: parameter
  })
}

// 工资条下载 

// export function getExportList(parameter) {
//   return axios({
//     baseURL: system.baseURL,
//     url: 'oaSalaryInfo/oa-salary-month-detail/exportSalaryExcel',
//     method: 'get',
//     responseType: 'blob',
//     params: parameter
//   })
// }




/**研发新增接口 */
export function oaSalaryInfo_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-percentage-rule/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**详情接口 */
export function oaSalaryInfo_getId(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-percentage-rule/getId',
    method: 'get',
    params: parameter
  })
}

/**研发删除接口 */
export function oaSalaryInfo_delete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-percentage-rule/delete',
    method: 'post',
    data: parameter
  })
}

/**加班列表接口 */
export function overwork_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-overwork-rule/list',
    method: 'get',
    params: parameter
  })
}

/**加班新增接口 */
export function overwork_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-overwork-rule/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**加班删除接口 */
export function overwork_delete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-overwork-rule/delete',
    method: 'post',
    data: parameter
  })
}
/**全勤列表接口 */
export function attendance_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-all-work/list',
    method: 'get',
    params: parameter
  })
}
/**全勤新增接口 */
export function attendance_add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-all-work/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**全勤删除接口 */
export function attendance_delete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-all-work/delete',
    method: 'post',
    data: parameter
  })
}

// 年终奖金列表接口

export function year_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bonus-annual/page',
    method: 'get',
    params: parameter
  })
}

//查询本年数据 
export function year_bonus_annua(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bonus-annual/list',
    method: 'get',
    params: parameter
  })
}


// 查询发放规则列表
export function year_send_rule(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-annul-send-rule/list',
    method: 'get',
    params: parameter
  })
}

//发放新增规则
export function year_delete_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-annul-send-rule/addAndUpdate',
    method: 'post',
    data: parameter
  })
}

//终极奖金规则
export function year_annual_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bonus-annual/addAndUpdate',
    method: 'post',
    data: parameter
  })
}

//年终详情
export function year_send_getId(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bonus-annual/getId',
    method: 'get',
    params: parameter
  })
}

//年终撤回 
export function year_send_annual(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bonus-annual/withdraw',
    method: 'get',
    params: parameter
  })
}
//年终删除
export function year_annual_addAnddel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bonus-annual/del',
    method: 'post',
    data: parameter
  })
}

//年终审核
export function year_annual_approval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bonus-annual/approval',
    method: 'post',
    data: parameter
  })
}
//其他奖金列表
export function other_add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-other/page',
    method: 'get',
    params: parameter
  })
}
//其他奖金新增 
export function other_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-other/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
//其他奖金撤回
export function other_withdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-other/withdraw',
    method: 'get',
    params: parameter
  })
}
//其他奖金删除
export function other_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-other/del',
    method: 'post',
    data: parameter
  })
}
//其他奖金审批 
export function other_approval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-other/approval',
    method: 'post',
    data: parameter
  })
}

//餐费扣款规则
export function capital_Meals_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-fine-charge-back-rule/list',
    method: 'get',
    params: parameter
  })
}
//餐费扣款规则新增修改
export function capital_Meals_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-fine-charge-back-rule/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
//餐费扣款规则删除
export function capital_Meals_delete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-fine-charge-back-rule/delete',
    method: 'post',
    data: parameter
  })
}

//罚款单列表
export function capital_bill_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-fine-apply/page',
    method: 'get',
    params: parameter
  })
}

//罚款单销毁

export function capital_destruction(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-fine-apply/destruction',
    method: 'get',
    params: parameter
  })
}



//自动生成编码
export function capital_bill_logisticsNum(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-fine-apply/logisticsNum',
    method: 'get',
    params: parameter
  })
}



//罚款单新增
export function capital_bill_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-fine-apply/addAndUpdate ',
    method: 'post',
    data: parameter
  })
}

//罚款单撤回
export function capital_bill_withdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-fine-apply/withdraw',
    method: 'get',
    params: parameter
  })
}

//罚款单删除 
export function capital_bill_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-fine-apply/del ',
    method: 'post',
    data: parameter
  })
}
//罚款单审批

export function capital_bill_approval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-fine-apply/approval',
    method: 'post',
    data: parameter
  })
}

// 基本工资表 


export function salary_base_record_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-base-common/pageList',
    method: 'get',
    params: parameter
  })
}


//基本工资表导入
export function salary_base_record_ImportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-base-common/importExcel',
    method: 'post',
    data: parameter
  })
}

//销售基本工资列表

export function salary_base_sale_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-base-saler/pageList',
    method: 'get',
    params: parameter
  })
}


//添加销售规则明细
export function salary_sale_saveOrUpdateSalerRule(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-base-saler-rule/saveOrUpdateSalerRule',
    method: 'post',
    data: parameter
  })
}

// 销售明细列表
export function salary_listSalerRule(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-base-saler-rule/listSalerRule',
    method: 'get',
    params: parameter
  })
}

//销售人员
export function salary_getUserByType(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'department/getUserByType',
    method: 'get',
    params: parameter
  })
}

//销售基本工资新增
export function salary_Sale_SaveOrUpdateSalaryBaseSaler(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-base-saler/saveOrUpdateSalaryBaseSaler',
    method: 'post',
    data: parameter
  })
}

// 销售基本工资删除
export function salary_Sale_RemoveSalaryBaseSaler(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-base-saler/removeSalaryBaseSaler',
    method: 'post',
    data: parameter
  })
}

// 销售基本工资规则明细删除
export function salary_Sale_RemoveSalerRule(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-base-saler-rule/removeSalerRule',
    method: 'post',
    data: parameter
  })
}

//部门列表
export function bonus_getDepartmentByType(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'department/getDepartmentByType',
    method: 'get',
    params: parameter
  })
}

// 研发提成列表接口
export function bonus_pageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-developert-percentage-apply/pageList',
    method: 'get',
    params: parameter
  })
}


//验证接口是否能新增 
export function bonus_checkDeveloperPercentApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-developert-percentage-apply/checkDeveloperPercentApply',
    method: 'post',
    data: parameter
  })
}

//研发提成新增

export function bonus_PercentageApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-developert-percentage-apply/SaveOrUpdateOaSalaryDeveloperPercentageApply',
    method: 'post',
    data: parameter
  })
}
//研发提成撤回
export function bonus_withdrawDeveloper(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-developert-percentage-apply/withdrawDeveloperSalerPercentageApply',
    method: 'post',
    data: parameter
  })
}

//研发提成撤回
export function bonus_removeDeveloper(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-developert-percentage-apply/removeDeveloperSalerPercentageApply',
    method: 'post',
    data: parameter
  })
}
//研发提成审批
export function bonus_DeveloperPercentageApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-developert-percentage-apply/approvalOaSalaryDeveloperPercentageApply',
    method: 'post',
    data: parameter
  })
}
// 研发提成详情 
export function bonus_PercentageDetailt(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-developert-percentage-apply/getDeveloperSalerPercentageDetail',
    method: 'get',
    params: parameter
  })
}


//销售提成列表 
export function sale_PercentageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-saler-percentage-apply/pageList',
    method: 'get',
    params: parameter
  })
}

//销售提成详情
export function sale_PercentageDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-saler-percentage-apply/getSalarySalerPercentageDetail',
    method: 'get',
    params: parameter
  })
}


//销售提成详情
export function sale_checkSalerPercentApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-saler-percentage-apply/checkSalerPercentApply',
    method: 'post',
    data: parameter
  })
}

//销售提成撤回
export function sale_Withdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-saler-percentage-apply/withdrawSalarySalerPercentageApply',
    method: 'post',
    data: parameter
  })
}

//销售提成审核
export function sale_ApprovalSalary(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-saler-percentage-apply/approvalSalarySalerPercentageApply',
    method: 'post',
    data: parameter
  })
}


//销售提成删除 
export function sale_Remove(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-saler-percentage-apply/removeSalarySalerPercentageApply',
    method: 'post',
    data: parameter
  })
}

//销售提成经理人员 
export function sale_ByDepId(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salesman/getSaleAssistantByDepId',
    method: 'get',
    params: parameter
  })
}

//销售提成新增修改 

export function sale_add(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-saler-percentage-apply/SaveOrUpdateOaSalarySalerPercentageApply',
    method: 'post',
    data: parameter
  })
}
// 销售岗位 

export function getSaleStation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salesman/getSaleStation',
    method: 'get',
    params: parameter
  })
}
//销汇总查询 
export function sale_SalerMonthCollectDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-saler-month-collect/getSalarySalerMonthCollectDetail',
    method: 'get',
    params: parameter
  })
}
// 工资条列表
export function wages_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryMonthInstance/oa-salary-month-instance/pageList',
    method: 'get',
    params: parameter
  })
}

//工资条字典数据 
export function wages_ListDic(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-month-bouns-detail/listDic',
    method: 'get',
    params: parameter
  })
}
//工资条详情数据 
export function wages_Detail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-month-detail/pageList',
    method: 'get',
    params: parameter
  })
}


//工资条审核
export function wages_instance(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryMonthInstance/oa-salary-month-instance/approvalSalaryMonthInstanceApply',
    method: 'post',
    data: parameter
  })
}

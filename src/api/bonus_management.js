import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

//销售部收款分析表
export function receiptAnalyse_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/receiptAnalyse/sale-receipt-analyse/getListPage',
    method: 'get',
    params: parameter
  })
}
//根据搜索条件获取汇总金额
export function receiptAnalyse_getSumAmount(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/receiptAnalyse/sale-receipt-analyse/getSumAmount',
    method: 'get',
    params: parameter
  })
}






//软硬件提成奖金列表 
export function softHardPercentageBonus_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/softHardPercentageBonus/soft-hard-percentage-bonus/softHardPercentageBonusPageList',
    method: 'get',
    params: parameter
  })
}
//软硬件提成奖金下载
export function softHardPercentageBonus_exportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/softHardPercentageBonus/soft-hard-percentage-bonus/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}
export function softHardPercentageBonus_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/softHardPercentageBonus/soft-hard-percentage-bonus/delSoftHardPercentageBonus',
    method: 'get',
    params: parameter
  })
}

//软硬件提成奖金详情 
export function softHardPercentageBonus_Detail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/softHardPercentageBonus/soft-hard-percentage-bonus/softHardPercentageBonusDetail',
    method: 'get',
    params: parameter
  })
}
//软硬件提成奖金审批 
export function softHardPercentageBonus_Apply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/softHardPercentageBonus/soft-hard-percentage-bonus/approveSoftHardPercentageBonus',
    method: 'post',
    data: parameter
  })
}






// 软件/硬件提成规则列表
export function softHard_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/softHardPercentageRule/soft-hard-percentage-rule/getListPage',
    method: 'get',
    params: parameter
  })
}
// 软件/硬件提成规则新增修改
export function softHard_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/softHardPercentageRule/soft-hard-percentage-rule/addAndUpdateSoftHardPercentageRule',
    method: 'post',
    data: parameter
  })
}
// 软件/硬件提成规则列表
export function softHard_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/softHardPercentageRule/soft-hard-percentage-rule/delSoftHardPercentageRule',
    method: 'get',
    params: parameter
  })
}




// 高级工程师补贴列表
export function engineer_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-senior-engineer-subsidy/page',
    method: 'get',
    params: parameter
  })
}
//高级工程师补贴修改
export function enginee_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-senior-engineer-subsidy/addAndUpdate',
    method: 'post',
    data: parameter
  })
}

//高级工程是补贴删除
export function engineer_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-senior-engineer-subsidy/del',
    method: 'get',
    params: parameter
  })
}


// 提成规则模块
export function researchs_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-development-percentage-rule/page',
    method: 'get',
    params: parameter
  })
}

//提成规则模块新增
export function researchs_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-development-percentage-rule/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
//提成规则模块删除
export function researchs_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-development-percentage-rule/del',
    method: 'get',
    params: parameter
  })
}
//查询智能产品提成
export function getSalaryIntelligent(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-development-intelligent-products-commission/getSalaryIntelligentProductsCommission',
    method: 'get',
    params: parameter
  })
}

// 新增修改智能产品提成
export function getSalaryIntelligent_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-development-intelligent-products-commission/addAndUpdate',
    method: 'post',
    data: parameter
  })
}














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

export function getExportList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-month-detail/exportSalaryExcel',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

//销售提成下载 
export function getSalerPercentageExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-saler-percentage-apply/exportSalerPercentageExcel',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}




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
    responseType: 'blob',
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
    url: '/bounsRules/salary-development-percentage-rule-apply/pageList',
    method: 'get',
    params: parameter
  })
}
//研发提成奖金下载
export function bounsRules_exportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-development-percentage-rule-apply/excel',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

export function bounsRules_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-development-percentage-rule-apply/del',
    method: 'get',
    params: parameter
  })
}


//研发提成审批
export function bonus_DeveloperPercentageApply(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-development-percentage-rule-apply/approve',
    method: 'post',
    data: parameter
  })
}
// 研发提成详情 
export function bonus_PercentageDetailt(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/bounsRules/salary-development-percentage-rule-apply/getId',
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

//工资条批量审批 

export function wages_approcal(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryMonthInstance/oa-salary-month-instance/approvalList',
    method: 'post',
    data: parameter
  })
}
// 工资条批量删除

export function wages_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryMonthInstance/oa-salary-month-instance/delList',
    method: 'post',
    data: parameter
  })
}

//工资条详情数据 
export function wages_Detail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-month-detail/getOaSalaryMonthDetai',
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
//工资条导出
export function wages_ImportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-month-detail/exportSalaryExcel',
    method: 'get',
    responseType: 'blob',
    data: parameter
  })
}
//薪资核算列表
export function floorsAnnual_List(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/floorsAnnual/floors-annual-account/page',
    method: 'get',
    params: parameter
  })
}
//薪资核算批量审批 

export function floorsAnnual_approcal(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/floorsAnnual/floors-annual-account/approveList',
    method: 'post',
    data: parameter
  })
}
// 薪资核算批量删除
export function floorsAnnual_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/floorsAnnual/floors-annual-account/delList',
    method: 'post',
    data: parameter
  })
}
//薪资核算导出
export function floorsAnnual_ImportExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/floorsAnnual/floors-annual-account/exportSalaryExcel',
    method: 'get',
    responseType: 'blob',
    data: parameter
  })
}
// 核算详情
export function floorsAnnual_Detail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/floorsAnnual/floors-annual-account/getDetail',
    method: 'get',
    params: parameter
  })
}
//工资条审核
export function floorsAnnual_instance(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/floorsAnnual/floors-annual-account/approve',
    method: 'post',
    data: parameter
  })
}

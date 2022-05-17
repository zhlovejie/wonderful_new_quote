import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

const materialBaseUrl = system.materialBaseUrl



/** 供应商报价新增修改  */
export function getSupplierOfferUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/manageSupplierOffer/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}

/** 供应商报价详情  */
export function getSupplierOffer(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/manageSupplierOffer/getDetail',
    method: 'get',
    params: parameter
  })
}


//质保期交货期
export function DeliveryApproval(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeWarrantyDelivery/approval',
    method: 'post',
    data: parameter
  })
}
//裸价标准审批
export function NakedPriceApproval(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeNakedPrice/approval',
    method: 'post',
    data: parameter
  })
}
//物料税率
export function TaxRateApproval(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeTaxRate/approval',
    method: 'post',
    data: parameter
  })
}
//最大采购量审批
export function MaxPurchaseApproval(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeMaxPurchase/approval',
    method: 'post',
    data: parameter
  })
}
//品牌审批
export function BrandApproval(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeBrand/approval',
    method: 'post',
    data: parameter
  })
}
//发票审批
export function InvoiceApproval(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeInvoice/approval',
    method: 'post',
    data: parameter
  })
}
//包装审批
export function PackApproval(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changePack/approval',
    method: 'post',
    data: parameter
  })
}
//供应商审批
export function SupplierApproval(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeSupplier/approval',
    method: 'post',
    data: parameter
  })
}

/** 质保期详情  */
export function getDetailDelivery(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeWarrantyDelivery/getDetail',
    method: 'get',
    params: parameter
  })
}
/** 裸价标准详情  */
export function getDetailNakedPrice(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeNakedPrice/getDetail',
    method: 'get',
    params: parameter
  })
}

/** 最大采购量  */
export function getDetailMaxPurchase(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeMaxPurchase/getDetail',
    method: 'get',
    params: parameter
  })
}
/** 税率详情*/
export function getDetailTaxRate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeTaxRate/getDetail',
    method: 'get',
    params: parameter
  })
}
/** 发票类型详情*/
export function getDetailInvoice(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeInvoice/getDetail',
    method: 'get',
    params: parameter
  })
}
/** 包装方式详情*/
export function getDetailPack(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changePack/getDetail',
    method: 'get',
    params: parameter
  })
}
/** 品牌详情*/
export function getDetailBrand(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeBrand/getDetail',
    method: 'get',
    params: parameter
  })
}

/** 供应商详情*/
export function getDetailSupplier(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeSupplier/getDetail',
    method: 'get',
    params: parameter
  })
}


/** 变更 审批列表*/
export function getchange(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/change/page',
    method: 'get',
    params: parameter
  })
}
/** 变更批量审批*/
export function approvalChange(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/change/approval',
    method: 'post',
    data: parameter
  })
}



/**质保 变更历史 */
export function getDelivery(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeWarrantyDelivery/page',
    method: 'get',
    params: parameter
  })
}
/**裸价价格变更历史 */
export function getNakedPrice(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeNakedPrice/page',
    method: 'get',
    params: parameter
  })
}
/**最大采购变更历史 */
export function getMaxPurchase(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeMaxPurchase/page',
    method: 'get',
    params: parameter
  })
}
/**税率变更历史 */
export function getTaxRate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeTaxRate/page',
    method: 'get',
    params: parameter
  })
}
/**发票类型变更历史 */
export function getInvoice(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeInvoice/page',
    method: 'get',
    params: parameter
  })
}
/**品牌变更历史 */
export function getBrand(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeBrand/page',
    method: 'get',
    params: parameter
  })
}
/**包装方式变更历史 */
export function getPack(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changePack/page',
    method: 'get',
    params: parameter
  })
}
/**供应商变更历史 */
export function getSupplier(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeSupplier/page',
    method: 'get',
    params: parameter
  })
}

//品牌型号新增和修改
export function BrandUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeBrand/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
//品牌型号新增和修改
export function MaxPurchaseUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeMaxPurchase/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}

//税率新增和修改
export function DeliveryUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeWarrantyDelivery/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
//税率新增和修改
export function TaxRateUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeTaxRate/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
//发票类型新增和修改
export function InvoiceUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeInvoice/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
//裸价标准新增和修改
export function NakedUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeNakedPrice/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}



//包装方式新增和修改
export function changePackUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changePack/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
//供应商新增和修改
export function SupplierUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/changeSupplier/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**根据物料查询采购要求 */
export function getBuyRequirement(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/buyRequirement/getBuyRequirement',
    method: 'get',
    params: parameter
  })
}
//新增和修改
export function listManageSaveAndUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/buyRequirement/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**供应商型号 */
export function listManageBrandModel(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/manageSupplier/listManageBrandModel',
    method: 'get',
    params: parameter
  })
}
/**供应商品牌 */
export function listManageBrand(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/manageSupplier/listManageBrand',
    method: 'get',
    params: parameter
  })
}
/**供应商列表 */
export function listManageSupplier(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/manageSupplier/listManageSupplier',
    method: 'get',
    params: parameter
  })
}
// 常规物料规则----------------------------------------
/**新增常规物料规则接口 */
export function routineMaterialRuleAdd(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule',
    method: 'POST',
    data: parameter
  })
}

/**修改常规物料规则接口 */
export function routineMaterialRuleUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule',
    method: 'PUT',
    data: parameter
  })
}

/**删除常规物料规则接口 */
export function routineMaterialRuleDelete(parameter) {
  let url = parameter.split('=')[1].split(',').map(s => `ids=${s}`).join('&')
  return axios({
    baseURL: materialBaseUrl,
    url: `/routineMaterialRule?${url}`,
    method: 'DELETE'
  })
}

/**反审核常规物料规则接口 ，权限码：routineMaterialRule:annulAudit*/
export function routineMaterialRuleAnnulAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/annulAudit',
    method: 'PUT',
    data: parameter
  })
}

/**审核常规物料规则接口 */
export function routineMaterialRuleAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/audit',
    method: 'PUT',
    data: parameter
  })
}

/**禁用常规物料规则接口 */
export function routineMaterialRuleForbidden(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/forbidden',
    method: 'PUT',
    data: parameter
  })
}

/**启用 常规物料规则接口 */
export function routineMaterialRuleStartUsing(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/startUsing',
    method: 'PUT',
    data: parameter
  })
}

/**列表 常规物料规则接口 */
export function routineMaterialRulePageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/list',
    method: 'get',
    params: parameter
  })
}

/**树形列表 常规物料规则接口 */
export function routineMaterialRulePageTreeList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/treeList',
    method: 'get',
    params: parameter
  })
}

export function routineMaterialRulePageTwoTierTreeList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/twoTierTreeList',
    method: 'get',
    params: parameter
  })
}

//常规物料规则 条件查询树
export function routineMaterialRulePageConditionTreeList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/conditionTreeList',
    method: 'get',
    params: parameter
  })
}

//成品物料规则 条件查询树
export function productMaterialRulePageConditionTreeList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialRule/conditionTreeList',
    method: 'get',
    params: parameter
  })
}

/**
 * 常规物料库 新增  规格型号 分页接口
 * @param {*} parameter
 * @returns
 */
export function routineMaterialRuleSpecificationsPagerTreeList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/pageTierTreeList',
    method: 'get',
    params: parameter
  })
}

/**规格代码变更历史记录查询 */
export function codeChangeLogPageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/material/routine-code-change-his/listCodeChangeHis',
    method: 'get',
    params: parameter
  })
}

// 成品物料规则--------------------------


/**新增成品物料规则接口 */
export function productMaterialRuleAdd(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialRule',
    method: 'POST',
    data: parameter
  })
}

/**修改成品物料规则接口 */
export function productMaterialRuleUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialRule',
    method: 'PUT',
    data: parameter
  })
}

/**删除成品物料规则接口 */
export function productMaterialRuleDelete(parameter) {
  let url = parameter.split('=')[1].split(',').map(s => `ids=${s}`).join('&')
  return axios({
    baseURL: materialBaseUrl,
    url: `/productMaterialRule?${url}`,
    method: 'DELETE'
  })
}

/**反审核成品物料规则接口 ，权限码：routineMaterialRule:annulAudit*/
export function productMaterialRuleAnnulAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialRule/annulAudit',
    method: 'PUT',
    data: parameter
  })
}

/**审核成品物料规则接口 */
export function productMaterialRuleAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialRule/audit',
    method: 'PUT',
    data: parameter
  })
}

/**禁用成品物料规则接口 */
export function productMaterialRuleForbidden(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialRule/forbidden',
    method: 'PUT',
    data: parameter
  })
}

/**启用 成品物料规则接口 */
export function productMaterialRuleStartUsing(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialRule/startUsing',
    method: 'PUT',
    data: parameter
  })
}

/**列表 成品物料规则接口 */
export function productMaterialRulePageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialRule/list',
    method: 'GET',
    params: parameter
  })
}

/**树形列表 成品物料规则接口 */
export function productMaterialRulePageTreeList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialRule/treeList',
    method: 'GET',
    params: parameter
  })
}

/**树形列表 成品物料规则接口 */
export function productMaterialRulePageTwoTierTreeList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialRule/twoTierTreeList',
    method: 'GET',
    params: parameter
  })
}


/**审核 物料规则审核接口 */
export function materialRuleAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/materialRuleAudit/audit',
    method: 'POST',
    data: parameter
  })
}

/**批量审核为通过 物料规则审核接口 */
export function materialRuleAuditBatch(parameter) {
  let url = parameter.split('=')[1].split(',').map(s => `ids=${s}`).join('&')
  return axios({
    baseURL: materialBaseUrl,
    url: `/materialRuleAudit/auditBatch?${url}`,
    method: 'POST'
  })
}

/**审核列表 物料规则审核接口 */
export function materialRuleAuditPageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/materialRuleAudit/pageList',
    method: 'GET',
    params: parameter
  })
}

/** 常规物料规则 复制接口 */
export function routineMaterialRuleCopy(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/copy',
    method: 'PUT',
    data: parameter
  })
}

/**迁移数据的节点 */
export function materialRuleTransferSeat(parameter) {
  let params = []
  params.push(`transferSeatId=${parameter.transferSeatId}`)
  parameter.ids.map(id => {
    params.push(`ids=${id}`)
  })
  let p = params.join('&')
  return axios({
    baseURL: materialBaseUrl,
    url: `/routineMaterialRule/transferSeat?${p}`,
    method: 'GET'
  })
}


/**--------------资料库--------------- */
/**常规物料 基本数据接口 */
export function routineMaterialInfo(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo',
    method: 'GET',
    params: parameter
  })
}
/**常规物料新增 基本数据接口 */
export function routineMaterialInfoAdd(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo',
    method: 'POST',
    data: parameter
  })
}
/**常规物料修改 基本数据接口 */
export function routineMaterialInfoUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo',
    method: 'PUT',
    data: parameter
  })
}
/**常规物料删除 基本数据接口 */
export function routineMaterialInfoDelete(parameter) {
  let url = parameter.split('=')[1].split(',').map(s => `ids=${s}`).join('&')
  return axios({
    baseURL: materialBaseUrl,
    url: `/routineMaterialInfo?${url}`,
    method: 'DELETE'
  })
}
/**反审核，权限码：routineMaterial:annulAudit*/
export function routineMaterialInfoAnnulAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/annulAudit',
    method: 'PUT',
    data: parameter
  })
}
/**提交审核 */
export function routineMaterialInfoAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/audit',
    method: 'PUT',
    data: parameter
  })
}
/**
 * @description 判断是否有重复的物料代码，有返回true，没有返回false
 * @param materialCode
 */
export function routineMaterialInfoCheckCode(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/checkCode',
    method: 'GET',
    params: parameter
  })
}
/**
 * @description 判断是否有重复的物料名称，有返回true，没有返回false
 * @param materialName 物料名称
 * @param ruleId 物料规则id
 * @param id  物料id
 */
export function routineMaterialInfoCheckName(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/checkName',
    method: 'GET',
    params: parameter
  })
}
/**
 * @description 根据所选列表导出
 * @param ids 所选的物料id
 */
export function routineMaterialInfoExportList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: `/routineMaterialInfo/exportList?${parameter}`,
    method: 'GET'
  })
}
/**禁用 */
export function routineMaterialInfoForbidden(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/forbidden',
    method: 'PUT',
    data: parameter
  })
}
/**启用 */
export function routineMaterialInfoStartUsing(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/startUsing',
    method: 'PUT',
    data: parameter
  })
}
/**列表  */
export function routineMaterialInfoList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/list',
    method: 'GET',
    params: parameter
  })
}
/**列表  */
export function routineMaterialInfoPageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/pageList',
    method: 'GET',
    params: parameter
  })
}
/**树形列表  */
export function routineMaterialInfoTwoTierTreeList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/twoTierTreeList',
    method: 'GET',
    params: parameter
  })
}
/**附件接口 */
export function routineMaterialAccessory(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialAccessory/list',
    method: 'GET',
    params: parameter
  })
}

export function routineMaterialAccessoryDelete(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: `/routineMaterialAccessory`,
    method: 'DELETE',
    params: parameter
  })
}

/* ---------常规物料库审核------------------------------ */
export function routineMaterialAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialAudit/audit',
    method: 'POST',
    data: parameter
  })
}

export function routineMaterialBatchAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialAudit/auditBatch',
    method: 'POST',
    data: parameter
  })
}

export function routineMaterialAuditList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialAudit/pageList',
    method: 'GET',
    params: parameter
  })
}
/* ---------常规物料库审核--END---------------------------- */


/* ---------成品物料库审核------------------------------ */
export function productMaterialAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialAudit/audit',
    method: 'POST',
    data: parameter
  })
}

export function productMaterialBatchAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialAudit/auditBatch',
    method: 'POST',
    data: parameter
  })
}

export function productMaterialAuditList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialAudit/pageList',
    method: 'GET',
    params: parameter
  })
}
/* ---------成品物料库审核--END---------------------------- */


/* ---------成品物料库基本接口------------------------------ */
/**详情 */
export function productMaterialInfo(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo',
    method: 'GET',
    params: parameter
  })
}
/**新增 */
export function productMaterialInfoAdd(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo',
    method: 'POST',
    data: parameter
  })
}
/**修改 */
export function productMaterialInfoUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo',
    method: 'PUT',
    data: parameter
  })
}
/**删除  */
export function productMaterialInfoDelete(parameter) {
  let url = parameter.split('=')[1].split(',').map(s => `ids=${s}`).join('&')
  return axios({
    baseURL: materialBaseUrl,
    url: `/productMaterialInfo?${url}`,
    method: 'DELETE'
  })
}
/**反审核，权限码：productMaterial:annulAudit*/
export function productMaterialInfoAnnulAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo/annulAudit',
    method: 'PUT',
    data: parameter
  })
}
/**提交审核 */
export function productMaterialInfoAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo/audit',
    method: 'PUT',
    data: parameter
  })
}

/**
 * @description 判断是否有重复的物料名称，有返回true，没有返回false
 * @param materialName 物料名称
 * @param ruleId 物料规则id
 * @param id  物料id
 */
export function productMaterialInfoCheckName(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo/checkName',
    method: 'GET',
    params: parameter
  })
}
/**
 * @description 根据所选列表导出
 * @param ids 所选的物料id
 */
export function productMaterialInfoExportList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: `/productMaterialInfo/exportList?${parameter}`,
    method: 'GET'
  })
}
/**禁用 */
export function productMaterialInfoForbidden(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo/forbidden',
    method: 'PUT',
    data: parameter
  })
}
/**启用 */
export function productMaterialInfoStartUsing(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo/startUsing',
    method: 'PUT',
    data: parameter
  })
}
/**列表  */
export function productMaterialInfoPageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo/pageList',
    method: 'GET',
    params: parameter
  })
}
/**树形列表  */
export function productMaterialInfoTwoTierTreeList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo/twoTierTreeList',
    method: 'GET',
    params: parameter
  })
}
/**附件接口 */
export function productMaterialAccessory(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialAccessory/list',
    method: 'GET',
    params: parameter
  })
}

export function productMaterialAccessoryDelete(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: `/productMaterialAccessory`,
    method: 'DELETE',
    params: parameter
  })
}

/**
 * 获取顺序的物料代码号
 * @param {ruleId} 物料规则id
 * @returns
 */
export function productMaterialInfoGetCode(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo/getCode',
    method: 'GET',
    params: parameter
  })
}
/* ---------成品物料库基本接口--END---------------------------- */

export function __MaterialInfoExport(type, params) {
  const m = {
    1: '/routineMaterialInfo/exportList', //常规物料
    2: '/productMaterialInfo/exportList' //成品物料
  }
  let fileName = type === 1 ? '常规物料库' : '成品物料库'
  let url = `${materialBaseUrl}${m[type]}?${params}`
  return axios({
      url: url,
      method: 'get',
      responseType: 'blob'
    }).then((res) => {
      console.log(res)
      if (res instanceof Blob) {
        const isFile = res.type === 'application/vnd.ms-excel'
        const isJson = res.type === 'application/json'
        if (isFile) {
          //返回文件 则下载
          const objectUrl = URL.createObjectURL(res)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.style = 'display: none'
          a.href = objectUrl
          a.download = `${fileName}.xls`
          a.click()
          document.body.removeChild(a)
          return {
            code: 200,
            msg: '下载成功'
          }
        } else if (isJson) {
          //返回json处理
          return new Promise(resolve => {
            var reader = new FileReader()
            reader.onload = function (e) {
              let _res = null
              try {
                _res = JSON.parse(e.target.result)
              } catch (err) {
                _res = null
              }
              if (_res !== null) {
                if (_res.code == 500) {
                  resolve({
                    code: 500,
                    msg: _res.msg
                  })
                } else {
                  resolve({
                    code: 200,
                    msg: '下载成功'
                  })
                }
              } else {
                resolve({
                  code: 500,
                  msg: `json解析出错 e.target.result：${e.target.result}`
                })
              }
            }
            try {
              reader.readAsText(res)
            } catch (err) {
              resolve({
                code: 500,
                msg: err.message
              })
            }
          })
        } else {
          return {
            code: 500,
            msg: `不支持的类型:${res}`
          }
        }
      } else {
        return {
          code: 500,
          msg: `返回数据不是Blob类型:${typeof res}`
        }
      }
    })
    .catch((err) => {
      return {
        code: 500,
        msg: `请求出错：${err.message}`
      }
    })
}

/**
 * 检测 K3 物料代码是否重复
 * @param {*} parameter
 * @returns
 */
export function materialInfoCheckK3Code(parameter) {
  let m = {
    'normal':'/routineMaterialInfo/checkK3Code',
    'product':'/productMaterialInfo/checkK3Code'
  }
  return axios({
    baseURL: materialBaseUrl,
    url: m[parameter._type],
    method: 'GET',
    params: parameter
  })
}

/**同级更换数据的code */
export function routineMaterialRuleToggleSort(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/toggleSort',
    method: 'get',
    params: parameter
  })
}

/**返回最新的线缆代码编码 */
export function getNewstCableCode(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/getNewstCableCode',
    method: 'get',
    params: parameter
  })
}


/**判断相同规格类型表是否创建过物料，有返回true，没有返回false */
export function checkSpecificationMaterial(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/checkSpecificationMaterial',
    method: 'get',
    params: parameter
  })
}


/** 更新物料规则监管状态 */
export function routineMaterialRuleUpdateCareState(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/updateCareState',
    method: 'post',
    data: parameter
  })
}

/** 更新物料规则监管状态 */
export function routineMaterialInfoUpdateCareState(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/updateCareState',
    method: 'post',
    data: parameter
  })
}

/**获取物料代码规格组成 */
export function getRoutineMaterialInfoCode(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialInfo/getRoutineMaterialInfoCode',
    method: 'get',
    params: parameter
  })
}

/**通过规格id反查父级树 */
export function routineMaterialRuleParentTree(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/routineMaterialRule/parentTree',
    method: 'get',
    params: parameter
  })
}

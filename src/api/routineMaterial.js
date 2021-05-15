import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

const materialBaseUrl = system.materialBaseUrl

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
    url: '/routineMaterialInfo/exportList',
    method: 'GET',
    params: parameter
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

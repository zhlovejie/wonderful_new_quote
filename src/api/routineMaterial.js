import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'



/**新增常规物料规则接口 */
export function routineMaterialRuleAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/routineMaterialRule',
    method: 'POST',
    data: parameter
  })
}

/**修改常规物料规则接口 */
export function routineMaterialRuleUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/routineMaterialRule',
    method: 'PUT',
    data: parameter
  })
}

/**删除常规物料规则接口 */
export function routineMaterialRuleDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/routineMaterialRule',
    method: 'DELETE',
    data: parameter
  })
}

/**反审核常规物料规则接口 ，权限码：routineMaterialRule:annulAudit*/
export function routineMaterialRuleAnnulAudit(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/routineMaterialRule/annulAudit',
    method: 'PUT',
    data: parameter
  })
}

/**审核常规物料规则接口 */
export function routineMaterialRuleAudit(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/routineMaterialRule/audit',
    method: 'PUT',
    data: parameter
  })
}

/**禁用常规物料规则接口 */
export function routineMaterialRuleForbidden(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/routineMaterialRule/forbidden',
    method: 'PUT',
    data: parameter
  })
}

/**启用 常规物料规则接口 */
export function routineMaterialRuleStartUsing(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/routineMaterialRule/startUsing',
    method: 'PUT',
    data: parameter
  })
}

/**列表 常规物料规则接口 */
 export function routineMaterialRulePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/routineMaterialRule/list',
    method: 'get',
    params: parameter
  })
}

/**树形列表 常规物料规则接口 */
export function routineMaterialRulePageTreeList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/routineMaterialRule/treeList',
    method: 'get',
    params: parameter
  })
}


/**审核 物料规则审核接口 */
export function materialRuleAuditAudit(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/materialRuleAudit/audit',
    method: 'POST',
    data: parameter
  })
}

/**审核列表 物料规则审核接口 */
export function materialRuleAuditPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/materialRuleAudit/pageList',
    method: 'get',
    params: parameter
  })
}


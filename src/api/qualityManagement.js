import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
const baseurl = system.baseURL

//  质量管理-检验参数配置

/**查询详情 */
export function checkParameterTermDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkParameterTerm/getDeatil',
    method: 'get',
    params: parameter
  })
}

/**根据配置名称查询 */
export function checkParameterTermWithName(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkParameterTerm/getTermName',
    method: 'get',
    params: parameter
  })
}

/**根据父级id查询相关数据 */
export function checkParameterTermList(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkParameterTerm/list',
    method: 'get',
    params: parameter
  })
}

/**分页查询 */
export function checkParameterTermPageList(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkParameterTerm/page',
    method: 'get',
    params: parameter
  })
}

/**删除 */
export function checkParameterTermDelete(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkParameterTerm/delete',
    method: 'post',
    data: parameter
  })
}

/**新增或修改 */
export function checkParameterTermAddOrUpdate(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkParameterTerm/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}

//  质量管理-检验参数配置 END

//  质量管理-检验工具认证

/**认证 */
export function checkToolAuthentication(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/base/checkToolAuthentication/authentication',
    method: 'post',
    data: parameter
  })
}

/**查询详情 */
export function checkToolAuthenticationDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/base/checkToolAuthentication/getDetail',
    method: 'get',
    params: parameter
  })
}

/**查询认证记录 */
export function checkToolAuthenticationRecord(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/base/checkToolAuthentication/listCheckToolAuthenticationLog',
    method: 'get',
    params: parameter
  })
}

/**分页查询 */
export function checkToolAuthenticationPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/base/checkToolAuthentication/page',
    method: 'get',
    params: parameter
  })
}

/**新增或修改 */
export function checkToolAuthenticationAddOrUpdate(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/base/checkToolAuthentication/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
//  质量管理-检验工具认证 END



//  质量管理-检验依据

/**删除 */
export function checkInspectionBasisDelete(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionBasis/delete',
    method: 'get',
    params: parameter
  })
}

/**详情 */
export function checkInspectionBasisDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionBasis/getDetail',
    method: 'get',
    params: parameter
  })
}

/**分页查询 */
export function checkInspectionBasisPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionBasis/page',
    method: 'get',
    params: parameter
  })
}

/**新增或修改 */
export function checkInspectionBasisAddOrUpdate(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionBasis/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
//  质量管理-检验依据 END


//  质量管理-检验方案设置

/**删除 */
export function checkInspectionSchemeSetDelete(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionSchemeSet/delete',
    method: 'get',
    params: parameter
  })
}

/**详情 */
export function checkInspectionSchemeSetDelete(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionSchemeSet/delete',
    method: 'get',
    params: parameter
  })
}

/**分页查询 */
export function checkInspectionSchemeSetPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionSchemeSet/page',
    method: 'get',
    params: parameter
  })
}

/**新增或修改 */
export function checkInspectionSchemeSetAddOrUpdate(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionSchemeSet/saveAddUpdate',
    method: 'post',
    data: parameter
  })
}
//  质量管理-检验方案设置 END

//  质量管理-检验标准指定

/**审批 */
export function checkInspectionStandardSetApproval(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionStandardSet/approval',
    method: 'post',
    data: parameter
  })
}

/**删除 */
export function checkInspectionStandardSetDelete(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionStandardSet/delete',
    method: 'get',
    params: parameter
  })
}

/**删除 */
export function checkInspectionStandardSetDetail(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionStandardSet/getDetail',
    method: 'get',
    params: parameter
  })
}

/**分页查询 */
export function checkInspectionStandardSetPage(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionStandardSet/page',
    method: 'get',
    params: parameter
  })
}

/**撤回 */
export function checkInspectionStandardSetRevocation(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionStandardSet/revocation',
    method: 'get',
    params: parameter
  })
}

/**新增或修改 */
export function checkInspectionStandardSetAddOrUpdate(parameter) {
  return axios({
    baseURL: baseurl,
    url: '/checkInspectionStandardSet/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
//  质量管理-检验标准指定 END

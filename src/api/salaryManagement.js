import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------工资参照表-----------------------
/**工资参照表列表分页条件查询 */
export function oaSalaryInfoStationStandardPageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard/getStationStandardPageList',
    method: 'get',
    params: parameter
  })
}

/*工资参照表新增*/
export function oaSalaryInfoStationStandardAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard/addAndUpdateStationStandard',
    method: 'post',
    data: parameter
  })
}
/**根据部门id物理删除，直接从数据库中删除以及所关联的修改记录 */
export function oaSalaryInfoStationStandardDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard/delStationStandard',
    method: 'get',
    params: parameter
  })
}

/**根据部门id获取详情，岗位id不必传 */
export function oaSalaryInfoStationStandardDetail (parameter) {
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
export function oaSalaryInfoStationStandardIsAddByDepId (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard/isAddByDepId',
    method: 'get',
    params: parameter
  })
}

/**根据部门id获取修改记录 */
export function oaSalaryInfoStationStationStandardChangList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-station-standard-change/getStationStandardChangList',
    method: 'get',
    params: parameter
  })
}

//---------------------薪资项设置-----------------------
export function oaSalaryConsistAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/addAndUpdateConsist',
    method: 'post',
    data: parameter
  })
}

export function oaSalaryConsistDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/consistDetail',
    method: 'get',
    params: parameter
  })
}

export function oaSalaryConsistDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/delConsist',
    method: 'get',
    params: parameter
  })
}

export function oaSalaryConsistPageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/getConsistPageList',
    method: 'get',
    params: parameter
  })
}

/**岗位验重 */
export function oaSalaryConsistIsAddByStationId (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/isAddByStationId',
    method: 'get',
    params: parameter
  })
}
/**验证 */
export function oaSalaryConsistValidate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-consist/validateConsist',
    method: 'get',
    params: parameter
  })
}
//---------------------薪资项设置-END----------------------
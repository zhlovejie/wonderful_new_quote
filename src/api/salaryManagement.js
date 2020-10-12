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
import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//---------------------人力资源管理模块-----------------------
/**高级工程师列表接口 */
export function senior_worker_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-senior-engineer-apply/page',
    method: 'get',
    params: parameter
  })
}
/**高级工程师新增接口 */
export function senior_worker_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-senior-engineer-apply/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**高级工程师撤回接口 */
export function senior_worker_withdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-senior-engineer-apply/withdraw',
    method: 'get',
    params: parameter
  })
}
/**高级工程师删除接口 */
export function senior_worker_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-senior-engineer-apply/del',
    method: 'post',
    data: parameter
  })
}

/**高级工程师审核接口 */
export function senior_worker_approval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-senior-engineer-apply/approval',
    method: 'post',
    data: parameter
  })
}

/**班车记录列表接口 */
export function shuttle_Bus_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-regular-bus-apply/page',
    method: 'get',
    params: parameter
  })
}

/**班车记录新增接口 */
export function shuttle_Bus_addAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-regular-bus-apply/addAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**班车记录撤回接口 */
export function shuttle_Bus_withdraw(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-regular-bus-apply/withdraw',
    method: 'get',
    params: parameter
  })
}
/**班车记录删除接口 */
export function shuttle_Bus_del(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'oaSalaryInfo/oa-salary-regular-bus-apply/del',
    method: 'post',
    data: parameter
  })
}

/**班车记录审核接口 */
export function shuttle_Bus_approval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-regular-bus-apply/approval',
    method: 'post',
    data: parameter
  })
}

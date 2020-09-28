import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//---------------------奖金模块-----------------------
/**配货站信息列表接口 */
export function oaSalaryInfo_list(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaSalaryInfo/oa-salary-bouns-percentage-rule/page',
    method: 'get',
    params: parameter
  })
}

import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

//---------------------物流管理模块-----------------------
/**配货站信息列表接口 */
export function DistributionList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/goticeManage/gotice-manage/getGoticeManageList',
    method: 'get',
    params: parameter
  })
}

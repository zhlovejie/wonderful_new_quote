import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

//---------------------人力资源管理模块-----------------------
/**公告管理列表接口 */
export function NoticeList (parameter) {
    return axios({
      baseURL: system.baseURL,
      url: '/goticeManage/gotice-manage/getGoticeManageList',
      method: 'get',
      params: parameter
    })
  }
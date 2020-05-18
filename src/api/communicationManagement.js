import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

/**通讯设置新增和修改 */
export function comManageSettingsAddAndUpdate (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/settings/addAndUpdateSettings',
    method: 'post',
    data: params
  })
}

/**获取通讯设置列表 */
export function comManageSettingsPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/settings/getSettingsPage',
    method: 'get',
    params: parameter
  })
}

/**获取通讯设置详情 */
export function comManageSettingsDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/settings/getSettingsDetail',
    method: 'get',
    params: parameter
  })
}

/**判断该岗位是否配置公司 手机号，微信，qq，邮箱 */
export function comManageSettingsGetSettingsByStationId (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/settings/getSettingsByStationId',
    method: 'get',
    params: parameter
  })
}

/**通讯设置下载 */
export function comManageSettingsExportExcel () {
  return `${system.baseURL}/comManage/settings/exportExcel`
}

/**通讯设置软删除 */
export function comManageSettingsDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/settings/delSettings',
    method: 'get',
    params: parameter
  })
}


//-----------------手机号管理-----------------------
/**获取手机号管理列表 */
export function comManageMobileManagePage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/mobile-manage/getMobileManagePage',
    method: 'get',
    params: parameter
  })
}

/**手机号管理下载 */
export function comManageMobileManageExportExcel () {
  return `${system.baseURL}/comManage/mobile-manage/exportExcel`
}

/**手机号管理软删除 */
export function comManageMobileManageDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/mobile-manage/delMobileManage',
    method: 'get',
    params: parameter
  })
}

/**手机号管理新增和修改 */
export function comManageMobileManageAddAndUpdate (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/mobile-manage/addAndUpdateMobileManage',
    method: 'post',
    data: params
  })
}

/**获取手机号管理详情 */
export function comManageMobileManageDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/comManage/mobile-manage/getMobileManageDetail',
    method: 'get',
    params: parameter
  })
}
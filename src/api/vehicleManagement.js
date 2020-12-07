import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------车辆列表-----------------------

export function carInfoList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-info/getCarInfoPageList',
    method: 'get',
    params: parameter
  })
}

export function carInfoListWithoutPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-info/getCarInfoList',
    method: 'get',
    params: parameter
  })
}

/**获取所有车辆保管人 */
export function carUserList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-info/getCareUserList',
    method: 'get',
    params: parameter
  })
}

export function carInfoDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-info/delCarInfo',
    method: 'get',
    params: parameter
  })
}

export function carInfoAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-info/addAndUpdateCarInfo',
    method: 'post',
    data: parameter
  })
}

//---------------------车辆列表---END--------------------

//---------------------油卡信息--------------------------
export function carOilInfoList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-oil-info/getCarOilInfoPageList',
    method: 'get',
    params: parameter
  })
}
export function carOilInfoDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-oil-info/delCarOilInfo',
    method: 'get',
    params: parameter
  })
}
export function carOilInfoAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-oil-info/addAndUpdateCarOilInfo',
    method: 'post',
    data: parameter
  })
}
//---------------------油卡信息---END--------------------

//---------------------油卡充值记录--------------------------

export function carOilInvestList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-oil-invest/getCarOilInvestPageList',
    method: 'get',
    params: parameter
  })
}

export function carOilInvestExport (parameter) {
  return `${system.baseURL}/car/car-oil-invest/getCarOilInvestExport`
}

export function carOilInvestAmount (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-oil-invest/getCarOilAmount',
    method: 'get',
    params: parameter
  })
}

export function carOilInvestDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-oil-invest/delCarOilInvest',
    method: 'get',
    params: parameter
  })
}
export function carOilInvestAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-oil-invest/addAndUpdateCarOilInvest',
    method: 'post',
    data: parameter
  })
}
//---------------------油卡充值记录---END--------------------


//---------------------用车记录--------------------------
export function carUsePageList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-use-apply/getCarUsePageList',
    method: 'get',
    params: parameter
  })
}

export function carUseDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-use-apply/getCarUseDetail',
    method: 'get',
    params: parameter
  })
}
//---------------------用车记录---END--------------------


//---------------------驾驶权限记录--------------------------
export function driverAuthorityRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-driver-authority-apply/revocationDriverAuthority',
    method: 'get',
    params: parameter
  })
}

export function driverAuthorityList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-driver-authority-apply/getDriverAuthorityPageList',
    method: 'get',
    params: parameter
  })
}

export function driverAuthorityDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-driver-authority-apply/getDriverAuthorityDetail',
    method: 'get',
    params: parameter
  })
}

export function driverAuthorityDel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-driver-authority-apply/delDriverAuthority',
    method: 'get',
    params: parameter
  })
}


export function driverAuthorityApproval (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-driver-authority-apply/approvalDriverAuthority',
    method: 'post',
    data: parameter
  })
}

export function driverAuthorityAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-driver-authority-apply/addAndUpdateDriverAuthority',
    method: 'post',
    data: parameter
  })
}
//---------------------驾驶权限记录---END--------------------

//---------------------车辆监管/加油记录--------------------------
export function carOilingList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-oiling-history/getCarOilingPageList',
    method: 'get',
    params: parameter
  })
}

export function carOilingAuth (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-oiling-history/authenticateCarOilIng',
    method: 'post',
    data: parameter
  })
}

export function carOilingAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-oiling-history/addAndUpdateCarOilIng',
    method: 'post',
    data: parameter
  })
}

/**加油记录下载*/
export function exportCarOilingHistoryExcel(key,params) {
  let map = {
    1:'/car/car-oiling-history/exportCarOilingHistoryExcel',
  }
  return axios({
    baseURL: system.baseURL,
    url: map[key],
    method: 'get',
    responseType:'blob',
    params: params
  })
}


//---------------------车辆监管/加油记录---END--------------------


//---------------------车辆监管/维修记录--------------------------
export function carMaintenanceList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-maintenance/getCarMaintenancePageList',
    method: 'get',
    params: parameter
  })
}
//---------------------车辆监管/维修记录---END--------------------

//---------------------车辆监管/车辆问题上报--------------------------
export function carQuestionReportDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-question-report/getCarQuestionReportDetail',
    method: 'get',
    params: parameter
  })
}

//维修方案
export function carMaintenancePlanList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-maintenance/getCarMaintenancePlanList',
    method: 'get',
    params: parameter
  })
}
//维修凭证
export function carMaintenanceEvidenceList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-maintenance/getCarMaintenanceEvidenceList',
    method: 'get',
    params: parameter
  })
}



//---------------------车辆监管/车辆问题上报---END--------------------

//---------------------车辆监管/保养记录--------------------------
export function careHistoryList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-care-history/getCareHistoryPageList',
    method: 'get',
    params: parameter
  })
}

//---------------------车辆监管/保养记录---END--------------------


//---------------------车辆监管/违章记录--------------------------
export function carIllegalList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-illegal-history/getCarIllegalPageList',
    method: 'get',
    params: parameter
  })
}

export function carIllegalDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-illegal-history/getCarIllegalDetail',
    method: 'get',
    params: parameter
  })
}

export function carIllegalUpload (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-illegal-history/endCarIllegal',
    method: 'get',
    params: parameter
  })
}

export function carIllegalAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-illegal-history/addAndUpdateCarIllegal',
    method: 'post',
    data: parameter
  })
}

export function carIllegalAddUser (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-illegal-history/addUser',
    method: 'get',
    params: parameter
  })
}
//---------------------车辆监管/违章记录---END--------------------

//---------------------车辆监管/车辆问题上报记录--------------------------
export function carQuestionReportList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/car/car-question-report/getCarQuestionReportPageList',
    method: 'get',
    params: parameter
  })
}
//---------------------车辆监管/车辆问题上报记录---END--------------------
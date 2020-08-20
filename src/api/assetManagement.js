import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------我的资产-----------------------
/**我的资产列表分页条件查询 */
export function oaAssertsInfoMyAssertsList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-receive-history/getMyListAsserts',
    method: 'get',
    params: parameter
  })
}

/*查询资产*/
export function oaAssertsInfoMyAssertsAllList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-receive-history/getAllListAsserts',
    method: 'get',
    params: parameter
  })
}
/*资产新增*/
export function oaAssertsInfoAssertsAdd (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-info/saveAssertsInfo',
    method: 'post',
    data: parameter
  })
}

/*资产领取*/
export function oaAssertsInfoAssertsDraw (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-info/drawAssert',
    method: 'post',
    data: parameter
  })
}

/*资产归还*/
export function oaAssertsInfoAssertsReturn (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-info/returnAssert',
    method: 'post',
    data: parameter
  })
}

/*资产领用分页列表查询*/
export function oaAssertsInfoHistoryPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-receive-history/getAssertsRecieveHistoryByPage',
    method: 'get',
    params: parameter
  })
}

/*确认验收*/
export function oaAssertsInfoConfirmRecieve (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-info/confirmRecieve',
    method: 'post',
    data: parameter
  })
}

/*报废*/
export function oaAssertsInfoGiveUpAssert (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-info/giveUpAssert',
    method: 'post',
    data: parameter
  })
}

/*删除*/
export function oaAssertsInfoRemove (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-info/removeAssert',
    method: 'post',
    data: parameter
  })
}

/*已报废的资产入库接口*/
export function oaAssertsInfoStockInAssert (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-info/stockInAssert',
    method: 'post',
    data: parameter
  })
}

/*报修 新增或修改*/
export function oaAssertsInfoRecoveAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-recove-apply/addOrUpdate',
    method: 'post',
    data: parameter
  })
}

/*报修 审批*/
export function oaAssertsInfoRecoveApproval (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-recove-apply/approval',
    method: 'post',
    data: parameter
  })
}
/*报修 完结*/
export function oaAssertsInfoRecoveConcludeRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-recove-apply/concludeRevocation',
    method: 'get',
    params: parameter
  })
}

/*报修 审批通过后采购处理*/
export function oaAssertsInfoRecoveHandleRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-recove-apply/handleRevocation',
    method: 'get',
    params: parameter
  })
}

/*报修 详情*/
export function oaAssertsInfoRecoveDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-recove-apply/recoveApplyDetail',
    method: 'get',
    params: parameter
  })
}


/*报修 撤回*/
export function oaAssertsInfoRecoveRevocation (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-recove-apply/revocation',
    method: 'get',
    params: parameter
  })
}

/*报修 处理完成后上传凭证*/
export function oaAssertsInfoRecoveUpload (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-recove-apply/uploadRevocation',
    method: 'get',
    params: parameter
  })
}

/*报修 申请分页列表*/
export function oaAssertsInfoRecoveList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-recove-apply/recoveApplyList',
    method: 'get',
    params: parameter
  })
}

/*资产盘点记录*/
/*根据ids盘点id可以是多个用逗号分隔*/
export function oaAssertsInfoInventory (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-inventory/inventory',
    method: 'get',
    params: parameter
  })
}
/*盘点记录列表*/
export function oaAssertsInfoInventoryList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-inventory/inventoryList',
    method: 'get',
    params: parameter
  })
}
/*更改缺失*/
export function oaAssertsInfoInventoryMissing (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/oaAssertsInfo/oa-asserts-inventory/missingInventory',
    method: 'get',
    params: parameter
  })
}

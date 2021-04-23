import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

// eslint-disable-next-line no-unused-vars
const api = {
  addProduct: '/productInformation/add',
  delProduct: '/productInformation/del',
  editProduct: '/productInformation/edit',
  editPrice: 'productInformation/editPrice',
  getChangeRecordPageList: '/productPriceChangeRecord/product-price-change-record/getChangeRecordPageList',
  getFloatingFigure: '/productPriceChangeRecord/product-price-change-record/getFloatingFigure',
  productList: '/productInformation/toList',
  checkName: '/productInformation/checkName',
  getPDF: '/productInformation/getPDF',
  sealList: '/commonSeal/getSealList',
  checkSealCode: '/commonSeal/checkCode',
  addSeal: '/commonSeal/add',
  delSeal: '/commonSeal/del',
  editSeal: '/commonSeal/edit',
  projectCaseList: '/projectCase/listPage',
  checkCaseName: '/projectCase/checkName',
  addProjectCase: '/projectCase/add',
  delProjectCase: '/projectCase/del',
  editProjectCase: '/projectCase/edit',
  dunloadProjectCase: '/projectCase/dunload',
  softwareProductList: '/softwareProduct/listPage',
  addSoftwareProduct: '/softwareProduct/add',
  androidVersionList: '/android-version/queryList',
  androidVersionAdd: '/android-version/addVersion',
  androidVersionEdit: '/android-version/updateVersion',
  androidVersionDelete: '/android-version/deleteVersion',
  androidApkUpload: '/android-version/uploadApkFile',
  androidVersionEquipmentList: '/android-version-equipment/queryList',
  androidVersionEquipmentAdd: '/android-version-equipment/addVersion',
  androidVersionEquipmentEdit: '/android-version-equipment/updateVersion',
  androidVersionEquipmentDelete: '/android-version-equipment/deleteVersion',
  androidApkEquipmentUpload: '/android-version-equipment/uploadApkFile',
  //消息推送列表

  messagePushList: '/message/message-push/page',
  messagePushaddAndUpdate: '/message/message-push/addAndUpdate',
  messagePushaddInfo: '/message/message-push/info',
  messagePushDel: '/message/message-push/del',

  //数据字典接口
  getListByCode: 'dictionary/getListByCode',
  //非常规产品信息列表
  saleValencyProduct: '/api/saleValencyProduct',

  // 
  //消息推送共享设置
  pushMsgList: '/pushMsg/push-msg-user/page',
  pushMsgDel: '/pushMsg/push-msg-user/del',
  pushMsgAdd: '/pushMsg/push-msg-user/addAndUpdate',

}

//数据字典
export function queryCode(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getListByCode,
    method: 'get',
    params: parameter
  })
}


//非常规产品信息列表
export function saleValencyProductList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.saleValencyProduct,
    method: 'get',
    params: parameter
  })
}
//消息推送共享设置  
export function pushMsgList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pushMsgList,
    method: 'get',
    params: parameter
  })
}
//消息推送共享设置删除
export function pushMsgDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pushMsgDel,
    method: 'get',
    params: parameter
  })
}
//消息推送共享设置新增修改
export function pushMsgAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.pushMsgAdd,
    method: 'post',
    data: parameter
  })
}


//消息推送列表
export function messagePushList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.messagePushList,
    method: 'get',
    params: parameter
  })
}
//消息推送列表删除
export function messagePushDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.messagePushDel,
    method: 'get',
    params: parameter
  })
}

//消息推送详情
export function messagePushaddInfo(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.messagePushaddInfo,
    method: 'get',
    params: parameter
  })
}

//消息推送新增修改
export function messagePushaddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.messagePushaddAndUpdate,
    method: 'post',
    data: parameter
  })
}






// 产品价格波动图
export function getFloatingFigure(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.getFloatingFigure,
    method: 'post',
    data: parameter
  })
}
// 上传android设备 apk
export function uploadAndroidApkEquipment(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.androidApkEquipmentUpload,
    method: 'post',
    data: parameter
  })
}

// android设备分页列表
export function listAndroidVersionEquipment(parameter) {
  console.log('listAndroidVersion---param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionEquipmentList,
    method: 'get',
    params: parameter
  })
}

// 删除android设备
export function deleteAndroidVersionEquipment(parameter) {
  console.log('deleteAndroidVersion---param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionEquipmentDelete,
    method: 'get',
    params: parameter
  })
}

// 修改android设备
export function editAndroidVersionEquipment(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionEquipmentEdit,
    method: 'post',
    data: parameter
  })
}

// 新增android设备
export function addAndroidVersionEquipment(parameter) {
  console.log('param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionEquipmentAdd,
    method: 'post',
    data: parameter
  })
}


// ---------------------------------------分界线-------------------------
// 上传android apk
export function uploadAndroidApk(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.androidApkUpload,
    method: 'post',
    data: parameter
  })
}

// android版本分页列表
export function listAndroidVersion(parameter) {
  console.log('listAndroidVersion---param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionList,
    method: 'get',
    params: parameter
  })
}

// 删除android版本
export function deleteAndroidVersion(parameter) {
  console.log('deleteAndroidVersion---param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionDelete,
    method: 'get',
    params: parameter
  })
}

// 修改android版本
export function editAndroidVersion(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionEdit,
    method: 'post',
    data: parameter
  })
}

// 新增android版本
export function addAndroidVersion(parameter) {
  console.log('param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionAdd,
    method: 'post',
    data: parameter
  })
}




// 修改软件产品
export function editSoftwareProduct(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.editSoftwareProduct,
    method: 'post',
    data: parameter
  })
}

// 新增软件产品
export function addSoftwareProduct(parameter) {
  console.log('param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.addSoftwareProduct,
    method: 'post',
    data: parameter
  })
}

// 软件产品分页列表
export function softwareProductList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.softwareProductList,
    method: 'get',
    params: parameter
  })
}

// 下载
export function dunloadProjectCase(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.dunloadProjectCase,
    method: 'get',
    params: parameter,
    responseType: 'blob'
  })
}


// 修改工程案例
export function editProjectCase(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.editProjectCase,
    method: 'post',
    data: parameter
  })
}

// 删除工程案例
export function delProjectCase(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.delProjectCase,
    method: 'post',
    data: parameter
  })
}

// 新增工程案例
export function addProjectCase(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.addProjectCase,
    method: 'post',
    data: parameter
  })
}

// 获取工程案例分页列表
export function checkCaseName(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.checkCaseName,
    method: 'get',
    params: parameter
  })
}

// 获取工程案例分页列表
export function projectCaseList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.projectCaseList,
    method: 'get',
    params: parameter
  })
}

// 修改公章
export function editSeal(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.editSeal,
    method: 'post',
    data: parameter
  })
}

// 删除公章
export function delSeal(parameter) {
  console.log('param', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.delSeal,
    method: 'post',
    data: parameter
  })
}

// 新增公章
export function addSeal(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.addSeal,
    method: 'post',
    data: parameter
  })
}

// 判断是否有重复的公章代码
export function checkSealCode(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.checkSealCode,
    method: 'get',
    params: parameter
  })
}

// 获取公章分页列表
export function sealList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.sealList,
    method: 'get',
    params: parameter
  })
}

export function getPDF(parameter) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: api.getPDF,
    method: 'get',
    params: parameter
  })
}

// 产品分页列表
export function getProductList(parameter) {
  return axios({
    headers: {
      'Authorization': parameter.token
    },
    baseURL: system.baseURL, // 服务器ip和端口
    url: api.productList,
    method: 'get',
    params: parameter
  })
}
/**销售管理 ->产品价格 下载*/
export function downProductInformation(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/productInformation/downProductInformation',
    method: 'get',
    responseType: 'blob',
    params: params
  })
}

// 检查产品名是否有重复
export function checkName(parameter) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: api.checkName,
    method: 'get',
    params: parameter
  })
}


export function addProduct(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.addProduct,
    method: 'post',
    data: parameter
  })
}

export function delProduct(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.delProduct,
    method: 'post',
    data: parameter
  })
}

// 修改产品信息
export function editProduct(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.editProduct,
    method: 'post',
    data: parameter
  })
}
//修改产品价格

export function editPrice(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.editPrice,
    method: 'post',
    data: parameter
  })
}

//产品修改记录
export function getChangeRecordPageList(parameter) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: api.getChangeRecordPageList,
    method: 'get',
    params: parameter
  })
}


// 获取数据字典列表
export function getDictionaryList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryList',
    method: 'get',
    params: parameter
  })
}
// 获取数据字典列表
export function getListByText(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/query',
    method: 'get',
    params: parameter
  })
}
// 获取数据字典左侧树结构
export function gettreeList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryTree',
    method: 'get',
    params: parameter
  })
}

// 修改字典项目
export function DictionaryModify(parameter) {
  // const token = parameter.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/modify',
    method: 'post',
    data: parameter
  })
}
// 新增字典项目
export function dictionaryAdd(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/save',
    method: 'post',
    data: parameter
  })
}
// 删除数据字典项目
export function DictionaryDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/remove',
    method: 'post',
    data: parameter
  })
}
// 验证重名
export function getDictionaryByText(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryList',
    method: 'get',
    params: parameter
  })
}
// 产品信息导入
export function importExcel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productInformation/importExcel',
    method: 'post',
    responseType: 'blob',
    data: parameter
  })
}

// 产品区域信息接口
export function queryTreeByArea() {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryTreeByArea',
    method: 'get'
  })
}

// 返回产品A价、B价、C价 的计算比例
export function dictionaryQueryOne(id) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryOne?id=' + id,
    method: 'get'
  })
}

// 返回产品A价、B价、C价 的计算比例
export function queryPriceByArea(id) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryPriceByArea?id=' + id,
    method: 'get'
  })
}

//---------------------产品价格系数------------------
/**产品价格系数新增和修改 */
export function productPriceCoefficientAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productPriceCoefficient/price-coefficient/addAndUpdatePriceCoefficient',
    method: 'post',
    data: parameter
  })
}
/**产品价格系数删除 */
export function productPriceCoefficientDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productPriceCoefficient/price-coefficient/delPriceCoefficient',
    method: 'get',
    params: parameter
  })
}
/**产品价格系数详情 */
export function productPriceCoefficientDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productPriceCoefficient/price-coefficient/getPriceCoefficientDetail',
    method: 'get',
    params: parameter
  })
}
/**产品价格系数列表无分页 */
export function productPriceCoefficientListWithoutPage(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productPriceCoefficient/price-coefficient/getPriceCoefficientList',
    method: 'get',
    params: parameter
  })
}
/**产品价格系数列表 */
export function productPriceCoefficientList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productPriceCoefficient/price-coefficient/getPriceCoefficientPage',
    method: 'get',
    params: parameter
  })
}
//---------------------产品价格系数------------------
//工具箱-工程案例 批量下载专用
export function WorkBoxBatchDownload(url) {
  return axios({
    url: url,
    method: 'get',
    responseType: 'blob'
  })
}

//---------------------项目专利------------------
export function addAndUpdateProjectPatent(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/projectPatent/project-patent/addAndUpdateProjectPatent',
    method: 'post',
    data: parameter
  })
}

export function delProjectPatent(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/projectPatent/project-patent/delProjectPatent',
    method: 'get',
    params: parameter
  })
}

export function getProjectPatentDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/projectPatent/project-patent/getProjectPatentDetail',
    method: 'get',
    params: parameter
  })
}

export function getProjectPatentPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/projectPatent/project-patent/getProjectPatentPageList',
    method: 'get',
    params: parameter
  })
}
//---------------------项目专利------------------

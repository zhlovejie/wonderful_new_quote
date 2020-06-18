import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// eslint-disable-next-line no-unused-vars
const api = {
  addProduct: '/productInformation/add',
  delProduct: '/productInformation/del',
  editProduct: '/productInformation/edit',
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
  androidApkUpload: '/android-version/uploadApkFile'
}

// 上传android apk
export function uploadAndroidApk (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.androidApkUpload,
    method: 'post',
    data: parameter
  })
}

// android版本分页列表
export function listAndroidVersion (parameter) {
  console.log('listAndroidVersion---param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionList,
    method: 'get',
    params: parameter
  })
}

// 删除android版本
export function deleteAndroidVersion (parameter) {
  console.log('deleteAndroidVersion---param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionDelete,
    method: 'get',
    params: parameter
  })
}

// 修改android版本
export function editAndroidVersion (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionEdit,
    method: 'post',
    data: parameter
  })
}

// 新增android版本
export function addAndroidVersion (parameter) {
  console.log('param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.androidVersionAdd,
    method: 'post',
    data: parameter
  })
}




// 修改软件产品
export function editSoftwareProduct (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.editSoftwareProduct,
    method: 'post',
    data: parameter
  })
}

// 新增软件产品
export function addSoftwareProduct (parameter) {
  console.log('param``````', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.addSoftwareProduct,
    method: 'post',
    data: parameter
  })
}

// 软件产品分页列表
export function softwareProductList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.softwareProductList,
    method: 'get',
    params: parameter
  })
}

// 下载
export function dunloadProjectCase (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.dunloadProjectCase,
    method: 'get',
    params: parameter,
    responseType: 'blob'
  })
}


// 修改工程案例
export function editProjectCase (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.editProjectCase,
    method: 'post',
    data: parameter
  })
}

// 删除工程案例
export function delProjectCase (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.delProjectCase,
    method: 'post',
    data: parameter
  })
}

// 新增工程案例
export function addProjectCase (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.addProjectCase,
    method: 'post',
    data: parameter
  })
}

// 获取工程案例分页列表
export function checkCaseName (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.checkCaseName,
    method: 'get',
    params: parameter
  })
}

// 获取工程案例分页列表
export function projectCaseList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.projectCaseList,
    method: 'get',
    params: parameter
  })
}

// 修改公章
export function editSeal (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.editSeal,
    method: 'post',
    data: parameter
  })
}

// 删除公章
export function delSeal (parameter) {
  console.log('param', parameter)
  return axios({
    baseURL: system.baseURL,
    url: api.delSeal,
    method: 'post',
    data: parameter
  })
}

// 新增公章
export function addSeal (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.addSeal,
    method: 'post',
    data: parameter
  })
}

// 判断是否有重复的公章代码
export function checkSealCode (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.checkSealCode,
    method: 'get',
    params: parameter
  })
}

// 获取公章分页列表
export function sealList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.sealList,
    method: 'get',
    params: parameter
  })
}

export function getPDF (parameter) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: api.getPDF,
    method: 'get',
    params: parameter
  })
}

// 产品分页列表
export function getProductList (parameter) {
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

// 检查产品名是否有重复
export function checkName (parameter) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: api.checkName,
    method: 'get',
    params: parameter
  })
}

export function addProduct (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.addProduct,
    method: 'post',
    data: parameter
  })
}

export function delProduct (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.delProduct,
    method: 'post',
    data: parameter
  })
}

// 修改产品信息
export function editProduct (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: api.editProduct,
    method: 'post',
    data: parameter
  })
}

// 获取数据字典列表
export function getDictionaryList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryList',
    method: 'get',
    params: parameter
  })
}
// 获取数据字典列表
export function getListByText (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/query',
    method: 'get',
    params: parameter
  })
}
// 获取数据字典左侧树结构
export function gettreeList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryTree',
    method: 'get',
    params: parameter
  })
}

// 修改字典项目
export function DictionaryModify (parameter) {
  // const token = parameter.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/modify',
    method: 'post',
    data: parameter
  })
}
// 新增字典项目
export function dictionaryAdd (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/save',
    method: 'post',
    data: parameter
  })
}
// 删除数据字典项目
export function DictionaryDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/remove',
    method: 'post',
    data: parameter
  })
}
// 验证重名
export function getDictionaryByText (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryList',
    method: 'get',
    params: parameter
  })
}
// 产品信息导入
export function importExcel (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productInformation/importExcel',
    method: 'post',
    responseType:'blob',
    data: parameter
  })
}

// 产品区域信息接口
export function queryTreeByArea () {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryTreeByArea',
    method: 'get'
  })
}

// 返回产品A价、B价、C价 的计算比例
export function dictionaryQueryOne (id) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryOne?id='+id,
    method: 'get'
  })
}

// 返回产品A价、B价、C价 的计算比例
export function queryPriceByArea (id) {
  return axios({
    baseURL: system.baseURL,
    url: '/dictionary/queryPriceByArea?id='+id,
    method: 'get'
  })
}

//---------------------产品价格系数------------------
/**产品价格系数新增和修改 */
export function productPriceCoefficientAddAndUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productPriceCoefficient/price-coefficient/addAndUpdatePriceCoefficient',
    method: 'post',
    data: parameter
  })
}
/**产品价格系数删除 */
export function productPriceCoefficientDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productPriceCoefficient/price-coefficient/delPriceCoefficient',
    method: 'get',
    params: parameter
  })
}
/**产品价格系数详情 */
export function productPriceCoefficientDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productPriceCoefficient/price-coefficient/getPriceCoefficientDetail',
    method: 'get',
    params: parameter
  })
}
/**产品价格系数列表无分页 */
export function productPriceCoefficientListWithoutPage (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productPriceCoefficient/price-coefficient/getPriceCoefficientList',
    method: 'get',
    params: parameter
  })
}
/**产品价格系数列表 */
export function productPriceCoefficientList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/productPriceCoefficient/price-coefficient/getPriceCoefficientPage',
    method: 'get',
    params: parameter
  })
}
//---------------------产品价格系数------------------
//工具箱-工程案例 批量下载专用
export function WorkBoxBatchDownload (url) {
  return axios({
    url: url,
    method: 'get',
    responseType:'blob'
  })
}
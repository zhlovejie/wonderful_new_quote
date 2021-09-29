import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------产品配置-----------------------
// 获取产品配置列表
export function priceAdjustItemConfigList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustItemConfig/itemConfigList',
    method: 'get',
    params: parameter
  })
}

// 删除产品配置
export function priceAdjustItemConfigDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustItemConfig/delItemConfig',
    method: 'get',
    params: parameter
  })
}

// 新增或者修改产品配置
export function priceAdjustItemConfigAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustItemConfig/addAndUpdate',
    method: 'post',
    data: parameter
  })
}

//---------------------产品配置-----------------------

//---------------------中控系统模块配置清单------------

/**中控配置列表 */
export function priceAdjustZktConfigList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustZktConfig/getZktConfigList',
    method: 'get',
    params: parameter
  })
}

/**中控配置根据id获取详情 */
export function priceAdjustZktConfigDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustZktConfig/getZktConfig',
    method: 'get',
    params: parameter
  })
}

/**中控配置删除 */
export function priceAdjustZktConfigDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustZktConfig/delZktConfig',
    method: 'get',
    params: parameter
  })
}

/**中控配置新增或修改 */
export function priceAdjustZktConfigAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustZktConfig/ZktConfigAddAndUpdate',
    method: 'post',
    data: parameter
  })
}

/**根据id和类型查看修改记录 */
export function priceAdjustUpdateRecordList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustUpdateRecord/getUpdateRecordList',
    method: 'get',
    params: parameter
  })
}



//---------------------中控系统模块配置清单-END--------


//---------------------系列产品配置清单------------
/**系列产品配置列表 */
export function priceAdjustProductConfigList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/productConfigList',
    method: 'get',
    params: parameter
  })
}

/**系列产品配置根据id获取详情 */
export function priceAdjustProductConfigDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/getProductConfig',
    method: 'get',
    params: parameter
  })
}

/**系列产品配置删除 */
export function priceAdjustProductConfigDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/delProductConfig',
    method: 'get',
    params: parameter
  })
}
/**系列产品新增或修改产品配置 */
export function priceAdjustProductConfigAddAndUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/productConfigAddAndUpdate',
    method: 'post',
    data: parameter
  })
}

//改变销售状态
export function priceAdjustProductConfigChangeIsSale(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/changeIsSale',
    method: 'get',
    params: parameter
  })
}

//---------------------系列产品配置清单-END--------


//---------------------产品价格配置------------
/**获取核价列表，根据主框架类型 */
export function priceAdjustPricingRecordList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustPricingRecord/getPricingList',
    method: 'get',
    params: parameter
  })
}

/**根据id和类型获取核价配置信息 */
export function priceAdjustPricingRecordDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustPricingRecord/getPricingInfo',
    method: 'get',
    params: parameter
  })
}

/**根据id和类型进行核价 */
export function priceAdjustPricingRecordPrice(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustPricingRecord/pricingPrice',
    method: 'get',
    params: parameter
  })
}

/**根据id和类型获取变更记录 */
export function priceAdjustPricingRecordPricingChangList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustPricingRecord/getPricingChangList',
    method: 'get',
    params: parameter
  })
}
//---------------------产品价格配置-END--------

//---------------------报价单------------
/**系列产品报价列表 */
export function priceAdjustProductQuoteList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductQuote/getProductQuoteList',
    method: 'get',
    params: parameter
  })
}
/**系列产品报价详情 */
export function priceAdjustProductQuoteDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductQuote/getProductQuoteDetail',
    method: 'get',
    params: parameter
  })
}
/**系列产品报价删除 */
export function priceAdjustProductQuoteDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductQuote/delProductQuote',
    method: 'get',
    params: parameter
  })
}

/**系列产品报价预览下载 */
export function priceAdjustProductQuoteDownload(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductQuote/previewDownload',
    method: 'post',
    responseType: 'blob',
    data: parameter
  })
}
// 报价区间
export function productEvaluation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/productEvaluation',
    method: 'get',
    params: parameter
  })
}


/**系列产品报价新增和修改 */
export function priceAdjustProductQuoteAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductQuote/addAndUpdateProductQuote',
    method: 'post',
    data: parameter
  })
}
//---------------------区间配置-END--------
export function intervalConfigPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-interval-config/intervalConfigPage',
    method: 'get',
    params: parameter
  })
}
/**区间配置删除 */
export function delIntervalConfig(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-interval-config/delIntervalConfig',
    method: 'get',
    params: parameter
  })
}
/**区间配置下载*/
export function exportIntervalConfigList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-interval-config/exportIntervalConfigList',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}
// 区间配置新增修改
export function addAndUpdateIntervalConfig(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-interval-config/addAndUpdateIntervalConfig',
    method: 'post',
    data: parameter
  })
}
// 区间配置详情
export function intervalConfigDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-interval-config/intervalConfigDetail',
    method: 'get',
    params: parameter
  })
}
// 区间配置根据名称详情
export function intervalConfigDetailByName(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-interval-config/intervalConfigDetailByName',
    method: 'get',
    params: parameter
  })
}

//---------------------产品类型配置-END--------
//产品类型配置列表
export function typeConfigPage(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-type-config/typeConfigPage',
    method: 'get',
    params: parameter
  })
}
//产品类型删除
export function delTypeConfig(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-type-config/delTypeConfig',
    method: 'get',
    params: parameter
  })
}

//产品类型区间下拉
export function intervalConfigList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-interval-config/intervalConfigList',
    method: 'get',
    params: parameter
  })
}

//产品类型新增修改
export function addAndUpdateTypeConfig(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-type-config/addAndUpdateTypeConfig',
    method: 'post',
    data: parameter
  })
}

//产品类型详情
export function typeConfigDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-type-config/typeConfigDetail',
    method: 'get',
    params: parameter
  })
}
//产品信息常规列表
export function productInformationList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'productInformation/pricingProductList',
    method: 'get',
    params: parameter
  })
}
//产品信息非常规列表
export function saleValencyProduct(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'saleValencyProduct/pricingProductList',
    method: 'get',
    params: parameter
  })
}
//产品类型列表无分页
export function typeConfigList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/quote/product-type-config/typeConfigList',
    method: 'get',
    params: parameter
  })
}
//成本价核价
export function costPricePricing(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/costPricePricing',
    method: 'get',
    params: parameter
  })
}
//物料代码核价
export function materialCodePricing(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/materialCodePricing',
    method: 'get',
    params: parameter
  })
}
//核价代码核价(核价产品生成的代码/核价产品申请的代码)
export function valencyCodePricing(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/valencyCodePricing',
    method: 'get',
    params: parameter
  })
}


//导出成本价核价
export function exportCostPricePricing(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/exportCostPricePricing',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}
//导出物料核价
export function exportMaterialCodePricing(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/exportMaterialCodePricing',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}
//导出核价代码
export function exportValencyCodePricing(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceAdjustProductConfig/exportValencyCodePricing',
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}


/* 配置项管理 */

/**新增和修改 */
export function priceQuotedItemConfigAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-item-config/addAndUpdate',
    method: 'post',
    data: parameter
  })
}

/**删除 */
export function priceQuotedItemConfigDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-item-config/delItemConfig',
    method: 'get',
    params: parameter
  })
}

/**批量删除 */
export function priceQuotedItemConfigDeleteBatch(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-item-config/delBatchItemConfig',
    method: 'get',
    params: parameter
  })
}


/**根据父id和名子获取下一层列表 */
export function priceQuotedItemConfigSubList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-item-config/getItemConfigList',
    method: 'get',
    params: parameter
  })
}

/**根据父id和名子获取下一层列表 */
export function priceQuotedItemConfigSubPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-item-config/getItemConfigPage',
    method: 'get',
    params: parameter
  })
}

/**根据父id获取树 */
export function priceQuotedItemConfigTreeList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-item-config/getItemConfigTree',
    method: 'get',
    params: parameter
  })
}

/**核价 权限 quotedItem:pricing */
export function priceQuotedItemConfigSetPrices(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-item-config/updateBatchItemConfig',
    method: 'post',
    data: parameter
  })
}

/* 配置项管理 END*/

/* 中控系统配置 */
export function priceQuotedZktListAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-zkt/addAndUpdateQuotedZkt',
    method: 'post',
    data: parameter
  })
}

/**删除 */
export function priceQuotedZktDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-zkt/delQuotedZkt',
    method: 'get',
    params: parameter
  })
}

/**详情 */
export function priceQuotedZktDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-zkt/priceQuotedZktDetail',
    method: 'get',
    params: parameter
  })
}

/**列表 */
export function priceQuotedZktList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-zkt/priceQuotedZktList',
    method: 'get',
    params: parameter
  })
}

/**列表 */
export function priceQuotedZktPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-zkt/priceQuotedZktPage',
    method: 'get',
    params: parameter
  })
}

/* 核价 */
export function priceQuotedZktSetPrice(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-zkt/updateBatchQuotedZkt',
    method: 'post',
    data: parameter
  })
}

/* 中控系统配置 END*/

/* 产品配置管理 */

/**新增和修改 */
export function priceQuotedProductAddOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-product/addAndUpdatePriceQuotedProduct',
    method: 'post',
    data: parameter
  })
}
/**删除 */
export function priceQuotedProductDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-product/delQuotedProduct',
    method: 'get',
    params: parameter
  })
}
/**详情 */
export function priceQuotedProductDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-product/priceQuotedProductDetail',
    method: 'get',
    params: parameter
  })
}
/**列表 */
export function priceQuotedProductList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-product/priceQuotedProductList',
    method: 'get',
    params: parameter
  })
}
/**核价 */
export function priceQuotedProductSetPrice(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-product/updateBatchQuotedProduct',
    method: 'post',
    data: parameter
  })
}

/**全部列表 */
export function priceQuotedZktListAll(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-zkt/priceQuotedZktList',
    method: 'get',
    params: parameter
  })
}

/**修改记录 */
export function productUpdateRecordList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/priceQuote/price-quoted-product-update-record/productUpdateRecordList',
    method: 'get',
    params: parameter
  })
}

/* 产品配置管理 END*/

/* 报价 */

/* 报价 END*/

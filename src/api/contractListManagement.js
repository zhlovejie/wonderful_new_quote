import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'




//特价说明
export function copyCPriceDesc(params) {
  return axios({
    baseURL: system.baseURL,
    url: 'sale-contract/updateSaleContractCPriceDesc',
    method: 'post',
    data: params
  })
}
//复制合同
export function copySoftContract(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/copyContract/' + params,
    method: 'post'
  })
}

// 提交审批（启动软件合同审批流程）
export function startProcess(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/startProcess/' + params,
    method: 'post'
  })
}

export function editContract(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/editContract',
    method: 'post',
    data: params
  })
}

// 获取销售合同列表
export function getSalesList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/query',
    method: 'get',
    params: parameter
  })
}

/**资质借用管理第四部 绑定合同专用接口， 条件查询销售合同分页列表 */
export function getSaleContractSalesList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/pageList',
    method: 'get',
    params: parameter
  })
}


// 获取销售合同列表
export function getSoftwareContractList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/query',
    method: 'get',
    params: parameter
  })
}


// 获取客户下拉列表
export function getcusSelectsList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'customer/queryList',
    method: 'get',
    params: parameter
  })
}
// 获取客户下拉列表
export function getcusSelectsListPage(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'customer/queryPage',
    method: 'get',
    params: parameter
  })
}
// 获取流程节点信息
export function getsaveAdditionalClause(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/sale-contract/saveAdditionalClause/${parameter.contractId}`,
    method: 'get'
  })
}


// 启动合同流程
export function startSaleContractProcess(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/startContractProcess',
    method: 'get',
    params: parameter
  })
}

// 删除销售合同
export function deleteContract(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/removeContract',
    method: 'post',
    params: parameter
  })
}

// 撤销销售合同
export function revocationContract(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/revocation',
    method: 'get',
    params: parameter
  })
}

// 删除软件合同
export function deleteSoftwareContract(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/removeContract',
    method: 'post',
    params: parameter
  })
}


// 获取流程节点信息
export function getApprovedNodeList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/process/getApprovedNodeList',
    method: 'get',
    params: parameter
  })
}

// 获取所有销售经理经理和区域经理
export function getListSaleContractUser(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salesman/getAllSalesman',
    method: 'get',
    params: parameter
  })
}
export function getListSalesman(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salesman/getCurrUserSalesman',
    method: 'get',
    params: parameter
  })
}
// 插入基本信息
export function saveEssentialInformation(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/saveEssentialInformation',
    method: 'post',
    data: data
  })
}

// 软件合同插入基本信息
export function softwareContractSaveEssentialInformation(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/saveEssentialInformation',
    method: 'post',
    data: data
  })
}

// 返回关联字典表 智能/非智能/软件/其他
export function getTarget(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/getTarget',
    method: 'get',
    params: parameter
  })
}
//获取代签合同详情
export function contractDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/purchase-contract/getPurchaseContractDetail',
    method: 'get',
    params: parameter
  })
}

/* 代签购物合同的详情（通过资质借用id获取） */
export function getPurchaseContractDetailByBorrowId(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/purchase-contract/getPurchaseContractDetailByBorrowId',
    method: 'get',
    params: parameter
  })
}


// 获取单个信息
export function getQueryOne(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'sale-contract/queryOne',
    method: 'get',
    params: parameter
  })
}

// 获取单个信息
export function getSoftwareContractQueryOne(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/queryOne',
    method: 'get',
    params: parameter
  })
}
/**根据资质借用id获取销售合同详情 */
export function saleContractDetailForBorrow(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/detailForBorrow',
    method: 'get',
    params: parameter
  })
}

// 常规非常规产品 根据不同的产品获取产品代码和产品数据
export function getProductType(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/getProductType',
    method: 'get',
    params: parameter
  })
}
// 转大写
export function turnTheCapital(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/electronicReceipt/rmb',
    method: 'get',
    params: parameter
  })
}
// 插入产品信息
export function saveProduct(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/saveProduct',
    method: 'post',
    data: data
  })
}

// 软件插入产品信息
export function saveSoftwareContractProduct(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/saveProduct',
    method: 'post',
    data: data
  })
}


// 插入结算方式表
export function saveSettlementMethod(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/saveSettlementMethod',
    method: 'post',
    data: data
  })
}

// 插入软件合同产品详情
export function saveProductPoints(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/updateProduct',
    method: 'post',
    data: data
  })
}


// 软件合同支付、验收信息、补充协议更新
export function updateSoftwareContract(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/updateSoftwareContract',
    method: 'post',
    data: data
  })
}


// 插入 运输方式／交货地址
export function saveDeliveryAddress(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/saveDeliveryAddress',
    method: 'post',
    data: data
  })
}

// 插入 乙方信息
export function saveBInformation(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/saveBInformation',
    method: 'post',
    data: data
  })
}

// 获取乙方信息
export function saveNewstCustomer(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/purchase-contract/getPurchaseContractNewstCustomer',
    method: 'get',
    params: parameter
  })
}

// 插入 软件合同乙方信息
export function saveSoftwareContractBInformation(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/saveBInformation',
    method: 'post',
    data: data
  })
}

// 6插入其他信息
export function saveOtherInfo(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/saveOtherInfo',
    method: 'post',
    data: data
  })
}
// 获取销售人员的微信及邮箱
export function mobilesId(params) {
  return axios({
    baseURL: system.baseURL,
    url: `user/getUserInfoById`,
    method: 'get',
    params: params
  })
}
//新增代签购货合同
export function purchaseAdd(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/purchase-contract/addOrUpdate',
    method: 'post',
    data: data
  })
}

// 7修改附加条款
export function saveAdditionalClause(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/saveAdditionalClause',
    method: 'post',
    data: data
  })
}
// 预览合同需要的接口
export function mobileTerminal(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/sale-contract/getLookDetail/${parameter.id}`,
    method: 'get'
  })
}

// 生成导出合同所需要的PDF
export function buildCreateWork(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: `/sale-contract/createWork/${parameter.id}`,
    method: 'get'
  })
}

// 生成导出合同所需要的PDF
export function buildSoftwareContractCreateWork(params) {
  return axios({
    baseURL: system.baseURL,
    url: `/software-contract/exportPdf`,
    method: 'get',
    params: params
  })
}


// 合同审核通过还是不通过
export function contractApproval(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/approval',
    method: 'post',
    data: data
  })
}

export function checkRemoveSettle(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/checkRemoveSettle',
    method: 'post',
    data: data
  })
}

// 软件合同审核通过还是不通过
export function softwareContractApproval(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/approval',
    method: 'post',
    data: data
  })
}


//删除合同
export function deleteQueryOne(parameter) {
  console.log(parameter)
  console.log(`/sale-contract/delete/${parameter.id}/${parameter.contractModifyFlag}`)
  let id = parameter.id || 0
  let contractModifyFlag = parameter.contractModifyFlag || 0
  return axios({
    baseURL: system.baseURL,
    url: `/sale-contract/delete/${id}/${contractModifyFlag}`,
    method: 'DELETE'
  })
}




//删除合同
export function deleteSoftwareContractQueryOne(parameter) {
  let id = parameter.id || 0
  let contractModifyFlag = parameter.contractModifyFlag || 0
  return axios({
    baseURL: system.baseURL,
    url: `/software-contract/delete/${id}/${contractModifyFlag}`,
    method: 'DELETE'
  })
}


// 合同短信接口
export function contractSms(contractId, contractNum) {
  return axios({
    baseURL: system.baseURL,
    url: `/contractSms/list?contractId=${contractId}&contractNum=${contractNum}`,
    method: 'get'
  })
}

// 获取拆分合同的 变动部分和非变动部分
export function getSplitProductTemp(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract-product-temp/getProductTemp',
    method: 'get',
    params: params
  })
}

// 获取拆分合同的 合同预览产品接口
export function getSplitApprovingProduct(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract-product-temp/getApprovingProduct',
    method: 'get',
    params: params
  })
}

// 插入拆分合同的产品信息
export function saveSplitProductTemp(data) {
  return axios({
    baseURL: system.baseURL,
    url: 'sale-contract-product-temp/saveProductTemp',
    method: 'post',
    data: data
  })
}

// 删除拆分合同的 变动部分和非变动部分
export function delSplitProductTemp(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract-product-temp/deleteProductTemp',
    method: 'get',
    params: params
  })
}


// 删除软件合同产品信息
export function delSoftwareContractProduct(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/deleteProduct',
    method: 'DELETE',
    params: params
  })
}


//获取审批节点
export function getApprovalNode() {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/getProduceNode',
    method: 'get'
  })
}

/**
 * 检测当前用户是否销售经理
 * @param {*} params
 */
export function checkCurrentNode(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/checkCurrentNode',
    method: 'get',
    params: params
  })
}
// 审批代签合同 
export function PurchaseContract(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/purchase-contract/approvalPurchaseContract',
    method: 'post',
    data: params
  })
}


/**
 * 拆分订单审批接口
 * @param {*} params
 */
export function approvalSplitProduct(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/approvalSplitProduct',
    method: 'post',
    params: params
  })
}

//验证产品信息能否可删除
export function checkDeletedProduct(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract-product/checkDeletedProduct',
    method: 'get',
    params: params
  })
}


export function getSoftwareProductVersions(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/softwareProduct/listData',
    method: 'get',
    params: params
  })
}
//复制合同
export function copyContract(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/copySaleContract',
    method: 'get',
    params: params
  })
}

//撤回软件合同
export function revocationSoftwareContract(params) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/revocation',
    method: 'get',
    params: params
  })
}

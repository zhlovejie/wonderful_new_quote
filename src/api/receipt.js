import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

/**
 * 获取收款单列表信息
 * @param parameter
 * @returns {*}
 */
export function getServiceList(parameter) {
  console.log('getServiceList manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/receipt/getPageList',
    method: 'get',
    params: parameter
  })
}

/**收款单 撤回 */
export function revocationReceipt(parameter) {
  console.log('getServiceList manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/receipt/revocation',
    method: 'get',
    params: parameter
  })
}

/**
 * 去新增页面
 * @param parameter
 * @returns {*}
 */
export function goAdd(parameter) {
  console.log('goAdd manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/receipt/goAdd',
    method: 'get',
    params: parameter
  })
}

/**
 * 收款单 查询合同列表
 * @param parameter
 * @returns {*}
 */
export function receiptSaleContract(parameter) {
  console.log('ReceiptSaleContract manages' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/listBySaleReceipt',
    method: 'get',
    params: parameter
  })
}

/**
 * 收款单 查询合同列表
 * 包含 收款金额 大于 合同金额的判断
 * @param parameter
 * @returns {*}
 */
export function receiptSaleContractNoType(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/listBySaleReceiptType',
    method: 'get',
    params: parameter
  })
}

/**
 * 销售管理 单据管理 选择合同 专用接口
 * 去除收款金额 大于 合同金额的判断
 * @param parameter
 * @returns {*}
 */
export function listSaleCOntractPageForOpenPaper(parameter) {
  return axios({
    baseURL: system.baseURL,
    //url: '/sale-contract/listBySaleReceiptType',
    url: '/sale-contract/listSaleCOntractPageForOpenPaper',
    method: 'get',
    params: parameter
  })
}

/**
 * 所有的软件合同分页列表
 * @param {} parameter 
 */
export function allSoftwareContract(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/software-contract/listBySaleReceipt',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取合同详细信息
 * @param parameter
 * @returns {*}
 */
export function getContractOne(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/queryOne',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取开户行信息
 * @param parameter
 * @returns {*}
 */
export function getAccountBankList() {
  console.log('getAccountBankList manages')
  return axios({
    baseURL: system.baseURL,
    url: '/accountBank/queryList',
    method: 'get'
  })
}

/**
 * 添加收款单数据
 * @param parameter
 * @returns {*}
 */
export function save(parameter) {
  console.log('save parameter', JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/receipt/save',
    method: 'post',
    data: parameter
  })
}

/**
 * 查看单据详细信息
 * @param parameter
 * @returns {*}
 */
export function receiptDetail(parameter) {
  console.log('receiptDetail ', JSON.stringify(parameter))
  const url = '/receipt/receiptDetail/' + parameter.id
  return axios({
    baseURL: system.baseURL,
    url: url,
    method: 'get'
  })
}
/**
 * 单据审核
 * @param parameter
 * @returns {*}
 */
export function receiptAudit(parameter) {
  console.log('receiptAudit ', JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/receipt/receiptAudit',
    method: 'get',
    params: parameter
  })
}

/**
 * 删除收款单
 * @param parameter
 * @returns {*}
 */
export function deleteReceipt(parameter) {
  console.log('deleteReceipt ', JSON.stringify(parameter))
  const url = '/receipt/delete/' + parameter.id
  return axios({
    baseURL: system.baseURL,
    url: url,
    method: 'delete'
  })
}

/**
 * 更新收款单数据
 * @param parameter
 * @returns {*}
 */
export function updateReceipt(parameter) {
  console.log('updateReceipt parameter', JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: 'receipt/updateReceipt',
    method: 'post',
    data: parameter
  })
}

/**
 * 根据软件合同id 获取合同产品信息
 * @param parameter
 * @returns {*}
 */
export function getSoftContractProductListById(parameter) {
  console.log('getSoftContractProductListById', JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: 'software-contract/getSoftContractProductListById',
    method: 'get',
    params: parameter
  })
}
//收款单选择预收款单选择
export function getDeductionList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: 'advances/getDeductionList',
    method: 'get',
    params: parameter
  })
}



export function getReceiptAgencyContractListById(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/agencyContract/pageListForReceipt',
    method: 'get',
    params: parameter
  })
}

export function getSoftContractListById(parameter) {
  console.log('getSoftContractListById', JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: 'software-contract/listBySaleReceipt',
    method: 'get',
    params: parameter
  })
}

//收款单，发货单，开票单，产品调度任务单：选择合同编号时，界面显示订单详情，下拉框带入 
export function productListByContract(parameter) {
  console.log('productListByContract', JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/productListByContract',
    method: 'get',
    params: parameter
  })
}


//----------------------退款单----------------------
/**
 * 退款单申请分页列表
 * @param {*} parameter 
 */
export function refundPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRefund/refund/pageList',
    method: 'get',
    params: parameter
  })
}
/**
 *  新增退款详情
 * @param {*} parameter 
 */
export function getListByRefundId(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/refund/refund-reality/getListByRefundId',
    method: 'get',
    params: parameter
  })
}
/**
 * 
 * 新增退款
 */
export function addRefundReality(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/refund/refund-reality/addRefundReality',
    method: 'post',
    data: parameter
  })
}
/**
 * 查询退款单详情
 * @param {*} parameter 
 */
export function refundDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRefund/refund/getRefundDetail',
    method: 'get',
    params: parameter
  })
}

/**
 * 销售退款单申请新增或者更新
 * @param {*} parameter 
 */
export function refundSaveOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRefund/refund/saveOrUpdateRefund',
    method: 'post',
    data: parameter
  })
}

/**
 * 销售退款单的审批
 * @param {*} parameter 
 */
export function refundApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRefund/refund/approvalRefund',
    method: 'post',
    data: parameter
  })
}

/**
 * 获取已审批完的合同列表
 * @param {*} parameter 
 */
export function refundGetApprovedSaleContract(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRefund/refund/getApprovedSaleContract',
    method: 'get',
    params: parameter
  })
}

/**
 * 通过合同id查询关联的收款单
 * @param {*} parameter 
 */
export function refundGetSaleContractReceipt(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRefund/refund/getSaleContractReceipt',
    method: 'get',
    params: parameter
  })
}

/**退款单 撤回 */
export function refundRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRefund/refund/revocation',
    method: 'get',
    params: parameter
  })
}

/**退款单 删除 */
export function refundDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRefund/refund/delRefund',
    method: 'get',
    params: parameter
  })
}



//----------------------退款单-END------------------

//----------------------赠送单----------------------
/**
 * 赠送单申请分页列表
 * @param {*} parameter 
 */
export function presentPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salePresent/present/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 查询赠送单详情
 * @param {*} parameter 
 */
export function presentDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salePresent/present/getPresentDetail',
    method: 'get',
    params: parameter
  })
}

/**
 * 赠送单的审批
 * @param {*} parameter 
 */
export function presentApproval(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salePresent/present/approvalPresent',
    method: 'post',
    data: parameter
  })
}

/**
 * 赠送单申请新增或者更新
 * @param {*} parameter 
 */
export function presentSaveOrUpdate(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salePresent/present/saveOrUpdatePresent',
    method: 'post',
    data: parameter
  })
}

/**赠送单 撤回 */
export function presentRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salePresent/present/revocation',
    method: 'get',
    params: parameter
  })
}

/**赠送单 删除 */
export function presentDel(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salePresent/present/delPresent',
    method: 'get',
    params: parameter
  })
}
//----------------------退款单-END------------------

//----------------------进款单----------------------
/**
 * 进款单分页列表
 * @param {*} parameter 
 */
export function incomePageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleIncome/income/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取进款单详情信息
 * @param {*} parameter 
 */
export function incomeDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleIncome/income/getIncomeDetail',
    method: 'get',
    params: parameter
  })
}
/**
 * 认领进款单
 * @param {*} parameter 
 */
export function incomeClaim(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleIncome/income/claimIncome',
    method: 'get',
    params: parameter
  })
}
/**
 * 销售进款单申请新增或者更新
 * @param {*} data 
 */
export function incomeSaveOrUpdate(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleIncome/income/saveOrUpdateIncome',
    method: 'post',
    data: data
  })
}
//----------------------进款单-END------------------


//----------------------赠送订单----------------------
/**赠送订单申请分页列表 */
export function presentOrderPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salePresent/presentOrder/presentOrderPageList',
    method: 'get',
    params: parameter
  })
}

/**赠送订单详情 */
export function presentOrderDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salePresent/presentOrder/getPresentOrderDetail',
    method: 'get',
    params: parameter
  })
}

/**下载赠送订单 */
export function presentOrderDownload(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/salePresent/presentOrder/download',
    method: 'get',
    params: parameter
  })
}

/**修改赠送订单 */
export function presentOrderUpdate(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/salePresent/presentOrder/updatePresentOrderDetail',
    method: 'post',
    data: data
  })
}
//----------------------赠送订单-END------------------


/**收款单列表金额汇总 */
export function receiptGetSumAmountByList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/receipt/getSumAmountByList',
    method: 'get',
    params: parameter
  })
}
//----------------------返款申请----------------------
/**返款申请  新增或者修改 */
export function qualificationBorrowRebatesAddAndUpdate(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/rebates/addAndUpdateRebates',
    method: 'post',
    data: data
  })
}

/**返款申请  审批 */
export function qualificationBorrowRebatesApprove(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/rebates/approveRebates',
    method: 'post',
    data: data
  })
}
/**返款申请  删除 */
export function qualificationBorrowRebatesDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/rebates/delRebates',
    method: 'get',
    params: parameter
  })
}

/**返款申请  详情 */
export function qualificationBorrowRebatesDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/rebates/getRebatesDetail',
    method: 'get',
    params: parameter
  })
}

/**开票单列表金额汇总 */
export function openpaperGetSumAmountByList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/openpaper/getSumAmountByList',
    method: 'get',
    params: parameter
  })
}
/**返款申请  列表 */
export function qualificationBorrowRebatesPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/rebates/getRebatesPageList',
    method: 'get',
    params: parameter
  })
}

/**进款单列表金额汇总 */
export function saleIncomeGetSumAmountByList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleIncome/income/getSumAmountByList',
    method: 'get',
    params: parameter
  })
}
/**返款申请  列表 */
export function qualificationBorrowRebatesRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/rebates/revocation',
    method: 'get',
    params: parameter
  })
}

/**退款单列表金额汇总 */
export function saleRefundGetSumAmountByList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/saleRefund/refund/getSumAmountByList',
    method: 'get',
    params: parameter
  })
}
/**返款申请  上传附件 */
export function qualificationBorrowRebatesUploadAttachment(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/rebates/uploadAttachment',
    method: 'get',
    params: parameter
  })
}


/**预收款单列表金额汇总 */
export function advancesGetSumAmountByList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/advances/getSumAmountByList',
    method: 'get',
    params: parameter
  })
}
//----------------------返款申请-END------------------

//----------------------业绩扣除单----------------------
/**业绩扣除单  新增或者修改 */
export function qualificationBorrowPerformanceDeductionAddAndUpdate(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/performance-deduction/addAndUpdatePerformanceDeduction',
    method: 'post',
    data: data
  })
}

/**业绩扣除单  审批 */
export function qualificationBorrowPerformanceDeductionApprove(data) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/performance-deduction/approvePerformanceDeduction',
    method: 'post',
    data: data
  })
}

/**业绩扣除单  删除 */
export function qualificationBorrowPerformanceDeductionDelete(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/performance-deduction/delPerformanceDeduction',
    method: 'get',
    params: parameter
  })
}

/**单据 导出 */
export function exportInvoiceExcel(url, params) {
  return axios({
    baseURL: system.baseURL,
    url: url,
    method: 'get',
    responseType: 'blob',
    params: params
  })
}

const _EXPORT_API_ = {
  1: '/invoice/exportList', //发货单
  2: '/delayedPayment/exportList', //延迟付款单
  3: '/receipt/exportList', //收款单
  4: '/sale-contract/exportOrder', //销售订单

  5: '/advances/exportList', //预收款单
  6: '/after-sale/exportList', //产品调试任务单
  7: '/openpaper/exportList', //开票单
  8: '/api/exportList', //核价单
  9: '/saleIncome/income/exportList', //进款单
  10: '/saleRefund/refund/exportList', //退款单
  11: '/salePresent/present/exportList', //赠送单
  12: 'saleReport/exportList', // 销售报表 订单详情
}
export function exprotAction(type, param, fileName = 'download.xls') {
  return exportInvoiceExcel(_EXPORT_API_[type], param)
    .then((res) => {
      console.log(res)
      if (res instanceof Blob) {
        const isFile = res.type === 'application/vnd.ms-excel'
        const isJson = res.type === 'application/json'
        if (isFile) {
          //返回文件 则下载
          const objectUrl = URL.createObjectURL(res)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.style = 'display: none'
          a.href = objectUrl
          a.download = `${fileName}.xls`
          a.click()
          document.body.removeChild(a)
          return {
            code: 200,
            msg: '下载成功'
          }
        } else if (isJson) {
          //返回json处理
          return new Promise(resolve => {
            var reader = new FileReader()
            reader.onload = function (e) {
              let _res = null
              try {
                _res = JSON.parse(e.target.result)
              } catch (err) {
                _res = null
              }
              if (_res !== null) {
                if (_res.code == 500) {
                  resolve({
                    code: 500,
                    msg: _res.msg
                  })
                } else {
                  resolve({
                    code: 200,
                    msg: '下载成功'
                  })
                }
              } else {
                resolve({
                  code: 500,
                  msg: `json解析出错 e.target.result：${e.target.result}`
                })
              }
            }
            try {
              reader.readAsText(res)
            } catch (err) {
              resolve({
                code: 500,
                msg: err.message
              })
            }
          })
        } else {
          return {
            code: 500,
            msg: `不支持的类型:${res}`
          }
        }
      } else {
        return {
          code: 500,
          msg: `返回数据不是Blob类型:${typeof res}`
        }
      }
    })
    .catch((err) => {
      return {
        code: 500,
        msg: `请求出错：${err.message}`
      }
    })
}
/**业绩扣除单  详情 */
export function qualificationBorrowPerformanceDeductionDetail(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/performance-deduction/getPerformanceDeductionDetail',
    method: 'get',
    params: parameter
  })
}

/**业绩扣除单  列表 */
export function qualificationBorrowPerformanceDeductionPageList(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/performance-deduction/getPerformanceDeductionPageList',
    method: 'get',
    params: parameter
  })
}

/**业绩扣除单  撤回 */
export function qualificationBorrowPerformanceDeductionRevocation(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/performance-deduction/revocation',
    method: 'get',
    params: parameter
  })
}

/**业绩扣除单  上传附件 */
export function qualificationBorrowPerformanceDeductionUploadAttachment(parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/qualificationBorrow/performance-deduction/uploadAttachment',
    method: 'get',
    params: parameter
  })
}

//----------------------业绩扣除单-END------------------

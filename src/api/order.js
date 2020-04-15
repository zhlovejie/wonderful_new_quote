import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

//根据合同id获取销售订单详情
export function orderDetail (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/orderDetail',
    method: 'get',
    params: parameter
  })
}

// 从销售合同列表中获取销售订单列表（已审批的就是订单）
export function getOrderList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/queryOrder',
    method: 'get',
    params: parameter
  })
}

// 下载销售订单
export function orderDownload (parameter) {
  console.log('获取销售订单列表', parameter)
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/orderDownload',
    method: 'get',
    params: parameter
  })
}

// 字典表
export function getTarget (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/getTarget',
    method: 'get',
    params: parameter
  })
}

// 获取所有部门客户下拉框用
export function getAllDepList (parameter) {
  console.log('获取所有部门客户', parameter)
  return axios({
    baseURL: system.baseURL,
    url: '/customer/listAll',
    method: 'get',
    params: parameter
  })
}

// 获取销售合同中的所有销售人员（已经提交过销售合同的）
export function getAllContractSalesman () {
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract/getAllSalesman',
    method: 'get'
  })
}
// 修改合同产品信息
export function save (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/sale-contract-product/edit',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}

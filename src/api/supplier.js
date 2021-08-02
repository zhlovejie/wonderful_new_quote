import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
let materialBaseUrl = system.baseURL
// eslint-disable-next-line no-unused-vars
const api = {
  manageSupplier: '/manageSupplier/page',
  SupplierRevocation: '/manageSupplier/revocation',

}

//供应商列表
export function manageSupplier(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.manageSupplier,
    method: 'get',
    params: parameter
  })
}
//供应商撤回
export function SupplierRevocation(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: api.SupplierRevocation,
    method: 'get',
    params: parameter
  })
}

import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

export function getAccountBankList (parameter) {
  console.log('getAccountBankList  : ' + JSON.stringify(parameter))
  return axios({
    baseURL: system.baseURL,
    url: '/accountBank/query',
    method: 'get',
    params: parameter
  })
}
export function saveBank (data) {
  console.log('saveBank  : ' + JSON.stringify(data))
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/accountBank/save',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
export function editBank (data) {
  console.log('editBank  : ' + JSON.stringify(data))
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/accountBank/modify',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
export function deleteBank (data) {
  console.log('deleteBank  : ' + JSON.stringify(data))
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/accountBank/remove',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}

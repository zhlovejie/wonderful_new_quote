import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

const baseURL = system.materialBaseUrl
//仓储管理-入库申请列表接口
export function storageList(parameter) {
  return axios({
    baseURL,
    url: '/storageList/listStorage',
    method: 'get',
    params: parameter
  })
}
// 查询入库申请的物料信息
export function storageMaterialList(parameter) {
  return axios({
    baseURL,
    url: '/storageList/storageMaterialList',
    method: 'get',
    params: parameter
  })
}


// export function schemeNodeRelationAdd(parameter) {
//   return axios({
//     baseURL,
//     url: '/project/development-project-scheme-node-relation/saveSchemeNodeInfo',
//     method: 'post',
//     data: parameter
//   })
// }

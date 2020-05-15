import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'


//---------------------制度文档管理-----------------------
/**目录列表查询接口 */
export function docDirList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/doc/oa-doc-dir/listDocDir',
    method: 'get',
    params: parameter
  })
}

/**目录删除接口 dirId*/
export function docDirDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/doc/oa-doc-dir/removeDocDir',
    method: 'post',
    data: parameter
  })
}

/**创建目录接口 */
export function docDirAdd (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/doc/oa-doc-dir/saveNewDir',
    method: 'post',
    data: parameter
  })
}

/**文件列表查询接口 */
export function docFileList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/doc/oa-doc-file/listDocFile',
    method: 'get',
    params: parameter
  })
}

/**文件删除接口 id*/
export function docFileDelete (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/doc/oa-doc-file/removeDocFile',
    method: 'post',
    data: parameter
  })
}

/**创建文件接口 */
export function docFileAddOrUpdate (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/doc/oa-doc-file/saveOrUpdateDocFile',
    method: 'post',
    data: parameter
  })
}
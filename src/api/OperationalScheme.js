import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

// 文件管理列表
export function getFileManagementList (parameter) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: 'FileManagement/queryList',
    method: 'get',
    params: parameter
  })
}
// 新增文件管理
export function saveFileManagement (parameter) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: 'FileManagement/save',
    method: 'post',
    data: parameter
  })
}
// 修改文件管理
export function editFileManagement (parameter) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: 'FileManagement/edit',
    method: 'post',
    data: parameter
  })
}
// 删除文件管理
export function delFileManagement (parameter) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: 'FileManagement/del',
    method: 'get',
    params: parameter
  })
}

export function getFile (parameter) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: 'FileManagement/getFile',
    method: 'get',
    params: parameter
  })
}

export const downloadFile = (url) => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none' // 防止影响页面
  iframe.style.height = 0 // 防止影响页面
  iframe.src = url
  document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
  // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
  setTimeout(() => {
    iframe.remove()
  }, 5 * 60 * 1000)
}

//企业资质预览下载
export function enterpriseQualificationDownload (parameter,timeout = 1000 * 120) {
  return axios({
    baseURL: system.baseURL, // 服务器ip和端口
    url: '/qualification/qualificationDownload',
    method: 'post',
    data: parameter,
    timeout:timeout
  })
}
//生成下载链接
export function makeDownloadUrl(url){
  let tokenItem = localStorage.getItem('pro__Access-Token')
    let token = ''
    if(tokenItem){
      try{
        token = JSON.parse(tokenItem).value
      }catch(err){
        token = ''
      }
    }
    let param = []
    param.push(`Authorization=${token}`)
    param.push(`path=${encodeURIComponent(url)}`)
  return `${system.baseURL}/FileManagement/fileDownload?${param.join('&')}`
}


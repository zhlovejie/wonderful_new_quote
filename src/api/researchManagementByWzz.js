import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'
//取消请求
//import {CancelToken} from 'axios'

//---------------------项目节点选项配置-----------------------
const baseURL = system.materialBaseUrl
//模式详情查询
export function schemeNodeRelationDetail(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-scheme-node-relation/getSchemeNodeInfoDetail',
    method: 'get',
    params: parameter
  })
}

//模式详情查询(项目进程设置中所用)
export function getSchemeNodeInfoDetailByProjectId(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-stage-join/getSchemeNodeInfoDetailByProjectId',
    method: 'get',
    params: parameter
  })
}

//查询项目进程设置信息(项目默认参与人的查询)
export function getProjectStageProcessJoinDetal(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-stage-join/getProjectStageProcessJoinDetal',
    method: 'get',
    params: parameter
  })
}

//模式列表查询
export function schemeNodeRelationList(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-scheme-node-relation/listSchemeNodeRelation',
    method: 'get',
    params: parameter
  })
}

//模式列表全部查询
export function listAllSchemeNodeRelation(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-scheme-node-relation/listAllSchemeNodeRelation',
    method: 'get',
    params: parameter
  })
}

export function schemeNodeRelationDelete(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-scheme-node-relation/removeSchemeNodeInfo',
    method: 'post',
    data: parameter
  })
}

export function schemeNodeRelationAdd(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-scheme-node-relation/saveSchemeNodeInfo',
    method: 'post',
    data: parameter
  })
}

export function schemeNodeRelationUpdate(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-scheme-node-relation/updateSchemeNodeInfo',
    method: 'post',
    data: parameter
  })
}

//---------------------项目节点选项配置-----------------------

//---------------------项目节点关联项配置-----------------------

export function nodeInfoDetail(parameter) {
  return axios({
    baseURL,
    url: '/project/node-info/getNodeInfoDetail',
    method: 'get',
    params: parameter
  })
}

export function nodeInfoList(parameter) {
  return axios({
    baseURL,
    url: '/project/node-info/listNodeInfo',
    method: 'get',
    params: parameter
  })
}

export function nodeInfoListAll(parameter) {
  return axios({
    baseURL,
    url: '/project/node-info/listNodeInfoAll',
    method: 'get',
    params: parameter
  })
}

export function nodeInfoDelete(parameter) {
  return axios({
    baseURL,
    url: '/project/node-info/removeNodeInfo',
    method: 'post',
    data: parameter
  })
}

export function nodeInfoAdd(parameter) {
  return axios({
    baseURL,
    url: '/project/node-info/saveNodeInfo',
    method: 'post',
    data: parameter
  })
}

export function nodeInfoUpdate(parameter) {
  return axios({
    baseURL,
    url: '/project/node-info/updateNodeInfo',
    method: 'post',
    data: parameter
  })
}

//---------------------项目节点关联项配置-----------------------


//---------------------项目列表(项目进度管理)-----------------------

//分页查询项目列表(管理人员所用)
export function listProjectAllPageList(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-all-info/listProjectAllInfo',
    method: 'get',
    params: parameter
  })
}

//查询项目详情
export function listProjectAllDetail(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-all-info/getProjectAllInfoDetail',
    method: 'get',
    params: parameter
  })
}

//项目新增
export function listProjectAllAdd(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-all-info/saveProductAllInfo',
    method: 'post',
    data: parameter
  })
}

//项目修改
export function listProjectAllUpdate(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-all-info/updateProductAllInfo',
    method: 'post',
    data: parameter
  })
}

//完结项目
export function finishProjectStatus(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-all-info/finishProjectStatus',
    method: 'post',
    data: parameter
  })
}

//更换项目负责人
export function changeProductChargeUser(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-all-info/changeProductChargeUser',
    method: 'post',
    data: parameter
  })
}

//立项
export function addProjectAllJoin(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-all-info/addProjectAllJoin',
    method: 'post',
    data: parameter
  })
}

//通过会议编码查询会议记录详情接口
export function getMeetingRecordDetail(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-all-info/getMeetingRecordDetail',
    method: 'get',
    params: parameter
  })
}

//新增项目进程设置信息 (项目进程设置)
export function saveOrUpdateProjectAllInfoStage(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-stage-join/saveOrUpdateProjectAllInfoStage',
    method: 'post',
    data: parameter
  })
}

//查询立项的项目参与人
export function listProjectAllJoin(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-all-info/listProjectAllJoin',
    method: 'get',
    params: parameter
  })
}

//查询项目进程详情信息（查询项目进度信息时所用）
export function getProjectStageProcessDetail(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-stage-join/getProjectStageProcessDetail',
    method: 'get',
    params: parameter
  })
}

//资料输出权限列表查询 (项目进程配置 设置权限类型1)
export function listTrailAuthorityConf(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-trail-authority-conf/listTrailAuthorityConf',
    method: 'get',
    params: parameter
  })
}

//新增资料输出权限 (项目进程配置 设置权限类型1)
export function saveProjectFileTrailAuthorityConf(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-trail-authority-conf/saveProjectFileTrailAuthorityConf',
    method: 'post',
    data: parameter
  })
}

//查询设计模块文档权限配置明细(项目进程配置 设置权限类型2)
export function getAuthorityConfDetail(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-design-authority-conf/getAuthorityConfDetail',
    method: 'get',
    params: parameter
  })
}

//新增或修改设计模块文档权限配置(项目进程配置 设置权限类型2)
export function saveAuthorityConf(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-design-authority-conf/saveAuthorityConf',
    method: 'post',
    data: parameter
  })
}

//---------------------项目列表(项目进度管理)-----------------------

//---------------------我的项目处理(第三步试制资料)-----------------------

//查询个人提交的试制资料审批单数据
export function getPersonTrailConfDetail(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-out/getPersonTrailConfDetail',
    method: 'get',
    params: parameter
  })
}

//上传个人资料：保存或提交审核
export function uploadFileTrailConfPerson(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-out/uploadFileTrailConfPerson',
    method: 'post',
    data: parameter
  })
}

//部门资料的提交审核
export function uploadFileTrailConfDepartment(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-out/uploadFileTrailConfDepartment',
    method: 'post',
    data: parameter
  })
}

//试制资料的完结
export function finishTrailFileStage(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-out/finishTrailFileStage',
    method: 'post',
    data: parameter
  })
}

//导入bom excel
export function importBomExcel(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-out/importBomExcel',
    method: 'post',
    data: parameter
  })
}

//物料单详情（查看）
export function getMaterialFormDetail(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-material-form/getMaterialFormDetail',
    method: 'get',
    params: parameter
  })
}

//---------------------我的项目处理(第三步试制资料)-----------------------

//---------------------我的项目处理(第11步 研发项目管理-归档资料文件管理)-----------------------

//查询个人提交的配置资料审批单数据
export function getPersonTrailConfDetail_11(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-gather/getPersonTrailConfDetail',
    method: 'get',
    params: parameter
  })
}

//导入bom excel
export function importBomExcel_11(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-gather/importBomExcel',
    method: 'post',
    data: parameter
  })
}

//查看当前用户拥有的资料权限
export function listProjectFileAuthority_11(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-gather/listProjectFileAuthority',
    method: 'get',
    params: parameter
  })
}

//部门资料的提交审核
export function uploadFileTrailConfDepartment_11(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-gather/uploadFileTrailConfDepartment',
    method: 'post',
    data: parameter
  })
}

//上传个人资料：保存或提交审核
export function uploadFileTrailConfPerson_11(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-gather/uploadFileTrailConfPerson',
    method: 'post',
    data: parameter
  })
}

//归档资料的完结
export function finishGatherFileStage_11(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-file-gather/finishGatherFileStage',
    method: 'post',
    data: parameter
  })
}

//物料单详情（查看）
export function getMaterialFormDetail11(parameter) {
  return axios({
    baseURL,
    url: '/project/development-project-gather-material-form/getMaterialFormDetail',
    method: 'get',
    params: parameter
  })
}
//---------------------我的项目处理(第11步 研发项目管理-归档资料文件管理)-----------------------

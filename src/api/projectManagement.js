import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

// eslint-disable-next-line no-unused-vars
//  项目管理
const api = {

  pageDevelopmentCraftDevRecoveApply: '/project/development-project-patent-apply/pageDevelopmentCraftDevRecoveApply',
  pageDevelopmentCraftSave: '/project/development-project-patent-apply/save',
  listProjectAllInfoDropDown: '/project/development-project-all-info/listProjectAllInfoDropDown',
  listProjectgetDetail: '/project/development-project-patent-apply/getDetail',
  listProjectgetDelete: '/project/development-project-patent-apply/delete',
  acceptDevelopmentProjectPatentApply: '/project/development-project-patent-apply/acceptDevelopmentProjectPatentApply',
  finishDevelopmentProjectPatentApply: '/project/development-project-patent-apply/finishDevelopmentProjectPatentApply',
  patentUploadDevelopmentProjectPatentApply: '/project/development-project-patent-apply/patentUploadDevelopmentProjectPatentApply',
  pageDevelopmentProjectCheckApply: '/project/development-project-check-apply/pageDevelopmentProjectCheckApply',
  pageDevelopmentSave: '/project/development-project-check-apply/save',
  pageDevelopmentgetDetail: '/project/development-project-check-apply/getDetail',
  pageDevelopmentgetDelete: '/project/development-project-check-apply/delete',
  acceptDevelopmentProjectCheckApply: '/project/development-project-check-apply/acceptDevelopmentProjectCheckApply',
  finishDevelopmentProjectCheckApply: '/project/development-project-check-apply/finishDevelopmentProjectCheckApply',
  managementUploadDevelopmentProjectCheckApply: '/project/development-project-check-apply/managementUploadDevelopmentProjectCheckApply',
  managementUpdate: '/project/development-project-check-apply/update',


}
/*
检验报告修改*/
export function managementUpdate(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.managementUpdate,
    method: 'post',
    data: parameter
  })
}
/*
检验报告上传*/
export function managementUploadDevelopmentProjectCheckApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.managementUploadDevelopmentProjectCheckApply,
    method: 'post',
    data: parameter
  })
}

/*
检验报告完结*/
export function finishDevelopmentProjectCheckApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.finishDevelopmentProjectCheckApply,
    method: 'get',
    params: parameter
  })
}
/*
检验报告接受*/
export function acceptDevelopmentProjectCheckApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.acceptDevelopmentProjectCheckApply,
    method: 'get',
    params: parameter
  })
}

/*
检验报告删除*/
export function pageDevelopmentgetDelete(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentgetDelete,
    method: 'get',
    params: parameter
  })
}

/*
检验报告详情*/
export function pageDevelopmentgetDetail(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentgetDetail,
    method: 'get',
    params: parameter
  })
}
/*
检验报告新增*/
export function pageDevelopmentSave(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentSave,
    method: 'post',
    data: parameter
  })
}

/*
检验报告*/
export function pageDevelopmentProjectCheckApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentProjectCheckApply,
    method: 'get',
    params: parameter
  })
}

/*
项目专利上传*/
export function patentUploadDevelopmentProjectPatentApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.patentUploadDevelopmentProjectPatentApply,
    method: 'post',
    data: parameter
  })
}

/*
项目专利申请完结*/
export function finishDevelopmentProjectPatentApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.finishDevelopmentProjectPatentApply,
    method: 'get',
    params: parameter
  })
}

/*
项目专利申请接受*/
export function acceptDevelopmentProjectPatentApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.acceptDevelopmentProjectPatentApply,
    method: 'get',
    params: parameter
  })
}
/*
项目专利申请删除*/
export function listProjectgetDelete(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.listProjectgetDelete,
    method: 'get',
    params: parameter
  })
}
/*
项目专利申请详情*/
export function listProjectgetDetail(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.listProjectgetDetail,
    method: 'get',
    params: parameter
  })
}
/*
分页查询项目专利申请*/
export function pageDevelopmentCraftDevRecoveApply(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentCraftDevRecoveApply,
    method: 'get',
    params: parameter
  })
}
/*
新增项目专利申请*/
export function pageDevelopmentCraftSave(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.pageDevelopmentCraftSave,
    method: 'post',
    data: parameter
  })
}
/* 申请立项项目*/
export function listProjectAllInfoDropDown(parameter) {
  return axios({
    baseURL: system.materialBaseUrl,
    url: api.listProjectAllInfoDropDown,
    method: 'get',
    params: parameter
  })
}

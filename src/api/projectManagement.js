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

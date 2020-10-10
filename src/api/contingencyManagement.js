import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'

/*--应急管理-药品物资管理接口---------------------------------*/
//新增或者修改
export function emergencyMedicineAddOrUpdate (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyMedicine/addOrUpdate',
    method: 'post',
    data: params
  })
}
//删除
export function emergencyMedicineDel (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyMedicine/delete',
    method: 'post',
    data: params
  })
}

export function emergencyMedicineDetail (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyMedicine/detail',
    method: 'get',
    params: params
  })
}
//分页列表
export function emergencyMedicineList (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyMedicine/pageList',
    method: 'get',
    params: params
  })
}
//补货时展示的所有商品分页列表
export function emergencyMedicineReplenishmentList (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyMedicine/pageListForReplenishment',
    method: 'get',
    params: params
  })
}
/*--应急管理-药品物资管理接口-------END--------------------------*/


/*--应急管理-药品柜领取记录接口---------------------------------*/
export function emergencyCabinetReceiveRecordList (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyCabinetReceiveRecord/pageList',
    method: 'get',
    params: params
  })
}
/*--应急管理-药品柜领取记录接口-------END--------------------------*/



/*--应急管理-药品柜货道信息（库存）接口---------------------------------*/
//获取补货所要展示的货道信息
export function emergencyCabinetInventoryGetAisleForReplenishment (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyCabinetInventory/getAisleForReplenishment',
    method: 'get',
    params: params
  })
}
//根据药品柜id查询货道信息
export function emergencyCabinetInventoryListByCabinet (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyCabinetInventory/listByCabinet',
    method: 'get',
    params: params
  })
}

//根据药品柜id查询货道信息
export function emergencyCabinetInventoryGetGoods (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyCabinetInventory/getGoods',
    method: 'post',
    data: params
  })
}
//补货
export function emergencyCabinetInventoryReplenishment (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyCabinetInventory/replenishment',
    method: 'post',
    data: params
  })
}

/*--应急管理-药品柜货道信息（库存）接口-------END--------------------------*/

/*--应急管理-药品柜补货记录接口---------------------------------*/
//根据药品柜id查询分页列表
export function emergencyCabinetReplenishmentList (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyCabinetReplenishment/pageList',
    method: 'get',
    params: params
  })
}
/*--应急管理-药品柜补货记录接口-------END--------------------------*/


/*--应急管理-药品柜接口---------------------------------*/
export function emergencyMedicineCabinetAdd (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyMedicineCabinet/add',
    method: 'post',
    data: params
  })
}

export function emergencyMedicineCabinetList (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyMedicineCabinet/pageList',
    method: 'get',
    params: params
  })
}
/*--应急管理-药品柜接口-------END--------------------------*/


/*--应急管理-药品柜类型接口------------------------------------*/
export function emergencyCabinetTypeList (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyCabinetType/pageList',
    method: 'get',
    params: params
  })
}

export function emergencyCabinetTypeDetail (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyCabinetType/detail',
    method: 'get',
    params: params
  })
}

export function emergencyCabinetTypeDel (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyCabinetType/delete',
    method: 'post',
    data: params
  })
}

export function emergencyCabinetTypeAddOrUpdate (params) {
  return axios({
    baseURL: system.baseURL,
    url: '/emergencyCabinetType/addOrUpdate',
    method: 'post',
    data: params
  })
}

/*--应急管理-药品柜类型接口-------END--------------------------*/
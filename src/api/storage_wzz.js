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

//仓储管理-入库 - 统一撤回
export function storageRevocation(parameter) {
  return axios({
    baseURL,
    url: '/storageList/revocation',
    method: 'get',
    params: parameter
  })
}

//仓储管理-入库申请列表接口
export function storageDelete(parameter) {
  return axios({
    baseURL,
    url: '/storageList/delete',
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

// 仓储管理-赠品入库申请表接口 - 新增或修改
export function giftSaveAndUpdate(parameter) {
  return axios({
    baseURL,
    url: '/storageGiveApply/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
// 仓储管理-赠品入库申请表接口 - 撤回新增或修改
export function giftRevocation(parameter) {
  return axios({
    baseURL,
    url: '/storageGiveApply/revocation',
    method: 'get',
    params: parameter
  })
}

// 仓储管理-赠品入库申请表接口 - 详情
export function giftDetail(parameter) {
  return axios({
    baseURL,
    url: '/storageGiveApply/getDetail',
    method: 'get',
    params: parameter
  })
}

// 仓储管理-赠品入库申请表接口 - 审批
export function giftApproval(parameter) {
  return axios({
    baseURL,
    url: '/storageGiveApply/approval',
    method: 'post',
    data: parameter
  })
}

/**撤销（type入库类型(1赠送入库，2产品返修入库,3安装不良品入库，4退货入库，5采购入库-来料检验,6委外检验)） */
export function storageRevocation2(parameter) {
  return axios({
    baseURL,
    url: '/storage/revocation',
    method: 'get',
    params: parameter
  })
}




// 入库仓库
export function getWarehouseList(parameter) {
  return axios({
    baseURL,
    url: '/base/management/getList',
    method: 'get',
    params: parameter
  })
}

//-------仓储管理-产成品返修入库申请表接口

/**仓储管理-产成品返修入库申请表接口 - 添加修改 */
export function storageRepairAddOrUpdate(parameter) {
  return axios({
    baseURL,
    url: '/storageRepairApply/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}
/**仓储管理-产成品返修入库申请表接口 - 撤回 */
export function storageRepairRevocation(parameter) {
  return axios({
    baseURL,
    url: '/storageRepairApply/revocation',
    method: 'get',
    params: parameter
  })
}

/**仓储管理-产成品返修入库申请表接口 - 详情 */
export function storageRepairDetail(parameter) {
  return axios({
    baseURL,
    url: '/storageRepairApply/getDetail',
    method: 'get',
    params: parameter
  })
}

/**仓储管理-产成品返修入库申请表接口 - 审批 */
export function storageRepairApproval(parameter) {
  return axios({
    baseURL,
    url: '/storageRepairApply/approval',
    method: 'post',
    data: parameter
  })
}

/**仓储管理-不良品入库申请表接口 - 新增或修改 */
export function storageRejectsAddOrUpdate(parameter) {
  return axios({
    baseURL,
    url: '/storageRejectsApply/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}

/**仓储管理-不良品入库申请表接口 - 撤回 */
export function storageRejectsRevocation(parameter) {
  return axios({
    baseURL,
    url: '/storageRejectsApply/revocation',
    method: 'get',
    params: parameter
  })
}

/**仓储管理-不良品入库申请表接口 - 详情 */
export function storageRejectsDetail(parameter) {
  return axios({
    baseURL,
    url: '/storageRejectsApply/getDetail',
    method: 'get',
    params: parameter
  })
}

/**仓储管理-不良品入库申请表接口 - 审批 */
export function storageRejectsApproval(parameter) {
  return axios({
    baseURL,
    url: '/storageRejectsApply/approval',
    method: 'post',
    data: parameter
  })
}



// =========入库单==========
export function storagePageList(parameter) {
  return axios({
    baseURL,
    url: '/storage/listStorage',
    method: 'get',
    params: parameter
  })
}

export function storageDetail(parameter) {
  return axios({
    baseURL,
    url: '/storage/getDetail',
    method: 'get',
    params: parameter
  })
}

/**入库记录 */
export function storageRecords(parameter) {
  return axios({
    baseURL,
    url: '/storage/listStorageLogByStorageId',
    method: 'get',
    params: parameter
  })
}

/**统计单据 */
export function storageStatistics(parameter) {
  return axios({
    baseURL,
    url: '/storage/statistics',
    method: 'get',
    params: parameter
  })
}

/**添加入库单 */
export function storageAddOrUpdate(parameter) {
  return axios({
    baseURL,
    url: '/storage/saveStorage',
    method: 'post',
    data: parameter
  })
}

/**单条入库操作 */
export function storageSingleUpdate(parameter) {
  return axios({
    baseURL,
    url: '/storage/updateStorage',
    method: 'post',
    data: parameter
  })
}

/**批量入库操作 */
export function storageBatchUpdate(parameter) {
  return axios({
    baseURL,
    url: '/storage/updateStorageList',
    method: 'post',
    data: parameter
  })
}

/**列表物料搜索 */
export function storageMaterialList1(parameter) {
  return axios({
    baseURL,
    url: '/storage/storageMaterialList',
    method: 'get',
    params: parameter
  })
}

/**仓位列表 */
export function instantPositionList(parameter) {
  return axios({
    baseURL,
    url: '/inventory/instant-position/getList',
    method: 'get',
    params: parameter
  })
}

/**仓位列表 */
export function instantPositionPageList(parameter) {
  return axios({
    baseURL,
    url: '/inventory/instant-position/getListByPage',
    method: 'get',
    params: parameter
  })
}

/**容器托盘列表 */
export function containerPalletList(parameter) {
  return axios({
    baseURL,
    url: '/base/container-pallet/getList',
    method: 'get',
    params: parameter
  })
}

/**根据库区id获取下级货架和库位信息 */
export function getShelvesByAreaId(parameter) {
  return axios({
    baseURL,
    // url: '/inventory/instant-position/getShelvesByAreaId',
    url: '/inventory/instant-position/getShelvesByAreaIdIsBinding',
    method: 'get',
    params: parameter
  })
}

/**根据库区id获取下级货架和库位信息 */
export function getShelvesByAreaId2(parameter) {
  return axios({
    baseURL,
    url: '/inventory/instant-position/getShelvesByAreaId',
    method: 'get',
    params: parameter
  })
}

// ======出库申请单

/**审批 */
export function exWarehouseApplyApproval(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouseApply/approval',
    method: 'post',
    data: parameter
  })
}

/**新增或修改 */
export function exWarehouseApplyAddOrUpdate(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouseApply/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}

/**删除 */
export function exWarehouseApplyDelete(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouseApply/delete',
    method: 'get',
    params: parameter
  })
}

/**查询详情 */
export function exWarehouseApplyDetail(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouseApply/getDetail',
    method: 'get',
    params: parameter
  })
}

/**获取物料信息 */
export function exWarehouseApplyGetMaterial(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouseApply/getMaterial',
    method: 'get',
    params: parameter
  })
}

/**分页查询 */
export function exWarehouseApplyPageList(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouseApply/listExWarehouse',
    method: 'get',
    params: parameter
  })
}

/**撤销 */
export function exWarehouseApplyRevocation(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouseApply/revocation',
    method: 'get',
    params: parameter
  })
}



// ======出库申请单END


// ======出库单

/**查询详情 */
export function exWarehouseDetail(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouse/getDetail',
    method: 'get',
    params: parameter
  })
}

/**查询物料信息 */
export function exWarehouseGetMaterial(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouse/getMaterial',
    method: 'get',
    params: parameter
  })
}

/**分页查询 */
export function exWarehousePageList(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouse/listExWarehouse',
    method: 'get',
    params: parameter
  })
}

/**出库记录 */
export function exWarehouseRecords(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouse/listExWarehouseLogByExWarehouseId',
    method: 'get',
    params: parameter
  })
}

/**统计单据 */
export function exWarehouseStatistics(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouse/statistics',
    method: 'get',
    params: parameter
  })
}

/**出库操作 */
export function exWarehouseUpdate(parameter) {
  return axios({
    baseURL,
    url: '/exWarehouse/updateExWarhouse',
    method: 'post',
    data: parameter
  })
}
// ======出库单 END


// ======人工盘点
/**审批 */
export function artificialInventoryApproval(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/approval',
    method: 'post',
    data: parameter
  })
}

/**导入盘点详情 */
export function artificialInventoryImportArtificialInventory(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/importArtificialInventory',
    method: 'post',
    responseType:'blob',
    data: parameter
  })
}

/**新增或修改 */
export function artificialInventoryAddOrUpdate(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/saveAndUpdate',
    method: 'post',
    data: parameter
  })
}


/**删除 */
export function artificialInventoryDelete(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/delete',
    method: 'get',
    params: parameter
  })
}

/**下载人工盘点 */
export function artificialInventoryExportExcel(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/exportExcel',
    method: 'get',
    responseType:'blob',
    params: parameter
  })
}

/**完结 */
export function artificialInventoryFinish(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/finish',
    method: 'get',
    params: parameter
  })
}

/**详情数据 */
export function artificialInventoryGetDetail(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/getDetail',
    method: 'get',
    params: parameter
  })
}

/**盘点计划明细 */
export function artificialInventoryGetListByPage(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/getListByPage',
    method: 'get',
    params: parameter
  })
}

/**盘点 */
export function artificialInventoryInventory(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/inventory',
    method: 'get',
    params: parameter
  })
}

/**盘点计划分页查询 */
export function artificialInventoryListArtificialInventory(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/listArtificialInventory',
    method: 'get',
    params: parameter
  })
}

/**盘点详情分页查询 */
export function artificialInventoryListInventory(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/listInventory',
    method: 'get',
    params: parameter
  })
}

/**撤回 */
export function artificialInventoryRevocation(parameter) {
  return axios({
    baseURL,
    url: '/artificialInventory/revocation',
    method: 'get',
    params: parameter
  })
}
// ======人工盘点 END

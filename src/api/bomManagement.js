//BOM管理
import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

//const materialBaseUrl = system.materialBaseUrl
const materialBaseUrl = system.baseURL

// BOM管理----------------------------------------

/**
 * BOM组 新增和修改
 * @param {*} parameter
 * @returns
 */
export function materialGroupAddOrUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-group/addAndUpdateMaterialGroup',
    method: 'POST',
    data: parameter
  })
}
/**
 * BOM组 物料树
 * @param {*} parameter
 * @returns
 */
export function getBomTree(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-group/getBomTree',
    method: 'GET',
    params: parameter
  })
}

/**
 * BOM物料单 新增和修改
 * @param {*} parameter
 * @returns
 */
 export function materialFormAddOrUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form/addAndUpdateMaterialForm',
    method: 'POST',
    data: parameter
  })
}

/**
 * 审批bom单
 * @param {*} parameter
 * @returns
 */
 export function approvalMaterialForm(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form/approvalMaterialForm',
    method: 'POST',
    data: parameter
  })
}
/**
 * 审核bom单
 * @param {*} parameter
 * @returns
 */
export function auditMaterialForm(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form/auditMaterialForm',
    method: 'GET',
    params: parameter
  })
}

/**
 * 删除bom单
 * @param {*} parameter
 * @returns
 */
 export function delMaterialForm(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form/delMaterialForm',
    method: 'GET',
    params: parameter
  })
}

/**
 * 物料单详情（查看）
 * @param {*} parameter
 * @returns
 */
 export function getMaterialFormDetail(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form/getMaterialFormDetail',
    method: 'GET',
    params: parameter
  })
}

/**
 * 物料单基本信息列表
 * @param {*} parameter
 * @returns
 */
 export function listMaterialForm(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form/listMaterialForm',
    method: 'GET',
    params: parameter
  })
}

/**
 * 物料单审批列表（我的待审批已审批）权限 materialForm:findAll
 * @param {*} parameter
 * @returns
 */
 export function pageMaterialForm(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form/pageMaterialForm',
    method: 'GET',
    params: parameter
  })
}

/**
 * 反审核bom单
 * @param {*} parameter
 * @returns
 */
 export function reverseAuditMaterialForm(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form/reverseAuditMaterialForm',
    method: 'GET',
    params: parameter
  })
}

/**
 * 使用bom单
 * @param {*} parameter
 * @returns
 */
 export function useMaterialForm(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form/useMaterialForm',
    method: 'GET',
    params: parameter
  })
}

/**
 * 导出 物料单详情信息叶节点列表对比（bom差异分析）
 * @param {*} parameter
 * @returns
 */
 export function exportLeafNodeCompare(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form-child-detail/exportLeafNodeCompare',
    method: 'GET',
    params: parameter
  })
}
/**
 * 物料单详情信息叶节点列表对比（bom差异分析）
 * @param {*} parameter
 * @returns
 */
 export function leafNodeCompareById(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form-child-detail/leafNodeCompareById',
    method: 'GET',
    params: parameter
  })
}

/**
 * 物料单详情信息叶节点列表（bom综合）
 * @param {*} parameter
 * @returns
 */
 export function leafNodeMaterialFormChildDetail(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form-child-detail/leafNodeMaterialFormChildDetail',
    method: 'GET',
    params: parameter
  })
}

/**
 * 物料单详情信息列表
 * @param {*} parameter
 * @returns
 */
 export function listMaterialFormChildDetail(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form-child-detail/listMaterialFormChildDetail',
    method: 'GET',
    params: parameter
  })
}

/**
 * 物料单详情批量修改
 * @param {*} parameter
 * @returns
 */
 export function updateBatchChildDetail(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form-child-detail/updateBatchChildDetail',
    method: 'POST',
    data: parameter
  })
}

/**
 * 物料单详情批量修改替换列表
 * @param {*} parameter
 * @returns
 */
 export function updateBatchChildDetailList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form-child-detail/updateBatchChildDetailList',
    method: 'POST',
    data: parameter
  })
}


/**
 * 物料单详情信息列表模糊搜索
 * @param {*} parameter
 * @returns
 */
 export function listMaterialFormChildDetailByBomIdAndCode(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/bom/material-form-child-detail/listMaterialFormChildDetailByBomIdAndCode',
    method: 'GET',
    params: parameter
  })
}

export function bomExport(type,params) {
  const m = {
    //导出 物料单详情信息叶节点列表对比（bom差异分析）
    1:'/bom/material-form-child-detail/exportLeafNodeCompare',
  }
  let fileName = 'bom差异分析'
  let url = `${materialBaseUrl}${m[type]}?${params}`
  return axios({
    url: url,
    method: 'get',
    responseType: 'blob'
  }).then((res) => {
    console.log(res)
    if (res instanceof Blob) {

      const isFile = res.type === 'application/vnd.ms-excel' || res.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isJson = res.type === 'application/json'
      if (isFile) {
        //返回文件 则下载
        const objectUrl = URL.createObjectURL(res)
        const a = document.createElement('a')
        document.body.appendChild(a)
        a.style = 'display: none'
        a.href = objectUrl
        a.download = `${fileName}.xls`
        a.click()
        document.body.removeChild(a)
        return {
          code: 200,
          msg: '下载成功'
        }
      } else if (isJson) {
        //返回json处理
        return new Promise(resolve => {
          var reader = new FileReader()
          reader.onload = function (e) {
            let _res = null
            try {
              _res = JSON.parse(e.target.result)
            } catch (err) {
              _res = null
            }
            if (_res !== null) {
              if (_res.code == 500) {
                resolve({
                  code: 500,
                  msg: _res.msg
                })
              } else {
                resolve({
                  code: 200,
                  msg: '下载成功'
                })
              }
            } else {
              resolve({
                code: 500,
                msg: `json解析出错 e.target.result：${e.target.result}`
              })
            }
          }
          try {
            reader.readAsText(res)
          } catch (err) {
            resolve({
              code: 500,
              msg: err.message
            })
          }
        })
      } else {
        return {
          code: 500,
          msg: `不支持的类型:${res}`
        }
      }
    } else {
      return {
        code: 500,
        msg: `返回数据不是Blob类型:${typeof res}`
      }
    }
  })
  .catch((err) => {
    return {
      code: 500,
      msg: `请求出错：${err.message}`
    }
  })
}

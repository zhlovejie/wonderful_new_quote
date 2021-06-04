//工艺路线
import {
  axios
} from '@/utils/request'
import system from '@/config/defaultSettings'

//const materialBaseUrl = system.materialBaseUrl
const materialBaseUrl = system.baseURL

// 工艺路线----------------------------------------

/**
 * 根据成品物料规则获取规则下的所有成品物料
 * @param {string} ruleId 成品物料规则id
 * @returns
 */
export function getAllProductMaterial(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/productMaterialInfo/listByRule',
    method: 'GET',
    params: parameter
  })
}

/**
 * 详情
 * @param {long} id 物料id
 * @returns
 */
export function craftRouteDetail(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute',
    method: 'GET',
    params: parameter
  })
}

/**新增 */
export function craftRouteAdd(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute',
    method: 'POST',
    data: parameter
  })
}

/**修改 */
export function craftRouteUpdate(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute',
    method: 'PUT',
    data: parameter
  })
}

/**删除 */
export function craftRouteDelete(parameter) {
  let url = parameter.split('=')[1].split(',').map(s => `ids=${s}`).join('&')
  return axios({
    baseURL: materialBaseUrl,
    url: `/craftRoute?${url}`,
    method: 'DELETE'
  })
}

/**单个工艺路线反审核 ，权限码：craftRoute:annulAudit */
export function craftRouteAnnulAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/annulAudit',
    method: 'POST',
    data: parameter
  })
}

/**根据成品物料反审核，权限码：craftRoute:annulAudit */
export function craftRouteAnnulAuditBatch(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/annulAuditBatch',
    method: 'POST',
    data: parameter
  })
}

/**审批工艺路线 */
export function craftRouteApprove(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/approve',
    method: 'POST',
    data: parameter
  })
}

/**单个工艺路线提交审核，权限码：craftRoute:audit */
export function craftRouteAudit(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/audit',
    method: 'POST',
    data: parameter
  })
}

/**根据成品物料提交审核，权限码：craftRoute:audit */
export function craftRouteAuditByMaterial(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/auditByMaterial',
    method: 'POST',
    data: parameter
  })
}

/**获取所有的设备 */
export function craftRouteGetAllDevice(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/getAllDevice',
    method: 'GET',
    params: parameter
  })
}

/**获取所有的车间 */
export function craftRouteGetAllWorkshop(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/getAllWorkshop',
    method: 'GET',
    params: parameter
  })
}

/**获取顺序的代码号 */
export function craftRouteGetCode(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/getCode',
    method: 'GET',
    params: parameter
  })
}

/**根据设备id获取设备操作规程 */
export function craftRouteGetDeviceFile(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/getDeviceFile',
    method: 'GET',
    params: parameter
  })
}

/**根据车间获取工序 */
export function craftRouteGetProcessByWorkshop(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/getProcessByWorkshop',
    method: 'GET',
    params: parameter
  })
}
/**根据成品物料id查询列表 */
export function craftRouteListByMaterial(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/listByMaterial',
    method: 'GET',
    params: parameter
  })
}

/**审批分页列表 */
export function craftRouteApprovePageList(parameter) {
  return axios({
    baseURL: materialBaseUrl,
    url: '/craftRoute/pageList',
    method: 'GET',
    params: parameter
  })
}


export function __craftRouteExport(type,params) {
  const m = {
    1:'/routineMaterialInfo/exportList', //常规物料
    2:'/productMaterialInfo/exportList'  //成品物料
  }
  let fileName = type === 1 ? '常规物料库' : '成品物料库'
  let url = `${materialBaseUrl}${m[type]}?${params}`
  return axios({
    url: url,
    method: 'get',
    responseType: 'blob'
  }).then((res) => {
    console.log(res)
    if (res instanceof Blob) {
      const isFile = res.type === 'application/vnd.ms-excel'
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

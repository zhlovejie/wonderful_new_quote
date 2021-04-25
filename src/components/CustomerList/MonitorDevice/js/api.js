import system from '@/config/defaultSettings'
let formatParams = obj => {
  let s = []
  for(let k of Object.keys(obj)){
    s.push(`${k}=${encodeURIComponent(obj[k])}`)
  }
  return s.join('&')
}

const CAMERA_API = {}
//接口根地址
CAMERA_API.baseUrl = 'https://open.ys7.com/api/lapp/'
//目前实现的接口地址列表
CAMERA_API.urls = {
  getAccessToken:`${CAMERA_API.baseUrl}token/get`,
  addDevice:`${CAMERA_API.baseUrl}device/add`,
  deleteDevice:`${CAMERA_API.baseUrl}device/delete`,
  updateNameAndChannelNo:`${CAMERA_API.baseUrl}camera/name/update`,
  deviceList:`${CAMERA_API.baseUrl}device/list`,
  device:`${CAMERA_API.baseUrl}device/info`
}
//统一的请求入口
CAMERA_API.request = function(opt){
  return fetch(opt.url,{
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: opt.method || 'POST',
    body: formatParams(opt.data)
  }).then(response => {
    if(response.ok){
      return response.json()
    }else{
      console.log(response)
      throw new Error(`请求出错，错误码：${response.status} 错误消息：${response.statusText}`);
    }
  })
}




//简化本地存储操作
CAMERA_API.ls = {
  get:function(key){
    return window.localStorage.getItem(key)
  },
  set:function(key,val){
    return window.localStorage.setItem(key,val)
  }
}
//获取AccessToken
//参数 appKey , appSecret
CAMERA_API.getAccessToken = function(opt,callback){
  return CAMERA_API.request({url:CAMERA_API.urls.getAccessToken,data:opt})
}

/**
 * 添加设备到账号下
 * accessToken 授权过程获取的access_token
 * deviceSerial 设备序列号,存在英文字母的设备序列号，字母需为大写
 * validateCode 设备验证码，设备机身上的六位大写字母
 */
CAMERA_API.addDevice = function(opt,callback){
  return CAMERA_API.request({url:CAMERA_API.urls.addDevice,data:opt})
}

/**
 * 删除设备
 * accessToken 授权过程获取的access_token
 * deviceSerial 设备序列号,存在英文字母的设备序列号，字母需为大写
 */
CAMERA_API.deleteDevice = function(opt,callback){
  return CAMERA_API.request({url:CAMERA_API.urls.deleteDevice,data:opt})
}

/**
 * 修改通道名称
 * accessToken 授权过程获取的access_token
 * deviceSerial 设备序列号,存在英文字母的设备序列号，字母需为大写
 * name 通道名称，长度不大于50字节，不能包含特殊字符
 * channelNo (Int) 非必选参数，不为空表示修改指定通道名称，为空表示修改通道1名称
 */
CAMERA_API.updateNameAndChannelNo = function(opt,callback){
  return CAMERA_API.request({url:CAMERA_API.urls.updateNameAndChannelNo,data:opt})
}

/**
 * 获取设备列表
 * accessToken 授权过程获取的access_token
 * pageStart 分页起始页，从0开始
 * pageSize 分页大小，默认为10，最大为50
 */
CAMERA_API.deviceList = function(opt,callback){
  return CAMERA_API.request({url:CAMERA_API.urls.deviceList,data:opt})
}

/**
 * 获取单个设备信息
 * accessToken 授权过程获取的access_token
 * deviceSerial 设备序列号,存在英文字母的设备序列号，字母需为大写
 */
CAMERA_API.device = function(opt,callback){
  return CAMERA_API.request({url:CAMERA_API.urls.device,data:opt})
}

CAMERA_API.util = {}
/**
 * 生成监控地址
 * @param {*} opt
 * type 'live' 实时监控地址  'rec' 回放监控地址  'begin' 开始播放时间点 'end' 结束播放时间点
 */
CAMERA_API.util.makeMonitorUrl = function(opt){
  if(!opt.deviceSerial){
    throw new Error('设备序列号 deviceSerial 不能为空')
  }
  let type = opt.type || 'live'
  if(type === 'live'){
    return `ezopen://open.ys7.com/${opt.deviceSerial}/1.live`
  }
  if(type === 'rec'){
    if(opt.begin){
      return `ezopen://open.ys7.com/${opt.deviceSerial}/1.rec?begin=${opt.begin}`
    }
    return `ezopen://XRIRSU@open.ys7.com/${opt.deviceSerial}/1.rec`
  }
  throw new Error(`不支持的类型:${opt.type || ''}`)
}

CAMERA_API.util.getTokenAndUrl = async function(deviceSerial){
  const {appKey,appSecret} = system.attendanceMonitoringConfig
  // let deviceItem = deviceList.find(item => +item.key === +deviceKey)
  // if(!deviceItem){
  //   return {code:500,msg:`未找到 key=${deviceKey} 设备，请检查配置文件【defaultSettings.js】` }
  // }
  // const deviceSerial = deviceItem.deviceSerial
  let t = null
  try{t = JSON.parse(CAMERA_API.ls.get('_m_token'))}catch(err){}
  if(!(t && t.accessToken && t.expireTime && +t.expireTime > Date.now())){
    try{
      let {data,code,msg} = await CAMERA_API.getAccessToken({appKey,appSecret}).then(res => res)
      if(+code !== 200){
        return {code:500,msg}
      }
      t = data
      CAMERA_API.ls.set('_m_token',JSON.stringify(data))
    }catch(err){
      return {code:500,msg:err.message }
    }
  }
  let accessToken  = t.accessToken
  let monitorUrl = CAMERA_API.util.makeMonitorUrl({deviceSerial})
  return {code:200,accessToken,monitorUrl}
}

export default CAMERA_API



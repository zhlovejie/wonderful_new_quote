import { all } from "q"

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

/**
 * 产品核价计算ABC价格
 * @param {*} costPrice 成本价
 * @param {*} areaPercentageObj 区域计算用的百分比
 */
export function calculatePrice (costPrice, areaPercentageObj) {
  let _costPrice = parseFloat(costPrice)
  _costPrice = isNaN(_costPrice) ? 0 : _costPrice
  let apriceRate = areaPercentageObj['1'],//a价
      bpriceRate = areaPercentageObj['2'],//b价
      cpriceRate = areaPercentageObj['3'] //c价
  apriceRate = isNaN(parseFloat(apriceRate)) ? 0 : parseFloat(apriceRate)
  bpriceRate = isNaN(parseFloat(bpriceRate)) ? 0 : parseFloat(bpriceRate)
  cpriceRate = isNaN(parseFloat(cpriceRate)) ? 0 : parseFloat(cpriceRate)
  let __a = _costPrice * apriceRate
  let __b = _costPrice * bpriceRate
  let __c = _costPrice * cpriceRate
  __a = isNaN(__a) ? 0 : Number(__a).toFixed(2)
  __b = isNaN(__b) ? 0 : Number(__b).toFixed(2)
  __c = isNaN(__c) ? 0 : Number(__c).toFixed(2)
  return {aPrice:__a,bPrice:__b,cPrice:__c}
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function companyFormat(company){
  //单位 0套， 1台， 2个,3块，4条，5根，6张，7卷
  let companyMap = {
    0:'套',
    1:'台',
    2:'个',
    3:'块',
    4:'条',
    5:'根',
    6:'张',
    7:'卷',
  }
  let _company = parseInt(company,10) || 0
  return companyMap[_company]
}


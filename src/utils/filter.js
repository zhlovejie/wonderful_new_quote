import Vue from 'vue'
import Accounting from 'accounting'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value,precision=0) {
  if (!value) {
    return '0'
  }
  //const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  //return intPartFormat
  return Accounting.formatNumber(value,precision)
})

Vue.filter('moneyFormatNumber',function(value){
  return Accounting.formatMoney(value,'¥')
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('numberCircle', function (number) {
  let n = Number(number)
  let map = {1:'①',2: '②',3:'③'}
  return (n in map) ? map[n] : number
})

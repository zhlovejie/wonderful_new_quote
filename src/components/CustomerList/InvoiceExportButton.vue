<script>
const _EXPORT_API_ = {
  1:'/invoice/exportList',//发货单
  2:'/delayedPayment/exportList',//延迟付款单
  3:'/receipt/exportList',//收款单
  4:'/sale-contract/exportOrder',//销售订单
}
import { exportInvoiceExcel} from '@/api/receipt'
export default {
  name:'InvoiceExportButton',
  props:{
    typeNumber:[String,Number],
    fileName:{
      type:String,
      default:() => 'test.xls'
    },
    searchParam:{
      type:Object,
      default:() => {}
    }
  },
  render(h){
    const that = this
    if(!typeNumber){
      console.log('typeNumber 参数无效')
      return null
    }
    return h(
      'a-button',
      {
        props:{
          type:'primary'
        },
        on:{
          click:() => that.exprotAction(_EXPORT_API_[that.typeNumber],that.fileName)
        }
      },
      '导出'
    )
  },
  methods:{
    exprotAction(url,param){
      let that = this
      exportInvoiceExcel(url,param)
      .then(res => {
        //console.log(res)
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
            a.download = `${that.pageTitle}.xls`
            a.click()
            document.body.removeChild(a)
            that.$message.info('下载成功')
            return
          } else if (isJson) {
            //返回json处理
            var reader = new FileReader()
            reader.onload = function (e) {
              let _res = null
              try {
                _res = JSON.parse(e.target.result)
              } catch (err) {
                _res = null
              }
              if (_res !== null) {
                if (_res.code !== 0) {
                  that.$message.info(_res.message)
                } else {
                  that.$message.info('下载成功')
                }
              } else {
                that.$message.info('json解析出错 e.target.result：' + e.target.result)
                return
              }
            }
            reader.readAsText(res)
          } else {
            that.$message.info('不支持的类型:' + res)
          }
        }
      })
      .catch(err => {
        that.$message.info(`请求出错：${err.message}`)
      })
    }
  }
}
</script>
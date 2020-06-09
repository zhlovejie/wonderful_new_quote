<template>
  <div class="customer-list-wrapper">
    <div class="main-wrapper" style="width:1000px;margin:0 auto;">
      <table class="custom-table custom-table-border" style="margin-bottom:0;">
        <tr>
          <td style="width:150px;">产品系列</td>
          <td>
            <a-input
              read-only
              placeholder="点击选择产品系列"
              :value="optInfo.name"
              @click="showModule('selectProduct')"
            />
          </td>
        </tr>
      </table>

      <ProductConfig
        ref="productConfigMain"
        @extendProductChange="extendProductChange"
        prefix="产品系列-"
      />

      <ProductConfig ref="productConfigSub" prefix="产品-" />

      <div style="text-align:center;margin-top:10px;">
        <a-button type="primary" icon="check" @click="doAction('ok')" style="margin:0 10px;">确定</a-button>
        <a-button type="primary" icon="reload" @click="doAction('reset')" style="margin:0 10px;">重置</a-button>
      </div>
    </div>

    <SelectProduct ref="selectProduct" @selected="selectedHandler" />

    <a-modal
      title="产品评估"
      :width="450"
      :visible="visible"
      @cancel="visible = false"
      :maskClosable="false"
      :destroyOnClose="true"
      :footer="null"
      key="m1"
    >
      <!-- <p>成本价：{{parseInt(costPrice.price) | moneyFormatNumber}}</p> -->
      <div class="price-wrapper">
        <p>A价：{{parseInt(costPrice.aprice) | moneyFormatNumber(0)}}</p>
        <p>B价：{{parseInt(costPrice.bprice) | moneyFormatNumber(0)}}</p>
        <p>C价：{{parseInt(costPrice.cprice) | moneyFormatNumber(0)}}</p>
        <p>市场价：{{parseInt(costPrice.retailPrice) | moneyFormatNumber(0)}}</p>
      </div>
      <div style="text-align:center;margin-top:10px;">
        <a-button type="primary" @click="doAction('price-ok')" style="margin:0 10px;">确定</a-button>
        <a-button type="primary" @click="doAction('price-view')" style="margin:0 10px;">预览</a-button>
        <a-button type="primary" @click="doAction('price-form')" style="margin:0 10px;">新增报价单</a-button>
      </div>
    </a-modal>

    <!-- <SelectProductView ref="selectProductView" :productInfo="viewDataSource" /> -->

    <a-modal
      title="预览"
      :width="1000"
      :visible="visibleView"
      @cancel="visibleView = false"
      :maskClosable="false"
      :footer="null"
      :destroyOnClose="true"
      key="m2"
    >
      <a-spin :spinning="spinningView">
      <SelectProductViewHTML
        key="v1" 
        v-if="hackReset" 
        :productInfo="viewDataSourceHTML"
        @priceChange="viewPriceChange"
      />
      <div style="text-align:center;margin-top:10px;">
        <a-button type="primary" @click="visibleView = false" style="margin:0 10px;">关闭</a-button>
        <a-button type="primary" @click="doAction('price-view-download')" style="margin:0 10px;">下载</a-button>
      </div>
      </a-spin>
    </a-modal>

    <PriceForm ref="priceForm" v-if="hackReset" />
  </div>
</template>

<script>
import { priceAdjustProductQuoteDownload } from '@/api/productOfferManagement'
import SelectProduct from './module/SelectProduct'
import SelectProductView from './module/SelectProductView'
import SelectProductViewHTML from './module/SelectProductViewHTML'
import ProductConfig from './module/ProductConfig'
import PriceForm from './module/PriceForm'
import { resumeOne } from '../../../api/system/sysJob'
export default {
  name: 'products-quotation',
  components: {
    SelectProduct,
    SelectProductView,
    SelectProductViewHTML,
    ProductConfig,
    PriceForm
  },
  data() {
    return {
      optInfo: {},
      visible: false,
      visibleView: false,
      costPrice: {},
      viewDataSource: [],
      unitPriceView: null, //预览选择的单价
      spinningView:false,
      hackReset:true
    }
  },
  computed: {
    viewDataSourceHTML() {
      let result = {
        __config: {
          showTitle: true,
          costPrice: Object.assign({}, this.costPrice),
        },
        optInfo: {},
        optStand: [],
        optSelect: []
      }
      this.viewDataSource.map((p, idx) => {
        if (Array.isArray(p.optStand)) {
          result.optStand.push(...[...p.optStand])
        }
        if (idx === 0 && p.optInfo) {
          result.optInfo = { ...p.optInfo }
        }
        if (p.optInfo && p.optInfo.optControl) {
          result.optStand.push(p.optInfo.optControl)
        }
        if (Array.isArray(p.optControlStand)) {
          result.optStand.push(...[...p.optControlStand])
        }
        result.optSelect.push(...[...p.optSelect, ...p.optControlSelect])
      })
      return result
    },
    viewDataSourceHTMLWithoutTitle() {
      let res = { ...this.viewDataSourceHTML }
      let result = {
        __config: { ...res.__config },
        optInfo: { ...res.optInfo },
        optStand: [...res.optStand],
        optSelect: [...res.optSelect]
      }
      result.__config.showTitle = false
      return result
    }
  },
  methods: {
    extendProductChange(record) {
      if (record && record.isProduct && record.checked) {
        this.$refs.productConfigSub.query(record.id)
        return
      }
      this.$refs.productConfigSub.reset()
    },
    selectedHandler(record) {
      this.optInfo = {
        name: record.name
      }
      this.$refs.productConfigMain.query(record.id)
    },
    doAction(type) {
      let that = this
      if (type === 'ok') {
        this.calcCostPrice()
        this.visible = true
      } else if (type === 'reset') {
        this.reset()
      } else if (type === 'price-ok') {
        this.visible = false
      } else if (type === 'price-view') {
        this.makeViewDataSource()
        this.hackReset = false
        Promise.resolve()
        .then(() =>{
          this.hackReset = true
        }).then(() =>{
          this.visibleView = true
        })
        
      } else if (type === 'price-form') {
        this.makeViewDataSource()
        let _optInfo = Object.assign({}, this.$refs.productConfigMain.optInfo)
        let productInfo = {
          name: _optInfo.name,
          model: _optInfo.model,
          productPic: _optInfo.productPic,
          qty: 0,
          price: 0,
          tax: 1,
          _costPrice: Object.assign({}, this.costPrice),
          _viewDataSource: { ...this.viewDataSourceHTMLWithoutTitle }
        }

        this.hackReset = false
        Promise.resolve()
        .then(() =>{
          this.hackReset = true
        }).then(() =>{
          this.$refs.priceForm.query('add', productInfo)
        })
      } else if (type === 'price-view-download') {
        if (!this.unitPriceView) {
          this.$message.info('请选择产品价格')
          return
        }

        let __viewDataSourceHTML = this.viewDataSourceHTML
        let values = {
          productName: __viewDataSourceHTML.optInfo.name,
          productModel: __viewDataSourceHTML.optInfo.model,
          productPic: __viewDataSourceHTML.optInfo.productPic,
          unitPrice: this.unitPriceView,
          standardItem: __viewDataSourceHTML.optStand.map(p => {
            return { itemName: p.itemName, type: 1 }
          }),
          optionalItem: __viewDataSourceHTML.optSelect.map(p => {
            return { itemName: p.itemName, type: 2 }
          })
        }
        that.spinningView = true
        priceAdjustProductQuoteDownload(values).then(res => {
          that.spinningView = false
          console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/msword'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = '产品报价单.doc'
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function(e) {
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
        }).catch(err => that.spinningView = true)
        return
      }
    },
    showModule(key) {
      this.$refs[key].query()
    },
    calcCostPrice() {
      let mainPrice = this.$refs.productConfigMain.costPrice
      let subPrice = this.$refs.productConfigSub.costPrice

      let priceResult = {
        price: 0,
        aprice: 0,
        bprice: 0,
        cprice: 0,
        retailPrice: 0
      }
      let arr = [Object.assign({}, mainPrice), Object.assign({}, subPrice)]
      arr.reduce((calc, item) => {
        calc.price += parseFloat(item.price) || 0
        calc.aprice += parseFloat(item.aprice) || 0
        calc.bprice += parseFloat(item.bprice) || 0
        calc.cprice += parseFloat(item.cprice) || 0
        calc.retailPrice += parseFloat(item.retailPrice) || 0
        return calc
      }, priceResult)

      //最终的钱 最后一位 保证是0  低于5不进 高于5进1
      let formatPrice = n => {
        let _n = Math.round(parseFloat(n))
        if (_n < 10) return _n
        return (parseInt(_n / 10, 10) + (_n % 10 >= 5 ? 1 : 0)) * 10
      }

      for (let key in priceResult) {
        if (priceResult.hasOwnProperty(key)) {
          priceResult[key] = formatPrice(priceResult[key])
        }
      }

      this.costPrice = { ...priceResult }
    },
    makeViewDataSource() {
      let that = this
      let makeProducts = key => that.$refs[key].viewDataSource
      let main = makeProducts('productConfigMain')
      if (main) {
        main.__config = {
          showTitle: true,
          prefix: '产品系列-',
          costPrice: { ...that.costPrice } //总的产品评估报价
        }
      }
      let sub = makeProducts('productConfigSub')
      if (sub) {
        sub.__config = {
          showTitle: false,
          prefix: '产品-'
        }
      }
      this.viewDataSource = [makeProducts('productConfigMain'), makeProducts('productConfigSub')]
    },
    reset() {
      let that = this
      let keys = ['productConfigMain', 'productConfigSub']
      that.optInfo = {}
      keys.map(key => {
        try {
          that.$refs[key].reset()
        } catch (err) {
          console.log(err)
        }
      })
    },
    viewPriceChange(val) {
      console.log(val)
      this.unitPriceView = val
    }
  }
}
</script>

<style scoped>
.customer-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.price-wrapper {
  text-align: center;
  font-size: 125%;
  font-weight: bold;
}
</style>

<template>
  <div class="customer-list-wrapper">
    <a-spin :spinning="spinning" :tip="spinTips" :delay="100">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" type="card" @change="tabChange">
        <a-tab-pane tab="2.0产品报价" key="1" />
        <a-tab-pane tab="4.0产品报价" key="0" />
        <a-tab-pane tab="5.0产品报价" key="2" />
        <a-tab-pane tab="厨余系列报价" key="3" />
      </a-tabs>
      <div class="main-wrapper" style="width: 1000px; margin: 0 auto">
        <table class="custom-table custom-table-border" style="margin-bottom: 0">
          <tr>
            <td style="width: 150px">产品系列</td>
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
          @loaded="() => (spinning = false)"
          prefix="产品系列-"
          :modelType="{ is2d0: is2d0, is4d0: is4d0 }"
        />

        <ProductConfig
          ref="productConfigSub"
          @loaded="() => (spinning = false)"
          prefix="产品-"
          :modelType="{ is2d0: is2d0, is4d0: is4d0 }"
        />

        <div style="text-align: center; margin-top: 10px">
          <a-button type="primary" icon="check" @click="doAction('ok')" style="margin: 0 10px">确定</a-button>
          <a-button type="primary" icon="reload" @click="doAction('reset')" style="margin: 0 10px">重置</a-button>
        </div>
      </div>
    </a-spin>

    <SelectProduct ref="selectProduct" @selected="selectedHandler" :productType="this.activeKey" />

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
        <p>A价：{{ parseInt(costPrice.aprice) | moneyFormatNumber(0) }}</p>
        <p>B价：{{ parseInt(costPrice.bprice) | moneyFormatNumber(0) }}</p>
        <p>C价：{{ parseInt(costPrice.cprice) | moneyFormatNumber(0) }}</p>
        <p>市场价：{{ parseInt(costPrice.retailPrice) | moneyFormatNumber(0) }}</p>
      </div>
      <div style="text-align: center; margin-top: 10px">
        <a-button type="primary" @click="doAction('price-ok')" style="margin: 0 10px">确定</a-button>
        <a-button type="primary" @click="doAction('price-view')" style="margin: 0 10px">预览</a-button>
        <a-button type="primary" v-if="is4d0 || is5d0 || is6d0" @click="doAction('price-form')" style="margin: 0 10px"
          >新增报价单</a-button
        >
        <a-button
          type="primary"
          v-if="$auth('productsQuotation2d0:costPrice') | $auth('productsQuotation4.0:costPrice')"
          @click="doAction('price-view-cost')"
          style="margin: 0 10px"
          >成本价</a-button
        >
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
          :isPriceViewCost="isPriceViewCost"
          @priceChange="viewPriceChange"
        />
        <div style="text-align: center; margin-top: 10px">
          <a-button type="primary" @click="visibleView = false" style="margin: 0 10px">关闭</a-button>
          <a-button
            type="primary"
            v-if="!isPriceViewCost"
            @click="doAction('price-view-download')"
            style="margin: 0 10px"
            >下载</a-button
          >
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
    PriceForm,
  },
  data() {
    return {
      activeKey: 1,
      optInfo: {},
      visible: false,
      visibleView: false,
      costPrice: {},
      costPriceAll: {},
      viewDataSource: [],
      unitPriceView: null, //预览选择的单价
      spinningView: false,
      hackReset: true,

      isPriceViewCost: false, //是否点击的 成本价预览
      spinning: false,
      spinTips: '数据加载中...',
    }
  },
  computed: {
    viewDataSourceHTML() {
      let result = {
        __config: {
          showTitle: true,
          costPrice: Object.assign({}, this.costPrice),
          costPriceAll: Object.assign({}, this.costPriceAll),
        },
        optInfo: {},
        optStand: [],
        optSelect: [],
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
        optSelect: [...res.optSelect],
      }
      result.__config.showTitle = false
      return result
    },
    modelType() {
      //报价类型
      const m = {
        1: '2d0', //2.0报价参数标志
        2: '4d0', //4.0报价参数标志
        3: '5d0', //5.0报价参数标志
        4: '6d0', //厨余系列报价参数标志
      }
      return m[this.activeKey]
    },
    is2d0() {
      return +this.activeKey === 1
    },
    is4d0() {
      return +this.activeKey === 0
    },
    is5d0() {
      return +this.activeKey === 2
    },
    is6d0() {
      return +this.activeKey === 3
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'pom-products-quotation') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      this.optInfo = {}
      this.visible = false
      this.visibleView = false
      this.costPrice = {}
      this.viewDataSource = []
      this.unitPriceView = null //预览选择的单价
      this.spinningView = false
      this.hackReset = true
      this.isPriceViewCost = false

      this.$nextTick(() => this.reset())
    },
    extendProductChange(record) {
      //debugger
      if (record && record.isProduct) {
        if (record.checked) {
          this.spinning = true
          this.$refs.productConfigSub.query(record.id)
        } else {
          this.$refs.productConfigSub.reset()
        }
        return
      }
      //this.$refs.productConfigSub.reset()
    },
    selectedHandler(record) {
      this.reset()
      this.optInfo = {
        name: record.name,
      }
      this.spinning = true
      this.$nextTick(() => this.$refs.productConfigMain.query(record.id))
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
      } else if (['price-view', 'price-view-cost'].includes(type)) {
        this.unitPriceView = null
        that.isPriceViewCost = type === 'price-view-cost'
        this.makeViewDataSource()
        this.hackReset = false
        Promise.resolve()
          .then(() => {
            this.hackReset = true
          })
          .then(() => {
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
          _viewDataSource: { ...this.viewDataSourceHTMLWithoutTitle },
        }

        this.hackReset = false
        Promise.resolve()
          .then(() => {
            this.hackReset = true
          })
          .then(() => {
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
          standardItem: __viewDataSourceHTML.optStand.map((p) => {
            return { itemName: p.itemName, type: 1, introduction: p.introduction }
          }),
          optionalItem: __viewDataSourceHTML.optSelect.map((p) => {
            return { itemName: p.itemName, type: 2, introduction: p.introduction }
          }),
        }
        that.spinningView = true
        priceAdjustProductQuoteDownload(values)
          .then((res) => {
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
          .catch((err) => (that.spinningView = true))
        return
      }
    },
    showModule(key) {
      this.$refs[key].query()
    },
    calcCostPrice() {
      //let mainPrice = this.$refs.productConfigMain.costPriceAll
      //let subPrice = this.$refs.productConfigSub.costPriceAll

      let mainPrice = this.$refs.productConfigMain.calcItems(this.modelType)
      let subPrice = this.$refs.productConfigSub.calcItems(this.modelType)

      let priceResult = {
        totalPrice: {
          price: 0,
          aprice: 0,
          bprice: 0,
          cprice: 0,
          retailPrice: 0,
        },
        standPrice: {
          price: 0,
          aprice: 0,
          bprice: 0,
          cprice: 0,
          retailPrice: 0,
        },
        unStandPrice: {
          price: 0,
          aprice: 0,
          bprice: 0,
          cprice: 0,
          retailPrice: 0,
        },
      }
      let totalPrice = [Object.assign({}, mainPrice.totalPrice), Object.assign({}, subPrice.totalPrice)]
      let standPrice = [Object.assign({}, mainPrice.standPrice), Object.assign({}, subPrice.standPrice)]
      let unStandPrice = [Object.assign({}, mainPrice.unStandPrice), Object.assign({}, subPrice.unStandPrice)]
      totalPrice.reduce((calc, item) => {
        calc.price += parseFloat(item.price) || 0
        calc.aprice += parseFloat(item.aprice) || 0
        calc.bprice += parseFloat(item.bprice) || 0
        calc.cprice += parseFloat(item.cprice) || 0
        calc.retailPrice += parseFloat(item.retailPrice) || 0
        return calc
      }, priceResult.totalPrice)

      standPrice.reduce((calc, item) => {
        calc.price += parseFloat(item.price) || 0
        calc.aprice += parseFloat(item.aprice) || 0
        calc.bprice += parseFloat(item.bprice) || 0
        calc.cprice += parseFloat(item.cprice) || 0
        calc.retailPrice += parseFloat(item.retailPrice) || 0
        return calc
      }, priceResult.standPrice)

      unStandPrice.reduce((calc, item) => {
        calc.price += parseFloat(item.price) || 0
        calc.aprice += parseFloat(item.aprice) || 0
        calc.bprice += parseFloat(item.bprice) || 0
        calc.cprice += parseFloat(item.cprice) || 0
        calc.retailPrice += parseFloat(item.retailPrice) || 0
        return calc
      }, priceResult.unStandPrice)

      let formatPrice = (n) => {
        let _n = Math.round(parseFloat(n))
        if (_n < 10) return _n
        return (parseInt(_n / 10, 10) + (_n % 10 >= 5 ? 1 : 0)) * 10
      }
      //debugger
      Object.keys(priceResult.totalPrice).map((key) => {
        priceResult.totalPrice[key] = formatPrice(priceResult.totalPrice[key])
      })

      this.costPriceAll = { ...priceResult }
      this.costPrice = { ...priceResult.totalPrice }
    },
    makeViewDataSource() {
      let that = this
      let makeProducts = (key) => that.$refs[key].viewDataSource
      let main = makeProducts('productConfigMain')
      if (main) {
        main.__config = {
          showTitle: true,
          prefix: '产品系列-',
          costPrice: { ...that.costPrice }, //总的产品评估报价
        }
      }
      let sub = makeProducts('productConfigSub')
      if (sub) {
        sub.__config = {
          showTitle: false,
          prefix: '产品-',
        }
      }
      this.viewDataSource = [makeProducts('productConfigMain'), makeProducts('productConfigSub')]
    },
    reset() {
      let that = this
      let keys = ['productConfigMain', 'productConfigSub']
      that.optInfo = {}
      keys.map((key) => {
        try {
          that.$refs[key].reset()
        } catch (err) {
          console.log(err)
        }
      })

      that.$refs.selectProduct && that.$refs.selectProduct.resetCurrent()
    },
    viewPriceChange(val) {
      console.log(val)
      this.unitPriceView = val
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.reset()
    },
  },
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

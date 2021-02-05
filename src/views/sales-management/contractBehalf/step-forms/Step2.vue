<template>
  <div class="content-wrap">
    <a-row>
      <a-col :span="24" class="basic-tit" justify="center" align="middle">产品信息</a-col>
    </a-row>
    <div class="form wdf-form">
      <template v-if="this.$parent.routeParams.action === 'split'">
        <h3>产品非变动部分</h3>
        <ProductSplitCommon
          ref="productCommonSplitNormal"
          key="psc1"
          :params="productCommonSplitNormalParams"
          @totalAmountChange="totalAmountChange"
        ></ProductSplitCommon>
        <h3 style="margin-top: 20px">产品变动部分</h3>
        <ProductSplitCommon
          ref="productCommonSplitChange"
          key="psc2"
          :params="productCommonSplitChangeParams"
          @totalAmountChange="totalAmountChange"
        >
        </ProductSplitCommon>

        <a-row justify="start" align="middle">
          <a-col :span="24">
            <div v-if="freightType === 0">
              <span v-if="isTax === 0"> 运费：&nbsp;{{ freight | moneyFormatNumber }} </span>
              <span v-else>
                运费：&nbsp;{{
                  Math.ceil(freight * 1.13) | moneyFormatNumber
                }}&nbsp;&nbsp;包含&nbsp;&nbsp;(&nbsp;运费：{{
                  freight | moneyFormatNumber
                }}&nbsp;&nbsp;运费税率：&nbsp;13%&nbsp; )
              </span>
            </div>
          </a-col>
          <a-col :span="24">
            <span class="span-mount">合计（人民币）</span>
            <span class="span-mount bigword">{{ chineseTotalAmount }}</span>
            <span class="span-mount">(&nbsp;{{ totalAmount | moneyFormatNumber }}&nbsp;)</span>
            <span class="span-mount"
              >此价格{{ isTax ? '含税' : '不含税' }}、{{ freightType === 0 ? '含运费' : '不含运费' }}。</span
            >
          </a-col>
        </a-row>
      </template>
      <template v-if="this.$parent.routeParams.action === 'see'">
        <ProductC ref="productCommon" :params="productCommonParams">
          <div v-if="freightType === 0">
            <span v-if="isTax === 0"> 运费：&nbsp;{{ freight | moneyFormatNumber }} </span>
            <span v-else>
              运费：&nbsp;{{ freightMoneyWithRate | moneyFormatNumber }}&nbsp;&nbsp;包含&nbsp;&nbsp;(&nbsp;运费：{{
                freight | moneyFormatNumber
              }}&nbsp;&nbsp;运费税率：&nbsp;13%&nbsp; )
            </span>
          </div>
        </ProductC>
      </template>
      <template v-if="this.$parent.routeParams.action !== 'split' && this.$parent.routeParams.action !== 'see'">
        <ProductCommon ref="productCommon" :params="productCommonParams">
          <div v-if="freightType === 0">
            <span v-if="isTax === 0"> 运费：&nbsp;{{ freight | moneyFormatNumber }} </span>
            <span v-else>
              运费：&nbsp;{{ freightMoneyWithRate | moneyFormatNumber }}&nbsp;&nbsp;包含&nbsp;&nbsp;(&nbsp;运费：{{
                freight | moneyFormatNumber
              }}&nbsp;&nbsp;运费税率：&nbsp;13%&nbsp; )
            </span>
          </div>
        </ProductCommon>
      </template>
    </div>
    <div class="btns-grop">
      <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
      <a-button type="primary" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import {
  getQueryOne,
  saveProduct,
  getSplitProductTemp,
  saveSplitProductTemp,
  turnTheCapital,
  copyCPriceDesc,
} from '@/api/contractListManagement'

import moment from 'moment'
import ProductCommon from './ProductCommon'
import ProductC from './ProductC'
import ProductSplitCommon from './ProductSplitCommon'

export default {
  name: 'Step2',
  components: { ProductCommon, ProductSplitCommon, ProductC },
  props: {
    queryonedata: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      productCommonParams: {
        dataSource: [],
        totalAmount: 0,
        chineseTotalAmount: '零',
        isTax: false,
        __fromAction: 'add',
      },
      productCommonSplitNormalParams: {
        //拆分非变动部分参数
        dataSource: [],
        totalAmount: 0,
        chineseTotalAmount: '零',
        isTax: false,
        startKey: 1000,
        __name: 'SplitNormal',
      },
      productCommonSplitChangeParams: {
        //拆分变动部分参数
        dataSource: [],
        totalAmount: 0,
        chineseTotalAmount: '零',
        isTax: false,
        startKey: 2000,
        __name: 'SplitChange',
      },
      freightType: 0, //运费类型 0含运费 1不含运费
      freight: 0, //运费显示用
      freightMoneyWithRate: 0,
      isTax: 0, // 1 含税（销售合同） 0 不含税（产品订货单）
      splitNormalTotalAmount: 0,
      splitChangeTotalAmount: 0,
      chineseTotalAmount: '零', //仅拆分使用
      freightDivType: 1, //运费分配类型 1单价 2金额
    }
  },
  computed: {
    totalAmount: function () {
      let _totalAmount = Number(this.splitNormalTotalAmount) + Number(this.splitChangeTotalAmount)
      if (this.freightType === 0) {
        _totalAmount += Number(this.freightMoneyWithRate)
      }
      debugger
      if (_totalAmount <= 0) {
        this.chineseTotalAmount = '零'
      } else {
        turnTheCapital({ money: _totalAmount })
          .then((res) => {
            this.chineseTotalAmount = res.data
          })
          .catch((error) => {
            console.error(error)
          })
      }

      return _totalAmount
    },
  },
  watch: {
    $route(to, from) {},
  },
  beforeCreate() {},
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      let that = this
      let product = []

      if (this.queryonedata && this.queryonedata.purchaseContractSaveBo) {
        //正常流程
        let result = this.queryonedata.purchaseContractSaveBo
        console.log(this.queryonedata)
        this.freight = result.freight
        this.freightMoneyWithRate = parseInt(result.freight + result.freight * 0.13)
        this.freightType = parseInt(result.freightType)
        this.freightDivType = result.freightAllotType || 1
        this.isTax = result.isTax
        // this.productCommonParams.freight = parseInt(result.freight + result.freight * 0.13)
        if (this.queryonedata.purchaseContractProductSaveBoList) {
          let resEcho = this.queryonedata.purchaseContractProductSaveBoList
          product = resEcho.map((p) => {
            p.deliveryDate = moment(p.deliveryDate)
            p.productPic = p.productPic
            p.productModel = p.productModel
            p.productName = p.productName
            p.productLowCPriceAllAmount = p.productLowCPriceAllAmount === 0 ? null : p.productLowCPriceAllAmount
            p.productLowCPriceUnitAmount = p.productLowCPriceUnitAmount === 0 ? null : p.productLowCPriceUnitAmount
            p.tax = p.v
            p.id = p.id
            p.productId = p.productId
            p.unit = String(p.unit)
            p.editable = true
            p.isNew = true

            return p
          })
        }

        this.productCommonParams = {
          dataSource: product || [],
          saleContractLowCPriceAllAmount: result.saleContractLowCPriceAllAmount,
          totalAmount: this.queryonedata.totalAmount,
          chineseTotalAmount: result.chineseTotalAmount,
          isTax: result.isTax === 1,
          __fromAction: this.$parent.routeParams.action,
          freightType: result.freightType,
          freight: parseInt(result.freight + result.freight * 0.13),
          freightDivType: result.freightAllotType || 2,
          lowPriceDesc: result.lowPriceDesc,
        }
        // 正常流程END

        // 拆分流程
        if (this.$parent.routeParams.action !== 'split') {
          return
        }

        // let resultProduct = await this.getSplitProductTempInfo({ contractId: this.queryonedata.id })
        // let resultProductTempNormal = resultProduct.filter((p) => p.changeFlag === 0)
        // let resultProductTempChange = resultProduct.filter((p) => p.changeFlag === 1)

        // console.log('resultProductTempNormal')
        // console.log(resultProductTempNormal)

        // console.log('resultProductTempChange')
        // console.log(resultProductTempChange)

        // let productNormal = resultProductTempNormal.map((p) => {
        //   p.deliveryDate = moment(p.deliveryDate)
        //   p.productPic = p.contractProductPo.productPic
        //   p.productModel = p.contractProductPo.productModel
        //   p.productName = p.contractProductPo.productName
        //   p.tax = p.taxRate
        //   p.productId = p.productId
        //   p.id = p.id
        //   p.company = String(p.company)
        //   p.editable = true
        //   p.isNew = true
        //   p.contractId = that.queryonedata.id
        //   return p
        // })

        // //debugger

        // this.productCommonSplitNormalParams = {
        //   //拆分表没产品数据 合同里有产品 先同的
        //   dataSource: productNormal.length === 0 && product.length > 0 ? [...product] : productNormal,
        //   totalAmount: 0,
        //   chineseTotalAmount: '零',
        //   isTax: result.isTax === 1,
        //   __fromAction: 'split',
        //   startKey: 1000,
        //   __name: 'SplitNormal',
        //   freightType: result.freightType,
        //   freight: result.freightMoneyWithRate,
        //   freightDivType: result.freightDivType || 1,
        //   lowPriceDesc: result.lowPriceDesc,
        // }

        // let productChange = resultProductTempChange.map((p) => {
        //   p.deliveryDate = moment(p.deliveryDate)
        //   p.productPic = p.contractProductPo.productPic
        //   p.productModel = p.contractProductPo.productModel
        //   p.productName = p.contractProductPo.productName
        //   p.tax = p.taxRate
        //   p.productId = p.productId
        //   p.id = p.id
        //   p.company = String(p.company)
        //   p.editable = true
        //   p.isNew = true
        //   p.contractId = that.queryonedata.id
        //   return p
        // })

        // this.productCommonSplitChangeParams = {
        //   //拆分表没产品数据 合同里有产品 先用合同的
        //   dataSource: productChange.length === 0 && product.length > 0 ? [...product] : productChange,
        //   totalAmount: 0,
        //   chineseTotalAmount: '零',
        //   isTax: result.isTax === 1,
        //   __fromAction: 'split',
        //   startKey: 2000,
        //   __name: 'SplitChange',
        //   freightType: result.freightType,
        //   freight: result.freightMoneyWithRate,
        //   freightDivType: result.freightDivType || 1,
        // }

        //   //拆分流程END
      }
    },
    getContractInfo(params) {
      return getQueryOne(params)
        .then((res) => {
          return res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    // 点击下一步
    async nextStep(status) {
      const that = this
      if (that.$parent.routeParams.action === 'see') {
        return that.$emit('nextStep', { ...that.queryonedata })
      }

      if (that.$parent.routeParams.action === 'split') {
        let { errors, values } = that.$refs.productCommonSplitNormal.validate()
        if (errors) return
        let { errors: errors1, values: values1 } = that.$refs.productCommonSplitChange.validate()
        if (errors1) return

        let nomalProduct = that.formatProduct(values)
        nomalProduct = nomalProduct.map((item) => {
          item.changeFlag = 0
          return item
        })

        let changeProduct = that.formatProduct(values1)
        changeProduct = changeProduct.map((item) => {
          item.id && delete item.id //变动部分产品不用传ID
          item.changeFlag = 1
          return item
        })

        await saveSplitProductTemp([].concat(nomalProduct).concat(changeProduct))
        if (status != 1) {
          that.$emit('nextStep', {})
        } else {
          that.$message.success('保存成功')
        }
      } else {
        let { errors, values, lowPriceDesc } = this.$refs.productCommon.validate()
        if (errors) {
          return
        }

        if (values.length <= 0) {
          this.$message.error('请完善产品信息')
          return
        }
        // if (low && ispriceC !== false) {
        //   copyCPriceDesc({ id: this.queryonedata.id, lowPriceDesc: low }).then((res) => {})
        // } else {
        //   copyCPriceDesc({ id: this.queryonedata.id }).then((res) => {})
        // }
        console.log(values)

        // let products = this.formatProduct(values)
        // // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
        // console.log(products)
        let { totalAmount } = this.$refs.productCommon.istotalAmount()
        let react = {
          lowPriceDesc: lowPriceDesc,
        }
        let arr = {
          purchaseContractProductSaveBoList: values,
          totalAmount: totalAmount,
          purchaseContractSaveBo: { ...react, ...that.queryonedata.purchaseContractSaveBo },
        }
        // saveProduct(products)
        //   .then((res) => {
        //     console.log('插入产品信息，请求后端接口结果', res)

        //     if (res && res.code && parseInt(res.code) === 500) {
        //       that.$info.error(res.msg)
        //       return
        //     }
        //     if (status != 1) {
        that.$emit('nextStep', { ...arr })
        //     } else {
        //       that.$message.success('保存成功')
        //     }
        //     //that.$emit('nextStep', { ...res.data })
        //   })
        //   .catch((error) => {
        //     console.error(error)
        //   })
      }
    },
    // formatProduct(products) {
    //   let that = this
    //   // 拼接产品集合
    //   const res = products.map((item) => {
    //     return {
    //       targetId: item.targetId,
    //       productType: item.productType,
    //       productId: item.productId,
    //       unit: item.unit,
    //       count: item.count,
    //       unitPrice: item.unitPrice,
    //       taxRate: item.tax,
    //       remarks: item.remarks, //拆分产品备注
    //       freightUnitPrice: item.freightUnitPrice,
    //     }
    //   })
    //   console.log(res)
    //   return res
    // },
    // 上一步
    prevStep() {
      const id = this.id
      this.$emit('prevStep', id)
    },
    finish() {
      this.currentTab = 0
    },
    getSplitProductTempInfo(params) {
      return getSplitProductTemp(params)
        .then((res) => {
          return res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    totalAmountChange(param) {
      if (param.name === 'SplitNormal') {
        this.splitNormalTotalAmount = param.totalAmount
      } else {
        this.splitChangeTotalAmount = param.totalAmount
      }
    },
  },
}
</script>
<style>
.step-table-list .ant-form-item {
  margin-bottom: 0;
}
</style>



<style lang="less" scoped>
.wdf-row {
  border: 1px solid #ddd;
}
.wdf-form {
  margin-top: 12px;
  padding: 12px;
}
.btns-grop {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
}
.btns-grop button:not(first-child) {
  margin-left: 12px;
}
.col-mount {
  border: 1px solid #ddd;
  border-top: none;
  padding: 6px 16px;
}
.span-mount ~ .span-mount {
  margin-left: 16px;
}
.bigword {
  font-weight: bold;
}
</style>

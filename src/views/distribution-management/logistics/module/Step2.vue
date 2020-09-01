<template>
  <div class="content-wrap">
    <a-row>
      <a-col :span="24" class="basic-tit" justify="center" align="middle">产品信息</a-col>
    </a-row>
    <div class="form wdf-form">
      <template>
        <a-form :form="form" @submit="handleSubmit" class="form wdf-form">
          <a-form-item>
            <a-row type="flex">
              <a-col class="col-border" :span="3" justify="center" align="middle">承运方</a-col>
              <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
                <a-form-item>
                  <a-select
                    placeholder="结算方式"
                    :allowClear="true"
                    style="border: none;width: 60%;"
                    v-decorator="['settlementMethod', {rules: [{required: true,message: '请选择结算方式!',},
             ]}]"
                  >
                    <a-select-option
                      v-for="item in settlement"
                      :key="item.id"
                      :value="item.id"
                    >{{item.text}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-row type="flex">
              <a-col class="col-border" :span="3" justify="center" align="middle">车牌号</a-col>
              <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
                <a-form-item>
                  <a-input
                    style="width:60%;"
                    :precision="0"
                    v-decorator="['managementFeeWithdrawal',{rules: [{required: true,message: '请输入管理提取数额',},
             ]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :style="{borderBottom:'1px solid #ddd'}">
            <a-col class="col-border" :span="3" justify="center" align="middle">车辆型号</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-select
                  placeholder="结算方式"
                  :allowClear="true"
                  style="border: none;width: 60%;"
                  v-decorator="['settlementMethod', {rules: [{required: true,message: '请选择结算方式!',},
             ]}]"
                >
                  <a-select-option
                    v-for="item in settlement"
                    :key="item.id"
                    :value="item.id"
                  >{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-form-item>
        </a-form>
      </template>
    </div>
    <div class="btns-grop">
      <a-button style="margin-left:8px;" @click="prevStep">上一步</a-button>
      <a-button type="primary" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Step2',
  props: {
    queryonedata: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  computed: {},
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

      if (this.queryonedata && this.queryonedata.id) {
        //正常流程
        let result = await this.getContractInfo({ id: this.queryonedata.id })
        //this.totalAmount = result.totalAmount
        //this.chineseTotalAmount = result.chineseTotalAmount
        this.freightCharge = result.freightCharge
        this.freightMoneyWithRate = result.freightMoneyWithRate
        this.freightType = parseInt(result.freightType)
        this.freightDivType = result.freightDivType || 2
        this.isTax = result.isTax

        //正常流程END

        //拆分流程
        if (this.$parent.routeParams.action !== 'split') {
          return
        }

        let resultProduct = await this.getSplitProductTempInfo({ contractId: this.queryonedata.id })
        let resultProductTempNormal = resultProduct.filter((p) => p.changeFlag === 0)
        let resultProductTempChange = resultProduct.filter((p) => p.changeFlag === 1)

        console.log('resultProductTempNormal')
        console.log(resultProductTempNormal)

        console.log('resultProductTempChange')
        console.log(resultProductTempChange)

        let productNormal = resultProductTempNormal.map((p) => {
          p.deliveryDate = moment(p.deliveryDate)
          p.productPic = p.contractProductPo.productPic
          p.productModel = p.contractProductPo.productModel
          p.productName = p.contractProductPo.productName
          p.tax = p.taxRate
          p.productId = p.productId
          p.id = p.id
          p.company = String(p.company)
          p.editable = true
          p.isNew = true
          p.contractId = that.queryonedata.id
          return p
        })

        //debugger

        this.productCommonSplitNormalParams = {
          //拆分表没产品数据 合同里有产品 先同的
          dataSource: productNormal.length === 0 && product.length > 0 ? [...product] : productNormal,
          totalAmount: 0,
          chineseTotalAmount: '零',
          isTax: result.isTax === 1,
          __fromAction: 'split',
          startKey: 1000,
          __name: 'SplitNormal',
          freightType: result.freightType,
          freightCharge: result.freightMoneyWithRate,
          freightDivType: result.freightDivType || 2,
        }

        let productChange = resultProductTempChange.map((p) => {
          p.deliveryDate = moment(p.deliveryDate)
          p.productPic = p.contractProductPo.productPic
          p.productModel = p.contractProductPo.productModel
          p.productName = p.contractProductPo.productName
          p.tax = p.taxRate
          p.productId = p.productId
          p.id = p.id
          p.company = String(p.company)
          p.editable = true
          p.isNew = true
          p.contractId = that.queryonedata.id
          return p
        })

        this.productCommonSplitChangeParams = {
          //拆分表没产品数据 合同里有产品 先用合同的
          dataSource: productChange.length === 0 && product.length > 0 ? [...product] : productChange,
          totalAmount: 0,
          chineseTotalAmount: '零',
          isTax: result.isTax === 1,
          __fromAction: 'split',
          startKey: 2000,
          __name: 'SplitChange',
          freightType: result.freightType,
          freightCharge: result.freightMoneyWithRate,
          freightDivType: result.freightDivType || 2,
        }

        //拆分流程END
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
        let { errors, values } = this.$refs.productCommon.validate()
        if (errors) {
          return
        }

        if (values.length <= 0) {
          this.$message.error('请完善产品信息')
          return
        }

        let products = this.formatProduct(values)
        // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
        saveProduct(products)
          .then((res) => {
            console.log('插入产品信息，请求后端接口结果', res)

            if (res && res.code && parseInt(res.code) === 500) {
              that.$info.error(res.msg)
              return
            }
            if (status != 1) {
              that.$emit('nextStep', { ...res.data })
            } else {
              that.$message.success('保存成功')
            }
            //that.$emit('nextStep', { ...res.data })
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
    formatProduct(products) {
      let that = this
      // 拼接产品集合
      const res = products.map((item) => {
        return {
          id: item.id,
          contractId: that.queryonedata.id,
          targetId: item.targetId,
          productType: item.productType,
          productId: item.productId,
          company: item.company,
          count: item.count,
          unitPrice: item.unitPrice,
          //taxRate:item.taxRate,
          taxRate: item.tax,
          //deliveryDate:item.deliveryDate.format('YYYY-MM-DD'),
          //deliveryDate: item.deliveryDate,
          productStatus: item.productStatus, //产品状态
          remarks: item.remarks, //拆分产品备注
          freightUnitPrice: item.freightUnitPrice,
        }
      })
      console.log(res)
      return res
    },
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

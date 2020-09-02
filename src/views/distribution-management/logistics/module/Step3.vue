<template>
  <div class="content-wrap">
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">物流单</a-col>
      </a-row>
      <a-form :form="form" class="form wdf-form">
        <a-form-item class="btns-grop">
          <a-button style="margin-left: 8px;" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getQueryOne, saveSettlementMethod, deleteQueryOne } from '@/api/contractListManagement'
import moment from 'moment'

export default {
  name: 'Step3',
  components: {},
  props: {
    queryonedata: {
      type: Object,
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  data() {
    const queryOneData = { ...this.queryonedata }
    return {
      id: '',
    }
  },
  watch: {
    $route(to, from) {
      // if (to.fullPath === '/sales-management/contract-list-management/distributionContractList') {
      //   this.currentTab = 0
      // }
    },
    queryOneData: function (newVal, oldVal) {
      this.fillMoney()
    },
  },
  beforeMount() {
    // debugger
  },
  mounted() {
    // console.log(this)
    console.log('queryOneData====', this.queryOneData)
    this.init()
    this.fullAmount = this.queryonedata.fullAmount
  },
  computed: {
    isSmartBucket: function () {
      return this.bucketType === 1 ? true : false
    },
    calcIncreaseTotalPayment: {
      get() {
        let _result = this.isSmartBucket
          ? (
              this.queryOneData.totalAmount *
              (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100)
            ).toFixed(2)
          : (this.queryOneData.totalAmount * (this.qualityLimitPre / 100)).toFixed(2)
        return _result
      },
      set(newValue) {},
    },
    calcAllPayment: function () {
      //debugger
      let _result = this.isSmartBucket
        ? (
            this.queryOneData.totalAmount *
            (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100 + 1)
          ).toFixed(2)
        : (this.queryOneData.totalAmount * (this.qualityLimitPre / 100 + 1)).toFixed(2)
      return _result
    },
  },
  methods: {
    qualityLimitChange(e) {
      let _v = parseInt(e, 10)
      this.qualityLimit = _v
      if (_v === 1) {
        this.qualityLimitPre = 0
      } else if (_v === 2) {
        this.qualityLimitPre = 10
      } else if (_v === 3) {
        this.qualityLimitPre = 20
      } else {
        this.qualityLimitPre = 0
      }
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          if (that.fullAmount === 0) {
            // 全款
            that.allPaymentDate = values.allPaymentDate.format('YYYY-MM-DD')
            const params = {
              contractId: that.id,
              qualityFrame: values.qualityFrame,
              qualityElectronics: values.qualityElectronics,
              qualityLayer: values.qualityLayer,
              qualityLimit: values.qualityLimit || 1,
              allPaymentDate: that.allPaymentDate, // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
              routineSettlement: [],
              unconventionalSettlement: [],
            }
            // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
            saveSettlementMethod(params)
              .then((res) => {
                console.log('校验成功，保存填写的信息，请求后端接口结果', res)
                that.id = res.data.id
                that.loading = false
                that.form.setFieldsValue({})
                if (status != 1) {
                  that.$emit('nextStep', { ...res.data })
                } else {
                  that.$message.success('保存成功')
                }
              })
              .catch((error) => {
                console.error(error)
              })
          } else {
            // for (i=0;i<this._getParam('convention').length;i++){
            //   let percentages=percentages+this._getParam('convention').number
            // }

            // 各个款项的百分比之和应为100%
            // if(that.percentages!=100){
            //   that.$message.error('各个款项的百分比之和应为100%')
            // }else{
            let percentagesStatus = this.checkPercentages()
            if (!percentagesStatus) {
              that.$message.error('各个款项的百分比之和应为100%')
              return
            }
            // debugger
            // that.allPaymentDate = ''
            //  that.paymentDate = moment()
            const params = {
              contractId: that.contractId,
              qualityFrame: values.qualityFrame,
              qualityElectronics: values.qualityElectronics,
              qualityLayer: values.qualityLayer,
              qualityLimit: values.qualityLimit || 1,
              //  paymentDate: that.paymentDate,    //提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
              routineSettlement: this._getParam('convention') || [],
              unconventionalSettlement: this._getParam('unConvention') || [],
            }
            // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
            saveSettlementMethod(params)
              .then((res) => {
                console.log('校验成功，保存填写的信息，请求后端接口结果', res)
                that.id = res.data.id
                that.loading = false
                that.form.setFieldsValue({})
                that.$emit('nextStep', { ...res.data })
              })
              .catch((error) => {
                console.error(error)
              })

            // }
          }

          // if(that.percentages!=100){
          //   that.$message.error('各个款项的百分比之和应为100%')
          // }else{
          // }
        }
      })
    },
    prevStep() {
      // this.$emit('prevStep', {...this.id})
      // const id = this.id
      this.$emit('prevStep', this.id)
    },
    init() {
      const that = this
      this.id = this.queryonedata.logisticsInformationId ? this.queryonedata.logisticsInformationId : ''

      // const params = { id: that.queryonedata.id }
      //拆分流程
      // if (this.$parent.routeParams.action == 'split') {
      //   params['type'] = 3
      // }

      // if (that.id > 0) {
      //   getQueryOne(params)
      //     .then((res) => {
      //       that.queryOneData = res.data
      //       that.form.setFieldsValue({
      //         contractId: res.data.id,
      //         fullAmount: res.data.fullAmount, // 是否全款 0全款  1非全款
      //         allPayment: res.data.totalAmount,
      //         totalAmount: res.data.totalAmount, // 总金额(已经判断过是否含税了)
      //         conventionalMoney: res.data.conventionalMoney, // 常规产品总价
      //         unConventionalMoney: res.data.unConventionalMoney, // 非常规产品总价
      //         product: res.data.product, // 常规产品或者非常规产品  0 常规产品 1非常规产品
      //         qualityFrame: res.data.qualityFrame ? res.data.qualityFrame : 3,
      //         qualityElectronics: res.data.qualityElectronics ? res.data.qualityElectronics : 1,
      //         qualityLayer: res.data.qualityLayer ? res.data.qualityLayer : 3,
      //         allPaymentDate: res.data.settlement ? moment(res.data.settlement.paymentDate) : moment(), // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
      //         routineSettlement: res.data.routineSettlement || [],
      //         unconventionalSettlement: res.data.unconventionalSettlement || [],
      //         increaseTotalPayment: res.data.increaseTotalPayment, // 增加总货款金额
      //         qualityLimit: res.data.qualityLimit || 1,
      //       })

      //       let routineSettlement = res.data.routineSettlement || []
      //       let unconventionalSettlement = res.data.unconventionalSettlement || []
      //       if (routineSettlement.length > 0) {
      //         that.fillConventionalData(routineSettlement)
      //       }
      //       if (unconventionalSettlement.length > 0) {
      //         that.fillConventionalData(unconventionalSettlement)
      //       }

      //       that.contractId = this.queryonedata.id
      //       that.id = this.queryonedata.id
      //       that.contractId = res.data.id
      //       that.fullAmount = res.data.fullAmount
      //       that.product = res.data.product
      //       that.allPayment = res.data.totalAmount
      //       that.conventionalMoney = res.data.conventionalMoney
      //       that.unConventionalMoney = res.data.unConventionalMoney
      //       that.increaseTotalPayment = res.data.increaseTotalPayment
      //       that.bucketType = res.data.bucketType

      //       that.qualityFrameChange(res.data.qualityFrame)
      //       that.qualityElectronicsChange(res.data.qualityElectronics)
      //       that.qualityLayerChange(res.data.qualityLayer)
      //       that.qualityLimitChange(res.data.qualityLimit)

      //       // [{id: 0, productType: 1}]     // [], [0,0], [1,1], [0,1,0]
      //       that.productTypes = that.product.map((item) => {
      //         return item.productType
      //       })
      //     })
      //     .catch((error) => {
      //       console.error(error)
      //     })
    },

    //   try {
    //     that.form.setFieldsValue({
    //       contractId: this.queryonedata.id,
    //       fullAmount: this.queryonedata.fullAmount, // 是否全款 0全款  1非全款
    //       allPayment: this.queryonedata.totalAmount,
    //       totalAmount: this.queryonedata.totalAmount, // 总金额(已经判断过是否含税了)
    //       conventionalMoney: this.queryonedata.conventionalMoney, // 常规产品总价
    //       unConventionalMoney: this.queryonedata.unConventionalMoney, // 非常规产品总价
    //       product: this.queryonedata.product, // 常规产品或者非常规产品  0 常规产品 1非常规产品
    //       qualityFrame: this.queryonedata.qualityFrame || 3,
    //       qualityElectronics: this.queryonedata.qualityElectronics || 1,
    //       qualityLayer: this.queryonedata.qualityLayer || 3,
    //       allPaymentDate: this.queryonedata.settlement ? moment(this.queryonedata.settlement.paymentDate) : moment(), // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
    //       routineSettlement: this.queryonedata.routineSettlement || [],
    //       unconventionalSettlement: this.queryonedata.unconventionalSettlement || [],
    //       increaseTotalPayment: this.queryonedata.increaseTotalPayment, // 增加总货款金额
    //     })
    //   } catch (err) {}
    // },

    // fillConventionalData(items) {
    //   let obj = {}
    //   let _percentage = 0
    //   items.map((item) => {
    //     let suffix = item.productType === 0 ? 'convention' : 'unConvention'
    //     _percentage += parseFloat(item.percentage)
    //     obj[`${suffix}.${item.moneyType}.number`] = item.percentage
    //     obj[`${suffix}.${item.moneyType}.selected`] = parseFloat(item.percentage) > 0 ? true : false
    //     obj[`${suffix}.${item.moneyType}.data`] = moment(item.paymentDate)
    //     obj[`${suffix}.${item.moneyType}.remarks`] = item.remarks
    //   })
    //   this.form.setFieldsValue({ ...obj })
    //   this.percentagesStatus = this.fullAmount === 0 ? true : _percentage === 100
  },
  // 主框架下拉改变
  // qualityFrameChange(e) {
  //   console.log('主框架下拉改变', e)
  //   this.qualityFrame = e ? e : 3
  //   if (this.qualityFrame === 3) {
  //     this.qualityFramePre = 0
  //   } else if (this.qualityFrame === 4) {
  //     this.qualityFramePre = 3
  //   } else {
  //     this.qualityFramePre = 6
  //   }
  //   console.log(this.qualityFramePre)
  // },

  // 上一步

  // handler 表单数据验证成功后回调事件
}
</script>

<style lang="less" scoped>
.wdf-row {
  border: 1px solid #ddd;
}

.col-border {
  border: 1px solid #ddd;
  padding: 10px 0;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
}

.col-border ~ .col-border {
  border-left: none;
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

.ant-row.ant-form-item {
  margin-bottom: 0;
}

.year-select {
  width: 100px;
  margin: 0 18px 0 8px;
}

.inner-col-div {
  float: left;
  width: 50%;
}

.checkbox-innerspan {
  margin: 0 10px 0 12px;
}

.mar-l0 {
  margin-left: 0;
}

.date {
  width: 120px;
}

.select-prop {
  width: 80px;
}

.row-in-col {
  padding: 16px 0 8px;
}

.item-select {
  display: inline-block;
}
</style>

<template>
  <div class="content-wrap">
    <CustomerList ref="customerList" @selected="handlerCustomerSelected" />
    <a-row>
      <a-col :span="24" class="basic-tit" justify="center" align="middle">产品信息</a-col>
    </a-row>
    <div class="form wdf-form">
      <template>
        <a-form :form="form" class="form wdf-form">
          <a-form-item>
            <a-row type="flex">
              <a-col class="col-border" :span="6" justify="center" align="middle"></a-col>
              <a-col class="col-border" :span="3" justify="right" align="middle">承运方</a-col>
              <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
                <a-form-item>
                  <a-input
                    style="width:60%;"
                    @click="handleCustomerClick"
                    v-decorator="['distributionStationId',{rules: [{required: true,message: '请选择承运方',},
             ]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-row type="flex">
              <a-col class="col-border" :span="6" justify="center" align="middle"></a-col>
              <a-col class="col-border" :span="3" justify="right" align="middle">车牌号</a-col>
              <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
                <a-form-item>
                  <a-input
                    style="width:60%;"
                    :precision="0"
                    v-decorator="['licensePlateNumber',{rules: [{required: true,message: '请输车牌号',},
             ]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-col class="col-border" :span="6" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="right" align="middle">车辆型号</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-select
                  placeholder="车辆型号"
                  :allowClear="true"
                  style="border: none;width: 60%;"
                  v-decorator="['vehicleType', {rules: [{required: true,message: '请选择车辆型号!',},
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
import { logisticsCarrier } from '@/api/distribution-management'

import { getDictionaryList } from '@/api/workBox' // 数据字典
import CustomerList from './modify'

export default {
  name: 'Step2',
  components: { CustomerList },
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
      form: this.$form.createForm(this),
      settlement: [], //数据字典  车辆类型
      postSelectDataSource: [], //承运方
      customerName: '', //承运方名称
      customerId: '',
    }
  },
  computed: {},
  watch: {
    $route(to, from) {},
  },
  beforeCreate() {},
  mounted() {
    this.init()
    getDictionaryList({ parentId: 543 }).then((res) => {
      this.settlement = res.data
    })
  },
  methods: {
    //打开承运方列表
    handleCustomerClick() {
      this.$refs.customerList.init()
    },
    //承运方组件返回值
    handlerCustomerSelected(record) {
      this.customerName = record.logisticsCompanyName
      this.customerId = record.id
      this.form.setFieldsValue({
        distributionStationId: record.logisticsCompanyName,
      })
    },
    // 上一步
    prevStep() {
      let that = this
      const id = this.queryonedata.id
      that.$emit('prevStep', id)
    },
    async init() {
      // let qt = this.queryonedata
      console.log(this.queryonedata)
      // if (qt.id && qt.id > 0) {
      //   this.freightType = qt.freightType
      //   qt.addressNumber = qt.addressNumber.split(',')
      //   this.form.setFieldsValue({
      //     id: qt.id,
      //     logisticsOrderNo: qt.logisticsOrderNo,
      //     date: moment(qt.date),
      //     isInvoice: qt.isInvoice,
      //     settlementMethod: qt.settlementMethod,
      //     logisticsAttribute: qt.logisticsAttribute,
      //     logisticsPrice: qt.logisticsPrice,
      //     managementFeeWithdrawal: qt.managementFeeWithdrawal,
      //     preDeliveryTime: moment(qt.preDeliveryTime),
      //     province: Number(qt.addressNumber[0]),
      //     city: Number(qt.addressNumber[1]),
      //     area: Number(qt.addressNumber[2]),
      //     detailedAddressName: qt.detailedAddressName,
      //   })
      // }
    },

    // handler 表单数据验证成功后回调事件
    // 点击下一步
    async nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this
      validateFields((err, values) => {
        console.log(values)
        values.distributionStationId = that.customerId
        logisticsCarrier(values)
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
      })
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

<template>
  <div class="content-wrap">
    <!-- <div class="sales-management-action-wrapper" style="text-align:right;">
      <a-button type="primary" @click="goBackAction" icon="save">保存</a-button>
    </div>-->
    <!-- <CustomerList ref="customerList" @selected="handlerCustomerSelected" /> -->
    <div>
      <a-row type="flex">
        <a-col :span="24" class="basic-tit" justify="center" align="middle">物流信息</a-col>
      </a-row>
      <a-form :form="form" @submit="handleSubmit" class="form wdf-form">
        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">物流单号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input
                  type="text"
                  :precision="0"
                  style="border: none;width: 60%;"
                  v-decorator="['logisticsOrderNo',{rules: [{ required: false, message: '物流编号' }]}]"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">日期</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-date-picker
                  style="border: none;width: 60%;"
                  show-time
                  :precision="0"
                  :disabled="isSee"
                  placeholder="日期"
                  format="YYYY-MM-DD"
                  v-decorator="['date', {initialValue:moment(),rules: [{required: true,message: '请输入日期',},
             ]}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">是否开票</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-radio-group :disabled="isSee" v-decorator="['isInvoice',{initialValue:0}]">
                  <a-radio :value="0">否</a-radio>
                  <a-radio :value="1">是</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">物流属性</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-select
                  placeholder="物流属性"
                  :allowClear="true"
                  :precision="0"
                  :disabled="isSee"
                  style="border: none;width: 60%;"
                  v-decorator="['logisticsAttribute', {rules: [{required: true,message: '请选择物流属性!',},
             ]}]"
                >
                  <a-select-option
                    v-for="item in postSelectDataSource"
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
            <a-col class="col-border" :span="3" justify="center" align="middle">物流价格</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-input
                  :disabled="isSee"
                  style="width:60%;"
                  :precision="0"
                  placeholder="物流价格"
                  v-decorator="['logisticsPrice',{rules: [{required: true,message: '请输入物流价格',},
             ]}]"
                />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">结算方式</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-select
                  :disabled="isSee"
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
            <a-col class="col-border" :span="3" justify="center" align="middle">我方管理费提取数额</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-input
                  :disabled="isSee"
                  style="width:60%;"
                  :precision="0"
                  v-decorator="['managementFeeWithdrawal',{rules: [{required: true,message: '请输入管理提取数额',},
             ]}]"
                />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">预提货时间</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-date-picker
                  :disabled="isSee"
                  style="border: none;width: 60%;"
                  show-time
                  :precision="0"
                  placeholder="年月日"
                  format="YYYY-MM-DD"
                  v-decorator="['preDeliveryTime', {rules: [{required: true,message: '请选择预提货日期',},
             ]}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item :style="{borderBottom:'1px solid #ddd'}">
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">目的地</a-col>
            <a-col class="col-border" :span="21" justify="center" align="middle">
              <a-col :lg="5" :md="5" :sm="24">
                <a-form-item>
                  <a-select
                    :disabled="isSee"
                    placeholder="省"
                    :precision="0"
                    v-decorator="['province',{rules: [{required: true, message: '请选择省！'}]}]"
                  >
                    <a-select-option
                      @click="getCity(1,province.id, province.area)"
                      v-for="province in this.provinces"
                      :key="province.index"
                      :value="province.id"
                    >{{ province.area }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="5" :md="5" :sm="24">
                <a-form-item>
                  <a-select
                    :disabled="isSee"
                    placeholder="市"
                    :precision="0"
                    v-decorator="['city',{rules: [{required: true, message: '请选择区！'}]}]"
                  >
                    <a-select-option
                      @click="getCity(2,city.id,city.area)"
                      v-for="city in this.citys"
                      :key="city.index"
                      :value="city.id"
                    >{{ city.area }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="5" :md="5" :sm="24">
                <a-form-item>
                  <a-select
                    :disabled="isSee"
                    placeholder="区"
                    :precision="0"
                    v-decorator="['area',{rules: [{required: true, message: '请选择区！'}]}]"
                  >
                    <a-select-option
                      @click="getCity(3,null,area.area)"
                      v-for="area in this.areas"
                      :key="area.index"
                      :value="area.id"
                    >{{ area.area }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="9" :md="9" :sm="24">
                <a-form-item>
                  <a-input
                    :disabled="isSee"
                    :precision="0"
                    placeholder="请输入详细地址"
                    v-decorator="['detailedAddressName',{rules: [{required: true, min: 5, message: '详细地址最少为5个字符！'}]}]"
                  />
                </a-form-item>
              </a-col>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <div style="margin: 16px auto 0;width: 100px;">
            <a-button type="primary" @click="nextStep">下一步</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { logisticsNum, logisticsPreservation, getQueryOne } from '@/api/distribution-management'
import { getDictionaryList } from '@/api/workBox' // 数据字典

import moment from 'moment'
import { getAreaByParent } from '@/api/common'
export default {
  name: 'Step1',
  props: {
    queryonedata: {
      type: Object,
    },
  },
  data() {
    return {
      postSelectDataSource: [], //物流属性数据字典
      settlement: [], //结算方式 数据字典
      oneLBCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      oneWPCol: {
        xs: { span: 20 },
        sm: { span: 20 },
      },
      provinces: [], // 省下拉框数据
      citys: [], // 城市下拉框数据
      areas: [], // 区下拉框数据
      // form
      province: '', //选择省名称
      city: '', //选择市名称
      area: '', // 选择区名称
      form: this.$form.createForm(this),

      loading: false,
      timer: 0,
      disabledDateTime: function () {},
      id: 0,
      freightType: 0,
      queryonedata1: {},
      isSee: false,
    }
  },
  computed: {},
  watch: {
    queryonedata(val) {
      this.queryonedata1 = val
      this.quweyData()
      if (this.$parent.routeParams.typeName === 'see') {
        this.isSee = true
      }
    },
  },
  created() {
    this.queryonedata1 = this.queryonedata
    if (this.$parent.routeParams.typeName === 'see') {
      this.isSee = true
    }
  },
  mounted() {
    this.quweyData()
    this.init()
    getAreaByParent({ pId: 100000 })
      .then((res) => {
        // 所有省
        this.provinces = res.data
      })
      .catch(function (err) {
        console.log(err)
      })
    getDictionaryList({ parentId: 541 }).then((res) => {
      this.postSelectDataSource = res.data
    })
    getDictionaryList({ parentId: 542 }).then((res) => {
      this.settlement = res.data
    })
  },
  methods: {
    moment,
    quweyData() {
      let qt = this.queryonedata1 ? this.queryonedata1 : {}
      if (JSON.stringify(qt) != '{}') {
        let arr = (qt.addressNumber || '').split(',')
        let num = (qt.addressName || '').split(',')
        this.getCity(1, arr[0], num[1])
        this.getCity(2, arr[1], num[2])
      }
      if (JSON.stringify(qt) != '{}') {
        this.freightType = qt.freightType
        qt.addressNumber = (qt.addressNumber || '').split(',')
        this.form.setFieldsValue({
          id: qt.id,
          logisticsOrderNo: qt.logisticsOrderNo,
          date: moment(qt.date),
          isInvoice: qt.isInvoice,
          settlementMethod: qt.settlementMethod,
          logisticsAttribute: qt.logisticsAttribute,
          logisticsPrice: qt.logisticsPrice,
          managementFeeWithdrawal: qt.managementFeeWithdrawal,
          preDeliveryTime: moment(qt.preDeliveryTime),
          province: Number(qt.addressNumber[0]),
          city: Number(qt.addressNumber[1]),
          area: Number(qt.addressNumber[2]),
          detailedAddressName: qt.detailedAddressName,
        })
      }
    },
    getCity(type, pId, name) {
      if (type != 3) {
        getAreaByParent({ pId: pId })
          .then((res) => {
            if (type === 1) {
              this.province = name
              this.citys = res.data
            } else if (type === 2) {
              this.city = name
              this.areas = res.data
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      } else {
        this.area = name
      }
    },

    init() {
      this.$nextTick(() => {
        if (this.$parent.routeParams.typeName === 'add') {
          logisticsNum().then((res) => {
            this.form.setFieldsValue({
              logisticsOrderNo: res.data,
            })
          })
        }
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
    nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this

      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (that.queryonedata.id) {
          values.id = that.queryonedata.id
        }
        if (!err) {
          values.preDeliveryTime = moment(values.preDeliveryTime).format('YYYY-MM-DD')
          values.date = moment(values.date).format('YYYY-MM-DD')
          values.addressName = that.province + ',' + that.city + ',' + that.area
          values.addressNumber = values.province + ',' + values.city + ',' + values.area
          delete values.province
          delete values.city
          delete values.area
          that.$emit('nextStep', { ...values })
        }
      })
    },
  },
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
.ant-row.ant-form-item {
  margin-bottom: 0;
}
</style>

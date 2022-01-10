<template>
  <a-spin :spinning="spinning">
    <div class="content">
      <div class="content-wrap">
        <div class="top-ation clearfix" style="text-align: right">
          <div class="table-operator fl-r" style="margin-top: 10px">
            <a-button class="fl-r" type="primary" @click="submit" :loading="loading" icon="check">{{
              btnActionTxt
            }}</a-button>
            <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
          </div>
        </div>
        <div class="content-inner">
          <div class="inner-title">发货单</div>
          <div>
            <a-form :form="form">
              <div class="form-container">
                <a-form-item hidden>
                  <a-input v-decorator="['contractId']" />
                </a-form-item>
                <a-form-item hidden>
                  <a-input v-decorator="['presentId']" />
                </a-form-item>
                <a-form-item hidden>
                  <a-input v-decorator="['presentNum']" />
                </a-form-item>
                <a-form-item hidden>
                  <a-input v-decorator="['invoiceType']" />
                </a-form-item>
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px">
                  <div class="row-item wid-15">发货单编号</div>
                  <div class="row-item wid-35">
                    <a-input
                      read-only="read-only"
                      style="height: 30px; border: none"
                      v-decorator="['invoiceNum', {}]"
                    />
                  </div>
                  <div class="row-item wid-15">合同/赠送单(编号)</div>
                  <div class="row-item wid-35">
                    <a-form-item style="margin: 0">
                      <a-input
                        read-only="read-only"
                        placeholder="请选择合同编号/赠送单编号"
                        style="height: 30px; border: none"
                        v-decorator="[
                          'contractNum',
                          { rules: [{ required: true, message: '请选择合同编号/赠送单编号!' }] },
                        ]"
                        @click="openModel"
                      />
                    </a-form-item>
                  </div>
                </a-form-item>
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px">
                  <div class="row-item wid-15">客户名称</div>
                  <div class="row-item wid-35">
                    <a-input style="height: 30px; border: none" v-decorator="['customerName', {}]" />
                  </div>
                  <div class="row-item wid-15">运费结算方式</div>
                  <div class="row-item wid-35">
                    <a-form-item style="margin: 0">
                      <a-select
                        placeholder="运费结算方式"
                        @change="settlementMethodChange"
                        v-decorator="[
                          'settlementMethod',
                          { rules: [{ required: true, message: '请选择运费结算方式!' }] },
                        ]"
                      >
                        <a-select-option :value="1">代付</a-select-option>
                        <a-select-option :value="2">包邮</a-select-option>
                        <a-select-option :value="3">到付</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </a-form-item>

                <!-- 设置了运费，并且 运费结算方式 为 代付和包邮 才显示 -->
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px" v-show="needFreightCharge">
                  <div class="row-item wid-15">运费</div>
                  <div class="row-item wid-85">
                    <a-form-item style="margin: 0">
                      <a-input-number
                        style="width: 100%"
                        :min="0"
                        :step="0.1"
                        :precision="2"
                        placeholder="运费"
                        v-decorator="[
                          'freightCharge',
                          { rules: [{ required: settlementMethod !== 3, message: '请输入运费!' }] },
                        ]"
                      />
                    </a-form-item>
                  </div>
                </a-form-item>

                <a-form-item class="form-row clearfix" style="margin-bottom: 0px">
                  <div class="row-item wid-15">收货地址</div>
                  <div class="row-item wid-85">
                    <a-row>
                      <a-col :span="6">
                        <a-form-item style="margin: 0px">
                          <a-select
                            placeholder="省"
                            v-if="(show = true)"
                            v-decorator="['province', { rules: [{ required: true, message: '请选择省!' }] }]"
                          >
                            <a-select-option
                              @click="getCity(1, province.id)"
                              v-for="province in this.provinces"
                              :key="province.index"
                              :value="province.area"
                              >{{ province.area }}</a-select-option
                            >
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="6">
                        <a-form-item style="margin: 0 0 0 10px">
                          <a-select
                            placeholder="市"
                            v-if="(show = true)"
                            v-decorator="['city', { rules: [{ required: true, message: '请选择市!' }] }]"
                          >
                            <a-select-option
                              @click="getCity(2, city.id)"
                              v-for="city in this.citys"
                              :key="city.index"
                              :value="city.area"
                              >{{ city.area }}</a-select-option
                            >
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="6">
                        <a-form-item style="margin: 0 0 0 10px">
                          <a-select
                            placeholder="区"
                            v-if="(show = true)"
                            v-decorator="['area', { rules: [{ required: false, message: '请选择区!' }] }]"
                          >
                            <a-select-option v-for="area in this.areas" :key="area.index" :value="area.area">{{
                              area.area
                            }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="18">
                        <a-form-item style="margin: 0px">
                          <a-input
                            placeholder="请输入详细地址"
                            v-decorator="[
                              'addressDetail',
                              { rules: [{ required: false, message: '请输入详细地址!' }] },
                            ]"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                </a-form-item>
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px">
                  <div class="row-item wid-15">发货方式</div>
                  <div class="row-item wid-35">
                    <a-form-item style="margin: 0">
                      <a-select
                        placeholder="发货方式"
                        v-decorator="[
                          'delivery',
                          { initialValue: 1, rules: [{ required: false, message: '请选择发货方式!' }] },
                        ]"
                      >
                        <a-select-option :value="1">客户货站自提</a-select-option>
                        <a-select-option :value="2">送货上门</a-select-option>
                        <a-select-option :value="3">万德福自提</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                  <div class="row-item wid-15">收货人</div>
                  <div class="row-item wid-35">
                    <a-form-item style="margin: 0">
                      <a-input
                        style="height: 30px; border: none"
                        placeholder="请输入收货人"
                        v-decorator="['consignee', { rules: [{ required: true, message: '请输入收货人!' }] }]"
                      />
                    </a-form-item>
                  </div>
                </a-form-item>
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px">
                  <div class="row-item wid-15">联系方式</div>
                  <div class="row-item wid-85">
                    <a-form-item style="margin: 0">
                      <a-input
                        style="height: 30px; border: none"
                        placeholder="请输入联系方式"
                        v-decorator="[
                          'contactInformation',
                          { rules: [{ required: true, message: '请输入联系方式!' }] },
                        ]"
                      />
                    </a-form-item>
                  </div>
                </a-form-item>
                <a-table
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="false"
                  rowKey="id"
                  :loading="memberLoading"
                  bordered
                  :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                  :scroll="{ x: 2000 }"
                >
                  <div slot="order" slot-scope="text, record, index">
                    <span>{{ index + 1 }}</span>
                  </div>

                  <div slot="productType" slot-scope="text">
                    <span v-if="text == 0">常规产品</span>
                    <span v-if="text == 1">非常规产品</span>
                  </div>
                  <div slot="company" slot-scope="text">
                    <span v-if="text == 0">套</span>
                    <span v-if="text == 1">台</span>
                    <span v-if="text == 2">个</span>
                  </div>
                  <div slot="invoiceCount" slot-scope="text, record">
                    <a-input-number :min="1" :max="record.prevRemainCount" v-model="record.invoiceCount" />
                  </div>
                </a-table>
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px">
                  <div class="row-item wid-15">备注</div>
                  <div class="row-item wid-85">
                    <a-input
                      style="height: 30px; border: none"
                      placeholder="请输入备注"
                      v-decorator="['remarks', {}]"
                    />
                  </div>
                </a-form-item>
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px">
                  <div class="row-item wid-15">发货时间</div>
                  <div class="row-item wid-35" style="text-align: center">
                    <a-form-item style="margin: 0">
                      <a-date-picker
                        v-decorator="[
                          'deliveryTime',
                          { initialValue: moment(), rules: [{ required: true, message: '请选择发货时间!' }] },
                        ]"
                      />
                    </a-form-item>
                  </div>
                </a-form-item>
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px">
                  <div class="row-item wid-12">创建人</div>
                  <div class="row-item wid-12">
                    <a-input
                      read-only="read-only"
                      placeholder="无需输入"
                      style="height: 30px; border: none"
                      v-decorator="['createdName', {}]"
                    />
                  </div>
                  <div class="row-item wid-12">创建日期</div>
                  <div class="row-item wid-12">
                    <a-input
                      read-only="read-only"
                      placeholder="无需输入"
                      style="height: 30px; border: none"
                      v-decorator="['createdTime', {}]"
                    />
                  </div>
                  <div class="row-item wid-12">审批人</div>
                  <div class="row-item wid-12">
                    <a-input
                      disabled
                      placeholder="无需输入"
                      style="height: 30px; border: none"
                      v-decorator="['approveName', {}]"
                    />
                  </div>
                  <div class="row-item wid-12">审批日期</div>
                  <div class="row-item wid-12">
                    <a-input
                      disabled
                      placeholder="无需输入"
                      style="height: 30px; border: none"
                      v-decorator="['approveTime', {}]"
                    />
                  </div>
                </a-form-item>
              </div>
            </a-form>
          </div>
        </div>
      </div>
      <!--获取交款单位弹出层-->
      <ChoiceOrderFactory ref="invoiceContract" @change="contractChange" />
    </div>
  </a-spin>
</template>

<script>
import { getContractOne, getInvoiceNum, save, updateInvoice, getProductById } from '@api/invoice'
import { presentOrderDetail } from '@/api/receipt'
//import invoiceSaleContract from './invoiceSaleContract'
import ChoiceOrderFactory from './ChoiceOrderFactory'
import moment, { months } from 'moment'
import { getAreaByParent } from '@/api/common'
import AFormItem from 'ant-design-vue/es/form/FormItem'

const data = []
export default {
  name: 'invoiceModules',
  components: {
    AFormItem,
    ChoiceOrderFactory,
    moment,
  },
  props: {},
  data() {
    return {
      form: this.$form.createForm(this),
      memberLoading: false,
      loading: false,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      record: {},
      deliveryTime: moment(),
      provinces: [], // 省下拉框数据
      citys: [], // 城市下拉框数据
      areas: [], // 区下拉框数据
      show: true,
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '标的名称',
          dataIndex: 'targetName',
        },
        {
          title: '产品类别',
          dataIndex: 'productType',
          scopedSlots: { customRender: 'productType' },
        },
        {
          title: '产品代码',
          dataIndex: 'productModel',
          scopedSlots: { customRender: 'productModel' },
        },
        {
          title: '名称',
          dataIndex: 'productName',
          scopedSlots: { customRender: 'productName' },
        },
        {
          title: '规格型号',
          dataIndex: 'productStandard',
          scopedSlots: { customRender: 'productStandard' },
        },
        {
          title: '单位',
          dataIndex: 'company',
          scopedSlots: { customRender: 'company' },
        },
        {
          title: '数量',
          dataIndex: 'invoiceCount',
          scopedSlots: { customRender: 'invoiceCount' },
        },
      ],
      type: 'Add',
      settlementMethod: -1,
      spinning: false,
    }
  },
  computed: {
    btnActionTxt: function () {
      return this.type === 'Add' ? '保存' : '重新提交'
    },
    needFreightCharge: function () {
      return this.settlementMethod === 1 || this.settlementMethod === 2
    },
  },
  mounted() {
    console.log(this.$route.params)
    this.record = this.$route.params.record
    this.type = this.$route.params.type
    if (this.type == 'Add') {
      this.areaByParent()
      this.invoiceNum()
    }

    if (this.type === 'Edit') {
      this.initFillData()
      //this.form.setFieldsValue({...this.record})
    }
  },

  methods: {
    moment: moment,
    validatePhoneBlur(e) {
      const validatePhoneReg = /^1(3|4|5|7|8)\d{9}$/
      if (!validatePhoneReg.test(e)) {
        this.$message.error('请输入正确联系方式')
        return true
      } else {
        return false
      }
    },
    validateNameBlur(e) {
      const validateNameReg = /^[\u4e00-\u9fa5]+$/
      if (!validateNameReg.test(e)) {
        this.$message.error('请输入正确收货人')
        return true
      } else {
        return false
      }
    },
    async initFillData() {
      //山西省运城市夏县
      try {
        let [_provinceName, _cityName, _areaName, _address] = this.record.address.split(';')

        this.record.addressDetail = _address ? _address : this.record.address

        let _provinces = await this.areaByParent()
        this.provinces = _provinces
        let _provinceItem = _provinces.find((item) => item.area == _provinceName)
        this.record.province = _provinceItem ? _provinceItem.area : ''

        let _citys = await this.getCity(1, _provinceItem.id)
        this.citys = _citys
        let _cityItem = _citys.find((item) => item.area == _cityName)
        this.record.city = _cityItem ? _cityItem.area : ''

        let _areas = await this.getCity(2, _cityItem.id)
        this.areas = _areas
        let _areaItem = _areas.find((item) => item.area == _areaName)
        this.record.area = _areaItem ? _areaItem.area : ''
      } catch (err) {}

      this.edit()
    },
    getCity(type, pId) {
      return getAreaByParent({ pId: pId })
        .then((res) => {
          if (type === 1) {
            this.citys = res.data
          } else if (type === 2) {
            this.areas = res.data
          }
          return res.data
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log('selectedRowKeys', this.selectedRowKeys)
      console.log('selectedRows', this.selectedRows)
    },
    edit() {
      this.$nextTick(() => {
        this.settlementMethod = this.record.settlementMethod
        let obj = Object.assign(
          { ...this.record },
          {
            addressDetail: this.record.addressDetail,
            deliveryTime: moment(this.record.deliveryTime),
          }
        )
        console.log(obj)
        this.form.setFieldsValue(obj)
      })
      //debugger

      this.getProducts()
    },
    getProducts() {
      // 根据发货单id获取发货单产品
      const parameter = { invoiceId: this.record.id }
      getProductById(parameter).then((res) => {
        const listProduct = []
        console.log('res.data', res.data)
        for (const productKey in res.data) {
          const product = res.data[productKey]
          listProduct.push({
            id: product.contractProductId,
            targetName: product.products.targetName,
            productType: product.products.productType,
            productModel: product.products.contractProductPo.productModel,
            productName: product.products.contractProductPo.productName,
            productStandard: product.products.contractProductPo.productStandard,
            company: product.products.company,
            invoiceCount: product.invoiceCount,
          })
        }
        this.dataSource = listProduct
        console.log('this.dataSource', this.dataSource)
      })
    },
    areaByParent() {
      return getAreaByParent({ pId: 100000 })
        .then((res) => {
          // 所有省
          this.provinces = res.data
          return res.data
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    //获取收据单编号
    invoiceNum() {
      getInvoiceNum()
        .then((res) => {
          console.log('获取发货单编号的结果', res)
          this.form.setFieldsValue({ invoiceNum: res.data })
        })
        .catch((error) => {
          console.error(error)
        })
    },
    //弹出合同列表弹出层
    openModel() {
      console.log('openModel click')
      this.$refs.invoiceContract.query()
    },
    contractChange(result) {
      let that = this
      switch (result.selectedKey) {
        case 'invoiceSaleContract':
          that.fillContract(result.record)
          break
        case 'invoicePresentOrder':
          that.fillPresentOrder(result.record)
          break
        default:
          break
      }
    },
    //填充合同
    fillContract(data) {
      // debugger
      console.log('data', data)
      this.form.setFieldsValue({ contractNum: data.contractNum })
      this.form.setFieldsValue({ customerName: data.customerName })
      this.form.setFieldsValue({ contractId: data.contractId })
      this.form.setFieldsValue({ invoiceType: 0 })
      const paramter = { id: data.contractId, type: 0 }
      getContractOne(paramter).then((res) => {
        console.log('res.data.product', res.data)
        const listProduct = []
        for (let productKey in res.data.product) {
          const product = res.data.product[productKey]
          listProduct.push({
            id: product.id,
            targetName: product.targetName,
            productType: product.productType,
            productModel: product.contractProductPo.productModel,
            productName: product.contractProductPo.productName,
            productStandard: product.contractProductPo.productStandard,
            company: product.company,
            //'invoiceCount': (product.invoiceCount === undefined || product.invoiceCount === null) ? product.remainCount : product.invoiceCount,
            invoiceCount: product.remainCount,
            count: product.count,
            remainCount: product.remainCount,
            prevRemainCount: product.remainCount,
          })
        }
        //this.dataSource = listProduct
        this.dataSource = listProduct.filter((item) => item.remainCount > 0)
        console.log('this.dataSource', this.dataSource)
      })
    },
    //填充赠送订单
    fillPresentOrder(data) {
      let that = this
      presentOrderDetail({ presentId: data.id }).then((res) => {
        let _data = res.data
        that.form.setFieldsValue({ contractNum: data.presentNum })
        that.form.setFieldsValue({ presentNum: _data.presentNum })
        that.form.setFieldsValue({ customerName: _data.customerName })
        that.form.setFieldsValue({ presentId: _data.id })
        that.form.setFieldsValue({ invoiceType: 1 })

        that.dataSource = _data.productList
          .map((item) => {
            return {
              id: item.id,
              targetName: item.targetName,
              productType: item.productType,
              productModel: item.productCode,
              productName: item.productName,
              productStandard: item.productStand,
              company: item.company,
              invoiceCount: item.remainCount,
              count: item.count,
              remainCount: item.remainCount,
              prevRemainCount: item.remainCount,
            }
          })
          .filter((item) => item.remainCount > 0)
        console.log(res)
      })
    },
    // 最终全页面提交
    submit() {
      const _this = this
      this.form.validateFields((err, values) => {
        console.log(err, values)
        if (!err) {
          if (_this.selectedRows.length == 0) {
            this.$message.error('请勾选发货产品')
            return
          }
          //拼接新的地址
          //values.address = `${values.province};${values.city};${values.area};${values.addressDetail}`
          let __addr = []
          values.province && __addr.push(values.province)
          values.city && __addr.push(values.city)
          values.area && __addr.push(values.area)
          values.addressDetail && __addr.push(values.addressDetail)
          values.address = __addr.join(';')

          _this.$set(values, 'products', _this.selectedRows)
          _this.$set(values, 'Authorization', _this.$store.getters.token)
          console.log('json values :', JSON.stringify(values))

          values.freightCharge = values.freightCharge || 0

          if (_this.type === 'Add') {
            _this.spinning = true
            save(values)
              .then((res) => {
                _this.spinning = false
                if (res.code == 200) {
                  _this.goBackPricing()
                }
              })
              .catch((err) => {
                _this.spinning = false
              })
          } else {
            _this.spinning = true
            values.id = _this.record.id
            updateInvoice(values)
              .then((res) => {
                _this.spinning = false
                if (res.code == 200) {
                  _this.goBackPricing()
                }
              })
              .catch((err) => {
                _this.spinning = false
              })
          }
        }
      })
    },
    //返回
    goBackPricing() {
      //点击返回，返回发货单，并销毁module
      this.$router.push({ name: 'distribution_Invoice' })
      this.$destroy('distribution_InvoiceModules')
    },
    settlementMethodChange(e) {
      //console.log(e)
      this.settlementMethod = parseInt(e)
    },
  },
}
</script>

<style lang="less" scoped>
.content-wrap {
  background: #ffffff;
}

.content-inner {
  width: 1300px;
  margin: 0 auto;
  text-align: center;
  padding-bottom: 40px;
}

.inner-title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  line-height: 2;
  letter-spacing: 10px;
}

.inner-topr {
  text-align: right;
  margin-right: 8px;
  font-size: 18px;
  font-weight: bold;
}

.div-date {
  margin-bottom: 16px;
}

.form-container {
  border: 1px solid #dddddd;
}

.row-item {
  float: left;
  padding: 10px;
  min-height: 50px;
}

.form-row ~ .form-row {
  border-top: 1px solid #ddd;
}

.row-item ~ .row-item {
  border-left: 1px solid #dddddd;
}

.wid-12 {
  width: 12%;
}

.wid-15 {
  width: 15%;
}

.wid-35 {
  width: 35%;
}

.wid-85 {
  width: 85%;
}

.form-footer {
  margin-top: 28px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.stamp {
  height: 38px;
  line-height: 38px;
  text-align: left;
}

.wdf-handle {
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
}

.span-item ~ .span-item {
  margin-left: 14px;
}

.min-wid {
  min-width: 42px;
}

.crew {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
</style>

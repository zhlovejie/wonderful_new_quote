<template>
  <a-spin :spinning="spinning">
    <div>
      <div class="top-right clearfix">
        <a-button class="fl-r" type="primary" @click="addClick" :loading="loading" icon="check">提交</a-button>
        <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
      </div>
      <a-card class="card" title="产品信息" :bordered="false">
        <a-form :form="form" class="form">
          <a-row class="form-row" :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item hidden>
                <a-input v-decorator="['contractId']" />
              </a-form-item>
              <a-form-item label="收款编号">
                <a-input
                  disabled
                  placeholder="请输入收款编号"
                  v-decorator="[
                    'receiptCode',
                    { rules: [{ required: true, message: '请输入收款编号', whitespace: true }] },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item label="合同编号">
                <a-input
                  read-only="read-only"
                  @click="openModel"
                  placeholder="请选择合同编号"
                  v-decorator="[
                    'contractNum',
                    { rules: [{ required: true, message: '请选择合同编号', whitespace: true }] },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item label="客户名称">
                <a-input disabled placeholder="请选择客户名称" v-decorator="['customerName']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item label="结算方式">
                <a-select v-decorator="['moneyType', { rules: [{ required: true, message: '请选择结算方式' }] }]">
                  <a-select-option
                    @click="writeAccountNum(item)"
                    v-for="item in moneyTypes"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.unitName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item label="收款账号">
                <a-input disabled placeholder="请输入帐号" v-decorator="['accountNum']" />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item label="收款日期">
                <a-date-picker
                  style="width: 100%"
                  v-decorator="[
                    'receiptTime',
                    { initialValue: moment(), rules: [{ required: true, message: '请选择收款日期' }] },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :span="6">
              <a-form-item label="本次收款金额">
                <a-input-number
                  :precision="2"
                  :min="0"
                  v-decorator="['paidMoney', { rules: [{ required: false, message: '请输入本次收款金额' }] }]"
                  @change="paidMoneyChangeHandler"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item label="销售出库时间">
                <a-select
                  v-decorator="[
                    'outBoundTime',
                    { initialValue: 2, rules: [{ required: true, message: '请选择选择销售出库时间' }] },
                  ]"
                >
                  <a-select-option :value="1">2021年1月1日前发货</a-select-option>
                  <a-select-option :value="2">2021年1月1日后发货</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item label="是否存在抵扣">
                <a-select
                  @change="isDeductionclick"
                  v-decorator="[
                    'isDeduction',
                    { initialValue: 0, rules: [{ required: true, message: '请选择是否存在抵扣' }] },
                  ]"
                >
                  <a-select-option :value="0">否</a-select-option>
                  <a-select-option :value="1">是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row class="form-row" :gutter="16">
            <a-col :span="6">
              <a-form-item label="备注">
                <a-input placeholder="请输入备注信息" v-model="remark" />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24" v-if="showadd">
              <a-form-item label="抵扣单据">
                <a-input
                  read-only="read-only"
                  @click="paidModel"
                  :precision="2"
                  :min="0"
                  v-decorator="[
                    'saleAdvancesId',
                    { rules: [{ required: true, message: '请输入抵扣单据', whitespace: true }] },
                  ]"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col
              :xl="{ span: 7, offset: 1 }"
              :lg="{ span: 8 }"
              :md="{ span: 12 }"
              :sm="24"
              v-if="showDeduction && showadd"
            >
              <a-form-item label="抵扣金额">
                <a-input-number
                  :precision="2"
                  :min="0"
                  v-decorator="['deductionMoney', { rules: [{ required: true, message: '请输入抵扣金额' }] }]"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <a-table
          :columns="column"
          :dataSource="dataSource"
          :pagination="false"
          :loading="memberLoading"
          :scroll="{ x: 2500 }"
          bordered
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>

          <div slot="productTypeName" slot-scope="text">
            <span v-if="text == 0">常规产品</span>
            <span v-if="text == 1">非常规产品</span>
          </div>
          <template slot="payType" slot-scope="text, record">
            <a-select style="width: 100px" :defaultValue="record.paidType">
              <a-select-option
                @click="onCellChange(record.id, 'payType', item.id)"
                v-for="item in record.payType"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </template>

          <template slot="paidMoney" slot-scope="text, record">
            <editable-cell :text="String(text)" @change="onCellChange(record.id, 'paidMoney', $event)" />
          </template>

          <template slot="settlementDiscount" slot-scope="text, record">
            <editable-cell :text="String(text)" @change="onCellChange(record.id, 'settlementDiscount', $event)" />
          </template>

          <template slot="freightCharge" slot-scope="text, record">
            <editable-cell :text="String(text || 0)" @change="onCellChange(record.id, 'freightCharge', $event)" />
          </template>

          <template slot="currency" slot-scope="text, record">
            <a-select style="width: 100px" defaultValue="人民币">
              <a-select-option
                defaultValue="1"
                @click="onCellChange(record.id, 'currency', $event)"
                v-for="item in currencys"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </template>

          <template slot="currencyRate" slot-scope="text, record">
            <!-- <editable-cell disabled :text="String(text)" @change="onCellChange(record.id, 'currencyRate', $event)" /> -->
            <!-- <editable-cell disabled :text="1"  /> -->
            <span>{{ text }}%</span>
          </template>

          <template slot="operation" slot-scope="text, record">
            <span>
              <a @click="saveRow(record)">保存</a>
            </span>
          </template>
        </a-table>

        <a-row>
          <a-col :span="24" class="basic-vice-tit" justify="center">总订货清单</a-col>
        </a-row>
        <a-table
          :columns="columns"
          :dataSource="dataSourceContract"
          :pagination="false"
          rowKey="id"
          :loading="memberLoading"
          bordered
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
            <span v-if="text == 3">块</span>
            <span v-if="text == 4">条</span>
            <span v-if="text == 5">根</span>
            <span v-if="text == 6">张</span>
            <span v-if="text == 7">卷</span>
          </div>
        </a-table>
        <a-row>
          <a-col :span="24" class="basic-vice-tit" justify="center">已发货清单</a-col>
        </a-row>
        <a-table
          :columns="columns"
          :dataSource="dataSourceDelivered"
          :pagination="false"
          rowKey="id"
          :loading="memberLoading"
          bordered
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
            <span v-if="text == 3">块</span>
            <span v-if="text == 4">条</span>
            <span v-if="text == 5">根</span>
            <span v-if="text == 6">张</span>
            <span v-if="text == 7">卷</span>
          </div>
        </a-table>
        <a-row>
          <a-col :span="24" class="basic-vice-tit" justify="center">未发货清单</a-col>
        </a-row>
        <a-table
          :columns="columns"
          :dataSource="dataSourceUnshipped"
          :pagination="false"
          rowKey="id"
          :loading="memberLoading"
          bordered
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
            <span v-if="text == 3">块</span>
            <span v-if="text == 4">条</span>
            <span v-if="text == 5">根</span>
            <span v-if="text == 6">张</span>
            <span v-if="text == 7">卷</span>
          </div>
        </a-table>

        <receipt-sale-contract ref="receiptContract" @custom-change="contractChange"></receipt-sale-contract>
        <Receiptdocument ref="receiptdocument" @custom-change="receiptChange" />
      </a-card>
    </div>
  </a-spin>
</template>

<script>
import EditableCell from '@/components/Table/EditableCell'
import { getAccountBankList, getContractOne, goAdd, save, receiptDetail, updateReceipt } from '@/api/receipt'
import ReceiptSaleContract from './ReceiptSaleContract'
import Receiptdocument from './Receiptdocument'
import { getDeductionList } from '@/api/receipt'

import { getDeliverProductList, getContractById, getUnshipped } from '@/api/delayedPayment'
import moment from 'moment'

const data = []

let _column = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    width: '200px',
  },
  {
    title: '产品类型',
    dataIndex: 'productTypeName',
    scopedSlots: { customRender: 'productTypeName' },
    width: '200px',
  },
  {
    title: '产品代码',
    dataIndex: 'productStandard',
    width: '200px',
  },
  {
    title: '金额',
    dataIndex: 'price',
    width: '200px',
  },
  {
    title: '结算方式',
    dataIndex: 'payType',
    scopedSlots: { customRender: 'payType' },
    width: '200px',
  },
  {
    title: '已收金额(元)',
    dataIndex: 'receivable',
    width: '200px',
  },
  {
    title: '本次实收金额(元)',
    dataIndex: 'paidMoney',
    scopedSlots: { customRender: 'paidMoney' },
    width: '200px',
  },
  {
    title: '结算折扣金额(元)',
    dataIndex: 'settlementDiscount',
    scopedSlots: { customRender: 'settlementDiscount' },
    width: '200px',
  },
  {
    title: '币种',
    dataIndex: 'currency',
    scopedSlots: { customRender: 'currency' },
    width: '150px',
  },
  {
    title: '币率',
    dataIndex: 'currencyRate',
    scopedSlots: { customRender: 'currencyRate' },
    width: '150px',
  },
  {
    title: '操作',
    width: '160px',
    scopedSlots: { customRender: 'operation' },
  },
]

export default {
  name: 'ReceiptAdd',
  components: {
    ReceiptSaleContract,
    EditableCell,
    Receiptdocument,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      addDisabled: false,
      memberLoading: false,
      moneyTypes: [],
      loading: false,
      showadd: false,
      showDeduction: false,
      visibleBoolean: false,
      dataSourceContract: [], //合同产品列表
      dataSourceDelivered: [], //已发货产品列表
      dataSourceUnshipped: [], //未发货产品列表
      contractId: '',
      customName: '',
      remark: '',
      contractType: '',
      currencys: [
        {
          id: 1,
          name: '人民币',
        },
      ],
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
          width: '200px',
        },
        {
          title: '产品类别',
          dataIndex: 'productType',
          scopedSlots: { customRender: 'productType' },
          width: '200px',
        },
        {
          title: '产品代码',
          dataIndex: 'productStandard',
          scopedSlots: { customRender: 'productStandard' },
          width: '200px',
        },
        {
          title: '单位',
          dataIndex: 'company',
          scopedSlots: { customRender: 'company' },
        },
        {
          title: '数量',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' },
        },
        {
          title: '总金额',
          dataIndex: 'amountMoney',
          scopedSlots: { customRender: 'amountMoney' },
        },
      ],

      dataSource: [],
      queryParam: [],
      saleUserId: undefined,
      Deduction: {},
      spinning: false,
      freightType: 1,
      freightCharge: 0,
      // 加载数据方法 必须为 Promise 对象
    }
  },
  mounted() {
    this.spinning = false
    this.contractType = this.$route.params.contractType
    this.init()
  },
  computed: {
    isEdit() {
      let params = this.$route.params
      return params && params.action === 'edit'
    },
    column() {
      //debugger
      let _freightChargeIndex = _column.findIndex((item) => item.dataIndex === 'freightCharge')
      if (this.freightType === 0) {
        if (_freightChargeIndex === -1) {
          let _index = _column.findIndex((item) => item.dataIndex === 'payType')
          _column.splice(_index, 0, {
            title: '运费',
            dataIndex: 'freightCharge',
            scopedSlots: { customRender: 'freightCharge' },
            width: '150px',
          })
        }
      } else {
        _freightChargeIndex >= 0 && _column.splice(_freightChargeIndex, 1)
      }
      console.log(_column)
      return _column
    },
  },
  watch: {
    $route(to, from) {
      if (to.name === 'ReceiptAdd') {
        this.contractType = this.$route.params.contractType
        this.init()
      }
    },
  },
  methods: {
    moment: moment,
    // 动态控制抵扣单据 抵扣金额的显示隐藏
    isDeductionclick(e) {
      this.showadd = e === 0 ? false : true
    },

    // 编辑表格
    onCellChange(key, dataIndex, value) {
      this.visibleBoolean = false
      const dataSource = [...this.dataSource]
      const target = dataSource.find((item) => item.id === key)
      if (dataIndex == 'payType') {
        target['payTypeNew'] = value
        this.dataSource = dataSource
        return
      }
      if (dataIndex == 'currency') {
        target['currencyNew'] = value
        this.dataSource = dataSource
        return
      }
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    async init() {
      let that = this
      console.log('that.isEdit:', that.isEdit)
      if (that.isEdit) {
        //驳回重新提交 回显数据
        // 获取当前合同客户的开户行信息
        await getAccountBankList().then((res) => {
          that.moneyTypes = res.data
        })
        //加载单据详细信息
        let receiptDetailResult = await receiptDetail({ id: that.$route.params.id }).then((res) => {
          return res.data
        })
        //根据合同id获取合同信息
        let contractResult = await getContractById({ id: receiptDetailResult.contractId }).then((res) => {
          return res.data
        })
        //获取预收款的对象
        getDeductionList({
          id: receiptDetailResult.saleAdvancesId,
          receiptId: that.$route.params.id,
        }).then((res) => {
          this.Deduction = res.data.records[0]
          this.Deduction.Deduction = Number(this.Deduction.paidMoney) - Number(this.Deduction.deductionMoney)
        })

        that.contractId = contractResult.id
        that.customName = contractResult.customerName
        that.freightType = contractResult.freightType
        that.freightCharge = contractResult.freightCharge

        const record = {
          contractNum: contractResult.contractNum,
          customerName: contractResult.saleCustomer.name,
          contractId: contractResult.id,
        }
        if (receiptDetailResult.isDeduction === 1) {
          this.showadd = true
          this.showDeduction = true
          this.Deduction.id = receiptDetailResult.saleAdvancesId
        }

        this.$nextTick(() => {
          this.form.setFieldsValue({ ...record })
        })
        let arr = {
          saleAdvancesId: receiptDetailResult.advancesCode,
          outBoundTime: receiptDetailResult.outBoundTime,
          isDeduction: receiptDetailResult.isDeduction,
          deductionMoney: receiptDetailResult.deductionMoney,
        }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...arr })
        })

        that.form.setFieldsValue({
          receiptCode: receiptDetailResult.receiptCode,
          contractNum: receiptDetailResult.contractNum,
          customerName: receiptDetailResult.saleCustomerName,
          moneyType: getPayTypeID(),
          accountNum: receiptDetailResult.payNumber,
          receiptTime: moment(receiptDetailResult.receiptTime.substring(0, 10)),
          paidMoney: receiptDetailResult.paidMoney,
        })

        that.remark = receiptDetailResult.remark ? receiptDetailResult.remark : ''

        function getPayTypeID() {
          let target = that.moneyTypes.find(
            (type) =>
              type.unitName === receiptDetailResult.payTypeName && type.accountNum === receiptDetailResult.payNumber
          )
          return target ? target.id : -1
        }

        let productDataSource = receiptDetailResult.detailsList.map((p) => {
          p.productTypeName = p.productType === '常规产品' ? '0' : '1'
          p.productStandard = p.productModel
          p.price = p.countMoney
          p.payTypeNew = p.paidType
          p.currencyNew = p.currency

          p.payType =
            contractResult.fullAmount == 0
              ? [{ id: 0, name: '全款' }]
              : [
                  { id: 1, name: '质保金' },
                  { id: 2, name: '进度款' },
                  { id: 3, name: '验收款' },
                  { id: 4, name: '预付款' },
                  { id: 5, name: '提货款' },
                ]
          return p
        })
        //产品信息内的产品列表
        that.dataSource = productDataSource

        //总订货清单
        that.setDataSource(contractResult)
        //获取已发货产品
        await getUnshipped({ receiptId: that.$route.params.id })
          .then((res) => {
            const listProductDelivered = []
            for (const productKey in res.data) {
              const product = res.data[productKey]
              listProductDelivered.push({
                id: product.id,
                invoiceProductId: product.invoiceProductId,
                targetName: product.targetName,
                productType: product.productType,
                productStandard: product.productStandard,
                company: product.company,
                count: product.count,
                amountMoney: product.amountMoney,
              })
            }
            that.dataSourceDelivered = listProductDelivered
          })
          .then(() => {
            //计算未发货产品
            that.setUnshipped()
          })
          .catch((err) => {
            console.log(err)
          })

        that.visibleBoolean = true
        
      } else {
        //原新增处理方式
        goAdd().then((res) => that.form.setFieldsValue({ receiptCode: res.data }))
      }
    },
    add(res) {
      // const data = {"receiptCode"}
    },
    openModel() {
      if (this.isEdit) {
        return
      }
      this.$refs.receiptContract.query({ type: 0 })
    },
    //接收弹出单据数据
    receiptChange(data) {
      this.Deduction = data
      this.showDeduction = true
      const record = {
        saleAdvancesId: this.Deduction.advancesCode,
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },
    //弹出单据
    paidModel() {
      if (this.isEdit) {
        return
      }
      if (this.saleUserId) {
        this.$refs.receiptdocument.query({ saleUserId: this.saleUserId })
      } else {
        this.$message.error('请先选择销售合同编码')
      }
    },
    contractChange(data) {
      const paramter = { id: data.contractId, type: 1 }
      this.saleUserId = data.saleUserId
      getContractOne(paramter)
        .then((res) => {
          const record = {
            contractNum: res.data.contractNum,
            customerName: res.data.customerName,
            contractId: res.data.id,
          }
          this.contractId = res.data.id
          this.customName = res.data.customerName
          this.freightType = res.data.freightType
          this.freightCharge = res.data.freightCharge
          this.$nextTick(() => {
            this.form.setFieldsValue({ ...record })
          })
          const listProduct = []
          const listProductContract = []
          for (const productKey in res.data.product) {
            console.log('productKey ...' + JSON.stringify(productKey))
            const product = res.data.product[productKey]
            const settlement = []
            let isFullAmount = res.data.fullAmount === 0 ? true : false
            if (res.data.fullAmount == 0) {
              settlement.push({
                id: 0,
                name: '全款',
              })
            } else {
              if (product.productType == 1) {
                for (const sett in res.data.unconventionalSettlement) {
                  const ment = res.data.unconventionalSettlement[sett]
                  console.log('sett...' + JSON.stringify(res.data.unconventionalSettlement[sett]))
                  if (ment.moneyType == 1) {
                    settlement.push({
                      id: 1,
                      name: '质保金',
                    })
                  }
                  if (ment.moneyType == 2) {
                    settlement.push({
                      id: 2,
                      name: '进度款',
                    })
                  }
                  if (ment.moneyType == 3) {
                    settlement.push({
                      id: 3,
                      name: '验收款',
                    })
                  }
                  if (ment.moneyType == 4) {
                    settlement.push({
                      id: 4,
                      name: '预付款',
                    })
                  }
                  if (ment.moneyType == 5) {
                    settlement.push({
                      id: 5,
                      name: '提货款',
                    })
                  }
                }
              } else {
                for (let i = 0; i < res.data.routineSettlement.length; i++) {
                  const ement = res.data.routineSettlement[i]
                  console.log('sett...', ement)
                  if (ement.moneyType == 1) {
                    settlement.push({
                      id: 1,
                      name: '质保金',
                    })
                  }
                  if (ement.moneyType == 2) {
                    settlement.push({
                      id: 2,
                      name: '进度款',
                    })
                  }
                  if (ement.moneyType == 3) {
                    settlement.push({
                      id: 3,
                      name: '验收款',
                    })
                  }
                  if (ement.moneyType == 4) {
                    settlement.push({
                      id: 4,
                      name: '预付款',
                    })
                  }
                  if (ement.moneyType == 5) {
                    settlement.push({
                      id: 5,
                      name: '提货款',
                    })
                  }
                }
              }
            }
            let __price = Number(product.count * product.unitPrice) || 0
            let __receivable = Number(product.receivable) || 0
            let __paidMoney = Number(__price - __receivable).toFixed(2)
            listProduct.push({
              id: product.id,
              productName: product.contractProductPo.productName,
              productTypeName: product.productType,
              productStandard: product.contractProductPo.productModel,
              //price: product.count * product.unitPrice*(product.taxRate/100+1),
              price: Number(__price).toFixed(2),
              receivable: Number(__receivable).toFixed(2),
              payType: settlement,
              currencyRate: 1,
              payTypeNew: settlement.length > 0 ? settlement[0].id : undefined,
              currencyNew: 1,
              paidMoney: 0,
              settlementDiscount: 0,
              currency: [
                {
                  id: 1,
                  name: '人民币',
                },
              ],
              paidType: settlement.length > 0 ? settlement[0].id : undefined,
            })
            // 合同产品
            listProductContract.push({
              id: product.id,
              targetName: product.targetName,
              productType: product.productType,
              productStandard: product.contractProductPo.productModel,
              company: product.company,
              count: product.count,
              amountMoney: Math.round(product.count * product.unitPrice),
            })
          }

          this.dataSource = listProduct.filter((item) => +item.receivable < +item.price)

          this.visibleBoolean = true

          this.dataSourceContract = listProductContract
          //this.dataSourceUnshipped = JSON.parse(JSON.stringify(listProductContract))
          this.dataSourceUnshipped = listProductContract
            .map((item) => Object.assign({}, item))
            .filter((item) => item.count > 0)

          console.log('this.dataSource', this.dataSource)
          // 获取当前合同客户的开户行信息
          getAccountBankList().then((res) => {
            this.moneyTypes = res.data
          })
        })
        .then(() => {
          // Do something
          this.setDelivered()
        })
        .catch(() => {
          // Do something
        })
        .finally(() => {
          // Do something
        })
    },
    // 添加已发产品
    setDelivered() {
      const parameter = { contractId: this.contractId }
      getDeliverProductList(parameter)
        .then((res) => {
          const listProductDelivered = []
          for (const productKey in res.data) {
            const product = res.data[productKey]
            listProductDelivered.push({
              invoiceProductId: product.contractProductId,
              targetName: product.products.targetName,
              productType: product.products.productType,
              productStandard: product.products.contractProductPo.productModel,
              company: product.products.company,
              count: product.invoiceCount,
              amountMoney: Math.round(product.products.count * product.products.unitPrice),
            })
          }
          this.dataSourceDelivered = listProductDelivered
        })
        .then(() => {
          // Do something
          this.setUnshipped()
        })
        .catch(() => {
          // Do something
        })
        .finally(() => {
          // Do something
        })
    },
    // 计算未发货产品
    setUnshipped() {
      for (let i = 0; i < this.dataSourceUnshipped.length; i++) {
        for (let j = 0; j < this.dataSourceDelivered.length; j++) {
          if (this.dataSourceUnshipped[i].id == this.dataSourceDelivered[j].invoiceProductId) {
            this.dataSourceUnshipped[i].count = this.dataSourceUnshipped[i].count - this.dataSourceDelivered[j].count
            this.dataSourceUnshipped[i].amountMoney =
              this.dataSourceUnshipped[i].amountMoney - this.dataSourceDelivered[j].amountMoney
          }
        }
      }
      this.dataSourceUnshipped = this.dataSourceUnshipped.filter((item) => item.count > 0)
      console.log('this.dataSourceUnshipped', JSON.stringify(this.dataSourceUnshipped))
      console.log('this.dataSource', this.dataSource)
    },
    // 返回
    goBackPricing() {
      this.dataSource = []
      this.form.resetFields()
      // 点击返回，返回核价单列表页
      this.$router.push({ name: 'receiptList' })
      this.$destroy('ReceiptAdd')
    },
    writeAccountNum(record) {
      const data = { accountNum: record.accountNum }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    addClick() {
      let that = this

      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          debugger
          if (!this.visibleBoolean) {
            this.$message.error('请先补全产品信息数据')
            that.spinning = false
            return
          }
          if (this.Deduction.Deduction < values.deductionMoney && this.showadd) {
            that.spinning = false
            return this.$message.error('抵扣金额必须小于等于预收款单金额 不得大于')
          }
          var money = Number(0)

          // 没有产品时特殊处理 取 本次收款金额 输入的金额
          if(this.dataSource.length === 0){
            money = Number(values.paidMoney) || 0
          }else{
            for (const key in this.dataSource) {
              // 需要数据转换
              this.dataSource[key].payType = this.dataSource[key].payTypeNew
              this.dataSource[key].currency = this.dataSource[key].currencyNew
              money += Number(this.dataSource[key].paidMoney)
            }
          }
          this.$set(values, 'receiptDetails', this.dataSource)
          this.$set(values, 'paidMoney', money)
          this.$set(values, 'contractType', this.contractType)
          this.$set(values, 'customName', this.customName)
          this.$set(values, 'remark', this.remark)
          const parameter = { productList: this.dataSourceDelivered }
          this.$set(values, 'receiptProductVo', parameter)
          values.receiptTime = values.receiptTime.format('YYYY-MM-DD')
          console.log(values)
          values.saleAdvancesId = this.Deduction.id
          // return
          if (that.isEdit) {
            values.id = that.$route.params.id
            that.spinning = true
            updateReceipt(values).then((res) => {
              if (res.code == 200) {
                that.spinning = false
                this.goBackPricing()
              } else {
                console.log(res)
                that.spinning = false
              }
            })
          } else {
            //由于 新增流程 不需要调用 receiptDetail 接口（该接口返回的数据包含productId 字段）
            //所以 提交的时候 需要加个该字段
            values.receiptDetails = values.receiptDetails.map((item) => {
              item.productId = item.id
              return item
            })
            that.spinning = true
            save(values).then((res) => {
              if (res.code == 200) {
                that.spinning = false
                this.goBackPricing()
              } else {
                console.log(res)
                that.spinning = false
              }
            })
          }
        } else {
          that.spinning = false
        }
      })
    },
    saveRow(record) {
      console.log(record)
      this.visibleBoolean = false
      if (record.paidMoney == undefined || record.paidMoney == 0) {
        this.$message.error('请输入本次收款金额')
        return
      }
      if (record.settlementDiscount == undefined) {
        this.$message.error('请输入结算折扣金额')
        return
      }
      if (record.payTypeNew == -1) {
        this.$message.error('请输入选择结算方式')
        return
      }
      if (record.currencyNew == 0) {
        this.$message.error('请输入选择币种')
        return
      }
      if (record.currencyRate == undefined || record.currencyRate == 0) {
        this.$message.error('请输入币率')
        return
      }
      // this.$message.info('保存成功')
      this.visibleBoolean = true
    },
    setDataSource(data) {
      // 添加合同产品
      const listProduct = []
      for (const productKey in data.product) {
        const product = data.product[productKey]
        listProduct.push({
          id: product.id,
          targetName: product.targetName,
          productType: product.productType,
          productStandard: product.contractProductPo.productModel,
          company: product.company,
          count: product.count,
          amountMoney: Math.round(product.count * product.unitPrice * (1 + product.taxRate / 100)),
        })
      }
      this.dataSourceContract = listProduct
      //this.dataSourceUnshipped = JSON.parse(JSON.stringify(listProduct))
      this.dataSourceUnshipped = listProduct.map((item) => Object.assign({}, item)).filter((item) => item.count > 0)
    },
    paidMoneyChangeHandler(e) {
      let _totalPaidMoney = parseFloat(e) || 0
      let _dataSource = this.dataSource.map((item) => {
        //debugger
        let _item = Object.assign({}, item)
        let __price = Number(_item.price) || 0
        let __receivable = Number(_item.receivable) || 0
        let __paidMoney = Number(__price - __receivable)
        if (_totalPaidMoney >= __paidMoney) {
          _totalPaidMoney -= __paidMoney
          _item.paidMoney = __paidMoney
        } else {
          if (_totalPaidMoney > 0) {
            _item.paidMoney = _totalPaidMoney
            _totalPaidMoney = 0
          } else {
            _item.paidMoney = 0
          }
        }
        return _item
      })
      this.dataSource = [..._dataSource]
    },
  },
}
</script>
<style lang="less" scoped>
.top-right {
  margin-bottom: 12px;
  margin-right: 6px;
}

.clearfix:after {
  display: block;
  content: '';
  width: 100%;
  height: 0;
  clear: both;
}

.clearfix {
  zoom: 1;
}

.fl-r {
  float: right;
  margin-left: 8px;
}
</style>

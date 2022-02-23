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
              <a-form-item label="负责人">
                <a-input disabled placeholder="请输入负责人" v-decorator="['saleUserName']" />
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
            <a-col :span="1"> </a-col>
            <a-col :lg="7" :md="12" :sm="24">
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
            <a-col :span="1"> </a-col>
            <a-col :span="7">
              <a-form-item label="收款凭证">
                <a-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :file-list="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-if="fileList.length < 3">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传凭证</div>
                  </div>
                </a-upload>
                <a-modal title="查看" :visible="previewVisible" :footer="null" @cancel="previewCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-form-item>
            </a-col>

            <!-- <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24" v-if="showadd">
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
            </a-col> -->
            <!-- <a-col
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
            </a-col> -->
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
            <span>{{ text }}%</span>
          </template>

          <template slot="operation" slot-scope="text, record">
            <span>
              <a @click="saveRow(record)">保存</a>
            </span>
          </template>
        </a-table>
        <receipt-sale-contract ref="receiptContract" @custom-change="contractChange"></receipt-sale-contract>
        <Receiptdocument ref="receiptdocument" @custom-change="receiptChange" />
      </a-card>
    </div>
  </a-spin>
</template>

<script>
import EditableCell from '@/components/Table/EditableCell'
import { getAccountBankList, goAdd, save, receiptDetail, updateReceipt } from '@/api/receipt'
import { accessoriesGetDetailById } from '@/api/after-sales-management'

import ReceiptSaleContract from './ReceiptSaleContract'
import Receiptdocument from './Receiptdocument'
import { getUploadPath2, getAreaByParent } from '@/api/common'
import { getDeductionList } from '@/api/receipt'
let uuid = () => Math.random().toString(32).slice(-10)
// import { getDeliverProductList, getContractById, getUnshipped } from '@/api/delayedPayment'
import moment from 'moment'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
const data = []
const column = [
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
    title: '产品代码',
    dataIndex: 'productModel',
    width: '200px',
  },
  {
    title: '金额',
    dataIndex: 'countMoney',
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
      column,
      fileList: [],
      previewVisible: false, // 图片预览框是否可见
      previewImage: '', //  预览图片的src值
      uploadUrl: getUploadPath2(),
      form: this.$form.createForm(this),
      addDisabled: false,
      memberLoading: false,
      moneyTypes: [],
      loading: false,
      showadd: false,
      showDeduction: false,
      visibleBoolean: false,
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
  },
  watch: {
    $route(to, from) {
      if (to.name === 'AfterSalesReceiptAdd') {
        this.init()
      }
    },
  },
  methods: {
    moment: moment,
    previewCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      // 点击文件链接或预览图标时的回调
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ file, fileList }) {
      // debugger
      // 上传中、完成、失败都会调用这个函数。
      // fileList = fileList.slice(-1)
      if (file.status !== 'uploading') {
        console.log(file, fileList)
      }
      if (file != null && file.status === 'done') {
        // 状态有：uploading done error removed
        if (file.response.code === 200) {
          // 成功
          console.log('file.response.data[0]', file.response.data[0])
          this.form.setFieldsValue({ url: file.response.data[0].url })
          this.form.setFieldsValue({ showPic: file.response.data[0].pic })
        }
      } else if (file.status === 'removed') {
        // 删除清空
        this.form.setFieldsValue({ url: '' })
      }
      this.fileList = fileList // 展示照片墙
    },
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

        that.form.setFieldsValue({
          receiptCode: receiptDetailResult.receiptCode,
          contractNum: receiptDetailResult.contractNum,
          customerName: receiptDetailResult.saleCustomerName,
          moneyType: getPayTypeID(),
          accountNum: receiptDetailResult.payNumber,
          receiptTime: moment(receiptDetailResult.receiptTime.substring(0, 10)),
          paidMoney: receiptDetailResult.paidMoney,
          remark: receiptDetailResult.remark,
        })
        this.contractId = receiptDetailResult.contractId
        if (receiptDetailResult.evidenceUrl != null && receiptDetailResult.evidenceUrl.length > 0) {
          let react = receiptDetailResult.evidenceUrl.split(',')
          this.fileList = react.map((i) => {
            return {
              uid: uuid(),
              name: i.substr(41, 300),
              status: 'done',
              url: i,
            }
          })
        }

        function getPayTypeID() {
          let target = that.moneyTypes.find(
            (type) =>
              type.unitName === receiptDetailResult.payTypeName && type.accountNum === receiptDetailResult.payNumber
          )
          return target ? target.id : -1
        }

        let productDataSource = receiptDetailResult.detailsList.map((p) => {
          p.currency = [
            {
              id: 1,
              name: '人民币',
            },
          ]

          return p
        })
        //产品信息内的产品列表
        that.dataSource = productDataSource
        //总订货清单
        that.setDataSource(contractResult)

        that.visibleBoolean = true
        //获取已发货产品
        // await getUnshipped({ receiptId: that.$route.params.id })
        //   .then((res) => {
        //     const listProductDelivered = []
        //     for (const productKey in res.data) {
        //       const product = res.data[productKey]
        //       listProductDelivered.push({
        //         id: product.id,
        //         invoiceProductId: product.invoiceProductId,
        //         targetName: product.targetName,
        //         productType: product.productType,
        //         productStandard: product.productStandard,
        //         company: product.company,
        //         count: product.count,
        //         amountMoney: product.amountMoney,
        //       })
        //     }
        //     that.dataSourceDelivered = listProductDelivered
        //   })
        //   .then(() => {
        //     //计算未发货产品
        //     that.setUnshipped()
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })
      } else {
        //原新增处理方式
        await goAdd().then((res) => that.form.setFieldsValue({ receiptCode: res.data }))
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
      const paramter = { id: data.id }
      accessoriesGetDetailById(paramter)
        .then((res) => {
          console.log(res.data)
          const record = {
            contractNum: res.data.accessoriesContractNum,
            customerName: res.data.customerName,
            contractId: res.data.id,
            saleUserName: res.data.afterUserName,
          }
          this.contractId = res.data.id
          this.customName = res.data.customerName
          this.freightType = res.data.freightType
          this.freightCharge = res.data.freightCharge
          this.$nextTick(() => {
            this.form.setFieldsValue({ ...record })
          })
          this.dataSource = res.data.productInfoList.map((i) => {
            return {
              productName: i.materialName,
              productModel: i.materialCode,
              countMoney: i.quantity * i.unitPrice,
              receivable: i.receivable,
              paidMoney: 0,
              productId: i.id,
              settlementDiscount: 0,
              currencyRate: 1,
              currency: [
                {
                  id: 1,
                  name: '人民币',
                },
              ],
            }
          })
          console.log('this.dataSource', this.dataSource)
          this.visibleBoolean = true
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
    // 返回
    goBackPricing() {
      this.dataSource = []
      this.form.resetFields()
      // 点击返回，返回核价单列表页
      this.$router.push({ name: 'After_sales_receipt' })
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
          for (const key in this.dataSource) {
            // 需要数据转换
            this.dataSource[key].payType = this.dataSource[key].payTypeNew
            this.dataSource[key].currency = this.dataSource[key].currencyNew
            money += Number(this.dataSource[key].paidMoney)
          }
          this.$set(values, 'receiptDetails', this.dataSource)
          this.$set(values, 'paidMoney', money)
          this.$set(values, 'contractType', this.contractType)
          this.$set(values, 'customName', this.customName)
          this.$set(values, 'remark', this.remark)
          this.$set(values, 'contractType', 6)
          delete values.saleUserName
          values.receiptTime = values.receiptTime.format('YYYY-MM-DD')
          console.log(values)
          values.saleAdvancesId = this.Deduction.id
          if (this.fileList.length !== 0) {
            values.evidenceUrl = this.fileList.map((i) => (i.response && i.response.data) || i.url).toString() || ''
          }
          //return
          if (that.isEdit) {
            values.id = that.$route.params.id
            values.contractId = this.contractId
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
            // values.receiptDetails = values.receiptDetails.map((item) => {
            //   item.productId = item.id
            //   return item
            // })
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
      this.$message.info('保存成功')
      this.visibleBoolean = true
    },
    setDataSource(data) {
      // 添加合同产品
      // const listProduct = []
      // for (const productKey in data.product) {
      //   const product = data.product[productKey]
      //   listProduct.push({
      //     id: product.id,
      //     targetName: product.targetName,
      //     productType: product.productType,
      //     productStandard: product.contractProductPo.productModel,
      //     company: product.company,
      //     count: product.count,
      //     amountMoney: Math.round(product.count * product.unitPrice * (1 + product.taxRate / 100)),
      //   })
      // }
      // this.dataSourceContract = listProduct
      //this.dataSourceUnshipped = JSON.parse(JSON.stringify(listProduct))
      // this.dataSourceUnshipped = listProduct.map((item) => Object.assign({}, item)).filter((item) => item.count > 0)
    },
    paidMoneyChangeHandler(e) {
      let _totalPaidMoney = parseFloat(e) || 0
      let _dataSource = this.dataSource.map((item) => {
        //debugger
        let _item = Object.assign({}, item)
        let __price = Number(_item.countMoney) || 0
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

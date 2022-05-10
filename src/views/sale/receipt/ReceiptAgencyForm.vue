<template>
  <a-spin :spinning="spinning">
    <div>
      <div class="top-right clearfix">
        <template v-if="isAdd || isEdit">
          <a-button class="fl-r" type="primary" @click="addClick" :loading="loading" icon="check">提交</a-button>
        </template>
        <template v-if="isApproval">
          <!-- <a-button class="fl-r" type="primary" @click="receiptAudit('1')" icon="">通过</a-button>
          <a-button class="fl-r" type="primary" @click="receiptAudit('2')" :loading="loading" icon="">不通过</a-button>
         -->
          <a-button key="back" class="fl-r" icon="close" @click="noPassAction">不通过</a-button>
          <a-button key="submit" class="fl-r" style="margin-left:10px;" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
        
        </template>
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
                  :disabled="isDisabled" 
                  placeholder="收款编号"
                  v-decorator="[
                    'receiptCode',
                    {
                      initialValue: receiptDetailResult.receiptCode, 
                      rules: [{ required: true, message: '请输入收款编号', whitespace: true }] 
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item label="合同编号">
                <a-input 
                  :disabled="isDisabled" 
                  read-only="read-only" 
                  
                  @click="openModel"
                  placeholder="请选择合同编号"
                  v-decorator="[
                    'contractNum',
                    { 
                      initialValue: receiptDetailResult.contractNum, 
                      rules: [{ required: true, message: '请选择合同编号', whitespace: true }] },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item label="客户名称"> 
                <a-input :disabled="isDisabled"  placeholder="请选择客户名称" v-decorator="['customerName',{initialValue: receiptDetailResult.saleCustomerName}]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item label="结算方式">
                <a-select :disabled="isDisabled" v-decorator="['moneyType', {initialValue: receiptDetailResult.moneyType, rules: [{ required: true, message: '请选择结算方式' }] }]">
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
                <a-input :disabled="isDisabled" placeholder="请输入帐号" v-decorator="['accountNum',{initialValue: receiptDetailResult.accountNum}]" />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item label="收款日期">
                <a-date-picker 
                  :disabled="isDisabled"
                  style="width: 100%"
                  v-decorator="[
                    'receiptTime',
                    { initialValue: receiptDetailResult.receiptTime ? moment(receiptDetailResult.receiptTime) : undefined, rules: [{ required: true, message: '请选择收款日期' }] },
                  ]"
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
          size="middle"
          bordered
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>

          <div slot="price" slot-scope="text">
            <span>{{ text | moneyFormatNumber }}</span>
          </div>
          <div slot="receivable" slot-scope="text">
            <span>{{ text | moneyFormatNumber }}</span>
          </div>
          
          <template slot="paidMoney" slot-scope="text, record">
            <template v-if="!isDisabled">
              <editable-cell :text="String(text)" @change="onCellChange(record.id, 'paidMoney', $event)" />
            </template>
            <template v-else>
              {{text | moneyFormatNumber}}
            </template>
          </template>

          <template slot="settlementDiscount" slot-scope="text, record">
            <template v-if="!isDisabled">
              <editable-cell :text="String(text)" @change="onCellChange(record.id, 'settlementDiscount', $event)" />
            </template>
            <template v-else>
              {{text | moneyFormatNumber}}
            </template>
          </template>

          <template slot="currency" slot-scope="text, record">
            <template v-if="!isDisabled">
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
            <template v-else>
              {{getCurrencyTxt(+text)}}
            </template>
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
        <a-row>
          <a-col :span="24" class="basic-vice-tit" justify="center">
            备注
            <a-form-item>
              <a-input :disabled="isDisabled" placeholder="请输入备注信息" v-model="remark" />
            </a-form-item>
          </a-col>
        </a-row>

        <div class="wdf-xyk">
          <div class="xyk-div" v-if="createdName">
            <span>创建人:</span>
            <span>{{ createdName }}</span>
          </div>
          <div class="xyk-div" v-if="createTime">
            <span>创建日期:</span>
            <span>{{ createTime }}</span>
          </div>

          <div v-if="isApprove" class="xyk-div">
            <span>审批人:</span>
            <span>{{ approveName }}</span>
          </div>
          <div v-if="isApprove" class="xyk-div">
            <span>审批日期:</span>
            <span>{{ approveTime }}</span>
          </div>
        </div>

        <receipt-contract ref="receiptContract" @custom-change="contractChange"></receipt-contract>
      </a-card>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </div>
  </a-spin>
</template>

<script>
import EditableCell from '@/components/Table/EditableCell'
import {
  getAccountBankList,
  goAdd,
  save,
  receiptDetail,
  updateReceipt,
  getSoftContractProductListById,
  receiptAudit
} from '@/api/receipt'
import { agencyContractDetail } from '@/api/agencyContract'
import ReceiptContract from './ReceiptAgencyContract'
import moment from 'moment'
import Approval from './Approval'
let uuid = () => Math.random().toString(32).slice(-10)
const data = []
export default {
  name: 'ReceiptAgencyForm',
  components: {
    ReceiptContract,
    EditableCell,
    Approval
  },
  data() {
    return {
      form: this.$form.createForm(this),
      addDisabled: false,
      memberLoading: false,
      moneyTypes: [],
      loading: false,
      visibleBoolean: false,
      dataSource: [], //软件合同产品列表
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
      dataSource: [],
      queryParam: [],
      spinning: false,
      params: {},
      receiptDetailResult:{},
      isApprove:false,
      createdName: '',
      createTime: '',
      approveTime: '',
      approveName: '',
      // 加载数据方法 必须为 Promise 对象
    }
  },
  mounted() {
    this.params = { ...(this.$route.params || {}) }
    this.contractType = this.params.contractType
    this.spinning = false
    this.init()
  },
  computed: {
    isView() {
      return this.params.action === 'view'
    },
    isAdd() {
      return this.params.action === 'add'
    },
    isEdit() {
      return this.params.action === 'edit'
    },
    isApproval() {
      return this.params.action === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
    column(){
      let baseColumn = [
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
          title: '保证金',
          dataIndex: 'price',
          width: '150px',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '已收金额(元)',
          dataIndex: 'receivable',
          scopedSlots: { customRender: 'receivable' },
          width: '150px',
        },
        {
          title: '本次实收金额(元)',
          dataIndex: 'paidMoney',
          scopedSlots: { customRender: 'paidMoney' },
          width: '150px',
        },
        {
          title: '结算折扣金额(元)',
          dataIndex: 'settlementDiscount',
          scopedSlots: { customRender: 'settlementDiscount' },
          width: '150px',
        },
        {
          title: '币种',
          dataIndex: 'currency',
          scopedSlots: { customRender: 'currency' },
          width: '100px',
        },
        {
          title: '币率',
          dataIndex: 'currencyRate',
          scopedSlots: { customRender: 'currencyRate' },
          width: '70px',
        },
        {
          title: '操作',
          width: '150px',
          scopedSlots: { customRender: 'operation' }
        }
      ]

      return this.isDisabled ? baseColumn.slice(0,-1) : baseColumn
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'ReceiptAgency') {
        this.$nextTick(() => this.init())
      }
    },
  },
  methods: {
    moment: moment,
    // 编辑表格
    onCellChange(key, dataIndex, value) {
      this.visibleBoolean = false
      const dataSource = [...this.dataSource]
      const target = dataSource.find((item) => item.id === key)
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
      that.isApprove = false
      if (that.isAdd) {
        goAdd().then((res) => that.form.setFieldsValue({ receiptCode: res.data }))
        return
      }
      //驳回重新提交 回显数据
      // 获取当前合同客户的开户行信息
      await getAccountBankList().then((res) => {
        that.moneyTypes = res.data
      })
      //加载单据详细信息
      let receiptDetailResult = await receiptDetail({ id: that.$route.params.id }).then((res) => {
        return res.data
      })
      that.contractId = receiptDetailResult.contractId
      that.customName = receiptDetailResult.saleCustomerName
      that.createdName = receiptDetailResult.createName
      that.createTime = receiptDetailResult.createTime

      if (receiptDetailResult.receiptStatus > 1) {
        that.isApprove = true
        that.approveName = receiptDetailResult.approveName
        that.approveTime = receiptDetailResult.approveTime
      }

      const record = {
        contractNum: receiptDetailResult.contractNum,
        customerName: receiptDetailResult.saleCustomerName,
        contractId: receiptDetailResult.contractId,
      }

      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })

      that.form.setFieldsValue({
        receiptCode: receiptDetailResult.receiptCode,
        contractNum: receiptDetailResult.contractNum,
        moneyType: getPayTypeID(),
        customerName: receiptDetailResult.saleCustomerName,
        accountNum: receiptDetailResult.payNumber,
        receiptTime: moment(receiptDetailResult.receiptTime.substring(0, 10)),
      })

      that.remark = receiptDetailResult.remark ? receiptDetailResult.remark : ''

      that.receiptDetailResult = {...receiptDetailResult,moneyType: getPayTypeID()}
      function getPayTypeID() {
        let target = that.moneyTypes.find(
          (type) =>
            type.unitName === receiptDetailResult.payTypeName && type.accountNum === receiptDetailResult.payNumber
        )
        return target ? target.id : -1
      }
      let productDataSource = receiptDetailResult.detailsList.map((p) => {
        let _arr = receiptDetailResult.products.split(';')
        ;(p.productName = _arr.length > 1 ? _arr[1] : receiptDetailResult.products),
          (p.price = (+receiptDetailResult.deposit || 0) )
        p.currencyNew = p.currency
        //p.receivable = p.accountPaid || 0
        return p
      })
      //产品信息内的产品列表
      that.dataSource = productDataSource
      that.visibleBoolean = true
    },
    add(res) {
      // const data = {"receiptCode"}
    },
    openModel() {
      this.$refs.receiptContract.query({ type: 0 })
    },
    contractChange(data) {
      console.log(data)
      let that = this
      //渲染数据
      const record = {
        contractNum: data.contractNum,
        customerName: data.customerName,
        contractId: data.id,
        contractType: 3,
      }
      that.contractId = data.contractId
      that.customName = data.customerName
      that.$nextTick(() => {
        that.form.setFieldsValue({ ...record })
      })
      getAccountBankList().then((res) => {
        that.moneyTypes = res.data
      })

      agencyContractDetail({ id: data.id }).then((res) => {
        let data = res.data
        let _arr = data.products.split(';')
        that.dataSource = [
          {
            key: uuid(),
            productName: _arr.length > 1 ? _arr[1] : res.products,
            price: +data.deposit * 10000, //代理合同详情接口 保证金的单位是 万元 所以这里 * 10000
            receivable: data.accountPaid || 0,
            paidMoney: 0,
            settlementDiscount: 0,
            currency: 1,
            currencyNew:1,
            currencyRate: '1',
          },
        ]
        that.visibleBoolean = true
      })
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
      that.spinning = true
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          //debugger
          if (!this.visibleBoolean) {
            this.$message.error('请先补全产品信息数据')
            that.spinning = false
            return
          }
          let dataSource = this.dataSource
          let money = Number(0)
          for (const key in dataSource) {
            //debugger
            // 需要数据转换
            dataSource[key].currency = dataSource[key].currencyNew
            money += Number(dataSource[key].paidMoney)
          }
          this.$set(values, 'receiptDetails', dataSource)
          this.$set(values, 'contractType', this.contractType)
          this.$set(values, 'paidMoney', money)
          this.$set(values, 'customName', this.customName)
          this.$set(values, 'remark', this.remark)
          console.log(values)
          if (that.isEdit) {
            values.id = that.$route.params.id
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
      //console.log(record)
      //debugger
      this.visibleBoolean = false
      if (record.paidMoney == undefined || record.paidMoney == 0) {
        this.$message.error('请输入本次收款金额')
        return
      }
      if (record.settlementDiscount == undefined) {
        this.$message.error('请输入结算折扣金额')
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
          amountMoney: Number(product.count * product.unitPrice * (1 + product.taxRate / 100)).toFixed(2),
        })
      }
      this.dataSourceContract = listProduct
      //this.dataSourceUnshipped = JSON.parse(JSON.stringify(listProduct))
      this.dataSourceUnshipped = listProduct.map((item) => Object.assign({}, item)).filter((item) => item.count > 0)
    },
    getCurrencyTxt(id){
      let target = this.currencys.find(item =>item.id === id)
      return target ? target.name : ''
    },


    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { id: that.params.id })
      that.spinning = true
      receiptAudit(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          
          that.$message.info(res.msg)
          that.$emit('close')
          this.goBackPricing()
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { type: 1, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        type: 2,
        rejected: opinion,
      })
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
.wdf-xyk {
    margin: 20px auto;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .xyk-div span:nth-child(2) {
    margin-left: 10px;
  }
</style>

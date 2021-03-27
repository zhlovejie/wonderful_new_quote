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
              <a-input v-decorator="[ 'contractId' ]" />
            </a-form-item>
            <a-form-item label="收款编号">
              <a-input
                disabled
                placeholder="请输入收款编号"
                v-decorator="[ 'receiptCode', {rules: [{ required: true, message: '请输入收款编号', whitespace: true}]} ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="合同编号">
              <a-input
                read-only="read-only"
                @click="openModel"
                placeholder="请选择合同编号"
                v-decorator="[ 'contractNum', {rules: [{ required: true, message: '请选择合同编号', whitespace: true}]} ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="客户名称">
              <a-input disabled placeholder="请选择客户名称" v-decorator="[ 'customerName' ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item label="结算方式">
              <a-select
                v-decorator="[ 'moneyType', {rules: [{ required: true, message: '请选择结算方式'}]} ]"
              >
                <a-select-option
                  @click="writeAccountNum(item)"
                  v-for="item in moneyTypes"
                  :key="item.id"
                  :value="item.id"
                >
                  {{item.unitName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="收款账号">
              <a-input disabled placeholder="请输入帐号" v-decorator="[ 'accountNum' ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="收款日期">
              <a-date-picker
                style="width: 100%"
                v-decorator="[
                  'receiptTime',
                  {initialValue:moment(), rules: [{ required: true, message: '请选择收款日期'}]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!--软件合同-->
        <a-table
          :columns="softColumn"
          :scroll="{ x: 2000 }"
          :dataSource="dataSourceSoftContract"
          :pagination="false"
          :loading="memberLoading"
          bordered
        >
          <div slot="order" slot-scope="text,record,index">
            <span>{{ index+1 }}</span>
          </div>

          <div slot="productTypeName" slot-scope="text">
            <span v-if="text==0">常规产品</span>
            <span v-if="text==1">非常规产品</span>
          </div>

          <template slot="paidMoney" slot-scope="text, record">
            <editable-cell :text="String(text)" @change="onCellChange(record.id, 'paidMoney', $event)" />
          </template>

          <template slot="settlementDiscount" slot-scope="text, record">
            <editable-cell
              :text="String(text)"
              @change="onCellChange(record.id, 'settlementDiscount', $event)"
            />
          </template>

          <template slot="currency" slot-scope="text, record">
            <a-select style="width: 100px" defaultValue="人民币">
              <a-select-option defaultValue="1"
                               @click="onCellChange(record.id, 'currency', $event)"
                               v-for="item in currencys"
                               :key="item.id"
                               :value="item.id"
              >{{ item.name }}</a-select-option>
            </a-select>
          </template>

          <template slot="currencyRate" slot-scope="text, record">
            <!-- <editable-cell disabled :text="String(text)" @change="onCellChange(record.id, 'currencyRate', $event)" /> -->
            <!-- <editable-cell disabled :text="1"  /> -->
            <span>{{text}}%</span>
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
              <a-input  placeholder="请输入备注信息" v-model = "remark" />
            </a-form-item>
          </a-col>
        </a-row>
      <receipt-contract ref="receiptContract" @custom-change="contractChange"></receipt-contract>
    </a-card>
  </div>
  </a-spin>
</template>

<script>
import EditableCell from '@/components/Table/EditableCell'
import { getAccountBankList, goAdd, save ,receiptDetail ,updateReceipt,getSoftContractProductListById} from '@/api/receipt'
import ReceiptContract from './ReceiptSoftwareContract'
import moment from 'moment'


const data = []
export default {
  name: 'ReceiptSoftwareAdd',
  components: {
    ReceiptContract,
    EditableCell
  },
  data () {
    return {
      form: this.$form.createForm(this),
      addDisabled: false,
      memberLoading: false,
      moneyTypes: [],
      loading: false,
      visibleBoolean: false,
      dataSourceSoftContract: [], //软件合同产品列表
      contractId:'',
      customName:'',
      remark:'',
      contractType:'',
      currencys: [
        {
          id: 1,
          name: '人民币'
        }
      ],
      softColumn: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          width: '200px',
        },
        {
          title: '金额',
          dataIndex: 'price',
          width: '150px',
        },
        {
          title: '已收金额(元)',
          dataIndex: 'receivable',
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
      ],
      dataSource: [],
      queryParam: [],
      spinning:false
      // 加载数据方法 必须为 Promise 对象
    }
  },
  mounted () {
    this.contractType=this.$route.params.contractType
    this.spinning = false
    this.init()
  },
  computed:{
    isEdit(){
      let params = this.$route.params
      return params && params.action === 'edit'
    },
  },
  watch:{
    $route (to, from) {
      if(to.name === 'ReceiptSoftwareAdd'){
        this.$nextTick(() => this.init())
      }
    }
  },
  methods: {
    moment:moment,
    // 编辑表格
    onCellChange (key, dataIndex, value) {
      // debugger
      this.visibleBoolean = false
      const dataSource = [...this.dataSourceSoftContract]
      const target = dataSource.find(item => item.id === key)
      if (dataIndex == 'currency') {
        target['currencyNew'] = value
        this.dataSourceSoftContract = dataSource
        return
      }
      if (target) {
        target[dataIndex] = value
        this.dataSourceSoftContract = dataSource
      }
    },
    async init () {
      let that = this
      console.log('that.isEdit:',that.isEdit)
      if(that.isEdit){ //驳回重新提交 回显数据
        // 获取当前合同客户的开户行信息
        await getAccountBankList().then(res => {that.moneyTypes = res.data})
        //加载单据详细信息
        let receiptDetailResult = await receiptDetail({id:that.$route.params.id})
        .then(res => {return res.data})
        that.contractId = receiptDetailResult.contractId
        that.customName = receiptDetailResult.saleCustomerName

        const record = {
          contractNum: receiptDetailResult.contractNum,
          customerName: receiptDetailResult.saleCustomerName,
          contractId: receiptDetailResult.contractId
        }

        this.$nextTick(() => {
          this.form.setFieldsValue({ ...record })
        })

        that.form.setFieldsValue({
          'receiptCode': receiptDetailResult.receiptCode,
          'contractNum': receiptDetailResult.contractNum,
          'moneyType': getPayTypeID(),
          'customerName': receiptDetailResult.saleCustomerName,
          'accountNum': receiptDetailResult.payNumber,
          'receiptTime': moment(receiptDetailResult.receiptTime.substring(0, 10))
        })

        that.remark = receiptDetailResult.remark ? receiptDetailResult.remark : ''
        function getPayTypeID(){
          let target = that.moneyTypes.find(type => type.unitName === receiptDetailResult.payTypeName && type.accountNum === receiptDetailResult.payNumber)
          return target ? target.id : -1
        }
        let productDataSource = receiptDetailResult.detailsList.map(p =>{
          p.price = p.countMoney
          p.currencyNew = p.currency
          return p
        })
        //产品信息内的产品列表
        that.dataSourceSoftContract = productDataSource
      }else{ //原新增处理方式
        goAdd().then(res => that.form.setFieldsValue({ receiptCode: res.data }))
      }
    },
    add (res) {
      // const data = {"receiptCode"}
    },
    openModel () {
      this.$refs.receiptContract.query({ type: 0 })
    },
    contractChange (data) {
        //渲染软件合同数据
        const record = {
          contractNum: data.contractNum,
          customerName: data.customerName,
          contractId: data.contractId,
          contractType:data.contractType,
        }
        this.contractId=data.contractId
        this.customName = data.customerName
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...record })
        })
        const listProduct = []
        //根据软件合同获取合同产品信息
        const paramter = { id: data.contractId }
        getSoftContractProductListById(paramter).then(res =>{
          console.log(res)
          for (const productKey in res.data) {
            const product = res.data[productKey]
            listProduct.push({
              id: product.id,
              productName: product.productName,
              price: Number(product.count * product.unitPrice).toFixed(2),
              receivable: product.receivable,
              currencyRate: 1,
              payTypeNew: -1,
              currencyNew: 1,
              paidMoney: 0,
              settlementDiscount: 0,
              currency: [
                {
                  id: 1,
                  name: '人民币'
                }
              ]
            })
          }

          this.dataSourceSoftContract = listProduct
        })
      // 获取当前合同客户的开户行信息
      getAccountBankList().then(res => {
        this.moneyTypes = res.data
      })
    },


    // 返回
    goBackPricing () {
      this.dataSource = []
      this.form.resetFields()
      // 点击返回，返回核价单列表页
      this.$router.push({ name: 'receiptList' })
      this.$destroy('ReceiptAdd')
    },
    writeAccountNum (record) {
      const data = { accountNum: record.accountNum }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    addClick () {

      let that = this
      that.spinning = true
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          if (!this.visibleBoolean) {
            this.$message.error('请先补全产品信息数据')
            that.spinning = false
            return
          }
          let dataSource=this.dataSourceSoftContract;
          let money = Number(0)
          for (const key in dataSource) {
            // debugger
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
          if(that.isEdit){
            values.id = that.$route.params.id
            updateReceipt(values).then(res => {
              if (res.code == 200) {
                that.spinning = false
                this.goBackPricing()
              }else{
                console.log(res)
                that.spinning = false
              }
            })
          }else{
            //由于 新增流程 不需要调用 receiptDetail 接口（该接口返回的数据包含productId 字段）
            //所以 提交的时候 需要加个该字段
            values.receiptDetails = values.receiptDetails.map(item =>{
              item.productId = item.id
              return item
            })
            save(values).then(res => {
              if (res.code == 200) {
                that.spinning = false
                this.goBackPricing()
              }else{
                console.log(res)
                that.spinning = false
              }
            })
          }
        }else{
          that.spinning = false
        }
      })

    },
    saveRow (record) {
      // console.log(record)
      // debugger
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
    setDataSource (data) {
      // 添加合同产品
      const listProduct = []
      for (const productKey in data.product) {
        const product = data.product[productKey]
        listProduct.push({
          'id': product.id,
          'targetName': product.targetName,
          'productType': product.productType,
          'productStandard': product.contractProductPo.productModel,
          'company': product.company,
          'count': product.count,
          'amountMoney': Number(product.count * product.unitPrice * (1 + product.taxRate / 100)).toFixed(2)
        })
      }
      this.dataSourceContract = listProduct
      //this.dataSourceUnshipped = JSON.parse(JSON.stringify(listProduct))
      this.dataSourceUnshipped = listProduct
        .map(item =>Object.assign({},item))
        .filter(item =>item.count > 0)
    },


  }
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

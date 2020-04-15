<template>
  <a-spin :spinning="spinning">
  <div class="after-add-wrapper">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="addClick" :loading="loading" icon="check">提交</a-button>
      <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
    </div>
    <a-card class="card  sales-task-wrapper" :bordered="false" id="pdfDom">
      <h2 :style="{textAlign:'center'}">产品调试任务单</h2>
      <a-form :form="form" class="form">
        <a-form-item hidden>
          <a-input v-decorator="[ 'customerId' ]"/>
          <a-input v-decorator="[ 'invoiceId' ]"/>
          <a-input v-decorator="[ 'contractId' ]"/>
        </a-form-item>
        <div class="ant-table">
          <table class="table ">
            <tr>
              <td>任务单编号</td>
              <td class="txt-left">
                <a-form-item>
                  <a-input
                  class="wdf-xyk"
                  read-only="read-only"
                  placeholder="请输入任务单编号"
                  v-decorator="[ 'aftersaleCode', {rules: [{ required: true, message: '请输入任务单编号', whitespace: true}]} ]"/>
                </a-form-item>
              </td>
              <td>合同编号</td>
              <td class="txt-left">
                <a-form-item>
                  <a-input
                  class="wdf-xyk"
                  style="border:1px solid #ddd;"
                  read-only="read-only"
                  @click="openModel"
                  placeholder="请选择合同编号"
                  v-decorator="[ 'contractNum' ,{rules: [{ required: true, message: '请选择合同编号', whitespace: true}]} ]"/>
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>客户名称</td>
              <td class="txt-left">
                <a-form-item>
                  <a-input class="wdf-xyk" read-only v-decorator="[ 'customerName']"/>
                </a-form-item>
              </td>
              <td>公司地址</td>
              <td class="txt-left">
                <a-form-item>
                  <a-input class="wdf-xyk" read-only v-decorator="[ 'customerAddress']"/>
                </a-form-item>
              </td>
            </tr>

            <tr>
              <td>销售联系人</td>
              <td class="txt-left">
                <a-form-item>
                  <a-input class="wdf-xyk" read-only v-decorator="[ 'trueName']"/>
                </a-form-item>
              </td>
              <td>联系电话</td>
              <td class="txt-left">
                <a-form-item>
                  <a-input class="wdf-xyk" read-only v-decorator="[ 'saleUserMobile']"/>
                </a-form-item>
              </td>
            </tr>

            <tr>
              <td>选择发货单</td>
              <td colspan="3" class="txt-left">
                <a-form-item>
                  <a-select mode="tags" :value="invoiceSelectedItems" :allowClear="true" placeholder="选择发货单" @change="onOptionClick" class="wdf-xyk">
                    <a-select-option :key="val.id"  v-for="val in invoiceList" :value="String(val.id)">{{ String(val.invoiceNum)}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>

            <tr>
              <td>需求说明</td>
              <td colspan="3" class="txt-left">
                <a-form-item>
                  <a-textarea placeholder="请输入调试单需求" :rows="2"  v-decorator="[ 'demandRemark']"/>
                </a-form-item>
              </td>
            </tr>
          </table>

          <div class="invoice-code-list-wrapper">
            <div class="invoice-code-item" v-for="(item,index) in invoicsDataSource" :key="index">
              <h3 >发货单 - {{item.invoiceNum}}</h3>
              <table class="table ">
                <tr>
                  <td>项目地址</td>
                  <td colspan="3" class="txt-left">
                    <a-input class="wdf-xyk" read-only="read-only" :value="item.address.replace(/;/g,' ')"/>
                  </td>
                </tr>
                <tr>
                  <td>发货时间</td>
                  <td class="txt-left">
                    <a-input class="wdf-xyk" read-only="read-only" :value="item.deliveryTime.slice(0,10)"/>
                  </td>
                  <td>联系人</td>
                  <td class="txt-left">
                    <a-input class="wdf-xyk" read-only="read-only" :value="item.consignee"/>
                  </td>
                </tr>
                <tr>
                  <td>联系电话</td>
                  <td class="txt-left">
                    <a-input class="wdf-xyk" read-only="read-only" :value="item.contactInformation"/>
                  </td>
                  <td>发货备注</td>
                  <td class="txt-left">
                    <a-input class="wdf-xyk" read-only="read-only" :value="item.remarks"/>
                  </td>
                </tr>
              </table>
              <a-table
                :columns="columns"
                :dataSource="item.products"
                :pagination="false"
                bordered
              >
                <div slot="productType" slot-scope="text">
                  <span v-if="text==0">常规产品</span>
                  <span v-if="text==1">非常规产品</span>
                </div>
                <div slot="invoiceCount" slot-scope="text, record">
                  <span>{{text}}{{companyFormat(record.company)}}</span>
                </div>


              </a-table>
            </div>
          </div>


          <div class="invoice-debugger-info-wrapper">
            <table class="table">
              <tr>
                <td>售后类型</td>
                <td class="txt-left">
                  <a-form-item>
                    <a-radio-group class="wdf-xyk" v-decorator="['aftersaleType',{initialValue: 2}]">
                      <a-radio :value="1">现场调试</a-radio>
                      <a-radio :value="2">远程调试</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
                <td>时间要求</td>
                <td class="txt-left">
                  <a-form-item>
                    <a-date-picker style="border:1px solid #ddd;" class="wdf-xyk" v-decorator="['sceneTime']"/>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td>是否使用我方平台</td>
                <td colspan="3" class="txt-left">{{usingPlatform === 0 ? '是' : '否'}}</td>
              </tr>
              <tr v-if="usingPlatform === 0">
                <td>平台账号</td>
                <td class="txt-left">
                  <a-form-item>
                    <a-input class="wdf-xyk" style="border:1px solid #ddd;" v-decorator="[ 'platformAccount' ,{rules: [{ required: true, message: '请输入平台账号', whitespace: true}]}]"/>
                  </a-form-item>
                </td>
                <td>密码</td>
                <td class="txt-left">
                  <a-form-item>
                    <a-input class="wdf-xyk" style="border:1px solid #ddd;" v-decorator="[ 'platformPassword',{rules: [{ required: true, message: '请输入平台密码', whitespace: true}]}]"/>
                  </a-form-item>
                </td>
              </tr>
            </table>
          </div>

        </div>
      </a-form>
       <receipt-sale-contract ref="receiptContract" @custom-change="contractChange"></receipt-sale-contract>
    </a-card>
  </div>
  </a-spin>
</template>

<script>

import { afterSave, goAdd, listInvoiceByContractId, invoiceDetailById } from '@/api/after'
import { getContractOne } from '@/api/receipt'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import ReceiptSaleContract from '../receipt/ReceiptSaleContract'
import ARow from 'ant-design-vue/es/grid/Row'
import moment from 'moment'
import {companyFormat} from '@/utils/util'

export default {
  name: 'AfterAdd',
  components: {
    ARow,
    ReceiptSaleContract,
    AFormItem
  },
  data () {
    return {
      form: this.$form.createForm(this),
      memberLoading: false,
      moneyTypes: [],
      loading: false,
      visibleBoolean: false,
      queryBoolean: false,
      usingPlatform: 0,
      invoiceList: [],
      sceneTimeData: moment(),
      invoicBoolean: false,
      columns: [
        {
          title: '产品类别',
          dataIndex: 'productType',
          scopedSlots: { customRender: 'productType' }
        }, {
          title: '产品代码',
          dataIndex: 'productModel'
        },{
          title: '产品名称',
          dataIndex: 'productName'
        },{
          title: '规格型号',
          dataIndex: 'productStandard'
        }, {
          title: '发货数量',
          dataIndex: 'invoiceCount',
          scopedSlots: { customRender: 'invoiceCount' }
        }
      ],
      dataSource: [],
      queryParam: [],
      // 加载数据方法 必须为 Promise 对象
      sourceAddress:'', //缓存原项目地址 为 xxx;xxx;xxx 格式化为 xxxxxxxxx 来显示用
      invoicsDataSource:[], //多个发货单
      invoiceSelectedItems:[], //选中的发货单列表
      spinning:false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      goAdd().then(res => {
        const data = { 'aftersaleCode': res.data }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...data })
        })
      })
    },
    openModel () {
      const data = { 'type': 1 }
      this.$refs.receiptContract.query(data)
    },
    contractChange (data) {
      const paramter = { 'id': data.contractId }

      this.invoiceList = []
      this.invoiceSelectedItems = []
      this.invoicsDataSource = []
      listInvoiceByContractId(paramter).then((res) => {
        this.invoiceList = res.data
      })
      getContractOne(paramter).then((res) => {
        this.usingPlatform = res.data.usingPlatform
        const record = {
          'contractNum': res.data.contractNum,
          'customerName': res.data.customerName,
          'customerId': res.data.saleCustomer.id,
          'trueName': res.data.saleUser.trueName,
          'saleUserMobile': res.data.saleUser.mobile,
          'contractId': res.data.id,
          'totalAmount': res.data.totalAmount,
          'refundMoney': res.data.returnedMoney,
          'saleContract': res.data.contractId,
          'platformAccount': res.data.platformAccount,
          'platformPassword': res.data.platformPassword,
          'paperDetail': 1,
          'customerAddress': res.data.saleCustomer.address
        }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...record })
        })
      })
    },
    // 返回
    goBackPricing () {
      // 点击返回，返回列表页
      this.$router.push({ name: 'afterList' })
      this.$destroy('afterAdd')
    },
    writeAccountNum (record) {
      const data = { 'accountNum': record.bankNum }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    addClick () {
      let that = this
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!this.invoicBoolean) {
          this.$message.error('请选择发货单')
          return
        }
        if (!err) {
          if (values.sceneTime === undefined) {
            this.$message.error('请选择时间要求')
            return
          }
          if (values.aftersaleType === undefined) {
            this.$message.error('请选择售后类型')
            return
          }
          this.$set(values, 'sceneTime', values.sceneTime.format('YYYY-MM-DD'))
          this.$set(values, 'deliveryTime', '')
          this.$set(values, 'address', that.sourceAddress)
          this.$set(values,'invoiceId',that.invoiceSelectedItems.join(','))
          console.log(values)

          this.spinning = true
          afterSave(values).then((res) => {
            this.spinning = false
            if (res.code === 200) {
              this.goBackPricing()
            }
          }).catch(err =>{
            this.spinning = false
          })
        }
      })
    },
    openModel () {
      this.$refs.receiptContract.query()
    },
    onOptionClick (e) {
      let arrKeys = [...e]
      this.invoiceSelectedItems = arrKeys
      const parameter = { 'id': arrKeys.join(',') }
      //const invoiceList = [...this.invoiceList]
      //const target = invoiceList.find(item => item.id === e.key)
      // let arrTargets = invoiceList
      //   .filter(item =>arrKeys.includes(String(item.id)))
      //   .map(item =>{
      //     return {
      //       'address': item.address.replace(/;/g,' '),
      //       'consignee': item.consignee,
      //       'contactInformation': item.contactInformation,
      //       'deliveryTime': item.deliveryTime,
      //       'invoiceId': item.id,
      //       productDataSource:[]
      //     }
      //   })




      // return
      // //this.sourceAddress = target.address
      // const data = {
      //   'address': target.address.replace(/;/g,' '),
      //   'consignee': target.consignee,
      //   'contactInformation': target.contactInformation,
      //   'deliveryTime': target.deliveryTime,
      //   'invoiceId': e.key
      // }
      // this.$nextTick(() => {
      //   this.form.setFieldsValue({ ...data })
      // })

      if(arrKeys.length > 0){
        invoiceDetailById(parameter).then((res) => this.invoicsDataSource = res.data)
      }else{
        this.invoicsDataSource = []
      }


      this.invoicBoolean = arrKeys.length > 0 ? true : false
    },
    companyFormat:companyFormat
  }
}
</script>

<style scoped>
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

  .wdf-row {
    border: 1px solid #ddd;
  }

  .col-border {
    border: 1px solid #ddd;
    padding: 10px 0;
    border-bottom: none;
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

  .wdf-xyk {
    width: 80%;
  }

  .last-border{
    border-bottom: 1px solid #ddd;
  }

  .hide{display: none;}

  .table{width: 100%;border-collapse: collapse;}
  .table th{background-color: #fafafa;}
  .table th,.table td{
    border: 1px solid #ddd;
    padding: 5px;
    text-align: center;
  }

  .table .txt-left{
    text-align: left;
  }
  .table .txt-left input{
    border: none;
  }

  .invoice-code-list-wrapper {
    margin-top: 10px;
  }
  .invoice-code-list-wrapper .invoice-code-item{
    margin-bottom: 10px;
  }
  .invoice-code-list-wrapper h3{
    background-color: #f0f0f0;
    margin: 0;
    padding: 10px 0 10px 20px;
  }
</style>




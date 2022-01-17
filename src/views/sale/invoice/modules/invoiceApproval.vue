<template>
<a-spin :spinning="spinning">
  <div class="content">
    <div class="content-wrap">
      <div class="top-ation clearfix" style="text-align: right">
        <div class="table-operator fl-r" style="margin-top: 10px">
<!--          <a-button class="fl-r" type="primary" @click="getPDF()" >导出成PDF</a-button>-->
          <a-button class="fl-r" type="primary" v-if="show" @click="invoiceApproval(2)" :loading="loading" icon="check">确认</a-button>
          <a-button class="fl-r" type="primary" v-if="show" @click="invoiceApproval(3)" :loading="loading" icon="close">不通过</a-button>
          <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
        </div>
      </div>
       <div class="form-container invoice-approval-wrapper-print" id="pdfDom">
      <a-form :form="form">
        <a-form-item hidden>
          <a-input v-decorator="[ 'contractId' ]"/>
        </a-form-item>
      <table class="custom-table custom-table-border">
        <caption>发货单</caption>
        <tbody>
          <tr>
            <td class="print-w150"><span>发货单编号</span></td>
            <td colspan="3">
              <a-form-item>
                <a-input read-only="read-only" style="border: none;" v-decorator="['invoiceNum', {}]" />
              </a-form-item>
            </td>
            <td class="print-w150"><span>合同/赠送单(编号)</span></td>
            <td colspan="3">
              <a-form-item>
              <a-input disabled style="border: none;" v-decorator="['contractNum', {}]" @click="openModel"/>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td class="print-w150"><span>客户名称</span></td>
            <td  colspan="3">
              <a-form-item>
              <a-input read-only="read-only" style="border: none;" v-decorator="['customerName', {}]"/>
              </a-form-item>
            </td>
            <td class="print-w150"><span>运费结算方式</span></td>
            <td colspan="3">
              <a-form-item>
              <a-select disabled placeholder="运费结算方式" v-decorator="['settlementMethod', {}]">
                <a-select-option :value="1">代付</a-select-option>
                <a-select-option :value="2">包邮</a-select-option>
                <a-select-option :value="3">到付</a-select-option>
              </a-select>
              </a-form-item>
            </td>
          </tr>

          <tr v-show="needFreightCharge">
            <td class="print-w150"><span>运费</span></td>
            <td colspan="7">
              <a-form-item>
                <a-input-number disabled style="width:100%;"  :min="0" :step="0.1" :precision="2" placeholder="运费" v-decorator="['freightCharge', {rules: [{required: true, message: '请输入运费!'}]}]" />
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td class="print-w150"><span>收货地址</span></td>
            <td colspan="7">
              <a-form-item>
              <a-input read-only="read-only" placeholder="请输入详细地址" v-decorator="['address',{}]"/>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="print-w150"><span>发货方式</span></td>
            <td colspan="3">
              <a-form-item>
              <a-select disabled placeholder="发货方式" v-decorator="['delivery', {}]">
                <a-select-option :value="1">客户货站自提</a-select-option>
                <a-select-option :value="2">送货上门</a-select-option>
                <a-select-option :value="3">万德福自提</a-select-option>
              </a-select>
              </a-form-item>
            </td>
            <td class="print-w150"><span>收货人</span></td>
            <td colspan="3">
              <a-form-item>
              <a-input read-only="read-only" style="border: none;" v-decorator="['consignee', {}]"/>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td class="print-w150"><span>联系方式</span></td>
            <td colspan="3">
              <a-form-item>
              <a-input read-only="read-only" style="border: none;" v-decorator="['contactInformation', {}]"/>
              </a-form-item>
            </td>
            <td colspan="4"></td>
          </tr>
        </tbody>
      </table>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        rowKey="id"
        :loading="memberLoading"
        bordered
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <div slot="order" slot-scope="text,record,index">
          <span>{{ index+1 }}</span>
        </div>

        <div slot="productType" slot-scope="text">
          <span v-if="text==0">常规产品</span>
          <span v-if="text==1">非常规产品</span>
        </div>
        <div slot="company" slot-scope="text">
          <span v-if="text==0">套</span>
          <span v-if="text==1">台</span>
          <span v-if="text==2">个</span>
        </div>
      </a-table>
      <table class="custom-table custom-table-border">
        <tbody>
          <tr
          <tr>
            <td class="print-w150"><span>备注</span></td>
            <td colspan="7">
              <a-form-item>
              <a-input read-only="read-only" style="border: none;" v-decorator="['remarks', {}]"/>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td class="print-w150"><span>发货时间</span></td>
            <td colspan="7">
              <a-form-item>
              <a-input read-only="read-only" style="border: none;" v-decorator="['deliveryTime', {}]"/>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td class="print-w150"><span>创建人</span></td>
            <td >
              <a-form-item>
              <a-input read-only="read-only" style="border: none;" v-decorator="['createdName', {}]"/>
              </a-form-item>
            </td>
            <td class="print-w150"><span>创建日期</span></td>
            <td >
              <a-form-item>
              <a-input read-only="read-only" style="border: none;" v-decorator="['createdTime', {}]"/>
              </a-form-item>
            </td>

          </tr>
          <tr>
            <td class="print-w150"><span>审批人</span></td>
            <td >
              <a-form-item>
              <a-input read-only="read-only" style="border: none;" v-decorator="['approveName', {}]"/>
              </a-form-item>
            </td>
            <td class="print-w150"><span>审批日期</span></td>
            <td >
              <a-form-item>
              <a-input read-only="read-only" style="border: none;" v-decorator="['approveTime', {}]"/>
              </a-form-item>
            </td>
          </tr>

        </tbody>
      </table>
      </a-form>
      </div>

      <!-- <div class="form-container invoice-approval-wrapper-print" id="pdfDom">
        <table class="custom-table custom-table-border">
          <tr>
            <td class="print-w150"><span>测试</span></td>
            <td></td>
            <td class="print-w150"><span>测试测试测试</span></td>
            <td></td>

          </tr>
        </table>
      </div> -->

    </div>
    <a-modal
      title="不通过"
      @ok="handleOk"
      @cancel="handleCancelTwo"
      :confirmLoading="confirmLoadingTwo"
      :maskClosable="false"
      v-model="visibleTwo">
      <a-spin :spinning="confirmLoadingTwo">
        <a-form :form="form" class="form">
          <a-col>
            <a-form-item
              label="驳回原因">
              <a-input
                placeholder="驳回原因"
                v-decorator="[ 'rejected', {rules: [{ message: '请输入驳回原因', whitespace: true}]} ]"/>
              <a-alert v-if="hidden" type="error" message="请输入驳回原因" banner/>
            </a-form-item>
          </a-col>
        </a-form>
      </a-spin>
    </a-modal>
    <!--获取交款单位弹出层-->
    <!--    <invoice-sale-contract ref="invoiceContract" @custom-change="contractChange"></invoice-sale-contract>-->
  </div>
</a-spin>
</template>

<script>
import { getInvoiceNum, getContractOne, auditInvoice, getProductById } from '@api/invoice'
import moment from 'moment'
import { getAreaByParent } from '@/api/common'
import util from '@/components/_util/util'
const data = []
export default {
  name: 'InvoiceApproval',
  components: {
    moment
  },
  props: {},
  data () {
    return {
      form: this.$form.createForm(this),
      memberLoading: false,
      loading: false,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      confirmLoadingTwo: false,
      visibleTwo: false,
      hidden: false,
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
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '标的名称',
          dataIndex: 'targetName'
        },
        {
          title: '产品类别',
          dataIndex: 'productType',
          scopedSlots: { customRender: 'productType' }
        },
        {
          title: '产品代码',
          dataIndex: 'productModel',
          scopedSlots: { customRender: 'productModel' }
        },
        {
          title: '名称',
          dataIndex: 'productName',
          scopedSlots: { customRender: 'productName' }
        },
        {
          title: '规格型号',
          dataIndex: 'productStandard',
          scopedSlots: { customRender: 'productStandard' }
        },
        {
          title: '单位',
          dataIndex: 'company',
          scopedSlots: { customRender: 'company' }
        }, {
          title: '数量',
          dataIndex: 'invoiceCount',
          scopedSlots: { customRender: 'invoiceCount' }
        }
      ],
      settlementMethod:-1,
      spinning:false
    }
  },
  mounted () {
    this.record = this.$route.params.record
    var type = this.$route.params.type
    if (type == 'See') {
      this.edit()
      this.show = false
    }
    if (type == 'Approval') {
      this.edit()
    }
  },
  computed:{
    needFreightCharge:function(){
      return this.settlementMethod === 1 || this.settlementMethod === 2
    }
  },

  methods: {
    getCity (type, pId) {
      getAreaByParent({ pId: pId }).then(res => {
        if (type === 1) {
          this.citys = res.data
          console.log('this.citys', this.citys)
        } else if (type === 2) {
          this.areas = res.data
          console.log('this.areas', this.areas)
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了')
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log('selectedRowKeys', this.selectedRowKeys)
      console.log('selectedRows', this.selectedRows)
    },
    edit () {
      console.log(this.record)
      this.$nextTick(() => {
        this.form.setFieldsValue({ invoiceNum: this.record.invoiceNum })
        this.form.setFieldsValue({ contractNum: this.record.contractNum })
        this.form.setFieldsValue({ customerName: this.record.customerName })
        this.form.setFieldsValue({ settlementMethod: this.record.settlementMethod })
        this.settlementMethod = this.record.settlementMethod
        try{
          let formatAddress = this.record.address.replace(/;/g,'')
          this.form.setFieldsValue({ address: formatAddress})
        }catch(err){
          this.form.setFieldsValue({ address: this.record.address})
        }

        this.form.setFieldsValue({ delivery: this.record.delivery })
        this.form.setFieldsValue({ consignee: this.record.consignee })
        this.form.setFieldsValue({ contactInformation: this.record.contactInformation })
        this.form.setFieldsValue({ remarks: this.record.remarks })
        this.form.setFieldsValue({ deliveryTime: this.record.deliveryTime })
        this.form.setFieldsValue({ createdName: this.record.createdName })
        this.form.setFieldsValue({ createdTime: this.record.createdTime })
        this.form.setFieldsValue({ approveName: this.record.approveName })
        this.form.setFieldsValue({ approveTime: this.record.approveTime })
        this.form.setFieldsValue({ freightCharge: this.record.freightCharge })
      }
      )
      this.getProducts()
    },
    getProducts () {
      // 根据发货单id获取发货单产品
      const parameter = { 'invoiceId': this.record.id }
      getProductById(parameter).then((res) => {
        const listProduct = []
        console.log('res.data', res.data)
        for (const productKey in res.data) {
          const product = res.data[productKey]
          listProduct.push({
            'id': product.id,
            'targetName': product.products.targetName,
            'productType': product.products.productType,
            'productModel': product.products.contractProductPo.productModel,
            'productName': product.products.contractProductPo.productName,
            'productStandard': product.products.contractProductPo.productStandard,
            'company': product.products.company,
            'invoiceCount': product.invoiceCount
          })
        }
        this.dataSource = listProduct
        console.log('this.dataSource', this.dataSource)
      })
    },

    areaByParent () {
      getAreaByParent({ pId: 100000 }).then(res => { // 所有省
        this.provinces = res.data
      }).catch(function (err) {
        console.log(err)
      })
    },
    // 获取收据单编号
    invoiceNum () {
      getInvoiceNum().then((res) => {
        console.log('获取发货单编号的结果', res)
        this.form.setFieldsValue({ invoiceNum: res.data })
      }).catch(error => {
        console.error(error)
      })
    },
    // 弹出合同列表弹出层
    openModel () {
      console.log('openModel click')
      this.$refs.invoiceContract.query()
    },
    invoiceApproval (type) {
      let that = this
      if (type == 3) {
        this.hidden = false
        this.visibleTwo = true
      } else {
        that.spinning = true
        this.record.invoiceStatus = type
        auditInvoice(this.record).then((res) => {
          that.spinning = false
          if (res.code == 200) {
            this.goBackPricing()
          }
        }).catch(err =>that.spinning = false)
      }
    },
    // 返回
    goBackPricing () {
      // 点击返回，返回发货单，并销毁module
      const __from__ = this.$route.params.__from__
      this.$router.push({ name: __from__ })
      this.$destroy('invoiceModule')
    },
    handleOk (e) {
      const _this = this
      this.form.validateFields((err, values) => {
        _this.record.invoiceStatus = 3
        _this.record.rejected = values.rejected
        console.log(_this.record)

        _this.confirmLoadingTwo = true
        auditInvoice(_this.record).then((res) => {
          _this.confirmLoadingTwo = false
          if (res.code == 200) {
            this.goBackPricing()
          }
        }).catch(err =>_this.confirmLoadingTwo = false)
      })
    },
    handleCancelTwo (e) {
    },
    getPDF () {
      // 特殊处理打印
      let eles = document.querySelectorAll('input,textarea')
      eles && eles.forEach(ele =>{
        if(ele.nodeType !== 1) return
        if(ele.nodeName.toUpperCase() === 'INPUT'){
          if(ele.type === 'radio' || ele.type === 'checkbox'){
            ele.checked && ele.setAttribute('checked',true)
          }else{
            ele.setAttribute('value',ele.value)
          }
        }
        if(ele.nodeName.toUpperCase() === 'TEXTAREA'){
          if(ele.value.trim().length > 0){
            ele.setAttribute('value',ele.value)
          }
        }
      })
      util.handleWindowPrint('#pdfDom', '发货单')
    },

    settlementMethodChange(e){
      console.log(e)
      this.settlementMethod = parseInt(e)
    }
  }

}
</script>

<style scoped>
  .custom-table >>> td{
    padding: 10px 20px;
  }
  .custom-table >>>.ant-form-item{
    margin-bottom: 0;
  }
</style>

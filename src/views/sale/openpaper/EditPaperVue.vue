<template>
  <a-spin :spinning="spinning">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
      <a-button  class="fl-r" type="primary" @click="editPaper" icon="check-circle">重新提交</a-button>
    </div>
    <a-card class="card" :bordered="false">

      <a-form :form="form" class="form">
        <a-form-item hidden>
          <a-input v-decorator="[ 'saleContract' ]"/>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票编号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                placeholder="请输入开票编号"
                v-decorator="[ 'paperCode']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">合同编号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                placeholder="请选择合同编号"
                v-decorator="[ 'contractNum' ]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">客户名称</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                v-decorator="[ 'customerName']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票单位名称</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <!-- <span>江苏万德福公共设施科技有限公司</span> -->
              <a-form-item>
                <a-input class="wdf-xyk" v-decorator="[ 'openUnit']"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">发票类型</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                class="wdf-xyk"
                v-decorator="['paperType', {}]">
                <a-radio :value="2">增票</a-radio>
                <a-radio :value="1">普票</a-radio>
              </a-radio-group>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票性质</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                class="wdf-xyk"


                v-decorator="['paperQuality', {}]">
                <a-radio :value="1">常规开票</a-radio>
                <a-radio :value="2">特殊开票</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">开户行及账号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                v-decorator="[ 'bankNoAccount']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">纳税人识别号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                v-decorator="[ 'taxPayerNo' ]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">客户地址</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                v-decorator="[ 'customerAddress']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">联系电话</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                v-decorator="[ 'customerTel']"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :rowKey="record => record.productId"
          :loading="memberLoading"
          bordered
        >
          <div slot="company" slot-scope="text, record">
            <span v-if="text==0">套</span>
            <span v-if="text==1">台</span>
            <span v-if="text==2">个</span>
            <span v-if="text==3">块</span>
            <span v-if="text==4">条</span>
            <span v-if="text==5">根</span>
            <span v-if="text==6">张</span>
            <span v-if="text==7">卷</span>
          </div>

          <div slot="count" slot-scope="text,record,index">
            <!-- <input  @change="quantityChange(record,$event)"  v-model="record.count"></input> -->
            <a-input
                  type="number"
                  placeholder="请输入数量"
                  @change="quantityChange(record,$event)"
                  :value="record.count"
                  />
          </div>

          <div slot="unitPrice" slot-scope="text,record,index">
            <!-- <input @change="unitPriceChange(record,$event)" v-model="record.unitPrice"></input> -->
            <a-input
                  type="number"
                  placeholder="请输入价格"
                  @change="unitPriceChange(record,$event)"
                  :value="record.unitPrice"
                  />
          </div>
        </a-table>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">实际发货日期</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
                <a-date-picker
                  class="wdf-xyk"
                  v-decorator="[
                    'deliveryTime',
                    {rules: [{ required: true, message: '请选择实际发货日期'}]}
                  ]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                v-decorator="[ 'paperMoney' ]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">回款情况</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                class="wdf-xyk"


                v-decorator="['paperDetail', {}]">
                <a-radio :value="1">部分付款</a-radio>
                <a-radio :value="2">已付全款</a-radio>
                <a-radio :value="3">未付款</a-radio>
              </a-radio-group>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">总金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                v-decorator="[ 'totalAmount']"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">已回款金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                v-decorator="[ 'refundMoney']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">欠款金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <!--fix 0543 欠款金额不能大于总金额 -->
                <a-input-number
                  :min="0"
                  :max="maxArrearsMoney"
                  @change="arrearsMoneyChange"
                  class="wdf-xyk"
                  placeholder="请输入欠款金额"
                  v-decorator="[ 'arrearsMoney', {rules: [{ required: true, message: '请输入欠款金额'}]} ]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-row type="flex" style="border-bottom: 1px solid #ddd;" v-if="freightType === 0">
            <a-col class="col-border" :span="3" justify="center" align="middle">运费(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input-number style="width:50%;"  :min="0" :step="0.1" :precision="2" placeholder="运费" @change="freightChargeChange" v-decorator="['freightCharge']" />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle"></a-col>
          </a-row>
        <a-row type="flex" style="border-bottom: 1px solid #ddd;" >
            <a-col class="col-border" :span="3" justify="center" align="middle">备注</a-col>
            <a-col class="col-border" :span="21" justify="center" align="middle">
              <a-form-item>
              <a-textarea 
                placeholder="备注" 
                :rows="3" 
                v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]"
              />
              </a-form-item>
            </a-col>
          </a-row>
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">创建人</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                placeholder="创建人"
                v-decorator="[ 'createdName']"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">创建日期</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                placeholder="创建日期"
                v-decorator="[ 'createdTime' ]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="approveVueBoolean">
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">审批人</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                v-decorator="[ 'approveName' ]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">审批日期</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-input
                class="wdf-xyk"

                v-decorator="[ 'approveTime' ]"/>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
      <receipt-sale-contract ref="receiptContract" @custom-change="contractChange"></receipt-sale-contract>
      <a-modal
        title="不通过"
        @ok="handleOk"
        @cancel="handleCancelTwo"
        :confirmLoading="confirmLoadingTwo"
        :maskClosable="false"
        v-model="visibleTwo">
        <span :spinning="confirmLoadingTwo">
          <a-form :form="form2" class="form">
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
        </span>
      </a-modal>
    </a-card>
  </a-spin>
</template>

<script>

import { getContractOne, openPaperAudit, openPaperDetail, openPaperSave, getPaperProduct ,updatePaper} from '@/api/openpaper'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import ReceiptSaleContract from '../receipt/ReceiptSaleContract'
import ARow from 'ant-design-vue/es/grid/Row'
import moment from 'moment'

const data = []
export default {
  name: 'EditPaperVue',
  components: {
    ARow,
    ReceiptSaleContract,
    AFormItem
  },
  data () {
    return {
      form: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      memberLoading: false,
      moneyTypes: [],
      loading: false,
      visibleBoolean: false,
      queryBoolean: true,
      paperDetail: 0,
      paperQuality: 0,
      confirmLoadingTwo: false,
      auditBoolean: false,
      paperType: 0,
      visibleTwo: false,
      approveVueBoolean: false,
      beforeValueBoolean: false,
      hidden: true,
      id: 0,
      columns: [
        {
          title: '产品名称',
          dataIndex: 'productName'
        },
        {
          title: '产品代码',
          dataIndex: 'productTypeName'
        }, {
          title: '单位',
          dataIndex: 'company',
          scopedSlots: { customRender: 'company' }
        }, {
          title: '数量',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' }
        }, {
          title: '含税单价',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' }
        }, {
          title: '含税金额(元)',
          dataIndex: 'receivable'
        }
      ],
      dataSource: [],
      queryParam: [],
      // 加载数据方法 必须为 Promise 对象

      saleContract:null, //合同ID
      maxArrearsMoney:0, //最大可输入欠款金额
      freightType:1,
      totalAmount:0, //总金额 包含运费
      totalAmountWidtoutFreight:0, //总金额 不包含运费
      spinning:false
    }
  },
  watch: {
    $route (to, from) {
      if(to.name === 'editPaperVue'){
        this.init()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let that = this
      console.log('init this.$route.params ' + JSON.stringify(this.$route.params))
      const params = { 'id': this.$route.params.id }
      this.auditBoolean = this.$route.params.auditBoolean
      this.id = this.$route.params.id
      openPaperDetail(params).then((res) => {

        that.saleContract = res.data.saleContractDetail.id
        that.freightType = res.data.saleContractDetail.freightType
        //that.freightCharge = res.data.freightCharge || res.data.saleContractDetail.freightCharge
        that.freightCharge = res.data.saleContractDetail.freightMoneyWithRate
        that.totalAmount = res.data.saleContractDetail.totalAmount
        that.totalAmountWidtoutFreight = that.totalAmount - that.freightCharge

        const record = {
          'remark':res.data.remark,
          'paperCode': res.data.paperCode,
          'contractNum': res.data.saleContractDetail.contractNum,
          'customerName': res.data.saleContractDetail.customerName,
          'contractId': res.data.saleContractDetail.id,
          'totalAmount': res.data.saleContractDetail.totalAmount,
          'taxPayerNo': res.data.taxPayerNo,
          'bankNoAccount': res.data.bankNoAccount,
          'customerTel': res.data.customerTel,
          'customerAddress': res.data.customerAddress,
          'refundMoney': res.data.saleContractDetail.returnedMoney,
          //'paperMoney': res.data.paperMoney + (that.freightType === 0 ? Number(that.freightCharge) * 1.13 : 0),
          'paperMoney': res.data.paperMoney,
          'arrearsMoney': res.data.arrearsMoney,
          'deliveryTime': moment(res.data.deliveryTime),
          'paperDetail': res.data.paperDetail,
          'paperQuality': res.data.paperQuality,
          'paperType': res.data.paperType,
          'approveName': res.data.approveName,
          'createdTime': res.data.createdTime,
          'createdName': res.data.createdName,
          'approveTime': res.data.approveTime,
          'freightCharge':res.data.saleContractDetail.freightMoneyWithRate,
          openUnit:res.data.openUnit
        }
        if (res.data.approveName != undefined && res.data.approveTime != undefined) {
          that.approveVueBoolean = true
        }

        that.$nextTick(() => {
          that.form.setFieldsValue(record)
          that.$nextTick(() =>{
            that.form.setFieldsValue(record)
          })
        })

        
        that.maxArrearsMoney = parseFloat(record.totalAmount) - parseFloat(record.refundMoney)
        console.log('getContractOne : ' + JSON.stringify(res))
      })

      /**
       * 查询开票单录入的产品信息列表
       * @type {{paperId: *}}
       */
      const paperIdParam = { 'paperId': this.$route.params.id }
      getPaperProduct(paperIdParam).then((res) => {
        let _key = 0
        const listProduct = []
        for (const productKey in res.data) {
          console.log('productKey ...' + JSON.stringify(productKey))
          const product = res.data[productKey]
          listProduct.push({
            key:++_key,
            'id': product.id,
            'productName':product.productName,
            'productTypeName': product.productType,
            'receivable': product.count * product.unitPrice ,
            'company': product.company,
            'count': product.count,
            'unitPrice': product.unitPrice
          })
        }
        console.log('listProduct :' + JSON.stringify(listProduct))
        this.dataSource = listProduct
      });
    },
    openModel () {
      console.log('openModel click')
      const data = { 'type': 1 }
      this.$refs.receiptContract.query(data)
    },
    contractChange (data) {
      console.log('JSON 页面传值事件:' + JSON.stringify(data))
      const paramter = { 'id': data.contractId }
      getContractOne(paramter).then((res) => {

      })
    },
    // 返回
    goBackPricing () {
      // 点击返回，返回列表页
      this.$router.push({ name: 'openPaperList' })
      this.$destroy('openPaperVue')
    },
    writeAccountNum (record) {
      const data = { 'accountNum': record.bankNum }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    addClick () {
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log('values :' + JSON.stringify(values))
          console.log('json values :', JSON.stringify(values))
          this.$set(values, 'contractType', 1) // 1销售合同，2软件合同
          this.$set(values, 'deliveryTime', values.deliveryTime.format('YYYY-MM-DD'))

          openPaperSave(values).then((res) => {
            if (res.code == 200) {
              this.goBackPricing()
            }
          })
        }
      })
    },
    openModel () {
      console.log('openModel click')
      this.$refs.receiptContract.query()
    },
    receiptAudit (type) {
      console.log(type)
      if (type == 2) {
        this.hidden = false
        this.visibleTwo = true
        this.beforeValueBoolean = true
        return
      }
      const paramer = {
        'id': this.id,
        'paperStatue': type
      }
      openPaperAudit(paramer).then((res) => {
        if (res.code == 200) {
          this.goBackPricing()
        }
      })
    },
    handleCancelTwo (e) {
      this.form2.resetFields()
    },
    handleOk () {
      this.form2.validateFields((err, values) => {
        console.log(values)
        if (this.beforeValueBoolean) {
          if (values.rejected == undefined || values.rejected == null || values.rejected == '') {
            this.hidden = true
            return
          }
        }
        console.log(JSON.stringify(this.data))
        const paramer = {
          'id': this.id,
          'paperStatue': 3,
          'rejected': values.rejected
        }
        openPaperAudit(paramer).then((res) => {
          if (res.code == 200) {
            this.goBackPricing()
          }
        })
      })
    },
        // 开票单产品数量变化
    quantityChange(record, e) {
      // const v = e.currentTarget.value

      // const _index = this.dataSource.findIndex(item => item.key === record.key)
      // if (_index >= 0) {
      //   this.dataSource[_index]['count'] = v.trim().length === 0 ? 0 : parseInt(v.trim())
      //   record.receivable = e.currentTarget.value * record.unitPrice;
      // }
      // console.log("countChange:" + JSON.stringify(this.dataSource))
      // this.calMoney();

      let v = e.currentTarget.value.trim()
      let dataSource = [...this.dataSource]
      let target = dataSource.find(item => item.key === record.key)
      if(target){
        v = v.trim()
        let maxLength = 10
        let isTooLong = v.length >= maxLength ? true : false
        isTooLong && this.$message.warn('数量输入超出范围，请重新输入。')
        v = isTooLong ? v.slice(0,maxLength) : v
        target['count'] = v.trim().length === 0 ? 0 : parseInt(v)
        target['receivable'] = (target['count'] * record.unitPrice).toFixed(2)
        this.dataSource = dataSource
        this.calMoney();
      }
    },
    // 开票单产品价格变化
    unitPriceChange(record, e) {
      // const v = e.currentTarget.value
      // const _index = this.dataSource.findIndex(item => item.key === record.key)
      // if (_index >= 0) {
      //   this.dataSource[_index]['unitPrice'] = v.trim().length === 0 ? 0 : v.trim()
      //   record.receivable = e.currentTarget.value * record.count;
      // }
      // console.log("unitPriceChange:" + JSON.stringify(this.dataSource))
      // this.calMoney();
      let v = e.currentTarget.value.trim()
      let dataSource = [...this.dataSource]
      let target = dataSource.find(item => item.key === record.key)
      if(target){
        v = v.trim()
        let maxLength = 10
        let isTooLong = v.length >= maxLength ? true : false
        isTooLong && this.$message.warn('含税单价输入超出范围，请重新输入。')
        v = isTooLong ? v.slice(0,maxLength) : v
        target['unitPrice'] = v.trim().length === 0 ? 0 : parseFloat(v)
        target['receivable'] = (target['unitPrice'] * record.count).toFixed(2)
        this.dataSource = dataSource
        this.calMoney();
      }
    },
    calMoney(){
        /**
         * 计算开票金额
         * @type {number}
         */
        let paperMoneyAll = 0
        for (const productKey in this.dataSource) {
          const product = this.dataSource[productKey]
          paperMoneyAll = paperMoneyAll +  product.count * product.unitPrice
        }
        paperMoneyAll = Number(paperMoneyAll) + (this.freightType === 0 ? Number(this.freightCharge) : 0)
        paperMoneyAll = Number(paperMoneyAll).toFixed(2)
        const recordForm = {
          'paperMoney': paperMoneyAll,
        }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...recordForm })
        })
    },
    editPaper(){
      console.log('editPaper called.....')
      let that = this
      //dataSource
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log('json values :', JSON.stringify(values))
          this.$set(values, 'contractType', 1) // 1销售合同，2软件合同
          that.$set(values, 'products', that.dataSource)
          that.$set(values, 'deliveryTime', values.deliveryTime.format('YYYY-MM-DD'))
          that.$set(values, 'id', that.id)
          values.saleContract = that.saleContract
          console.log(values)

          that.spinning = true
          updatePaper(values).then((res) => {
            that.spinning = false
            if (res.code == 200) {
              that.goBackPricing()
            }else{
              that.$message.error(res.msg)
            }
          }).catch(err =>{
            that.spinning = false
          })
        }
      })
    },
    arrearsMoneyChange(e){
      let maxArrearsMoney = this.maxArrearsMoney || 0
      let number = parseFloat(e)
      if(number > maxArrearsMoney){
        this.$message.warn(`欠款金额不能大于 总金额 减去 已付金额，可输入的最大欠款金额为：${maxArrearsMoney}`)
      }
    },
    freightChargeChange(e){
      if(this.freightType !== 0) return
      this.freightCharge = Number(e) || 0
      this.form.setFieldsValue({
        freightCharge:this.freightCharge
      })
      this.$nextTick(() =>this.calMoney())
    }
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
    width: 50%;
  }

</style>

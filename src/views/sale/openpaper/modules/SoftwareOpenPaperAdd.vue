<template>
  <div>
    <a-spin :spinning="spinning">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="addClick" :loading="loading" icon="check">提交</a-button>
      <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
    </div>
    <a-card class="card" :bordered="false">

      <a-form :form="form" class="form">
        <a-form-item hidden>
          <a-input v-decorator="[ 'saleContract' ]"/>
        </a-form-item>

          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">开票编号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-input class="wdf-xyk" read-only="read-only" placeholder="请输入开票编号"
                       v-decorator="[ 'paperCode', {rules: [{ required: true, message: '请输入开票编号', whitespace: true}]} ]"/>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">合同编号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                @click="openModel"
                placeholder="请选择合同编号"
                v-decorator="[ 'contractNum' ]"/>
                </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">客户名称</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'customerName']"/>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票单位名称</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <!-- <span>江苏万德福公共设施科技有限公司</span> -->
              <a-form-item>
                <a-input class="wdf-xyk" v-decorator="[ 'openUnit']"/>
              </a-form-item>
            </a-col>
          </a-row>


          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">发票类型</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-radio-group class="wdf-xyk" :defaultValue="1" :disabled="queryBoolean" v-decorator="['paperType', {initialValue:2}]">
                <a-radio :value="2">增票</a-radio>
                <a-radio :value="1">普票</a-radio>
              </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票性质</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-radio-group
                class="wdf-xyk"
                :defaultValue="1"
                :disabled="queryBoolean"
                v-decorator="['paperQuality', {}]">
                <a-radio :value="1">常规开票</a-radio>
                <a-radio :value="2">特殊开票</a-radio>
              </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>


          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">开户行及账号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-input
                class="wdf-xyk"
                v-decorator="[ 'bankNoAccount']"/>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">纳税人识别号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-input
                class="wdf-xyk"
                v-decorator="[ 'taxPayerNo' ]"/>
              </a-form-item>
            </a-col>
          </a-row>


          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">客户地址</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-input
                class="wdf-xyk"
                v-decorator="[ 'customerAddress']"/>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">联系电话</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-input
                class="wdf-xyk"
                placeholder="请输入联系方式"
                v-decorator="[ 'customerTel',{rules: [{required: true, pattern: (/^1(3|4|5|7|8)\d{9}$/)|(/^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})$/) ,message: '请输入联系方式!'}]}]"/>
              </a-form-item>
            </a-col>
          </a-row>

        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="memberLoading"
          bordered
        >
          <div slot="company" slot-scope="text">
            <span v-if="text==0">套</span>
            <span v-if="text==1">台</span>
            <span v-if="text==2">个</span>
          </div>
          <div slot="unitPrice" slot-scope="text,record">
            <a-form-item>
              <a-input
                  placeholder="请输入价格"
                  @change="unitPriceChange(record,$event)"
                  :value="record.unitPrice"
                  />
            </a-form-item>
          </div>
        </a-table>

          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">实际发货日期</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-date-picker
                  class="wdf-xyk"
                  v-decorator="[
                    'deliveryTime',
                    {rules: [{ required: true, message: '请选择实际发货日期'}]}
                  ]"/>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input
                  disabled
                  class="wdf-xyk"
                  placeholder="请输入开票金额"
                  v-decorator="['paperMoney']"/>
              </a-form-item>
            </a-col>
          </a-row>


          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">回款情况</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-radio-group
                  class="wdf-xyk"
                  :defaultValue="1"
                  :disabled="queryBoolean"
                  v-decorator="['paperDetail', {}]">
                  <a-radio :value="1">部分付款</a-radio>
                  <a-radio :value="2">已付全款</a-radio>
                  <a-radio :value="3">未付款</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">总金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'totalAmount']"/>
              </a-form-item>
            </a-col>
          </a-row>


          <a-row type="flex" style="border-bottom: 1px solid #ddd;">
            <a-col class="col-border" :span="3" justify="center" align="middle">已回款金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
              <a-input
                class="wdf-xyk"
                read-only="read-only"
                v-decorator="[ 'refundMoney']"/>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">欠款金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <!--fix 0543 欠款金额不能大于总金额 -->
              <a-form-item>
                <a-input-number 
                  :min="0" 
                  :max="maxArrearsMoney" 
                  @change="arrearsMoneyChange" 
                  class="wdf-xyk"
                  placeholder="请输入欠款金额"
                  v-decorator="[ 'arrearsMoney', {rules: [{ required: true, message: '请输入欠款金额'}]} ]"/>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex" style="border-bottom: 1px solid #ddd">
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
          

      </a-form>
      <all-software-contract ref="allSoftwareContract" @custom-change="contractChange"></all-software-contract>
    </a-card>
    </a-spin>
  </div>
</template>

<script>

import { softwareContractDetail, goAdd, openPaperSave } from '@/api/openpaper'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import AllSoftwareContract from './AllSoftwareContract'
import ARow from 'ant-design-vue/es/grid/Row'

let _ukey = 0
const data = []
export default {
  name: 'SoftwareOpenPaperAdd',
  components: {
    ARow,
    AllSoftwareContract,
    AFormItem
  },
  data () {
    return {
      form: this.$form.createForm(this),
      memberLoading: false,
      loading: false,
      queryBoolean: false,
      columns: [
        {
          title: '产品名称',
          dataIndex: 'productName'
        },
        {
          title: '单位',
          dataIndex: 'company',
          scopedSlots: { customRender: 'company' }
        }, 
        {
          title: '数量',
          dataIndex: 'count'
        }, 
        {
          title: '含税单价',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' }
        }, 
        {
          title: '含税金额(元)',
          dataIndex: 'receivable'
        }
      ],
      dataSource: [],
      maxArrearsMoney:0, //最大可输入欠款金额
      spinning:false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let that = this
      goAdd().then(res => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.form.setFieldsValue({ 'paperCode': res.data })
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    openModel () {
      this.$refs.allSoftwareContract.query()
    },
    contractChange (data) {
      const paramter = { 'id': data }
      softwareContractDetail(paramter).then(res => {
        if (res.code == 200) {
          const listProduct = []
          let paperMoneyAll = 0
          for (const productKey in res.data.products) {
            const product = res.data.products[productKey]
            //const tRprice = (product.unitPrice * (100 + product.taxRate) / 100).toFixed(2) // 含税单价
            const tRprice = parseFloat(product.unitPrice)
            listProduct.push({
              key:++_ukey,
              'productId': product.id,
              'productName': product.productName,
              'receivable': (product.count * tRprice).toFixed(2),
              'company': 0,
              'count': product.count,
              'unitPrice': tRprice
            })
            paperMoneyAll = (parseFloat(paperMoneyAll) +  product.count * tRprice).toFixed(2)
          }
          this.form.setFieldsValue({ ...record })
          const record = {
            'contractNum': res.data.contractNum,
            'customerName': res.data.customerName,
            'contractId': res.data.id,
            'totalAmount': res.data.totalAmount,
            'paperMoney': paperMoneyAll,
            'taxPayerNo': res.data.customerInfo.dutyParagraph,
            'bankNoAccount': res.data.customerInfo.openingBank,
            'customerTel': res.data.customerInfo.mobile,
            'customerAddress': res.data.customerInfo.address,
            'refundMoney': res.data.returnedMoney,
            'saleContract': res.data.id,
            'paperDetail': 1,
            'paperQuality': 1,
            'paperType': 2
          }
          console.log('record', record)
          this.$nextTick(() => {
            this.form.setFieldsValue({ ...record })
          })
          this.dataSource = listProduct
          this.maxArrearsMoney = parseFloat(record.totalAmount) - parseFloat(record.refundMoney)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 返回
    goBackPricing () {
      // 点击返回，返回列表页
      this.$router.push({ name: 'openPaperList' })
      this.$destroy('softwareOpenPaperAdd')
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
          this.$set(values, 'products', this.dataSource)
          this.$set(values, 'contractType', 2) // 1销售合同，2软件合同
          this.$set(values, 'deliveryTime', values.deliveryTime.format('YYYY-MM-DD'))
          this.spinning = true
          openPaperSave(values).then(res => {
            this.spinning = false
            if (res.code == 200) {
              this.goBackPricing()
            }else{
              this.$message.error(res.msg)
            }
          }).catch(err =>this.spinning = false)
        }
      })
    },
    // 开票单产品数量变化
    quantityChange(record, e) {
      debugger
      const v = e.currentTarget.value
      let dataSource = [...this.dataSource]
      let target = dataSource.find(item => item.key === record.key)
      if(target){
        target['count'] = v.trim().length === 0 ? 0 : parseInt(v.trim())
        target['receivable'] = (e.currentTarget.value * record.unitPrice).toFixed(2)

        this.dataSource = dataSource
        this.calMoney();
      }
    },
    // 开票单产品价格变化
    unitPriceChange(record, e) {
      const v = e.currentTarget.value
      let dataSource = [...this.dataSource]
      let target = dataSource.find(item => item.key === record.key)
      if(target){
        target['unitPrice'] = v.trim().length === 0 ? 0 : v.trim()
        target['receivable'] = (e.currentTarget.value * record.count).toFixed(2)

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
          paperMoneyAll = (parseFloat(paperMoneyAll) + product.count * product.unitPrice).toFixed(2)
        }
        const recordForm = {
          'paperMoney': paperMoneyAll,
        }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...recordForm })
        })
    },
    arrearsMoneyChange(e){
      let maxArrearsMoney = this.maxArrearsMoney || 0
      let number = parseFloat(e)
      if(number > maxArrearsMoney){
        this.$message.warn(`欠款金额不能大于 总金额 减去 已付金额，可输入的最大欠款金额为：${maxArrearsMoney}`)
      }
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

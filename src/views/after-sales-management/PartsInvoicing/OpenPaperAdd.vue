<template>
  <a-spin :spinning="spinning">
    <div>
      <div class="top-right clearfix">
        <a-button class="fl-r" type="primary" @click="addClick" :loading="loading" icon="check">提交</a-button>
        <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
      </div>
      <a-card class="card" :bordered="false">
        <a-form :form="form" class="form">
          <a-form-item hidden>
            <a-input v-decorator="['saleContract']" />
          </a-form-item>

          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">开票编号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input
                  class="wdf-xyk"
                  read-only="read-only"
                  placeholder="请输入开票编号"
                  v-decorator="[
                    'paperCode',
                    { rules: [{ required: true, message: '请输入开票编号', whitespace: true }] },
                  ]"
                />
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
                  v-decorator="['contractNum']"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">客户名称</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input class="wdf-xyk" read-only="read-only" v-decorator="['customerName']" />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票单位名称</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <!-- <span>江苏万德福公共设施科技有限公司</span> -->
              <a-form-item>
                <a-input class="wdf-xyk" v-decorator="['openUnit']" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">发票类型</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-radio-group
                  class="wdf-xyk"
                  :disabled="queryBoolean"
                  v-decorator="['paperType', { initialValue: 2 }]"
                >
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
                  :disabled="queryBoolean"
                  v-decorator="['paperQuality', { initialValue: 1 }]"
                >
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
                <a-input class="wdf-xyk" v-decorator="['bankNoAccount']" />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">纳税人识别号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input
                  class="wdf-xyk"
                  v-decorator="[
                    'taxPayerNo',
                    {
                      rules: [
                        {
                          required: true,
                          message: '纳税人识别号!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">客户地址</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input class="wdf-xyk" v-decorator="['customerAddress']" />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">联系电话</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input
                  class="wdf-xyk"
                  placeholder="请输入联系电话"
                  v-decorator="[
                    'customerTel',
                    {
                      rules: [
                        {
                          required: true,
                          pattern: /^1(3|4|5|7|8)\d{9}$/ | /^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})$/,
                          message: '请输入联系电话!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- <a-table :columns="travelColumns" :dataSource="dataSource" :pagination="false" bordered size="small">
            <div slot="order" slot-scope="text, record, index">
              {{ index + 1 }}
            </div>

            <div slot="money" slot-scope="text, record, index">
              {{ record.isWarranty === 0 ? '0' : record.quantity * record.unitPrice }}
            </div>
            <div slot="footer" slot-scope="text, record, index">
              <div style="text-align: right; font-size: 16px; color: red">
                <span>数量合计：{{ totalPrice }}</span>
                <span style="margin: 0 10px">单价合计：{{ totalPhase | moneyFormatNumber }}</span>
                <span>金额合计：{{ details.totalAmount | moneyFormatNumber }}</span>
              </div>
            </div>
          </a-table> -->
          <a-table :columns="columns" :dataSource="dataSource" :pagination="false" :loading="memberLoading" bordered>
            <div slot="company" slot-scope="text, record">
              <span v-if="text == 0">套</span>
              <span v-if="text == 1">台</span>
              <span v-if="text == 2">个</span>
              <span v-if="text == 3">块</span>
              <span v-if="text == 4">条</span>
              <span v-if="text == 5">根</span>
              <span v-if="text == 6">张</span>
              <span v-if="text == 7">卷</span>
            </div>

            <div slot="count" slot-scope="text, record, index">
              <a-form-item>
                <a-input
                  type="number"
                  placeholder="请输入数量"
                  @change="quantityChange(record, $event)"
                  :value="record.count"
                />
              </a-form-item>
            </div>

            <div slot="unitPrice" slot-scope="text, record, index">
              <a-form-item>
                <a-input
                  type="number"
                  placeholder="请输入价格"
                  @change="unitPriceChange(record, $event)"
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
                  v-decorator="['deliveryTime', { rules: [{ required: true, message: '请选择实际发货日期' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input disabled class="wdf-xyk" placeholder="请输入开票金额" v-decorator="['paperMoney']" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">回款情况</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-radio-group
                  class="wdf-xyk"
                  :disabled="queryBoolean"
                  v-decorator="['paperDetail', { initialValue: 1 }]"
                >
                  <a-radio :value="1">部分付款</a-radio>
                  <a-radio :value="2">已付全款</a-radio>
                  <a-radio :value="3">未付款</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">总金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input class="wdf-xyk" read-only="read-only" v-decorator="['contractAmount']" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex" style="border-bottom: 1px solid #ddd">
            <a-col class="col-border" :span="3" justify="center" align="middle">已回款金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input
                  class="wdf-xyk"
                  read-only="read-only"
                  v-decorator="['refundMoney', { rules: [{ required: false, message: '请输入已回款金额' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">欠款金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <!--fix 0543 欠款金额不能大于总金额 -->
              <a-form-item>
                <a-input-number
                  :min="0"
                  :max="Number(maxArrearsMoney)"
                  @change="arrearsMoneyChange"
                  class="wdf-xyk"
                  placeholder="请输入欠款金额"
                  v-decorator="['arrearsMoney', { rules: [{ required: false, message: '请输入欠款金额' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex" style="border-bottom: 1px solid #ddd" v-if="freightType === 0">
            <a-col class="col-border" :span="3" justify="center" align="middle">运费(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input-number
                  style="width: 50%"
                  :min="0"
                  :step="0.1"
                  :precision="2"
                  placeholder="运费"
                  @change="freightChargeChange"
                  v-decorator="['freightCharge']"
                />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle"></a-col>
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
        <receipt-sale-contract ref="receiptContract" @custom-change="contractChange"></receipt-sale-contract>
      </a-card>
    </div>
  </a-spin>
</template>

<script>
import { getContractOne, goAdd, openPaperSave } from '@/api/openpaper'
import { accessoriesGetDetailById } from '@/api/after-sales-management'

import AFormItem from 'ant-design-vue/es/form/FormItem'
import ReceiptSaleContract from './modules/ReceiptSaleContract'
import ARow from 'ant-design-vue/es/grid/Row'

let _ukey = 0
const data = []
export default {
  name: 'OpenPaperAdd',
  components: {
    ARow,
    ReceiptSaleContract,
    AFormItem,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      memberLoading: false,
      moneyTypes: [],
      loading: false,
      visibleBoolean: false,
      queryBoolean: false,
      produceData: [],
      columns: [
        {
          title: '产品名称',
          dataIndex: 'productName',
        },

        {
          title: '产品代码',
          dataIndex: 'productCode',
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
          title: '含税单价',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' },
        },
        {
          title: '含税金额(元)',
          dataIndex: 'receivable',
        },
      ],
      details: {},
      dataSource: [],
      queryParam: [],
      // 加载数据方法 必须为 Promise 对象
      maxArrearsMoney: 0, //最大可输入欠款金额
      freightType: 1,
      contractAmount: 0, //总金额 包含运费
      totalAmountWidtoutFreight: 0, //总金额 不包含运费
      spinning: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let that = this
      goAdd().then((res) => {
        const data = { paperCode: res.data }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...data })
        })
      })
    },
    openModel() {
      const data = { type: 1 }
      this.$refs.receiptContract.query(data)
    },
    contractChange(data) {
      console.log(data)
      const paramter = { id: data.id }
      accessoriesGetDetailById(paramter).then((res) => {
        console.log(res)
        this.dataSource = res.data.productInfoList.map((i) => {
          return {
            key: ++_ukey,
            productName: i.materialName,
            productCode: i.materialCode,
            company: i.company,
            count: i.quantity,
            unitPrice: i.unitPrice,
            receivable: i.quantity * i.unitPrice,
            specification: i.specification,
          }
        })
        this.details = res.data
        const record = {
          contractNum: res.data.accessoriesContractNum,
          customerName: res.data.customerName,
          contractAmount: res.data.totalAmount,
          paperMoney: res.data.totalAmount,
          bankNoAccount: res.data.accountNum,
          customerTel: res.data.telephone,
          customerAddress: res.data.address,
          saleContract: res.data.id,
          paperDetail: 1,
          paperQuality: 1,
          paperType: res.data.invoiceType,
          freightCharge: res.data.freightMoneyWithRate,
        }
        console.log('record', record)
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...record })
        })

        //this.produceData = listProduct
        // this.maxArrearsMoney = Number(parseFloat(record.contractAmount) - parseFloat(record.refundMoney)).toFixed(2)
      })
    },
    // 返回
    goBackPricing() {
      // 点击返回，返回列表页
      this.$router.push({ name: 'after-sales-management_PartsInvoicing' })
      this.$destroy('PartsInvoicingPaperAdd')
    },
    writeAccountNum(record) {
      const data = { accountNum: record.bankNum }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
    },
    addClick() {
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          this.$set(values, 'contractType', 6) // 1销售合同，2软件合同,6
          this.$set(values, 'products', this.dataSource)
          this.$set(values, 'deliveryTime', values.deliveryTime.format('YYYY-MM-DD'))
          values.saleCustomerName = this.details.customerName
          values.saleCustomerId = this.details.customerId
          values.saleUserName = this.details.saleUserName
          values.saleUserId = this.details.saleUserId

          this.spinning = true
          openPaperSave(values)
            .then((res) => {
              this.spinning = false
              if (res.code == 200) {
                this.goBackPricing()
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch((err) => {
              this.spinning = false
            })
        }
      })
    },
    // 开票单产品数量变化
    quantityChange(record, e) {
      let v = e.currentTarget.value.trim()
      let dataSource = [...this.dataSource]
      let target = dataSource.find((item) => item.key === record.key)
      if (target) {
        v = v.trim()
        let maxLength = 10
        let isTooLong = v.length >= maxLength ? true : false
        isTooLong && this.$message.warn('数量输入超出范围，请重新输入。')
        v = isTooLong ? v.slice(0, maxLength) : v
        target['count'] = v.trim().length === 0 ? 0 : parseInt(v)
        target['receivable'] = (target['count'] * record.unitPrice).toFixed(2)
        this.dataSource = dataSource
        this.calMoney()
      }
    },
    // 开票单产品价格变化
    unitPriceChange(record, e) {
      let v = e.currentTarget.value.trim()
      let dataSource = [...this.dataSource]
      let target = dataSource.find((item) => item.key === record.key)
      if (target) {
        v = v.trim()
        let maxLength = 10
        let isTooLong = v.length >= maxLength ? true : false
        isTooLong && this.$message.warn('含税单价输入超出范围，请重新输入。')
        v = isTooLong ? v.slice(0, maxLength) : v
        target['unitPrice'] = v.trim().length === 0 ? 0 : parseFloat(v)
        target['receivable'] = (target['unitPrice'] * record.count).toFixed(2)
        this.dataSource = dataSource
        this.calMoney()
      }

      // const _index = this.produceData.findIndex(item => item.key === record.key)
      // if (_index >= 0) {
      //   this.produceData[_index]['unitPrice'] = v.trim().length === 0 ? 0 : v.trim()
      //   record.receivable = e.currentTarget.value * record.count;
      // }
      // console.log("unitPriceChange:" + JSON.stringify(this.produceData))
      // this.calMoney();
    },
    /**
     * 计算开票金额
     * @type {number}
     */
    calMoney() {
      //debugger
      let paperMoneyAll = 0
      for (const productKey in this.dataSource) {
        const product = this.dataSource[productKey]
        paperMoneyAll = (parseFloat(paperMoneyAll) + product.count * product.unitPrice).toFixed(2)
      }
      paperMoneyAll = Number(paperMoneyAll) + (this.freightType === 0 ? Number(this.freightCharge) : 0)
      paperMoneyAll = Number(paperMoneyAll).toFixed(2)
      const recordForm = {
        paperMoney: paperMoneyAll,
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...recordForm })
      })
    },
    arrearsMoneyChange(e) {
      let maxArrearsMoney = this.maxArrearsMoney || 0
      maxArrearsMoney = parseFloat(maxArrearsMoney)
      let number = parseFloat(e)
      if (number > maxArrearsMoney) {
        this.$message.warn(
          `欠款金额不能大于 总金额 减去 已付金额，可输入的最大欠款金额为：${Number(maxArrearsMoney).toFixed(2)}`
        )
      }
    },
    freightChargeChange(e) {
      if (this.freightType !== 0) return
      this.freightCharge = Number(e) || 0
      this.form.setFieldsValue({
        freightCharge: this.freightCharge,
      })
      this.$nextTick(() => this.calMoney())
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

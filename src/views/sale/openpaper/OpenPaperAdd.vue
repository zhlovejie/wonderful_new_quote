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
                <a-input class="wdf-xyk" v-decorator="['taxPayerNo']" />
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
                  placeholder="请输入联系方式"
                  v-decorator="[
                    'customerTel',
                    {
                      rules: [
                        {
                          required: true,
                          pattern: /^1(3|4|5|7|8)\d{9}$/ | /^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})$/,
                          message: '请输入联系方式!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

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
                <a-input class="wdf-xyk" read-only="read-only" v-decorator="['totalAmount']" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row type="flex" style="border-bottom: 1px solid #ddd">
            <a-col class="col-border" :span="3" justify="center" align="middle">已回款金额(元)</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input class="wdf-xyk" read-only="read-only" v-decorator="['refundMoney']" />
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
                  v-decorator="['arrearsMoney', { rules: [{ required: true, message: '请输入欠款金额' }] }]"
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
          title: '标的名称',
          dataIndex: 'targetName',
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
        },

        {
          title: '产品代码',
          dataIndex: 'productTypeName',
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
      dataSource: [],
      queryParam: [],
      // 加载数据方法 必须为 Promise 对象
      maxArrearsMoney: 0, //最大可输入欠款金额
      freightType: 1,
      totalAmount: 0, //总金额 包含运费
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
    add(res) {
      // const data = {"receiptCode"}
    },
    openModel() {
      const data = { type: 1 }
      this.$refs.receiptContract.query(data)
    },
    contractChange(data) {
      const paramter = { id: data.contractId }
      getContractOne(paramter).then((res) => {
        console.log(res)

        this.freightType = res.data.freightType
        this.freightCharge = res.data.freightMoneyWithRate
        this.totalAmount = res.data.totalAmount
        this.totalAmountWidtoutFreight = (this.totalAmount * 100 - res.data.freightMoneyWithRate * 100) / 100
        const listProduct = []
        let paperMoneyAll = 0

        for (const productKey in res.data.product) {
          const product = res.data.product[productKey]
          var settlement = []
          const countP = (product.count * product.unitPrice).toFixed(2) // 总价（销售合同单价已经含税，所以不用乘以税率）
          console.log('paperMoneyAll ...', paperMoneyAll)
          console.log('countP ...', countP)
          listProduct.push({
            key: ++_ukey,
            productId: product.productId,
            productName: product.contractProductPo.productName,
            productTypeName: product.contractProductPo.productModel,
            receivable: countP,
            company: product.company,
            count: product.count,
            unitPrice: product.unitPrice,
            targetName: product.targetName,
            targetId: product.targetId,
          })
          paperMoneyAll = parseFloat(paperMoneyAll) + parseFloat(countP)
        }
        console.log('paperMoneyAll ...', paperMoneyAll)
        this.form.setFieldsValue({ ...record })
        const record = {
          contractNum: res.data.contractNum,
          customerName: res.data.customerName,
          contractId: res.data.id,
          totalAmount: res.data.totalAmount,
          paperMoney: paperMoneyAll + (res.data.freightType === 0 ? Number(res.data.freightMoneyWithRate) : 0),
          taxPayerNo: res.data.customerInfo.dutyParagraph,
          bankNoAccount: res.data.customerInfo.openingBank,
          customerTel: res.data.customerInfo.mobile,
          customerAddress: res.data.customerInfo.address,
          refundMoney: res.data.returnedMoney,
          saleContract: data.contractId,
          paperDetail: 1,
          paperQuality: 1,
          paperType: 2,
          freightCharge: res.data.freightMoneyWithRate,
        }
        console.log('record', record)
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...record })
        })
        this.dataSource = listProduct
        //this.produceData = listProduct
        this.maxArrearsMoney = Number(parseFloat(record.totalAmount) - parseFloat(record.refundMoney)).toFixed(2)
      })
    },
    // 返回
    goBackPricing() {
      // 点击返回，返回列表页
      this.$router.push({ name: 'openPaperList' })
      this.$destroy('openPaperAdd')
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
          this.$set(values, 'contractType', 1) // 1销售合同，2软件合同
          this.$set(values, 'products', this.dataSource)
          this.$set(values, 'deliveryTime', values.deliveryTime.format('YYYY-MM-DD'))

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

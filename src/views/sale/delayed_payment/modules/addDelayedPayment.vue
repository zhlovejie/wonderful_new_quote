<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBackContract" icon="backward">返回</a-button>
      <a-button class="fl-r" type="primary" @click="handleSubmit" icon="check">保存</a-button>
    </div>
    <div class="add-delayed-payment-wrapper">
      <!-- <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">延迟付款单</a-col>
      </a-row>-->
      <a-form :form="form" @submit="handleSubmit" class="form wdf-form">
        <table class="custom-table custom-table-border">
          <caption>
            延迟付款单
          </caption>
          <tbody>
            <tr>
              <td>延迟付款单据编号</td>
              <td>
                <a-form-item>
                  <a-input
                    type="text"
                    read-only="read-only"
                    style="border: none; width: 60%"
                    v-decorator="['delayedPaymentNum', {}]"
                  />
                </a-form-item>
              </td>
              <td>合同编号</td>
              <td>
                <a-form-item>
                  <a-input
                    type="text"
                    read-only="read-only"
                    style="border: none; width: 60%"
                    v-decorator="['contractNum', {}]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>延迟付款方</td>
              <td>
                <a-form-item>
                  <a-input
                    type="text"
                    read-only="read-only"
                    style="border: none; width: 60%"
                    v-decorator="['customerName', {}]"
                  />
                </a-form-item>
              </td>
              <td>承诺付款时间</td>
              <td>
                <a-form-item>
                  <a-select
                    placeholder="请选择欠款状态"
                    style="border: none; width: 60%"
                    @change="onselect"
                    v-decorator="['settleType', { rules: [{ required: true, message: '请选择承诺付款类型' }] }]"
                  >
                    <a-select-option v-for="val in routineSettlement" :key="val.id" :value="val.moneyType">
                      <template v-if="val.moneyType === 0"> 全款 </template>
                      <template v-if="val.moneyType === 1"> 质保金 </template>
                      <template v-if="val.moneyType === 2"> 进度款 </template>
                      <template v-if="val.moneyType === 3"> 验收款 </template>
                      <template v-if="val.moneyType === 4"> 预付款 </template>
                      <template v-if="val.moneyType === 5"> 提货款 </template>
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-input
                    disabled
                    type="text"
                    read-only="read-only"
                    style="border: none; width: 60%"
                    v-decorator="['promiseTime', {}]"
                  />
                  <!-- <a-date-picker
                    @change="setPromiseTime"
                    disabled
                    v-decorator="['promiseTime', { rules: [{ required: true, message: '请选择承诺付款时间！' }] }]"
                  /> -->
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>延迟付款时间</td>
              <td>
                <a-form-item>
                  <a-date-picker
                    format="YYYY-MM-DD"
                    :disabledDate="disabledDate"
                    :disabledTime="disabledDateTime"
                    @change="setDelayedTime"
                    v-decorator="['delayedTime', { rules: [{ required: true, message: '请选择延迟付款时间！' }] }]"
                  />
                  延迟天数：{{ delayedDay }}
                </a-form-item>
              </td>
              <td>总金额</td>
              <td>
                <a-form-item>
                  <a-input
                    type="text"
                    read-only="read-only"
                    style="border: none; width: 60%"
                    v-decorator="['totalAmount', {}]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>已付金额</td>
              <td>
                <a-form-item>
                  <a-input type="text" disabled style="border: none; width: 60%" v-decorator="['paidAmount', {}]" />
                </a-form-item>
              </td>
              <td>延迟付款金额</td>
              <td>
                <a-form-item>
                  <a-input-number
                    :min="0"
                    :max="maxDelayedAmount"
                    style="border: none; width: 60%"
                    v-decorator="['delayedAmount', { rules: [{ required: true, message: '请输入延迟付款金额' }] }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr>
              <td>币别</td>
              <td>
                <a-form-item>
                  <a-select
                    placeholder="请选择币别"
                    style="border: none; width: 60%"
                    v-decorator="[
                      'currency',
                      { initialValue: 1 },
                      { rules: [{ required: true, message: '请选择币别' }] },
                    ]"
                    disabled
                  >
                    <a-select-option :value="1">人民币</a-select-option>
                  </a-select>
                </a-form-item>
              </td>
              <td>欠款状态</td>
              <td>
                <a-form-item>
                  <a-select
                    placeholder="请选择欠款状态"
                    style="border: none; width: 60%"
                    v-decorator="[
                      'arrearsStatus',
                      { initialValue: 1 },
                      { rules: [{ required: true, message: '请选择欠款状态' }] },
                    ]"
                  >
                    <a-select-option :value="1">未结</a-select-option>
                    <a-select-option :value="2">已结</a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>

            <tr>
              <td>延迟付款原因</td>
              <td>
                <a-form-item>
                  <a-textarea
                    type="text"
                    style="border: none; width: 80%"
                    v-decorator="['reason', { rules: [{ required: true, message: '请输入延迟付款原因' }] }]"
                  />
                </a-form-item>
              </td>
              <td>模版</td>
              <td>
                <a-form-item>
                  <a-select
                    placeholder="请选择模版"
                    style="border: none; width: 60%"
                    v-decorator="[
                      'templateType',
                      { initialValue: 1, rules: [{ required: true, message: '请选择模版' }] },
                    ]"
                  >
                    <a-select-option :value="1">欠款单</a-select-option>
                    <a-select-option :value="2">欠款单-简版</a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
          </tbody>
        </table>

        <a-row>
          <a-col :span="24" class="basic-vice-tit" justify="center">总订货清单</a-col>
        </a-row>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
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
          </div>
        </a-table>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">创建人</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none; width: 60%"
                v-decorator="['createName', {}]"
              />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">创建日期</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none; width: 60%"
                v-decorator="['createTime', {}]"
              />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">审批人</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none; width: 60%"
                v-decorator="['', {}]"
              />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">审批日期</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none; width: 60%"
                v-decorator="['', {}]"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getDelayedNum, getDeliverProductList, getContractById, saveDelayedPayment } from '@/api/delayedPayment'
import moment from 'moment'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'addDelayedPayment',
  components: {
    AFormItem,
    ATextarea,
    moment,
  },
  props: {},
  data() {
    return {
      // form
      form: this.$form.createForm(this),
      contractNum: '', // 合同编号
      customerId: 0, // 客户id
      memberLoading: false,
      dataSource: [], // 合同产品列表
      dataSourceDelivered: [], // 已发货产品列表
      dataSourceUnshipped: [], // 未发货产品列表
      promiseTime: moment(),
      delayedTime: moment(),
      delayedDay: 0, // 延迟时长（天）
      promiseTimes: 0,
      delayedTimes: 0,
      routineSettlement: [],
      contractType: '',
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
        },
        {
          title: '产品类别',
          dataIndex: 'productType',
          scopedSlots: { customRender: 'productType' },
        },
        {
          title: '产品代码',
          dataIndex: 'productStandard',
          scopedSlots: { customRender: 'productStandard' },
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
      ],
      maxDelayedAmount: 0, //延迟付款金额 可输入最大值
    }
  },
  watch: {},
  mounted() {
    this.getContract()
    this.delayedNum()
  },
  methods: {
    moment,
    onselect(value) {
      let arr = this.routineSettlement.find((item) => item.moneyType === value)
      this.promiseTimes = moment(arr.paymentDate)
      this.form.setFieldsValue({ promiseTime: arr.paymentDate })
       if (this.delayedTimes !== '') {
        this.delayedDay = date.diff(this.delayedTimes, 'days')
      }
    },
    setDelayedTime(date, dateString) {
      this.delayedTimes = date
      if (this.promiseTimes !== '') {
        this.delayedDay = date.diff(this.promiseTimes, 'days')
      }
    },
    info() {
      this.$nextTick(() => {
        this.form.setFieldsValue({ contractNum: this.record.contractNum })
        this.form.setFieldsValue({ customerName: this.record.saleCustomerName })
        this.form.setFieldsValue({ totalAmount: this.record.totalAmount })
        this.form.setFieldsValue({ paidAmount: this.record.returnedMoney })
      })
      this.setDataSource()
      this.setDataSourceDelivered()
    },
    setDataSource() {
      // 添加合同产品
      const listProduct = []
      for (const productKey in this.record.product) {
        const product = this.record.product[productKey]
        listProduct.push({
          id: product.id,
          targetName: product.targetName,
          productType: product.productType,
          productStandard: product.contractProductPo.productModel,
          company: product.company,
          count: product.count,
        })
      }
      this.dataSource = listProduct
      this.dataSourceUnshipped = JSON.parse(JSON.stringify(listProduct))
    },
    setDataSourceDelivered() {
      // 添加已发产品
      const parameter = { contractId: this.record.id }
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
    setUnshipped() {
      for (let i = 0; i < this.dataSourceUnshipped.length; i++) {
        for (let j = 0; j < this.dataSourceDelivered.length; j++) {
          if (this.dataSourceUnshipped[i].id === this.dataSourceDelivered[j].invoiceProductId) {
            this.dataSourceUnshipped[i].count = this.dataSourceUnshipped[i].count - this.dataSourceDelivered[j].count
          }
        }
      }
      console.log('this.dataSourceUnshipped', this.dataSourceUnshipped)
      console.log('this.dataSource', this.dataSource)
    },
    // 返回
    goBack() {
      this.$router.push({ name: 'delayedPayment' })
    },
    goBackContract() {
      this.$destroy('addDelayedPayment')
      this.$router.push({ name: 'distributionContractList' })
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const parameter = { productList: this.dataSourceDelivered }
          // 合同id
          this.$set(values, 'contractId', this.record.id)
          this.$set(values, 'contractType', this.$route.params.contractType)
          // 已发产品信息
          this.$set(values, 'delayedProductVo', parameter)
          saveDelayedPayment(values)
            .then((res) => {
              if (res.code === 200) {
                this.goBackContract()
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
    },
    // 获取延迟发货单编号
    delayedNum() {
      getDelayedNum()
        .then((res) => {
          console.log('获取发货单编号的结果', res)
          this.form.setFieldsValue({ delayedPaymentNum: res.data })
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getContract() {
      const parameter = { id: this.$route.params.id }
      getContractById(parameter)
        .then((res) => {
          this.record = res.data
          this.routineSettlement = res.data.routineSettlement
          let { totalAmount, returnedMoney } = this.record
          this.maxDelayedAmount = parseFloat(totalAmount) - parseFloat(returnedMoney)

          // 把获取到的合同信息放入表中
          this.info()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    disabledDate(current) {
      // 后三十天内可选
      return current < moment().subtract(1, 'days') || current > moment().add(30, 'd')
    },

    disabledDateTime() {},
  },
}
</script>

<style  scoped>
.wdf-row {
  border: 1px solid #ddd;
}

.col-border {
  border: 1px solid #ddd;
  padding: 10px 0;
  border-bottom: none;
  min-height: 60px;
  box-sizing: border-box;
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

.add-delayed-payment-wrapper >>> .custom-table tr td {
  padding: 10px 20px;
}
.add-delayed-payment-wrapper >>> .custom-table tr td:nth-child(even) {
  text-align: left;
}
.add-delayed-payment-wrapper >>> .custom-table tr td:nth-child(odd) {
  text-align: right;
  padding-right: 50px;
  width: 200px;
  color: #000;
}
</style>

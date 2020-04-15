<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBackContract" icon="backward">返回</a-button>
      <a-button class="fl-r" type="primary" @click="handleSubmit" icon="check">保存</a-button>
    </div>
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">延迟付款单</a-col>
      </a-row>
      <a-form :form="form" @submit="handleSubmit" class="form wdf-form">
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款单据编号</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                style="border: none;width: 60%;"
                v-decorator="['delayedPaymentNum',{}]"
              />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">合同编号</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                style="border: none;width: 60%;"
                v-decorator="['contractNum',{}]"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款方</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                style="border: none;width: 60%;"
                v-decorator="['customerName',{}]"
              />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">承诺付款时间</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-form-item>
                <a-date-picker
                  @change="setPromiseTime"
                  v-decorator="['promiseTime', {rules: [{required: true, message: '请选择承诺付款时间！'}]}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款时间</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-form-item>
                <a-date-picker
                  format="YYYY-MM-DD"
                  :disabledDate="disabledDate"
                  :disabledTime="disabledDateTime"
                  @change="setDelayedTime"
                  v-decorator="['delayedTime', {rules: [{required: true, message: '请选择延迟付款时间！'}]}]"
                />
                延迟天数：{{ delayedDay }}
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">总金额</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                style="border: none;width: 60%;"
                v-decorator="['totalAmount',{}]"
              />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">已付金额</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input
                type="text"
                disabled
                style="border: none;width: 60%;"
                v-decorator="['paidAmount',{}]"
              />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款金额</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-form-item>
                <a-input-number
                  :min="0"
                  :max="maxDelayedAmount"
                  style="border: none;width: 60%;"
                  v-decorator="['delayedAmount',{rules: [{ required: true, message: '请输入延迟付款金额' }]}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">币别</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-form-item>
                <a-select
                  placeholder="请选择币别"
                  style="border: none;width: 60%;"
                  v-decorator="['currency',{initialValue:1}, {rules: [{ required: true, message: '请选择币别' }]}]"
                  disabled
                >
                  <a-select-option :value="1">人民币</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">欠款状态</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-form-item>
                <a-select
                  placeholder="请选择欠款状态"
                  style="border: none;width: 60%;"
                  v-decorator="['arrearsStatus',{initialValue:1} ,{rules: [{ required: true, message: '请选择欠款状态' }]}]"
                >
                  <a-select-option :value="1">未结</a-select-option>
                  <a-select-option :value="2">已结</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款原因</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-form-item>
                <a-textarea
                  type="text"
                  style="border: none;width: 80%;"
                  v-decorator="['reason',{rules: [{ required: true, message: '请输入延迟付款原因' }]}]"
                />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">模版</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-form-item>
                <a-select
                  placeholder="请选择模版"
                  style="border: none;width: 60%;"
                  v-decorator="['templateType', {rules: [{ required: true, message: '请选择模版' }]}]"
                >
                  <a-select-option :value="1">欠款单</a-select-option>
                  <a-select-option :value="2">欠款单-简版</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">创建人</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none;width: 60%;"
                v-decorator="['createName',{}]"
              />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">创建日期</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none;width: 60%;"
                v-decorator="['createTime',{}]"
              />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">审批人</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none;width: 60%;"
                v-decorator="['',{}]"
              />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">审批日期</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none;width: 60%;"
                v-decorator="['',{}]"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getDelayedNum, getSoftContractById, saveDelayedPayment } from '@/api/delayedPayment'
import moment from 'moment'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'addSoftDelayedPayment',
  components: {
    AFormItem,
    ATextarea,
    moment
  },
  props: {},
  data() {
    return {
      // form
      form: this.$form.createForm(this),
      contractNum: '', // 合同编号
      customerId: 0, // 客户id
      memberLoading: false,
      promiseTime: moment(),
      delayedTime: moment(),
      delayedDay: 0, // 延迟时长（天）
      promiseTimes: 0,
      delayedTimes: 0,
      contractType: '',
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
          dataIndex: 'productStandard',
          scopedSlots: { customRender: 'productStandard' }
        },
        {
          title: '单位',
          dataIndex: 'company',
          scopedSlots: { customRender: 'company' }
        },
        {
          title: '数量',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' }
        }
      ],
      maxDelayedAmount: 0 //延迟付款金额 可输入最大值
    }
  },
  watch: {},
  mounted() {
    this.getSoftContract()
    this.delayedNum()
  },
  methods: {
    moment,
    setPromiseTime(date, dateString) {
      this.promiseTimes = date
      if (this.delayedTimes !== 0) {
        this.delayedDay = this.delayedTimes.diff(date, 'days')
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
    },
    // 返回
    goBack() {
      this.$router.push({ name: 'delayedPayment' })
    },
    goBackContract() {
      this.$destroy('addSoftDelayedPayment')
      this.$router.push({ name: 'softwareContractList' }) //应该返回到软件合同列表
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // 合同id
          this.$set(values, 'contractId', this.record.id)
          this.$set(values, 'contractType', this.$route.params.contractType)
          saveDelayedPayment(values)
            .then(res => {
              if (res.code === 200) {
                this.goBackContract()
              }
            })
            .catch(error => {
              console.error(error)
            })
        }
      })
    },
    // 获取延迟发货单编号
    delayedNum() {
      getDelayedNum()
        .then(res => {
          console.log('获取发货单编号的结果', res)
          this.form.setFieldsValue({ delayedPaymentNum: res.data })
        })
        .catch(error => {
          console.error(error)
        })
    },
    getSoftContract() {
      const parameter = { id: this.$route.params.id }
      getSoftContractById(parameter)
        .then(res => {
          this.record = res.data

          let { totalAmount, returnedMoney } = this.record
          this.maxDelayedAmount = parseFloat(totalAmount) - parseFloat(returnedMoney)
          // 把获取到的合同信息放入表中
          this.info()
        })
        .catch(error => {
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

    disabledDateTime() {}
  }
}
</script>

<style lang="less" scoped>
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
</style>

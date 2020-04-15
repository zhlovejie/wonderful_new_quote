<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="handleSubmit" icon="check">提交</a-button>
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
    </div>
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">延迟付款单</a-col>
      </a-row>
      <a-form
        :form="form"
        @submit="handleSubmit"
        class="form wdf-form"
      >
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款单据编号</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                style="border: none;width: 60%;"
                v-decorator="['delayedPaymentNum',{}]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">合同编号</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                style="border: none;width: 60%;"
                v-decorator="['contractNum',{}]"/>
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
                v-decorator="['customerName',{}]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">承诺付款时间</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input type="text" read-only="read-only" style="border: none;width: 60%;" v-decorator="['promiseTime',{}]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款时间</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input type="text" read-only="read-only" style="border: none;width: 60%;" v-decorator="['delayedTime',{}]"/>
              延迟天数：{{ CountTime }}
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">总金额</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                style="border: none;width: 60%;"
                v-decorator="['totalAmount',{}]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">已付金额</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                style="border: none;width: 60%;"
                v-decorator="['paidAmount',{}]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款金额</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input-number
                  :min="0"
                  :max="maxDelayedAmount"
                  style="border: none;width: 60%;"
                  v-decorator="['delayedAmount',{rules: [{ required: true, message: '请输入延迟付款金额' }]}]"/>

            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">币别</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-select
                placeholder="请选择币别"
                style="border: none;width: 60%;"
                aria-disabled="true"
                v-decorator="['currency', {rules: [{ required: true, message: '请选择币别' }]}]">
                <a-select-option :value="1">人民币</a-select-option>
              </a-select>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">欠款状态</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-select
                placeholder="请选择欠款状态"
                style="border: none;width: 60%;"
                aria-disabled="true"
                v-decorator="['arrearsStatus', {rules: [{ required: true, message: '请选择欠款状态' }]}]">
                <a-select-option :value="1">未结</a-select-option>
                <a-select-option :value="2">已结</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row class="wdf-row">
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款原因</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-textarea
                type="text"
                style="border: none;width: 60%;"
                v-decorator="['reason',{rules: [{ required: true, message: '请输入延迟付款原因' }]}]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">模版</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-form-item>
                <a-select
                  placeholder="请选择模版"
                  style="border: none;width: 60%;"
                  v-decorator="['templateType', {rules: [{ required: true, message: '请选择模版' }]}]">
                  <a-select-option :value="1">欠款单</a-select-option>
                  <a-select-option :value="2">欠款单-简版</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
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
          <div slot="order" slot-scope="text,record,index">
            <span>{{ index+1 }}</span>
          </div>

          <div slot="productType" slot-scope="text,record,index">
            <span v-if="text==0">常规产品</span>
            <span v-if="text==1">非常规产品</span>
          </div>
          <div slot="company" slot-scope="text,record,index">
            <span v-if="text==0">套</span>
            <span v-if="text==1">台</span>
            <span v-if="text==2">个</span>
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
          <div slot="order" slot-scope="text,record,index">
            <span>{{ index+1 }}</span>
          </div>

          <div slot="productType" slot-scope="text,record,index">
            <span v-if="text==0">常规产品</span>
            <span v-if="text==1">非常规产品</span>
          </div>
          <div slot="company" slot-scope="text,record,index">
            <span v-if="text==0">套</span>
            <span v-if="text==1">台</span>
            <span v-if="text==2">个</span>
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
          <div slot="order" slot-scope="text,record,index">
            <span>{{ index+1 }}</span>
          </div>

          <div slot="productType" slot-scope="text,record,index">
            <span v-if="text==0">常规产品</span>
            <span v-if="text==1">非常规产品</span>
          </div>
          <div slot="company" slot-scope="text,record,index">
            <span v-if="text==0">套</span>
            <span v-if="text==1">台</span>
            <span v-if="text==2">个</span>
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
                style="border: none;width: 60%;"
                v-decorator="['createName',{}]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">创建日期</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none;width: 100%;"
                v-decorator="['createTime',{}]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">审批人</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none;width: 60%;"
                v-decorator="['',{}]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">审批日期</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none;width: 100%;"
                v-decorator="['',{}]"/>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import {
  getContractById,
  updateDelayedPayment,
  getUnshipped
} from '@/api/delayedPayment'
import moment from 'moment'
import ATextarea from 'ant-design-vue/es/input/TextArea'

export default {
  name: 'Resubmit', // 重新提交
  components: {
    ATextarea,
    moment
  },
  props: {},
  data () {
    return {
      // form
      form: this.$form.createForm(this),
      contractNum: '', // 合同编号
      customerId: 0, // 客户id
      show: false,
      value: {},
      memberLoading: false,
      dataSource: [], // 合同产品列表
      dataSourceDelivered: [], // 已发货产品列表
      dataSourceUnshipped: [], // 未发货产品列表
      promiseTime: moment(),
      delayedTime: moment(),
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
        }, {
          title: '数量',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' }
        }
      ],
      maxDelayedAmount:0 //延迟付款金额 可输入最大值
    }
  },
  computed: {
    CountTime: function () {
      if (this.value !== undefined) {
        var ptime = this.value.promiseTime
        var dtime = this.value.delayedTime
        var day = moment(dtime).diff(moment(ptime), 'days')
        return day
      } else {
        return 0
      }
    }
  },
  watch: {},
  mounted () {
    // 从列表行传过来的内容
    this.value = this.$route.params.record
    this.getContract()
  },
  methods: {
    info () {
      this.$nextTick(() => {
        this.form.setFieldsValue({ delayedPaymentNum: this.value.delayedPaymentNum })
        this.form.setFieldsValue({ contractNum: this.record.contractNum })
        this.form.setFieldsValue({ customerName: this.record.saleCustomerName })
        this.form.setFieldsValue({ totalAmount: this.record.totalAmount })
        this.form.setFieldsValue({ paidAmount: this.record.returnedMoney })
        this.form.setFieldsValue({ delayedAmount: this.value.delayedAmount })
        this.form.setFieldsValue({ promiseTime: this.value.promiseTime })
        this.form.setFieldsValue({ delayedTime: this.value.delayedTime })
        this.form.setFieldsValue({ currency: this.value.currency })
        this.form.setFieldsValue({ arrearsStatus: this.value.arrearsStatus })
        this.form.setFieldsValue({ reason: this.value.reason })
        this.form.setFieldsValue({ createName: this.value.createName })
        this.form.setFieldsValue({ createTime: this.value.createTime })
        this.form.setFieldsValue({ templateType: this.value.templateType })
      })
      this.maxDelayedAmount = parseFloat(this.record.totalAmount) - parseFloat(this.record.returnedMoney)
      this.setDataSource()
      this.setDataSourceDelivered()
    },
    setDataSource () {
      // 添加合同产品
      const listProduct = []
      for (const productKey in this.record.product) {
        const product = this.record.product[productKey]
        listProduct.push({
          'id': product.id,
          'targetName': product.targetName,
          'productType': product.productType,
          'productStandard': product.contractProductPo.productModel,
          'company': product.company,
          'count': product.count
        })
      }
      this.dataSource = listProduct
      this.dataSourceUnshipped = JSON.parse(JSON.stringify(listProduct))
    },
    setDataSourceDelivered () {
      // 根据合同id添加已发产品
      // 根据发货单id获取已发货产品
      const parameter = { 'delayedPaymentId': this.value.id }
      getUnshipped(parameter).then((res) => {
        const listProductDelivered = []
        for (const productKey in res.data) {
          const product = res.data[productKey]
          listProductDelivered.push({
            'invoiceProductId': product.invoiceProductId,
            'targetName': product.targetName,
            'productType': product.productType,
            'productStandard': product.productStandard,
            'company': product.company,
            'count': product.count
          })
        }
        this.dataSourceDelivered = listProductDelivered
      }).then(() => {
        // Do something
        this.setUnshipped()
      }).catch(() => {
        // Do something
      }).finally(() => {
        // Do something
      })
    },
    // 计算未发货产品
    setUnshipped () {
      console.log(' this.dataSourceDelivered', this.dataSourceDelivered)
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
    // handler 表单数据验证成功后回调事件
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$set(values, 'id', this.value.id)
          this.$set(values, 'contractType', this.value.contractType)
          // 修改延迟发货单信息
          updateDelayedPayment(values).then((res) => {
            if (res.code === 200) {
              this.goBack()
            }
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    // 返回
    goBack () {
      this.$router.push({ name: 'delayedPayment' })
    },
    getContract () {
      // 根据合同id获取合同信息
      const parameter = { 'id': this.value.contractId }
      getContractById(parameter).then((res) => {
        this.record = res.data

        // 把获取到的合同信息放入表中
        this.info()
      }).catch(error => {
        console.error(error)
      })
    }
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

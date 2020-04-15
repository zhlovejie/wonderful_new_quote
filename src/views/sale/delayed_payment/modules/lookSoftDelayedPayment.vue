<template>
<a-spin :spinning="spinning">
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" v-if="show" @click="delayedApproval(2)" icon="check">通过</a-button>
      <a-button class="fl-r" type="primary" v-if="show" @click="delayedApproval(3)" icon="close">不通过</a-button>
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
    </div>
    <div>
      <a-row type="flex">
        <a-col :span="24" class="basic-tit" justify="center" align="middle">延迟付款单</a-col>
      </a-row>
      <a-form :form="form" class="form wdf-form">
        <a-form-item>
          <a-input type="text" hidden style="border: none;width: 60%;" v-decorator="['id',{}]"/>
          <a-input type="text" hidden style="border: none;width: 60%;" v-decorator="['instanceNum',{}]"/>
          <a-input type="text" hidden style="border: none;width: 60%;" v-decorator="['instanceId',{}]"/>
          <a-row type="flex">
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
          <a-row type="flex" >
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
              <a-input
                type="text"
                read-only="read-only"
                style="border: none;width: 60%;"
                v-decorator="['promiseTime',{}]"
              />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row type="flex" >
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款时间</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                style="border: none;width: 60%;"
                v-decorator="['delayedTime',{}]"
              />延迟天数：{{ CountTime }}
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
          <a-row type="flex" >
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
              <a-input
                type="text"
                style="border: none;width: 60%;"
                read-only="read-only"
                v-decorator="['delayedAmount',{rules: [{ required: true, message: '请输入延迟付款金额' }]}]"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row type="flex" >
            <a-col class="col-border" :span="3" justify="center" align="middle">币别</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input v-if="currency==1" value="人民币" style="height: 30px;border: none;" read-only="read-only" />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">欠款状态</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-input v-if="arrearsStatus==1" value="未结" style="height: 30px;border: none;" read-only="read-only" />
              <a-input v-if="arrearsStatus==2" value="已结" style="height: 30px;border: none;" read-only="read-only" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item :style="{borderBottom:'1px solid #ddd'}">
          <a-row type="flex" >
            <a-col class="col-border" :span="3" justify="center" align="middle">延迟付款原因</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-textarea
                type="text"
                read-only="read-only"
                style="border: none;width: 80%;resize:none;"
                v-decorator="['reason',{rules: [{ required: true, message: '请输入延迟付款原因' }]}]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">模版</a-col>
            <a-col class="col-border" :span="9" justify="center">
              <a-form-item>
                <a-select
                  placeholder="请选择模版"
                  :disabled="true"
                  style="border: none;width: 60%;"
                  v-decorator="['templateType', {rules: [{ required: true, message: '请选择模版' }]}]">
                  <a-select-option :value="1">欠款单</a-select-option>
                  <a-select-option :value="2">欠款单-简版</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item :style="{borderBottom:'1px solid #ddd',marginTop:'10px'}">
          <a-row type="flex" >
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
                v-decorator="['approveName',{}]"/>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">审批日期</a-col>
            <a-col class="col-border" :span="3" justify="center">
              <a-input
                type="text"
                read-only="read-only"
                placeholder="无需输入"
                style="border: none;width: 100%;"
                v-decorator="['approveTime',{}]"/>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
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
    </div>
  </div>
</a-spin>
</template>

<script>
import {
  getSoftContractById,
  auditDelayed,
} from '@/api/delayedPayment'
import moment from 'moment'
import ATextarea from 'ant-design-vue/es/input/TextArea'

export default {
  name: 'lookSoftDelayedPayment', // 查看
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
      confirmLoadingTwo: false,
      visibleTwo: false,
      hidden: false,
      memberLoading: false,
      dataSource: [], // 合同产品列表
      dataSourceDelivered: [], // 已发货产品列表
      dataSourceUnshipped: [], // 未发货产品列表
      currency: 0,
      arrearsStatus: 0,
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
      spinning:false
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
  mounted () {
    if (this.$route.params.type === 'Approval') {
      this.show = true
    }
    // 从列表行传过来的内容
    this.value = this.$route.params.record
    this.getContract()
  },
  methods: {
    info () {
      this.$nextTick(() => {
        this.form.setFieldsValue({ id: this.value.id })
        this.form.setFieldsValue({ instanceId: this.value.instanceId })
        this.form.setFieldsValue({ instanceNum: this.value.instanceNum })
        this.form.setFieldsValue({ delayedPaymentNum: this.value.delayedPaymentNum })
        this.form.setFieldsValue({ contractNum: this.record.contractNum })
        this.form.setFieldsValue({ customerName: this.record.saleCustomerName })
        this.form.setFieldsValue({ totalAmount: this.record.totalAmount })
        this.form.setFieldsValue({ paidAmount: this.record.returnedMoney })
        this.form.setFieldsValue({ delayedAmount: this.value.delayedAmount })
        this.form.setFieldsValue({ promiseTime: this.value.promiseTime })
        this.form.setFieldsValue({ delayedTime: this.value.delayedTime })
        this.currency = this.value.currency
        this.arrearsStatus = this.value.arrearsStatus
        this.form.setFieldsValue({ reason: this.value.reason })
        this.form.setFieldsValue({ createName: this.value.createName })
        this.form.setFieldsValue({ createTime: this.value.createTime })
        this.form.setFieldsValue({ approveName: this.value.approveName })
        this.form.setFieldsValue({ approveTime: this.value.approveTime })
        this.form.setFieldsValue({ templateType: this.value.templateType })
      })
    },
    delayedApproval (type) {
      let that = this
      if (type === 3) {
        this.hidden = false
        this.visibleTwo = true
      } else {
        that.spinning = true
        this.value.approvalStatus = type
        auditDelayed(this.value).then((res) => {
          that.spinning = false
          if (res.code === 200) {
            this.goBack()
          }
        }).catch(err =>{
           that.spinning = false
        })
      }
    },
    handleOk (e) {
      let that = this
      this.form.validateFields((err, values) => {
        that.confirmLoadingTwo = true
        values.approvalStatus = 3
        auditDelayed(values).then(res => {
          that.confirmLoadingTwo = false
          if (res.code == 200) {
            this.goBack()
          }
        }).catch(err => that.confirmLoadingTwo = false)
      })
    },
    handleCancelTwo (e) {
    },
    // 返回
    goBack () {
      this.$router.push({ name: 'delayedPayment' })
      this.$destroy('lookDelayedPayment')
    },
    getContract () {
      // 根据合同id获取合同信息
      const parameter = { 'id': this.value.contractId }
      getSoftContractById(parameter).then((res) => {
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

  .basic-vice-tit{
    padding: 10px 0;
  }
</style>

<template>
  <div>
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
    </div>
    <a-card class="card" :bordered="false">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item hidden>
              <a-input v-decorator="['contractId']" />
            </a-form-item>
            <a-form-item label="收款编号">
              <a-input
                read-only="read-only"
                placeholder="请输入收款编号"
                v-decorator="[
                  'receiptCode',
                  { rules: [{ required: true, message: '请输入收款编号', whitespace: true }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="合同编号">
              <a-input read-only="read-only" placeholder="请选择合同编号" v-decorator="['contractNum']" />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="客户名称">
              <a-input
                read-only="read-only"
                placeholder="请选择客户名称"
                v-decorator="[
                  'customerName',
                  { rules: [{ required: true, message: '请选择客户名称', whitespace: true }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item label="结算方式">
              <a-input read-only="read-only" v-decorator="['payTypeName']" />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="收款账号">
              <a-input
                read-only="read-only"
                disabled
                placeholder="请输入帐号"
                v-decorator="[
                  'payNumber',
                  { rules: [{ required: true, message: '请选择客户名称', whitespace: true }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
            <a-form-item label="收款日期">
              <a-input read-only="read-only" v-decorator="['receiptTime']" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-table :columns="softColumn" :dataSource="dataSource" :pagination="false" :loading="memberLoading" bordered>
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="currency" slot-scope="text, record, index">
          <span v-if="text == 1">人民币</span>
        </div>
      </a-table>
      <a-row>
        <a-col :span="24" class="basic-vice-tit" justify="center">
          备注
          <a-form-item>
            <a-input disabled placeholder="请输入备注信息" v-model="remark" />
          </a-form-item>
        </a-col>
      </a-row>
      <div class="wdf-xyk">
        <div class="xyk-div">
          <span>创建人:</span>
          <span>{{ createdName }}</span>
        </div>
        <div class="xyk-div">
          <span>创建日期:</span>
          <span>{{ createTime }}</span>
        </div>

        <div v-if="isApprove" class="xyk-div">
          <span>审批人:</span>
          <span>{{ approveName }}</span>
        </div>
        <div v-if="isApprove" class="xyk-div">
          <span>审批日期:</span>
          <span>{{ approveTime }}</span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import EditableCell from '@/components/Table/EditableCell'
import { receiptDetail } from '@/api/receipt'
import ReceiptSaleContract from './ReceiptSaleContract'
import AFormItem from 'ant-design-vue/es/form/FormItem'

const data = []
export default {
  name: 'ReceiptSoftwareVue',
  components: {
    AFormItem,
    ReceiptSaleContract,
    EditableCell,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      memberLoading: false,
      moneyTypes: [],
      loading: false,
      createdName: '',
      createTime: '',
      approveTime: '',
      approveName: '',
      isApprove: false,
      contractId: '',
      remark: '',
      info: '',
      softColumn: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
        },
        {
          title: '金额',
          dataIndex: 'countMoney',
        },
        {
          title: '已收金额(元)',
          dataIndex: 'receivable',
        },
        {
          title: '本次实收金额(元)',
          dataIndex: 'paidMoney',
          scopedSlots: { customRender: 'paidMoney' },
        },
        {
          title: '结算折扣金额(元)',
          dataIndex: 'settlementDiscount',
          scopedSlots: { customRender: 'settlementDiscount' },
        },
        {
          title: '币种',
          dataIndex: 'currency',
          scopedSlots: { customRender: 'currency' },
        },
        {
          title: '币率',
          dataIndex: 'currencyRate',
          scopedSlots: { customRender: 'currencyRate' },
        },
      ],
      dataSource: [],
      queryParam: [],
      // 加载数据方法 必须为 Promise 对象
    }
  },
  mounted() {
    this.init()
    //this.getContract()
  },
  methods: {
    // 编辑表格
    onCellChange(key, dataIndex, value) {
      console.log('onCellChange key dataIndex value', JSON.stringify(key), dataIndex, value)
      const dataSource = [...this.dataSource]
      const target = dataSource.find((item) => item.id === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    init() {
      receiptDetail({ id: this.$route.params.id }).then((res) => {
        console.log('res  ' + JSON.stringify(res))
        this.createdName = res.data.createName
        this.createTime = res.data.createTime
        this.contractId = res.data.contractId
        this.remark = res.data.remark
        if (res.data.receiptStatus > 1) {
          this.isApprove = true
          this.approveName = res.data.approveName
          this.approveTime = res.data.approveTime
        }
        const data = {
          receiptCode: res.data.receiptCode,
          contractNum: res.data.contractNum,
          customerName: res.data.saleCustomerName,
          payTypeName: res.data.payTypeName,
          payNumber: res.data.payNumber,
          receiptTime: res.data.receiptTime.substring(0, 10),
        }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...data })
        })
        this.dataSource = res.data.detailsList
      })
    },
    add(res) {
      // const data = {"receiptCode"}
    },
    openModel() {
      console.log('openModel click')
      this.$refs.receiptContract.query()
    },
    // 返回
    goBackPricing() {
      // 点击返回，返回核价单列表页
      this.$router.push({ name: 'receiptList', params: { queryParam: this.$route.params.queryParam } })
      this.$destroy('ReceiptVue')
    },
    writeAccountNum(record) {
      const data = { accountNum: record.bankNum }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
      })
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

.wdf-xyk {
  margin: 20px auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}

.xyk-div span:nth-child(2) {
  margin-left: 10px;
}
</style>

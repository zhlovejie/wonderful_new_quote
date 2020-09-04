<template>
  <div class="content-wrap">
    <div>
      <Invoice ref="customerList" @selected="handlerCustomerSelected" />
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">物流单</a-col>
      </a-row>
      <a-button type="primary" icon="plus" @click="addInvoice()">新增</a-button>
      <a-form :form="form" class="form wdf-form">
        <div v-for="(i ,index) in todayList" :key="index">
          <h3 style="font-weight: 700; ">
            发货单{{index+ 1}}
            <a-button
              style="margin-bottom:10px; float: right;"
              type="primary"
              @click="deleteItem(index)"
            >删除</a-button>
          </h3>

          <table class="custom-table custom-table-border">
            <tr>
              <td colspan="3">
                <b>提货信息</b>
              </td>
            </tr>
            <tr>
              <th>客户名称</th>
              <th>收货人</th>
              <th>电话</th>
            </tr>
            <tr>
              <td>{{i.customerName}}</td>
              <td>{{i.consignee}}</td>
              <td>{{i.contactInformation}}</td>
            </tr>
            <tr>
              <td colspan="3">
                <b>货物信息</b>
              </td>
            </tr>
            <tr>
              <th>名称</th>
              <th>数量</th>
              <th>体积</th>
            </tr>
            <tr v-for="(item ,index) in i.logisticsCargInformationList" :key="index">
              <td>{{item.productName}}</td>
              <td>{{item.invoiceCount}}</td>
              <td>
                <a-input placeholder v-model="item.volume" />
              </td>
            </tr>
          </table>
        </div>
        <h3 style="width:150px;   font-weight: 700;">备注</h3>
        <a-form-item>
          <a-textarea :rows="3" v-model="remarks" />
        </a-form-item>
        <a-form-item class="btns-grop">
          <a-button style="margin-left: 8px;" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { logisticsaddAndUpdte } from '@/api/distribution-management'
import moment from 'moment'
import Invoice from './Invoice'

export default {
  name: 'Step3',
  components: {
    Invoice,
  },
  props: {
    queryonedata: {
      type: Object,
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  data() {
    // const queryOneData = { ...this.queryonedata }
    return {
      id: '',
      todayList: [],
      indexs: '',
      remarks: '',
      form: this.$form.createForm(this),
    }
  },
  watch: {
    queryonedata: function (newVal, oldVal) {
      this.init()
    },
  },
  beforeMount() {
    // debugger
  },
  mounted() {},
  computed: {},
  methods: {
    // 弹出发货单
    addInvoice() {
      this.$refs.customerList.init()
    },
    //删除
    deleteItem(index) {
      console.log(this.todayList)
      this.todayList.splice(index, 1)
    },
    selectCustomer() {},

    // 接收发货单数据
    handlerCustomerSelected(record) {
      console.log(record)
      let obj = {}
      obj.address = record.address
      obj.customerName = record.customerName
      obj.consignee = record.consignee
      obj.contactInformation = record.contactInformation
      obj.saleInvoiceId = record.id
      let arr = record.products.map((red) => {
        return {
          volume: red.volume || '',
          productName: red.productName,
          invoiceCount: red.invoiceCount,
        }
      })
      obj.logisticsCargInformationList = arr
      this.todayList.push(obj)
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      let params = {}
      params.logisticsInvoices = this.todayList
      params.remarks = that.remarks
      params.id = that.queryonedata.id

      console.log(params)
      logisticsaddAndUpdte(params)
        .then((res) => {
          console.log('校验成功，保存填写的信息，请求后端接口结果', res)
          that.loading = false
          this.todayList = []
          that.$emit('nextStep', { ...res.data })
        })
        .catch((error) => {
          console.error(error)
        })
    },
    //点击上一步
    prevStep() {
      this.$emit('prevStep', this.queryonedata.id)
    },
    init() {
      if (this.queryonedata.logisticsInvoiceVos.length > 0) {
        this.todayList = this.queryonedata.logisticsInvoiceVos
        this.remarks = this.queryonedata.remarks
      }
    },
  },
}
</script>

<style lang="less" scoped>
.report-day-header h2 {
  text-align: center;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
  width: 30%;
}
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

.btns-grop {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
}

.btns-grop button:not(first-child) {
  margin-left: 12px;
}

.ant-row.ant-form-item {
  margin-bottom: 0;
}

.year-select {
  width: 100px;
  margin: 0 18px 0 8px;
}

.inner-col-div {
  float: left;
  width: 50%;
}

.checkbox-innerspan {
  margin: 0 10px 0 12px;
}

.mar-l0 {
  margin-left: 0;
}

.date {
  width: 120px;
}

.select-prop {
  width: 80px;
}

.row-in-col {
  padding: 16px 0 8px;
}

.item-select {
  display: inline-block;
}
</style>

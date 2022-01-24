<template>
  <div class="content-wrap">
    <div>
      <Invoice ref="customerList" @selected="handlerCustomerSelected" />
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">物流单</a-col>
      </a-row>
      <a-button v-if="!isSee" type="primary" icon="plus" @click="addInvoice()">新增</a-button>
      <a-form :form="form" class="form wdf-form">
        <div v-for="(i, index) in todayList" :key="index">
          <h3 style="font-weight: 700">
            发货单{{ index + 1 }}
            <a-button v-if="!isSee" style="margin-bottom: 10px; float: right" type="primary" @click="deleteItem(index)"
              >删除</a-button
            >
          </h3>

          <table class="custom-table custom-table-border">
            <tr>
              <td colspan="3" style="text-align: Left; border-top: none; border-left: none; border-right: none">
                <b>提货信息</b>
              </td>
            </tr>
            <tr>
              <th>客户名称</th>
              <th>收货人</th>
              <th>电话</th>
            </tr>
            <tr>
              <td>{{ i.customerName }}</td>
              <td>{{ i.consignee }}</td>
              <td>{{ i.contactInformation }}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: Left; border-left: none; border-right: none">
                <b>货物信息</b>
              </td>
            </tr>
            <tr>
              <th>名称</th>
              <th>数量</th>
              <th>方数</th>
            </tr>
            <tr v-for="(item, index) in i.logisticsCargInformationList" :key="index">
              <td>{{ item.productName }}</td>
              <td>{{ item.invoiceCount }}</td>
              <td>
                {{ item.squareNum }}
              </td>
            </tr>
          </table>
        </div>
        <h3 style="width: 150px; font-weight: 700">备注</h3>
        <a-form-item>
          <a-textarea :rows="3" v-model="remarks" :disabled="isSee" />
        </a-form-item>
        <a-form-item class="btns-grop">
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { logisticsaddAndUpdte, listMaterialInfoByCodes } from '@/api/distribution-management'
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
      queryonedata1: {},
      isSee: false,
      materList: [],
    }
  },
  watch: {
    queryonedata: function (newVal, oldVal) {
      this.queryonedata1 = val
    },
  },
  created() {
    this.queryonedata1 = this.queryonedata
  },
  mounted() {
    if (this.$parent.routeParams.typeName === 'see') {
      this.isSee = true
    }
    if (this.queryonedata1.logisticsInvoices) {
      this.todayList = this.queryonedata1.logisticsInvoices
      this.remarks = this.queryonedata1.remarks
    }
  },
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

    // 接收发货单数据
    handlerCustomerSelected(record) {
      console.log(record)
      let obj = {}
      obj.address = record.address
      obj.customerName = record.customerName
      obj.consignee = record.consignee
      obj.contactInformation = record.contactInformation
      obj.saleInvoiceId = record.id
      let react = record.products
        .map((i) => {
          return i.productModel
        })
        .toString()
      listMaterialInfoByCodes({ codes: react }).then((res) => {
        console.log(res)
        // this.materList = res.data
        this.materList = record.products.map((red) => {
          let react = res.data.find((i) => i.materialCode === red.productModel)
          return {
            volume: red.volume || '',
            productName: red.productName,
            invoiceCount: red.invoiceCount,
            materialCode: red.productModel,
            materialName: red.productName,
            squareNum: react.squareNum || '',
          }
        })
      })
      obj.logisticsCargInformationList = this.materList
      this.todayList.push(obj)
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      let params = {}
      params.logisticsInvoices = this.todayList
      params.remarks = that.remarks
      that.$emit('nextStep', params)
    },
    //点击上一步
    prevStep() {
      this.$emit('prevStep')
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

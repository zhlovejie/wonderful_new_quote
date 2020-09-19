<template>
  <div class="content-wrap">
    <CustomerList ref="customerList" @selected="handlerCustomerSelected" />
    <a-row>
      <a-col :span="24" class="basic-tit" justify="center" align="middle">产品信息</a-col>
    </a-row>
    <div class="form wdf-form">
      <template>
        <a-form :form="form" class="form wdf-form">
          <a-form-item>
            <a-row type="flex">
              <a-col class="col-border" :span="6" justify="center" align="middle"></a-col>
              <a-col class="col-border" :span="3" justify="right" align="middle">承运方</a-col>
              <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
                <a-form-item>
                  <a-input
                    style="width:60%;"
                    :disabled="isSee"
                    read-only
                    @click="handleCustomerClick"
                    v-decorator="['distributionStationId',{rules: [{required: true,message: '请选择承运方',},
             ]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-row type="flex">
              <a-col class="col-border" :span="6" justify="center" align="middle"></a-col>
              <a-col class="col-border" :span="3" justify="right" align="middle">车牌号</a-col>
              <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
                <a-form-item>
                  <a-input
                    :disabled="isSee"
                    style="width:60%;"
                    :precision="0"
                    v-decorator="['licensePlateNumber',{rules: [{required: true,message: '请输车牌号',},
             ]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-col class="col-border" :span="6" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="right" align="middle">车辆型号</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item>
                <a-select
                  :disabled="isSee"
                  placeholder="车辆型号"
                  :allowClear="true"
                  style="border: none;width: 60%;"
                  v-decorator="['vehicleType', {rules: [{required: true,message: '请选择车辆型号!',},
             ]}]"
                >
                  <a-select-option
                    v-for="item in settlement"
                    :key="item.id"
                    :value="item.id"
                  >{{item.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-form-item>
        </a-form>
      </template>
    </div>
    <div class="btns-grop">
      <a-button style="margin-left:8px;" @click="prevStep">上一步</a-button>
      <a-button type="primary" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { logisticsCarrier, getQueryOne } from '@/api/distribution-management'

import { getDictionaryList } from '@/api/workBox' // 数据字典
import CustomerList from './modify'

export default {
  name: 'Step2',
  components: { CustomerList },
  props: {
    queryonedata: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      settlement: [], //数据字典  车辆类型
      postSelectDataSource: [], //承运方
      customerName: '', //承运方名称
      customerId: '',
      queryonedata1: {},
      isSee: false,
    }
  },
  computed: {},
  watch: {
    $route(to, from) {},
    queryonedata: function (val) {
      // this.init()
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
    getDictionaryList({ parentId: 543 }).then((res) => {
      this.settlement = res.data
    })
    console.log(this.queryonedata1)
    if (this.queryonedata1.licensePlateNumber) {
      this.customerId = this.queryonedata1.distributionStationId
      this.form.setFieldsValue({
        distributionStationId: this.queryonedata1.logisticsCompanyName,
        licensePlateNumber: this.queryonedata1.licensePlateNumber,
        vehicleType: this.queryonedata1.vehicleType,
      })
    }
  },
  methods: {
    //打开承运方列表
    handleCustomerClick() {
      this.$refs.customerList.init()
    },
    //承运方组件返回值
    handlerCustomerSelected(record) {
      this.customerName = record.logisticsCompanyName
      this.customerId = record.id
      this.form.setFieldsValue({
        distributionStationId: record.logisticsCompanyName,
      })
    },
    // 上一步
    prevStep() {
      let that = this
      that.$emit('prevStep', this.queryonedata.id)
    },
    // 点击下一步
    async nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this
      validateFields((err, values) => {
        values.logisticsCompanyName = values.distributionStationId
        values.distributionStationId = that.customerId
        console.log(values)
        that.$emit('nextStep', values)
      })
    },

    finish() {
      this.currentTab = 0
    },
  },
}
</script>
<style>
.step-table-list .ant-form-item {
  margin-bottom: 0;
}
</style>



<style lang="less" scoped>
.wdf-row {
  border: 1px solid #ddd;
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
.col-mount {
  border: 1px solid #ddd;
  border-top: none;
  padding: 6px 16px;
}
.span-mount ~ .span-mount {
  margin-left: 16px;
}
.bigword {
  font-weight: bold;
}
</style>

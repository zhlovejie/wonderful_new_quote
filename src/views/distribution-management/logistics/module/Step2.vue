<template>
  <div class="content-wrap">
    <!-- <CustomerList ref="customerList" @selected="handlerCustomerSelected" /> -->
    <a-row>
      <a-col :span="24" class="basic-tit" justify="center" align="middle">产品信息</a-col>
    </a-row>
    <div class="form wdf-form">
      <template>
        <a-form :form="form" class="form wdf-form">
          <a-row type="flex">
            <a-col :span="6" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="right" align="middle">承运方</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item style="margin-bottom: 0; margin-top: 10px">
                <a-select
                  style="width: 60%"
                  :disabled="isSee"
                  @change="handleCustomerClick"
                  v-decorator="['carrierType', { rules: [{ required: true, message: '请选择承运方' }] }]"
                  placeholder="请选择承运方"
                >
                  <a-select-option :value="1">配货站</a-select-option>
                  <a-select-option :value="2">专车</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- station -->
          <a-row type="flex" v-if="logisticsShow">
            <a-col :span="6" justify="center" align="middle"></a-col>
            <a-col
              class="col-border"
              :style="{ borderBottom: '1px solid #ddd' }"
              :span="3"
              justify="right"
              align="middle"
              >配货站</a-col
            >
            <a-col
              class="col-border"
              :style="{ borderBottom: '1px solid #ddd' }"
              :span="9"
              type="flex"
              justify="left"
              align="middle"
            >
              <a-form-item style="margin-bottom: 0; margin-top: 10px">
                <a-select
                  :disabled="isSee"
                  placeholder="配货站"
                  :allowClear="true"
                  show-search
                  :filter-option="filterOption"
                  style="border: none; width: 60%"
                  v-decorator="['distributionStationId', { rules: [{ required: true, message: '请选择配货站!' }] }]"
                >
                  <a-select-option v-for="item in station" :key="item.id" :value="item.id">{{
                    item.logisticsCompanyName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="6" justify="center" align="middle"></a-col>
            <a-col class="col-border" :span="3" justify="right" align="middle">车牌号</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-form-item style="margin-bottom: 0; margin-top: 10px">
                <a-input
                  :disabled="isSee"
                  style="width: 60%"
                  :precision="0"
                  v-decorator="['licensePlateNumber', { rules: [{ required: true, message: '请输车牌号' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="6" justify="center" align="middle"></a-col>
            <a-col
              class="col-border"
              :style="{ borderBottom: '1px solid #ddd' }"
              :span="3"
              justify="right"
              align="middle"
              >车辆型号</a-col
            >
            <a-col
              class="col-border"
              :style="{ borderBottom: '1px solid #ddd' }"
              :span="9"
              type="flex"
              justify="left"
              align="middle"
            >
              <a-form-item style="margin-bottom: 0; margin-top: 10px">
                <a-select
                  :disabled="isSee"
                  placeholder="车辆型号"
                  :allowClear="true"
                  style="border: none; width: 60%"
                  v-decorator="['vehicleType', { rules: [{ required: true, message: '请选择车辆型号!' }] }]"
                >
                  <a-select-option v-for="item in settlement" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row style="margin-top: 30px">
            <a-col :span="24" class="basic-tit" justify="center" align="middle">搬运方</a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="6" justify="center" align="middle"></a-col>
            <a-col :span="12" justify="center" align="middle">
              <a-table v-if="this.isSee" :columns="columns" :data-source="dataSource" :pagination="false">
                <div slot="order" slot-scope="text, record, index">
                  <span>{{ index + 1 }}</span>
                </div>
              </a-table>
              <a-table
                v-else
                rowKey="userId"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                :columns="columns"
                :data-source="dataSource"
                :pagination="false"
              >
                <div slot="order" slot-scope="text, record, index">
                  <span>{{ index + 1 }}</span>
                </div>
              </a-table>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </div>
    <div class="btns-grop">
      <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
      <a-button type="primary" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { stationList, logisticsCarrier, getQueryOne } from '@/api/distribution-management'

import { getDictionaryList } from '@/api/workBox' // 数据字典
// import CustomerList from './modify'
import {
  getUserByStation, //获取岗位下人员
} from '@/api/systemSetting'

export default {
  name: 'Step2',
  // components: { CustomerList },
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
      station: [],
      selectedRowKeys: [], // Check here to configure the default column
      selectedRows: [],
      customerName: '', //承运方名称
      customerId: '',
      queryonedata1: {},
      isSee: false,
      logisticsShow: false,
      dataSource: [],
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          scopedSlots: { customRender: 'order' },
        },
        {
          align: 'center',
          title: '姓名',
          dataIndex: 'userName',
        },
      ],
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
    if (this.$parent.routeParams.typeName !== 'see') {
      getUserByStation({ stationId: 73 }).then(
        (res) =>
          (this.dataSource = res.data.map((i) => {
            return {
              userId: i.id,
              userName: i.trueName,
            }
          }))
      )
    }

    stationList().then((res) => {
      this.station = res.data
    })
    console.log(this.queryonedata1)
    if (this.queryonedata1.licensePlateNumber) {
      if (this.isSee) {
        this.dataSource = this.queryonedata1.logisticsInformationCarryUsers
      }
      let resct = []
      this.selectedRows = this.queryonedata1.logisticsInformationCarryUsers
      this.queryonedata1.logisticsInformationCarryUsers.map((i) => {
        resct.push(Number(i.userId))
      })
      this.selectedRowKeys = resct
      this.logisticsShow = this.queryonedata1.carrierType === 1 ? true : false
      // this.customerId = this.queryonedata1.distributionStationId
      this.form.setFieldsValue({
        carrierType: this.queryonedata1.carrierType,
        licensePlateNumber: this.queryonedata1.licensePlateNumber,
        vehicleType: this.queryonedata1.vehicleType,
        // distributionStationId: this.queryonedata1.distributionStationId,
      })
    }
  },
  methods: {
    handleCustomerClick(e) {
      console.log(e)
      this.logisticsShow = e === 1 ? true : false
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
        // values.distributionStationId = values.distributionStationId
        let params = { ...values }
        params.logisticsInformationCarryUsers = this.selectedRows

        that.$emit('nextStep', params)
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
  // border: 1px solid #ddd;
}
.col-border {
  border: 1px solid #ddd;
  padding: 10px 0;
  border-bottom: none;
  line-height: 60px;
  min-height: 60px;
  box-sizing: border-box;
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

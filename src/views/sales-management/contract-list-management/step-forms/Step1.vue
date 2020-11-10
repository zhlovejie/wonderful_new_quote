<template>
  <div class="content-wrap">
    <!-- <div class="sales-management-action-wrapper" style="text-align:right;">
      <a-button type="primary" @click="goBackAction" icon="save">保存</a-button>
    </div> -->
    <CustomerList ref="customerList" @selected="handlerCustomerSelected" />
    <div>
      <a-row type="flex">
        <a-col :span="24" class="basic-tit" justify="center" align="middle">基本信息</a-col>
      </a-row>
      <a-form :form="form" @submit="handleSubmit" class="form wdf-form">
        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">合同编号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input
                  type="text"
                  style="border: none; width: 60%"
                  v-decorator="['contractNum', { rules: [{ required: false, message: '请' }] }]"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">客户名称</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <!-- 修改和拆分合同不允许修改 是否全款选项 ，会影响后边合同的操作 -->
                <a-input
                  class="a-input"
                  style="width: 260px; cursor: pointer"
                  title="选择客户名称"
                  read-only
                  placeholder="选择客户名称"
                  :disabled="this.$parent.routeParams.action !== 'add'"
                  @click="handleCustomerClick"
                  v-decorator="['customerName', { rules: [{ required: true, message: '选择客户名称' }] }]"
                />

                <a-input style="display: none" v-decorator="['customerId']" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">是否含税</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                @change="selectedTax"
                :disabled="this.$parent.routeParams.action === 'split' || this.$parent.routeParams.action === 'see'"
                v-decorator="['isTax', { initialValue: 1 }]"
              >
                <a-radio :value="1"> 含税（销售合同） </a-radio>
                <a-radio :value="0"> 不含税（产品订货单） </a-radio>
              </a-radio-group>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票类型</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                @change="selectedBillingType"
                v-decorator="['billingType', { initialValue: 1 }]"
                :disabled="disabled"
              >
                <a-radio :value="1"> 增票 </a-radio>
                <a-radio :value="0"> 普票 </a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">销售人员</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-select
                  optionFilterProp="children"
                  :disabled="this.$parent.routeParams.action === 'see'"
                  showSearch
                  :allowClear="true"
                  :filterOption="filterSalersOption"
                  v-decorator="[
                    'saleUserId',
                    { rules: [{ required: true, message: '请选择销售人员', pattern: /^[1-9]\d*$/ }] },
                  ]"
                  placeholder="请选择销售人员"
                  @change="saleSelectChange"
                  style="width: 60%"
                >
                  <a-select-option :value="0">请选择销售人员</a-select-option>
                  <a-select-option v-for="item in saleUser" :value="item.userId" :key="item.userId">{{
                    item.salesmanName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">签订日期</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-date-picker
                  :disabled="this.$parent.routeParams.action === 'see'"
                  style="width: 260px"
                  format="YYYY-MM-DD"
                  :disabledTime="disabledDateTime"
                  v-decorator="[
                    'signDate',
                    { rules: [{ required: true, message: '请选择签订日期！' }], initialValue: signDate },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">是否使用我方平台</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                @change="isUsingPlatform"
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="['usingPlatform', { initialValue: 0 }]"
              >
                <a-radio :value="0"> 是 </a-radio>
                <a-radio :value="1"> 否 </a-radio>
              </a-radio-group>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">合同属性</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                @change="isContractAttribute"
                :disabled="this.$parent.routeParams.action === 'split' || this.$parent.routeParams.action === 'see'"
                v-decorator="['contractAttribute', { initialValue: 0 }]"
              >
                <a-radio :value="0"> 我方合同 </a-radio>
                <a-radio :value="1"> 三方合同 </a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">是否付全款</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <!-- 修改和拆分合同不允许修改 是否全款选项 ，会影响后边合同的操作 -->
              <a-radio-group
                :disabled="this.$parent.routeParams.action !== 'add'"
                @change="isFullAmount"
                v-decorator="['fullAmount', { initialValue: 0 }]"
              >
                <a-radio :value="0"> 是 </a-radio>
                <a-radio :value="1"> 否 </a-radio>
              </a-radio-group>
            </a-col>

            <a-col class="col-border" :span="3" justify="center" align="middle"> 合同类别 </a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-radio-group
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="['bucketType', { initialValue: 1 }]"
              >
                <a-radio :value="1">智能桶合同</a-radio>
                <a-radio :value="2">常规桶合同</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-col class="col-border" :span="3" justify="center" align="middle">运费类型</a-col>
          <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
            <a-radio-group
              @change="freightTypeChange"
              :disabled="this.$parent.routeParams.action === 'see'"
              v-decorator="['freightType', { initialValue: 0 }]"
            >
              <a-radio :value="0"> 含运费 </a-radio>
              <a-radio :value="1"> 不含运费 </a-radio>
            </a-radio-group>
          </a-col>
          <a-col class="col-border" :span="3" justify="center" align="middle"></a-col>
          <a-col class="col-border" :span="9" type="flex" justify="left" align="middle"></a-col>
        </a-form-item>

        <a-form-item :style="{ borderBottom: '1px solid #ddd' }">
          <a-row type="flex" v-if="parseInt(freightType) === 0">
            <a-col class="col-border" :span="3" justify="center" align="middle">运费(元)</a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-input-number
                :disabled="this.$parent.routeParams.action === 'see'"
                style="width: 60%"
                :min="0"
                :step="1"
                :precision="0"
                placeholder="运费"
                v-decorator="['freightCharge']"
              />
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle"> 运费分配类型 </a-col>
            <a-col class="col-border" :span="9" type="flex" justify="left" align="middle">
              <a-radio-group
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="['freightDivType', { initialValue: 2 }]"
              >
                <a-radio :value="1">单价</a-radio>
                <a-radio :value="2">金额</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <div style="margin: 16px auto 0; width: 100px">
            <a-button type="primary" @click="nextStep">下一步</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import {
  getcusSelectsList,
  getListSaleContractUser,
  saveEssentialInformation,
  deleteQueryOne,
} from '@/api/contractListManagement'

import moment from 'moment'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import CustomerList from '@/components/CustomerList/CustomerList'
export default {
  name: 'Step1',
  components: { AFormItem, CustomerList },
  props: {
    queryonedata: {
      type: Object,
    },
  },
  data() {
    return {
      // form
      form: this.$form.createForm(this),
      contractNum: this.queryonedata.contractNum, // 合同编号
      saleCustomers: {}, // 客户名称数组
      customerId: 0, // 客户id
      customerName: '',
      saleUser: {}, // 销售经理名称列表
      saleUserId: 0, // 选中的销售经理id
      signDate: moment(), // 签订日期, 默认今天
      disabled: false, // 是否含税启用/禁用
      loading: false,
      timer: 0,
      disabledDateTime: function () {},
      id: 0,
      freightType: 0,
    }
  },
  computed: {},
  watch: {
    $route(to, from) {
      console.log('watch $route called...')
    },
    queryonedata() {
      console.log('from watch queryonedata....')
      this.init()
    },
  },
  created() {},
  mounted() {
    console.log('from mounted....')
    this.init()
  },
  methods: {
    async init() {
      await Promise.all[this.getSalesList()]
      this.$nextTick(() => {
        let qt = this.queryonedata
        if (qt.id && qt.id > 0) {
          this.freightType = qt.freightType
          this.form.setFieldsValue({
            id: qt.id,
            contractNum: qt.contractNum,
            customerId: qt.customerId,
            isTax: qt.isTax,
            billingType: qt.billingType,
            saleUserId: qt.saleUserId,
            signDate: moment(qt.signDate) || moment(),
            usingPlatform: qt.usingPlatform,
            contractAttribute: qt.contractAttribute,
            fullAmount: qt.fullAmount,
            customerName: qt.customerName || qt.saleCustomerName,
            freightType: qt.freightType,
            freightCharge: qt.freightCharge || 0,
            bucketType: qt.bucketType || 1,
            freightDivType: qt.freightDivType || 1,
          })
          //不含税 禁用 开票类型
          this.disabled = qt.isTax === 0 ? true : false
        }
      })
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    // 选择销售经理名称下拉框根据输入项进行筛选
    filterSalersOption(input, option) {
      // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // option.componentOptions.children[0].text
    },
    // 点击下一步
    nextStep(status) {
      const that = this
      const {
        form: { validateFields },
      } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          //debugger
          const params = {
            id: that.queryonedata.id,
            contractNum: that.queryonedata.contractNum,
            customerId: values.customerId,
            customerName: values.customerName,
            saleUserId: values.saleUserId,
            isTax: values.isTax,
            billingType: values.billingType,
            signDate: values.signDate.format('YYYY-MM-DD'), // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
            usingPlatform: values.usingPlatform,
            contractAttribute: values.contractAttribute,
            fullAmount: values.fullAmount,
            freightType: values.freightType,
            freightCharge: values.freightCharge,
            bucketType: values.bucketType,
            freightDivType: values.freightDivType,
          }

          if (that.$parent.routeParams.action === 'add') {
            console.log('新增模式 添加参数 contractModifyFlag：0')
            params.contractModifyFlag = 0
          } else if (that.$parent.routeParams.action === 'edit') {
            console.log('修改模式 添加参数 contractModifyFlag：1')
            params.contractModifyFlag = 1
          } else if (that.$parent.routeParams.action === 'split') {
            console.log('拆分模式 添加参数 contractModifyFlag：1')
            params.contractModifyFlag = 1
          }
          //console.log(this.$parent.fromAction)

          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveEssentialInformation(params)
            .then((res) => {
              console.log('校验成功，保存填写的信息，请求后端接口结果', res)
              that.id = res.data.id
              that.loading = false
              that.form.setFieldsValue({
                contractNum: res.data.contractNum,
              })
              if (status != 1) {
                that.$emit('nextStep', { ...res.data })
              } else {
                that.$message.success('保存成功')
                that.queryonedata.id = res.data.id
                that.form.setFieldsValue({
                  id: res.data.id,
                })
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
    },
    finish() {
      this.currentTab = 0
    },
    // 注销Step组件之前清除定时器
    beforeDestroy() {
      clearTimeout(0)
    },
    handlerCustomerSelected(record) {
      console.log(record)
      this.customerName = record.name
      this.customerId = record.id
      this.form.setFieldsValue({
        customerName: record.name,
        customerId: record.id,
      })
    },
    handleCustomerClick() {
      //debugger
      if (!this.saleUserId) {
        this.$message.info('请选择销售人员后，再选择客户')
        return
      }
      this.$refs.customerList.init({ userId: this.saleUserId })
    },
    // 获取所有销售经理经理和区域经理
    getSalesList(params = {}) {
      params = {
        name: '', // 销售经理经理和区域经理名字智能搜索
      }
      return getListSaleContractUser(params)
        .then((res) => {
          console.log('销售经理经理和区域经理', res)
          this.saleUser = res.data
          this.trueName = res.data.salesmanName
          this.saleUserId = res.data.userId
          return res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // 选择销售人员
    saleSelectChange(e) {
      this.saleUserId = e
      this.customerName = undefined
      this.customerId = undefined
      this.form.setFieldsValue({
        customerName: undefined,
        customerId: undefined,
      })
      console.log('选择销售人员', this.saleUserId)
    },
    // 是否含税选中
    selectedTax(e) {
      this.isTax = e.target.value
      console.log('//选择是否含税选中', e.target.value)
      if (this.isTax === 0) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    // 普票、增票
    selectedBillingType(e) {
      this.billingType = e.target.value
      console.log('//选择普票、增票', e.target.value)
    },
    // 是否使用我方平台
    isUsingPlatform(e) {
      this.usingPlatform = e.target.value
      console.log('//选择是否使用我方平台', e.target.value)
    },
    // 是否使用我方合同
    isContractAttribute(e) {
      this.contractAttribute = e.target.value
      console.log('//选择是否使用我方合同', e.target.value)
    },
    // 是否全款
    isFullAmount(e) {
      this.fullAmount = e.target.value
      console.log('//选择是否全款', e.target.value)
    },
    disabledDate(current) {
      // 后三十天内可选
      return current < moment().subtract(11, 'days') || current > moment().add(10, 'd')
    },
    freightTypeChange(e) {
      //debugger
      this.freightType = parseInt(e.target.value)
    },
  },
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

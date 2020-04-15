<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
    </div>
    <div>
      <a-row type="flex">
        <a-col :span="24" class="basic-tit" justify="center" align="middle">基本信息</a-col>
      </a-row>
      <a-form
        :form="form"
        @submit="handleSubmit"
        class="form wdf-form"
      >

        <a-form-item>
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">合同编号</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-input type="text" style="border: none;width: 60%;" v-decorator="['contractNum',{rules: [{ required: false, message: '请' }]}]" disabled/>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">客户名称</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-select
                  showSearch
                  optionFilterProp="children"
                  :filterOption="filterSalersOption"
                  v-decorator="['customerId',{rules: [{ required: true, message: '选择客户名称',pattern:/^[1-9]\d*$/}]}]"
                  placeholder="请选择客户名称"
                  @change="customerSelectChange"
                  style="width: 60%"
                >
                  <a-select-option :value="0">请选择客户名称</a-select-option>
                  <a-select-option v-for="item in saleCustomers" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item
        >
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">是否含税</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group @change="selectedTax" v-decorator="['isTax',{initialValue: 1}]">
                <a-radio :value="1">
                  含税（销售合同）
                </a-radio>
                <a-radio :value="0">
                  不含税（产品订货单）
                </a-radio>
              </a-radio-group>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">开票类型</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group
                @change="selectedBillingType"
                v-decorator="['billingType',{initialValue: 1}]"
                :disabled="disabled">
                <a-radio :value="1">
                  增票
                </a-radio>
                <a-radio :value="0">
                  普票
                </a-radio>
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
                  :filterOption="filterSalersOption"
                  v-decorator="[
                    'saleUserId',
                    {rules: [{ required: true, message: '请选择销售人员',pattern:/^[1-9]\d*$/}]}
                  ]"
                  placeholder="请选择销售人员"
                  @change="saleSelectChange"
                  style="width: 60%"
                >
                  <a-select-option :value="0">请选择销售人员</a-select-option>
                  <a-select-option v-for="item in saleUser" :key="item.id" >{{ item.trueName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">签订日期</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-form-item>
                <a-date-picker
                  format="YYYY-MM-DD"
                  :disabledTime="disabledDateTime"
                  v-decorator="['signDate', {rules: [{required: true, message: '请选择签订日期！'}],initialValue:signDate}]" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item
        >
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">是否使用我方平台</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group @change="isUsingPlatform" v-decorator="['usingPlatform',{initialValue: 0}]">
                <a-radio :value="0">
                  是
                </a-radio>
                <a-radio :value="1">
                  否
                </a-radio>
              </a-radio-group>
            </a-col>
            <a-col class="col-border" :span="3" justify="center" align="middle">合同属性</a-col>
            <a-col class="col-border" :span="9" justify="center" align="middle">
              <a-radio-group @change="isContractAttribute" v-decorator="['contractAttribute',{initialValue: 0}]">
                <a-radio :value="0">
                  我方合同
                </a-radio>
                <a-radio :value="1">
                  三方合同
                </a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item :style="{borderBottom:'1px solid #ddd'}">
          <a-row type="flex">
            <a-col class="col-border" :span="3" justify="center" align="middle">是否付全款</a-col>
            <a-col class="col-border" :span="21" type="flex" justify="left" align="middle">
              <a-radio-group @change="isFullAmount" v-decorator="['fullAmount',{initialValue: 0}]">
                <a-radio :value="0">
                  是
                </a-radio>
                <a-radio :value="1">
                  否
                </a-radio>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <div style="margin: 16px auto 0;width: 100px;">
            <a-button type="primary" @click="nextStep">下一步</a-button>
          </div>
        </a-form-item>

      </a-form>

    </div>
  </div>
</template>

<script>
import { getcusSelectsList, getListSaleContractUser, saveEssentialInformation, deleteQueryOne } from '../../../../api/contractListManagement'
import { getQueryOne } from '../../../../api/contractListManagement'
import moment from 'moment'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'Step1',
  components: { AFormItem },
  props: {
    queryonedata: {
      type: Object
    }
  },
  data () {
    return {
      // form
      form: this.$form.createForm(this),
      contractNum: this.queryonedata.contractNum, // 合同编号
      saleCustomers: {}, // 客户名称数组
      customerId: 0, // 客户id
      saleUser: {}, // 销售经理名称列表
      saleUserId: 0, // 选中的销售经理id
      signDate: moment(), // 签订日期, 默认今天
      disabled: false, // 是否含税启用/禁用
      loading: false,
      timer: 0,
      disabledDateTime: function () {},
      id: 0
    }
  },
  computed: {},
  watch: {
    $route (to, from) {
      if (from.fullPath === '/sales-management/contract-list-management/basicInformation1') {
      }
    },
    queryonedata(){
      this.init()
    }
  },
  created () {},
  mounted () {
    this.init()
    // this.queryonedata.id = this.$route.params.id;
    // this.id = this.$route.params.id;
    // this.init()
    // this.form.setFieldsValue({
    //   id: this.queryonedata.id || 0,
    //   contractNum: this.queryonedata.contractNum || '',
    //   customerId: this.queryonedata.customerId || 0,
    //   isTax: this.queryonedata.isTax || 1,
    //   billingType: this.queryonedata.billingType || 1,
    //   saleUserId: this.queryonedata.saleUserId || 0,
    //   signDate: moment(this.queryonedata.signDate) || moment(),
    //   usingPlatform: this.queryonedata.usingPlatform || 0,
    //   contractAttribute: this.queryonedata.contractAttribute || 0,
    //   fullAmount: this.queryonedata.fullAmount || 0
    // })

  },
  methods: {
    async init () {
      await this.getCustomerList()
      await this.getSalesList()
      this.form.setFieldsValue({
        id: this.queryonedata.id || 0,
        contractNum: this.queryonedata.contractNum || '',
        customerId: this.queryonedata.customerId || 0,
        isTax: this.queryonedata.isTax || 1,
        billingType: this.queryonedata.billingType || 1,
        saleUserId: this.queryonedata.saleUserId || 0,
        signDate: moment(this.queryonedata.signDate) || moment(),
        usingPlatform: this.queryonedata.usingPlatform || 0,
        contractAttribute: this.queryonedata.contractAttribute || 0,
        fullAmount: this.queryonedata.fullAmount || 0
      })

    },
    // 返回
    goBack () {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确定要放弃本条合同的创建吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk () {
          // debugger
          try {
            _this.$ls.remove('products')
          } catch (err) {}
          // 在这里调用删除接口
          if (_this.queryonedata.id === undefined) {
            _this.$router.push({ name: 'distributionContractList' })
            _this.form.setFieldsValue({
              contractNum: '',
              customerId: 0,
              saleUserId: 0,
              isTax: 1,
              billingType: 1,
              signDate: moment(),
              usingPlatform: 0,
              contractAttribute: 0,
              fullAmount: 0
            })
          } else {
            const params = { id: _this.queryonedata.id }
            deleteQueryOne(params).then((res) => {
              if (res.code == 200) {
                _this.$message.info('删除合同编辑成功')
                _this.$router.push({ name: 'distributionContractList' })
              } else {
                _this.$message.error(res.msg)
              }
            })
          }
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    // 选择销售经理名称下拉框根据输入项进行筛选
    filterSalersOption (input, option) { // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // option.componentOptions.children[0].text
    },
    // 点击下一步
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      console.log('{ form: { validateFields } } = this', this)
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log('先校验，通过表单校验后，才进入下一步', values)
        if (!err) {
          const params = {
            id: that.queryonedata.id,
            contractNum: that.queryonedata.contractNum,
            customerId: values.customerId,
            saleUserId: values.saleUserId,
            isTax: values.isTax,
            billingType: values.billingType,
            signDate: values.signDate.format('YYYY-MM-DD'), // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
            usingPlatform: values.usingPlatform,
            contractAttribute: values.contractAttribute,
            fullAmount: values.fullAmount
          }
          // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
          saveEssentialInformation(params).then((res) => {
            console.log('校验成功，保存填写的信息，请求后端接口结果', res)
            that.id = res.data.id
            that.loading = false
            that.form.setFieldsValue({
              contractNum: res.data.contractNum
            })
            that.$emit('nextStep', { ...res.data })
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    finish () {
      this.currentTab = 0
    },
    // 注销Step组件之前清除定时器
    beforeDestroy () {
      clearTimeout(0)
    },
    // 获取客户信息下拉
    getCustomerList (params = {}) {
      params = {
        // name:this.selectedCustomer || '',    //客户名字智能搜索
        name: '' // 客户名字智能搜索
      }
      return getcusSelectsList(params).then((res) => {
        console.log('客户信息下拉', res)
        this.saleCustomers = res.data
        this.consumerNam = res.data.name
        this.consumerId = res.data.id

        return res.data
      }).catch(error => {
        console.error(error)
      })
    },
    // 获取所有销售经理经理和区域经理
    getSalesList (params = {}) {
      params = {
        name: '' // 销售经理经理和区域经理名字智能搜索
      }
      return getListSaleContractUser(params).then((res) => {
        console.log('销售经理经理和区域经理', res)
        this.saleUser = res.data
        this.trueName = res.data.trueName
        this.saleUserId = res.data.id

        return res.data
      }).catch(error => {
        console.error(error)
      })
    },
    // 选择客户名称
    customerSelectChange (e) {
      this.customerId = e
      console.log('选择客户名称', this.customerId)
    },
    // 选择销售人员
    saleSelectChange (e) {
      this.saleUserId = e
      console.log('选择销售人员', this.saleUserId)
    },
    // 是否含税选中
    selectedTax (e) {
      this.isTax = e.target.value
      console.log('//选择是否含税选中', e.target.value)
      if (this.isTax === 0) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    // 普票、增票
    selectedBillingType (e) {
      this.billingType = e.target.value
      console.log('//选择普票、增票', e.target.value)
    },
    // 是否使用我方平台
    isUsingPlatform (e) {
      this.usingPlatform = e.target.value
      console.log('//选择是否使用我方平台', e.target.value)
    },
    // 是否使用我方合同
    isContractAttribute (e) {
      this.contractAttribute = e.target.value
      console.log('//选择是否使用我方合同', e.target.value)
    },
    // 是否全款
    isFullAmount (e) {
      this.fullAmount = e.target.value
      console.log('//选择是否全款', e.target.value)
    },
    disabledDate (current) {
      // 后三十天内可选
      return current < moment().subtract(11, 'days') || current > moment().add(10, 'd')
    }

  }
}
</script>

<style lang="less" scoped>
  .wdf-row{
    border: 1px solid #ddd;
  }
  .col-border{
    border: 1px solid #ddd;
    padding: 10px 0;
    border-bottom: none;
    min-height: 60px;
    box-sizing: border-box;
  }
  .col-border~.col-border{
    border-left: none;
  }
  .wdf-form{
    margin-top: 12px;
    padding: 12px;
  }
  .ant-row.ant-form-item{
    margin-bottom: 0;
  }
</style>

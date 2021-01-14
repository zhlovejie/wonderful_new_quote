<template>
  <a-spin :spinning="spinning">
    <div class="content">
      <div class="content-wrap">
        <div class="top-ation clearfix">
          <div class="table-operator fl-r">
            <a-button class="fl-r" type="primary" @click="submit" :loading="loading" icon="check">保存</a-button>
            <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
          </div>
        </div>
        <div class="content-inner">
          <div class="inner-title">收据</div>
          <div class="inner-topr">
            NO.
            <span>{{ receiptNum }}</span>
          </div>
          <div>
            <a-form :form="form" @submit="handleSubmit">
              <a-form-item class="form-row clearfix" hidden style="margin-bottom: 0px;">
                <a-input
                  hidden
                  style="height: 30px;border: none;"
                  v-decorator="['receiptCode', {}]"
                />
              </a-form-item>
              <a-form-item class="form-row clearfix" hidden style="margin-bottom: 0px;">
                <a-input
                  hidden
                  style="height: 30px;border: none;"
                  v-decorator="['customerId', {}]"
                />
              </a-form-item>

              <a-form-item class="div-date">
                <span>入账日期：</span>
                <a-date-picker
                  v-decorator="['entryTime', {rules: [{required: true, message: '请选择入账日期！'}],initialValue:entryTime}]"
                />
              </a-form-item>
              <div class="form-container">
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
                  <div class="row-item wid-15">交款单位</div>
                  <div class="row-item wid-85" style="padding: 6px 10px;">
                    <a-form-item style="margin-bottom: 0px;">
                      <a-input v-if="isCompany"
                        style="height: 30px;border: none;"
                        read-only="read-only"
                        v-decorator="['customerName', {rules: [{required: true, message: '请选择交款单位！'}]}]"
                        @click="openModel"
                      />

                      <a-input v-if="!isCompany"
                        style="height: 30px;border: none;"
                        v-decorator="['customerName', {rules: [{required: true, message: '请输入交款单位！'}]}]"
                      />
                    </a-form-item>
                  </div>
                </a-form-item>
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
                  <div class="row-item wid-15" style="font-weight: bold;">￥</div>
                  <div class="row-item wid-35" style="text-align: left;">
                    <a-tooltip
                      :trigger="['focus']"
                      placement="topLeft"
                      overlayClassName="numeric-input"
                    >
                      <span
                        slot="title"
                        v-if="value"
                        class="numeric-input-title"
                      >{{ value !== '-' ? formatNumber(value) : '-' }}</span>
                      <template slot="title" v-else>请输入数字金额</template>
                      <a-form-item style="margin-bottom: 0px;">
                        <a-input
                          @change="onChange"
                          @blur="onBlur"
                          @pressEnter="numpressEnter"
                          placeholder="请输入数字金额"
                          style="width: 140px;border: none;"
                          v-decorator="['money', {rules: [{required: true,max: 25, message: '请输入金额！'}]}]"
                        />
                      </a-form-item>
                    </a-tooltip>
                  </div>
                  <div class="row-item wid-15">人民币(大写)</div>
                  <div class="row-item wid-35">
                    <a-input
                      style="border: none;"
                      read-only="read-only"
                      placeholder="输入数字金额后，按回车键，自动转换成大写"
                      v-decorator="['capitalRenminbi', {}]"
                    />
                  </div>
                </a-form-item>
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
                  <div class="row-item wid-15">收款事由</div>
                  <div class="row-item wid-85">
                    <a-form-item style="margin-bottom: 0px;">
                      <a-textarea
                        style="border: none;"
                        v-decorator="['remarks', {rules: [{required: true, message: '请输入收款事由！'}]}]"
                      ></a-textarea>
                    </a-form-item>
                  </div>
                </a-form-item>
                <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
                  <div class="row-item wid-15">是否显示日期</div>
                  <div class="row-item wid-85">
                    <a-radio-group
                      name="radioGroup"
                      @change="dateisOptional"
                      v-decorator="['isOptional', {initialValue: 1}]"
                    >
                      <a-radio :value="0">是</a-radio>
                      <a-radio :value="1">否</a-radio>
                    </a-radio-group>
                    <div class="fl-r">
                      <a-date-picker
                        v-if="isOptional===0"
                        v-decorator="['optionalTime', {initialValue:entryTime}]"
                      />
                    </div>
                  </div>
                </a-form-item>
              </div>
              <div class="form-footer">
                <div class="stamp" style="position: relative;">
                  单位盖章：
                  <img
                    :src="financialChop"
                    alt="财务章"
                    style="width: 150px;
    height: 150px;
    position: absolute;
    top: -165%;"
                  />
                </div>
                <div class="crew">
                  <div class="span-item" :value="userInfo.trueName">出纳：{{ userInfo.trueName }}</div>
                  <div class="span-item wdf-handle">
                    <div class="min-wid">经办：</div>
                    <a-form-item style="margin-bottom: 0px;">
                      <a-select
                        style="width: 300px"
                        mode="multiple"
                        @change="handleChange"
                        placeholder="请选择经办"
                        v-decorator="['transactor',{rules: [{required: true, message: '请选择经办！'}]}]"
                      >
                        <a-select-option
                          v-for="i in transactors"
                          :key="i.userId"
                        >{{ i.salesmanName }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </div>
              </div>
            </a-form>
          </div>
        </div>
      </div>
      <!--获取交款单位弹出层-->
      <receipt-sale ref="receiptSale" @custom-change="contractChange"></receipt-sale>
    </div>
  </a-spin>
</template>

<script>
import { saveReceipt, getReceiptCode, getRmb, getContractById, listSaleUser, getByCode } from '@api/electronicReceipt'
import { getLoginUser } from '@api/systemSetting'
import moment from 'moment'
import ReceiptSale from './modules/ReceiptSale'
import AFormItem from 'ant-design-vue/es/form/FormItem'

// 请输入数字金额
function formatNumber(value) {
  value += ''
  const list = value.split('.')
  const prefix = list[0].charAt(0) === '-' ? '-' : ''
  let num = prefix ? list[0].slice(1) : list[0]
  let result = ''
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`
}

export default {
  name: 'AddReceipt',
  components: {
    AFormItem,
    ReceiptSale
  },
  props: {},
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      entryTime: moment(), // 入账日期, 默认今天
      receiptNum: '', // 收据编号
      receiptCode: '', // 收据编号
      value: '', // 输入的数字金额
      initialValue: 1, // 是否显示日期
      isOptional: 1,
      customerName: '',
      userInfo: {},
      transactors: [],
      transactor: '',
      spinning: false,
      financialChop: '' // 财务章图片路径
    }
  },
  computed: {
    isCompany:function(){
      let params = this.$route.params || {}
      return params.actionType === 1 ? true : false
    }
  },
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.receiptCodeNum()
      this.getListSaleUser()
      this.getfinancialChop()

      console.log('isCompany',this.isCompany)
    },

    // 获取财务章
    getfinancialChop() {
      const params = { code: this.isCompany ? 'CWZYZ' : 'CWBYZ' }
      getByCode(params)
        .then(res => {
          console.log('获取财务章结果', res)
          this.financialChop = res.data.sealUrl
        })
        .catch(errorr => {
          console.error(error)
        })
    },
    // 获取收据单编号
    receiptCodeNum() {
      var _this = this
      getReceiptCode()
        .then(res => {
          console.log('获取收据单编号的结果', res)
          this.receiptNum = res.data
          this.$nextTick(() => {
            this.form.setFieldsValue({ receiptCode: res.data })
          })
        })
        .catch(errorr => {
          console.error(error)
        })
      // 获取当前登录用户信息
      getLoginUser().then(res => {
        this.userInfo = res.data
        console.log('this.$store.getters.userInfo', this.userInfo)
      })
    },
    // 最终全页面提交
    submit() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          _this.$set(values, 'transactor', _this.transactor)

          values.type = _this.isCompany ? 1 : 2
          _this.spinning = true
          saveReceipt(values)
            .then(data => {
              _this.spinning = false
              if (data.code == 200) {
                _this.$message.success('保存成功')
                _this.$emit('ok')
              } else {
                _this.$message.error(data.msg)
              }
            })
            .catch(() => {
              // Do something
            })
            .finally(() => {
              _this.confirmLoading = false
              _this.goBackPricing()
            })
        }
      })
    },
    // 返回
    goBackPricing() {
      // 点击返回，返回电子收据列表页
      this.$router.push({ name: 'electronicReceipt' })
      this.$destroy('addReceipt')
    },
    // 表单提交
    handleSubmit(e) {
      e.preventDefault()
    },
    // 弹出交款单位弹出层
    openModel() {
      console.log('openModel click')
      this.$refs.receiptSale.query()
    },
    // 获取交款单位
    contractChange(data) {
      console.log('data', data.name)
      this.$nextTick(() => {
        this.form.setFieldsValue({ customerName: data.name })
        this.form.setFieldsValue({ customerId: data.id })
      })
    },
    getListSaleUser() {
      listSaleUser().then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.transactors = res.data
          }
        }
      })
    },
    // 经办人：多选
    handleChange(value) {
      console.log(`selected ${value}`)
      this.transactor = `${value}`
    },
    // 输入的数字金额
    formatNumber,
    onChange(e) {
      const { value } = e.target
      const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
      if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.value = value
      }
    },
    // 失去焦点事件
    onBlur(e) {
      const param = { money: e.target.value }
      if (param != null && param.money != '') {
        if (param.money.split('.')[0].length > 10) {
          this.$message.error('金额过大,请确认金额重新输入')
          e.target.value = ''
          this.form.setFieldsValue({ money: '' })
          this.form.setFieldsValue({ capitalRenminbi: '' })
          return
        }
        this.Rmb(param)
      }
    },
    // 回车事件
    numpressEnter(e) {
      const param = { money: e.target.value }
      this.Rmb(param)
    },
    // 数字转大写
    Rmb(param) {
      getRmb(param)
        .then(res => {
          if (res.code === 200) {
            if (res.data.length > 0) {
              this.form.setFieldsValue({ capitalRenminbi: res.data })
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(function(err) {
          alert(err)
        })
    },
    dateisOptional(e) {
      this.isOptional = e.target.value
    }
  }
}
</script>

<style lang="less" scoped>
.content-wrap {
  background: #ffffff;
}

.content-inner {
  width: 1300px;
  margin: 0 auto;
  text-align: center;
  padding-bottom: 40px;
}

.inner-title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  line-height: 2;
  letter-spacing: 10px;
}

.inner-topr {
  text-align: right;
  margin-right: 8px;
  font-size: 18px;
  font-weight: bold;
}

.div-date {
  margin-bottom: 16px;
}

.form-container {
  border: 1px solid #dddddd;
}

.row-item {
  float: left;
  padding: 10px;
  min-height: 50px;
}

.form-row ~ .form-row {
  border-top: 1px solid #ddd;
}

.row-item ~ .row-item {
  border-left: 1px solid #dddddd;
}

.wid-12 {
  width: 12%;
}

.wid-15 {
  width: 15%;
}

.wid-35 {
  width: 35%;
}

.wid-85 {
  width: 85%;
}

.form-footer {
  margin-top: 28px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.stamp {
  height: 38px;
  line-height: 38px;
  text-align: left;
}

.wdf-handle {
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
}

.span-item ~ .span-item {
  margin-left: 14px;
}

.min-wid {
  min-width: 42px;
}

.crew {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
</style>

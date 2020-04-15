<template>
  <div class="content">
    <div class="content-wrap">
      <div class="top-ation clearfix">
        <div class="table-operator fl-r">
          <a-button class="fl-r" type="primary" @click="goBackPricing" icon="backward">返回</a-button>
        </div>
      </div>
      <div class="content-inner">
        <div class="inner-title">收据</div>
        <div class="inner-topr">NO.<span>{{ receiptNum }}</span></div>
        <div>
          <a-form :form="form">
            <a-form-item class="form-row clearfix" hidden style="margin-bottom: 0px;">
              <a-input hidden style="height: 30px;border: none;" v-decorator="['receiptCode', {}]"/>
            </a-form-item>
            <a-form-item class="form-row clearfix" hidden style="margin-bottom: 0px;">
              <a-input hidden style="height: 30px;border: none;" v-decorator="['customerId', {}]"/>
            </a-form-item>

            <a-form-item class="div-date">
              <span>入账日期：{{ entryTime }}</span>
            </a-form-item>
            <div class="form-container">
              <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
                <div class="row-item wid-15">交款单位</div>
                <div class="row-item wid-85" style="padding: 6px 10px;">
                  <a-input
                    style="height: 30px;border: none;"
                    read-only="read-only"
                    v-decorator="['customerName', {}]"
                  />
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
                    <span slot="title" v-if="value" class="numeric-input-title">
                      {{ value !== '-' ? formatNumber(value) : '-' }}
                    </span>
                    <template slot="title" v-else>
                      请输入数字金额
                    </template>
                    <a-input
                      placeholder="请输入数字金额"
                      maxLength="25"
                      style="width: 140px;border: none;"
                      read-only="read-only"
                      v-decorator="['money', {}]"
                    />
                  </a-tooltip>
                </div>
                <div class="row-item wid-15">人民币(大写)</div>
                <div class="row-item wid-35">
                  <a-input
                    style="border: none;"
                    read-only="read-only"
                    placeholder="输入数字金额后，按回车键，自动转换成大写"
                    v-decorator="['capitalRenminbi', {}]"/>
                </div>
              </a-form-item>
              <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
                <div class="row-item wid-15">收款是由</div>
                <div class="row-item wid-85">
                  <a-textarea style="border: none;" read-only="read-only" v-decorator="['remarks', {}]"></a-textarea>
                </div>
              </a-form-item>
              <a-form-item class="form-row clearfix" style="margin-bottom: 0px;">
                <div style="float: right">
                  {{ optionalTime }}
                </div>
              </a-form-item>
            </div>
            <div class="form-footer">
              <div class="stamp" style="position: relative;">单位盖章：<img
                :src="financialChop"
                alt="财务章"
                style="width: 150px;
    height: 150px;
    position: absolute;
    top: -165%;"></div>
              <div class="crew">
                <div class="span-item ">出纳：{{ userName }}</div>
                <div class="span-item wdf-handle">
                  <div class="min-wid">经办：{{ user.toString() }}</div>
                </div>
              </div>
            </div>
          </a-form>
        </div>

      </div>
    </div>
    <!--获取交款单位弹出层-->
  </div>
</template>

<script>
import { saveReceipt, getReceiptCode, getRmb, getContractById, listSaleUser, getByCode } from '@api/electronicReceipt'
import { getLoginUser } from '@api/systemSetting'
import moment from 'moment'
import ReceiptSale from '../modules/ReceiptSale'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'ReceiptModule',
  components: {
    AFormItem,
    ReceiptSale
  },
  props: {},
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      entryTime: '', // 入账日期, 默认今天
      receiptNum: '', // 收据编号
      receiptCode: '', // 收据编号
      value: '', // 输入的数字金额
      initialValue: 1, // 是否显示日期
      isOptional: 0,
      customerName: '',
      userInfo: {},
      transactors: [],
      transactor: [],
      user: [],
      record: {},
      userName: '',
      payment: 0,
      optionalTime: '',
      financialChop: '' // 财务章图片路径
    }
  },
  computed: {
    isCompany:function(){
      return this.record.type === 1 ? true : false
    }
  },
  watch: {},
  mounted () {
    // 从列表行传过来的内容
    this.record = this.$route.params.record
    this.init()
  },
  methods: {
    init () {
      this.getListSaleUser()
      this.getfinancialChop()
    },
    // 获取财务章
    getfinancialChop () {
      const params = { code: this.isCompany ? 'CWZYZ' : 'CWBYZ' }
      //const params = { 'code': 'CWZYZ' }
      getByCode(params).then((res) => {
        console.log('获取财务章结果', res)
        this.financialChop = res.data.sealUrl
      }).catch(errorr => {
        console.error(error)
      })
    },
    // 返回
    goBackPricing () {
      // 点击返回，返回电子收据列表页
      this.$router.push({ name: 'electronicReceipt' })
      this.$destroy('addReceipt')
    },
    getListSaleUser () {
      let _this = this
      listSaleUser().then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            _this.transactors = res.data
            _this.transactor = _this.record.transactor.split(',')
            for (var i = 0; i < _this.transactor.length; i++) {
              for (var j = 0; j < _this.transactors.length; j++) {
                if (_this.transactor[i] == _this.transactors[j].userId) {
                  _this.user.push(_this.transactors[j].salesmanName)
                }
              }
            }
          }
        }
      }).then(() => {

      }).catch(() => {
        // Do something
      }).finally(() => {
        // Do something
      })
      this.$nextTick(() => {
        this.receiptNum = this.record.receiptCode
        this.userName = this.record.createdName
        this.entryTime = this.record.entryTime
        this.form.setFieldsValue({ customerName: this.record.customerName })
        this.form.setFieldsValue({ money: this.record.money })
        this.form.setFieldsValue({ capitalRenminbi: this.record.capitalRenminbi })
        this.form.setFieldsValue({ remarks: this.record.remarks })
        this.form.setFieldsValue({ isOptional: this.record.isOptional })
        this.isOptional = this.record.isOptional
        if (this.record.isOptional != null && this.record.isOptional != 1) {
          this.optionalTime = this.record.optionalTime
        }
      })
    },

    // 经办人：多选
    handleChange (value) {
      console.log(`selected ${value}`)
      this.transactor = `${value}`
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

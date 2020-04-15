<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBack" icon="backward">返回</a-button>
    </div>
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit">结算方式</a-col>
      </a-row>
      <a-form
        :form="form"
        @submit="handleSubmit"
        class="form wdf-form"
      >
        <a-form-item>
          <a-row>
            <a-col class="col-border" :span="4">质保期限及要求</a-col>
            <a-col class="col-border" :span="20">
              <span>主框架:</span>
              <a-select
                class="year-select"
                v-decorator="['qualityFrame',{initialValue:3},{rules: [{ required: true, message: '选择质保期限'}]}]"
                @change="qualityFrameChange"
              >
                <a-select-option :value="3">3年</a-select-option>
                <a-select-option :value="4">4年</a-select-option>
                <a-select-option :value="6">5年</a-select-option>
              </a-select>
              <span>电器件:</span>
              <a-select
                class="year-select"
                v-decorator="['qualityElectronics',{initialValue:1},{rules: [{ required: true, message: '选择质保期限'}]}]"
                @change="qualityElectronicsChange"
              >
                <a-select-option :value="1">1年</a-select-option>
                <a-select-option :value="2">2年</a-select-option>
              </a-select>
              <span>表面涂层:</span>
              <a-select
                class="year-select"
                v-decorator="['qualityLayer',{initialValue:3},{rules: [{ required: true, message: '选择质保期限'}]}]"
                @change="qualityLayerChange"
              >
                <a-select-option :value="3">3年</a-select-option>
                <a-select-option :value="4">4年</a-select-option>
                <a-select-option :value="5">5年</a-select-option>
              </a-select>

              <span>增加总货款金额为：{{ calcIncreaseTotalPayment }}</span>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item v-if="fullAmount === 0">
          <a-row class="wdf-row">
            <a-col class="col-border" :span="4">全款结算方式及时间</a-col>
            <a-col class="col-border" :span="20">
              <a-input
                type="number"
                :value="100"
                v-decorator="['fullPaymentPercentage',{initialValue:100},{rules: [{ required: false, message: '百分比'}]}]"
                style="width: 62px;"
                disabled/>
              <span class="year-select">%</span>
              <span>应付金额:</span>
              <span class="year-select">{{ calcAllPayment }}</span>
              <span>付款日期:</span>
              <a-form-item style="display: inline-block">
                <a-date-picker
                  class="year-select"
                  v-decorator="['allPaymentDate', {rules: [{required: true, message: '请选择签订日期！'}],initialValue:paymentDate}]"
                  style="width: 120px;"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <div v-else>
          <a-row class="wdf-row" v-show="productTypes.includes(0)" >
            <a-col :span="4">常规产品结算方式及时间</a-col>
            <a-col class="" style="border-left: 1px solid #ddd;" :span="20">
              <a-row type="flex" align="middle">
                <a-col :span="12">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          @change="checkboxChange"
                          v-decorator="['convention.1.selected', {initialValue:false, valuePropName: 'checked'}]">
                          <span class="checkbox-innerspan mar-l0">质保金</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="9">
                      <a-form-item class="item-select">
                        <a-select
                          class="select-prop"
                          v-decorator="['convention.1.number',{initialValue:3}, {rules: [{ required: true, message: '选择比例' }]}]"
                          @change="conventionChange(1)">
                          <a-select-option :value="3">3%</a-select-option>
                          <a-select-option :value="4">4%</a-select-option>
                          <a-select-option :value="5">5%</a-select-option>
                          <a-select-option :value="6">6%</a-select-option>
                          <a-select-option :value="7">7%</a-select-option>
                          <a-select-option :value="8">8%</a-select-option>
                          <a-select-option :value="9">9%</a-select-option>
                        </a-select>
                        <span class="checkbox-innerspan">折算金额: {{ c1 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="9">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          v-decorator="['convention.1.date', {initialValue:cQualityDate},{rules: [{required: true, message: '选择付款日期！'}]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="12">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          @change="checkboxChange"
                          v-decorator="['convention.4.selected', {initialValue:false, valuePropName: 'checked'}]">
                          <span class="checkbox-innerspan mar-l0">预付款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="10">
                      <a-form-item>
                        <a-select
                          class="select-prop"
                          v-decorator="['convention.4.number',{initialValue:30}, {rules: [{ required: true, message: '选择比例' }]}]"
                          @change="conventionChange(4)">
                          <a-select-option :value="30">30%</a-select-option>
                          <a-select-option :value="20">20%</a-select-option>
                        </a-select>
                        <span class="checkbox-innerspan">折算金额: {{ c4 }}</span>
                      </a-form-item>

                    </a-col>
                    <a-col :span="9">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          v-decorator="['convention.4.date', {initialValue:cadvanceDate},{rules: [{required: true, message: '选择付款日期！'}]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-row class="row-in-col" type="flex" align="middle">
                <a-col :span="12">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox @change="checkboxChange" v-decorator="['convention.2.selected', {initialValue:false, valuePropName: 'checked'}]">
                          <span class="checkbox-innerspan mar-l0">进度款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="10">
                      <a-form-item>
                        <a-input-number
                          placeholder="填入数字"
                          v-decorator="['convention.2.number', { initialValue: 0 },{rules: [{required: false, message: '填写进度款'}]}]"
                          :min="0"
                          :max="100"
                          style="width: 80px"
                          @change="conventionChange(2)"
                        />
                        <span>%</span>
                        <span class="checkbox-innerspan">折算金额: {{ c2 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="9">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          v-decorator="['convention.2.date', {initialValue:cprogressDate},{rules: [{required: true, message: '选择付款日期！'}]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>

                </a-col>
                <a-col :span="12">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          @change="checkboxChange"
                          v-decorator="['convention.5.selected', {initialValue:false, valuePropName: 'checked'}]">
                          <span class="checkbox-innerspan mar-l0">提货款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="10">
                      <a-form-item>
                        <a-input-number
                          placeholder="填入数字"
                          v-decorator="['convention.5.number', { initialValue: 0 },{rules: [{required: true, message: '填写提货款'}]}]"
                          :min="0"
                          :max="100"
                          style="width: 80px"
                          @change="conventionChange(5)"
                        />
                        <span>%</span>
                        <span class="checkbox-innerspan">折算金额: {{ c5 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="9">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          v-decorator="['convention.5.date', {initialValue:cpaymentForGoodsDate},{rules: [{required: true, message: '选择付款日期！'}]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-row class="row-in-col" type="flex" align="middle">
                <a-col :span="12">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          @change="checkboxChange"
                          v-decorator="['convention.3.selected', {initialValue:false, valuePropName: 'checked'}]">
                          <span class="checkbox-innerspan mar-l0">验收款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="10">
                      <a-form-item>
                        <a-input-number
                          placeholder="填入数字"
                          v-decorator="['convention.3.number', { initialValue: 0 },{rules: [{required: true, message: '填写验收款'}]}]"
                          :min="0"
                          :max="100"
                          style="width: 80px"
                          @change="conventionChange(3)"
                        />
                        <span>%</span>
                        <span class="checkbox-innerspan">折算金额: {{ c3 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="9">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          v-decorator="['convention.3.date', {initialValue:cAcceptDate},{rules: [{required: true, message: '选择付款日期！'}]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-col>
          </a-row>

          <a-row class="wdf-row" v-show="productTypes.includes(1)" >
            <a-col :span="4">非常规产品结算方式及时间</a-col>
            <a-col class="" style="border-left: 1px solid #ddd;" :span="20">
              <a-row type="flex" align="middle">
                <a-col :span="12">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          @change="checkboxChange"
                          v-decorator="['unConvention.1.selected', {initialValue:false, valuePropName: 'checked'}]">
                          <span class="checkbox-innerspan mar-l0">质保金</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="9">
                      <a-form-item class="item-select">
                        <a-select
                          class="select-prop"
                          v-decorator="['unConvention.1.number',{initialValue:3}, {rules: [{ required: true, message: '选择比例' }]}]"
                          @change="unConventionChange(1)">
                          <a-select-option :value="3">3%</a-select-option>
                          <a-select-option :value="4">4%</a-select-option>
                          <a-select-option :value="5">5%</a-select-option>
                          <a-select-option :value="6">6%</a-select-option>
                          <a-select-option :value="7">7%</a-select-option>
                          <a-select-option :value="8">8%</a-select-option>
                          <a-select-option :value="9">9%</a-select-option>
                        </a-select>
                        <span class="checkbox-innerspan">折算金额: {{ unC1 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="9">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          v-decorator="['unConvention.1.date', {initialValue:cQualityDate},{rules: [{required: true, message: '选择付款日期！'}]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="12">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          @change="checkboxChange"
                          v-decorator="['unConvention.4.selected', {initialValue:false, valuePropName: 'checked'}]">
                          <span class="checkbox-innerspan mar-l0">预付款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="10">
                      <a-form-item>
                        <a-select
                          class="select-prop"
                          v-decorator="['unConvention.4.number',{initialValue:50}, {rules: [{ required: true, message: '选择比例' }]}]"
                          @change="unConventionChange(4)">
                          <a-select-option :value="50">50%</a-select-option>
                          <a-select-option :value="40">40%</a-select-option>
                        </a-select>
                        <span class="checkbox-innerspan">折算金额: {{ unC4 }}</span>
                      </a-form-item>

                    </a-col>
                    <a-col :span="9">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          v-decorator="['unConvention.4.date', {initialValue:cadvanceDate},{rules: [{required: true, message: '选择付款日期！'}]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-row class="row-in-col" type="flex" align="middle">
                <a-col :span="12">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox @change="checkboxChange" v-decorator="['unConvention.2.selected', {initialValue:false, valuePropName: 'checked'}]">
                          <span class="checkbox-innerspan mar-l0">进度款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="10">
                      <a-form-item>
                        <a-input-number
                          placeholder="填入数字"
                          v-decorator="['unConvention.2.number', { initialValue: 0 },{rules: [{required: false, message: '填写进度款'}]}]"
                          :min="0"
                          :max="100"
                          style="width: 80px"
                          @change="unConventionChange(2)"
                        />
                        <span>%</span>
                        <span class="checkbox-innerspan">折算金额: {{ unC2 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="9">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          v-decorator="['unConvention.2.date', {initialValue:cprogressDate},{rules: [{required: true, message: '选择付款日期！'}]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>

                </a-col>
                <a-col :span="12">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          @change="checkboxChange"
                          v-decorator="['unConvention.5.selected', {initialValue:false, valuePropName: 'checked'}]">
                          <span class="checkbox-innerspan mar-l0">提货款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="10">
                      <a-form-item>
                        <a-input-number
                          placeholder="填入数字"
                          v-decorator="['unConvention.5.number', { initialValue: 0 },{rules: [{required: true, message: '填写提货款'}]}]"
                          :min="0"
                          :max="100"
                          style="width: 80px"
                          @change="unConventionChange(5)"
                        />
                        <span>%</span>
                        <span class="checkbox-innerspan">折算金额: {{ unC5 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="9">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          v-decorator="['unConvention.5.date', {initialValue:cpaymentForGoodsDate},{rules: [{required: true, message: '选择付款日期！'}]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <a-row class="row-in-col" type="flex" align="middle">
                <a-col :span="12">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          @change="checkboxChange"
                          v-decorator="['unConvention.3.selected', {initialValue:false, valuePropName: 'checked'}]">
                          <span class="checkbox-innerspan mar-l0">验收款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="10">
                      <a-form-item>
                        <a-input-number
                          placeholder="填入数字"
                          v-decorator="['unConvention.3.number', { initialValue: 0 },{rules: [{required: true, message: '填写验收款'}]}]"
                          :min="0"
                          :max="100"
                          style="width: 80px"
                          @change="unConventionChange(3)"
                        />
                        <span>%</span>
                        <span class="checkbox-innerspan">折算金额: {{ unC3 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="9">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          v-decorator="['unConvention.3.date', {initialValue:cAcceptDate},{rules: [{required: true, message: '选择付款日期！'}]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
        <a-form-item class="btns-grop">
          <a-button style="margin-left: 8px;" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getQueryOne, saveSettlementMethod, deleteQueryOne } from '@/api/contractListManagement'
import moment from 'moment'

export default {
  name: 'Step3',
  components: {},
  props: {
    queryonedata: {
      type: Object
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  data () {
    const queryOneData = { ...this.queryonedata }
    return {
      queryOneData: queryOneData,
      datac: [],
      dataf: [],
      increaseTotalPayment: 0, // 增加总货款金额
      allPayment: queryOneData.totalAmount, // 全款应付金额
      conventionalMoney: queryOneData.conventionalMoney, // 常规产品总价
      unConventionalMoney: queryOneData.unConventionalMoney, // 非常规产品总价
      allPaymentDate: moment(), // 全款付款日期
      // 常规--付款日期
      cQualityDate: moment(), // 常规-质保金-付款日期
      cadvanceDate: moment(), // 常规--预付款-付款日期
      cprogressDate: moment(), // 常规--进度款-付款日期
      cpaymentForGoodsDate: moment(), // 常规--提货款-付款日期
      cAcceptDate: moment(), // 常规--验收款-付款日期
      // 非常规
      fqualityDate: moment(), // 非常规-质保金-付款日期
      fadvanceDate: moment(), // 非常规--预付款-付款日期
      fprogressDate: moment(), // 非常规--进度款-付款日期
      fpaymentForGoodsDate: moment(), // 非常规--提货款-付款日期
      fAcceptDate: moment(), // 非常规--验收款-付款日期

      // 常规--折算金额
      cQualityAmount: queryOneData.conventionalMoney * 3 / 100, // 常规--质保金折算金额
      cadvanceAmount: queryOneData.conventionalMoney * 30 / 100, // 常规--预付款折算金额
      cprogressAmount: 0, // 常规--进度款折算金额
      cpaymentForGoodsAmount: 0, // 常规--提货款折算金额
      cAcceptAmount: 0, // 常规--验收款

      // 非常规--折算金额
      fqualityAmount: queryOneData.unConventionalMoney * 3 / 100, // 常规--质保金折算金额
      fadvanceAmount: queryOneData.unConventionalMoney * 50 / 100, // 常规--预付款折算金额
      fprogressAmount: 0, // 常规--进度款折算金额
      fpaymentForGoodsAmount: 0, // 常规--提货款折算金额
      fAcceptAmount: 0, // 常规--验收款

      // 常规---款项百分比
      cqualitypercentage: 3, // 常规--质保金百分比
      cadvancePercentage: 30, // 常规--预付款百分比
      cprogressPayment: 0, // 常规--进度款百分比
      cpaymentForGoods: 0, // 常规--提货款百分比
      cAcceptPayment: 0, // 常规--验收款百分比
      // 非常规---款项百分比
      fqualitypercentage: 3, // 非常规--质保金百分比
      fadvancePercentage: 30, // 非常规--预付款百分比
      fprogressPayment: 0, // 非常规--进度款百分比
      fpaymentForGoods: 0, // 非常规--提货款百分比
      fAcceptPayment: 0, // 非常规--验收款百分比

      fullAmount: this.queryonedata.fullAmount, // 是否全款
      product: {}, // 产品类型常规非常规数组
      productTypes: [],
      qualityFrame: 3, // 主框架质保年限
      qualityElectronics: 1, // 电子质保年限
      qualityLayer: 3, // 图层质保年限
      qualityFramePre: 0, // 主框架质保增加百分比
      qualityElectronicsPre: 0, // 电子质保增加百分比
      qualityLayerPre: 0, // 图层质保增加百分比
      conventionValue: [], // 常规产品复选框数组value值
      unConventionValue: [], // 非常规产品复选框数组value值
      c1: queryOneData.conventionalMoney * 3 / 100, // 常规--质保金折算金额,
      c2: 0,
      c3: 0,
      c4: 0,
      c5: 0,
      unC1: 0,
      unC2: 0,
      unC3: 0,
      unC4: 0,
      unC5: 0,
      id: 0, // 主键id 唯一
      percentages: 0,
      percentagesStatus: false,
      paymentDate: moment()
    }
  },
  watch: {
    $route (to, from) {
      if (to.fullPath === '/sales-management/contract-list-management/distributionContractList') {
        this.currentTab = 0
      }
    },
    queryOneData: function (newVal, oldVal) {
      this.fillMoney()
    }
  },
  beforeMount () {
    // debugger
  },
  mounted () {
    // console.log(this)
    this.init()
    this.fullAmount = this.queryonedata.fullAmount
  },
  computed: {
    calcIncreaseTotalPayment: function () {
      return this.queryOneData.totalAmount * (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100)
    },
    calcAllPayment: function () {
      return this.queryOneData.totalAmount * (1 + this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100 + 1)
    }
  },
  methods: {
    init () {
      const that = this
      that.id = that.queryonedata.id
      const params = { id: that.queryonedata.id }
      getQueryOne(params).then(res => {
        that.queryOneData = res.data
        that.form.setFieldsValue({
          contractId: res.data.id,
          fullAmount: res.data.fullAmount, // 是否全款 0全款  1非全款
          allPayment: res.data.totalAmount,
          totalAmount: res.data.totalAmount, // 总金额(已经判断过是否含税了)
          conventionalMoney: res.data.conventionalMoney, // 常规产品总价
          unConventionalMoney: res.data.unConventionalMoney, // 非常规产品总价
          product: res.data.product, // 常规产品或者非常规产品  0 常规产品 1非常规产品
          qualityFrame: res.data.qualityFrame || 3,
          qualityElectronics: res.data.qualityElectronics || 1,
          qualityLayer: res.data.qualityLayer || 3,
          allPaymentDate: res.data.settlement ? moment(res.data.settlement.paymentDate) : moment(), // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
          routineSettlement: res.data.routineSettlement || [],
          unconventionalSettlement: res.data.unconventionalSettlement || [],
          increaseTotalPayment: res.data.increaseTotalPayment // 增加总货款金额
        })
        that.contractId = this.queryonedata.id
        that.id = this.queryonedata.id
        that.contractId = res.data.id
        that.fullAmount = res.data.fullAmount
        that.product = res.data.product
        that.allPayment = res.data.totalAmount
        that.conventionalMoney = res.data.conventionalMoney
        that.unConventionalMoney = res.data.unConventionalMoney
        that.increaseTotalPayment = res.data.increaseTotalPayment
        // [{id: 0, productType: 1}]     // [], [0,0], [1,1], [0,1,0]
        that.productTypes = that.product.map(item => {
          return item.productType
        })
      }).catch(error => {
        console.error(error)
      })
      that.form.setFieldsValue({
        contractId: this.queryonedata.id,
        fullAmount: this.queryonedata.fullAmount, // 是否全款 0全款  1非全款
        allPayment: this.queryonedata.totalAmount,
        totalAmount: this.queryonedata.totalAmount, // 总金额(已经判断过是否含税了)
        conventionalMoney: this.queryonedata.conventionalMoney, // 常规产品总价
        unConventionalMoney: this.queryonedata.unConventionalMoney, // 非常规产品总价
        product: this.queryonedata.product, // 常规产品或者非常规产品  0 常规产品 1非常规产品
        qualityFrame: this.queryonedata.qualityFrame || 3,
        qualityElectronics: this.queryonedata.qualityElectronics || 1,
        qualityLayer: this.queryonedata.qualityLayer || 3,
        allPaymentDate: this.queryonedata.settlement ? moment(this.queryonedata.settlement.paymentDate) : moment(), // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
        routineSettlement: this.queryonedata.routineSettlement || [],
        unconventionalSettlement: this.queryonedata.unconventionalSettlement || [],
        increaseTotalPayment: this.queryonedata.increaseTotalPayment // 增加总货款金额
      })
    },
    // 主框架下拉改变
    qualityFrameChange (e) {
      console.log('主框架下拉改变', e)
      this.qualityFrame = e
      if (this.qualityFrame === 3) {
        this.qualityFramePre = 0
        this.increaseTotalPayment = this.queryOneData.totalAmount * (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100)
        this.allPayment = this.queryOneData.totalAmount * (1 + this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100 + 1)
      } else if (this.qualityFrame === 4) {
        this.qualityFramePre = 3
        this.increaseTotalPayment = this.queryOneData.totalAmount * (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100)
        this.allPayment = this.queryOneData.totalAmount * (1 + this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100 + 1)
      } else {
        this.qualityFramePre = 6
        this.increaseTotalPayment = this.queryOneData.totalAmount * (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100)
        this.allPayment = this.queryOneData.totalAmount * (1 + this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100 + 1)
      }
    },

    // 上一步
    prevStep () {
      // this.$emit('prevStep', {...this.id})
      const id = this.id
      this.$emit('prevStep', id)
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    // 电子件质保年限
    qualityElectronicsChange (e) {
      this.qualityElectronics = e
      console.log('电子件质下拉改变', this.qualityElectronics)
      if (this.qualityElectronics === 1) {
        this.qualityElectronicsPre = 0
      } else {
        this.qualityElectronicsPre = 10
      }
      // this.increaseTotalPayment = this.queryOneData.totalAmount * (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100)
      // this.allPayment = this.queryOneData.totalAmount * (1 + this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100 + 1)
    },
    // 图层质保年限
    qualityLayerChange (e) {
      this.qualityLayer = e
      if (this.qualityLayer === 3) {
        this.qualityLayerPre = 0
      } else if (this.qualityLayer === 4) {
        this.qualityLayerPre = 3
      } else {
        this.qualityLayerPre = 6
      }
      // this.increaseTotalPayment = this.queryOneData.totalAmount * (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100)
      // this.allPayment = this.queryOneData.totalAmount * (1 + this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100 + 1)
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
          if (that.fullAmount === 0) { // 全款
            that.allPaymentDate = values.allPaymentDate.format('YYYY-MM-DD')
            const params = {
              contractId: that.id,
              qualityFrame: values.qualityFrame,
              qualityElectronics: values.qualityElectronics,
              qualityLayer: values.qualityLayer,
              allPaymentDate: that.allPaymentDate, // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
              routineSettlement: [],
              unconventionalSettlement: []
            }
            // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
            saveSettlementMethod(params).then(res => {
              console.log('校验成功，保存填写的信息，请求后端接口结果', res)
              that.id = res.data.id
              that.loading = false
              that.form.setFieldsValue({
              })
              that.$emit('nextStep', { ...res.data })
            }).catch(error => {
              console.error(error)
            })
          } else {
            // for (i=0;i<this._getParam('convention').length;i++){
            //   let percentages=percentages+this._getParam('convention').number
            // }

            // 各个款项的百分比之和应为100%
            // if(that.percentages!=100){
            //   that.$message.error('各个款项的百分比之和应为100%')
            // }else{
            if (!this.percentagesStatus) {
              that.$message.error('各个款项的百分比之和应为100%')
              return
            }
            // debugger
            // that.allPaymentDate = ''
            //  that.paymentDate = moment()
            const params = {
              contractId: that.contractId,
              qualityFrame: values.qualityFrame,
              qualityElectronics: values.qualityElectronics,
              qualityLayer: values.qualityLayer,
              //  paymentDate: that.paymentDate,    //提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
              routineSettlement: this._getParam('convention') || [],
              unconventionalSettlement: this._getParam('unConvention') || []
            }
            // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
            saveSettlementMethod(params).then(res => {
              console.log('校验成功，保存填写的信息，请求后端接口结果', res)
              that.id = res.data.id
              that.loading = false
              that.form.setFieldsValue({
              })
              that.$emit('nextStep', { ...res.data })
            }).catch(error => {
              console.error(error)
            })

            // }
          }

          // if(that.percentages!=100){
          //   that.$message.error('各个款项的百分比之和应为100%')
          // }else{
          // }
        }
      })
    },
    // 非常规产品复选按钮组的change事件
    unConventionChange (checkedValues) {
      const that = this
      console.log('非常规产品复选按钮组的change事件checked = ', checkedValues)
      console.log('非常规产品复选按钮组的change事件value = ', that.unConventionValue)
    },

    /**
       * 获取常规和非常规的数据
       * @param name
       * @returns {Array}
       * @private
       */
    _getParam (name) {
      const result = []
      const convention = this.form.getFieldValue(name)
      const temp = {
        contractId: this.queryOneData.id || 0,
        productType: (name === 'convention') ? 0 : 1
      }
      for (const [key, value] of Object.entries(convention)) {
        const { selected, number, date } = value
        if (selected) {
          result.push({
            ...temp,
            moneyType: key,
            percentage: Number(number),
            paymentDate: date.format('YYYY-MM-DD')
          })
          // this.percentages = this.percentages + percentage
        }
      }
      return result
    },
    // 常规 - 下拉框发生改变时触发
    conventionChange (type) {
      this.$nextTick(() => {
        const convention = this.form.getFieldValue('convention')
        console.log(this.queryOneData.conventionalMoney)
        this[`c${type}`] = this._calculateAmount(convention[type].number, this.queryOneData.conventionalMoney)
        this.checkPercentages(`convention.${type}.selected`)
        // unConvention.4.selected
      })
    },
    // 非常规 - 下拉发生改变时触发
    unConventionChange (type) {
      this.$nextTick(() => {
        const unConvention = this.form.getFieldValue('unConvention')
        console.log(this.queryOneData.unConventionalMoney)
        this[`unC${type}`] = this._calculateAmount(unConvention[type].number, this.queryOneData.unConventionalMoney)
        this.checkPercentages(`unConvention.${type}.selected`)
      })
    },
    // 计算金额
    _calculateAmount (percent, total) {
      if (!percent) return 0
      const amount = percent / 100 * total
      return amount.toFixed(2)
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
          // 在这里调用删除接口
          const params = { id: _this.queryonedata.id }
          deleteQueryOne(params).then((res) => {
            if (res.code == 200) {
              _this.$message.info('删除合同编辑成功')
              _this.$router.push({ name: 'distributionContractList' })
            } else {
              _this.$message.error(res.msg)
            }
          })
          console.log('OK')
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    // 填充常规和非常规的折算金额
    fillMoney () {
      const that = this

      this.$nextTick(() => {
        // debugger
        const { convention, unConvention } = that.form.getFieldsValue()
        console.log(convention)
        console.log(unConvention)
        console.log(that.queryOneData.conventionalMoney, that.queryOneData.unConventionalMoney)
        convention && convention.map((item, index, arr) => {
          console.log(`c${index}`)
          if (item) {
            const res = that._calculateAmount(item.number, that.queryOneData.conventionalMoney)
            console.log(res)
            that[`c${index}`] = res
          }
        })

        unConvention && unConvention.map((item, index, arr) => {
          console.log(`unC${index}`)
          if (item) {
            const res = that._calculateAmount(item.number, that.queryOneData.unConventionalMoney)
            console.log(res)
            that[`unC${index}`] = res
          }
        })
      })
    },
    checkboxChange (event) {
      // fix 0149 预期结果：所有结算方式的百分比总和必须为100％
      /*
        event.target 包含数据
        autoFocus: false
        checked: true
        defaultChecked: false
        id: "unConvention.4.selected"
        prefixCls: "ant-checkbox"
        type: "checkbox"
        */
      // console.log(this.form)
      const { id, checked, defaultChecked } = event.target
      if (!checked) return

      this.$nextTick(() => {
        this.checkPercentages(id)
      })
    },
    checkPercentages (id) {
      this.$nextTick(() => {
        const { convention, unConvention } = this.form.getFieldsValue()
        const calcConventionRoate = convention.reduce(function (accumulator, item) {
          return accumulator + (item.selected ? item.number : 0)
        }, 0)
        if (this.productTypes.includes(0)) {
          if (calcConventionRoate > 100) {
            this.$message.error('常规产品结算方式各个款项的百分比之和应为100%')
            id && this.form.setFieldsValue({ [id]: false })
            this.percentagesStatus = false
            return
          }
          this.percentagesStatus = calcConventionRoate === 100
        }
        const calcUnConventionRoate = unConvention.reduce(function (accumulator, item) {
          return accumulator + (item.selected ? item.number : 0)
        }, 0)
        if (this.productTypes.includes(1)) {
          if (calcUnConventionRoate > 100) {
            this.$message.error('非常规产品结算方式各个款项的百分比之和应为100%')
            id && this.form.setFieldsValue({ [id]: false })
            this.percentagesStatus = false
            return
          }
          this.percentagesStatus = calcUnConventionRoate === 100
        }
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

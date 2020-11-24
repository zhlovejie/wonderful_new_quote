<template>
  <div class="content-wrap">
    <div>
      <a-row>
        <a-col :span="24" class="basic-tit" justify="center" align="middle">结算方式</a-col>
      </a-row>
      <a-form :form="form" @submit="handleSubmit" class="form wdf-form">
        <a-form-item>
          <!-- 智能桶 -->
          <a-row v-if="bucketType === 1">
            <a-col class="col-border" :span="4">质保期限及要求</a-col>
            <a-col class="col-border" :span="20">
              <span>主框架:</span>
              <a-select
                class="year-select"
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="[
                  'qualityFrame',
                  { initialValue: 3, rules: [{ required: true, message: '选择质保期限' }] },
                ]"
                @change="qualityFrameChange"
              >
                <a-select-option :value="3">3年</a-select-option>
                <a-select-option :value="4">4年</a-select-option>
                <a-select-option :value="5">5年</a-select-option>
              </a-select>
              <span>电器件:</span>
              <a-select
                class="year-select"
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="[
                  'qualityElectronics',
                  { initialValue: 1, rules: [{ required: true, message: '选择质保期限' }] },
                ]"
                @change="qualityElectronicsChange"
              >
                <a-select-option :value="1">1年</a-select-option>
                <a-select-option :value="2">2年</a-select-option>
              </a-select>
              <span>表面涂层:</span>
              <a-select
                class="year-select"
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="[
                  'qualityLayer',
                  { initialValue: 3, rules: [{ required: true, message: '选择质保期限' }] },
                ]"
                @change="qualityLayerChange"
              >
                <a-select-option :value="3">3年</a-select-option>
                <a-select-option :value="4">4年</a-select-option>
                <a-select-option :value="5">5年</a-select-option>
              </a-select>

              <span>增加总货款金额为：{{ calcIncreaseTotalPayment }}</span>
            </a-col>
          </a-row>

          <!-- 常规桶 -->
          <a-row v-if="bucketType === 2">
            <a-col class="col-border" :span="4">质保期</a-col>
            <a-col class="col-border" :span="20">
              <a-select
                class="year-select"
                :disabled="this.$parent.routeParams.action === 'see'"
                v-decorator="[
                  'qualityLimit',
                  { initialValue: 1, rules: [{ required: true, message: '选择质保期限' }] },
                ]"
                @change="qualityLimitChange"
              >
                <a-select-option :value="1">1年</a-select-option>
                <a-select-option :value="2">2年</a-select-option>
                <!--<a-select-option :value="3">3年</a-select-option>-->
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
                v-decorator="[
                  'fullPaymentPercentage',
                  { initialValue: 100, rules: [{ required: false, message: '百分比' }] },
                ]"
                style="width: 62px"
                disabled
              />
              <span class="year-select">%</span>
              <span>应付金额:</span>
              <span class="year-select">{{ calcAllPayment }}</span>
              <span>付款日期:</span>
              <a-form-item style="display: inline-block">
                <a-date-picker
                  class="year-select"
                  :disabled="this.$parent.routeParams.action === 'see'"
                  v-decorator="[
                    'allPaymentDate',
                    { rules: [{ required: true, message: '请选择签订日期！' }], initialValue: paymentDate },
                  ]"
                  style="width: 120px"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <div v-else>
          <!-- v-show="productTypes.includes(0)" -->
          <a-row class="wdf-row">
            <a-col :span="4">产品结算方式及时间</a-col>
            <a-col class style="border-left: 1px solid #ddd" :span="20">
              <a-row type="flex" align="middle">
                <!-- 预付款 -->
                <a-col :span="20">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          :disabled="this.$parent.routeParams.action === 'see'"
                          @change="checkboxChange"
                          v-decorator="['convention.4.selected', { initialValue: false, valuePropName: 'checked' }]"
                        >
                          <span class="checkbox-innerspan mar-l0">预付款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item>
                        <a-input-number
                          placeholder="填入数字"
                          :disabled="this.$parent.routeParams.action === 'see'"
                          v-decorator="[
                            'convention.4.number',
                            { initialValue: 30, rules: [{ required: false, message: '填写进度款' }] },
                          ]"
                          :min="0"
                          :max="100"
                          :precision="0"
                          style="width: 80px"
                          @change="conventionChange(4, $event)"
                        />
                        <span>%</span>
                        <span class="checkbox-innerspan">折算金额: {{ c4 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="7">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          :disabled="this.$parent.routeParams.action === 'see'"
                          v-decorator="[
                            'convention.4.date',
                            { initialValue: cadvanceDate, rules: [{ required: true, message: '选择付款日期！' }] },
                          ]"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-item>
                        <a-input
                          :disabled="this.$parent.routeParams.action === 'see'"
                          placeholder="备注信息"
                          v-decorator="['convention.4.remarks']"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-item>
                        <a-input
                          :disabled="this.$parent.routeParams.action === 'see'"
                          type="hidden"
                          v-decorator="['convention.4.order', { initialValue: 1 }]"
                          value="1"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- 预付款 END-->
                <!-- 进度款 -->
                <a-col :span="20">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          @change="checkboxChange"
                          :disabled="this.$parent.routeParams.action === 'see'"
                          v-decorator="['convention.2.selected', { initialValue: false, valuePropName: 'checked' }]"
                        >
                          <span class="checkbox-innerspan mar-l0">进度款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item>
                        <a-input-number
                          placeholder="填入数字"
                          :disabled="this.$parent.routeParams.action === 'see'"
                          v-decorator="[
                            'convention.2.number',
                            { initialValue: 0, rules: [{ required: false, message: '填写进度款' }] },
                          ]"
                          :min="0"
                          :max="100"
                          :precision="0"
                          style="width: 80px"
                          @change="conventionChange(2, $event)"
                        />
                        <span>%</span>
                        <span class="checkbox-innerspan">折算金额: {{ c2 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="7">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          :disabled="this.$parent.routeParams.action === 'see'"
                          v-decorator="[
                            'convention.2.date',
                            { initialValue: cprogressDate, rules: [{ required: true, message: '选择付款日期！' }] },
                          ]"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-item>
                        <a-input
                          :disabled="this.$parent.routeParams.action === 'see'"
                          placeholder="备注信息"
                          v-decorator="['convention.2.remarks']"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-item>
                        <a-input
                          :disabled="this.$parent.routeParams.action === 'see'"
                          type="hidden"
                          v-decorator="['convention.2.order', { initialValue: 2 }]"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- 进度款 END-->
              </a-row>
              <a-row class="row-in-col" type="flex" align="middle">
                <!-- 提货款 -->
                <a-col :span="20">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          @change="checkboxChange"
                          :disabled="this.$parent.routeParams.action === 'see'"
                          v-decorator="['convention.5.selected', { initialValue: false, valuePropName: 'checked' }]"
                        >
                          <span class="checkbox-innerspan mar-l0">提货款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item>
                        <a-input-number
                          placeholder="填入数字"
                          :disabled="this.$parent.routeParams.action === 'see'"
                          v-decorator="[
                            'convention.5.number',
                            { initialValue: 0, rules: [{ required: true, message: '填写提货款' }] },
                          ]"
                          :min="0"
                          :max="100"
                          :precision="0"
                          style="width: 80px"
                          @change="conventionChange(5, $event)"
                        />
                        <span>%</span>
                        <span class="checkbox-innerspan">折算金额: {{ c5 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="7">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          :disabled="this.$parent.routeParams.action === 'see'"
                          v-decorator="[
                            'convention.5.date',
                            {
                              initialValue: cpaymentForGoodsDate,
                              rules: [{ required: true, message: '选择付款日期！' }],
                            },
                          ]"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-item>
                        <a-input
                          :disabled="this.$parent.routeParams.action === 'see'"
                          placeholder="备注信息"
                          v-decorator="['convention.5.remarks']"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-item>
                        <a-input
                          :disabled="this.$parent.routeParams.action === 'see'"
                          type="hidden"
                          v-decorator="['convention.5.order', { initialValue: 3 }]"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- 提货款 END-->
                <!-- 验收款 -->
                <a-col :span="20">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          :disabled="this.$parent.routeParams.action === 'see'"
                          @change="checkboxChange"
                          v-decorator="['convention.3.selected', { initialValue: false, valuePropName: 'checked' }]"
                        >
                          <span class="checkbox-innerspan mar-l0">验收款</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item>
                        <a-input-number
                          :disabled="this.$parent.routeParams.action === 'see'"
                          placeholder="填入数字"
                          v-decorator="[
                            'convention.3.number',
                            { initialValue: 0, rules: [{ required: true, message: '填写验收款' }] },
                          ]"
                          :min="0"
                          :max="100"
                          :precision="0"
                          style="width: 80px"
                          @change="conventionChange(3, $event)"
                        />
                        <span>%</span>
                        <span class="checkbox-innerspan">折算金额: {{ c3 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="7">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          :disabled="this.$parent.routeParams.action === 'see'"
                          class="date"
                          v-decorator="[
                            'convention.3.date',
                            { initialValue: cAcceptDate, rules: [{ required: true, message: '选择付款日期！' }] },
                          ]"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-item>
                        <a-input
                          :disabled="this.$parent.routeParams.action === 'see'"
                          placeholder="备注信息"
                          v-decorator="['convention.3.remarks']"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-item>
                        <a-input
                          :disabled="this.$parent.routeParams.action === 'see'"
                          type="hidden"
                          v-decorator="['convention.3.order', { initialValue: 4 }]"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- 验收款 END-->
              </a-row>

              <a-row class="row-in-col" type="flex" align="middle">
                <!-- 质保金 -->
                <a-col :span="20">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="4" :offset="1">
                      <a-form-item>
                        <a-checkbox
                          :disabled="this.$parent.routeParams.action === 'see'"
                          @change="checkboxChange"
                          v-decorator="['convention.1.selected', { initialValue: false, valuePropName: 'checked' }]"
                        >
                          <span class="checkbox-innerspan mar-l0">质保金</span>
                        </a-checkbox>
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item class="item-select">
                        <a-select
                          class="select-prop"
                          :disabled="this.$parent.routeParams.action === 'see'"
                          v-decorator="[
                            'convention.1.number',
                            { initialValue: 3, rules: [{ required: true, message: '选择比例' }] },
                          ]"
                          @change="conventionChange(1, $event)"
                        >
                          <a-select-option :value="1">1%</a-select-option>
                          <a-select-option :value="2">2%</a-select-option>
                          <a-select-option :value="3">3%</a-select-option>
                          <a-select-option :value="4">4%</a-select-option>
                          <a-select-option :value="5">5%</a-select-option>
                          <a-select-option :value="6">6%</a-select-option>
                          <a-select-option :value="7">7%</a-select-option>
                          <a-select-option :value="8">8%</a-select-option>
                          <a-select-option :value="9">9%</a-select-option>
                          <a-select-option :value="10">10%</a-select-option>
                          <a-select-option :value="11">11%</a-select-option>
                          <a-select-option :value="12">12%</a-select-option>
                          <a-select-option :value="13">13%</a-select-option>
                          <a-select-option :value="14">14%</a-select-option>
                          <a-select-option :value="15">15%</a-select-option>
                        </a-select>
                        <span class="checkbox-innerspan">折算金额: {{ c1 }}</span>
                      </a-form-item>
                    </a-col>
                    <a-col :span="7">
                      <a-form-item>
                        <span class="checkbox-innerspan">付款日期</span>
                        <a-date-picker
                          class="date"
                          :disabled="this.$parent.routeParams.action === 'see'"
                          v-decorator="[
                            'convention.1.date',
                            { initialValue: cQualityDate, rules: [{ required: true, message: '选择付款日期！' }] },
                          ]"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-item>
                        <a-input
                          :disabled="this.$parent.routeParams.action === 'see'"
                          placeholder="备注信息"
                          v-decorator="['convention.1.remarks']"
                        />
                      </a-form-item>
                      <a-form-item>
                        <a-input
                          :disabled="this.$parent.routeParams.action === 'see'"
                          type="hidden"
                          v-decorator="['convention.1.order', { initialValue: 5 }]"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- 质保金 END-->
              </a-row>
            </a-col>
          </a-row>
        </div>
        <a-form-item class="btns-grop">
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getQueryOne, saveSettlementMethod, deleteQueryOne, checkRemoveSettle } from '@/api/contractListManagement'
import moment from 'moment'

export default {
  name: 'Step3',
  components: {},
  props: {
    queryonedata: {
      type: Object,
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  data() {
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
      // fqualityDate: moment(), // 非常规-质保金-付款日期
      // fadvanceDate: moment(), // 非常规--预付款-付款日期
      // fprogressDate: moment(), // 非常规--进度款-付款日期
      // fpaymentForGoodsDate: moment(), // 非常规--提货款-付款日期
      // fAcceptDate: moment(), // 非常规--验收款-付款日期

      // 常规--折算金额
      cQualityAmount: (queryOneData.totalAmount * 3) / 100, // 常规--质保金折算金额
      cadvanceAmount: (queryOneData.totalAmount * 30) / 100, // 常规--预付款折算金额
      cprogressAmount: 0, // 常规--进度款折算金额
      cpaymentForGoodsAmount: 0, // 常规--提货款折算金额
      cAcceptAmount: 0, // 常规--验收款

      // 非常规--折算金额
      // fqualityAmount: (queryOneData.unConventionalMoney * 3) / 100, // 常规--质保金折算金额
      // fadvanceAmount: (queryOneData.unConventionalMoney * 30) / 100, // 常规--预付款折算金额
      // fprogressAmount: 0, // 常规--进度款折算金额
      // fpaymentForGoodsAmount: 0, // 常规--提货款折算金额
      // fAcceptAmount: 0, // 常规--验收款

      // 常规---款项百分比
      cqualitypercentage: 3, // 常规--质保金百分比
      cadvancePercentage: 30, // 常规--预付款百分比
      cprogressPayment: 0, // 常规--进度款百分比
      cpaymentForGoods: 0, // 常规--提货款百分比
      cAcceptPayment: 0, // 常规--验收款百分比
      // 非常规---款项百分比
      // fqualitypercentage: 3, // 非常规--质保金百分比
      // fadvancePercentage: 30, // 非常规--预付款百分比
      // fprogressPayment: 0, // 非常规--进度款百分比
      // fpaymentForGoods: 0, // 非常规--提货款百分比
      // fAcceptPayment: 0, // 非常规--验收款百分比

      fullAmount: this.queryonedata.fullAmount, // 是否全款
      product: {}, // 产品类型常规非常规数组
      // productTypes: [],
      qualityFrame: 3, // 主框架质保年限
      qualityElectronics: 1, // 电子质保年限
      qualityLayer: 3, // 图层质保年限
      qualityFramePre: 0, // 主框架质保增加百分比
      qualityElectronicsPre: 0, // 电子质保增加百分比
      qualityLayerPre: 0, // 图层质保增加百分比
      qualityLimit: 0, //常规桶质保期限
      qualityLimitPre: 0, //常规桶质保期限增加百分比
      conventionValue: [], // 常规产品复选框数组value值
      unConventionValue: [], // 非常规产品复选框数组value值
      c1: (queryOneData.conventionalMoney * 3) / 100, // 常规--质保金折算金额,
      c2: 0,
      c3: 0,
      c4: 0,
      c5: 0,
      id: 0, // 主键id 唯一
      percentages: 0,
      percentagesStatus: false,
      paymentDate: moment(),
      bucketType: 1, //1 智能桶合同  2 常规桶合同
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath === '/sales-management/contract-list-management/distributionContractList') {
        this.currentTab = 0
      }
    },
    queryOneData: function (newVal, oldVal) {
      this.fillMoney()
    },
  },
  beforeMount() {
    // debugger
  },
  mounted() {
    // console.log(this)
    console.log('queryOneData====', this.queryOneData)
    this.init()
    this.fullAmount = this.queryonedata.fullAmount
  },
  computed: {
    isSmartBucket: function () {
      return this.bucketType === 1 ? true : false
    },
    calcIncreaseTotalPayment: {
      get() {
        let _result = this.isSmartBucket
          ? (
              this.queryOneData.totalAmount *
              (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100)
            ).toFixed(2)
          : (this.queryOneData.totalAmount * (this.qualityLimitPre / 100)).toFixed(2)
        return _result
      },
      set(newValue) {},
    },
    calcAllPayment: function () {
      //debugger
      let _result = this.isSmartBucket
        ? (
            this.queryOneData.totalAmount *
            (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100 + 1)
          ).toFixed(2)
        : (this.queryOneData.totalAmount * (this.qualityLimitPre / 100 + 1)).toFixed(2)
      return _result
    },
  },
  methods: {
    init() {
      const that = this
      that.id = that.queryonedata.id

      const params = { id: that.queryonedata.id }
      //拆分流程
      if (this.$parent.routeParams.action == 'split') {
        params['type'] = 3
      }

      if (that.id > 0) {
        getQueryOne(params)
          .then((res) => {
            that.queryOneData = res.data
            that.form.setFieldsValue({
              contractId: res.data.id,
              fullAmount: res.data.fullAmount, // 是否全款 0全款  1非全款
              allPayment: res.data.totalAmount,
              totalAmount: res.data.totalAmount, // 总金额(已经判断过是否含税了)
              conventionalMoney: res.data.conventionalMoney, // 常规产品总价
              unConventionalMoney: res.data.unConventionalMoney, // 非常规产品总价
              product: res.data.product, // 常规产品或者非常规产品  0 常规产品 1非常规产品
              qualityFrame: res.data.qualityFrame ? res.data.qualityFrame : 3,
              qualityElectronics: res.data.qualityElectronics ? res.data.qualityElectronics : 1,
              qualityLayer: res.data.qualityLayer ? res.data.qualityLayer : 3,
              allPaymentDate: res.data.settlement ? moment(res.data.settlement.paymentDate) : moment(), // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
              routineSettlement: res.data.routineSettlement || [],
              unconventionalSettlement: res.data.unconventionalSettlement || [],
              increaseTotalPayment: res.data.increaseTotalPayment, // 增加总货款金额
              qualityLimit: res.data.qualityLimit || 1,
            })

            let routineSettlement = res.data.routineSettlement || []
            let unconventionalSettlement = res.data.unconventionalSettlement || []
            if (routineSettlement.length > 0) {
              that.fillConventionalData(routineSettlement)
            }
            if (unconventionalSettlement.length > 0) {
              that.fillConventionalData(unconventionalSettlement)
            }

            that.contractId = this.queryonedata.id
            that.id = this.queryonedata.id
            that.contractId = res.data.id
            that.fullAmount = res.data.fullAmount
            that.product = res.data.product
            that.allPayment = res.data.totalAmount
            that.conventionalMoney = res.data.conventionalMoney
            that.unConventionalMoney = res.data.unConventionalMoney
            that.increaseTotalPayment = res.data.increaseTotalPayment
            that.bucketType = res.data.bucketType

            that.qualityFrameChange(res.data.qualityFrame)
            that.qualityElectronicsChange(res.data.qualityElectronics)
            that.qualityLayerChange(res.data.qualityLayer)
            that.qualityLimitChange(res.data.qualityLimit)

            // [{id: 0, productType: 1}]     // [], [0,0], [1,1], [0,1,0]
            // that.productTypes = that.product.map((item) => {
            //   return item.productType
            // })
          })
          .catch((error) => {
            console.error(error)
          })
      }

      try {
        that.form.setFieldsValue({
          contractId: this.queryonedata.id,
          fullAmount: this.queryonedata.fullAmount, // 是否全款 0全款  1非全款
          allPayment: this.queryonedata.totalAmount,
          totalAmount: this.queryonedata.totalAmount, // 总金额(已经判断过是否含税了)
          conventionalMoney: this.queryonedata.conventionalMoney, // 常规产品总价
          // unConventionalMoney: this.queryonedata.unConventionalMoney, // 非常规产品总价
          product: this.queryonedata.product, // 常规产品或者非常规产品  0 常规产品 1非常规产品
          qualityFrame: this.queryonedata.qualityFrame || 3,
          qualityElectronics: this.queryonedata.qualityElectronics || 1,
          qualityLayer: this.queryonedata.qualityLayer || 3,
          allPaymentDate: this.queryonedata.settlement ? moment(this.queryonedata.settlement.paymentDate) : moment(), // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
          routineSettlement: this.queryonedata.routineSettlement || [],
          unconventionalSettlement: this.queryonedata.unconventionalSettlement || [],
          increaseTotalPayment: this.queryonedata.increaseTotalPayment, // 增加总货款金额
        })
      } catch (err) {}
    },

    fillConventionalData(items) {
      let obj = {}
      let _percentage = 0
      items.map((item) => {
        // let suffix = item.productType === 0 ? 'convention' : 'unConvention'
        _percentage += parseFloat(item.percentage)
        obj[`convention.${item.moneyType}.number`] = item.percentage
        obj[`convention.${item.moneyType}.selected`] = parseFloat(item.percentage) > 0 ? true : false
        obj[`convention.${item.moneyType}.data`] = moment(item.paymentDate)
        obj[`convention.${item.moneyType}.remarks`] = item.remarks
      })
      this.form.setFieldsValue({ ...obj })
      this.percentagesStatus = this.fullAmount === 0 ? true : _percentage === 100
    },
    // 主框架下拉改变
    qualityFrameChange(e) {
      console.log('主框架下拉改变', e)
      this.qualityFrame = e ? e : 3
      if (this.qualityFrame === 3) {
        this.qualityFramePre = 0
      } else if (this.qualityFrame === 4) {
        this.qualityFramePre = 3
      } else {
        this.qualityFramePre = 6
      }
      console.log(this.qualityFramePre)
    },

    // 上一步
    prevStep() {
      // this.$emit('prevStep', {...this.id})
      const id = this.id
      this.$emit('prevStep', id)
    },
    // handler 表单数据验证成功后回调事件
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    // 电子件质保年限
    qualityElectronicsChange(e) {
      console.log('电子件质下拉改变', e)
      this.qualityElectronics = e ? e : 1
      console.log('电子件质下拉改变', this.qualityElectronics)
      if (this.qualityElectronics === 1) {
        this.qualityElectronicsPre = 0
      } else {
        this.qualityElectronicsPre = 10
      }
      console.log(this.qualityElectronicsPre)
      // this.increaseTotalPayment = this.queryOneData.totalAmount * (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100)
      // this.allPayment = this.queryOneData.totalAmount * (1 + this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100 + 1)
    },
    // 图层质保年限
    qualityLayerChange(e) {
      console.log('图层质保年限', e)
      this.qualityLayer = e ? e : 3
      if (this.qualityLayer === 3) {
        this.qualityLayerPre = 0
      } else if (this.qualityLayer === 4) {
        this.qualityLayerPre = 3
      } else {
        this.qualityLayerPre = 6
      }
      console.log(this.qualityLayerPre)
      // this.increaseTotalPayment = this.queryOneData.totalAmount * (this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100)
      // this.allPayment = this.queryOneData.totalAmount * (1 + this.qualityFramePre / 100 + this.qualityElectronicsPre / 100 + this.qualityLayerPre / 100 + 1)
    },
    qualityLimitChange(e) {
      let _v = parseInt(e, 10)
      this.qualityLimit = _v
      if (_v === 1) {
        this.qualityLimitPre = 0
      } else if (_v === 2) {
        this.qualityLimitPre = 10
      } else if (_v === 3) {
        this.qualityLimitPre = 20
      } else {
        this.qualityLimitPre = 0
      }
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
          if (that.fullAmount === 0) {
            // 全款
            that.allPaymentDate = values.allPaymentDate.format('YYYY-MM-DD')
            const params = {
              contractId: that.id,
              qualityFrame: values.qualityFrame,
              qualityElectronics: values.qualityElectronics,
              qualityLayer: values.qualityLayer,
              qualityLimit: values.qualityLimit || 1,
              allPaymentDate: that.allPaymentDate, // 提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
              routineSettlement: [],
              unconventionalSettlement: [],
            }
            // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
            saveSettlementMethod(params)
              .then((res) => {
                console.log('校验成功，保存填写的信息，请求后端接口结果', res)
                that.id = res.data.id
                that.loading = false
                that.form.setFieldsValue({})
                if (status != 1) {
                  that.$emit('nextStep', { ...res.data })
                } else {
                  that.$message.success('保存成功')
                }
              })
              .catch((error) => {
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
            let percentagesStatus = this.checkPercentages()
            if (!percentagesStatus) {
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
              qualityLimit: values.qualityLimit || 1,
              //  paymentDate: that.paymentDate,    //提交的时候将moment对象格式的日期转化为后端接口需要的字符串格式的日期
              routineSettlement: this._getParam('convention') || [],
              // unconventionalSettlement: this._getParam('unConvention') || [],
            }
            // 校验成功，保存填写的信息，请求后端接口存起来，进入下一个页面
            saveSettlementMethod(params)
              .then((res) => {
                console.log('校验成功，保存填写的信息，请求后端接口结果', res)
                that.id = res.data.id
                that.loading = false
                that.form.setFieldsValue({})
                that.$emit('nextStep', { ...res.data })
              })
              .catch((error) => {
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

    /**
     * 获取常规和非常规的数据
     * @param name
     * @returns {Array}
     * @private
     */
    _getParam(name) {
      const result = []
      const convention = this.form.getFieldValue(name)
      console.log('convention----', Object.entries(convention))
      const temp = {
        contractId: this.queryOneData.id || 0,
        productType: name === 'convention' ? 0 : 1,
      }
      for (const [key, value] of Object.entries(convention)) {
        const { selected, number, date, remarks, order } = value
        if (selected) {
          result.push({
            ...temp,
            moneyType: key,
            percentage: Number(number),
            paymentDate: date.format('YYYY-MM-DD'),
            remarks: remarks || '',
            order: order,
          })
          // this.percentages = this.percentages + percentage
        }
      }
      return result
    },
    // 常规 - 下拉框发生改变时触发
    conventionChange(type, event) {
      this.$nextTick(() => {
        this[`c${type}`] = this._calculateAmount(event, this.queryOneData.totalAmount)
        if (type === 1 || type === 4) {
          this.autoFill()
        }
      })
    },
    // 非常规 - 下拉发生改变时触发
    // unConventionChange(type, event) {
    //   this.$nextTick(() => {
    //     this[`unC${type}`] = this._calculateAmount(event, this.queryOneData.unConventionalMoney)
    //     if (type === 1 || type === 4) {
    //       this.autoFill()
    //     }
    //   })
    // },
    // 计算金额
    _calculateAmount(percent, total) {
      if (!percent) return 0
      if (this.calcIncreaseTotalPayment > 0) {
        const amount = (percent / 100) * (total + Number(this.calcIncreaseTotalPayment))

        return amount.toFixed(2)
      } else {
        const amount = (percent / 100) * total
        return amount.toFixed(2)
      }
    },
    // 填充常规和非常规的折算金额
    fillMoney() {
      const that = this

      this.$nextTick(() => {
        // debugger
        const { convention } = that.form.getFieldsValue()
        console.log(convention)

        convention &&
          convention.map((item, index, arr) => {
            console.log(`c${index}`)

            if (item) {
              const res = that._calculateAmount(item.number, that.queryOneData.totalAmount)
              console.log(res)
              that[`c${index}`] = res
            }
          })
      })
    },
    checkboxChange(event) {
      if (this.$parent.routeParams.action === 'edit' && event.target.checked === false) {
        let idx = event.target.id.split('.')
        let arr = Number(idx[1])
        let data = new FormData()
        data.append('contractId', this.id)
        data.append('moneyType', arr)
        checkRemoveSettle(data).then((res) => {
          if (res.code === 200) {
            const { id, checked, defaultChecked } = event.target
            this.$nextTick(() => this.autoFill())
          } else {
            this.$message.error(res.msg)
            let obj = {}
            obj[`convention.${idx[1]}.selected`] = true
            this.form.setFieldsValue({ ...obj })
          }
        })
      } else {
        const { id, checked, defaultChecked } = event.target
        this.$nextTick(() => this.autoFill())
      }
      console.log(event.target)
    },
    checkPercentages() {
      let percentagesStatus = false
      // let isNormal = this.productTypes.includes(0) //常规
      // let isUnNormal = this.productTypes.includes(1) //非常规
      const { convention, unConvention } = this.form.getFieldsValue()
      // if (isNormal) {
      let calcConventionRoate = convention.reduce(function (accumulator, item) {
        return accumulator + (item.selected ? item.number : 0)
      }, 0)
      percentagesStatus = calcConventionRoate === 100
      // }
      // if (isUnNormal) {
      //   let calcUnConventionRoate = unConvention.reduce(function (accumulator, item) {
      //     return accumulator + (item.selected ? item.number : 0)
      //   }, 0)
      //   percentagesStatus = calcUnConventionRoate === 100
      // }
      return percentagesStatus
    },
    autoFill() {
      // let isNormal = this.productTypes.includes(0) //常规
      // let isUnNormal = this.productTypes.includes(1) //非常规
      // debugger
      this.autoFillAction(true)
      // isUnNormal && this.autoFillAction(false)
    },
    autoFillAction(isNormal = true) {
      //自动补全 100%
      let that = this
      const { convention } = this.form.getFieldsValue()
      let target = convention
      let targetKey = 'convention'
      let localKey = 'c'
      let money = that.queryOneData.totalAmount
      target = target.map((item, index) => {
        if (item && index >= 1) {
          item.__dateKey__ = `${localKey}${index}` //内部数据用
          item.__formKey__ = `${targetKey}.${index}.number` //显示用
        }
        return item
      })
      // debugger

      //是否选择了 质保金和预付款
      let rateSelected = target.filter((item, index) => item.selected && (index === 1 || index === 4))
      //是否选择了 进度款、提货款、验收款
      let currentSelectIsNotRate = target.filter((item, index) => item && item.selected && [2, 3, 5].includes(index))
      if (rateSelected.length > 0 && currentSelectIsNotRate.length > 0) {
        //剩余比例
        let _rate = 100
        let _oneSelected = currentSelectIsNotRate.length === 1
        _rate = rateSelected.reduce((rate, item) => rate - item.number, _rate)
        //减去用户填写的比例外 剩下的可分配比例
        _rate = _oneSelected
          ? _rate
          : currentSelectIsNotRate.reduce((rate, item) => (item.number > 0 ? rate - item.number : rate), _rate)

        let _rate_tmp = _rate
        if (_rate_tmp <= 0) return //无比例可分

        let _result = _oneSelected
          ? currentSelectIsNotRate
          : currentSelectIsNotRate.filter((item) => item.number === undefined || item.number === 0)
        if (_result.length <= 0) return
        let _avg = parseInt(_rate_tmp / _result.length)
        let obj = {}
        _result.map((item, index, arr) => {
          let _last = index === arr.length - 1
          if (!_last) {
            _rate_tmp = _rate_tmp - _avg
          }
          let _ss = _last ? _rate_tmp : _avg

          obj[item.__formKey__] = _ss
          this[item.__dateKey__] = this._calculateAmount(_ss, money)
        })

        Object.keys(obj).length > 0 && this.form.setFieldsValue(obj)
      }
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

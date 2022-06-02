<template>
  <a-spin :spinning="spinning">
    <div class="purchase-contract-addform-wrapper">
      <a-steps class="steps" :current="currentTab">
        <a-step v-for="s in stepList" :key="s.id" :title="s.title" />
      </a-steps>
      <div style="padding:20px 20px 0 20px;" v-if="stepList[currentTab]">
        <keep-alive :max="10">
          <component ref="currentComponent" :is="stepList[currentTab].component"></component>
        </keep-alive>
      </div>
      <div class="btn-wapper">
        <a-button type="primary" :disabled="currentTab === 0" @click="doAction('prev')">上一步</a-button>
        <a-button
          type="primary"
          v-show="currentTab < stepList.length - 1"
          :disabled="currentTab === stepList.length - 1"
          @click="doAction('next')"
          >下一步</a-button
        >
        <!-- <a-button type="primary" @click="doAction('save')">保存当前信息</a-button> -->
        <template v-if="isAdd || isEdit || isChange">
          <a-button
            type="primary"
            v-if="currentTab === stepList.length - 1"
            @click="doAction('submit', { submitStatus: 1 })"
            >保存</a-button
          >
          <a-button
            type="primary"
            v-if="currentTab === stepList.length - 1"
            @click="doAction('approval', { submitStatus: 2 })"
            >提交审核</a-button
          >
        </template>

        <template v-if="isApproval && currentTab === stepList.length - 1">
          <a-button type="primary" @click="passAction">通过</a-button>
          <a-button type="primary" @click="noPassAction">不通过</a-button>
        </template>
        <a-button type="primary" v-if="isView || currentTab === stepList.length - 1" @click="doAction('preview', { submitStatus: 1 })"
          >合同预览</a-button
        >
        <a-button type="danger" v-if="currentTab === stepList.length - 1" @click="doAction('exceptionPoints')"
          >异常原因</a-button
        >
        <a-button type="primary" @click="doAction('cancel')">退出</a-button>
      </div>
      <ExceptionPoints ref="exceptionPoints" />
      <Approval ref="approval" @opinionChange="opinionChange" />
    </div>
  </a-spin>
</template>

<script>
import Approval from './Approval'
import ExceptionPoints from './ExceptionPoints'
import Step0 from './Step0'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import { getDictionary } from '@/api/common'
import {
  purchaseContractAddOrUpdate,
  purchaseContractList,
  purchaseContractDetail,
  purchaseContractPageList,
  purchaseContractDel,
  purchaseContractApproval,
  purchaseContractRevocati,
  purchaseContractOrderList,
  purchaseContractOrderListRefresh,
  getDetailBySupplierId
} from '@/api/procurementModuleManagement'
import moment from 'moment'
import { getBuyRequirement } from '@/api/routineMaterial'
export default {
  name: 'purchase-contract-addform',
  components: { ExceptionPoints, Approval },
  provide() {
    return {
      addForm: this
    }
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    action: {
      type: String,
      default: () => 'add'
    },
    from: {
      type: String,
      default: () => 'procurement-module-management-order'
    },
    record: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      spinning: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      stepList: [
        {
          id: 1,
          title: '基本信息',
          component: Step0
        },
        {
          id: 2,
          title: '产品信息',
          component: Step1
        },
        {
          id: 3,
          title: '结算信息',
          component: Step2
        },
        {
          id: 4,
          title: '交货/验收',
          component: Step3
        },
        {
          id: 5,
          title: '乙方信息',
          component: Step4
        },
        {
          id: 6,
          title: '其他约定',
          component: Step5
        }
      ],
      currentTab: -1,
      submitParams: {},
      supplierInfo: null, // 供应商信息
      changeReasonsDefaults: null
    }
  },
  computed: {
    isAdd() {
      return this.action === 'add'
    },
    isView() {
      return this.action === 'view'
    },
    isEdit() {
      return this.action === 'edit'
    },
    isApproval() {
      return this.action === 'approval'
    },
    isChange() {
      // 变更合同
      return this.action === 'change'
    },
    isDisabled() {
      return this.isView || this.isApproval
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'procurement-module-management-purchase-contract-action') {
          this.init()
        }
      },
      immediate: true
    }
  },
  created() {
    const that = this
  },
  methods: {
    moment,
    async init() {
      const that = this
      that.spinning = true
      await getDictionary({ text: '采购合同' })
        .then(res => {
          that.changeReasonsDefaults = res.data.reduce((obj, item) => {
            obj[item.code.replace('caigou_contract_', '')] = +item.remarks
            return obj
          }, {})
        })
        .catch(err => {
          console.log(err)
          that.changeReasonsDefaults = {}
        })
      // 新增需要获取供应商信息
      if (that.isAdd && that.selectedRows.length > 0) {
        let [requirement, supplierInfo] = await Promise.all([
          that.getRequirement().then(res => {
            return res || {}
          }),
          getDetailBySupplierId({ supplierId: that.selectedRows[0].supplierId })
            .then(res => {
              return res.data || {}
            })
            .catch(err => {
              console.log(err)
              return {}
            })
        ])
        console.log(`requirement---------------------`)
        console.log(JSON.stringify(requirement, null, 2))
        console.log(`requirement---------------------`)

        console.log(`supplierInfo---------------------`)
        console.log(JSON.stringify(supplierInfo, null, 2))
        console.log(`supplierInfo---------------------`)
        that.supplierInfo = {
          ...that.selectedRows[0],
          requirement: requirement,
          supplierInfo: supplierInfo
        }

        console.log(`supplierInfo---------------------`)
        console.log(JSON.stringify(supplierInfo, null, 2))
        console.log(`supplierInfo---------------------`)

        // const nakedPrice = { 1: '含税运', 2: '含税不含运' }
        const { nakedPrice } = that.selectedRows[0]
        let __obj = {}
        if (+nakedPrice === 1) {
          __obj.taxType = 1
          __obj.freightType = 1
        } else if (+nakedPrice === 2) {
          __obj.taxType = 1
          __obj.freightType = 0
        }

        that.submitParams = {
          ...that.submitParams,
          ...__obj,
          purchaseUserId: that.userInfo.id,
          purchaseUserName: that.userInfo.trueName,
          purchasePhone: that.userInfo.mobile,
          supplierId: that.supplierInfo.supplierId,
          supplierName: that.supplierInfo.supplierName,
          signDate: moment(),
          invoiceType: that.supplierInfo.invoiceType,
          materialRate: that.supplierInfo.materialRate,
          settlementMode: that.supplierInfo.settlementMode,

          otherAppoint: {
            disputeSolveType: 1,
            signType: 1,
            freshChapterType: 0,
            nailEmail: that.userInfo.email,
            nailWeChat: that.userInfo.wxNum,
            unpaidFalsify: that.changeReasonsDefaults.unpaidFalsify,
            fullAmount: that.changeReasonsDefaults.fullAmount,
            breachContract: that.changeReasonsDefaults.breachContract
          },
          changeReasonsList: []
        }
      } else {
        // 别的情况需要获取合同详情
        let result_detail = await purchaseContractDetail({ id: that.record.id })
          .then(res => res.data)
          .catch(err => {
            console.log(err)
            return null
          })
        if (result_detail) {
          result_detail.orderList = that.$_.cloneDeep(result_detail.contractOrderDetailVos || [])
          result_detail.settlementList = that.$_.cloneDeep(result_detail.contractSettlementDetailVos || [])
          result_detail.secondPartyInfo = that.$_.cloneDeep(result_detail.contractSecondPartyInfoDetailVo || {})
          result_detail.otherAppoint = that.$_.cloneDeep(result_detail.contractOtherAppointDetailVo || {})

          delete result_detail.contractOrderDetailVos
          delete result_detail.contractSettlementDetailVos
          delete result_detail.contractSecondPartyInfoDetailVo
          delete result_detail.contractOtherAppointDetailVo
          that.submitParams = { ...result_detail }
        }
      }

      that.currentTab = 0
      that.spinning = false
    },
    async getRequirement() {
      const that = this
      let arr = that.selectedRows.map(item => {
        return new Promise(resolve => {
          getBuyRequirement({ materialId: item.materialId })
            .then(res => {
              resolve(res.data || {})
            })
            .catch(err => {
              resolve({})
              console.log(err)
            })
        })
      })

      let res = await Promise.all(arr)
      return res.reduce((a, b) => {
        return { ...a, ...b }
      }, {})
    },
    async doAction(type, params) {
      const that = this
      if (type === 'prev') {
        that.currentTab--
      } else if (type === 'next') {
        let result = await that.$refs['currentComponent'].validate()

        if (result.hasError) {
          return
        }
        that.submitParams = that.$_.assign(that.submitParams, result.data)
        console.log(JSON.stringify(that.submitParams, null, 2))
        that.currentTab++
      } else if (type === 'submit' || type === 'approval' || type === 'preview') {
        if (that.isView && type === 'preview') {
          that.$router.push({
            name: 'procurement-module-management-purchase-contract-preview',
            params: {
              contractId: that.submitParams.id,
              from: 'procurement-module-management-purchase-contract'
            }
          })
          return
        }
        let result = await that.$refs['currentComponent'].validate()
        if (result.hasError) {
          return
        }
        that.submitParams = that.$_.assign(that.submitParams, result.data)

        let _params = { ...that.submitParams, ...params, changeReasonsList: that.getExceptionPoints() }
        console.log(JSON.stringify(_params, null, 2))
        that.spinning = true
        purchaseContractAddOrUpdate(_params)
          .then(res => {
            that.spinning = false
            const { code, data, msg } = res
            that.$message.info(msg)
            if (code === 200) {
              if (type === 'preview') {
                that.$router.push({
                  name: 'procurement-module-management-purchase-contract-preview',
                  params: {
                    contractId: data,
                    from: 'procurement-module-management-purchase-contract'
                  }
                })
                return
              } else {
                that.$router.push({
                  name: 'procurement-module-management-purchase-contract'
                })
                return
              }
            }
          })
          .catch(err => {
            that.spinning = false
            that.$message.info(err.message)
          })
      } else if (type === 'cancel') {
        that.$router.push({
          name: 'procurement-module-management-purchase-contract'
        })
        return
      } else if (type === 'exceptionPoints') {
        let exceptionPoints = that.getExceptionPoints()
        if (exceptionPoints.length === 0) {
          that.$message.info('合同暂无异常信息')
          return
        }
        that.$refs.exceptionPoints.query(exceptionPoints)
        return
      }
    },
    getExceptionPoints() {
      const that = this
      let changeReasonsList = []

      let __submitParams = {
        ...that.submitParams,
        // 异常原因按钮最后一步才显示，currentComponent 指向最后一个组件
        otherAppoint: { ...that.$refs['currentComponent'].form }
      }
      const { __calInfo, orderList, otherAppoint, changeReason } = __submitParams
      let case1 = __calInfo.total / 10000 > that.changeReasonsDefaults.totalAmount
      if (case1) {
        let abnormalType = `合同总金额 > ${that.changeReasonsDefaults.totalAmount}万`
        let abnormalInfo = `
        <div>
          <span>合同金额【${that.$root._f('moneyFormatNumber')(__calInfo.materialFullAmountWithTax)}】</span>
          <span style="margin-left:10px;">运费【${that.$root._f('moneyFormatNumber')(
            __calInfo.freightFullAmountWithTax
          )}】</span>
        </div>
        <div>合计总金额【<span style="color:red;">${that.$root._f('moneyFormatNumber')(__calInfo.total)}</span>】</div>
        `
        changeReasonsList.push({ abnormalType, abnormalInfo, changeReason })
      }

      orderList
        .filter(o => o._sourcePurchaseNum !== o.purchaseNum)
        .map(o => {
          if (o._sourcePurchaseNum !== o.purchaseNum) {
            let abnormalType = `修改采购数量`
            let abnormalInfo = `
            <div>物料名称【${o.materialName}】 物料代码【${o.materialCode}】</div>
            <div>计划采购数量【${o._sourcePurchaseNum}】&nbsp;&nbsp;实际采购数量【<span style="color:red;">${o.purchaseNum}</span>】</div>
            `
            changeReasonsList.push({ abnormalType, abnormalInfo, changeReason })
          }
        })
      const { unpaidFalsify, fullAmount, breachContract } = otherAppoint

      if (unpaidFalsify !== +that.changeReasonsDefaults.unpaidFalsify) {
        let abnormalType = `违约责任修改`
        let abnormalInfo = `
        <div>规定：甲方逾期支付货款，每逾期一日则按照未付金额的 【${
          that.changeReasonsDefaults.unpaidFalsify
        }%】 支付违约金</div>
        <div>实际：甲方逾期支付货款，每逾期一日则按照未付金额的 【<span style="color:red;">${unpaidFalsify ||
          0}%</span>】支付违约金</div>
        `
        changeReasonsList.push({ abnormalType, abnormalInfo, changeReason: otherAppoint.changeReason })
      }
      if (fullAmount !== +that.changeReasonsDefaults.fullAmount) {
        let abnormalType = `违约责任修改`
        let abnormalInfo = `
        <div>规定：违约金总额不得超过合同总价款的 【${that.changeReasonsDefaults.fullAmount}%】 </div>
        <div>实际：违约金总额不得超过合同总价款的 【<span style="color:red;">${fullAmount || 0}%</span>】</div>
        `
        changeReasonsList.push({ abnormalType, abnormalInfo, changeReason: otherAppoint.changeReason })
      }
      if (breachContract !== +that.changeReasonsDefaults.breachContract) {
        let abnormalType = `违约责任修改`
        let abnormalInfo = `
        <div>规定：乙方逾期交货，每逾期一日则按照合同总价款的 【${
          that.changeReasonsDefaults.breachContract
        }%】 支付违约金</div>
        <div>实际：乙方逾期交货，每逾期一日则按照合同总价款的 【<span style="color:red;">${breachContract ||
          0}%</span>】支付违约金</div>
        `
        changeReasonsList.push({ abnormalType, abnormalInfo, changeReason: otherAppoint.changeReason })
      }
      return changeReasonsList
    },
    pick(source, keys) {
      let obj = {}
      keys.forEach(k => {
        obj[k] = source[k]
      })
      return obj
    },
    /**审批 */
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      purchaseContractApproval(values)
        .then(res => {
          that.spinning = false
          that.$message.info(res.msg)
          if (res.code === 200) {
            that.$router.push({
              name: 'procurement-module-management-purchase-contract',
            })
          }
          return
        })
        .catch(err => {
          that.spinning = false
          that.$message.info(err.message)
        })
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion
      })
    }
  }
}
</script>

<style lang="less" scoped>
.purchase-contract-addform-wrapper {
  padding: 30px;
  background-color: #fff;
  .btn-wapper {
    margin-top: 20px;
    text-align: center;
    /deep/ .ant-btn {
      margin: 0 10px;
    }
  }
}
</style>

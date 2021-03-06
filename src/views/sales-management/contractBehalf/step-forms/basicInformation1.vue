<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <template v-if="routeParams.action === 'see'">
        <a-button class="fl-r" type="danger" @click="goBackAction1" icon="left">返回</a-button>
        <a-button class="fl-r" type="danger" @click="showModal('edit', idx)" icon="left">预览</a-button>
      </template>
      <template v-else>
        <a-button class="fl-r" type="danger" @click="goBackAction" icon="left">返回</a-button>
        <!-- <a-button class="fl-r" type="danger" @click="saveStep">保存当前信息</a-button> -->
      </template>
    </div>
    <div class="content">
      <step1 v-if="currentTab === 0" ref="step1" key="step1" @nextStep="nextStep" :queryonedata="queryonedata" />
      <step2
        v-if="currentTab === 1"
        ref="step2"
        key="step2"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :queryonedata="queryonedata"
      />
      <step3
        v-if="currentTab === 2"
        ref="step3"
        key="step3"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :queryonedata="queryonedata"
      />
      <step4
        v-if="currentTab === 3"
        ref="step4"
        key="step4"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :queryonedata="queryonedata"
      />
      <step5
        v-if="currentTab === 4"
        ref="step5"
        key="step5"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :queryonedata="queryonedata"
      />
      <step6
        v-if="currentTab === 5"
        ref="step6"
        key="step6"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :queryonedata="queryonedata"
      />
      <step7
        v-if="currentTab === 6"
        ref="step7"
        key="step7"
        @prevStep="prevStep"
        @finish="finish"
        :queryonedata="queryonedata"
      />
    </div>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="基本信息" />
        <a-step title="产品信息" />
        <a-step title="结算方式" />
        <a-step title="运输方式／交货地址" />
        <a-step title="乙方信息" />
        <a-step title="其他信息" />
        <a-step title="附加条款" />
      </a-steps>
    </a-card>
  </div>
</template>

<script>
import { contractDetail } from '@/api/contractListManagement'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'
import Step7 from './Step7'
export default {
  name: 'BasicInformation2',
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6,
    Step7,
  },
  props: {},
  data() {
    return {
      form: this.$form.createForm(this),
      idx: undefined,
      currentTab: 0, // tab切换，当前tab
      queryonedata: {}, // 这是获取到的单个节点所有返回数据，要通过父组件传给子组件
      routeParams: {
        //路由参数
        idx: null,
        id: null, //合同编号
        action: 'add', //来源 新增 add  修改 edit 拆分 split 查看 see
        from: 'distributionContractList', //处理完跳转的路由名称
      },
      __isFinished: false, //完结提交标志
      show: false,
    }
  },
  created() {
    this.queryonedata = {}
    let that = this
    if (that.$route.params.action === 'edit' || that.$route.params.action === 'see') {
      this.idx = that.$route.params.id
      contractDetail({ purchaseContractId: that.$route.params.id }).then((res) => {
        console.log(res.data)
        let purch = res.data.purchaseContractDetailVo
        let infos = res.data.purchaseContractInfoDetailVo
        let react = {
          id: res.data.id,
          purchaseContractSaveBo: res.data.purchaseContractDetailVo, //基本信息
          purchaseContractInfoSaveBo: res.data.purchaseContractInfoDetailVo, //其他信息
          purchaseContractProductSaveBoList: res.data.purchaseContractProductDetailVoList, //产品信息列表
          purchaseContractSettlementSaveBoList: res.data.purchaseContractSettlementDetailVoList, // 结算方式
          totalAmount: res.data.totalAmount, //总金额
          lowPriceDesc: purch.lowPriceDesc,
          frameWarranty: purch.frameWarranty, //主框架
          electricWarranty: purch.electricWarranty, //电器
          coatingWarranty: purch.coatingWarranty, //图层
          qualityWarranty: purch.qualityWarranty, //常规桶质保期
          //运输数据
          detailDeliveryAreaIds: purch.detailDeliveryAreaIds,
          deliveryPlace: purch.deliveryPlace,
          deliveryAreaId: purch.deliveryAreaId,
          freightType: purch.freightType,
          transportMode: purch.transportMode,
          deliveryOther: purch.deliveryOther,
          deliveryDate: purch.deliveryDate,
          //乙方信息
          customerWxNum: purch.customerWxNum,
          customerPhone: purch.customerPhone,
          customerFullName: purch.customerFullName,
          customerBankName: purch.customerBankName,
          customerTfn: purch.customerTfn,
          customerBankUser: purch.customerBankUser,
          customerEmail: purch.customerEmail,
          customerAddress: purch.customerAddress,
          customerPostcode: purch.customerPostcode,
          customerBankAccount: purch.customerBankAccount,
          // 附加信息
          additionalTreaty: infos.additionalTreaty,
        }

        this.queryonedata = { ...react }
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    //用户未点击删除按钮，离开此页面 自动触发删除订单操作
    try {
      if (from.name === 'basicInformation2' && !this.__isFinished) {
        this.goBackActionSilent()
      }
    } catch (err) {
      console.log(err)
    }
    next()
  },
  mounted() {
    this.currentTab = 0
    this.routeParams = Object.assign({}, this.routeParams, this.$route.params)
    this.__isFinished = false
    if (this.routeParams.show) {
      this.show = this.routeParams.show
    }
  },
  methods: {
    // 返回
    // goBack(){
    //   this.$router.push({name:'distributionContractList'})
    //   this.currentTab===0
    // },
    showModal(action, record) {
      // 选择三方合同
      this.$router.push({
        name: 'previewTripartiteContracts',
        params: { queryOneData: { id: record }, action: action },
      })
      console.log('queryOneData:record', record)
    },

    // 点击下一步
    nextStep(data) {
      this.id = data.id
      this.queryonedata = { ...this.queryonedata, ...data }
      if (this.currentTab < 7) {
        this.currentTab = this.currentTab + 1
      }
    },
    prevStep(e) {
      console.log('点击上一步，相当于修改操作,带过来的参数', e)
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish() {
      this.currentTab = 0
    },

    goBackAction1() {
      const _this = this
      //_this.$router.go(-1)
      _this.$router.push({ name: _this.routeParams.from, params: { ..._this.routeParams } })
    },
    goBackAction() {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确定要放弃本条合同的操作吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          //清空Local Storage 中的数据  然后返回

          //_this.$router.go(-1)
          _this.$router.push({ name: _this.routeParams.from, params: { ..._this.routeParams } })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    goBackActionSilent() {
      const _this = this
      // 清空Local Storage中的数据
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
.active {
  display: none;
}
</style>

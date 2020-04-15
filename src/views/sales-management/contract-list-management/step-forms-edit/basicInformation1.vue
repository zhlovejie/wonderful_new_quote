<template>
  <div class="content-wrap">
    <div class="content">
      <step1 v-if="currentTab === 0" ref="step1" @nextStep="nextStep" :queryonedata="queryonedata"/>
      <step2 v-if="currentTab === 1" ref="step2" @nextStep="nextStep" @prevStep="prevStep" :queryonedata="queryonedata" />
      <step3 v-if="currentTab === 2" ref="step3" @nextStep="nextStep" @prevStep="prevStep" :queryonedata="queryonedata" />
      <step4 v-if="currentTab === 3" ref="step4" @nextStep="nextStep" @prevStep="prevStep" :queryonedata="queryonedata" />
      <step5 v-if="currentTab === 4" ref="step5" @nextStep="nextStep" @prevStep="prevStep" :queryonedata="queryonedata" />
      <step6 v-if="currentTab === 5" ref="step6" @nextStep="nextStep" @prevStep="prevStep" :queryonedata="queryonedata" />
      <step7 v-if="currentTab === 6" ref="step7" @prevStep="prevStep" @finish="finish" :queryonedata="queryonedata" />
    </div>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="基本信息" />
        <a-step title="产品信息" />
        <a-step title="结算方式" />
        <a-step title="运输方式／交货地址" />
        <a-step title="乙方信息" />
        <a-step title="其他信息" />
        <a-step :class="{ active: isActive }" title="附加条款" />
      </a-steps>
    </a-card>
  </div>
</template>

<script>
import { getQueryOne } from '../../../../api/contractListManagement'
import moment from 'moment'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'
import Step7 from './Step7'
export default {
  name: 'BasicInformation1',
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6,
    Step7
  },
  props: {},
  data () {
    return {
      // form
      form: this.$form.createForm(this),
      signDate: {
        rules: [{ type: 'object', required: true, message: '请选择日期!' }]
      },
      currentTab: 0, // tab切换，当前tab
      contractNum: '', // 合同编号
      saleCustomers: {}, // 客户名称数组
      customerId: 0, // 客户id
      saleUser: {}, // 销售经理名称列表
      saleUserId: 0, // 选中的销售经理id
      signDate: moment(), // 签订日期, 默认今天
      disabled: false, // 是否含税启用/禁用
      id: this.$route.params.id, // 这个是主键id,名称是唯一的，要在7个组件中都能使用，别的地方不要定义成id
      queryonedata: {}, // 这是获取到的单个节点所有返回数据，要通过父组件传给子组件
      isActive: true, // 第七步是否隐藏
      contractAttribute: 0
    }
  },
  computed: {
    // key() {
    //   return this.$route.path + Math.random();
    // }
  },
  watch: {
    // $route (to, from) {
    //   console.log('this.$route.params.id--------', this.$route.params.id)
    //   console.log('from.fullPath--------', from.fullPath)
    //   if (from.fullPath === '/sales-management/contract-list-management/distributionContractList') {
    //     this.currentTab = 0
    //
    //     this.form = this.$form.createForm(this),
    //     this.signDate = {
    //       rules: [{ type: 'object', required: true, message: '请选择日期!' }]
    //     },
    //     this.currentTab = 0, // tab切换，当前tab
    //     this.contractNum = '', // 合同编号
    //     this.saleCustomers = {}, // 客户名称数组
    //     this.customerId = 0, // 客户id
    //     this.saleUser = {}, // 销售经理名称列表
    //     this.saleUserId = 0, // 选中的销售经理id
    //     this.signDate = moment(), // 签订日期, 默认今天
    //     this.disabled = false, // 是否含税启用/禁用
    //     this.id = this.$route.params.id, // 这个是主键id,名称是唯一的，要在7个组件中都能使用，别的地方不要定义成id
    //     this.queryonedata = {}, // 这是获取到的单个节点所有返回数据，要通过父组件传给子组件
    //     this.isActive = true, // 第七步是否隐藏
    //     this.contractAttribute = 0
    //   }
    // }

    '$route':{
      immediate:true,
      handler:function(to,from){
        console.log('this.$route.params.id--------', this.$route.params.id)
        this.id = this.$route.params.id
        this.$nextTick(() =>this.initAlldata())
      }
    }
  },
  mounted () {
    console.log('edit bascinfo calledd....')
    // debugger
    // this.init()
    // this.queryonedata.id = this.id
    // console.log("this.queryonedata.id:" + this.queryonedata.id)
    // console.log('在第二步的时候点击返回，返回到列表页，再在列表页点击申请，却进入到了第二步，所以this.currentTab', this.currentTab)
    // this.initAlldata()
  },
  methods: {
    init () {},
    // 返回
    // goBack(){
    //   this.$router.push({name:'distributionContractList'})
    //   this.currentTab===0
    // },
    // 点击下一步
    nextStep (data) {
      this.id = data.id
      this.queryonedata = { ...this.queryonedata, ...data }
      if (this.currentTab < 7) {
        this.currentTab = this.currentTab + 1
      }
      if (this.queryonedata.contractAttribute === 0) {
        this.isActive = true
      } else {
        this.isActive = false
      }
      console.log('isActive', this.isActive)
    },
    // handler
    prevStep (e) {
      this.id = e
      console.log('点击上一步，相当于修改操作,带过来的参数', e)
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
      // 点击上一步，相当于修改操作
      // const params={id:e}
      const params = { id: this.id }
      console.log('点击上一步传入的参数', params)
      getQueryOne(params).then((res) => {
        console.log('点击上一步,请求的结果', res)
        this.queryonedata = res.data
        console.log('这个是父页面的打印，要传入到子页面的数据对象', this.queryonedata)
        // this.contractNum = res.data.contractNum
        // that.id=res.data.id
        // that.loading = false
        // this.contractNum=res.data.contractNum
      }).catch(error => {
        console.error(error)
      })
    },
    initAlldata(){
      console.log('initAlldata called....')
      const params = { id: this.id }
      getQueryOne(params).then((res) => {
        this.queryonedata = res.data
      }).catch(error => {
        console.error(error)
      })
    },
    finish () {
      this.currentTab = 0
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
  .active{
    display: none;
  }
</style>

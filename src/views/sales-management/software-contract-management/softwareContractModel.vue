<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="danger" @click="goBackAction" icon="left">返回</a-button>
      <a-button class="fl-r" type="danger" @click="saveStep">保存当前信息</a-button>
    </div>
    <div class="content">
      <step1 v-if="currentTab === 0" ref="step1" key="step1" @nextStep="nextStep" :queryonedata="queryonedata" />
      <step2 v-if="currentTab === 1" ref="step2" key="step2" @nextStep="nextStep" @prevStep="prevStep" :queryonedata="queryonedata" />
      <step3 v-if="currentTab === 2" ref="step3" key="step3" @nextStep="nextStep" @prevStep="prevStep" :queryonedata="queryonedata" />
      <step4 v-if="currentTab === 3" ref="step4" key="step4" @nextStep="nextStep" @prevStep="prevStep" :queryonedata="queryonedata" />
      <step5 v-if="currentTab === 4" ref="step5" key="step5" @nextStep="nextStep" @prevStep="prevStep" :queryonedata="queryonedata" />
      <step6 v-if="currentTab === 5" ref="step6" key="step6" @nextStep="nextStep" @prevStep="prevStep" :queryonedata="queryonedata" />
    </div>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="基本信息" />
        <a-step title="产品信息" />
        <a-step title="产品详情" />
        <a-step title="支付、交付与验收" />
        <a-step title="乙方信息" />
        <a-step title="补充协议" />
      </a-steps>
    </a-card>
  </div>
</template>

<script>
import { getSoftwareContractQueryOne, deleteSoftwareContractQueryOne } from '@/api/contractListManagement'

import Step1 from './step-forms/Step1'
import Step2 from './step-forms/Step2'
import Step3 from './step-forms/Step3'
import Step4 from './step-forms/Step4'
import Step5 from './step-forms/Step5'
import Step6 from './step-forms/Step6'

export default {
  name: 'softwareContractModel',
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6
  },
  props: {},
  data () {
    return {
      currentTab: 0, // tab切换，当前tab
      id: 0, // 这个是主键id,名称是唯一的，要在7个组件中都能使用，别的地方不要定义成id
      queryonedata: {}, // 这是获取到的单个节点所有返回数据，要通过父组件传给子组件
      routeParams:{ //路由参数
        id:null, //合同编号
        action:'add', //来源 新增 add  修改 edit 
        from : 'softwareContractList' //处理完跳转的路由名称
      },
      __isFinished:false //完结提交标志
    }
  },
  computed: {
    
  },
  watch: {
    $route (to, from) {
      if(to.name === 'softwareContractModel'){
        this.currentTab = 0
        this.__isFinished = false
        this.routeParams = Object.assign({},this.routeParams,this.$route.params)
        if(this.routeParams.id){
          this.id = this.routeParams.id
          this.resetQueryonedata(this.routeParams.id)
        }
      }
    }
  },
  beforeRouteLeave (to, from ,next){
    //用户未点击删除按钮，离开此页面 自动触发删除订单操作
    try{
      if(from.name === 'softwareContractModel' && !this.__isFinished){
        this.goBackActionSilent() 
      }
    }catch(err){
      console.log(err)
    }
    next()
  },
  mounted () {
    this.currentTab = 0
    this.routeParams = Object.assign({},this.routeParams,this.$route.params)
    this.__isFinished = false 
    if(this.routeParams.id){
      this.id = this.routeParams.id
      this.resetQueryonedata(this.routeParams.id)
    }
  },
  methods: {
    //当点击保存按钮时，保存当前页输入信息，不跳入下一步
    saveStep(){
      console.log('this.currentTab--------', this.currentTab)
      switch (this.currentTab){
        case 0:
          this.$refs.step1.nextStep(1);
          break;
        case 1:
          this.$refs.step2.nextStep(1);
          break;
        case 2:
          this.$refs.step3.nextStep(1);
          break;
        case 3:
          this.$refs.step4.nextStep(1);
          break;
        case 4:
          this.$refs.step5.nextStep(1);
          break;
        case 5:
          this.$refs.step6.lastSubmit(0,1);
          break;
      }
    },
    // 点击下一步
    nextStep (data) {
      this.id = data.id
      this.queryonedata = { ...this.queryonedata, ...data }
      if (this.currentTab < 6) {
        this.currentTab = this.currentTab + 1
      }
    },
    // handler
    prevStep (e) {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
      // 点击上一步，相当于修改操作
      const params = { id: this.queryonedata.id }
      getSoftwareContractQueryOne(params).then((res) => {
        this.queryonedata = res.data
      }).catch(error => {
        console.error(error)
      })
    },

    resetQueryonedata(id){
      getSoftwareContractQueryOne({ id:id }).then((res) => {
        this.queryonedata = res.data
      }).catch(error => {
        console.error(error)
      })
    },
    finish () {
      this.currentTab = 0
    },
    goBackAction(){
      const _this = this
      this.$confirm({
        title: '警告',
        content: `确定要放弃本条合同的操作吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          if(_this.queryonedata && _this.queryonedata.id){
            const params = { id: _this.queryonedata.id}

            if(_this.routeParams.action === 'add'){  //新增
              params.contractModifyFlag = 0
            }else if(_this.routeParams.action === 'edit'){ //驳回修改
              params.contractModifyFlag = 1
            }

            deleteSoftwareContractQueryOne(params).then((res) => {
              if (res.code == 200) {
                if(_this.routeParams.action === 'add'){
                  _this.$message.info('合同已删除')
                }
                _this.$router.push({ name: _this.routeParams.from }) //新增修改走此路由
              } else {
                _this.$message.error(res.msg)
              }
            })
          }else{
            _this.$message.info('合同已删除')
            _this.$router.push({ name: _this.routeParams.from })
          }
        }
      })
    },
    goBackActionSilent(){
      const _this = this
      if(_this.queryonedata && _this.queryonedata.id){
        const params = { id: _this.queryonedata.id}
        if(_this.routeParams.action === 'add'){  //新增
          params.contractModifyFlag = 0
        }else if(_this.routeParams.action === 'edit'){ //驳回修改
          params.contractModifyFlag = 1
        }
        deleteSoftwareContractQueryOne(params)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>

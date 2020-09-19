<template>
  <div class="content-wrap">
    <div class="top-right clearfix">
      <a-button class="fl-r" type="primary" @click="goBackAction" icon="left">返回</a-button>
      <!-- <a-button class="fl-r" type="danger" @click="saveStep">保存当前信息</a-button> -->
    </div>
    <div class="content">
      <step1
        v-if="currentTab === 0"
        ref="step1"
        key="step1"
        @nextStep="nextStep"
        :queryonedata="queryonedata"
      />
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
    </div>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="物流信息" />
        <a-step title="承运方" />
        <a-step title="货物信息" />
        <a-step title="驾驶员信息" />
        <a-step title="货物合同" />
      </a-steps>
    </a-card>
  </div>
</template>

<script>
import { getQueryOne } from '@/api/distribution-management'
import moment from 'moment'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
export default {
  name: 'BasicInform',
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
  },
  props: {},
  data() {
    return {
      currentTab: 0, // tab切换，当前tab
      disabled: false, // 是否含税启用/禁用
      id: 0, // 这个是主键id,名称是唯一的，要在7个组件中都能使用，别的地方不要定义成id
      queryonedata: {}, // 这是获取到的单个节点所有返回数据，要通过父组件传给子组件
      show: false,
      routeParams: {},
    }
  },
  created() {
    this.queryonedata = {}
    if (this.$route.params.typeName === 'see' || this.$route.params.typeName === 'edit-salary') {
      getQueryOne({ id: this.$route.params.action.id }).then((res) => {
        console.log(res.data)
        this.queryonedata = { ...res.data }
      })
    }
  },
  mounted() {
    this.currentTab = 0
    this.routeParams = Object.assign({}, this.routeParams, this.$route.params)
  },
  methods: {
    nextStep(data) {
      console.log(data)
      this.queryonedata = { ...this.queryonedata, ...data }
      console.log(this.queryonedata)
      if (this.currentTab < 5) {
        this.currentTab = this.currentTab + 1
      }
    },
    //当点击保存按钮时，保存当前页输入信息，不跳入下一步
    saveStep() {
      switch (this.currentTab) {
        case 0:
          this.$refs.step1.nextStep(1)
          break
        case 1:
          this.$refs.step2.nextStep(1)
          break
        case 2:
          this.$refs.step3.nextStep(1)
          break
        case 3:
          this.$refs.step4.nextStep(1)
          break
        case 4:
          this.$refs.step5.lastSubmit(0, 1)
          break
      }
    },
    // handler
    prevStep(e) {
      // console.log('点击上一步，相当于修改操作,带过来的参数', e)
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish() {
      this.currentTab = 0
    },
    goBackAction() {
      const _this = this
      _this.$router.push({ name: 'distribution_logistics' })
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

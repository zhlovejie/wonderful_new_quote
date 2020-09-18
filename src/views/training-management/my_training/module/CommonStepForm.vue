<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleCancel"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-card :bordered="false">
      <div class="content">
        <step1
          v-if="currentTab === 0"
          ref="step1"
          key="step1"
          @nextStep="nextStep"
          :queryonedata="queryonedata"
          :type="type"
        />
        <step2
          v-if="currentTab === 1"
          ref="step2"
          key="step2"
          @nextStep="nextStep"
          @prevStep="prevStep"
          :queryonedata="queryonedata"
          :type="type"
        />
        <step3
          v-if="currentTab === 2"
          ref="step3"
          key="step3"
          @nextStep="nextStep"
          @prevStep="prevStep"
          :queryonedata="queryonedata"
          :type="type"
        />
        <step4
          v-if="currentTab === 3"
          ref="step4"
          key="step4"
          @nextStep="nextStep"
          @prevStep="prevStep"
          :queryonedata="queryonedata"
          :type="type"
          :trainType="trainType"
        />
      </div>
      <a-card :bordered="false">
        <a-steps class="steps" :current="currentTab">
          <a-step title="培训介绍" />
          <a-step title="课程安排" />
          <a-step title="受训人员" />
          <a-step title="培训资料" />
        </a-steps>
      </a-card>
    </a-card>
  </a-modal>
</template>

<script>
import Step1 from './CommonCustomerForm'
import Step2 from './LinkmanForm'
import Step3 from './Step3'
import Step4 from './Step4'
import { focusDetailVo, dispersedDetailVo, meetinglistMyFile } from '@/api/training-management'

export default {
  name: 'CommonStepForm',
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
  },
  data() {
    return {
      visible: false, // 表单对话框是否可见
      title: '',
      currentTab: 0,
      customer: {},
      linkmans: [],
      type: '',
      trainType: '',
      record: {},
      routeParams: {},
      queryonedata: {}, // 这是获取到的单个节点所有返回数据，要通过父组件传给子组件
      subType: 'add', // 新增还是修改的标记
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改集中培训'
      }
      let txt = this.isView ? '查看' : this.Examine ? '审核' : '新增'
      return `${txt}集中培训`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    Examine() {
      return this.type === 'examine'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView
    },
  },
  mounted() {
    this.currentTab = 0
  },
  methods: {
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      this.trainType = record.trainType
      if (this.type === 'add') {
        this.queryonedata = {}
      }
      if (this.type === 'examine') {
        // 处理详情
        this.currentTab = 3
        meetinglistMyFile({ trainId: record.id, trainType: record.trainType }).then((res) => {
          this.queryonedata = { ...res.data }
        })
      }

      if (this.type === 'view') {
        if (record.trainType === 1) {
          focusDetailVo({ trainId: record.id }).then((res) => {
            this.queryonedata = { ...res.data }
          })
        } else {
          dispersedDetailVo({ trainId: record.id }).then((res) => {
            this.queryonedata = { ...res.data }
          })
        }
      }
    },

    nextStep(data) {
      console.log(data)
      this.queryonedata = { ...this.queryonedata, ...data }
      console.log(this.queryonedata)
      if (this.currentTab < 4) {
        this.currentTab = this.currentTab + 1
      }
      if (this.currentTab === 4) {
        this.$emit('finish')
        this.visible = false
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

    handleCancel() {
      this.currentTab = 0
      this.visible = false
    },
  },
}
</script>

<style lang="less" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>

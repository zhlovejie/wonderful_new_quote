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
import { addCustomer, getOneCustomer, editCustomer } from '@/api/customer'
import { queryList } from '@/api/linkman'

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
      record: {},
      routeParams: {},
      queryonedata: {}, // 这是获取到的单个节点所有返回数据，要通过父组件传给子组件
      subType: 'add', // 新增还是修改的标记
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改年度培训方案'
      }
      let txt = this.isView ? '查看' : '新增'
      return `${txt}年度培训方案`
    },
    isView() {
      //查看
      return this.type === 'view'
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
    },

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

    handleCancel() {
      this.currentTab = 0
      this.visible = false
    },
    //     // 关闭
    //     this.customer = {}
    //     this.linkmans = []
    //     this.currentTab = 0
    //     this.visible = false
    //     this.$emit('ok')
    //   },
    //   nextStep(values) {
    //     if (this.currentTab < 2) {
    //       this.currentTab += 1
    //     }
    //     if (this.currentTab === 1) {
    //       this.customer = values
    //       if (this.subType === 'edit') {
    //         // 如果是修改则需要查询出所有联系人
    //         queryList({ customerId: values.id }).then((res) => {
    //           if (res.code === 200) {
    //             this.$refs.step2.edit(res.data, values.id)
    //           } else {
    //             this.$message.error(res.msg)
    //           }
    //         })
    //       }
    //     } else if (this.currentTab === 2) {
    //       this.linkmans = values
    //       var param = {
    //         customer: this.customer,
    //         linkmans: this.linkmans,
    //         isSecond: this.customer.isSecond,
    //         isAgency: this.customer.isAgency,
    //       }
    //       if (this.subType === 'add') {
    //         addCustomer(param).then((res) => {
    //           this.$refs.result.result(res)
    //         })
    //       } else if (this.subType === 'edit') {
    //         editCustomer(param).then((res) => {
    //           this.$refs.result.result(res)
    //         })
    //       }
    //     }
    //   },
    //   prevStep() {
    //     if (this.currentTab > 0) {
    //       this.currentTab -= 1
    //     }
    //   },
    //   addAgain() {
    //     this.customer = {}
    //     this.linkmans = []
    //     this.currentTab = 0
    //   },
  },
}
</script>

<style lang="less" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>

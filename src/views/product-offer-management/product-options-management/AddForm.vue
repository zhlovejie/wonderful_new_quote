<template>
  <a-modal
    :title="modalTitle"
    :width="1200"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-steps :current="currentStep">
        <a-step v-for="(item,idx) in steps" :title="item.title" :key="idx" />
      </a-steps>
      <div class="step-wrapper">
        <Step1 v-show="currentStep === 0" @change="stepChangeHander" />
        <Step2 v-show="currentStep === 1" @change="stepChangeHander" />
        <Step3 v-show="currentStep === 2" @change="stepChangeHander" />
        <Step4 v-show="currentStep === 3" @change="stepChangeHander" />
        <Step5 v-show="currentStep === 4" @change="stepChangeHander" @ok="handleSubmit" />
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
export default {
  name: 'product-offer-management-product-options-management_AddForm',
  components:{
    Step1,
    Step2,
    Step3,
    Step4,
    Step5
  },
  provide() {
    return {
      addForm: this
    }
  },
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      form:{},
      currentStep:0,
      steps:[
        {title:'产品型号'},
        {title:'中控型号'},
        {title:'标配'},
        {title:'选配'},
        {title:'预览'},
      ],

      optControlItems:[],// 中控
      optStandItems:[], // 标配
      optChoiceItems:[],// 选配
    }
  },
  created() {},
  computed: {
    modalTitle() {
      let type = this.type
      return type === 'add' ? '新增' : type === 'edit' ? '修改' : type === 'view' ? '查看' : '未知'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true
      that.spinning = false


    },
    handleSubmit() {
      const that = this
      console.log('handleSubmit....',that.form)
      that.spinning = true
    },
    handleCancel() {
      const that = this
      that.form = {}
      that.currentStep = 0
      that.$nextTick(() => (that.visible = false))
    },
    stepChangeHander(name,stepType,data){
      const that = this
      that.form = {...that.form,[name]:data}
      if(stepType === 'next'){
        that.currentStep = that.currentStep + 1
      }else if(stepType === 'prev'){
        that.currentStep = that.currentStep - 1
      }

      console.log(that.form)
    }
  }
}
</script>

<style scoped>

</style>


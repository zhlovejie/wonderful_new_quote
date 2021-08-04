<template>
  <div class="product-offer-price-wrapper">
    <a-steps :current="currentStep">
      <a-step v-for="(item,idx) in steps" :title="item.title" :key="idx" />
    </a-steps>
    <div class="step-wrapper">
      <Step1 ref="step1" v-show="currentStep === 0" @change="stepChangeHander" />
      <Step2 ref="step2" v-show="currentStep === 1" @change="stepChangeHander" />
      <Step3 ref="step3" v-show="currentStep === 2" @change="stepChangeHander" />
      <Step4 ref="step4" v-show="currentStep === 3" @change="stepChangeHander" />
      <Step5 ref="step5" v-show="currentStep === 4" @change="stepChangeHander" />
      <Step6 ref="step6" v-show="currentStep === 5" @change="stepChangeHander" />
    </div>
  </div>
</template>
<script>
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'

import {
  priceQuotedZktDetail,
  priceQuotedItemConfigSubList,
  priceQuotedItemConfigTreeList
} from '@/api/productOfferManagement'

import {
  priceQuotedProductAddOrUpdate,
  priceQuotedProductDetail
} from '@/api/productOfferManagement'

export default {
  name: 'product-offer-management-product-offer-price',
  components:{
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6
  },
  provide() {
    return {
      addForm: this
    }
  },
  data() {
    return {
      type: 'price',
      visible: false,
      spinning: false,
      form:{},
      currentStep:0,
      steps:[
        {title:'产品型号'},
        {title:'中控型号'},
        {title:'标配'},
        {title:'选配'},
        {title:'报价'},
        {title:'预览'},
      ],
      // step3,step4 数据源
      optionsList: [],
      allOptionsList:[],
      treeData: [],
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'product-offer-management-product-offer-price') {
          this.init()
        }
      },
      immediate: true
    }
  },
  computed: {
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
    async init(){
      const that = this
      that.query()
    },
    query() {
      const that = this
      let steps = ['step2','step3','step4']
      steps.map(c => {
        let ref = that.$refs[c]
        ref && ref.query('price')
      })
    },
    stepChangeHander(name,stepType,data){
      const that = this
      that.form = {...that.form,[name]:data}
      if(stepType === 'next'){
        that.currentStep = that.currentStep + 1
      }else if(stepType === 'prev'){
        that.currentStep = that.currentStep - 1
      }
    }
  }
}
</script>

<style scoped>
.product-offer-price-wrapper{
  background-color: #fff;
  padding: 50px;
  max-width: 1200px;
}
</style>


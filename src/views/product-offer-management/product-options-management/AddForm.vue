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
        <Step1 ref="step1" v-show="currentStep === 0" @change="stepChangeHander" />
        <Step2 ref="step2" v-show="currentStep === 1" @change="stepChangeHander" />
        <Step3 ref="step3" v-show="currentStep === 2" @change="stepChangeHander" />
        <Step4 ref="step4" v-show="currentStep === 3" @change="stepChangeHander" />
        <Step5 ref="step5" v-show="currentStep === 4" @change="stepChangeHander" @ok="handleSubmit" />
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


import {
  priceQuotedProductAddOrUpdate,
  priceQuotedProductDetail
} from '@/api/productOfferManagement'

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
      // step3,step4 数据源
      optionsList: [],
      treeData: [],
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
    query(type, record,{optionsList,treeData}) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true
      that.spinning = false
      that.currentStep = 0

      that.optionsList = optionsList
      that.treeData = treeData

      if(that.isEdit){
        priceQuotedProductDetail({id:record.id}).then(res => {
          let data = res.data
          let step1 = []
          let step2 = data.childrenList.filter(item => item.configType === 2)
          let step3 = {
            items:data.childrenList.filter(item => item.configType === 0),
            productName:data.productName,
            productTypeConfigId:data.productTypeConfigId,
            productTypeConfigName:data.productTypeConfigName,
            filterKeys:data.childrenList.filter(item => item.configType === 0).map(opt => opt.itemConfigId)
          }
          let step4 = {
            items:data.childrenList.filter(item => item.configType === 1),
          }

          let obj ={...data,step1,step2,step3,step4 }
          delete obj.childrenList
          that.form = obj

          let steps = ['step1','step2','step3','step4','step5']

          steps.map(c => {
            let ref = that.$refs[c]
            ref && ref.fill && ref.fill()
          })

        })
      }

    },
    handleSubmit() {
      const that = this
      let {
        step1:productsPath,
        step2:controls,
        step3:stands,
        step4:choices
      } = that.form

      let params = {
        productName:that.form.productName,
        productSeries:that.form.productSeries,
        productTypeConfigId:that.form.productTypeConfigId,
        priceQuotedProductConfigList:[]
      }

      let priceQuotedProductConfigList = [
        ...stands.items,
        ...choices.items,
        ...controls.map(item => {
          return {
            configName:item.configName,
            configType:2,
            itemConfigId:item.id,
            isChecked:0,
            isRequired:0,
          }
        })
      ]

      params.priceQuotedProductConfigList = priceQuotedProductConfigList
      that.spinning = true
      priceQuotedProductAddOrUpdate(params).then(res => {
        that.spinning = false
        that.$message.info(res.msg)
        if(res.code === 200){
          that.handleCancel()
          that.$emit('finish')
        }
      }).catch(err => {
        that.spinning = false
        that.$message.error(err)
      })
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
    },

  }
}
</script>

<style scoped>

</style>


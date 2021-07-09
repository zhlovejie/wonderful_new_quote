<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <div class="wrapper">
      <div style="font-weight: 700;">
        <p>产品信息：{{msg.productInfo}}</p>
        <p>产品型号：{{msg.productType}}</p>
        <p v-if="msg.productTypeConfigName">产品类型：{{msg.productTypeConfigName}}</p>
        <p>中控型号：{{msg.controlType}}</p>
      </div>
      <p>
        <OptionsSelect ref="optStand" modelTitle="标准配置" />
        <OptionsSelect ref="optChoice" modelTitle="选择配置" />
      </p>
    </div>
    <p style="text-align:center;margin-top:20px;">
      <a-button
        type="primary"
        @click="stepAction('prev')"
      >上一步</a-button>
      <a-button
        type="primary"
        @click="stepAction('ok')"
        style="margin-left:10px;"
      >确定</a-button>
    </p>
  </a-card>
</template>
<script>
import {
  productMaterialInfoGetCode
} from '@/api/routineMaterial'
import OptionsSelect from '@/views/product-offer-management/control-system-options/OptionsSelect'
export default {
  components:{OptionsSelect},
  inject:['addForm'],
  data() {
    return {
      msg : {
        productInfo:'',
        productType:'',
        controlType:''
      }
    }
  },
  watch:{
    'addForm.currentStep':{
      handler(val, oldVal){
        if(val === 4){
          this.init()
        }
      },
      deep:true
    }
  },

  methods: {
    async init() {
      const that = this
      let {
        step1:productsPath,
        step2:controls,
        step3:stands,
        step4:choices,
        productSeries,
        productName,
        productTypeConfigName
      } = this.addForm.form

      if(productsPath.length === 0){
        that.msg = {
          productInfo:productName,
          productType:productSeries,
          productTypeCode:productSeries,
          productTypeConfigName:productTypeConfigName,
          controlType:controls.map(item => item.configName).join('，')
        }
      }else{
        let _productsPath = [...productsPath].reverse()
        let orderCode = await productMaterialInfoGetCode({ruleId:_productsPath[0].key}).then(res => res.data)
        let parentCode = _productsPath.map(item => item.code).join('')
        that.msg = {
          productInfo:_productsPath.map(item => item.title).join('->'),
          productType:`${productName}(${parentCode}${orderCode})`,
          productTypeCode:`${parentCode}${orderCode}`,
          controlType:controls.map(item => item.configName).join('，')
        }
      }

      that.$nextTick(() => {
        let {optionsList,treeData} = that.addForm
        that.$refs.optStand.query('view',stands.items,{optionsList,treeData})
        that.$refs.optChoice.query('view',choices.items,{optionsList,treeData})
      })

      that.addForm.form = {
        ...that.addForm.form,
        productSeries:that.msg.productTypeCode,
      }
    },
    stepAction(type) {
      const that = this
      if (type === 'ok') {
        that.$emit('ok')
      } else if (type === 'prev') {
        that.$emit('change', 'step5', 'prev', null)
      }
    }
  }
}
</script>

<style scoped>
</style>


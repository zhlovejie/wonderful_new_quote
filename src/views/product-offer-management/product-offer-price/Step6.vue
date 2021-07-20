<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >
    <div class="wrapper" id="product-offer-management-product-offer-price-print">
      <div style="font-weight: 700;">
        <p>产品信息：{{msg.productInfo}}</p>
        <p>产品型号：{{msg.productType}}</p>
        <p>产品类型：{{msg.productTypeConfigName}}</p>
      </div>
      <p>
      <OptionsSelect
        ref="optControlStand"
        modelTitle="中控-标准配置"
      />
      <OptionsSelect
        ref="optControlChoice"
        modelTitle="中控-选择配置"
      />
      </p>
      <p>
        <OptionsSelect
          ref="optStand"
          modelTitle="标准配置"
        />
      </p>
      <p>
        <OptionsSelect
          ref="optChoice"
          modelTitle="选择配置"
        />
      </p>
    </div>
    <p style="text-align:center;margin-top:20px;">
      <a-button
        type="primary"
        @click="stepAction('prev')"
      >上一步</a-button>
      <a-button
        type="primary"
        @click="stepAction('print')"
        style="margin-left:10px;"
      >下载</a-button>
    </p>
  </a-card>
</template>
<script>
import {
  productMaterialInfoGetCode
} from '@/api/routineMaterial'
import OptionsSelect from '@/views/product-offer-management/control-system-options/OptionsSelect'
import util from '@/components/_util/util'
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
        if(val === 5){
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
        productTypeConfigId,
        productTypeConfigName
      } = this.addForm.form

      let _productsPath = [...productsPath].reverse()
      let orderCode = await productMaterialInfoGetCode({ruleId:_productsPath[0].key}).then(res => res.data)
      let parentCode = _productsPath.map(item => item.code).join('')
      that.msg = {
        productInfo:_productsPath.map(item => item.title).join('->'),
        productType:`${productTypeConfigName}(${parentCode}${orderCode})`,
        productTypeCode:`${parentCode}${orderCode}`,
        productTypeConfigName
      }

      let {optionsList,treeData} = that.addForm
      let refs = [
        {refName:'optControlStand',data:controls.optStandItems},
        {refName:'optControlChoice',data:controls.optChoiceItems},
        {refName:'optStand',data:stands.items},
        {refName:'optChoice',data:choices.items }
      ]

      refs.map(item => {
        that.$refs[item.refName].query('view',that.$_.cloneDeep(item.data),{
          optionsList:that.$_.cloneDeep(optionsList),
          treeData:that.$_.cloneDeep(treeData)
        })
      })
    },
    stepAction(type) {
      const that = this
      if (type === 'ok') {
        that.$emit('ok')
      } else if (type === 'prev') {
        that.$emit('change', 'step6', 'prev', null)
      } else if(type === 'print'){
        util.handleWindowPrint(`#product-offer-management-product-offer-price-print`, that.msg.productType)
      }
    }
  }
}
</script>

<style scoped>
</style>


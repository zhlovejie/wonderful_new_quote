<template>
  <div class="customer-list-wrapper">
    <div class="main-wrapper" style="width:1000px;margin:0 auto;">
      <table class="custom-table custom-table-border">
        <tr>
          <td style="width:150px;">产品系列</td>
          <td>
              <a-input read-only placeholder="点击选择产品系列" :value="optInfo.name" @click="showModule('selectProduct')" />
          </td>
        </tr>
      </table>

      <ProductConfig ref="productConfigMain" @extendProductChange="extendProductChange"/>

      <ProductConfig ref="productConfigSub" />
      
      <div style="text-align:center;margin-top:10px;">
        <a-button type="primary" icon="check" @click="doAction('ok')" style="margin:0 10px;">确定</a-button>
        <a-button type="primary" icon="reload" @click="doAction('reset')" style="margin:0 10px;">重置</a-button>
      </div>
    </div>

    <SelectProduct ref="selectProduct" @selected="selectedHandler" />

    <a-modal
      title="产品评估"
      :width="600"
      :visible="visible"
      @cancel="handleCancel"
      :maskClosable="false"
      :footer="null"
    >
      <p>成本价：{{costPrice | moneyFormatNumber}}</p>
      <div style="text-align:center;margin-top:10px;">
          <a-button type="primary" @click="doAction('price-ok')" style="margin:0 10px;">确定</a-button>
          <a-button type="primary" @click="doAction('price-view')" style="margin:0 10px;">预览</a-button>
      </div>
    </a-modal>

    <SelectProductView ref="selectProductView" :dataSource="viewDataSource" />

  </div>
</template>

<script>
import SelectProduct from './module/SelectProduct' 
import SelectProductView from './module/SelectProductView'
import ProductConfig from './module/ProductConfig'
export default {
  name: 'products-quotation',
  components: {
    SelectProduct,
    SelectProductView,
    ProductConfig
  },
  data() {
    return {
      optInfo:{},
      visible:false,
    }
  },
  computed:{
    costPrice(){
      //return this.calcItems()
    },
    viewDataSource(){
      // let {
      //   optStand,
      //   optSelect,
      //   optChoice,
      //   control_optStand,
      //   control_optSelect,
      //   control_optChoice
      // } = this.getChoiceProducts()
      // return {
      //   optInfo:{...this.optInfo,optControl:this.optControlSelected},
      //   optStand:[...optStand],
      //   optSelect:[...optSelect,...optChoice],
      //   optControlStand:[...control_optStand],
      //   optControlSelect:[...control_optSelect,...control_optChoice]
      // }
    }
  },
  methods: {
    extendProductChange(record){
      debugger
      if(record.isProduct){
        this.$refs.productConfigSub.query(record.id)
      }else{
        this.$refs.productConfigSub.reset()
      }
    },
    selectedHandler(record){
      this.optInfo = {
        name:record.name
      }
      this.$refs.productConfigMain.query(record.id)
    },
    handleSubmit(){
      this.visible = true
    },
    handleCancel(){
      this.visible = false
    },
    doAction(type){
      if(type === 'ok'){
        this.visible = true
      }else if(type === 'reset'){

      }else if(type === 'price-ok'){
        this.visible = false
      }else if(type === 'price-view'){
        this.showModule('selectProductView')
      }
    },
    showModule(key) {
      this.$refs[key].query()
    }
  }
}
</script>

<style scoped>
.customer-list-wrapper {
    background-color: #fff;
    padding: 10px 20px;
  }
</style>

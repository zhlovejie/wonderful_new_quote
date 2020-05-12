<template>
  <div class="customer-list-wrapper">
    <div class="main-wrapper" style="width:1000px;margin:0 auto;">
      <table class="custom-table custom-table-border" style="margin-bottom:0;">
        <tr>
          <td style="width:150px;">产品系列</td>
          <td>
              <a-input read-only placeholder="点击选择产品系列" :value="optInfo.name" @click="showModule('selectProduct')" />
          </td>
        </tr>
      </table>

      <ProductConfig ref="productConfigMain" @extendProductChange="extendProductChange" prefix="产品系列-"/>

      <ProductConfig ref="productConfigSub" prefix="产品-" />
      
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
      <p>成本价：{{parseInt(costPrice.price) | moneyFormatNumber}}</p>
      <p>A价：{{parseInt(costPrice.aprice) | moneyFormatNumber}}</p>
      <p>B价：{{parseInt(costPrice.bprice) | moneyFormatNumber}}</p>
      <p>C价：{{parseInt(costPrice.cprice) | moneyFormatNumber}}</p>
      <p>市场价：{{parseInt(costPrice.retailPrice) | moneyFormatNumber}}</p>
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
      costPrice:{},
      viewDataSource:[]
    }
  },
  computed:{
    
  },
  methods: {
    extendProductChange(record){
      debugger
      if(record.isProduct && record.checked){
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
        this.calcCostPrice()
        this.visible = true
      }else if(type === 'reset'){
        this.reset()
      }else if(type === 'price-ok'){
        this.visible = false
      }else if(type === 'price-view'){
        this.makeViewDataSource()
        this.showModule('selectProductView')
      }
    },
    showModule(key) {
      this.$refs[key].query()
    },
    calcCostPrice(){
      debugger
      let mainPrice = this.$refs.productConfigMain.costPrice
      let subPrice = this.$refs.productConfigSub.costPrice

      let priceResult = {
        price:0,
        aprice:0,
        bprice:0,
        cprice:0,
        retailPrice:0
      }
      let arr = [Object.assign({},mainPrice),Object.assign({},subPrice)]
      arr.reduce((calc,item) =>{
        calc.price += (parseFloat(item.price) || 0)
        calc.aprice += (parseFloat(item.aprice) || 0)
        calc.bprice += (parseFloat(item.bprice) || 0)
        calc.cprice += (parseFloat(item.cprice) || 0)
        calc.retailPrice += (parseFloat(item.retailPrice) || 0)
        return calc
      },priceResult)

      this.costPrice = priceResult
    },
    makeViewDataSource(){
      let that = this
      let makeProducts = (key) => that.$refs[key].viewDataSource
      let main = makeProducts('productConfigMain')
      if(main){
        main.__config = {
          showTitle:true,
          prefix:'产品系列-'
        }
      }
      let sub = makeProducts('productConfigSub')
      if(sub){
        sub.__config = {
          showTitle:false,
          prefix:'产品-'
        }
      }
      this.viewDataSource = [makeProducts('productConfigMain'),makeProducts('productConfigSub')]
    },
    reset(){
      let that = this
      let keys = ['productConfigMain','productConfigSub']
      that.optInfo = {}
      keys.map(key =>{
        try{
          that.$refs[key].reset()
        }catch(err){
          console.log(err)
        }
      })
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

<template>
  <div class="products-quotation-view-wrapper" id="products-quotation-view-wrapper">
    <div class="products-quotation-view-item">
    <table class="custom-table custom-table-border" v-if="productInfo.optInfo && productInfo.__config && productInfo.__config.showTitle">
      <caption>产品参数</caption>
      <tr>
        <td rowspan="3" style="width:150px;">
          <img style="width:100%;height:auto;overflow:hidden;" :src="productInfo.optInfo.productPic" alt=""/>
        </td>
        <td style="width:150px;">产品系列</td>
        <td>{{productInfo.optInfo.name}}</td>
      </tr>
      <tr>
        <td style="width:150px;">产品型号</td>
        <td>{{productInfo.optInfo.model}}</td>
      </tr>
      <tr>
        <td style="width:150px;">产品价格</td>
        <td>
          <a-row>
            <a-col :span="6" >
              <a-select
                style="width:100%;"
                placeholder="选择产品价格" 
                @change="priceChange"
              >
                <a-select-option v-for="(v,idx) in priceList" :value="v" :key="idx">{{v | moneyFormatNumber}}</a-select-option>
                <a-select-option value="-1">其他</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6" :offset="1">
              <a-input-number 
                v-if="isOtherPrice"
                placeholder="手动输入价格"
                style="width:100%;"
                :min="1"
                :step="1" 
                @change="otherPriceChange"
              />
            </a-col>
          </a-row>
          
          
        </td>
      </tr>
    </table>
    <table class="custom-table custom-table-border" v-if="productInfo.optStand && productInfo.optStand.length > 0">
      <tr>
        <td class="__table-thead" style="width:80px;">
          <span style="writing-mode: tb;" class="__ele-english" data-english="standard configuration">标配配置</span>
        </td>
        <td style="padding:0;" v-html="optStandHTML()"></td>
      </tr>
    </table>

    <table class="custom-table custom-table-border" v-if="productInfo.optSelect && productInfo.optSelect.length > 0">
      <tr>
        <td class="__table-thead" style="width:80px;">
          <span style="writing-mode: tb;" class="__ele-english" data-english="selection configuration">选择配置</span>
        </td>
        <td style="padding:0;" v-html="optSelectHTML()"></td>
      </tr>
    </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'select-product-view',
  props:['productInfo'],
  data() {
    return {
      isOtherPrice:false
    }
  },
  mounted(){
  },
  computed:{
    priceList(){
      if(this.productInfo && this.productInfo.__config && this.productInfo.__config.costPrice){
        let p = this.productInfo.__config.costPrice
        return [p.aprice,p.bprice,p.cprice,p.retailPrice]
      }
      return []
    }
  },
  methods: {
    priceChange(val){
      this.isOtherPrice = val === '-1'
      if(!this.isOtherPrice){
        this.$emit('priceChange',val)
      }
    },
    otherPriceChange(v){
      debugger
      this.$emit('priceChange',v)
    },
    optStandHTML(){
      let html = '<table class="custom-table">'
      html += '<tr>'
      this.productInfo.optStand.map((p,idx) =>{
        html += `<td style="padding:5px 0;width:33.3333%;">${p.itemName}</td>`
        if((idx+1) % 3 === 0){
          html += '</tr><tr>'
        }
      })
      html += '</tr></table>'
      return html
    },
    optSelectHTML(){
      let html = '<table class="custom-table">'
      html += '<tr>'
      this.productInfo.optSelect.map((p,idx) =>{
        html += `<td style="padding:5px 0;width:33.3333%;">${p.itemName}</td>`
        if((idx+1) % 3 === 0){
          html += '</tr><tr>'
        }
      })
      html += '</tr></table>'
      return html
    }
  }
}
</script>

<style scoped>
  
  .products-quotation-view-wrapper .custom-table{
    margin: -1px 0 0 0;
  }
  .products-quotation-view-wrapper .custom-table >>> .custom-table{
    margin: -1px;
    width: calc(100% + 2px);
  }
  .custom-table th,.custom-table td{
    position: relative;
    padding: 10px;
  }

  .custom-table >>> .bottom-line{
    position: absolute;
    height: 1px;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
  }

  .products-quotation-view-wrapper .setting-items-wrapper{
    display: flex;
    flex-wrap: wrap;
  }
  .products-quotation-view-wrapper .setting-items-wrapper .setting-item{
    padding: 7px 15px;
    background-color: #f5f5f5;
    margin: 5px;
    border-radius: 3px;
  }

</style>

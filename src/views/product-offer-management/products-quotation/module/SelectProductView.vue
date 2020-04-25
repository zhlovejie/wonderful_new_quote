<template>
  <a-modal
    title="预览"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    okText="下载"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <div class="products-quotation-view-wrapper" id="products-quotation-view-wrapper">
      <div class="products-quotation-view-item" v-for="(productInfo,index) in dataSource" :key="index">
      <table class="custom-table custom-table-border" v-if="productInfo.__config.showTitle">
        <caption>产品参数</caption>
        <tr>
          <td style="width:150px;">产品系列</td>
          <td>{{productInfo.optInfo.name}}</td>
        </tr>
      </table>
      <table class="custom-table custom-table-border" v-if="productInfo.optStand.length > 0">
        <tr>
          <td style="width:150px;">{{productInfo.__config.prefix}}标配</td>
          <td style="padding:0;">
            <div class="bottom-line"></div>
            <table class="custom-table custom-table-border" style="margin-bottom:0;">
              <tr>
                <th style="width:100px;">序号</th>
                <th>配置名称</th>
              </tr>
              <tr v-for="(item,index) in productInfo.optStand" :key="index" >
                <td>{{index+1}}</td>
                <td>{{item.itemName}}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table class="custom-table custom-table-border" v-if="productInfo.optInfo.optControl">
        <tr>
          <td style="width:150px;">{{productInfo.__config.prefix}}中控系统模块</td>
          <td>{{productInfo.optInfo.optControl.itemName}}</td>
        </tr>
      </table>

      <table class="custom-table custom-table-border" v-if="productInfo.optControlStand.length > 0">
        <tr>
          <td style="width:150px;">中控-标配</td>
          <td style="padding:0;">
            <div class="bottom-line"></div>
            <table class="custom-table custom-table-border" style="margin-bottom:0;">
              <tr>
                <th style="width:100px;">序号</th>
                <th>配置名称</th>
              </tr>
              <tr v-for="(item,index) in productInfo.optControlStand" :key="index" >
                <td>{{index+1}}</td>
                <td>{{item.itemName}}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table class="custom-table custom-table-border" v-if="productInfo.optControlSelect.length > 0">
        <tr>
          <td style="width:150px;">中控-选配</td>
          <td style="padding:0;">
            <div class="bottom-line"></div>
            <table class="custom-table custom-table-border" style="margin-bottom:0;">
              <tr>
                <th style="width:100px;">序号</th>
                <th>配置名称</th>
              </tr>
              <tr v-for="(item,index) in productInfo.optControlSelect" :key="item.id" >
                <td>{{index + 1}}</td>
                <td>{{item.itemName}}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table class="custom-table custom-table-border" v-if="productInfo.optSelect.length > 0">
        <tr>
          <td style="width:150px;">{{productInfo.__config.prefix}}选配</td>
          <td style="padding:0;">
            <div class="bottom-line"></div>
            <table class="custom-table custom-table-border" style="margin-bottom:0;">
              <tr>
                <th style="width:100px;">序号</th>
                <th>配置名称</th>
              </tr>
              <tr v-for="(item,index) in productInfo.optSelect" :key="item.id" >
                <td>{{index + 1}}</td>
                <td>{{item.itemName}}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      </div>
    </div>
  </a-modal>
</template>

<script>

import util from '@/components/_util/util'

export default {
  name: 'select-product-view',
  props:{
    dataSource:{
      type:Array,
      default:() =>{
        return []
      }
    }
  },
  data() {
    return {
      visible:false
    }
  },
  methods: {
    handleOk(){
      util.handleWindowPrint('#products-quotation-view-wrapper', '产品参数')
    },
    handleCancel(){
      this.visible = false
    },
    query(){
      this.visible = true
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

</style>

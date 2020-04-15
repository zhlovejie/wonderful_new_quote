<template>
  <a-modal
    title="核价单信息"
    :width="940"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false">
    <div v-if="showCheckbox">
      <div :style="{ borderBottom: '1px solid #E9E9E9' }">
        产品代码:
        <a-select style="width:150px" placeholder="请选择产品代码" v-model="productModel">
          <a-select-option v-for="product1 in productList" :key="product1.index" :value="product1.id">{{ product1.newBasisModel }}</a-select-option>
        </a-select>
        　　
      </div>
      <br />
      展示内容:
      <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll">全选</a-checkbox>
      <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange" />
      <br />
      <a-button style="margin-left: 90%" @click="toView()" type="primary">生成详情</a-button>
    </div>
    <a-button @click="getPDF()" v-if="showView" type="primary">导出成PDF</a-button>
    <div v-if="showView" ref="pdfDom" class="table-page-search-wrapper" id="pdfDom">
      <h2 :style="{textAlign:'center'}">核价单-产品代码 {{this.product.newBasisModel}}</h2>
      <a-form :form="form">
        <a-row v-if="showPicture" :gutter="24">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="图片">
              <img style="max-width: 100%;height:auto;" :src="product.effectPic" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col v-if="showPrice" :lg="24" :md="24" :sm="24">
            <a-form-item label="价格">{{ calcShowPrice | moneyFormatNumber }}</a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="showFunction" :gutter="24">
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item label="功能描述">
              <span v-html="product.demandRemarks"></span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import util from '@/components/_util/util'
import { listByValency } from '@api/pricingModule'
export default {
  name: 'BrifeDrawing',
  data () {
    return {
      visible: false, // 是否显示
      productList: [], // 产品列表
      productModel: '', // 所选产品代码
      product: {},
      plainOptions: ['效果图', '价格', '功能描述'],
      checkedList: [], // 选中的
      indeterminate: false, // 全选框的状态
      showCheckbox: true,
      showView: false,
      checkAll: false,
      showPicture: false,
      showPrice: false,
      showFunction: false,
      showOther: false,
      form: this.$form.createForm(this)
    }
  },
  computed:{
    calcShowPrice:function(){
      return this.product.aprice || this.product.bprice || this.product.cprice
    }
  },
  methods: {
    show (vId) {
      listByValency({ 'valencyId': vId }).then(res => {
        if (res.code === 200) {
          this.productList = res.data
        }
      })
      this.visible = true
    },
    toView () {
      if (this.checkedList.length === 0) {
        this.$message.error('请至少选择一项数据展示')
        return
      }
      console.log('productModel', this.productModel)
      if (this.productModel === '' || this.productModel === undefined) {
        this.$message.error('请选择产品代码')
        return
      } else {
        this.productList.forEach(prd => {
          if (prd.id === this.productModel) {
            this.product = prd
          }
        })
      }
      for (var i = 0; i < this.checkedList.length; i++) {
        var checked = this.checkedList[i]
        if (checked === '效果图') {
          this.showPicture = true
        } else if (checked === '价格') {
          this.showPrice = true
        } else if (checked === '功能描述') {
          this.showFunction = true
        }
      }
      this.showCheckbox = false
      this.showView = true
    },
    onChange (checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
      this.checkAll = checkedList.length === this.plainOptions.length
    },
    onCheckAllChange (e) {
      // 全选
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    handleCancel () {
      this.productModel = ''
      this.checkedList = []
      this.indeterminate = false
      this.checkAll = false
      this.showCheckbox = true
      this.showView = false
      this.showPicture = false
      this.showPrice = false
      this.showFunction = false
      this.showOther = false
      this.form.resetFields() // 清空表
      this.visible = false
    },
    getPDF () {
      util.handleWindowPrint('#pdfDom', `核价单-产品代码 ${this.product.newBasisModel}`)
    }
  }
}
</script>

<style scoped>
</style>

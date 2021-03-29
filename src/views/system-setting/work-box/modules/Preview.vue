<template>
  <a-modal
    title="产品信息"
    :width="940"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <div v-if="showCheckbox">
      <div :style="{ borderBottom: '1px solid #E9E9E9' }">
        <a-checkbox
          :indeterminate="indeterminate"
          @change="onCheckAllChange"
          :checked="checkAll"
        >
          全选
        </a-checkbox>
      </div>
      <br/>
      <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange"/>
      <br/>
      <a-button style="margin-left: 90%" @click="toView()" type="primary">生成详情</a-button>
    </div>
    <a-button @click="getPDF()" v-if="showView" type="primary">导出成PDF</a-button>
    <div v-if="showView" ref="pdfDom" class="table-page-search-wrapper" id="pdfDom">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col v-if="showName" :md="8" :sm="24">
            <a-form-item label="名称">
              {{ product.productName }}
            </a-form-item>
          </a-col>
          <a-col v-if="showModel" :md="8" :sm="24">
            <a-form-item label="产品代码">
              {{ product.productModel }}
            </a-form-item>
          </a-col>
          <a-col v-if="showType" :md="8" :sm="24">
            <a-form-item label="类型">
              {{ product.productTypeText }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="showStandard" :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="规格">
              {{ product.productStandard }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="showPic" :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="图片">
              <template v-if="product.productPicOriginal">
                <img v-for="url in __productPicOriginal" :key="url.thumb" :style="imgStyle" :src="url.thumb" />
              </template>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="showDescription" :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="功能描述">
              <span v-html="product.description"></span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
import util from '@/components/_util/util'

export default {
  data () {
    return {
      visible: false, // 是否显示
      product: {},
      plainOptions: ['名称', '产品代码', '类型', '规格', '图片', '功能描述'],
      checkedList: [], // 选中的
      indeterminate: false, // 全选框的状态
      showCheckbox: true,
      showView: false,
      checkAll: false,
      showName: false,
      showModel: false,
      showType: false,
      showStandard: false,
      showPic: false,
      showDescription: false,
      form: this.$form.createForm(this),
      imgStyle:{}
    }
  },
  methods: {
    show (record) {
      this.visible = true
      this.product = record
      if(this.product.productPicOriginal){

        let productPicOriginal = []
        try{
          productPicOriginal = JSON.parse(this.product.productPicOriginal)
        }catch(err){
          productPicOriginal = []
        }
        this.__productPicOriginal = productPicOriginal
        let len = productPicOriginal.length
        let finalWidth = '0'
        if(len === 1){
          finalWidth = '80%'
        }else if(len === 2){
          finalWidth = '40%'
        }else if(len > 2){
          finalWidth = '25%'
        }
        this.imgStyle = {
          width:'auto',
          maxWidth: finalWidth,
          margin:'5px'
        }
      }
    },
    toView () {
      if (this.checkedList.length === 0) {
        this.$message.error('请至少选择一项数据展示')
        return
      }
      for (var i = 0; i < this.checkedList.length; i++) {
        var checked = this.checkedList[i]
        if (checked === '名称') {
          this.showName = true
        } else if (checked === '产品代码') {
          this.showModel = true
        } else if (checked === '类型') {
          this.showType = true
        } else if (checked === '规格') {
          this.showStandard = true
        } else if (checked === '图片') {
          this.showPic = true
        } else if (checked === '功能描述') {
          this.showDescription = true
        }
      }
      this.showCheckbox = false
      this.showView = true
    },
    onChange (checkedList) {
      this.indeterminate = !!checkedList.length && (checkedList.length < this.plainOptions.length)
      this.checkAll = checkedList.length === this.plainOptions.length
    },
    onCheckAllChange (e) { // 全选
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    handleCancel () {
      this.checkedList = []
      this.indeterminate = false
      this.checkAll = false
      this.showCheckbox = true
      this.showView = false
      this.showName = false
      this.showModel = false
      this.showType = false
      this.showStandard = false
      this.showPic = false
      this.showDescription = false
      this.form.resetFields() // 清空表
      this.visible = false
    },
    getPDF () {
      util.handleWindowPrint('#pdfDom', this.product.productName)
    }
  }
}
</script>

<style media="print">
  @page {
    size: auto;  /* auto is the initial value */
    margin: 0mm; /* this affects the margin in the printer settings */
  }
  @media print {
    body {display:none}
    #print {display: block}
  }
</style>

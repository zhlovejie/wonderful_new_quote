<template>
  <a-modal
    title="企业简介"
    :width="940"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-button @click="getPDF()" type="primary">导出成PDF</a-button>
    <div class="table-page-search-wrapper" id="pdfDom">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="标题">
              {{ enterpriseSynopsis.title }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="内容">
              <span v-html="enterpriseSynopsis.informationContent"></span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="图片" style="text-align: right;">
              <img style="width: 25%;max-width:128px;" :src="enterpriseSynopsis.url" />
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
  name: 'SynopsisPreview',
  data () {
    return {
      visible: false, // 是否显示
      enterpriseSynopsis: {}, // 企业简介信息
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (enterpriseSynopsis) {
      this.visible = true
      this.enterpriseSynopsis = enterpriseSynopsis
    },
    handleCancel () {
      this.enterpriseSynopsis = {}
      this.form.resetFields() // 清空表
      this.visible = false
    },
    getPDF () {
      util.handleWindowPrint('#pdfDom', this.enterpriseSynopsis.title)
    }
  }
}
</script>
<style>
  @media print {
    body {display:none}
    #print {display: block}
  }
</style>

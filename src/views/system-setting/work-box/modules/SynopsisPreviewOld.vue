<template>
  <a-modal
    :title="modalTitle"
    :width="940"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-row>
      <a-col :span="24">
        <a-button style="float:right;" @click="getPDF()" type="primary">导出成PDF</a-button>
      </a-col>
    </a-row>
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
            <a-form-item label="图片">
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
      informationType:1,
      enterpriseSynopsis: {}, // 企业简介信息
      form: this.$form.createForm(this)
    }
  },
  computed: {
    modalTitle() {
      return this.informationType === 1 ? '企业简介' : '产品功能简介'
    }
  },
  methods: {
    show (enterpriseSynopsis) {
      this.visible = true
      this.informationType = enterpriseSynopsis.informationType
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

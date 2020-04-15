<template>
  <a-modal
    title="资质认证"
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
          <a-col :md="12" :sm="24">
            <a-form-item label="名称">
              {{ qualification.qualificationName }}
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="类别">
              {{ qualification.qualificationTypeText }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="图片">
              <img style="width: 80%" :src="qualification.qualificationPicture" />
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
  name: 'QualificationPreview',
  data () {
    return {
      visible: false, // 是否显示
      qualification: {}, // 资质认证信息
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (qualification) {
      this.visible = true
      this.qualification = qualification
    },
    handleCancel () {
      this.qualification = {}
      this.form.resetFields() // 清空表
      this.visible = false
    },
    getPDF () {
      util.handleWindowPrint('#pdfDom', this.qualification.qualificationName)
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

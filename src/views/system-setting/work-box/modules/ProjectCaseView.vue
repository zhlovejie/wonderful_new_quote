<template>
  <a-modal
    title="工程案例"
    :width="940"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <div class="table-page-search-wrapper">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="案例名称">
              {{ projectCase.caseName }}
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="小区名称">
              {{ projectCase.unitName }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="图片">
              <template v-for="url in urls">
                <img :key="url.index" style="width:200px;higth:200px" :src="url"/>
              </template>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>
<script>

export default {
  data () {
    return {
      visible: false, // 是否显示
      projectCase: {},
      urls: [],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (record) {
      this.visible = true
      this.projectCase = record
      var photoUrls = record.photoUrls
      if (photoUrls != undefined && photoUrls != '') {
        this.urls = photoUrls.split(',')
      }
    },
    handleCancel () {
      this.urls = []
      this.form.resetFields() // 清空表
      this.visible = false
    }
  }
}
</script>

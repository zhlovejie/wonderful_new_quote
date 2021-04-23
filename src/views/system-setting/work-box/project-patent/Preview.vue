<template>
  <a-modal
    title="项目专利"
    :width="800"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <div class="table-page-search-wrapper">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="专利类别">
              {{ detail.dicText }}
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="专利名称">
              {{ detail.patentName }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item label="专利号">
              {{ detail.patentNum }}
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="专利申请日">
              {{ detail.applicationDate }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="专利图片">
              <template v-for="url in urls">
                <img :key="url.index" class="img" @click="showImg(url)" title="点击查看大图" :src="url"/>
              </template>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="专利描述">
              <p v-html="detail.patentDescription" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <ImgView ref="imgView" />
  </a-modal>
</template>
<script>
import ImgView from '@/components/CustomerList/ImgView'
export default {
  components: { ImgView },
  data () {
    return {
      visible: false, // 是否显示
      detail: {},
      urls: [],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (record) {
      this.visible = true
      this.detail = record
      var originalUrl = record.originalUrl
      if (originalUrl) {
        try{
          this.urls = JSON.parse(originalUrl).map(item => item.origin)
        }catch(err){
          console.log(err)
        }
      }
    },
    handleCancel () {
      this.urls = []
      this.form.resetFields() // 清空表
      this.visible = false
    },
    showImg(url) {
      this.$refs.imgView && this.$refs.imgView.show(url)
    },
  }
}
</script>

<style scoped>
  .img{
    max-width: 200px;
    height: auto;
    margin-right: 10px;
    box-shadow: 0 3px 3px #ddd;
    border-radius: 3px;
    cursor: pointer;
  }
</style>

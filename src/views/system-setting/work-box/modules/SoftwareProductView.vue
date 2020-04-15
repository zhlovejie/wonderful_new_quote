<template>
  <a-modal
    title="软件产品信息"
    :width="640"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <div class="table-page-search-wrapper">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              {{ product.nameText }}
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="版本">
              {{ product.version }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="功能点" >
              <div class="points-wrapper" v-html="product.functionHTML">
                
              </div>
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
      product: {},
      visible: false, // 是否显示
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show (record) {
      this.visible = true
      this.product = record
      if(!record.function){
        this.product.functionHTML = '<div>无</div>'
      }else{
        this.product.functionHTML = record.function.split(',').map(s =>{
          return '<div class="point-item">'+s+'</div>'
        }).join('')
      }
      
      console.log(record)
    },
    handleCancel () {
      this.form.resetFields() // 清空表
      this.visible = false
    }
  }
}
</script>

<style scoped>
  .points-wrapper{
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    align-items: center;
  }
  .points-wrapper >>> .point-item{
    width: 33.33%;
    text-align: center;
    background-color: #e6f7ff;
    border-color: #fff;
    border-width: 0 1px 1px 0;
    border-style: solid;
  }
</style>
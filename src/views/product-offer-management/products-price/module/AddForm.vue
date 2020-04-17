<template>
  <a-modal
    :title="modalTitle"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">

        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">
              {{modelTitle}}
            </td>
            <td>
              {{modelName}}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding:0;height:auto;">
              <table class="custom-table custom-table-border" style="margin-bottom:0;">
                <tr>
                  <th style="width:149px;">序号</th>
                  <th>配置名称</th>
                </tr>
                <template v-if="productList.length > 0">
                  <tr v-for="(item,index) in productList" :key="index">
                    <td>{{item.orderNo}}</td>
                    <td>{{item.name}}</td>
                  </tr>
                </template>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              标配价格
            </td>
            <td>
              <a-input-number style="width:100%;" :precision=2 :min=0 :value="price" @change="priceChange" />
            </td>
          </tr>
        </table>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  priceAdjustPricingRecordDetail,
  priceAdjustPricingRecordPrice
} from '@/api/productOfferManagement'
export default {
  name:"addForm",
  data(){
    return {
      form: this.$form.createForm(this, { name: 'addForm' }),
      visible: false,
      actionType: 'add',
      spinning: false,
      record: {},

      modelName:'',
      productList:[],
      price:undefined
    }
  },
  computed: {
    modalTitle() {
      return '核价'
    },
    modelTitle(){
      return this.record.__activeTxt
    }
  },
  methods:{
    init() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async handleOk() {
      let that = this
      let values = {
        id:that.record.id,
        price:that.price || 0,
        type:that.record.__activeKey
      }
      that.spinning = true
      priceAdjustPricingRecordPrice(values)
        .then(res => {
          that.spinning = false
          if (res.code === 200) {
            that.visible = false
            that.$message.success('操作成功')
            that.$emit('finish')
          } else {
            that.$message.warning(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
          that.$message.error('操作失败')
          that.spinning = false
        })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      await that.init()
      that.visible = true

      that.modelName = ''
      that.productList = []
      that.spinning = true
      priceAdjustPricingRecordDetail({ id: record.id ,type:record.__activeKey}).then(res => {
        that.spinning = false
        that.modelName = res.data.name
        let configVoList = res.data.configVoList || []
        that.productList = configVoList.map(item =>Object.assign({},item))
        that.price = res.data.price === null ? undefined : parseFloat(res.data.price)
      }).catch(err =>{
        that.spinning = false
        that.$message.error(err.message)
      })
    },
    priceChange(e){
      console.log(arguments)
      this.price = e
    }
  }
}
</script>

<style scoped>

</style>
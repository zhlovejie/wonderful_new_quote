<template>
  <a-modal
    :title="modalTitle"
    :width="1250"
    :visible="visible"
    :destroyOnClose="true"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <PurchaseContractView
      ref="purchaseContractView"
      action="view"
      :record="{ id: record.id }"
      :showExitButton="false"
      :from="from"
    />
  </a-modal>
</template>


<script>
import PurchaseContractView from "./AddForm.vue"
export default {
  components:{
    PurchaseContractView
  },
  data(){
    return {
      modalTitle:'采购合同',
      visible:false,
      record:{},
      type:'add',
      from:'dashboard'
    }
  },
  methods:{
    query(type,record){
      const that = this
      that.type = type
      that.record = {...record}
      that.visible = true
  
      that.$nextTick(() => {
        that.$refs.purchaseContractView.init()
      })
    },
    handleCancel(){
      this.visible = false
    }
  }
}
</script>
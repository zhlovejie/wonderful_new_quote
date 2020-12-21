<template>
  <a-modal
    :title="title"
    :width="450"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleOK"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="loading"
  >
    <a-form-item label="剩余时间调整" >
      <a-input-number 
        style="width:100%;"
        :min="5"
        :max="365" 
        v-model="contactCycle"
      />
    </a-form-item>
  </a-modal>
</template>

<script>
import { modifyRemainingTime} from '@/api/customer'
export default {
  name:'',
  data(){
    return {
      title:'剩余时间调整',
      visible:false,
      loading:false,
      record:{},
      contactCycle:0,
      maxContactCycle:0
    }
  },
  methods:{
    query(record={}){
      this.visible = true
      //this.contactCycle = 0
      this.record = {...record}
      this.contactCycle = this.record.contactCycle || 0
      this.maxContactCycle = this.record.source === '自开发客户' ? 365 : 90
    },
    handleOK(){
      let that = this
      that.loading = true
      modifyRemainingTime(
        `customerId=${that.record.id}&days=${that.contactCycle}`
      ).then(res => {
        that.loading = false
        that.$message.info(res.msg)
        that.$emit('modifyRemainingTime')
        that.handleCancel()
      })
      .catch(err => {
        that.loading = false
        that.$message.info(`错误：${err.message}`)
      })
    },
    handleCancel(){
      this.visible = false
    }
  }
}
</script>
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
    <a-form-item label="剩余联系时间(天)" >
      <a-input-number 
        style="width:100%;"
        :min="1"
        :max="maxContactCycle" 
        v-model="contactCycle"
      />
    </a-form-item>
    <a-alert message="注：设置天数不可大于当前剩余联系时间天数。" banner />
  </a-modal>
</template>

<script>
import { modifyRemainingTime} from '@/api/customer'
export default {
  name:'ModifyRemainingTime',
  data(){
    return {
      title:'剩余联系时间调整',
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
      //取的分钟数，，转换为天数显示
      this.contactCycle = Math.floor((this.record.concatMin || 0) / 60 / 24)
      this.maxContactCycle = Math.floor((this.record.concatMin || 0) / 60 / 24)
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
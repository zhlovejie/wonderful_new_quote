<template>
<a-modal
    title="财务状态"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
    <a-form class="wdf-custom-add-form-wrapper">
      <DepUserSelect 
        :depId="undefined"
        :userId="undefined"
        @change="depUserChange"
        style="width:100%;"
      />
    </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {signExceptionUpdate} from '@/api/attendanceManagement'
import DepUserSelect from '../business-trip-apply/DepUserSelect'
let uuid = () =>Math.random().toString(32).slice(-10)
export default {
  name:'do-form',
  components:{
    DepUserSelect
  },
  data(){
    return {
      visible:false,
      record:{},
      userId:null,
      spinning:false
    }
  },
  methods:{
    query(type,record){
      let that = this
      that.visible = true
      that.record = that.$_.cloneDeep(record || {})
    },
    handleOk(){
      let that = this
      that.spinning = true
      signExceptionUpdate({id:that.record.id,userId:that.userId}).then(res =>{
        console.log(res)
        that.spinning = false
        that.handleCancel()
        that.$emit('finish')
      }).catch(err =>{
        that.spinning = false
      })
    },
    handleCancel(){
      let that = this
      that.visible = false
    },
    depUserChange(depId,userId){
      this.userId = userId
    }
  }
}
</script>

<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item{
  display:flex;
  margin: 0;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}
</style>
<template>
  <a-modal
    :title="modalTitle"
    :width="780"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-form :form="form" class="search-form-wrapper">
      <a-row :gutter="0">
        <a-col :span="24">基本信息</a-col>
        <a-col :span="12">
          <a-form-item label="客户名称">
            <a-input v-decorator="['customerName']" placeholder="客户名称" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="提交人">
            <a-input v-decorator="['createName']" placeholder="提交人" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="收款编号">
            <a-input v-decorator="['receiptCode']" placeholder="收款编号" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="合同编号">
            <a-input v-decorator="['contractNum']" placeholder="合同编号" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="提交时间">
            <a-range-picker v-decorator="['sDate']" style="width:100%;" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="单据状态">
            <a-select v-decorator="['approveStatus',{initialValue:0}]" placeholder="单据状态">
              <a-select-option :value="0">全部</a-select-option>
              <a-select-option :value="1">待审批</a-select-option>
              <a-select-option :value="2">通过</a-select-option>
              <a-select-option :value="3">不通过</a-select-option>  
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="收款日期">
            <a-range-picker v-decorator="['dDate']" style="width:100%;" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="0" type="flex" justify="center">
        <a-col :span="3">
          <a-button key="close" icon="close" @click="actionHandler('close')">取消</a-button>
        </a-col>
        <a-col :span="3">
          <a-button key="reload" icon="reload" @click="actionHandler('reset')">重置</a-button>
        </a-col>
        <a-col :span="3">
          <a-button key="search" type="primary" icon="search" @click="actionHandler('search')">查询</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
export default {
  name: 'searchForm',
  components:{
  },
  data() {
    return {
      modalTitle: '高级筛选',
      visible: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    query() {
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    actionHandler(type) {
      if (type === 'close') {
        this.handleCancel()
      } else if (type === 'reset') {
        this.form.resetFields()
      } else if (type === 'search') {
        let values = this.form.getFieldsValue()
        if(Array.isArray(values.sDate) && values.sDate.length === 2){
          values.startTime = values.sDate[0].format('YYYY-MM-DD')
          values.endTime = values.sDate[1].format('YYYY-MM-DD')
          delete values.sDate
        }else{
          values.startTime = undefined
          values.endTime = undefined
          delete values.sDate
        }
        if(Array.isArray(values.dDate) && values.dDate.length === 2){
          values.receiptStartTime = values.dDate[0].format('YYYY-MM-DD')
          values.receiptEndTime = values.dDate[1].format('YYYY-MM-DD')
          delete values.dDate
        }else{
          values.receiptStartTime = undefined
          values.receiptEndTime = undefined
          delete values.dDate
        }
        console.log(values)
        this.$emit('change', values)
        this.handleCancel()
      }
    }
  }
}
</script>
<style scoped>
.search-form-wrapper >>> .ant-form-item{
  display: flex;
}
.search-form-wrapper >>> .ant-form-item-control-wrapper{
  flex: 1;
}
.search-form-wrapper >>> .ant-form-item-label{
  display: inline-block;
  width: 120px;
}

</style>
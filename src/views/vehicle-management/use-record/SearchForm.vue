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
        <a-col :span="24">
          <h3>基本信息</h3>
        </a-col>
        <a-col :span="12">
          <a-form-item label="提交人">
            <a-input v-decorator="['userName']" placeholder="提交人" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态">
            <a-select v-decorator="['status',{initialValue:1}]" placeholder="状态" :allowClear="true">
              <a-select-option :value="1">待审批</a-select-option>
              <a-select-option :value="2">完结</a-select-option>
              <a-select-option :value="3">不通过</a-select-option>
              <a-select-option :value="4">已撤回</a-select-option>
              <a-select-option :value="5">待出车</a-select-option>
              <a-select-option :value="6">待回车</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="提交时间">
            <a-range-picker v-decorator="['sDate']" style="width:100%;" :allowClear="true"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="0">
        <a-col :span="24">
          <h3>车辆信息</h3>
        </a-col>
        <a-col :span="12">
          <a-form-item label="车牌号">
            <a-input v-decorator="['productName']" placeholder="产品名称" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="驾车方式">
            <a-select v-decorator="['driverMode',{initialValue:1}]" placeholder="驾车方式" :allowClear="true">
              <a-select-option :value="1">自驾</a-select-option>
              <a-select-option :value="2">司机</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="司机">
            <a-input v-decorator="['driverUserName']" placeholder="司机" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="用车时间">
            <a-range-picker v-decorator="['sUseDate']" style="width:100%;" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="出车时间">
            <a-range-picker v-decorator="['sOutDate']" style="width:100%;" :allowClear="true"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="回车时间">
            <a-range-picker v-decorator="['sBackDate']" style="width:100%;" :allowClear="true"/>
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
          values.beginTime = values.sDate[0].format('YYYY-MM-DD')
          values.endTime = values.sDate[1].format('YYYY-MM-DD')
          delete values.sDate
        }else{
          values.beginTime = undefined
          values.endTime = undefined
          delete values.sDate
        }
        if(Array.isArray(values.sUseDate) && values.sUseDate.length === 2){
          values.beginUseTime = values.sUseDate[0].format('YYYY-MM-DD')
          values.endUseTime = values.sUseDate[1].format('YYYY-MM-DD')
          delete values.sUseDate
        }else{
          values.beginUseTime = undefined
          values.endUseTime = undefined
          delete values.sUseDate
        }
        if(Array.isArray(values.sOutDate) && values.sOutDate.length === 2){
          values.beginOutTime = values.sOutDate[0].format('YYYY-MM-DD')
          values.endOutTime = values.sOutDate[1].format('YYYY-MM-DD')
          delete values.sOutDate
        }else{
          values.beginOutTime = undefined
          values.endOutTime = undefined
          delete values.sOutDate
        }
        if(Array.isArray(values.sBackDate) && values.sBackDate.length === 2){
          values.beginBackTime = values.sBackDate[0].format('YYYY-MM-DD')
          values.endBackTime = values.sBackDate[1].format('YYYY-MM-DD')
          delete values.sBackDate
        }else{
          values.beginBackTime = undefined
          values.endBackTime = undefined
          delete values.sBackDate
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
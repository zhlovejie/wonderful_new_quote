<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-form :form="form" class="search-form-wrapper">
      <a-row :gutter="0">
        <a-col :span="24">基本信息</a-col>
        <a-col :span="24">
          <a-form-item label="工艺路线代码">
            <a-input v-decorator="['routeCode']" placeholder="工艺路线代码" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="工艺路线名称">
            <a-input v-decorator="['routeName']" placeholder="工艺路线名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="物料代码">
            <a-input v-decorator="['materialCommonCode']" placeholder="物料代码" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="物料名称">
            <a-input v-decorator="['materialCommonName']" placeholder="物料名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24" >
          <a-form-item label="审核">
            <a-select v-decorator="['status']" :allowClear="true" placeholder="审核状态">
              <a-select-option :value="1">待审核</a-select-option>
              <a-select-option :value="2">审核中</a-select-option>
              <a-select-option :value="3">审核通过</a-select-option>
              <a-select-option :value="4">审核不通过</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="缺省状态">
            <a-radio-group v-decorator="['defaultStatus']" style="width: 100%">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-col :span="24">操作信息</a-col>
        <a-col :span="24">
          <a-form-item label="提交人">
            <a-input v-decorator="['createdName']" placeholder="提交人" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="提交时间">
            <a-range-picker v-decorator="['date']" style="width: 100%"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="0" type="flex" justify="center">
        <a-col :span="3" >
          <a-button key="close" icon="close" @click="actionHandler('close')">取消</a-button>
        </a-col>
        <a-col :span="3" :offset="1">
          <a-button key="reload" icon="reload" @click="actionHandler('reset')">重置</a-button>
        </a-col>
        <a-col :span="3" :offset="1">
          <a-button key="search" type="primary" icon="search" @click="actionHandler('search')">查询</a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
export default {
  name: 'searchForm',
  components: {},
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
        if (Array.isArray(values.date)) {

          if (values.date.length === 2) {
            values.startTime = values.date[0].format('YYYY-MM-DD')
            values.endTime = values.date[1].format('YYYY-MM-DD')
          } else {
            values.startTime = undefined
            values.endTime = undefined
          }
        }
        delete values.date
        console.log(values)
        this.$emit('change', values)
        this.handleCancel()
      }
    }
  }
}
</script>
<style scoped>
.search-form-wrapper >>> .ant-form-item {
  display: flex;
}
.search-form-wrapper >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.search-form-wrapper >>> .ant-form-item-label {
  display: inline-block;
  width: 120px;
}
</style>

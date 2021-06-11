<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-form :form="form" class="search-form-wrapper">
      <a-row :gutter="0">
        <a-col :span="24">基本信息</a-col>
        <a-col :span="12">
          <a-form-item label="BOM单编号">
            <a-input v-decorator="['bomCode']" placeholder="BOM单编号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="物料代码">
            <a-input v-decorator="['materialCode']" placeholder="物料代码" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="物料名称">
            <a-input v-decorator="['materialName']" placeholder="物料名称" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="规格型号">
            <a-input v-decorator="['modelType']" placeholder="规格型号" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="物料属性">
            <a-input v-decorator="['materialProperty']" placeholder="物料属性" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="备注">
            <a-input v-decorator="['remark']" placeholder="备注" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="12" >
          <a-form-item label="审核">
            <a-select v-decorator="['status']" :allowClear="true" placeholder="审核状态">
              <a-select-option :value="0">待审核</a-select-option>
              <a-select-option :value="1">待审批</a-select-option>
              <a-select-option :value="2">通过</a-select-option>
              <a-select-option :value="3">不通过</a-select-option>
              <a-select-option :value="4">已反审核</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="使用">
            <a-radio-group v-decorator="['useStatus',{initialValue: 0}]" style="width: 100%">
              <a-radio :value="0">未使用</a-radio>
              <a-radio :value="1">使用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-col :span="24">操作信息</a-col>
        <a-col :span="24">
          <a-form-item label="最后更新人">
            <a-input v-decorator="['modifierName']" placeholder="最后更新人" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="最后更新时间">
            <a-range-picker v-decorator="['updateDate']" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="审核人">
            <a-input v-decorator="['auditName']" placeholder="审核人" :allowClear="true" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="审核时间">
            <a-range-picker v-decorator="['auditDate']" style="width: 100%"/>
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
          if (values.updateDate.length === 2) {
            values.startModifyTime = values.date[0].format('YYYY-MM-DD')
            values.endModifyTime = values.date[1].format('YYYY-MM-DD')
          } else {
            values.startModifyTime = undefined
            values.endModifyTime = undefined
          }

          if (values.auditDate.length === 2) {
            values.startAuditTime = values.date[0].format('YYYY-MM-DD')
            values.endAuditTime = values.date[1].format('YYYY-MM-DD')
          } else {
            values.startAuditTime = undefined
            values.endAuditTime = undefined
          }
        }
        delete values.updateDate
        delete values.auditDate
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

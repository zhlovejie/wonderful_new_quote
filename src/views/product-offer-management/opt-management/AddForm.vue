<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        class="addform-wrapper"
      >
        <a-form-model-item
          label="配置类型"
          prop="configType"
        >
          <a-radio-group
            v-model="form.configType"
            :disabled="form.disabledConfigType"
          >
            <a-radio :value="0">配置名称</a-radio>
            <a-radio :value="1">配置参数</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="上级配置"
          prop="parentConfigId"
        >
          <a-input v-model="form.parentConfigName" />
        </a-form-model-item>
        <a-form-model-item
          label="配置名称"
          prop="configName"
        >
          <a-input v-model="form.configName" />
        </a-form-model-item>
        <a-form-model-item
          label="顺序号"
          prop="serialNumber"
        >
          <a-input-number
            v-model="form.serialNumber"
            style="width: 100%"
            :min="1"
            :max="9999"
            :step="1"
          />
        </a-form-model-item>
        <a-form-model-item
          label="说明"
          prop="configExplain"
        >
          <a-input
            v-model="form.configExplain"
            type="textarea"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { priceQuotedItemConfigAddOrUpdate } from '@/api/productOfferManagement'
export default {
  name: 'product-offer-management-opt-management_AddForm',
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      treeData: [],
      value: [],
      form: {},
      rules: {},
      detail: {}
    }
  },
  created() {},
  computed: {
    modalTitle() {
      return this.type === 'add' ? '新增' : '修改'
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true
      const { __selectItem, __treeData } = record

      if (that.isAdd) {
        that.form = {
          ...that.form,
          parentConfigId: __selectItem.key,
          parentConfigName: __selectItem.title,
          disabledConfigType: +__selectItem.parentId !== 0,
          configType: __selectItem.configType
        }
      } else if (that.isEdit) {
        that.form = {
          ...that.form,
          parentConfigId: __selectItem.key,
          parentConfigName: __selectItem.title,
          disabledConfigType: +__selectItem.parentId !== 0,
          id: record.id,
          configName: record.configName,
          serialNumber: record.serialNumber,
          configExplain: record.configExplain,
          configType: record.configType
        }
      }
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          priceQuotedItemConfigAddOrUpdate({ ...that.form })
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              that.$emit('finish')
              that.handleCancel()
            })
            .catch(err => (that.spinning = false))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      const that = this
      that.$refs.ruleForm.resetFields()
      that.form = {}
      that.$nextTick(() => (that.visible = false))
    }
  }
}
</script>

<style scoped>
.addform-wrapper >>> .ant-form-item {
  display: flex;
}
.addform-wrapper >>> .ant-form-item .ant-form-item-label {
  width: 140px;
  text-align: left;
}
.addform-wrapper >>> .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}
</style>


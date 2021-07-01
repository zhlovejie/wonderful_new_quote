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
        <a-form-model-item label="顺序号" prop="serialNumber">
          <a-input-number v-model="form.serialNumber" style="width: 100%" :min="1" :max="9999" :step="1"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>

import {
  priceQuotedItemConfigAddOrUpdate
} from '@/api/productOfferManagement'
export default {
  name: 'product-offer-management-opt-management_PriceForm',
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      treeData: [],
      value: [],
      form: {},
      rules:{},
      detail:{}
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
      that.visible = true


    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          priceQuotedItemConfigAddOrUpdate({...that.form}).then((res) => {
              that.spinning = false
              that.$message.info(res.msg)
              that.$emit('finish')
              that.handleCancel()
            })
            .catch((err) => (that.spinning = false))
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    handleCancel() {
      const that = this
      that.$refs.ruleForm.resetFields();
      that.form = {}
      that.$nextTick(() => that.visible = false)
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


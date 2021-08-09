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
          v-for="(item,index) in form.priceQuotedItemConfigList"
          :key="item.id"
          :label="item.configName"
          :prop="'priceQuotedItemConfigList.' + index + '.price'"
          :rules="{
            message: '请输入价格',
            trigger: 'change',
            validator:customValidator
          }"
        >
          <a-input-number
            v-model="item.price"
            style="width: 100%"
            :min="0"
            :max="99999999"
            :step="1"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { priceQuotedItemConfigSetPrices } from '@/api/productOfferManagement'
export default {
  name: 'product-offer-management-opt-management_PriceForm',
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      form: {
        priceQuotedItemConfigList: []
      },
      rules: {}
    }
  },
  created() {},
  computed: {
    modalTitle() {
      return '核价'
    }
  },
  methods: {
    async query(rows) {
      const that = this
      that.visible = true
      that.form = { ...that.form, priceQuotedItemConfigList: rows }
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          priceQuotedItemConfigSetPrices({ ...that.form })
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
      that.form = { priceQuotedItemConfigList: [] }
      that.$nextTick(() => (that.visible = false))
    },
    customValidator(rule, value, callback) {
      if (String(value).length === 0) {
        callback(new Error('请输入价格'))
      } else if (+value <= 0) {
        callback(new Error('价格必须大于零'))
      } else {
        callback()
      }
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


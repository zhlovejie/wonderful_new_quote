<template>
  <a-modal
    :title="modalTitle"
    :width="1050"
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
          label="中控系统名称"
          prop="configName"
        >
          <a-input v-model="form.configName" />
        </a-form-model-item>

        <OptionsSelect key="k1" modelTitle="标准配置" v-model="optStandItems" />

        <OptionsSelect key="k2" modelTitle="选择配置" v-model="optChoiceItems" />

        <a-form-model-item
          label="备注"
          prop="remark"
        >
          <a-input
            v-model="form.remark"
            type="textarea"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { priceQuotedItemConfigAddOrUpdate } from '@/api/productOfferManagement'
import OptionsSelect from './OptionsSelect'
export default {
  name: 'product-offer-management-opt-management_AddForm',
  components:{OptionsSelect},
  data() {
    return {
      type: 'add',
      visible: false,
      spinning: false,
      treeData: [],
      value: [],
      form: {},
      rules: {},
      detail: {},

      optStandItems:[], // 标配
      optChoiceItems:[],// 选配
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

</style>


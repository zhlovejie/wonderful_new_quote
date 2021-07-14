<template>
  <a-modal
    title="更换项目负责人"
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
        <a-form-model-item label="原项目负责人" >
          <span>
            {{that.detail.chargeDepartmentName}}-{{that.detail.chargeUserName}}
          </span>
        </a-form-model-item>

        <a-form-model-item label="新项目负责人" prop="chargeUserName">
          <DepUserSelect
            @change="(...args) => depUserChange('charge',...args)"
          />
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>

import { changeProductChargeUser } from '@/api/researchManagementByWzz'
import DepUserSelect from '@/components/CustomerList/DepUserSelect'

export default {
  components: {
    DepUserSelect
  },
  data() {
    return {

      visible: false,
      spinning: false,
      form: {

      },
      rules: {},
      detail:{}
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.detail = {}
      that.visible = true

       that.spinning = true
        await listProjectAllDetail({ projectId: record.id })
          .then(res => {
            that.spinning = false
            that.detail = {...res.data}
          })
          .catch(err => {
            that.spinning = false
            console.log(err)
          })
    },

    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.spinning = true
          changeProductChargeUser({ ...that.form ,id:that.detail.id})
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
    },
    depUserChange(type, depId, userId,targetDep,targetUser) {
      if(!(targetDep && targetUser)){
        return
      }
      this.form = {
        ...this.form,
        chargeDepartmentId: depId,
        chargeDepartmentName:targetDep.departmentName,
        chargeUserId: userId ,
        chargeUserName:targetUser.trueName
      }
    }
  }
}
</script>

<style scoped>

</style>


<template>
  <a-modal
    :title="modalTitle"
    :width="700"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <!-- <h3 style="text-align:center;font-weight:blod;">补卡规则</h3> -->
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td>超出小时数</td>
            <td style="text-align: left">
              <a-form-item>
                <a-input-number
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  :precision="1"
                  v-decorator="[
                    'exceedHours',
                    { initialValue: detail.exceedHours, rules: [{ required: true, message: '请输入超出小时数' }] },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>扣除工资</td>
            <td style="text-align: left">
              <a-form-item>
                <a-input-number
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="[
                    'deductWages',
                    { initialValue: detail.deductWages, rules: [{ required: true, message: '请输入扣除工资' }] },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { attenceRestTimeoutUpdate } from '@/api/attendanceManagement'
export default {
  name: 'attendance-rules-setting-rest-timeout-add',
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
    }
  },
  computed: {
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '修改'}调休超时记录`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
  },
  methods: {
    query(type, record) {
      this.actionType = type
      this.form.resetFields()
      this.$nextTick(() => (this.visible = true))
      if (this.isAdd) {
        this.detail = {}
        return
      }
      this.detail = Object.assign({}, record)
    },
    handleSubmit() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          values.id = that.detail.id
          console.log('Received values of form: ', values)
          that.spinning = true
          attenceRestTimeoutUpdate(values)
            .then((res) => {
              that.$message.info(res.msg)
              that.spinning = false
              that.handleCancel()
              that.$emit('finish')
            })
            .catch((err) => {
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
  },
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.wdf-custom-add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.wdf-custom-add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
</style>
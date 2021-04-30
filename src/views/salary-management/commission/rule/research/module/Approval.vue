<template>
  <a-modal
    title="智能产品提成"
    :width="600"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form :form="form" class="becoming-form-wrapper">
      <table class="custom-table custom-table-border">
        <tr>
          <td>智能产品提成系数</td>
          <td>
            <a-form-item>
              <a-input-number
                :precision="6"
                style="width: 100%"
                placeholder="输入智能产品提成系数"
                v-decorator="['percentageRetio', { rules: [{ required: true, message: '请输入智能产品提成系数!' }] }]"
              />
            </a-form-item>
          </td>
        </tr>
        <tr>
          <td>备注</td>
          <td>
            <a-form-item>
              <a-textarea
                placeholder="备注"
                :rows="3"
                v-decorator="['remarks', { rules: [{ required: false, message: '请输入备注' }] }]"
              />
            </a-form-item>
          </td>
        </tr>
      </table>
    </a-form>
  </a-modal>
</template>

<script>
import { getSalaryIntelligent_addAndUpdate } from '@/api/bonus_management'
export default {
  name: 'ApprovalModal',
  data() {
    return {
      visible: false,
      type: undefined,
      record: {},
      form: this.$form.createForm(this, { name: 'ApprovalModal' }),
    }
  },
  methods: {
    query(type, record) {
      this.form.resetFields() //  清空表
      this.visible = true
      this.type = type
      this.record = record
      if (type === 'edit-salary') {
        this.fillData()
      }
    },
    fillData() {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          percentageRetio: this.record.percentageRetio,
          remarks: this.record.remarks,
        })
      })
    },
    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          if (values.percentageRetio > 1 || values.percentageRetio === 1) {
            return this.$message.error('管理总提成系数不能大于1')
          }
          if (this.type === 'edit-salary') {
            values.id = this.record.id
          }
          getSalaryIntelligent_addAndUpdate(values).then((res) => {
            if (res.code === 200) {
              that.form.resetFields() // 清空表
              that.visible = false
            }
          })
        }
      })
    },
    handleCancel() {
      let that = this
      that.form.resetFields() // 清空表
      that.visible = false
    },
  },
}
</script>
<style scoped>
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>
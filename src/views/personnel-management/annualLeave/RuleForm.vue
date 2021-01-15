<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 150px">部门</td>
            <td>{{ record.departmentName }}</td>
          </tr>
          <tr>
            <td style="width: 150px">姓名</td>
            <td>{{ record.userName }}</td>
          </tr>
          <tr>
            <td style="width: 150px">操作</td>
            <td>
              <a-form-item>
                <a-radio-group
                  name="radioGroup"
                  v-decorator="['type', { initialValue: 1, rules: [{ required: false, message: '请选择是否有凭证' }] }]"
                >
                  <a-radio :value="1"> 增加 </a-radio>
                  <a-radio :value="2"> 减少 </a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 150px">可用调休(h)</td>
            <td>
              <a-form-item>
                <a-input-number
                  :min="0"
                  :precision="1"
                  step="0.5"
                  style="width: 100%"
                  @change="onChange"
                  v-decorator="['restHours', { rules: [{ required: false, message: '请输入可用调休' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 150px">剩余年假(h)</td>
            <td>
              <a-form-item>
                <a-input-number
                  :min="0"
                  :precision="1"
                  step="0.5"
                  style="width: 100%"
                  @change="onChange1"
                  v-decorator="['annualVacationHours', { rules: [{ required: false, message: '请输入剩余年假' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 150px">原因</td>
            <td>
              <a-form-item>
                <a-textarea
                  style="width: 100%"
                  placeholder="修改原因"
                  :rows="2"
                  v-decorator="['reason', { rules: [{ required: true, message: '请输入修改原因' }] }]"
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
import { annualupdate } from '@/api/personnelManagement'
// import {
//   customerPunishDetailAddOrUpdate
// } from '@/api/customerReleaseRule'
import moment from 'moment'
export default {
  name: 'RuleForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this, { name: 'add_form' }),
      visible: false,
      actionType: 'add',
      spinning: false,
      record: {},
    }
  },
  computed: {
    modalTitle() {
      return this.isAdd ? '新增' : '修改'
    },
    isView() {
      return this.actionType === 'view'
    },

    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
  },
  methods: {
    moment: moment,

    init() {
      let that = this
      return Promise.all([])
    },
    async handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          values.userId = that.record.userId
          //提交
          that.spinning = true
          annualupdate(values)
            .then((res) => {
              that.spinning = false
              that.form.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    onChange(value) {
      let tmp = value * 10
      if (!(tmp % 5) && value * 10 - tmp < 0.000001) {
        return
      } else {
        this.$message.error('最小时长半小时')
        this.$nextTick(() =>
          this.form.setFieldsValue({
            restHours: '',
          })
        )
      }
    },
    onChange1(value) {
      let tmp = value * 10
      if (!(tmp % 5) && value * 10 - tmp < 0.000001) {
        return
      } else {
        this.$message.error('最小时长半小时')
        this.$nextTick(() =>
          this.form.setFieldsValue({
            annualVacationHours: '',
          })
        )
      }
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.actionType = type
      that.record = record || {}
      that.form.resetFields()
      await that.init()
      that.visible = true
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
  height: 60px;
}
.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
</style>
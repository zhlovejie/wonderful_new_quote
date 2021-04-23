<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <h3>会议负责人处罚规则</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="wdf-column">会议时间</td>
            <td>
              <a-form-item>规定时间内超时/未开</a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">会议时长(分钟)</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isView"
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  :precision="0"
                  v-decorator="[
                    'meetingTime',
                    { initialValue: detail.meetingTime, rules: [{ required: true, message: '请输入会议时长' }] },
                  ]"
                />
                <span v-else>{{ detail.meetingTime }}</span>
                <!-- <span>{{ detail.meetingTime }}</span> -->
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">处罚金额(元/次)</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isView"
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="[
                    'headPenaltyAmount',
                    { initialValue: detail.headPenaltyAmount, rules: [{ required: true, message: '请输入处罚金额' }] },
                  ]"
                />
                <span v-else>{{ detail.headPenaltyAmount }}</span>
              </a-form-item>
            </td>
          </tr>
        </table>
        <h3 style="margin-top: 20px">参会人员处罚规则</h3>
        <table class="custom-table custom-table-border">
          <tr>
            <td class="wdf-column">标准</td>
            <td>
              <a-form-item>无故旷会且未请假</a-form-item>
            </td>
          </tr>
          <tr>
            <td class="wdf-column">处罚金额(元/次)</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isView"
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  :precision="2"
                  v-decorator="[
                    'participantPenaltyAmount',
                    {
                      initialValue: detail.participantPenaltyAmount,
                      rules: [{ required: true, message: '请输入处罚金额' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.participantPenaltyAmount }}</span>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addAndUpdateMeetingPenaltyRules } from '@/api/meetingManagement'

export default {
  name: 'meeting-penalty-rules-AddForm',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this, { name: 'meeting-penalty-rules-AddForm' }),
      visible: false,
      actionType: 'view',
      spinning: false,
      detail: {},
    }
  },
  computed: {
    modalTitle() {
      return this.isView ? '查看' : this.isAdd ? '新增' : '编辑'
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
  },
  methods: {
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          that.spinning = true
          addAndUpdateMeetingPenaltyRules(values)
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
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      let that = this
      that.visible = true
      that.actionType = type
      that.detail = { ...record }
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
}

.wdf-column {
  width: 160px;
}
</style>

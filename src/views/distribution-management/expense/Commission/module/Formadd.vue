<template>
  <a-modal
    :title="modalTitle"
    :width="900"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction(recordDetails)">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td>规则名称</td>
            <td>
              <a-form-item>
                <a-input
                  v-if="!isDisabled"
                  placeholder="规则名称"
                  :allowClear="true"
                  v-decorator="[
                    `ruleName`,
                    {
                      initialValue: detail.ruleName,
                      rules: [{ required: true, message: '请输入规则名称' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.ruleName }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>回访比例（%）</td>
            <td>
              <a-form-item>
                <a-input-number
                  v-if="!isDisabled"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                  v-decorator="[
                    `proportion`,
                    {
                      initialValue: detail.proportion,
                      rules: [{ required: true, message: '请输入回访比例' }],
                    },
                  ]"
                />
                <span v-else>{{ detail.proportion }}</span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="备注"
                  :rows="2"
                  v-decorator="[
                    'remarks',
                    { initialValue: detail.remarks, rules: [{ required: false, message: '请输入备注' }] },
                  ]"
                />
                <span v-else>{{ detail.remarks }}</span>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { addAndUpdateFeeRule, addAndapproval } from '@/api/distribution-management'
import Approval from './Approval'
import moment from 'moment'

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      remark: '',
      visible: false,
      spinning: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
      detail: {},
    }
  },

  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改提成规则'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}提成规则`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isView5() {
      //查看
      return this.type === 'view5'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isApproval() {
      //通过不通过
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },
  },
  created() {},
  methods: {
    moment,
    //接受数据
    query(type, record) {
      let that = this
      that.visible = true
      that.type = type
      that.record = record
      that.detail = {}
      that.form.resetFields()
      if (type === 'add') return
      //填充数据
      that.detail = { ...(record || {}) }
      that.form.setFieldsValue({
        ...(record || {}),
      })
    },

    //提交
    handleOk() {
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            if (that.type === 'edit-salary') {
              values.id = that.record.id
            }
            if (that.type === 'add' || that.type === 'edit-salary') {
              that.spinning = true
              addAndUpdateFeeRule(values)
                .then((res) => {
                  this.programme = []
                  this.visible = false
                  that.spinning = false
                  that.form.resetFields() // 清空表
                  that.$message.info(res.msg)
                  that.$emit('finish')
                })
                .catch((err) => (that.spinning = false))
            }
          }
        })
      }
    },
    handleCancel() {
      this.programme = []
      this.remark = '' // 清空表
      this.visible = false
    },
    // 审批
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      addAndapproval(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        // opinion: '通过',
      })
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}
.ant-form-item {
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

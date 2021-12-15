<template>
  <a-modal
    :title="modalTitle"
    :width="800"
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
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td class="requiredMark">规则名称</td>
            <td>
              <a-form-item>
                <a-form-item>
                  <a-input
                    style="width: 250px"
                    :allowClear="true"
                    :disabled="isDisabled"
                    v-decorator="[
                      `ruleName`,
                      {
                        initialValue: detail.ruleName,
                        rules: [{ required: true, message: '请输入规则名称' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">大于呆滞天数(天)</td>
            <td>
              <a-form-item>
                <a-form-item>
                  <a-input-Number
                    style="width: 250px"
                    :allowClear="true"
                    :min="0"
                    :step="1"
                    :precision="0"
                    :disabled="isDisabled"
                    v-decorator="[
                      `sluggishDay`,
                      {
                        initialValue: detail.sluggishDay,
                        rules: [{ required: true, message: '请输入大于呆滞天数(天)' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="requiredMark">小于周转率（%）</td>
            <td>
              <a-form-item>
                <a-form-item>
                  <a-input-Number
                    style="width: 250px"
                    :allowClear="true"
                    :min="0"
                    :step="1"
                    :disabled="isDisabled"
                    :precision="4"
                    v-decorator="[
                      `turnoverRate`,
                      {
                        initialValue: detail.turnoverRate,
                        rules: [{ required: true, message: '小于周转率（%）' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-form-item>
            </td>
          </tr>
        </table>
        <div>
          <p>&nbsp;&nbsp;</p>
          <p>注： 呆滞天数（天）： 最新入库日期距离当前时间,</p>
          <p>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;周转率： 总使用量占总采购的百分比</p>
        </div>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { productRuleaddOrUpdate, productapproval } from '@/api/storage'
import Approval from './Approval'

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      SalaryChang: 1,
      loading: false,
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
        return '修改'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}`
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

  methods: {
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      this.form.resetFields()
      if (type !== 'add') {
        // this.fillData()
        this.detail = record
      }
    },

    handleOk() {
      // console.log('你是要提交')
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            if (that.type === 'edit-salary') {
              values.id = that.record.id
              values.instanceId = this.record.instanceId
            }
            if (that.type === 'add' || that.type === 'edit-salary') {
              // that.spinning = true
              productRuleaddOrUpdate(values)
                .then((res) => {
                  if (res.code === 200) {
                    this.visible = false
                    that.spinning = false
                    this.form.resetFields()
                    that.$message.info(res.msg)
                    that.$emit('finish')
                  }
                })
                .catch((err) => (that.spinning = false))
            }
          }
        })
      }
    },
    handleCancel() {
      this.remark = '' // 清空表
      this.visible = false
    },
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      productapproval(values)
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
.requiredMark::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
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
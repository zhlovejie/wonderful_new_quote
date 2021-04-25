<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 200px">名称</td>
            <td>
              <a-form-item>
                <a-input
                  placeholder="名称"
                  :allowClear="true"
                  v-decorator="[
                    `ruleName`,
                    {
                      initialValue: detail.ruleName,
                      rules: [{ required: true, message: '请输入名称' }],
                    },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>核算周期(月)</td>
            <td>
              <a-form-item>
                <a-select
                  mode="multiple"
                  v-decorator="[
                    `accountCycle`,
                    {
                      initialValue: detail.accountCycle,
                      rules: [{ required: true, message: '请选择类别' }],
                    },
                  ]"
                >
                  <a-select-option :value="1">1</a-select-option>
                  <a-select-option :value="2">2</a-select-option>
                  <a-select-option :value="3">3</a-select-option>
                  <a-select-option :value="4">4</a-select-option>
                  <a-select-option :value="5">5</a-select-option>
                  <a-select-option :value="6">6</a-select-option>
                  <a-select-option :value="7">7</a-select-option>
                  <a-select-option :value="8">8</a-select-option>
                  <a-select-option :value="9">9</a-select-option>
                  <a-select-option :value="10">10</a-select-option>
                  <a-select-option :value="11">11</a-select-option>
                  <a-select-option :value="12">12</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <a-form-item>
                <a-textarea
                  style="width: 100%"
                  placeholder="备注"
                  :rows="2"
                  v-decorator="[
                    'remarks',
                    { initialValue: detail.remarks, rules: [{ required: false, message: '请输入备注' }] },
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
import { annual_rulePageAddOrUpdate } from '@/api/salaryManagement'
import moment from 'moment'

export default {
  name: 'AddForm',
  components: {},
  data() {
    return {
      levelList: [],
      form: this.$form.createForm(this),
      visible: false,
      actionType: 'add',
      spinning: false,
      detail: {},
    }
  },
  computed: {
    modalTitle() {
      let m = { add: '新增', edit: '修改' }
      return `${m[this.actionType]}`
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
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
      if (that.isView || that.isApproval) {
        that.handleCancel()
        return
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          that.spinning = true
          values.accountCycle = values.accountCycle.toString()
          annual_rulePageAddOrUpdate(values)
            .then((res) => {
              that.spinning = false
              console.log(res)
              let { code, msg } = res
              if (+code === 500) {
                that.$message.error(msg)
                return
              }
              that.$message.info(res.msg)
              that.$emit('finish')
              that.handleCancel()
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record) {
      let that = this
      that.visible = true
      that.actionType = type
      that.detail = {}
      await that.form.resetFields()
      await that.init()
      if (type === 'add') return
      //填充数据
      record.accountCycle = record.accountCycle.split(',')
      that.detail = record || {}
    },
  },
}
</script>

<style scoped>
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
}

.add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
</style>
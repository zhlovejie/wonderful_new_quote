
<template>
  <a-modal
    :title="modalTitle"
    :width="550"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="车间名称" prop="departmentId">
          <a-select v-model="form.departmentId" placeholder="选择车间名称" :disabled="isDisabled">
            <a-select-option v-for="item in department" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="code" label="车间代码" prop="workshopNum">
          <a-input
            :disabled="isDisabled"
            placeholder="车间代码"
            v-model="form.workshopNum"
            @blur="
              () => {
                $refs.code.onFieldBlur()
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { gsaveOrUpdate } from '@/api/ProcessManagement'
import { getDevisionManagementList } from '@/api/systemSetting'

export default {
  name: 'product-process-management_workshop-management-addForm',
  components: {},
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      visible: false,
      department: [],
      actionType: 'view',
      spinning: false,
      detail: {},
      form: {},
      rules: {
        departmentId: [{ required: true, message: '请选择车间名称', trigger: 'change' }],
        workshopNum: [{ required: true, message: '请输入车间代码', trigger: 'blur' }],
      },
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
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    footer() {
      let that = this
      const h = that.$createElement
      let btn = []
      if (that.isView) {
        return null
      } else if (that.isAdd || that.isEdit) {
        btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
        btn.push(
          h(
            'a-button',
            {
              key: 'submit',
              on: { click: () => that.handleOk() },
              props: { type: 'primary', loading: that.spinning },
            },
            '提交'
          )
        )
      } else if (that.isApproval) {
        btn.push(
          h(
            'a-button',
            { key: 'no-pass', on: { click: that.noPassAction }, props: { loading: that.spinning } },
            '不通过'
          )
        )
        btn.push(
          h(
            'a-button',
            { key: 'pass', on: { click: that.passAction }, props: { type: 'primary', loading: that.spinning } },
            '通过'
          )
        )
      }
      return btn
    },
  },
  methods: {
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let react = that.department.find((item) => item.id === that.form.departmentId)
          let values = {
            departmentName: react.departmentName,
            departmentId: that.form.departmentId,
            workshopNum: that.form.workshopNum,
          }
          if (that.isEdit) {
            values.id = that.form.id
          }
          gsaveOrUpdate(values)
            .then((res) => {
              that.spinning = false
              that.$refs.ruleForm.resetFields()
              that.$emit('finish')
              that.visible = false
              that.$message.info(res.msg)
            })
            .catch((err) => (that.spinning = false))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      this.form = {}
      let that = this
      that.visible = true
      that.actionType = type
      that.leaveTime = ''
      that.detail = {}
      getDevisionManagementList({ parentId: 4, current: 1, size: 200 })
        .then((res) => {
          that.department = res.data.records
        })
        .catch((error) => {
          console.error(error)
        })
      if (!that.isAdd) {
        this.form = record
      }
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


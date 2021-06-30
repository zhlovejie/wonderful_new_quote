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
        <a-form-model-item label="车间名称" prop="workshopId">
          <a-select v-model="form.workshopId" placeholder="选择车间名称" :disabled="isDisabled">
            <a-select-option v-for="item in workshop" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="code" label="工序代码">
          <a-input disabled placeholder="系统自动生成" v-model="processCode" />
        </a-form-model-item>
        <a-form-model-item ref="k3Num" label="K3工序代码" prop="k3Num">
          <a-input
            :disabled="isDisabled"
            placeholder="K3工序代码"
            v-model="form.k3Num"
            @blur="
              () => {
                $refs.k3Num.onFieldBlur()
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="processName" label="工序名称" prop="processName">
          <a-input
            :disabled="isDisabled"
            placeholder="工序名称"
            v-model="form.processName"
            @blur="
              () => {
                $refs.processName.onFieldBlur()
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  pageDevelopmentCraftProcessSaveOrUpdate,
  listDevelopmentCraftWorkshopList,
  pageDevelopmentCraftProcessDetail,
} from '@/api/ProcessManagement'
import moment from 'moment'

export default {
  name: 'product-process-management_workshop-management-addForm',
  components: {},
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      visible: false,
      workshop: [],
      processCode: undefined,
      actionType: 'view',
      spinning: false,
      detail: {},
      form: {
        workshopId: undefined,
        k3Num: undefined,
        processName: undefined,
      },
      rules: {
        workshopId: [{ required: true, message: '请选择车间名称', trigger: 'change' }],
        k3Num: [{ required: false, message: '请输入K3工序代码', trigger: 'blur' }],
        processName: [{ required: true, message: '请输入工序名称', trigger: 'blur' }],
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
      }
      return btn
    },
  },
  methods: {
    moment,
    async handleOk() {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let react = that.workshop.find((item) => item.id === that.form.workshopId)
          let values = {
            workshopNum: react.departmentName,
            workshopId: that.form.workshopId,
            k3Num: that.form.k3Num,
            processName: that.form.processName,
          }
          if (that.isEdit) {
            values.id = that.form.id
          }
          that.spinning = true
          pageDevelopmentCraftProcessSaveOrUpdate(values)
            .then((res) => {
              that.spinning = false
              that.$refs.ruleForm.resetFields() // 清空表
              that.visible = false
              that.$message.info(res.msg)
              that.$emit('finish')
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    async query(type, record = {}) {
      let that = this
      that.visible = true
      that.actionType = type
      that.leaveTime = ''
      that.detail = {}
      listDevelopmentCraftWorkshopList().then((res) => {
        that.workshop = res.data
      })
      if (!that.isAdd) {
        await pageDevelopmentCraftProcessDetail({ id: record.id }).then((res) => {
          that.form = res.data
          that.processCode = res.data.processNum
        })
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

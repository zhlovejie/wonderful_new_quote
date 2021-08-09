<template>
  <a-modal
    :title="modalTitle"
    :width="650"
    :visible="visible"
    :destroyOnClose="true"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        class="ask-price-form-wrapper"
      >
        <a-card :bordered="cardBordered">

          <a-form-model-item label="预计到货日期" prop="deliveryDate">
            <a-date-picker
              style="width:160px !important;"
              v-model="form.deliveryDate"
              format="YYYY-MM-DD"
              placeholder="需求日期"
            />
          </a-form-model-item>

          <a-form-model-item
              label="最新报价"
              prop="newPrice"
            >
              <a-input-number
                placeholder="最新报价"
                v-model="form.newPrice"
                style="width:100%;"
                :min="0"
                :step="1"
                :precision="2"
                :formatter="value => `${value}元`"
                :parser="value => value.replace('元', '')"
              />
            </a-form-model-item>

            <a-form-model-item
              label="最新采购单价"
              prop="lastPrice"
            >
              <a-input-number
                placeholder="最新采购单价"
                v-model="form.lastPrice"
                style="width:100%;"
                :min="0"
                :step="1"
                :precision="2"
                :formatter="value => `${value}元`"
                :parser="value => value.replace('元', '')"
              />
            </a-form-model-item>




            <a-form-model-item
              label="采购总金额"
              prop="amount"
            >
              <a-input-number
                placeholder="采购总金额"
                v-model="form.amount"
                style="width:100%;"
                :min="0"
                :step="1"
                :precision="2"
                :formatter="value => `${value}元`"
                :parser="value => value.replace('元', '')"
              />
            </a-form-model-item>
        </a-card>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { orderAdd, quotationDetail, quotationDetailForUpdate } from '@/api/procurementModuleManagement'
export default {
  data() {
    return {
      type: 'add',
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      form: {

      },
      rules: {

      },
      cardBordered: true,
      visible: false,
      spinning: false,
      record: {},
      detail: {},
      detailUpdate: {}
    }
  },
  computed: {
    modalTitle() {
      const type = this.type
      const t = type === 'add' ? '新增' : type === 'edit' ? '修改' : type === 'view' ? '查看' : '审批'
      return `${t}下单采购`
    },
    isAdd() {
      return this.type === 'add'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    },
    isApproval() {
      return this.type === 'approval'
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
    footer() {
      const that = this
      const h = that.$createElement
      const btn = []
      btn.push(h('a-button', { key: 'cancel', on: { click: that.handleCancel } }, '取消'))
      btn.push(
        h(
          'a-button',
          {
            key: 'submit',
            on: { click: () => that.handleSubmit() },
            props: { type: 'primary', loading: that.spinning }
          },
          '提交'
        )
      )
      return btn
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.type = type
      that.record = { ...record }
      that.visible = true
      that.form = {
        ...that.form,
        requestId: that.record.id,
        materialId: that.record.materialId,
        materialName: that.record.materialName,
        materialModelType: that.record.materialModelType
      }

        const [d1, d2] = Promise.all([
          quotationDetail({ id: that.record.id })
            .then(res => res.data)
            .catch(err => {
              that.$message.error(err)
              return null
            }),
          quotationDetailForUpdate({ id: that.record.id })
            .then(res => res.data)
            .catch(err => {
              that.$message.error(err)
              return null
            })
        ])
        // if (d1 === null || d2 === null) {
        //   return
        // }
        that.detail = d1
        that.detailUpdate = d2

    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.spinning = true
          const { modelName, modelType } = that.form

          let params = {
            materialId,//物料id
            packMethod,//包装方式(冗余字段)
            pageNum,//包内数量(冗余字段)
            requestId,//需求单id
            supplierId,//供应商id(冗余字段)
            supplierName,//供应商名称(冗余字段)
            quotationId,//报价单id
            fileUrl//合同url
          }

          orderAdd({ ...that.form, model: `${modelName}-${modelType}` })
            .then(res => {
              that.spinning = false
              that.$message.info(res.msg)
              if (res.code === 200) {
                that.$emit('finished')
                that.handleCancel()
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.info(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleCancel() {
      this.resetForm()
      this.visible = false
    }
  }
}
</script>

<style scoped>
.ask-price-form-wrapper >>> .ant-card {
  margin-bottom: 20px;
}
.ask-price-form-wrapper >>> .ant-card:last-child {
  margin-bottom: 0;
}
.ask-price-form-wrapper >>> .ant-card .ant-card-body {
  padding: 10px 0;
}
.ask-price-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}
</style>

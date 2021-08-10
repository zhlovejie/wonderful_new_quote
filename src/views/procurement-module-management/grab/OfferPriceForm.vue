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
          <template v-if="isDisabled">
            <a-form-model-item label="供应商">
              <span>{{form.supplierName}}</span>
            </a-form-model-item>
          </template>
          <a-form-model-item
            label="有无供应商"
            prop="hasSupplier"
          >
            <a-radio-group
              name="hasSupplier"
              v-model="form.hasSupplier"
            >
              <a-radio :value="1">有</a-radio>
              <a-radio :value="2">无</a-radio>
            </a-radio-group>
          </a-form-model-item>

          <template v-if="form.hasSupplier === 1">
            <a-form-model-item
              label="供应商"
              prop="supplierId"
            >
              <a-select
                v-model="form.supplierId"
                placeholder="选择供应商"
              >
                <a-select-option :value="1">
                  测试供应商1
                </a-select-option>
                <a-select-option :value="2">
                  测试供应商1
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </template>

          <template v-if="form.hasSupplier === 2">
            <a-form-model-item
              label="供应商"
              prop="supplierName"
            >
              <a-input
                v-model="form.supplierName"
                placeholder="请输入供应商名称，输入后不可更改"
              />
            </a-form-model-item>
          </template>
        </a-card>

        <a-card :bordered="cardBordered">
          <a-form-model-item label="物料名称">
            <span>{{record.materialName}}</span>
          </a-form-model-item>
          <a-form-model-item label="规格型号">
            <span>{{record.materialModelType}}</span>
          </a-form-model-item>

          <a-form-model-item
            label="包装方式"
            prop="packageType"
          >
            <a-row>
              <a-col :span="11">
                <a-input
                  v-model="form.packageType"
                  placeholder="包装类型"
                />
              </a-col>
              <a-col
                :span="11"
                :offset="2"
              >
                <a-input-number
                  v-model="form.packageCount"
                  placeholder="包装内数量"
                  style="width:100%;"
                  :min="0"
                  :step="1"
                  :precision="0"
                />
              </a-col>
            </a-row>
          </a-form-model-item>

          <a-form-model-item
            label="品牌/型号"
            prop="modelName"
          >
            <a-row>
              <a-col :span="11">
                <a-input
                  v-model="form.modelName"
                  placeholder="品牌"
                />
              </a-col>
              <a-col
                :span="11"
                :offset="2"
              >
                <a-input
                  v-model="form.modelType"
                  placeholder="型号"
                />
              </a-col>
            </a-row>

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
        </a-card>

        <a-card :bordered="cardBordered">
          <a-form-model-item
            label="结算方式"
            prop="settlementMode"
          >
            <a-select
              v-model="form.settlementMode"
              placeholder="结算方式"
            >
              <a-select-option :value="0">
                现款现货
              </a-select-option>
              <a-select-option :value="1">
                账期结算
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            label="发票类型"
            prop="invoiceType"
          >
            <a-select
              v-model="form.invoiceType"
              placeholder="发票类型"
            >
              <a-select-option :value="1">
                不限
              </a-select-option>
              <a-select-option :value="2">
                增值税专用发票
              </a-select-option>
              <a-select-option :value="3">
                普通发票
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            label="裸价标准"
            prop="nakedPrice"
          >
            <a-select
              v-model="form.nakedPrice"
              placeholder="裸价标准"
            >
              <a-select-option :value="1">
                含税运
              </a-select-option>
              <a-select-option :value="2">
                含税不含运
              </a-select-option>
            </a-select>
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
            label="物料税率"
            prop="materialRate"
          >
            <a-input-number
              placeholder="物料税率"
              v-model="form.materialRate"
              style="width:100%;"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
            />
          </a-form-model-item>
          <a-form-model-item
            label="运费税率"
            prop="freightRate"
          >
            <a-input-number
              placeholder="运费税率"
              v-model="form.freightRate"
              style="width:100%;"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
            />
          </a-form-model-item>
          <a-form-model-item
            label="最低采购数量"
            prop="lowestNum"
          >
            <a-input-number
              placeholder="最低采购数量"
              v-model="form.lowestNum"
              style="width:100%;"
              :min="0"
              :step="1"
              :precision="0"
            />
          </a-form-model-item>
          <a-form-model-item
            label="交货周期"
            prop="deliveryCycle"
          >
            <a-input-number
              placeholder="交货周期"
              v-model="form.deliveryCycle"
              style="width:100%;"
              :min="0"
              :max="30"
              :step="1"
              :precision="0"
              :formatter="value => `${value}天`"
              :parser="value => value.replace('天', '')"
            />
          </a-form-model-item>
          <a-form-model-item
            label="保质期"
            prop="shelfLife"
          >
            <a-input-number
              placeholder="保质期"
              v-model="form.shelfLife"
              style="width:100%;"
              :min="180"
              :step="1"
              :precision="0"
              :formatter="value => `${value}天`"
              :parser="value => value.replace('天', '')"
            />
          </a-form-model-item>
        </a-card>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { quotationAdd, quotationDetail, quotationDetailForUpdate } from '@/api/procurementModuleManagement'
export default {
  data() {
    return {
      type: 'add',
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      form: {
        hasSupplier: 1,
        packageCount: undefined,
        model: '',
        invoiceType: 1,
        nakedPrice: 1,
        newPrice: 0,
        materialRate: 0,
        freightRate: 0,
        lowestNum: 1,
        deliveryCycle: 30,
        shelfLife: 180,
        supplierId: undefined,
        email: undefined,
        supplierName: undefined,
        source: 1
      },
      rules: {
        lastPrice:[{ required: true, message: '请输入最新采购单价' }],
        settlementMode:[{ required: true, message: '请选择结算方式' }],
        packageType: [{ required: true, message: '请输入包装类型' }],
        packageCount: [{ required: true, message: '请输入包装内数量' }],
        modelName: [{ required: true, message: '请输入品牌' }],
        modelType: [{ required: true, message: '请输入品牌型号' }],
        invoiceType: [{ required: true, message: '请选择发票类型' }],
        nakedPrice: [{ required: true, message: '请输入裸价标准' }],
        newPrice: [{ required: true, message: '请输入最新报价' }],
        materialRate: [{ required: true, message: '请输入物料税率' }],
        freightRate: [{ required: true, message: '请输入运费税率' }],
        lowestNum: [{ required: true, message: '请输入最低采购数量' }],
        deliveryCycle: [{ required: true, message: '请输入交货周期' }],
        shelfLife: [{ required: true, message: '请输入保质期' }],
        supplierId: [{ required: true, message: '请选择供应商' }],
        supplierName: [{ required: true, message: '请输入供应商名称' }],
        email: [{ required: true, message: '请输入邮箱信息' }]
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
      return `${t}物料报价单`
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
        materialModelType: that.record.materialModelType,
        source:record.source
      }
      if (!that.isAdd) {
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
        if (d1 === null || d2 === null) {
          return
        }
        that.detail = d1
        that.detailUpdate = d2
      }
    },
    handleSubmit() {
      const that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          that.spinning = true
          const { modelName, modelType } = that.form

          quotationAdd({ ...that.form, model: `${modelName}-${modelType}` })
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

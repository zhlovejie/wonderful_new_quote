<template>
  <a-modal
    title="设置采购要求"
    :width="1000"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 155px">指定供应商</td>
            <td>
              <a-form-item style="width: 40%; float: left">
                <a-select
                  v-decorator="['supplierId']"
                  mode="multiple"
                  placeholder="请选择供应"
                  @change="depChangeHandler"
                  allowClear
                  :disabled="isDisabled"
                >
                  <a-select-option :value="0">不限供应商</a-select-option>
                  <a-select-option v-for="item in supplierList" :key="item.id" :value="item.id">{{
                    item.scompanyName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item style="width: 20%; float: right">
                <!-- <a-button type="primary" @click="Procurement('supplier')">变更指定工供应商 </a-button> -->
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>指定品牌及型号</td>
            <td>
              <a-form-item style="width: 25%; float: left">
                <a-select
                  v-model="brand"
                  @change="depChange"
                  allowClear
                  placeholder="请选择品牌"
                  :disabled="isDisabled"
                >
                  <a-select-option :value="0">不限品牌</a-select-option>
                  <a-select-option v-for="item in brandList" :key="item.brandId" :value="item.brandId">{{
                    item.brandName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item v-if="brand !== 0 && brand !== undefined && brand !== ''" style="width: 25%; float: left">
                <a-select placeholder="请选择型号" allowClear v-model="modList" :disabled="isDisabled" mode="multiple">
                  <a-select-option :value="0">不限型号</a-select-option>
                  <a-select-option v-for="item in modelList" :key="item.id" :value="item.id">{{
                    item.modelName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item style="width: 10%; float: left" v-if="brand !== 0 && brand !== undefined && brand !== ''">
                <a-button type="primary" @click="Procureadd()">新增</a-button>
              </a-form-item>

              <a-form-item style="width: 18%; float: right">
                <!-- <a-button type="primary" @click="Procurement('brand')">变更指定品牌 </a-button> -->
              </a-form-item>
            </td>
          </tr>
          <tr v-for="(item, index) in buyRequirementBrands" :key="index">
            <td colspan="2">
              {{ item.brandName + '/' + item.buyRequirementBrandModels.map((i) => i.modelName).join(',') }}
              <span style="float: right"> <a-button @click="procuerDelete(item.brandId)">删除</a-button> </span>
            </td>
          </tr>
          <tr>
            <td>是否固定包装</td>
            <td>
              <a-form-item style="width: 60%; float: left">
                <a-radio-group v-decorator="['packType', { initialValue: 1 }]" @change="packTypeChange">
                  <a-radio :value="1"> 固定包装方式 </a-radio>
                  <a-radio :value="2"> 不固定包装方式 </a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="packShow">
            <td>包装方式</td>
            <td>
              <a-form-item style="width: 40%; float: left">
                <a-select
                  v-decorator="['packMethodId', { rules: [{ required: true, message: '请选择包装方式' }] }]"
                  allowClear
                  :disabled="isDisabled"
                >
                  <a-select-option v-for="item in Warehouse" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item style="width: 13%; float: right">
                <!-- <a-button type="primary" @click="Procurement('packing')">变更包装 </a-button> -->
              </a-form-item>
            </td>
          </tr>
          <tr v-if="packShow">
            <td>包内数量</td>
            <td>
              <a-form-item style="width: 40%; float: left">
                <a-input-number
                  placeholder="输入每组包装内物料数量"
                  :disabled="isDisabled"
                  :min="0"
                  step="1"
                  style="width: 100%"
                  v-decorator="['pageNum', { rules: [{ required: true, message: '请输入每组包装内物料数量' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>物料价格模式</td>
            <td>
              <a-form-item style="width: 40%; float: left">
                <a-select v-decorator="['priceModel', { initialValue: 1 }]" allowClear :disabled="isDisabled">
                  <a-select-option :value="1">固定价格模式</a-select-option>
                  <a-select-option :value="2">实时价格模式</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>裸价的标准</td>
            <td>
              <a-form-item style="width: 40%; float: left">
                <a-radio-group
                  v-decorator="[
                    'nakedPrice',
                    { initialValue: 1, rules: [{ required: true, message: '请选择裸价的标准' }] },
                  ]"
                >
                  <a-radio :value="1"> 含税运 </a-radio>
                  <a-radio :value="2"> 含税不含运</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item style="width: 18%; float: right">
                <!-- <a-button type="primary" @click="Procurement('standard')">变更裸价的标准 </a-button> -->
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>物料发票类型</td>
            <td>
              <a-form-item style="width: 40%; float: left">
                <a-select
                  v-decorator="[
                    'invoiceType',
                    { initialValue: 0, rules: [{ required: true, message: '请选择物料发票类型' }] },
                  ]"
                  allowClear
                  :disabled="isDisabled"
                >
                  <a-select-option :value="0">不限</a-select-option>
                  <a-select-option :value="1">增值税专用发票</a-select-option>
                  <a-select-option :value="2">普通发票</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item style="width: 17%; float: right">
                <!-- <a-button type="primary" @click="Procurement('invoice')">变更发票类型 </a-button> -->
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>物料税率(%)</td>
            <td>
              <a-form-item style="width: 40%; float: left">
                <a-select
                  v-decorator="['taxRate', { initialValue: 3, rules: [{ required: true, message: '请选择物料税率' }] }]"
                  allowClear
                  :disabled="isDisabled"
                >
                  <a-select-option :value="0">0%</a-select-option>
                  <a-select-option :value="1">1%</a-select-option>
                  <a-select-option :value="3">3%</a-select-option>
                  <a-select-option :value="6">6%</a-select-option>
                  <a-select-option :value="9">9%</a-select-option>
                  <a-select-option :value="11">11%</a-select-option>
                  <a-select-option :value="13">13%</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item style="width: 17%; float: right">
                <!-- <a-button type="primary" @click="Procurement('taxRate')">变更物料税率</a-button> -->
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>安全库存</td>
            <td>
              <a-form-item style="width: 40%; float: left">
                <a-input-number
                  :disabled="isDisabled"
                  :min="0"
                  step="1"
                  style="width: 100%"
                  v-decorator="['maxPurchase', { rules: [{ required: true, message: '请输入安全库存' }] }]"
                />
              </a-form-item>
              <a-form-item style="width: 17%; float: right">
                <!-- <a-button type="primary" @click="Procurement('stock')">变更安全库存</a-button> -->
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>最短质保期(天)</td>
            <td>
              <a-form-item style="width: 40%; float: left">
                <a-input-number
                  :disabled="isDisabled"
                  :min="0"
                  step="1"
                  style="width: 100%"
                  v-decorator="['minWarranty', { rules: [{ required: true, message: '请输入最短质保期' }] }]"
                />
              </a-form-item>
              <a-form-item style="width: 16%; float: right">
                <!-- <a-button type="primary" @click="Procurement('Warranty')">变更质保期</a-button> -->
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>最长交货期(天)</td>
            <td>
              <a-form-item style="width: 40%; float: left">
                <a-input-number
                  :disabled="isDisabled"
                  :min="0"
                  step="1"
                  style="width: 100%"
                  v-decorator="['maxDelivery', { rules: [{ required: true, message: '请输入最长交货期' }] }]"
                />
              </a-form-item>
              <a-form-item style="width: 16%; float: right">
                <!-- <a-button type="primary" @click="Procurement('delivery')">变更交货期</a-button> -->
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <Modal ref="modal" @filts="handleCancel"></Modal>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  listManageSupplier,
  listManageBrand,
  listManageBrandModel,
  listManageSaveAndUpdate,
} from '@/api/routineMaterial'
import { queryCode } from '@/api/workBox'
import moment from 'moment'
import Modal from './modal'
export default {
  name: 'product-process-management_mould-management-addForm',
  components: {
    Modal,
  },
  data() {
    return {
      visible: false,
      packShow: true,
      actionType: 'view',
      spinning: false,
      depidType: '',
      brand: '', //选择品牌
      supplierList: [],
      brandList: [], //品牌
      modelList: [], //型号
      modList: [], //选择型号
      buyRequirementBrands: [],
      Warehouse: [],
      detail: {},
      record: {},
      form: this.$form.createForm(this, { name: 'mould-management-addForm' }),
    }
  },
  computed: {
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
              on: { click: () => that.handleOk(1) },
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
    packTypeChange(e) {
      let react = e.target.value
      this.packShow = react === 2 ? false : true
    },
    procuerDelete(index) {
      this.buyRequirementBrands = this.buyRequirementBrands.filter((i) => i.brandId !== index)
    },
    Procureadd() {
      let arrs = []
      let ret = this.modList.toString()
      if (ret === '0' || this.modList.length === 0) {
        arrs = [...this.modelList]
      } else {
        let as = this.modelList.filter((i) => this.modList.includes(i.id))
        arrs = [...as]
      }
      let arr = this.brandList.find((u) => u.brandId === this.brand)
      let reacts = this.buyRequirementBrands.every((u) => u.brandName !== arr.brandName)
      if (reacts) {
        this.buyRequirementBrands.push({
          brandName: arr.brandName,
          brandId: arr.brandId,
          supplierId: arr.supplierId,
          buyRequirementBrandModels: arrs,
        })
      } else {
        this.$message.error('此品牌已添加')
      }

      this.modList = []
    },
    Procurement(type) {
      this.handleOk(2)
      this.$refs.modal.query(type, this.record, null)
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    async handleOk(type) {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      that.form.validateFields((err, values) => {
        if (!err) {
          // console.log(values)
          if (values.supplierId && values.supplierId.length > 0) {
            values.supplierId = values.supplierId.filter((i) => i !== 0)
          }
          if (values.supplierId && values.supplierId.length > 0) {
            let reat = this.supplierList.filter((i) => values.supplierId.includes(i.id))
            values.supplierName = reat.map((i) => i.scompanyName).join(',')
          }
          if (values.packMethodId) {
            let arr = this.Warehouse.find((u) => u.id === values.packMethodId)
            values.packMethod = arr.text
          }

          values.supplierId = (values.supplierId && values.supplierId.toString()) || '0'
          values.buyRequirementBrands = that.buyRequirementBrands || []
          values.materialId = that.record.id
          that.spinning = true
          listManageSaveAndUpdate(values)
            .then((res) => {
              that.spinning = false
              if (type === 1) {
                this.visible = false
                that.$emit('finish')
              }
              that.$message.info(res.msg)
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.fileList = []
      this.qrcodeUrl = ''
      this.$emit('finish')
      this.form.resetFields() // 清空表
      this.$nextTick(() => (this.visible = false))
    },
    handleCancel1() {
      this.previewVisible = false
    },
    depChangeHandler(depId) {
      console.log(depId)
      this.brand = undefined
      this.brandList = []
      this.modelList = []
      let reat = depId.filter((i) => i !== 0)
      this.buyRequirementBrands = this.buyRequirementBrands.filter((i) => depId.includes(i.supplierId))
      this.depidType = reat.toString() || undefined
      //品牌
      if (depId.length > 0) {
        listManageBrand({ materialId: this.record.id, supplierId: this.depidType || 0 }).then(
          (res) => (this.brandList = res.data)
        )
      }
    },
    depChange(depId) {
      this.userList = []
      this.modList = []
      //型号
      listManageBrandModel({ materialId: this.record.id, brandId: depId, supplierId: this.depidType || 0 }).then(
        (res) => (this.modelList = res.data)
      )
    },
    async query(type, record = {}) {
      let that = this
      that.brand = undefined
      that.actionType = type
      that.visible = true
      that.record = record
      console.log(record)
      await queryCode({ code: 'Packing_01' })
        .then((res) => {
          that.Warehouse = res.data
        })
        .catch((err) => (that.loading = false))
      listManageSupplier({ materialId: record.id }).then((res) => (this.supplierList = res.data))
      if (!that.isAdd) {
      }
    },
  },
}
</script>

<style scoped>
.requiredMark::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.product-process-management_mould-management-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.product-process-management_mould-management-wrapper >>> .custom-table {
  margin-bottom: 0;
}
.custom-table >>> .custom-table {
  margin: -1px;
  width: calc(100% + 2px);
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

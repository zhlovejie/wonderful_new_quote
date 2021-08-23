<template>
  <a-modal :title="modalTitle" :width="800" :visible="visible" @cancel="handleCancel" :maskClosable="false">
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" :loading="spinning" @click="noPassAction">不通过</a-button>
        <a-button key="submit" type="primary" icon="check" :loading="spinning" @click="passAction">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <!-- 供应商 -->
          <tr v-if="isSupplier">
            <td>当前供应商</td>
            <td>{{ Details.supplierId === '0' ? '不限供应商' : Details.supplierName }}</td>
          </tr>
          <tr v-if="isSupplier">
            <td>申请变更为</td>
            <td>
              <a-form-item>
                <a-select
                  v-if="!isDisabled"
                  v-decorator="['csupplierId', { initialValue: 0 }]"
                  mode="multiple"
                  allowClear
                >
                  <a-select-option :value="0">不限供应商</a-select-option>
                  <a-select-option v-for="item in supplierList" :key="item.id" :value="item.id">{{
                    item.scompanyName
                  }}</a-select-option>
                </a-select>
                <span v-else>{{ Details.csupplierName === '' ? '不限' : Details.csupplierName }}</span>
              </a-form-item>
            </td>
          </tr>
          <!-- 品牌型号 -->
          <tr v-if="isbrand">
            <td>当前品牌</td>
            <td v-if="!isDisabled">
              {{
                Details.buyRequirementBrands && Details.buyRequirementBrands.length == 0
                  ? '品牌型号不限'
                  : Details.buyRequirementBrands &&
                    Details.buyRequirementBrands
                      .map((u) => u.brandName + '/' + u.buyRequirementBrandModels.map((i) => i.modelName))
                      .join(',')
              }}
            </td>
            <td v-else>
              {{ Details.bmName }}
            </td>
          </tr>
          <tr v-if="isbrand">
            <td>申请变更为</td>
            <td v-if="!isDisabled">
              <a-form-item style="width: 40%; float: left">
                <a-select v-model="brand" placeholder="请选择品牌" @change="depChange" allowClear>
                  <a-select-option :value="0">不限品牌</a-select-option>
                  <a-select-option v-for="item in brandList" :key="item.id" :value="item.id">{{
                    item.brandName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item v-if="brand !== 0 && brand !== undefined && brand !== ''" style="width: 40%; float: left">
                <a-select allowClear placeholder="请选择型号" v-model="modList" mode="multiple">
                  <a-select-option :value="0">不限型号</a-select-option>
                  <a-select-option v-for="item in modelList" :key="item.id" :value="item.id">{{
                    item.modelName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item style="width: 10%; float: left" v-if="brand !== 0 && brand !== undefined && brand !== ''">
                <a-button type="primary" @click="Procureadd()">新增</a-button>
              </a-form-item>
            </td>
            <td v-else>
              {{ Details.cbmName }}
            </td>
          </tr>
          <tr v-for="(item, index) in buyRequirementBrands" :key="index">
            <td colspan="2" v-if="isbrand && !isDisabled">
              {{ item.brandName + '/' + item.changeBrandModelInfos.map((i) => i.modelName).join(',') }}
              <span style="float: right">
                <a-button @click="procuerDelete(item.brandId)">删除</a-button>
              </span>
            </td>
          </tr>
          <!-- 包装方式 -->
          <tr v-if="isPacking">
            <td>当前包装方式</td>
            <td v-if="!isDisabled">{{ Details.packMethod }}</td>
            <td v-else>{{ Details.packName }}</td>
          </tr>
          <tr v-if="isPacking">
            <td>当前数量</td>
            <td v-if="!isDisabled">
              {{ Details.pageNum }}
            </td>
            <td v-else>{{ Details.packNum }}</td>
          </tr>
          <tr v-if="isPacking">
            <td>当前是否固定包装</td>
            <td v-if="!isDisabled">
              {{ Details.packType === 1 ? '固定包装方式' : '不固定包装方式' }}
            </td>
            <td v-else>{{ Details.packType === 1 ? '固定包装方式' : '不固定包装方式' }}</td>
          </tr>
          <tr v-if="isPacking">
            <td>变更固定模式</td>
            <td>
              <a-form-item style="width: 100%; float: left">
                <a-radio-group
                  v-if="!isDisabled"
                  v-decorator="[
                    'cpackType',
                    { initialValue: 1, rules: [{ required: true, message: '请输入变更固定模式' }] },
                  ]"
                  @change="packTypeChange"
                >
                  <a-radio :value="1"> 固定包装方式 </a-radio>
                  <a-radio :value="2"> 不固定包装方式 </a-radio>
                </a-radio-group>
                <span v-else>{{ Details.cpackType === 1 ? '固定包装方式' : '不固定包装方式' }} </span>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="isPacking && packShow">
            <td>变更包装方式</td>
            <td>
              <a-form-item style="width: 100%; float: left">
                <a-select
                  v-if="!isDisabled"
                  v-decorator="['cpackId', { rules: [{ required: true, message: '请输入变更包装方式' }] }]"
                  allowClear
                >
                  <a-select-option v-for="item in Warehouse" :key="item.id" :value="item.id">{{
                    item.text
                  }}</a-select-option>
                </a-select>
                <span v-else>{{ Details.cpackName }} </span>
              </a-form-item>
            </td>
          </tr>
          <tr v-if="isPacking && packShow">
            <td>变更包内变更数量</td>
            <td>
              <a-form-item style="width: 100%; float: left">
                <a-input-number
                  v-if="!isDisabled"
                  placeholder="输入每组包装内物料数量"
                  :min="0"
                  step="1"
                  style="width: 100%"
                  v-decorator="['cpackNum', { rules: [{ required: true, message: '请输入变更数量' }] }]"
                />
                <span v-else>
                  {{ Details.cpackNum }}
                </span>
              </a-form-item>
            </td>
          </tr>
          <!-- 裸价标准 -->
          <tr v-if="isStandard">
            <td>当前类型</td>
            <td v-if="!isDisabled">{{ Details.nakedPrice === 1 ? '含税运' : '不含税运' }}</td>
            <td v-else>
              {{ Details.type === 1 ? '含税运' : '不含税运' }}
            </td>
          </tr>
          <tr v-if="isStandard">
            <td>申请变更为</td>
            <td v-if="!isDisabled">{{ Details.nakedPrice === 1 ? '不含税运' : '含税运' }}</td>
            <td v-else>
              {{ Details.type === 1 ? '不含税运' : '含税运' }}
            </td>
          </tr>
          <!-- 发票类型 -->
          <tr v-if="isInvoice">
            <td>当前类型</td>
            <td v-if="!isDisabled">
              {{ Details.invoiceType === 0 ? '不限' : Details.invoiceType === 1 ? '增值税专用发票' : '普通发票' }}
            </td>
            <td v-else>{{ Details.type === 0 ? '不限' : Details.type === 1 ? '增值税专用发票' : '普通发票' }}</td>
          </tr>
          <tr v-if="isInvoice">
            <td>申请变更为</td>
            <td>
              <a-form-item style="width: 100%; float: left">
                <a-select
                  v-if="!isDisabled"
                  v-decorator="['ctype', { initialValue: 0, rules: [{ required: true, message: '请选择发票类型' }] }]"
                  allowClear
                >
                  <a-select-option :value="0">不限</a-select-option>
                  <a-select-option :value="1">增值税专用发票</a-select-option>
                  <a-select-option :value="2">普通发票</a-select-option>
                </a-select>
                <span v-else>{{
                  Details.ctype === 0 ? '不限' : Details.ctype === 1 ? '增值税专用发票' : '普通发票'
                }}</span>
              </a-form-item>
            </td>
          </tr>
          <!-- 税率 -->
          <tr v-if="isTaxRate">
            <td>当前税率</td>
            <td v-if="!isDisabled">{{ Details.taxRate }}%</td>
            <td v-else>{{ Details.taxRate }}%</td>
          </tr>
          <tr v-if="isTaxRate">
            <td>申请变更为</td>
            <td>
              <a-form-item style="width: 100%; float: left">
                <a-select
                  v-if="!isDisabled"
                  v-decorator="[
                    'ctaxRate',
                    { initialValue: 3, rules: [{ required: true, message: '请选择变更税率' }] },
                  ]"
                  allowClear
                >
                  <a-select-option :value="0">0%</a-select-option>
                  <a-select-option :value="1">1%</a-select-option>
                  <a-select-option :value="3">3%</a-select-option>
                  <a-select-option :value="6">6%</a-select-option>
                  <a-select-option :value="9">9%</a-select-option>
                  <a-select-option :value="11">11%</a-select-option>
                  <a-select-option :value="13">13%</a-select-option>
                </a-select>
                <span v-else>{{ Details.ctaxRate }}%</span>
              </a-form-item>
            </td>
          </tr>
          <!-- 安全库存 -->
          <tr v-if="isStock">
            <td>当前数量</td>
            <td v-if="!isDisabled">{{ Details.maxPurchase }}</td>
            <td v-else>{{ Details.number }}</td>
          </tr>
          <tr v-if="isStock">
            <td>申请变更为</td>
            <td>
              <a-form-item style="width: 100%; float: left">
                <a-input-number
                  v-if="!isDisabled"
                  :min="0"
                  step="1"
                  style="width: 100%"
                  v-decorator="['cnumber', { rules: [{ required: true, message: '请输入变更数量' }] }]"
                />
                <span v-else>{{ Details.cnumber }}</span>
              </a-form-item>
            </td>
          </tr>
          <!-- 变更 质保期 交货期 -->
          <tr v-if="isWarranty || isDelivery">
            <td>当前期限</td>
            <td v-if="isWarranty && !isDisabled">质保期{{ Details.minWarranty }}天</td>
            <td v-else-if="isWarranty && Details.type === 1">质保期 {{ Details.number }}天</td>
            <td v-if="isDelivery && !isDisabled">交货期{{ Details.maxDelivery }}天</td>
            <td v-else-if="isDelivery && Details.type === 2">交货期 {{ Details.number }}天</td>
          </tr>
          <tr v-if="isWarranty || isDelivery">
            <td>申请变更(天)</td>
            <td>
              <a-form-item style="width: 100%; float: left">
                <a-input-number
                  v-if="!isDisabled"
                  :min="0"
                  step="1"
                  style="width: 100%"
                  v-decorator="['cnumber', { rules: [{ required: true, message: '请输入变更天数' }] }]"
                />

                <span v-else>{{ Details.cnumber }}天 </span>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>变更原因</td>
            <td>
              <a-form-item v-if="!isDisabled" style="width: 100%; float: left">
                <a-textarea step="1" style="width: 100%" v-decorator="['reason']" />
              </a-form-item>
              <span>{{ Details.reason }}</span>
            </td>
          </tr>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import {
  listManageSupplier,
  getBuyRequirement,
  listManageBrand,
  listManageBrandModel,
  SupplierUpdate,
  changePackUpdate,
  NakedUpdate,
  MaxPurchaseUpdate,
  InvoiceUpdate,
  TaxRateUpdate,
  DeliveryUpdate,
  BrandUpdate,
  getDetailSupplier,
  getDetailPack,
  getDetailBrand,
  getDetailInvoice,
  getDetailTaxRate,
  getDetailMaxPurchase,
  getDetailNakedPrice,
  getDetailDelivery,
  SupplierApproval,
  PackApproval,
  BrandApproval,
  InvoiceApproval,
  TaxRateApproval,
  MaxPurchaseApproval,
  NakedPriceApproval,
  DeliveryApproval,
} from '@/api/routineMaterial'
import { queryCode } from '@/api/workBox'
import Approval from './Approval'
export default {
  name: 'SelectProduct',
  components: { Approval },

  data() {
    return {
      packShow: true,
      loading: false,
      visible: false,
      spinning: false,
      Details: {},
      Warehouse: [],
      form: this.$form.createForm(this, { name: 'mould-management-addForm' }),
      type: '',
      brand: '',
      modList: [],
      brandList: [],
      modelList: [],
      buyRequirementBrands: [],
      supplierList: [],
      view: '',
    }
  },
  computed: {
    modalTitle() {
      if (this.isSupplier) {
        return ' 供应商变更申请 '
      }
      if (this.isbrand) {
        return '品牌型号变更申请'
      }
      if (this.isPacking) {
        return '包装方式变更申请'
      }
      if (this.isStandard) {
        return '变更裸价价格标准'
      }
      if (this.isInvoice) {
        return '变更发票类型'
      }
      if (this.isTaxRate) {
        return '变更税率'
      }
      if (this.isStock) {
        return '变更安全库存'
      }
      if (this.isWarranty || this.isDelivery) {
        return '变更质保期/交货期'
      }
    },

    isbrand() {
      return this.type === 'brand' // 变更供应商
    },
    isSupplier() {
      return this.type === 'supplier' // 变更品牌
    },
    isPacking() {
      return this.type === 'packing' //变更包装
    },
    isStandard() {
      return this.type === 'standard' //标准
    },
    isInvoice() {
      return this.type === 'invoice' //发票类型
    },
    isTaxRate() {
      return this.type === 'taxRate' //变更税率
    },
    isStock() {
      return this.type === 'stock' //安全库存
    },
    isWarranty() {
      return this.type === 'Warranty' //质保期
    },
    isDelivery() {
      return this.type === 'delivery' //交货期
    },
    isApproval() {
      return this.view === 'approval' //审批
    },
    isView() {
      return this.view === 'view' //查看
    },
    isDisabled() {
      return this.isView || this.isApproval
    },
  },
  methods: {
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
      if (ret === '0') {
        arrs = [...this.modelList]
      } else {
        let as = this.modelList.filter((i) => this.modList.includes(i.id))
        arrs = [...as]
      }
      let arr = this.brandList.find((u) => u.id === this.brand)
      let reacts = this.buyRequirementBrands.every((u) => u.brandName !== arr.brandName)
      if (reacts) {
        this.buyRequirementBrands.push({
          brandName: arr.brandName,
          brandId: arr.id,
          changeBrandModelInfos: arrs,
        })
      } else {
        this.$message.error('此品牌已添加')
      }
      this.modList = []
    },

    async query(type, record, view) {
      let that = this
      that.type = type
      this.form.resetFields() // 清空表
      this.view = view
      this.visible = true
      if (!this.isDisabled) {
        await listManageSupplier({ materialId: record.id }).then((res) => (that.supplierList = res.data))
        await queryCode({ code: 'Packing_01' })
          .then((res) => {
            that.Warehouse = res.data
          })
          .catch((err) => (that.loading = false))
        await getBuyRequirement({ materialId: record.id }).then((res) => (that.Details = res.data))
        //品牌
        if (that.isbrand) {
          await listManageBrand({ materialId: that.Details.materialId, supplierId: that.Details.supplierId }).then(
            (res) => (that.brandList = res.data)
          )
        }
      } else {
        let api = {
          supplier: getDetailSupplier,
          packing: getDetailPack,
          brand: getDetailBrand,
          invoice: getDetailInvoice,
          taxRate: getDetailTaxRate,
          stock: getDetailMaxPurchase,
          standard: getDetailNakedPrice,
          Warranty: getDetailDelivery,
          delivery: getDetailDelivery,
        }
        api[this.type]({ id: record.purchaseChangeId })
          .then((res) => {
            if (res.code === 200) {
              this.Details = res.data
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch((err) => (that.spinning = false))
      }
    },
    depChange(depId) {
      this.modelList = []
      this.modList = []
      //型号
      listManageBrandModel({
        materialId: this.Details.materialId,
        brandId: depId,
      }).then((res) => (this.modelList = res.data))
    },
    handleOk() {
      if (this.isView) {
        this.visible = false
        return
      }
      let that = this
      that.form.validateFields((err, values) => {
        if (!err) {
          values.requirementId = this.Details.id
          if (this.isSupplier) {
            // 供应商
            values.supplierId = this.Details.supplierId
            values.supplierName = this.Details.supplierName
            if (values.csupplierId && values.csupplierId.length > 0) {
              let reat = this.supplierList.filter((i) => values.csupplierId.includes(i.id))
              values.csupplierName = reat.map((i) => i.scompanyName).join(',')
            }
            // let reat = this.supplierList.filter((i) => values.csupplierId.includes(i.id))
            // values.csupplierName = reat.map((i) => i.scompanyName).join(',')
            values.csupplierId = (values.csupplierId && values.csupplierId.toString()) || '0'
          }
          //品牌型号
          if (this.isbrand) {
            values.bmNames = this.Details.buyRequirementBrands
            values.changeBrandInfos = this.buyRequirementBrands.map((i) => {
              return {
                brandId: i.brandId,
                brandName: i.brandName,
                changeBrandModelInfos: i.changeBrandModelInfos.map((u) => {
                  return {
                    modelId: u.id,
                    modelName: u.modelName,
                  }
                }),
              }
            })
          }
          //   包装方式
          if (this.isPacking) {
            values.packId = this.Details.packMethodId || undefined
            values.packName = this.Details.packMethod || undefined
            values.packNum = this.Details.pageNum || undefined
            values.packType = this.Details.packType || undefined
            if (values.cpackId !== 0 && values.cpackType === 1) {
              let arr = this.Warehouse.find((i) => i.id === values.cpackId)
              values.cpackName = arr.text
            }
          }
          //   裸价价格
          if (this.isStandard) {
            values.type = this.Details.nakedPrice
            values.ctype = this.Details.nakedPrice === 1 ? 2 : 1
          }
          //发票类型
          if (this.isInvoice) {
            values.type = this.Details.invoiceType
          }
          //税率
          if (this.isTaxRate) {
            values.taxRate = this.Details.taxRate
          }
          //最大采购量
          if (this.isStock) {
            values.number = this.Details.maxPurchase
          }
          //  质保期 / 交货期
          if (this.isWarranty || this.isDelivery) {
            values.type = this.isWarranty ? 1 : 2
            values.number = this.isWarranty ? this.Details.minWarranty : this.Details.maxDelivery
          }

          let api = {
            supplier: SupplierUpdate,
            packing: changePackUpdate,
            brand: BrandUpdate,
            invoice: InvoiceUpdate,
            taxRate: TaxRateUpdate,
            stock: MaxPurchaseUpdate,
            standard: NakedUpdate,
            Warranty: DeliveryUpdate,
            delivery: DeliveryUpdate,
          }
          api[this.type](values)
            .then((res) => {
              if (res.code === 200) {
                that.spinning = false
                this.visible = false
                that.$message.info(res.msg)
                this.$emit('filts')
                this.buyRequirementBrands = []
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.buyRequirementBrands = []
      this.$emit('filts')
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.Details.id })
      that.spinning = true
      let api = {
        supplier: SupplierApproval,
        packing: PackApproval,
        brand: BrandApproval,
        invoice: InvoiceApproval,
        taxRate: TaxRateApproval,
        stock: MaxPurchaseApproval,
        standard: NakedPriceApproval,
        Warranty: DeliveryApproval,
        delivery: DeliveryApproval,
      }
      api[this.type](values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('files')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
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
.customer-list-wrapper {
  background-color: #fff;
}
.customer-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 10px;
}
</style>

<template>
  <a-modal
    title="新增供应商供货信息"
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
            <td style="width: 155px">物料名称</td>
            <td>{{ recordType.materialName }}</td>
          </tr>
          <tr>
            <td style="width: 155px">规格型号</td>
            <td>{{ recordType.materialModelType }}</td>
          </tr>
          <tr>
            <td>包装方式</td>
            <td v-if="Details.buyRequirement && Details.buyRequirement.packMethod">
              {{ Details.buyRequirement.packMethod }} {{ Details.buyRequirement.pageNum }}
            </td>
            <td v-else>
              <a-form-item style="width: 50%; float: left">
                <a-select
                  v-decorator="['packageType', { rules: [{ required: true, message: '请输入包装方式!' }] }]"
                  allowClear
                  :disabled="isDisabled"
                >
                  <a-select-option :value="0">不限方式</a-select-option>
                  <a-select-option v-for="item in Warehouse" :key="item.id" :value="item.text">{{
                    item.text
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item style="width: 40%; float: left">
                <a-input-number
                  placeholder="输入每组包装内物料数量"
                  :disabled="isDisabled"
                  :min="0"
                  :precision="2"
                  step="1"
                  style="width: 100%"
                  v-decorator="['packageCount', { rules: [{ required: true, message: '请输入每组包装内物料数量!' }] }]"
              /></a-form-item>
            </td>
          </tr>
          <tr>
            <td>指定品牌及型号</td>
            <td v-if="Details.buyRequirement && Details.buyRequirement.buyRequirementBrands.length > 0">
              {{
                Details.buyRequirement.buyRequirementBrands
                  .map((u) => u.brandName + '/' + u.buyRequirementBrandModels.map((i) => i.modelName))
                  .join(',')
              }}
            </td>
            <td v-else>
              <a-form-item style="width: 80%; float: left">
                {{ manageBrands.map((u) => u.brandName + '/' + u.manageBrandModels.map((i) => i.modelName)).join(',') }}
              </a-form-item>
              <a-form-item style="width: 18%; float: right">
                <a-button type="primary" @click="Addmodel()">添加品牌 </a-button>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>最新采购单价</td>
            <td v-if="Details.buyRequirement && Details.buyRequirement.price">
              {{ Details.buyRequirement.price }}
            </td>
            <td v-else></td>
          </tr>
          <tr>
            <td>结算方式</td>
            <td>{{ recordType.settlementMode === 0 ? '现看现货' : '账期结算' }}</td>
          </tr>
          <tr>
            <td>发票类型</td>
            <td v-if="Details.buyRequirement && Details.buyRequirement.invoiceType">
              {{
                Details.buyRequirement.invoiceType === 0
                  ? '不限'
                  : Details.buyRequirement.invoiceType === 1
                  ? '增值税专用发票'
                  : Details.buyRequirement.invoiceType === 2
                  ? '普通发票'
                  : ''
              }}
            </td>
            <td v-else></td>
          </tr>
          <tr>
            <td>裸价的标准</td>
            <td v-if="Details.buyRequirement && Details.buyRequirement.nakedPrice !== null">
              {{
                Details.buyRequirement.nakedPrice === 0
                  ? '含运费'
                  : Details.buyRequirement.nakedPrice === 1
                  ? '不含运费'
                  : ''
              }}
            </td>
            <td v-else></td>
          </tr>

          <tr>
            <td>最新报价</td>
            <td>
              <a-form-item style="width: 50%; float: left">
                <a-input-number
                  :disabled="isDisabled"
                  :min="0"
                  placeholder="输入最新报价"
                  :precision="2"
                  step="1"
                  style="width: 80%"
                  v-decorator="['newPrice', { rules: [{ required: true, message: '请输入最新报价!' }] }]"
                />
                元
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>物料税率</td>
            <td v-if="Details.buyRequirement && Details.buyRequirement.taxRate">
              {{ Details.buyRequirement.taxRate }}%
            </td>
            <td v-else></td>
          </tr>
          <tr>
            <td>运费税率</td>
            <td>
              <a-form-item style="width: 49%; float: left">
                <a-input-number
                  :disabled="isDisabled"
                  :min="0"
                  placeholder="输入百分比"
                  step="1"
                  style="width: 80%"
                  v-decorator="['freightRate', { rules: [{ required: true, message: '请输入百分比!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>最低采购数量</td>
            <td>
              <a-form-item style="width: 49%; float: left">
                <a-input-number
                  :disabled="isDisabled"
                  :min="0"
                  placeholder="输入最低采购数量"
                  step="1"
                  style="width: 80%"
                  v-decorator="['lowestNum', { rules: [{ required: true, message: '请输入最低采购数量!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>交货周期</td>
            <td>
              <a-form-item style="width: 50%; float: left">
                <a-input-number
                  :disabled="isDisabled"
                  placeholder="输入交货周期"
                  :min="0"
                  :max="(Details.buyRequirement && Details.buyRequirement.maxDelivery) || 30"
                  step="1"
                  style="width: 80%"
                  v-decorator="['deliveryCycle', { rules: [{ required: true, message: '请输入交货周期!' }] }]"
                />
                天
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>质保期</td>
            <td>
              <a-form-item style="width: 50%; float: left">
                <a-input-number
                  :disabled="isDisabled"
                  placeholder="输入质保期"
                  :min="(Details.buyRequirement && Details.buyRequirement.minWarranty) || 180"
                  step="1"
                  style="width: 80%"
                  v-decorator="['shelfLife', { rules: [{ required: true, message: '请输入质保期!' }] }]"
                />
                天
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
      <BrandFrom ref="brandFrom" @brandChange="brandChange" />
    </a-spin>
  </a-modal>
</template>

<script>
import { getSupplierOffer, getSupplierOfferUpdate } from '@/api/routineMaterial'
import { queryCode } from '@/api/workBox'
import moment from 'moment'
import BrandFrom from './BrandFrom'
export default {
  name: 'product-process-management_mould-management-addForm',
  components: {
    BrandFrom,
  },
  data() {
    return {
      visible: false,
      manageBrands: [],
      actionType: 'view',
      spinning: false,
      brand: '', //选择品牌
      supplierList: [],
      brandList: [], //品牌
      modelList: [], //型号
      modList: [], //选择型号
      buyRequirementBrands: [],
      Warehouse: [],
      Details: {},
      recordType: {},
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

      return btn
    },
  },
  methods: {
    moment,
    brandChange(data) {
      console.log(data)
      this.manageBrands = [...data]
    },
    Addmodel() {
      //添加品牌型号
      let that = this
      that.$refs.brandFrom.query(this.manageBrands)
    },
    async handleOk(type) {
      let that = this
      if (that.isView) {
        that.handleCancel()
        return
      }
      that.form.validateFields((err, values) => {
        if (!err) {
          if (this.Details.buyRequirement.packMethod) {
            values.packageType = this.Details.buyRequirement.packMethod
            values.packageCount = this.Details.buyRequirement.pageNum
          }
          if (that.Details.buyRequirement.buyRequirementBrands.length > 0) {
            values.manageBrands = that.Details.buyRequirement.buyRequirementBrands
          } else {
            values.manageBrands =
              this.manageBrands.map((u) => {
                return {
                  brandName: u.brandName,
                  type: 1,
                  manageBrandModels:
                    u.manageBrandModels.map((i) => {
                      return {
                        modelName: i.modelName,
                      }
                    }) || [],
                }
              }) || []
          }
          values.lastPrice = this.Details.buyRequirement.price
          values.materialName = this.recordType.materialName
          values.materialModelType = this.recordType.materialModelType
          values.settlementMode = this.recordType.settlementMode
          values.invoiceType = this.Details.buyRequirement.invoiceType
          values.nakedPrice = this.Details.buyRequirement.nakedPrice
          values.materialRate = this.Details.buyRequirement.taxRate
          values.materialId = this.recordType.materialId
          values.supplierId = this.record.id

          console.log(values)

          that.spinning = true
          getSupplierOfferUpdate(values)
            .then((res) => {
              if (res.code === 200) {
                that.spinning = false
                this.visible = false
                that.$message.info(res.msg)
                that.$emit('finish')
              } else {
                that.$message.error(res.msg)
                that.spinning = false
              }
            })
            .catch((err) => (that.spinning = false))
        }
      })
    },
    handleCancel() {
      this.form.resetFields() // 清空表
      this.$nextTick(() => (this.visible = false))
    },
    query(type, record = {}) {
      let that = this
      that.actionType = type
      that.visible = true
      that.record = record
      that.recordType = type
      getSupplierOffer({ materialId: type.materialId, supplierId: record.id }).then((res) => {
        if (res.code === 200) {
          this.Details = res.data
          this.manageBrands = res.data.manageBrands
          this.form.setFieldsValue({
            packageType: res.data.packageType,
            packageCount: res.data.packageCount,
            newPrice: res.data.newPrice,
            freightRate: res.data.freightRate,
            lowestNum: res.data.lowestNum,
            deliveryCycle: res.data.deliveryCycle || res.data.buyRequirement.maxDelivery,
            shelfLife: res.data.shelfLife || res.data.buyRequirement.minWarranty,
          })
        } else {
          this.$message.error(res.msg)
        }
      })

      queryCode({ code: 'Packing_01' })
        .then((res) => {
          that.Warehouse = res.data
        })
        .catch((err) => (that.loading = false))
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

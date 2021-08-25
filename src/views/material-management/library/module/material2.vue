<template>
  <div>
    <div v-if="!Details">
      <a-result title="该物料尚未设置采购要求，请点击采购要求按钮设置">
        <template #icon>
          <a-icon type="smile" theme="twoTone" />
        </template>
        <template #extra>
          <a-button type="primary" @click="Procurements()">设置采购要求 </a-button>
        </template>
      </a-result>
      <MaterFrom key="k1" ref="materFrom" @finish="query(record)" />
    </div>
    <div v-else>
      <a-spin :spinning="spinning">
        <table class="custom-table custom-table-border">
          <tr>
            <td style="width: 155px">指定供应商</td>
            <td>
              <a-button type="link" @click="historys('supplier')">
                {{ Details.supplierName === '' ? '供应商不限' : Details.supplierName }}
              </a-button>
              <span style="float: right; width: 15%">
                <a-button style="float: right" type="primary" @click="Procurement('supplier')"
                  >变更指定工供应商
                </a-button>
              </span>
            </td>
          </tr>
          <tr>
            <td>指定品牌及型号</td>
            <td>
              <a-button type="link" @click="historys('brand')">
                {{
                  Details.buyRequirementBrands && Details.buyRequirementBrands.length === 0
                    ? '品牌型号不限'
                    : Details.buyRequirementBrands &&
                      Details.buyRequirementBrands
                        .map((u) => u.brandName + '/' + u.buyRequirementBrandModels.map((i) => i.modelName))
                        .join(',')
                }}</a-button
              >

              <span style="float: right; width: 15%">
                <a-button style="float: right" type="primary" @click="Procurement('brand')">变更指定品牌 </a-button>
              </span>
            </td>
          </tr>
          <tr>
            <td>是否固定包装</td>
            <td>
              <a-button type="link" @click="historys('packing')">{{
                Details.packType === 1 ? '固定包装方式' : '不固定包装方式'
              }}</a-button>

              <span style="float: right; width: 15%">
                <a-button style="float: right" type="primary" @click="Procurement('packing')">变更包装 </a-button>
              </span>
            </td>
          </tr>
          <tr v-if="Details.packType === 1">
            <td>包装方式</td>
            <td>
              {{ Details.packMethod }}
              <span style="float: right; width: 15%">&ensp;&ensp; </span>
            </td>
          </tr>
          <tr v-if="Details.packType === 1">
            <td>包内数量</td>
            <td>
              {{ Details.pageNum }}
              <span style="float: right; width: 15%"> &ensp;&ensp;</span>
            </td>
          </tr>
          <tr>
            <td>物料价格模式</td>
            <td>
              {{ Details.packType === 1 ? '固定价格模式' : '实时价格模式' }}
              <span style="float: right; width: 15%">&ensp;&ensp;</span>
            </td>
          </tr>
          <tr>
            <td>最新采购价格</td>
            <td>
              {{ Details.price }}
              <span style="float: right; width: 15%">&ensp;&ensp;</span>
            </td>
          </tr>
          <tr>
            <td>裸价的标准</td>
            <td>
              <a-button type="link" @click="historys('standard')">
                {{ Details.nakedPrice === 1 ? '含税运' : '含税不含运' }}
              </a-button>
              <span style="float: right; width: 15%">
                <a-button style="float: right" type="primary" @click="Procurement('standard')"
                  >变更裸价的标准
                </a-button>
              </span>
            </td>
          </tr>
          <tr>
            <td>物料发票类型</td>
            <td>
              <a-button type="link" @click="historys('invoice')">
                {{ Details.invoiceType === 0 ? '不限' : Details.invoiceType === 1 ? '增值税专用发票' : '普通发票' }}
              </a-button>
              <span style="float: right; width: 15%">
                <a-button style="float: right" type="primary" @click="Procurement('invoice')">变更发票类型 </a-button>
              </span>
            </td>
          </tr>
          <tr>
            <td>物料税率(%)</td>
            <td>
              <a-button type="link" @click="historys('taxRate')"> {{ Details.taxRate }}</a-button>
              <span style="float: right; width: 15%">
                <a-button style="float: right" type="primary" @click="Procurement('taxRate')">变更物料税率</a-button>
              </span>
            </td>
          </tr>
          <tr>
            <td>最大采购量</td>
            <td>
              <a-button type="link" @click="historys('stock')"> {{ Details.maxPurchase }}</a-button>
              <span style="float: right; width: 15%">
                <a-button style="float: right" type="primary" @click="Procurement('stock')">变更最大采购量</a-button>
              </span>
            </td>
          </tr>
          <tr>
            <td>最短质保期(天)</td>
            <td>
              <a-button type="link" @click="historys('Warranty')"> {{ Details.minWarranty }} </a-button>
              <span style="float: right; width: 15%">
                <a-button style="float: right" type="primary" @click="Procurement('Warranty')">变更质保期</a-button>
              </span>
            </td>
          </tr>
          <tr>
            <td>最长交货期(天)</td>
            <td>
              <a-button type="link" @click="historys('delivery')"> {{ Details.maxDelivery }}</a-button>
              <span style="float: right; width: 15%">
                <a-button style="float: right" type="primary" @click="Procurement('delivery')">变更交货期</a-button>
              </span>
            </td>
          </tr>
        </table>
        <Modal ref="modal"></Modal>
        <ModalList ref="modalList"></ModalList>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { getBuyRequirement } from '@/api/routineMaterial'
import MaterFrom from './materFrom'
import Modal from './modal'
import ModalList from './modalList'
export default {
  name: 'material-rule-management-library-normal-AddForm',
  components: { MaterFrom, Modal, ModalList },
  data() {
    return {
      type: 'loading',
      visible: false,
      spinning: false,
      record: {},
      detail: {},
      submitParams: {},
      selectNode: {},
      Details: {},
    }
  },
  computed: {},
  methods: {
    async query(record) {
      this.record = record
      if (record.id) {
        getBuyRequirement({ materialId: record.id }).then((res) => (this.Details = res.data))
      }
    },
    //打开新增设置采购要求
    Procurements() {
      this.$refs.materFrom.query('add', this.record)
    },
    //打开变更要求
    async Procurement(type) {
      await this.$refs.modal.query(type, this.record, null)
    },
    //打开变更历史
    async historys(type) {
      await this.$refs.modalList.init(type, this.Details)
    },
  },
}
</script>

<style scoped>
</style>

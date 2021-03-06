<template>
  <a-modal :title="modalTitle" v-model="visible" :width="1200" :footer="null" :maskClosable="false">
    <a-table :columns="priewColumns" rowKey="id" :dataSource="priewData" :pagination="false" :loading="loading">
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="beforeType" slot-scope="text, record, index">
        <span v-if="isStandard">{{ record.type === 1 ? '含税运' : '含税不含运' }}</span>
        <span v-if="isStock">{{ record.number }}</span>
        <span v-if="isTaxRate">{{ record.taxRate }}%</span>
        <span v-if="isSupplier">{{ record.supplierName }}</span>

        <span v-if="isbrand">{{ record.bmName }}</span>
        <span v-if="isInvoice">{{
          record.type === 0 ? '无限' : record.type === 1 ? '增值税专用发票' : '普通发票'
        }}</span>
        <span v-if="isPacking && record.packType === 1">
          固定包装方式 {{ record.packName }}/{{ record.packName }}内数量{{ record.packNum }}</span
        >
        <span v-if="isPacking && record.packType === 2">不固定包装方式</span>
        <span v-if="isWarranty || isDelivery">{{ record.number }}天</span>
      </div>
      <div slot="status" slot-scope="text, record">
        {{ getStateText(text) }}
      </div>
      <div slot="afterType" slot-scope="text, record, index">
        <span v-if="isStandard">{{ record.ctype === 1 ? '含税运' : '含税不含运' }}</span>
        <span v-if="isStock">{{ record.cnumber }}</span>
        <span v-if="isTaxRate">{{ record.ctaxRate }}%</span>
        <span v-if="isSupplier">{{ record.csupplierName }}</span>
        <span v-if="isbrand">{{ record.cbmName }}</span>
        <span v-if="isInvoice">{{
          record.ctype === 0 ? '无限' : record.ctype === 1 ? '增值税专用发票' : '普通发票'
        }}</span>
        <span v-if="isPacking && record.cpackType === 1">
          固定包装方式 {{ record.cpackName }}/{{ record.cpackName }}内数量{{ record.cpackNum }}</span
        >
        <span v-if="isPacking && record.cpackType === 2">不固定包装方式</span>
        <span v-if="isWarranty || isDelivery">{{ record.cnumber }}天</span>
      </div>
    </a-table>
  </a-modal>
</template>
<script>
import {
  getSupplier,
  getPack,
  getBrand,
  getInvoice,
  getTaxRate,
  getMaxPurchase,
  getNakedPrice,
  getDelivery,
} from '@/api/routineMaterial'
const priewColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '变更前',
    dataIndex: 'beforeType',
    scopedSlots: { customRender: 'beforeType' },
  },
  {
    align: 'center',
    title: '申请变更为',
    key: 'afterType',
    scopedSlots: { customRender: 'afterType' },
  },
  {
    align: 'center',
    title: '申请人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '申请原因',
    key: 'reason',
    dataIndex: 'reason',
  },
  {
    align: 'center',
    title: '申请时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '审批人',
    key: 'approverName',
    dataIndex: 'approverName',
  },
  {
    align: 'center',
    title: '审批结果',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '审批原因',
    key: 'approverReason',
    dataIndex: 'approverReason',
  },
  {
    align: 'center',
    title: '审批时间',
    key: 'approverDate',
    dataIndex: 'approverDate',
  },
]

export default {
  name: 'Info',
  data() {
    return {
      visible: false,
      loading: false,
      priewColumns: priewColumns,
      priewData: [],
      type: '',
    }
  },
  computed: {
    modalTitle() {
      if (this.isSupplier) {
        return ' 供应商变更历史 '
      }
      if (this.isbrand) {
        return '品牌型号变更历史'
      }
      if (this.isPacking) {
        return '包装方式变更历史'
      }
      if (this.isStandard) {
        return '变更裸价价格标准历史'
      }
      if (this.isInvoice) {
        return '变更发票类型历史'
      }
      if (this.isTaxRate) {
        return '变更税率历史'
      }
      if (this.isStock) {
        return '变更最大采购数量历史'
      }
      if (this.isWarranty || this.isDelivery) {
        return '变更质保期/交货期历史'
      }
    },

    isbrand() {
      return this.type === 'brand' //  变更品牌
    },
    isSupplier() {
      return this.type === 'supplier' //变更供应商
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
  },
  methods: {
    init(type, record) {
      this.priewData = []
      this.type = type
      this.visible = true
      this.loading = true

      let api = {
        supplier: getBrand,
        packing: getPack,
        brand: getBrand,
        invoice: getInvoice,
        taxRate: getTaxRate,
        stock: getMaxPurchase,
        standard: getNakedPrice,
        Warranty: getDelivery,
        delivery: getDelivery,
      }

      let react = {
        requirementId: record.id,
        searchStatus: 0,
      }
      if (this.isWarranty) {
        react.type = 1
      }
      if (this.isDelivery) {
        react.type = 2
      }
      // 供应商
      api[type](react)
        .then((res) => {
          this.priewData = res.data.records
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    setModel(type = 'show') {
      this.visible = String(type) === 'show' ? true : false
    },
    getStateText(state) {
      let stateMap = {
        0: '待提交',
        1: '待审批',
        2: '通过',
        3: '不通过',
        4: '已撤回',
      }
      return stateMap[state] || `未知状态:${state}`
    },
  },
}
</script>
<style scoped>
</style>
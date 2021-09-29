<template>
  <a-modal title="物料报价维护历史记录" v-model="visible" :width="1300" :footer="null" :maskClosable="false">
    <a-table
      :columns="priewColumns"
      rowKey="id"
      :dataSource="priewData"
      :pagination="true"
      :loading="loading"
      :scroll="{ x: 2000 }"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="invoiceType" slot-scope="text, record, index">
        <span>{{ text === 0 ? '不限' : text === 1 ? '增值税专用发票' : text === 2 ? '普通发票' : '' }}</span>
      </div>
      <div slot="nakedPrice" slot-scope="text, record, index">
        <span>{{ text === 1 ? '含税运' : text === 1 ? '含税不含运' : '' }}</span>
      </div>
    </a-table>
  </a-modal>
</template>
<script>
import { listManageSupplierOfferLog } from '@/api/supplier'
const priewColumns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '物料',
    dataIndex: 'materialName',
    key: 'materialName',
  },
  {
    align: 'center',
    title: '规格型号',
    key: 'materialModelType',
    dataIndex: 'materialModelType',
    width: 100,
    ellipsis: true,
  },
  {
    align: 'center',
    title: '单位',
    key: 'code',
    dataIndex: 'code',
  },
  {
    align: 'center',
    title: '最后一次采购单价',
    key: 'lastPrice',
    dataIndex: 'lastPrice',
  },
  {
    align: 'center',
    title: '包装方式',
    key: 'packageType',
    dataIndex: 'packageType',
  },
  {
    align: 'center',
    title: '包内数量',
    key: 'packageCount',
    dataIndex: 'packageCount',
  },
  {
    align: 'center',
    title: '发票类型',
    key: 'invoiceType',
    dataIndex: 'invoiceType',
    scopedSlots: { customRender: 'invoiceType' },
  },
  {
    align: 'center',
    title: '裸价的标准',
    key: 'nakedPrice',
    dataIndex: 'nakedPrice',
    scopedSlots: { customRender: 'nakedPrice' },
  },
  {
    align: 'center',
    title: '最新报价',
    key: 'newPrice',
    dataIndex: 'newPrice',
  },
  {
    align: 'center',
    title: '物料税率(%)',
    key: 'materialRate',
    dataIndex: 'materialRate',
  },
  {
    align: 'center',
    title: '运费税率(%)',
    key: 'freightRate',
    dataIndex: 'freightRate',
  },
  {
    align: 'center',
    title: '最低采购数量',
    key: 'lowestNum',
    dataIndex: 'lowestNum',
  },
  {
    align: 'center',
    title: '交货周期(天)',
    key: 'deliveryCycle',
    dataIndex: 'deliveryCycle',
  },
  {
    align: 'center',
    title: '保质期(天)',
    key: 'shelfLife',
    dataIndex: 'shelfLife',
  },
  {
    align: 'center',
    title: '创建人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  // {
  //   align: 'center',
  //   title: '创建部门',
  //   key: 'code',
  //   dataIndex: 'code',
  // },
  {
    align: 'center',
    title: '创建时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
    fixed: 'right',
    width: 150,
  },
]

export default {
  name: 'ApproveInfo',
  data() {
    return {
      visible: false,
      loading: false,
      priewColumns: priewColumns,
      priewData: [],
    }
  },
  methods: {
    init(record, type) {
      this.priewData = []
      this.visible = true
      this.loading = true
      // 获取审批预览信息
      listManageSupplierOfferLog({ materialId: record.materialId, supplierId: type.id })
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
  },
}
</script>
<style scoped>
</style>

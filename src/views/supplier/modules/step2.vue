<template>
  <!-- 报价记录 -->
  <div class="product-process-management_workshop-management">
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="packageType" slot-scope="text, record, index">
          <span>{{ record.packageType }},数量：{{ record.packageCount }}</span>
        </div>

        <div slot="invoiceType" slot-scope="text, record, index">
          <span>{{ text === 0 ? '不限' : text === 1 ? '增值税专用发票' : text === 2 ? '普通发票' : '' }}</span>
        </div>
        <div slot="nakedPrice" slot-scope="text, record, index">
          <span>{{ text === 0 ? '含税运' : text === 1 ? '含税不含运' : '' }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template>
            <a type="primary" @click="doAction('view', record)">查看报价历史</a>
          </template>
          <template v-if="$auth('mould:edit')">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('add', record)">更新报价</a>
          </template>
        </div>
      </a-table>
    </div>
    <Quotation key="k1" ref="addForm" />
    <Step2From ref="step2From" @finish="searchAction" />
  </div>
</template>

<script>
import { getlierOffer } from '@/api/supplier'
import Quotation from './Quotation'
import Step2From from './step2From'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName',
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'materialModelType',
    width: 200,
  },
  {
    align: 'center',
    title: '包装方式',
    dataIndex: 'packageType',
    scopedSlots: { customRender: 'packageType' },
  },
  {
    align: 'center',
    title: '最新采购单价',
    dataIndex: 'lastPrice',
  },
  {
    align: 'center',
    title: '发票类型',
    dataIndex: 'invoiceType',
    scopedSlots: { customRender: 'invoiceType' },
  },

  {
    align: 'center',
    title: '裸价标准',
    dataIndex: 'nakedPrice',
    scopedSlots: { customRender: 'nakedPrice' },
  },
  {
    align: 'center',
    title: '最新报价',
    dataIndex: 'newPrice',
  },
  {
    align: 'center',
    title: '物料税率',
    dataIndex: 'materialRate',
  },
  {
    align: 'center',
    title: '最低采购数量',
    dataIndex: 'lowestNum',
  },
  {
    align: 'center',
    title: '交货周期',
    dataIndex: 'deliveryCycle',
  },
  {
    align: 'center',
    title: '保质期',
    dataIndex: 'shelfLife',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'product-process-management_mould-management',
  components: {
    Quotation,
    Step2From,
  },

  data() {
    return {
      columns: columns,
      dataSource: [],
      Warehouse: [],
      Position: [],
      loading: false,
      record: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      searchParam: {},
    }
  },
  methods: {
    init(record) {
      const that = this
      this.record = record
      that.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({ supplierId: this.record.id }, { ...this.searchParam }, opt, paginationParam)
      that.loading = true
      getlierOffer(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    doAction(actionType, record) {
      let that = this
      if (['view'].includes(actionType)) {
        this.$refs.addForm.init(record, this.record)
        return
      }

      if (['add'].includes(actionType)) {
        this.$refs.step2From.query(record, this.record)
        return
      }
    },
  },
}
</script>
<style scoped>
.product-process-management_workshop-management {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>
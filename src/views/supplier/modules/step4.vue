<template>
  <!-- 收料记录 -->
  <div class="product-process-management_workshop-management">
    <!-- <div class="main-wrapper">
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
        <div slot="urgencyDegree" slot-scope="text, record, index">
          <span>{{ text === 1 ? '一般' : text === 2 ? '加急' : '特级' }}</span>
        </div>
        <div slot="nakedPrice" slot-scope="text, record, index">
          <span>{{ text === 1 ? '含税运' : '含税不含运' }}</span>
        </div>
      </a-table>
    </div> -->
  </div>
</template>

<script>
import { listMaterialReceivingRecord } from '@/api/supplier'

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
    title: '收料单号',
    dataIndex: 'recieveNum',
  },
  {
    align: 'center',
    title: '采购单号',
    dataIndex: 'orderNum',
  },
  {
    align: 'center',
    title: '紧急程度',
    dataIndex: 'urgencyDegree',
    scopedSlots: { customRender: 'urgencyDegree' },
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
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode',
  },
  {
    align: 'center',
    title: '包装方式',
    dataIndex: 'packMethod',
  },
  {
    align: 'center',
    title: '包内数量',
    dataIndex: 'pageNum',
  },
  {
    align: 'center',
    title: '采购数量',
    dataIndex: 'requestNum',
  },
  {
    align: 'center',
    title: '到货数量',
    dataIndex: 'arrivalCount',
  },
  {
    align: 'center',
    title: '收料仓库',
    dataIndex: 'warehouseName',
  },
  {
    align: 'center',
    title: '收料数量',
    dataIndex: 'recieveCount',
  },
  {
    align: 'center',
    title: '收料人',
    dataIndex: 'receiveUserName',
  },
  {
    align: 'center',
    title: '收料时间',
    dataIndex: 'recieveTime',
  },
  // {
  //   align: 'center',
  //   title: '操作',
  //   key: 'action',
  //   scopedSlots: { customRender: 'action' },
  // },
]
export default {
  name: 'product-process-management_mould-management',
  components: {},

  data() {
    return {
      columns: columns,
      dataSource: [],
      Warehouse: [],
      Position: [],
      loading: false,
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
      that.searchAction({ supplierId: record.id })
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, opt, paginationParam)
      that.loading = true
      listMaterialReceivingRecord(_searchParam)
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
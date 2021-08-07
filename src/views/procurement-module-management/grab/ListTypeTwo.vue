<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
      :scroll="{ x: 3000 }"
    >
      <div
        slot="order"
        slot-scope="text, record, index"
      >
        {{index + 1}}
      </div>
      <div
        slot="urgencyDegree"
        slot-scope="text, record, index"
      >
        {{ {1:'一般',2:'加急',3:'特急'}[text] }}
      </div>

      <div
        slot="action"
        slot-scope="text, record, index"
      >
        <a @click="doAction('view',record)">查看</a>
        <a-divider type="vertical" />
        <a @click="doAction('offer',record)">提交异议</a>
      </div>

      <div
        slot="materialName"
        slot-scope="text, record, index"
      >
        <a-popover
          :title="text"
          trigger="hover"
        >
          <template slot="content">
            <p>物料名称：{{record.materialName}}</p>
            <p>物料代码：{{record.materialCode}}</p>
            <p>规格型号：{{record.materialModelType}}</p>
            <p>单位：{{ {1:'支',2:'把',3:'件'}[record.unit] }}</p>
          </template>
          <a
            href="javascript:void(0);"
            @click="doAction('materialView',record)"
          >
            {{text}}
          </a>
        </a-popover>
      </div>

      <div
        slot="nakedPrice"
        slot-scope="text, record, index"
      >
        {{ {1:'含税运',2:'含税不含运'}[text] }}
      </div>

      <div
        slot="newPrice"
        slot-scope="text, record, index"
      >
        {{ text | moneyFormatNumber }}
      </div>

      <div
        slot="createdName"
        slot-scope="text, record, index"
      >
        {{record.createdDepName}}/{{ record.createdName }}
      </div>

      <template
        slot="footer"
        slot-scope="text"
      >
      </template>

    </a-table>
    <OfferPriceForm
      ref="offerPriceForm"
      @finished="() => search()"
    />
    <OfferPriceView ref="offerPriceView" @finished="() => search()"/>
  </div>
</template>

<script>
import { quotationPublicPageList } from '@/api/procurementModuleManagement'
import OfferPriceForm from './OfferPriceForm'
import OfferPriceView from './OfferPriceView'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    fixed: 'left'
  },
  {
    title: '采购需求单号',
    dataIndex: 'requestApplyNum',
    fixed: 'left'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '需求类型',
    dataIndex: 'requestTypeText'
  },
  {
    title: '紧急程度',
    dataIndex: 'urgencyDegree',
    scopedSlots: { customRender: 'urgencyDegree' }
  },
  {
    title: '需求数量',
    dataIndex: 'requestNum'
  },
  {
    title: '需求日期',
    dataIndex: 'requestTime'
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName'
  },
  {
    title: '裸价标准',
    dataIndex: 'nakedPrice',
    scopedSlots: { customRender: 'nakedPrice' }
  },
  {
    title: '最新报价',
    dataIndex: 'newPrice',
    scopedSlots: { customRender: 'newPrice' }
  },
  {
    title: '物料税率(%)',
    dataIndex: 'materialRate'
  },
  {
    title: '运费税率(%)',
    dataIndex: 'freightRate'
  },
  {
    title: '最低采购数量',
    dataIndex: 'lowestNum'
  },
  {
    title: '交货周期(天)',
    dataIndex: 'deliveryCycle'
  },
  {
    title: '保质期(天)',
    dataIndex: 'shelfLife'
  },
  {
    title: '报价人',
    dataIndex: 'createdName',
    scopedSlots: { customRender: 'createdName' }
  },
  {
    title: '报价时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

export default {
  props: ['queryParam'],
  components: { OfferPriceForm, OfferPriceView },
  data() {
    return {
      columns,
      loading: false,
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      selectedRowKeys: [],
      selectedRows: [],
      queryParamCustom: {}
    }
  },
  watch: {
    queryParam: {
      handler(s) {
        console.log(arguments)
        this.queryParamCustom = { ...this.queryParam, ...s }
      },
      immediate: true
    }
  },
  computed: {
    btnOneEnabled() {
      return this.selectedRows.length === 1
    },
    btnMulEnabled() {
      return this.selectedRows.length > 0
    }
  },
  methods: {
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    search(params = {}) {
      const that = this
      that.selectedRowKeys = []
      that.selectedRows = []

      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const _searchParam = Object.assign({}, { ...that.queryParamCustom }, paginationParam, params)
      that.loading = true
      quotationPublicPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.requestTime = item.requestTime.slice(0, -3)
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          const { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch(err => {
          that.loading = false
          console.log(err)
        })
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        that.$refs.offerPriceView.query('view', record)
        return
      } else if (type === 'offer') {
        that.$refs.offerPriceForm.query('add', record)
        return
      }
    }
  }
}
</script>

<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :rowSelection="1?null :{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
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
        <!--  approveStatus 报价单审核状态：1待审核，2通过，3不通过，4不通过已报价，5异常，6异常已处理 -->
        <template v-if="record.approveStatus === 1">
          <a @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
          <a @click="doAction('approval',record)">审批</a>
        </template>
        <template v-if="record.approveStatus === 2">
          <a @click="doAction('view',record)">查看</a>
        </template>
        <template v-if="record.approveStatus === 3 || record.approveStatus === 4">
          <a @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
          <a @click="doAction('offer',record)">报价</a>
        </template>
        <template v-if="record.approveStatus === 5">
          <a @click="doAction('view',record)">查看</a>
          <a-divider type="vertical" />
          <a @click="doAction('chuli',record)">处理</a>
        </template>
        <template v-if="record.approveStatus === 6">
          <a @click="doAction('view',record)">查看</a>
        </template>

        <!-- <a-divider type="vertical" />
        <a @click="doAction('reject',record)">驳回</a> -->
        <!-- <a @click="doAction('chuli',record)">处理</a> -->
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
        slot="nowPrice"
        slot-scope="text, record, index"
      >
        <span style="color:red;">{{ text | moneyFormatNumber }}</span>
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

      <div
        slot="approveStatus"
        slot-scope="text, record, index"
      >
        <a href="javascript:void(0);" @click="approvalPreview(record)">
          {{ {1:'待审批',2:'通过',3:'不通过',4:'不通过已报价',5:'异常',6:'异常已处理'}[text] || '未知状态' }}
        </a>
      </div>

    </a-table>
    <OfferPriceForm
      ref="offerPriceForm"
      @finished="() => search()"
    />
    <OfferPriceView ref="offerPriceView" @finish="() => search()"/>
    <ApproveInfo ref="approveInfoCard" @finish="() => search()"/>
    <ExceptionForm ref="exceptionForm" @finish="() => search()"/>
    <MaterialView :key="normalAddFormKeyCount" ref="materialView" />
    <RejectForm ref="rejectForm" @finished="() => search()"/>
  </div>
</template>

<script>
import MaterialView from '@/views/material-management/library/module/NormalAddForm'
import { quotationPageList } from '@/api/procurementModuleManagement'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import OfferPriceForm from './OfferPriceForm'
import OfferPriceView from './OfferPriceView'
import ExceptionForm from './ExceptionForm'
import RejectForm from './RejectForm'
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
    dataIndex: 'requestTime',
    width:200
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
    title: '抢单报价',
    dataIndex: 'newPrice',
    scopedSlots: { customRender: 'newPrice' }
  },
  {
    title: '最新报价',
    dataIndex: 'nowPrice',
    scopedSlots: { customRender: 'nowPrice' }
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
    dataIndex: 'createdTime',
    width:200
  },
  {
    title: '审批状态',
    dataIndex: 'approveStatus',
    scopedSlots: { customRender: 'approveStatus' },
    width:120
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

export default {
  props: ['queryParam'],
  components: {
    OfferPriceForm,
    OfferPriceView,
    ApproveInfo,
    ExceptionForm,
    MaterialView,
    RejectForm
  },
  data() {
    return {
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
      queryParamCustom: {},
      normalAddFormKeyCount: 1
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
    },
    columns(){
      let tagKey = +this.$attrs.tagKey
      if(tagKey === 7 || tagKey === 8){
        let _columns = [...columns]

        let c1 = _columns.find(c => c.dataIndex === 'createdName')
        let c2 = _columns.find(c => c.dataIndex === 'createdTime')
        if(c1){
          c1.title = '抢单报价人'
        }
        if(c2){
          c2.title = '抢单报价时间'
        }
        return _columns
      }
      return columns
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
      quotationPageList(_searchParam)
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
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        that.$refs.offerPriceView.query('view', record)
        return
      } else if (type === 'offer') {
        that.$refs.offerPriceForm.query('add', {...record,source:3})
        return
      }else if(type === 'approval'){
        that.$refs.offerPriceView.query('approval', record)
        return
      }else if(type === 'chuli'){
        that.$refs.exceptionForm.query(record)
        return
      } else if (type === 'materialView') {
        if(!record.materialId){
          that.$message.info('物料编号未定义');
          return
        }
        that.normalAddFormKeyCount++
        let reg = /^[0-9\.]+$/g
        let isNormal = reg.test(record.materialCode)
        let __from = isNormal ? 'normal' : 'product'
        that.$nextTick(() => {
          that.$refs['materialView'].query('view', {
            id: record.materialId,
            __from
          })
        })
        return
      }else if(type === 'reject'){
        that.$refs.rejectForm.query({requestId:record.requestId})
        return
      }
    }
  }
}
</script>

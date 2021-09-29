<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :rowSelection="1?null:{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
      :scroll="{ x: 3000 }"
    >
      <div
        slot="order"
        slot-scope="text, record, index"
      >
        {{index + 1}}
      </div>
      <div
        slot="storageStatus"
        slot-scope="text, record, index"
      >
        <!-- 入库状态：1未入库，2部分入库，3全部入库 -->
        {{ {1:'未入库',2:'部分入库',3:'全部入库'}[text] }}
      </div>

      <div
        slot="action"
        slot-scope="text, record, index"
      >
        <a @click="doAction('view',record)">查看</a>
        <a-divider type="vertical" />
        <a @click="doAction('saveMaterial',record)">收料</a>
        <a-divider type="vertical" />
        <a @click="doAction('takeGoods',record)">提货</a>
        <a-divider type="vertical" />
        <a @click="doAction('over',record)">采购完成</a>
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
        slot="urgencyDegree"
        slot-scope="text, record, index"
      >
        {{ {1:'一般',2:'加急',3:'特急'}[text] }}
      </div>

      <div
        slot="nakedPrice"
        slot-scope="text, record, index"
      >
        {{ {1:'含税运',2:'含税不含运'}[text] }}
      </div>

      <div
        slot="orderPrice"
        slot-scope="text, record, index"
      >
        {{ text | moneyFormatNumber }}
      </div>
      <div
        slot="quotationPrice"
        slot-scope="text, record, index"
      >
        {{ text | moneyFormatNumber }}
      </div>

      <div
        slot="totalPrice"
        slot-scope="text, record, index"
      >
        {{ (record.orderPrice * record.requestNum) | moneyFormatNumber }}
      </div>

      <div
        slot="storageQuantity"
        slot-scope="text, record, index"
      >
        {{ text || 0 }}
      </div>

      <div
        slot="backQuantity"
        slot-scope="text, record, index"
      >
        {{ text || 0 }}
      </div>
      <div
        slot="requestNum"
        slot-scope="text, record, index"
      >
        <a-popover
          :title="`${record.materialName}（${record.materialCode}）数量预警`"
          trigger="hover"
        >
          <template slot="content">
            <p>需求数量：{{text}}</p>
            <p>安全库存：{{record.__safetyStock}}</p>
            <p>超安全库存数量：{{ record.__difNum < 0 ? 0 : record.__difNum }}</p>
          </template>
          <span :style="{color:record.__isWarning ? 'red' : ''}" style="padding:5px 15px;">{{text}}</span>
        </a-popover>
      </div>
      <template
        slot="footer"
        slot-scope="text"
      >
      </template>

    </a-table>
    <OrderFormView ref="orderFormView" />
    <ReceiveMaterial
      ref="receiveMaterial"
      @finish="() => search()"
    />
    <TakeGoods
      ref="takeGoods"
      @finish="() => search()"
    />
    <MaterialView :key="normalAddFormKeyCount" ref="materialView" />

    <FinishForm ref="finishForm" @finished="() => search()"/>

  </div>
</template>

<script>
import MaterialView from '@/views/material-management/library/module/NormalAddForm'
import { orderPageList ,orderFinish} from '@/api/procurementModuleManagement'
import { getBuyRequirement } from '@/api/routineMaterial'
import OrderFormView from './OrderFormView'
import ReceiveMaterial from './ReceiveMaterial'
import TakeGoods from './TakeGoods'
import FinishForm from './FinishForm'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    fixed: 'left'
  },
  {
    title: '采购单号',
    dataIndex: 'orderNum',
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
    dataIndex: 'requestNum',
    scopedSlots: { customRender: 'requestNum' }
  },
  {
    title: '需求日期',
    dataIndex: 'requestTime',
    width: 200
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName'
  },
  {
    title: '抢单报价',
    dataIndex: 'quotationPrice',
    scopedSlots: { customRender: 'quotationPrice' }
  },
  {
    title: '采购单价',
    dataIndex: 'orderPrice',
    scopedSlots: { customRender: 'orderPrice' }
  },
  {
    title: '订单金额',
    scopedSlots: { customRender: 'totalPrice' }
  },
  {
    title: '预计到货时间',
    dataIndex: 'deliveryDate',
    width: 200
  },
  {
    title: '入库状态',
    dataIndex: 'storageStatus',
    scopedSlots: { customRender: 'storageStatus' }
  },
  {
    title: '入库数量',
    dataIndex: 'storageQuantity',
    scopedSlots: { customRender: 'storageQuantity' }
  },
  {
    title: '退货数量',
    dataIndex: 'backQuantity',
    scopedSlots: { customRender: 'backQuantity' }
  },
  {
    title: '采购人',
    dataIndex: 'createdName'
  },
  {
    title: '采购时间',
    dataIndex: 'createdTime',
    width: 200
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
    OrderFormView,
    ReceiveMaterial,
    TakeGoods,
    MaterialView,
    FinishForm
  },
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
      orderPageList(_searchParam)
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
          that.fillNum()
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
        async fillNum(){
      const that = this
      let arr = that.dataSource.map(item => {
        return new Promise(resolve => {
          getBuyRequirement({ materialId:item.materialId })
              .then(res => {
                let n = 0
                try{
                  n = res.data.pageNum || 0
                }catch(e){
                  n = 0
                }
                let dataSource = [...that.dataSource]
                let target = dataSource.find(_item => _item.key === item.key)
                target.__safetyStock = n //安全库存
                target.__difNum = (target.requestNum || 0) - n
                target.__isWarning = (target.requestNum || 0) > n  //是否超安全库存
                that.dataSource = dataSource
              })
              .catch(err => {
                console.log(err)
              })
        })
      })

      await Promise.all(arr)
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
        that.$refs.orderFormView.query('view', record)
        return
      } else if (type === 'saveMaterial') {
        //收料
        that.$refs.receiveMaterial.query('saveMaterial', record)
        return
      } else if (type === 'takeGoods') {
        //提货
        that.$refs.takeGoods.query('takeGoods', record)
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
      }else if(type === 'over'){
        that.$refs.finishForm.query(record)
        return
      }
    }
  }
}
</script>

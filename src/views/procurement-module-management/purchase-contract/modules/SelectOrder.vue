<template>
  <a-modal
    title="选择采购单"
    :width="1050"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-card :bordered="false" class="caigou-order-select-wrapper">
      <a-form layout="inline">
        <a-form-item label="">
          <a-input
            style="width:300px;"
            v-model="queryParamCustom.keyword"
            placeholder="需求单号，物料代码，物料名称模糊查询"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
        </a-form-item>
      </a-form>
      <a-layout>
        <a-layout-content>
          <div>
            <a-table
              :columns="columns"
              :dataSource="dataSource"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
              :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
              size="small"
              :scroll="{ x: 2000 }"
            >
              <div slot="order" slot-scope="text, record, index">
                {{ index + 1 }}
              </div>
              <div slot="urgencyDegree" slot-scope="text, record, index">
                {{ { 1: '一般', 2: '加急', 3: '特急' }[text] }}
              </div>

              <div slot="materialName" slot-scope="text, record, index">
                <a-popover :title="text" trigger="hover">
                  <template slot="content">
                    <p>物料名称：{{ record.materialName }}</p>
                    <p>物料代码：{{ record.materialCode }}</p>
                    <p>规格型号：{{ record.specification }}</p>
                    <p>单位：{{ record.subUnit }}</p>
                  </template>
                  <a href="javascript:void(0);">
                    {{ text }}
                  </a>
                </a-popover>
              </div>

              <div slot="nakedPrice" slot-scope="text, record, index">
                {{ { 1: '含税运', 2: '含税不含运' }[text] }}
              </div>

              <div slot="newPrice" slot-scope="text, record, index">
                {{ text | moneyFormatNumber }}
              </div>

              <div slot="lastPrice" slot-scope="text, record, index">
                {{ text | moneyFormatNumber }}
              </div>

              <div slot="createdName" slot-scope="text, record, index">
                {{ record.createdDepName }}/{{ record.createdName }}
              </div>
            </a-table>
          </div>
        </a-layout-content>
      </a-layout>

      <div class="btn-wapper">
        <a-button type="primary" :disabled="selectedRows.length === 0" @click="doAction('ok')">确定</a-button>
        <a-button @click="doAction('cancel')">取消</a-button>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { purchaseContractOrderList } from '@/api/procurementModuleManagement'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '采购需求单号',
    dataIndex: 'requestApplyNum',
    width: 150
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
    width: 140
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
    dataIndex: 'lastPrice',
    scopedSlots: { customRender: 'lastPrice' }
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
  }
]

export default {
  name: 'selectOrder',
  inject: ['addForm'],
  data() {
    return {
      loading: false,
      visible: false,
      columns,
      dataSource: [],
      queryParamCustom: {},
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
      decoratorKey: null
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    query(decoratorKey) {
      this.decoratorKey = decoratorKey

      this.$nextTick(() => (this.visible = true))
    },
    handleCancel() {
      this.$nextTick(() => (this.visible = false))
    },
    doAction(type) {
      const that = this
      if (type === 'ok') {
        // 供应商或者裸价标准 不一致 不允许参加
        if (!that.checkMatch()) {
          return
        }
        that.$emit('change', { decoratorKey: that.decoratorKey, selectedRows: [...that.selectedRows] })
        that.$nextTick(() => (that.visible = false))
      }
    },
    checkMatch() {
      const that = this
      let matched = false
      let { taxType, freightType, supplierId, supplierName } = that.addForm.submitParams
      let _nakedPrice = +taxType === 1 && +freightType === 1 ? 1 : +taxType === 1 && +freightType === 0 ? 2 : -1
      if (_nakedPrice === -1) {
        that.$message.info('裸价标准异常')
        return
      }
      const m = { 1: '含税运', 2: '含税不含运' }
      // 供应商或者裸价标准 不一致 不允许参加
      let result = []
      that.selectedRows.map(r => {
        r.supplierMatched = r.supplierId === supplierId
        r.nakedPriceMatched = r.nakedPrice === _nakedPrice
        if (!r.supplierMatched) {
          result.push(
            `【需求单号：${r.requestApplyNum} 物料名称：${r.materialName}】 供应商不一致：【原】${supplierName} ---> 【现】${r.supplierName}`
          )
        }
        if (!r.nakedPriceMatched) {
          result.push(
            `【需求单号：${r.requestApplyNum} 物料名称：${r.materialName}】 裸价标准不一致：【原】${
              m[_nakedPrice]
            } ---> 【现】${m[r.nakedPrice]}`
          )
        }
      })

      matched = result.length === 0
      if (!matched) {
        that.$message.info(result.join(' '))
      }
      return matched
      // { 1: '含税运', 2: '含税不含运' }
      // selectedRows.nakedPrice
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
      purchaseContractOrderList(_searchParam)
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
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style lang="less" scoped>
.caigou-order-select-wrapper {
  .btn-wapper {
    margin-top: 20px;
    text-align: center;
    /deep/ .ant-btn {
      margin: 0 10px;
    }
  }
}
</style>

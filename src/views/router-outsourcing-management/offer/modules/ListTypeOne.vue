<template>
  <div>
    <div class="search-wrapper">
        <a-form layout="inline">

          <a-form-item>
            <a-select
              placeholder="申请车间"
              style="width: 150px"
              allowClear
              v-model="queryParam.urgencyDegree"
            >
              <a-select-option :value="0">一般</a-select-option>
              <a-select-option :value="2">紧急</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-select
              placeholder="成品物料下拉搜索"
              style="width: 150px"
              allowClear
              v-model="queryParam.urgencyDegree"
            >
              <a-select-option :value="0">一般</a-select-option>
              <a-select-option :value="2">紧急</a-select-option>
            </a-select>
          </a-form-item>


          <a-form-item>
            <a-input
              placeholder="需求单号、任务单号、成品物料名称、报价单号模糊查询"
              v-model="queryParam.keyword"
              allowClear
              style="width: 300px"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              icon="search"
              @click="search"
            >查询</a-button>
          </a-form-item>
        </a-form>
      </div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
      :scroll="{ x: 3000 }"
    >
      <div slot="order" slot-scope="text, record, index">
        {{ index + 1 }}
      </div>
      <div slot="urgencyDegree" slot-scope="text, record, index">
        {{ { 0: '一般', 1: '紧急', 2: '紧急',3:'紧急' }[text] }}
      </div>

      <div slot="action" slot-scope="text, record, index">
        <a @click="doAction('view', record)">查看</a>
        <!-- <a-divider type="vertical" />
        <a @click="doAction('offer', record)">下单</a> -->
      </div>

      <div slot="materialName" slot-scope="text, record, index">
        <a-popover :title="text" trigger="hover">
          <template slot="content">
            <div style="max-width:450px;">
            <p>物料名称：{{ record.materialName }}</p>
            <p>物料代码：{{ record.materialCode }}</p>
            <p>规格型号：{{ record.specification }}</p>
            <p>单位：{{ record.subUnit }}</p>
            </div>
          </template>
          <a href="javascript:void(0);" @click="doAction('materialView', record)">
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




      <template slot="footer" slot-scope="text">
        <div>
          
        </div>
      </template>

      <div slot="approveStatus" slot-scope="text, record, index">
        <a href="javascript:void(0);" @click="approvalPreview(record)">
          {{
            { 1: '待审批', 2: '通过', 3: '不通过', 4: '不通过已报价', 5: '异常', 6: '异常已处理' }[text] || '未知状态'
          }}
        </a>
      </div>
    </a-table>
  </div>
</template>

<script>

import { quotationRequestApplyPageList } from '@/api/procurementModuleManagement'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'order' },
    fixed: 'left'
  },
  {
    title: '加工需求单号',
    dataIndex: 'requestApplyNum',
    fixed: 'left'
  },
  {
    title: '关联任务单',
    dataIndex: 'requestApplyNum'
  },
  {
    title: '需求时间',
    dataIndex: 'requestApplyNum'
  },
  {
    title: '成品物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' }
  },
  {
    title: '加工数量',
    dataIndex: 'requestTypeText'
  },
  {
    title: '所需原料种类',
    dataIndex: 'urgencyDegree',
    scopedSlots: { customRender: 'urgencyDegree' }
  },
  {
    title: '所需原料数量',
    dataIndex: 'requestNum',
    scopedSlots: { customRender: 'requestNum' }
  },
  {
    title: '委外工艺工序',
    dataIndex: 'requestTime',
    width: 200
  },
  {
    title: '申请人',
    dataIndex: 'createdName',
    scopedSlots: { customRender: 'createdName' }
  },
  {
    title: '状态',
    dataIndex: 'createdTime'
  },
  // {
  //   title: '审批状态',
  //   dataIndex: 'approveStatus',
  //   scopedSlots: { customRender: 'approveStatus' },
  //   width:120
  // },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

export default {
  props: ['queryParam'],
  components: {
    OfferPriceView,
    OrderForm,
    MaterialView
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
      if(selectedRows.some(r => !(+r.status === 2 && +r.type === 1))){
        this.$message.info('供应商状态异常(审批未通过或处在未启用状态)')
        return
      }

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
      quotationRequestApplyPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.requestTime = item.requestTime.slice(0, -3)
            return item
          })
          that.fillNum()
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
    async fillNum() {
      const that = this
      let arr = that.dataSource.map(item => {
        return new Promise(resolve => {
          getBuyRequirement({ materialId: item.materialId })
            .then(res => {
              let n = 0
              try {
                n = res.data.pageNum || 0
              } catch (e) {
                n = 0
              }
              let dataSource = [...that.dataSource]
              let target = dataSource.find(_item => _item.key === item.key)
              target.__safetyStock = n //安全库存
              target.__difNum = (target.requestNum || 0) - n
              target.__isWarning = (target.requestNum || 0) > n //是否超安全库存
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
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        that.$refs.offerPriceView.query('view', {...record,id:record.quotationId})
        return
      } else if (type === 'offer') {
        that.$refs.orderForm.query('add', record)
        return
      } else if (type === 'materialView') {
        if (!record.materialId) {
          that.$message.info('物料编号未定义')
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
      } else if (type === 'caigou') {
        if (!that.checkMatch()) {
          that.$message.info(`供应商或裸价标准不一致`)
          return
        }
        that.$router.push({
          name: 'procurement-module-management-purchase-contract-action',
          params: {
            selectedRows: [...that.selectedRows],
            action: 'add',
            from: 'procurement-module-management-order'
          }
        })
        return
      }
    },
    checkMatch() {
      const that = this
      let selectedRows = [...that.selectedRows]
      const { supplierId, nakedPrice } = selectedRows[0]
      return !selectedRows.find(r => r.supplierId !== supplierId || r.nakedPrice !== nakedPrice)
    }
  }
}
</script>

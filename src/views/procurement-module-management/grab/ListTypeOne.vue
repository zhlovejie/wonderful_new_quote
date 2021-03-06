<template>
  <div class="grab-list-type-wrapper grab-list-type-1">
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :rowSelection="1 ? null : { onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
      :scroll="{ x: 2400 }"
    >
      <div slot="order" slot-scope="text, record, index">
        {{ index + 1 }}
      </div>
      <div slot="urgencyDegree" slot-scope="text, record, index">
        {{ { 0: '一般', 1: '紧急', 2: '紧急',3:'紧急' }[text] }}
      </div>

      <div slot="action" slot-scope="text, record, index">
        <a @click="doAction('view', record)">查看</a>
        <a-divider type="vertical" />
        <a @click="doAction('ask', record)">询价</a>
        <a-divider type="vertical" />
        <a @click="doAction('offer', record)">报价</a>
        <a-divider type="vertical" />
        <a @click="doAction('reject', record)">驳回</a>
      </div>

      <div slot="materialName" slot-scope="text, record, index">
        <a-popover :title="text" trigger="hover">
          <template slot="content">
            <div style="max-width:450px;">
            <p>物料名称：{{ record.materialName }}</p>
            <p>物料代码：{{ record.materialCode }}</p>
            <p>规格型号：{{ record.materialModelType }}</p>
            <p>单位：{{ record.unit }}</p>
            </div>
          </template>
          <a href="javascript:void(0);" @click="doAction('materialView', record)">
            {{ text }}
          </a>
        </a-popover>
      </div>
      <div slot="proposerName" slot-scope="text, record, index">
        {{ record.applyDepName }}/{{ record.proposerName }}
      </div>

      <div slot="reason" slot-scope="text, record, index">
        <a-tooltip v-if="String(text).length > 15">
          <template slot="title">{{ text }}</template>
          {{ String(text).slice(0, 15) }}...
        </a-tooltip>
        <span v-else>{{ text }}</span>
      </div>

      <div slot="remark" slot-scope="text, record, index">
        <a-tooltip v-if="String(text).length > 15">
          <template slot="title">{{ text }}</template>
          {{ String(text).slice(0, 15) }}...
        </a-tooltip>
        <span v-else>{{ text }}</span>
      </div>

      <div slot="requestNum" slot-scope="text, record, index">
        <a-popover :title="`${record.materialName}（${record.materialCode}）数量预警`" trigger="hover">
          <template slot="content">
            <p>需求数量：{{ text }}</p>
            <p>安全库存：{{ record.__safetyStock }}</p>
            <p>超安全库存数量：{{ record.__difNum < 0 ? 0 : record.__difNum }}</p>
          </template>

          <span :style="{ color: record.__isWarning ? 'red' : '' }" style="padding:5px 15px;">{{ text }}</span>
        </a-popover>
      </div>

      <template slot="footer" slot-scope="text"> </template>
    </a-table>
    <AskPriceForm ref="askPriceForm" @finished="() => search()" />
    <OfferPriceForm ref="offerPriceForm" @finished="() => search()" />
    <ApplyView ref="applyView" @finished="() => search()" />
    <MaterialView :key="normalAddFormKeyCount" ref="materialView" />
    <RejectForm ref="rejectForm" @finished="() => search()" />
  </div>
</template>

<script>
import MaterialView from '@/views/material-management/library/module/NormalAddForm'
import { requestApplyPageList } from '@/api/procurementModuleManagement'
import { getBuyRequirement } from '@/api/routineMaterial'
import AskPriceForm from './AskPriceForm'
import OfferPriceForm from './OfferPriceForm'
import ApplyView from '../apply/AddForm'
import RejectForm from './RejectForm'
export default {
  props: ['queryParam'],
  components: {
    AskPriceForm,
    OfferPriceForm,
    ApplyView,
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
    columns() {
      const baseColumns = [
        {
          title: '序号',
          scopedSlots: { customRender: 'order' },
          width: 80
        },
        {
          title: '采购需求单号',
          dataIndex: 'requestApplyNum'
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
          title: '关联单号',
          dataIndex: 'relatedNum'
        },
        {
          title: '紧急程度',
          dataIndex: 'urgencyDegree',
          scopedSlots: { customRender: 'urgencyDegree' },
          width: 120
        },
        {
          title: '需求数量',
          dataIndex: 'requestNum',
          scopedSlots: { customRender: 'requestNum' }
        },
        {
          title: '需求日期',
          dataIndex: 'requestTime'
        },
        {
          title: '申请人',
          dataIndex: 'proposerName',
          scopedSlots: { customRender: 'proposerName' },
          width: 200
        },
        {
          title: '申请原因',
          dataIndex: 'reason',
          scopedSlots: { customRender: 'reason' },
          width: 200
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' },
          width: 200
        }
      ]

      const m = {
        1: [
          ...baseColumns,
          {
            title: '制单人',
            dataIndex: 'createdName'
          },
          {
            title: '制单时间',
            dataIndex: 'createdTime'
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'action' },
            fixed: 'right'
          }
        ],
        2: [
          ...baseColumns,
          {
            title: '领单部门',
            dataIndex: 'receiveDepName'
          },
          {
            title: '领单时间',
            dataIndex: 'receiveTime'
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'action' },
            fixed: 'right'
          }
        ]
      }
      return m[this.$attrs.tagKey]
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
      requestApplyPageList(_searchParam)
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
    doAction(type, record) {
      const that = this
      if (type === 'view') {
        that.$refs.applyView.query('view', record)
      } else if (type === 'ask') {
        that.$refs.askPriceForm.query(record)
      } else if (type === 'offer') {
        let source = +that.$attrs.tagKey
        that.$refs.offerPriceForm.query('add', { ...record, source })
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
      } else if (type === 'reject') {
        that.$refs.rejectForm.query({ requestId: record.id })
        return
      }
    }
  }
}
</script>

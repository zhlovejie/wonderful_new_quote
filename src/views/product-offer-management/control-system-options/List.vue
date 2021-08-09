<template>
  <a-card
    :bordered="false"
    class="product-offer-management-control-system-options"
  >

    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            placeholder="中控系统名称模糊查询"
            v-model="queryParam.configName"
            allowClear
            style="width: 250px"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            icon="search"
            @click="search({ current: 1 })"
          >查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click="doAction('export', null)"
          >导出</a-button>
        </a-form-item>

        <a-form-item style="float:right;">
          <a-button
            type="primary"
            @click="doAction('add', null)"
          >新增</a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <div
        slot="order"
        slot-scope="text, record, index"
      >
        <span>{{ index + 1 }}</span>
      </div>
      <div
        slot="price"
        slot-scope="text, record, index"
      >
        <span v-if="String(text) === '-1'">***</span>
        <span v-else>{{ text | moneyFormatNumber }}</span>
      </div>

      <div
        slot="action"
        slot-scope="text, record, index"
      >
        <a
          type="primary"
          @click="doAction('view',record)"
        >查看</a>
        <a-divider type="vertical" />
        <a
          type="primary"
          @click="doAction('edit',record)"
        >修改</a>
        <a-divider type="vertical" />
        <a
          type="primary"
          @click="doAction('record',record)"
        >修改记录</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="是否要删除此行？"
          @confirm="doAction('del',record)"
        >
          <a>删除</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a
          type="primary"
          @click="doAction('price',record)"
        >核价</a>

      </div>

    </a-table>

    <AddForm
      ref="addForm"
      @finish="finishHandler"
    />
    <PriceForm
      ref="priceForm"
      @finish="finishHandler"
    />

  </a-card>
</template>

<script>
import {
  priceQuotedZktListAddOrUpdate,
  priceQuotedZktDelete,
  priceQuotedZktDetail,
  priceQuotedZktList,
  priceQuotedZktPageList,
  priceQuotedZktSetPrice
} from '@/api/productOfferManagement'

import AddForm from './AddForm.vue'
import PriceForm from './PriceForm'

const columns = [
  {
    align: 'center',
    title: '序号',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '中控系统名称',
    dataIndex: 'configName'
  },
  {
    align: 'center',
    title: '标配成本价',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark'
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'product-offer-management-control-system-options',
  components: {
    AddForm,
    PriceForm
  },
  data() {
    return {
      // 表头
      columns,
      dataSource: [],

      loading: false,
      queryParam: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'product-offer-management-control-system-options') {
          this.init()
        }
      },
      immediate: true
    }
  },
  computed: {},
  methods: {
    init() {
      this.search()
    },
    search(params = {}) {
      const that = this
      that.loading = true
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const _searchParam = Object.assign({}, { ...that.queryParam },paginationParam, params)
      priceQuotedZktPageList(_searchParam)
        .then(res => {
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
        })
        .catch(err => {
          console.error(err)
          that.loading = false
        })
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    async doAction(type, record) {
      const that = this
      if (['add', 'edit', 'view'].includes(type)) {
        that.$refs.addForm.query(type, { ...record })
      } else if (type === 'del') {
        priceQuotedZktDelete({ id: record.id }).then(res => {
          that.$message.info(res.msg)
          if (+res.code === 200) {
            that.finishHandler()
          }
        })
      } else if (type === 'price') {
        that.$refs.priceForm.query({ ...record })
      } else if (type === 'record' || type === 'export') {
        that.$message.info('该功能正在开发中...')
      }
    },
    finishHandler(param) {
      const that = this
      that.$nextTick(() => {
        that.search()
      })
    }
  }
}
</script>

<style scoped>
</style>


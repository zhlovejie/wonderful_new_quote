<template>
  <!-- 产品价格系数 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-button
        class="a-button"
        style="float:right;"
        type="primary"
        icon="plus"
        @click="doAction('add',null)"
      >新增</a-button>
    </div>
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
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('edit',record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该条数据吗?" @confirm="() => doAction('del',record)">
            <a type="primary" href="javascript:;">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction()" />
  </div>
</template>
<script>
import {
  productPriceCoefficientAddAndUpdate,
  productPriceCoefficientDelete,
  productPriceCoefficientDetail,
  productPriceCoefficientListWithoutPage,
  productPriceCoefficientList
} from '@/api/workBox'

import AddForm from './AddForm'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'name'
  },
  {
    align: 'center',
    title: '系数',
    dataIndex: 'coefficient'
  },
  {
    align: 'center',
    title: '税率',
    dataIndex: 'tax'
  },
  {
    align: 'center',
    title: 'A类价格系数',
    dataIndex: 'apriceCoefficient'
  },
  {
    align: 'center',
    title: 'B类价格系数',
    dataIndex: 'bpriceCoefficient'
  },
  {
    align: 'center',
    title: 'C类价格系数',
    dataIndex: 'cpriceCoefficient'
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
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'productPriceCoefficient',
  components: {
    AddForm: AddForm
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1
      },
      loading: false
    }
  },
  computed: {
    searchParam() {
      return {}
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'productPriceCoefficient') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {}, {
        searchStatus: that.activeKey
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      productPriceCoefficientList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch(err => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    doAction(type, record) {
      let that = this
      if (type === 'del') {
        productPriceCoefficientDelete({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
        return
      }
      this.$refs.addForm.query(type, record)
    }
  }
}
</script>
<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
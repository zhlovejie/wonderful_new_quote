<template>
  <a-card
    :bordered="false"
    class="product-offer-management-product-options-management"
  >

    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-input
            placeholder="产品名称模糊查询"
            v-model="queryParam.productName"
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
            @click="doAction('add', {})"
          >新增</a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
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
    <StepView ref="stepView" />
    <ChangeRecords ref="changeRecords" />
  </a-card>
</template>

<script>
import {
  priceQuotedZktDetail,
  priceQuotedItemConfigSubList,
  priceQuotedItemConfigTreeList
} from '@/api/productOfferManagement'

import {
  priceQuotedProductAddOrUpdate,
  priceQuotedProductDelete,
  priceQuotedProductDetail,
  priceQuotedProductList,
  priceQuotedProductSetPrice
} from '@/api/productOfferManagement'

import AddForm from './AddForm.vue'
import PriceForm from './PriceForm'
import StepView from './StepView'
import ChangeRecords from './ChangeRecords'
const columns = [
  {
    align: 'center',
    title: '序号',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '产品系列',
    dataIndex: 'productSeries'
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName'
  },
  {
    align: 'center',
    title: '产品类型',
    dataIndex: 'productTypeConfigName'
  },
  {
    align: 'center',
    title: '标配成本价',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
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
  name: 'product-offer-management-product-options-management',
  components: {
    AddForm,
    PriceForm,
    StepView,
    ChangeRecords
  },
  data() {
    return {
      // 表头
      columns,
      dataSource: [],

      loading: false,
      queryParam: {},

      // step3,step4 数据源
      optionsList: [],
      treeData: [],
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'product-offer-management-product-options-management') {
          this.init()
        }
      },
      immediate: true
    }
  },
  computed: {},
  methods: {
    init() {
      const that = this
      that.search()
    },
    search(params = {}) {
      const that = this
      that.loading = true
      const _searchParam = Object.assign({}, { ...that.queryParam }, params)
      priceQuotedProductList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch(err => {
          console.error(err)
          that.loading = false
        })
    },
    async doAction(type, record) {
      const that = this
      if (['add', 'edit'].includes(type)) {
        that.$refs.addForm.query(type, { ...record })
        return
      }else if (['view'].includes(type)) {
        that.$refs.stepView.query(type, { ...record })
        return
      }
      else if (type === 'del') {
        priceQuotedProductDelete({ id: record.id }).then(res => {
          that.$message.info(res.msg)
          if (+res.code === 200) {
            that.finishHandler()
          }
        })
      } else if (type === 'price') {
        that.$refs.priceForm.query({ ...record })
      } else if (type === 'record') {
        that.$refs.changeRecords.query({ id:record.id })
      } else if (type === 'export') {
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


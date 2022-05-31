<template>
  <!-- 提货单 -->
  <div class="wdf-custom-wrapper" id="agency-contract-wrapper">
    <div>
      <a-button-group>
        <a-button type="primary" :class="{ currentsearchType: searchType === 1 }" @click="simpleSearch(1)"
          >今天</a-button
        >
        <a-button type="primary" :class="{ currentsearchType: searchType === 2 }" @click="simpleSearch(2)"
          >本周</a-button
        >
        <a-button type="primary" :class="{ currentsearchType: searchType === 3 }" @click="simpleSearch(3)"
          >本月</a-button
        >
        <a-button type="primary" :class="{ currentsearchType: searchType === 4 }" @click="simpleSearch(4)"
          >全部</a-button
        >
      </a-button-group>
      <a-button
        class="a-button"
        style="margin-bottom: 20px; margin-left: 10px"
        type="primary"
        icon="search"
        @click="openSearchModel"
        >高级筛选</a-button
      >
    </div>

    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="待提货" key="0" />
        <a-tab-pane tab="已提货" key="1" />
      </a-tabs>
      <a-table
        rowKey="id"
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
          <a type="primary" @click="doAction('view', record)">查看</a>
        </div>
        <!-- 原料出库产品表  开始 -->
        <a-table
          slot="expandedRowRender"
          slot-scope="record"
          :columns="innerColumns"
          :dataSource="record.pickUpMaterialList"
          :pagination="false"
          size="small"
        >
          <div slot="order" slot-scope="text, record, index">
            {{ index + 1 }}
          </div>
          <!-- 属性（1原材料 2模具 3成品） -->
          <div slot="attribute" slot-scope="text">
            {{{ 1: '原材料', 2: '模具', 3:'成品' }[text] || '未知'}}
          </div>
        </a-table>
        <!-- 原料出库产品表  结束 -->
      </a-table>
    </div>
    <AddForm ref="addForm" @ok="() => searchAction()" />
    <SearchForm ref="searchForm" @change="paramChangeHandler" />
  </div>
</template>

<script>
import {
  takePageList //提货单-列表
} from '@/api/material'
import SearchForm from './GiveSearchForm'
import AddForm from './TakeAddForm'

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '日期',
    dataIndex: 'createdDate'
  },
  {
    title: '提货单号',
    dataIndex: 'pickUpNo'
  },
  {
    title: '委外加工单号',
    dataIndex: 'orderNo'
  },
  {
    title: '加工商名称',
    dataIndex: 'facName'
  },
  {
    title: '预计提货日期',
    dataIndex: 'pickUpTime'
  },
  {
    title: '状态',
    dataIndex: 'statusText'
  },
  {
    title: '提交人',
    dataIndex: 'createdName'
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const innerColumns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '属性',
    dataIndex: 'attribute', //属性（1原材料 2模具 3成品）
    scopedSlots: { customRender: 'attribute' }
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '规格型号',
    dataIndex: 'specification'
  },
  {
    title: '使用计量单位',
    dataIndex: 'subUnit'
  },
  {
    title: '提货数量',
    dataIndex: 'exWarehouseNum'
  }
]

export default {
  name: 'Distribution_delivery_take',
  components: {
    AddForm,
    SearchForm
  },
  data() {
    return {
      activeKey: 0,
      dataSource: [], //提货单列表
      columns,
      innerColumns,
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      loading: false,
      searchType: 1, //查询周期类型：1、今日 2、本周 3、本月 4、全部")
      searchParam: {},
      userInfo: this.$store.getters.userInfo //当前登录人
    }
  },
  watch: {
    $route: {
      handler: function(to) {
        if (to.name === 'distribution_delivery_take') {
          this.searchAction()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.searchAction()
  },
  methods: {
    //高级筛选打开 派送单和提货单复用 1:派送单 2:提货单
    openSearchModel() {
      this.$refs.searchForm.query(2)
    },
    //高级筛选返回数据
    paramChangeHandler(params) {
      this.searchParam = params
      this.searchAction()
    },
    //简单筛选-今天/本周/本月/全部
    simpleSearch(type) {
      this.searchType = type
      this.searchAction()
    },
    // 查询-提货单列表
    searchAction(opt = {}) {
      let that = this
      const paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      const _searchParam = Object.assign(
        {},
        { ...this.searchParam, searchType: this.searchType, status: this.activeKey },
        paginationParam,
        opt
      )
      this.loading = true
      takePageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.createdDate = item.createdTime.slice(0,10)//日期截取创建时间年月日
            // 单据状态（0 待提货 1已提货）
            item.statusText = { 0: '待提货', 1: '已提货' }[item.status] || '未知'
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.searchAction()
          }
        })
        .catch(() => (that.loading = false))
    },
    //列表-分页、排序、筛选变化时触发
    handleTableChange(pagination) {
      const pager = pagination
      if (+pager.pageSize !== +pager._prePageSize) {
        pager.current = 1
        pager._prePageSize = +pager.pageSize
      }
      this.pagination = { ...this.pagination, ...pager }
      this.searchAction()
    },
    //列表操作-查看
    doAction(actionType, record) {
      this.$refs.addForm.query(actionType, record || {})
    },
    //选项卡切换，并刷新数据
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchAction({ current: 1 })
    }
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 24px;
}
.currentsearchType {
  opacity: 0.7;
}
</style>

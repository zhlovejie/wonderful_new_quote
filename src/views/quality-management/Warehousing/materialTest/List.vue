<template>
  <!-- 出库原料质检 -->
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
        <a-tab-pane tab="待处理" key="0" />
        <a-tab-pane tab="已完结" key="1" />
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
        <!-- 操作按钮：查看详情/删除
        查看详情：各种状态均可查看详情
        删除：待处理 且 当前登录人为创建人 -->
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a type="primary" @click="doAction('view', record)">查看</a>
          <template v-if="[0].includes(+record.status) && +userInfo.id === +record.createdId">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('del', record)">删除</a>
          </template>
          <template v-if="+record.status === 0">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('over', record)">处理</a>
          </template>
          <template v-if="+record.status === 1">
            <a-divider type="vertical" />
            <a type="primary" v-download="record.wordUrl">下载凭证</a>
          </template>
        </div>
        <!-- 原料出库产品表  开始 -->
        <a-table
          slot="expandedRowRender"
          slot-scope="record"
          :columns="innerColumns"
          :dataSource="record.materialList"
          :pagination="false"
          size="small"
        >
          <div slot="order" slot-scope="text, record, index">
            {{ index + 1 }}
          </div>
          <!-- 属性（1原材料 2模具） -->
          <div slot="attribute" slot-scope="text">
            {{ text == 1 ? '原材料' : '模具' }}
          </div>
          <!-- 原料送取(1:委托方送货,2:加工商提货)） -->
          <div slot="sendType" slot-scope="text">
            {{ text == 1 ? '委托方送货' : '加工商提货' }}
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
  materialTestPageList, //出库原料质检-列表
  materialTestDelete //出库原料质检-删除
} from '@/api/material'
import SearchForm from './SearchForm'
import AddForm from './AddForm'

const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    title: '检验单号',
    dataIndex: 'inspectionNo'
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
    title: '报检人',
    dataIndex: 'createdName'
  },
  {
    title: '报检时间',
    dataIndex: 'createdTime'
  },
  {
    title: '质检员',
    dataIndex: 'inspectionUserName'
  },
  {
    title: '单据状态',
    dataIndex: 'statusText'
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
    dataIndex: 'attribute', //属性（1原材料 2模具）
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
    title: '出库数量',
    dataIndex: 'exWarehouseNum'
  },
  {
    title: '原料送取',
    dataIndex: 'sendType', //原料送取(1:委托方送货,2:加工商提货)
    scopedSlots: { customRender: 'sendType' }
  }
]

export default {
  name: 'quality-management_Warehousing_material_test',
  components: {
    AddForm,
    SearchForm
  },
  data() {
    return {
      activeKey: 0,
      dataSource: [], //出库原料质检列表
      columns,
      innerColumns,
      pagination: {
        //分页加载
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
        if (to.name === 'quality-management_Warehousing_material_first') {
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
    //高级筛选打开
    openSearchModel() {
      this.$refs.searchForm.query(this.contractState)
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
    // 查询-出库原料质检列表
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
      materialTestPageList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            // 单据状态（0 待处理 1已处理）
            item.statusText = { 0: '待处理', 1: '已处理' }[item.status] || '未知'
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
    //列表操作-查看/删除
    doAction(actionType, record) {
      let that = this
      if (actionType === 'del') {
        materialTestDelete({ id: record.id })
          .then(res => {
            that.$message.info(res.msg)
            that.searchAction()
          })
          .catch(err => {
            that.$message.info(`错误：${err.message}`)
          })
      } else {
        that.$refs.addForm.query(actionType, record || {})
      }
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

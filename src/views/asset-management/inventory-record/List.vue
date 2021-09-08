<template>
  <!-- 资产盘点记录 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-month-picker placeholder="选择年月" style="width: 160px" v-model="searchParam.beginTime" />
      <span>~</span>
      <a-month-picker placeholder="选择年月" style="width: 160px" v-model="searchParam.endTime" />
      <a-input placeholder="资产名称" v-model="searchParam.name" :allowClear="true" style="width: 160px" />
      <a-input placeholder="资产代码" v-model="searchParam.code" :allowClear="true" style="width: 160px" />
      <a-input placeholder="使用人" v-model="searchParam.userName" :allowClear="true" style="width: 160px" />
      <a-select placeholder="选择资产类型" v-model="searchParam.typeDicId" :allowClear="true" style="width: 160px">
        <a-select-option v-for="item in assetTypeList" :key="item.id" :value="item.id">{{ item.text }}</a-select-option>
      </a-select>

      <a-select placeholder="选择资产状态" v-model="searchParam.infoStatus" :allowClear="true" style="width: 160px">
        <a-select-option :value="1">入库</a-select-option>
        <a-select-option :value="2">使用中</a-select-option>
        <a-select-option :value="3">报修中</a-select-option>
        <a-select-option :value="4">报废</a-select-option>
        <a-select-option :value="5">缺失</a-select-option>
      </a-select>
      <a-select placeholder="选择盘点状态" v-model="searchParam.status" :allowClear="true" style="width: 160px">
        <a-select-option :value="1">正常</a-select-option>
        <a-select-option :value="2">待盘点</a-select-option>
        <a-select-option :value="3">缺失</a-select-option>
      </a-select>
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
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
        <div slot="beginTime" slot-scope="text, record, index">
          <span>{{ record.beginTime }}~{{ record.endTime }}</span>
        </div>

        <div slot="beyondType" slot-scope="text, record, index">
          {{ { 1: '个人', 2: '部门', 3: '资产库' }[text] || '未知' }}
        </div>

        <div slot="infoStatus" slot-scope="text, record, index">
          {{ { 1: '入库', 2: '使用中', 3: '报修中', 4: '报废', 5: '缺失' }[text] || '未知' }}
        </div>
        <div slot="status" slot-scope="text, record, index">
          <template v-if="+text === 2">
            <a-popconfirm title="是否要执行缺失操作？" @confirm="doAction('miss', record)">
              <a type="primary">待盘点</a>
            </a-popconfirm>
          </template>
          <template v-else>
            {{ { 1: '正常', 2: '待盘点', 3: '缺失' }[text] || '未知' }}
          </template>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  oaAssertsInfoInventory,
  oaAssertsInfoInventoryList,
  oaAssertsInfoInventoryMissing,
} from '@/api/assetManagement'
import { getDictionaryList } from '@/api/workBox'
import moment from 'moment'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '日期',
    dataIndex: 'beginTime',
    scopedSlots: { customRender: 'beginTime' },
  },
  {
    align: 'center',
    title: '资产类别',
    dataIndex: 'typeDicName',
  },
  {
    align: 'center',
    title: '资产名称',
    dataIndex: 'name',
  },
  {
    align: 'center',
    title: '资产编码',
    dataIndex: 'code',
  },
  {
    align: 'center',
    title: '资产归属',
    dataIndex: 'beyondType',
    scopedSlots: { customRender: 'beyondType' },
  },
  {
    align: 'center',
    title: '资产状态',
    dataIndex: 'infoStatus',
    scopedSlots: { customRender: 'infoStatus' },
  },
  {
    align: 'center',
    title: '使用人',
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '领取时间',
    dataIndex: 'receiveTime',
  },
  {
    align: 'center',
    title: '盘点时间',
    dataIndex: 'inventoryTime',
  },
  {
    align: 'center',
    title: '盘点状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
]

export default {
  name: 'replenishment-oil',
  components: {},
  data() {
    return {
      columns: columns,
      dataSource: [],
      assetTypeList: [],
      pagination: {
        current: 1,
      },
      searchParam: {},
      loading: false,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'replenishment-oil') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {
      let that = this
      let task1 = getDictionaryList({ parentId: 532 }).then((res) => (that.assetTypeList = res.data))
      that.searchAction()
    },
    searchAction(opt = {}) {
      let that = this

      let _beginTime = this.searchParam.beginTime
      _beginTime = _beginTime instanceof moment ? _beginTime.format('YYYY-MM-DD') : undefined
      let _endTime = this.searchParam.endTime
      _endTime = _endTime instanceof moment ? _endTime.format('YYYY-MM-DD') : undefined

      let _searchParam = Object.assign(
        {},
        { ...this.searchParam },
        { beginTime: _beginTime, endTime: _endTime },
        { ...this.pagination },
        opt
      )
      console.log('执行搜索...', _searchParam)
      that.loading = true
      oaAssertsInfoInventoryList(_searchParam)
        .then((res) => {
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
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({ current: pagination.current })
    },
    doAction(type, record) {
      let that = this
      if (type === 'miss') {
        oaAssertsInfoInventoryMissing({ id: record.id }).then((res) => {
          console.log(res)
          that.$message.info(res.msg)
          if (res.code === 200) {
            that.searchAction()
          }
        })
      }
    },
  },
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.wdf-custom-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>

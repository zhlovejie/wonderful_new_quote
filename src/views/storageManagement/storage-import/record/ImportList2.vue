<template>
  <!-- 入库单 -->
  <div class="wdf-custom-wrapper" id="stock_management_import_record">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-select v-model="searchParam.warehouseId" placeholder="入库仓库" style="width: 150px" :allowClear="true">
            <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">{{
              item.warehouseName
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-select placeholder="入库类型" v-model="searchParam.type" style="width: 150px" :allowClear="true">
            <a-select-option :value="1">赠送入库</a-select-option>
            <a-select-option :value="2">产成品返修入库</a-select-option>
            <a-select-option :value="3">安装不良品入库</a-select-option>
            <a-select-option :value="4">退货入库</a-select-option>
            <a-select-option :value="5">采购入库</a-select-option>
            <a-select-option :value="6">委外入库</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-input placeholder="单号模糊搜索" v-model="searchParam.storageCode" style="width: 180px" />
        </a-form-item>

        <!-- <a-form-item>
          <a-select placeholder="紧急程度" v-model="searchParam.urgentType" style="width: 150px" :allowClear="true">
            <a-select-option :value="1">一般</a-select-option>
            <a-select-option :value="2">紧急</a-select-option>
            <a-select-option :value="3">特急</a-select-option>
          </a-select>
        </a-form-item> -->

        <a-form-item>
          <a-select
            placeholder="选择物料"
            v-model="searchParam.materialId"
            style="width: 250px"
            :allowClear="true"
            show-search
            option-filter-prop="children"
            :filter-option="filterOption"
          >
            <a-select-option v-for="val in storageMaterialList" :key="val.materialId" :value="val.materialId">{{
              `${val.materialName}(${val.materialCode})`
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <!-- <a-form-item>
          <a-select placeholder="入库策略" v-model="searchParam.aaa" style="width: 150px" :allowClear="true">
            <a-select-option :value="1">单品策略</a-select-option>
            <a-select-option :value="2">同品策略</a-select-option>
          </a-select>
        </a-form-item> -->

        <!-- <a-form-item>
          <a-range-picker style="width:220px;" v-model="searchParam.date" />
        </a-form-item> -->

        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <h3>未入库单据：{{ countInfo.singleNum || 0 }} &nbsp;&nbsp;未入库数：{{ countInfo.notNum || 0 }}</h3>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :scroll="{ x: 2000 }"
        :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>

        <div slot="materialName" slot-scope="text, record">
          <span>{{ text }}</span>
        </div>

        <div slot="storageNum" slot-scope="text, record, index">
          <span>{{ record.actualNum - record.notNum }}</span>
        </div>
        <div slot="specification" slot-scope="text">
          <a-tooltip v-if="String(text).length > 5">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 5) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- { 1: '待审批', 2: '通过', 3: '不通过', 4: '撤回' } -->
          <a type="primary" @click="doAction('ruku', record)">入库</a>
          <a-divider type="vertical" />
          <a type="primary" @click="doAction('record', record)">入库记录</a>
          <template v-if="[1, 2, 3, 4].includes(+record.type)">
            <a-divider type="vertical" />
            <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('withdraw', record)">
              <a type="primary" href="javascript:;">撤回</a>
            </a-popconfirm>
          </template>
        </div>

        <template slot="footer">
          <a-button type="primary" :disabled="selectedRows.length < 2" @click="doAction('batch', {})"
            >批量入库</a-button
          >
        </template>
      </a-table>
    </div>
    <ApproveInfo ref="approveInfoCard" />
    <!-- <CustomerInfo ref="customerInfoCard" /> -->
    <AddForm ref="addForm" @ok="() => searchAction()" />
    <Records ref="records" />
  </div>
</template>

<script>
import {
  storageMaterialList1,
  getWarehouseList,
  storagePageList,
  storageRevocation2,
  storageStatistics,
} from '@/api/storage_wzz'
import AddForm from './AddForm'
import Records from './Records'
import moment from 'moment'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
const columns = [
  {
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '日期',
    dataIndex: 'storageDate',
  },
  {
    title: '入库单号',
    dataIndex: 'storageCode',
  },
  // {
  //   title: '入库仓库',
  //   dataIndex: 'warehouseName',
  // },
  {
    title: '入库类型',
    dataIndex: 'storageTypeText',
  },
  {
    title: '紧急程度',
    dataIndex: 'urgentTypeText',
  },
  {
    title: '物料代码',
    dataIndex: 'materialCode',
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    scopedSlots: { customRender: 'materialName' },
  },
  {
    title: '规格型号',
    dataIndex: 'specification',
    scopedSlots: { customRender: 'specification' },
  },
  {
    title: '应入库数量',
    dataIndex: 'actualNum',
  },
  {
    title: '实际入库数量',
    dataIndex: 'storageNum',
    scopedSlots: { customRender: 'storageNum' },
  },
  {
    title: '未入库数量',
    dataIndex: 'notNum',
  },
  {
    title: '产品重量',
    dataIndex: 'weight',
  },
  {
    title: '检验员',
    dataIndex: 'inspectionUserName',
  },
  {
    title: '检验时间',
    dataIndex: 'inspectionDate',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'stock_management_import_record_2',
  components: {
    AddForm,
    ApproveInfo,
    Records,
  },
  data() {
    return {
      columns: columns,
      dataSource: [],
      countInfo: {},
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      searchParam: {
        status: 0,
      },
      activeKey: 1,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      storageMaterialList: [],
      warehouseList: [],
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  watch: {
    $route: {
      handler: function (to) {
        if (to.name === 'stock_management_import_record') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    moment,
    init() {
      let that = this
      that.searchParam = { ...that.searchParam, searchStatus: that.activeKey }
      let queue = []
      let task1 = storageMaterialList1().then((res) => (that.storageMaterialList = res.data))
      queue.push(task1)
      let task2 = getWarehouseList().then((res) => (this.warehouseList = res.data))
      queue.push(task2)
      that.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt = {}) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      const date = that.searchParam.date
      if (Array.isArray(date) && date.length === 2) {
        that.searchParam = {
          ...that.searchParam,
          startDate: date[0].format('YYYY-MM-DD'),
          endDate: date[1].format('YYYY-MM-DD'),
        }
      } else {
        that.searchParam = {
          ...that.searchParam,
          startDate: undefined,
          endDate: undefined,
        }
      }

      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      storagePageList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.statusText = { 1: '待审批', 2: '通过', 3: '不通过', 4: '撤回' }[item.status] || '未知'
            item.storageTypeText =
              { 1: '赠送入库', 2: '产品返修入库', 3: '安装不良品入库', 4: '退货入库', 5: '采购入库', 6: '委外入库' }[
                item.type
              ] || '未知'
            item.urgentTypeText = { 1: '一般', 2: '紧急', 3: '特急' }[item.urgentType] || '未知'
            return item
          })

          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.searchAction()
          }
        })
        .catch((err) => (that.loading = false))

      storageStatistics({ status: 0 }).then((res) => {
        const { alreadyNum, notNum, singleNum } = res.data
        that.countInfo = {
          alreadyNum,
          notNum,
          singleNum,
        }
      })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if (+pager.pageSize !== +pager._prePageSize) {
        //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = { ...this.pagination, ...pager }
      this.searchAction()
    },
    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    doAction(actionType, record) {
      let that = this
      if (actionType === 'ruku') {
        that.$refs.addForm.query('add', [record])
        return
      } else if (actionType === 'record') {
        that.$refs.records.query('view', [record])
        return
      } else if (actionType === 'batch') {
        let hasDiffMaterialCode = [...new Set(that.selectedRows.map((item) => item.materialCode))]
        if (hasDiffMaterialCode.length > 1) {
          that.$message.info(`物料代码不一致,禁止操作`)
          return
        }
        that.$refs.addForm.query('add', [...that.selectedRows])
      } else if (actionType === 'withdraw') {
        storageRevocation2({ id: record.id, type: record.type })
          .then((res) => {
            that.$message.info(res.msg)
            if (+res.code === 200) {
              this.searchAction()
            }
          })
          .catch((err) => {
            that.$message.error(err.message)
          })
        return
      }
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
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

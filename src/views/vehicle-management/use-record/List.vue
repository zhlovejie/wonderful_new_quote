<template>
  <a-card :bordered="false">
    <div class="top-ation">
      <a-form layout="inline" :form="form">
        <a-form-item>
          <a-button-group>
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 1 }" @click="simpleSearch(1)"
              >今天</a-button
            >
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 2 }" @click="simpleSearch(2)"
              >本周</a-button
            >
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 0 }" @click="simpleSearch(0)"
              >全部</a-button
            >
          </a-button-group>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="openSearchModel">高级筛选</a-button>
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
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>

      <div slot="driverMode" slot-scope="text, record, index">
        <span>{{ { 1: '自驾', 2: '司机' }[text] }}</span>
      </div>

      <div slot="status" slot-scope="text, record, index">
        <a href="javascript:void(0);" @click="approvalPreview(record)">{{
          { 1: '待审批', 2: '完结', 3: '不通过', 4: '已撤回', 5: '待出车', 6: '待回车' }[text] || '未知'
        }}</a>
      </div>

      <div slot="action" slot-scope="text, record, index">
        <a type="primary" @click="doAction('view', record)">查看</a>
        <!-- <a-divider type="vertical" />
        <a type="primary" @click="doAction('view-map',record)">轨迹查看</a> -->
      </div>
    </a-table>
    <ApproveInfo ref="approveInfoCard" />
    <SearchForm ref="searchForm" @change="paramChangeHandler" />
    <AddForm ref="addForm" />
  </a-card>
</template>

<script>
import { carUsePageList } from '@/api/vehicleManagement'
import AddForm from './AddForm'
import SearchForm from './SearchForm'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    dataIndex: 'order',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '车牌号',
    dataIndex: 'carCode',
  },
  {
    align: 'center',
    title: '驾车方式',
    dataIndex: 'driverMode',
    scopedSlots: { customRender: 'driverMode' },
  },
  {
    align: 'center',
    title: '司机',
    dataIndex: 'driverUserName',
  },
  {
    align: 'center',
    title: '用车时间',
    dataIndex: 'useTime',
  },
  {
    align: 'center',
    title: '返回时间',
    dataIndex: 'returnTime',
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '出车时间',
    dataIndex: 'outTime',
  },
  {
    align: 'center',
    title: '回车时间',
    dataIndex: 'backTime',
  },
  {
    align: 'center',
    title: '提交人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '提交时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'vehicle-management-use-record',
  components: {
    AddForm,
    SearchForm,
    ApproveInfo,
  },
  data() {
    return {
      columns,
      form: this.$form.createForm(this),
      // 查询参数
      queryParam: {
        dayWeekMonth: 1,
        searchStatus: 0,
      },
      dayWeekMonth: 1,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'vehicle-management-use-record') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.queryParam }, { ...that.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      carUsePageList(_searchParam)
        .then((res) => {
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
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },
    simpleSearch(type) {
      this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
      this.queryParam.dayWeekMonth = this.dayWeekMonth
      this.searchAction()
    },
    openSearchModel() {
      this.$refs.searchForm.query()
    },
    paramChangeHandler(params) {
      this.queryParam = { ...this.queryParam, ...params }
      this.searchAction()
    },
    doAction(type, record) {
      let that = this
      if (type === 'view') {
        this.$refs.addForm.query(type, record)
        return
      } else if (type === 'view-map') {
        that.$message.info('该功能正在开发中...')
        return
      }
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
  },
}
</script>

<style scoped>
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>

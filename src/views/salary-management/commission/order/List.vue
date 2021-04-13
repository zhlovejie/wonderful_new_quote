<template>
  <!-- 销售部订单提成分析表 -->
  <div class="container-list-wrapper">
    <div class="search-wrapper">
      <a-month-picker
        placeholder="选择年月"
        style="width:160px;"
        v-model="searchParam.staticsDate"
      />
      <a-select
        placeholder="选择部门"
        v-model="searchParam.departmentId"
        :allowClear="true"
        style="width: 160px"
      >
        <a-select-option
          v-for="item in depSelectDataSource"
          :key="item.id"
          :value="item.id"
        >{{item.departmentName}}</a-select-option>
      </a-select>

      <a-input
        placeholder="销售经理模糊查询"
        :allowClear="true"
        v-model="searchParam.userName"
        style="width: 160px"
      />

      <a-input
        placeholder="合同编号模糊查询"
        :allowClear="true"
        v-model="searchParam.contractNum"
        style="width: 160px"
      />

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
        <div slot="percentageAmount" slot-scope="text, record, index">
          <span>{{ text | moneyFormatNumber }}</span>
        </div>
        <div slot="staticsDate" slot-scope="text, record, index">
          <span>{{ text ? String(text).slice(0,10) : text }}</span>
        </div>

        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="$auth('salarySaleOrderPercentageAnalysys:detail')">
          <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
      <AddForm key="k1" ref="addForm" />
    </div>
  </div>
</template>
<script>

import {
  departmentList //所有部门
} from '@/api/systemSetting'
import moment from 'moment'
import {
  saleOrderPercentageAnalysysList
} from '@/api/commissionDetail'

import AddForm from './AddForm'

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
    title: '月份',
    dataIndex: 'staticsDate',
    scopedSlots: { customRender: 'staticsDate' }
  },
  {
    align: 'center',
    title: '合同编号',
    dataIndex: 'contractNum'
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '岗位',
    dataIndex: 'stationName',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'salerUserName'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'commission-order',
  components: {
    AddForm
  },
  data() {
    return {
      searchParam: {},
      columns: columns,
      dataSource: [],
      depSelectDataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'commission-order') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      departmentList().then(res => {
        that.depSelectDataSource = res.data
      })
      that.searchAction()
    },
    searchAction(opt) {
      let that = this

      if(!that.$auth('salarySaleOrderPercentageAnalysys:list')){
        that.$message.info('无权限查看此列表数据')
        return
      }
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }

      let staticsDate = that.searchParam.staticsDate
      let _searchParam = Object.assign({}, { ...that.searchParam }, paginationParam,{
        staticsDate : staticsDate instanceof moment ? staticsDate.format('YYYY-MM') : undefined
      })
      that.loading = true
      saleOrderPercentageAnalysysList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.effective = `${item.effectiveStart} ~ ${item.effectiveEnd}`
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
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.searchAction()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    doAction(type, record) {
      let that = this
      that.$refs.addForm.query(type, record)
    }
  }
}
</script>
<style scoped>
.container-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.container-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>

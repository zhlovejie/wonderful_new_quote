<template>
  <!-- 菜单记录 -->
  <div class="wdf-custom-list-wrapper">
    <div class="search-wrapper">
      <a-range-picker v-model="sDate" style="width:300px;" :allowClear="true" />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction({current:1})">查询</a-button>
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
        <div slot="weekDate" slot-scope="text, record, index">
          <span>{{ getWeekDayTxt(record.menuDate) }}</span>
        </div>
      </a-table>
    </div>
  </div>
</template>
<script>
import { canteenMenuRecord} from '@/api/canteenMenuManagement'
import moment from 'moment'
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
    title: '日期',
    dataIndex: 'menuDate'
  },
  {
    align: 'center',
    title: '星期',
    scopedSlots: { customRender: 'weekDate' }
  },
  {
    align: 'center',
    title: '菜单一',
    dataIndex: 'menuOne'
  },
  {
    align: 'center',
    title: '菜单二',
    dataIndex: 'menuTwo'
  },
  {
    align: 'center',
    title: '菜单三',
    dataIndex: 'menuThree'
  },
  {
    align: 'center',
    title: '菜单四',
    dataIndex: 'menuFour'
  },
]

export default {
  name: 'canteen-record-config',
  components: {
  },
  data() {
    return {
      sDate:[undefined,undefined],
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
      let that = this
      let startDate = undefined,endDate = undefined
      if(Array.isArray(that.sDate) && that.sDate.length === 2){
        startDate = that.sDate[0] instanceof moment ? that.sDate[0].format('YYYY-MM-DD') : undefined
        endDate = that.sDate[1] instanceof moment ?  that.sDate[1].format('YYYY-MM-DD') :undefined
      }
      return {
        startDate,
        endDate
      }
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'canteen-menu-management-record') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination }, opt || {}, {
        searchStatus: that.activeKey
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      canteenMenuRecord(_searchParam)
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
    getWeekDayTxt(dateStr){
      let weekMap = ["", "一", "二", "三", "四", "五", "六","日"];
      return `星期${weekMap[this.moment(dateStr).isoWeekday()]}`
    }
  }
}
</script>
<style scoped>
.wdf-custom-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.wdf-custom-list-wrapper .search-wrapper > * {
  margin-right: 10px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>

<!-- 1.药品物资管理 -->
<template>
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-input
        style="width:150px;"
        :allowClear="true"
        placeholder="设备名称"
        v-model="searchParam.equipmentName"
      />
      <a-input
        style="width:150px;"
        :allowClear="true"
        placeholder="药品名称"
        v-model="searchParam.medicineName"
      />
      <a-input
        style="width:150px;"
        :allowClear="true"
        placeholder="领取人"
        v-model="searchParam.receiver"
      />
      <a-range-picker
        style="width:220px;"
        :allowClear="true"
        v-model="sDate"
        @change="rangePickerChange"
      />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="order" slot-scope="text, record, index">{{ index + 1 }}</div>
      </a-table>
    </div>
  </div>
</template>
<script>
import { emergencyCabinetReceiveRecordList } from '@/api/contingencyManagement'

import moment from 'moment'
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
    title: '设备名称',
    dataIndex: 'equipmentName',
  },
  {
    align: 'center',
    title: '货道号',
    dataIndex: 'aisleNum',
  },
  {
    align: 'center',
    title: '药品名称',
    dataIndex: 'medicineName',
  },
  {
    align: 'center',
    title: '数量',
    dataIndex: 'quantity',
  },
  {
    align: 'center',
    title: '领取人部门',
    dataIndex: 'receiverDepName',
  },
  {
    align: 'center',
    title: '领取人',
    dataIndex: 'receiver',
  },
  {
    align: 'center',
    title: '手机号',
    dataIndex: 'receiverMobile',
  },
  {
    align: 'center',
    title: '领取时间',
    dataIndex: 'createdTime',
  },
]

export default {
  name: 'contingency-management-medicines-record',
  components: {},
  data() {
    return {
      sDate: [undefined, undefined],
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      searchParam: {},
      visible: false,
      bindEnterFn: null,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'contingency-management-medicines-record') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    that.bindEnterFn = (event) => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
    }
  },
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
  },
  methods: {
    moment,
    init() {
      let that = this
      this.searchAction()
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      emergencyCabinetReceiveRecordList(_searchParam)
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
    rangePickerChange(arrMoment, arrStrs) {
      if (Array.isArray(arrMoment)) {
        if (arrMoment.length === 2) {
          this.searchParam.startTime = arrMoment[0].format('YYYY-MM-DD')
          this.searchParam.endTime = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.searchParam.startTime = undefined
          this.searchParam.endTime = undefined
        }
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
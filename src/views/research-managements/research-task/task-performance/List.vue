<template>
  <!-- 任务绩效 -->
  <div class="record-new-list-wrapper">
    <div class="search-wrapper">
      <a-select placeholder="来源" v-model="taskSource" :allowClear="true" style="width: 170px; margin-right: 10px">
        <a-select-option :value="1">销售订单</a-select-option>
        <a-select-option :value="2">核价单</a-select-option>
      </a-select>
      <a-select
        placeholder="销售负责人"
        showSearch
        :filterOption="filterOption"
        v-model="salerId"
        :allowClear="true"
        style="width: 160px; margin-right: 10px"
      >
        <a-select-option v-for="item in personincharge" :key="item.id" :value="item.id">{{
          item.trueName
        }}</a-select-option>
      </a-select>
      <a-select
        placeholder="项目负责人"
        showSearch
        :filterOption="filterOption"
        v-model="chargeId"
        :allowClear="true"
        style="width: 160px; margin-right: 10px"
      >
        <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">{{
          item.trueName
        }}</a-select-option>
      </a-select>
      <a-input placeholder="任务编号" v-model="taskNum" allowClear style="width: 160px; margin-right: 10px" />
      <a-input placeholder="产品名称" v-model="productName" allowClear style="width: 160px; margin-right: 10px" />
      <a-input placeholder="项目描述" v-model="productDesc" allowClear style="width: 160px; margin-right: 10px" />
      <!-- <a-range-picker v-model="sDate" style="margin-right: 10px" /> -->
      <a-month-picker style="width: 160px; margin-right: 10px" placeholder="开始月份" v-model="startDate" />
      <a-month-picker style="width: 160px; margin-right: 10px" placeholder="结束月份" v-model="staticsDate" />

      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
      <a-button class="a-button" type="primary" style="margin-left: 10px" @click="Distribution()">配置</a-button>
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
        <div slot="taskSource" slot-scope="text, record, index">
          <span>{{ text === 1 ? '销售订单' : '核价单' }}</span>
        </div>
        <div slot="productDesc" slot-scope="text">
          <a-tooltip v-if="String(text).length > 10">
            <template slot="title">{{ text }}</template>
            {{ String(text).slice(0, 10) }}...
          </a-tooltip>
          <span v-else>{{ text }}</span>
        </div>
      </a-table>
    </div>
    <Appadd ref="appadd" />
  </div>
</template>
<script>
import {
  task_performancePageList,
  task_performancegetSalerIds,
  task_performancegetgetChargeIds,
} from '@/api/researchManagement'
import moment from 'moment'
import Appadd from './module/Appadd'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '日期',
    dataIndex: 'realFinishTime',
  },
  {
    align: 'center',
    title: '任务编号',
    dataIndex: 'taskNum',
  },
  {
    align: 'center',
    title: '来源',
    scopedSlots: { customRender: 'taskSource' },
  },
  {
    align: 'center',
    title: '销售负责人',
    dataIndex: 'salerName',
  },
  {
    align: 'center',
    title: '产品名称',
    dataIndex: 'productName',
  },
  {
    align: 'center',
    title: '项目描述',
    dataIndex: 'productDesc',
    scopedSlots: { customRender: 'productDesc' },
  },
  {
    align: 'center',
    title: '项目负责人',
    dataIndex: 'chargeName',
  },
  {
    align: 'center',
    title: '工作效率',
    dataIndex: 'workEfficiency',
  },
  {
    align: 'center',
    title: '完成度',
    dataIndex: 'finishScale',
  },
  {
    align: 'center',
    title: '难易系数',
    dataIndex: 'difficultDicText',
  },
  {
    align: 'center',
    title: '考勤时间',
    dataIndex: 'attenceTime',
  },
]

export default {
  name: 'researchtaskbonusshares',
  components: {
    Appadd,
  },
  data() {
    return {
      startDate: undefined,
      staticsDate: undefined,
      taskSource: undefined,
      productDesc: undefined,
      productName: undefined,
      chargeId: undefined,
      taskNum: undefined,
      salerId: undefined,
      personincharge: [],
      projectList: [],
      columns: columns,

      dataSource: [],
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      loading: false,
    }
  },
  computed: {
    searchParam() {
      return {
        taskNum: this.taskNum,
        productName: this.productName,
        productDesc: this.productDesc,
        taskSource: this.taskSource,
        chargeId: this.chargeId,
        startDate: this.startDate instanceof moment ? this.startDate.format('YYYY-MM') : undefined,
        endDate: this.staticsDate instanceof moment ? this.staticsDate.format('YYYY-MM') : undefined,
        salerId: this.salerId,
        current: 1,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'research-task-performance') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment: moment,
    init() {
      let that = this
      let queue = []
      let task1 = task_performancegetSalerIds({ status: 5 }).then((res) => (that.personincharge = res.data))
      let task2 = task_performancegetgetChargeIds().then((res) => {
        that.projectList = res.data
      })
      queue.push(task1)
      queue.push(task2)
      this.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination1 }, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      task_performancePageList(_searchParam)
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
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    //发放规则
    Distribution() {
      this.$refs.appadd.query()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style scoped>
.record-new-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>

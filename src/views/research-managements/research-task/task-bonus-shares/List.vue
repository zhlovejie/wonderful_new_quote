<template>
  <!-- 奖金分配 -->
  <div class="record-new-list-wrapper">
    <div class="search-wrapper">
      <a-select
        placeholder="选择部门"
        v-model="departmentId"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>
      <a-input placeholder="姓名" v-model="userName" allowClear style="width: 200px; margin-right: 10px" />
      <!-- <a-range-picker v-model="sDate" style="margin-right: 10px" /> -->
      <a-month-picker style="width: 200px; margin-right: 10px" placeholder="开始月份" v-model="startDate" />
      <a-month-picker style="width: 200px; margin-right: 10px" placeholder="结束月份" v-model="staticsDate" />
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction({ current: 1 })"
        >查询</a-button
      >
    </div>
    <div class="main-wrapper">
      <a-alert :message="searchTotalMoney" type="info" />
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
      </a-table>
    </div>
  </div>
</template>
<script>
import { task_bonus_sharesPageList, task_bonus_sharesPageSum } from '@/api/researchManagement'
import { bonus_getDepartmentByType } from '@/api/bonus_management'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '月份',
    dataIndex: 'month',
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '工作效率系数',
    dataIndex: 'workEfficiencyRetio',
  },
  {
    align: 'center',
    title: '难易度系数',
    dataIndex: 'difficultRetio',
  },
  {
    align: 'center',
    title: '完成度系数',
    dataIndex: 'finishRetio',
  },
  {
    align: 'center',
    title: '考勤时间系数',
    dataIndex: 'attenceRetio',
  },
  {
    align: 'center',
    title: '工作效率奖金',
    dataIndex: 'workEfficiencyBounsBigDecimal',
  },
  {
    align: 'center',
    title: '难易度奖金',
    dataIndex: 'difficultBounsBigDecimal',
  },
  {
    align: 'center',
    title: '完成度奖金',
    dataIndex: 'finishBounsBigDecimal',
  },
  {
    align: 'center',
    title: '考勤奖金',
    dataIndex: 'attenceBounsBigDecimal',
  },
  {
    align: 'center',
    title: '总奖金',
    dataIndex: 'allBounsBigDecimal',
  },
]

export default {
  name: 'researchtaskbonusshares',
  data() {
    return {
      startDate: undefined,
      staticsDate: undefined,
      depList: [],
      columns: columns,
      userName: undefined,
      departmentId: undefined,
      dataSource: [],
      searchTotalMoney: '',
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
        userName: this.userName,
        startDate: this.startDate instanceof moment ? this.startDate.format('YYYY-MM') : undefined,
        endDate: this.staticsDate instanceof moment ? this.staticsDate.format('YYYY-MM') : undefined,
        departmentId: this.departmentId,
        current: 1,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'research-task-bonus-shares') {
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
      let task1 = bonus_getDepartmentByType({ type: 2 }).then((res) => (that.depList = res.data))
      queue.push(task1)
      this.searchAction()
      return Promise.all(queue)
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination1 }, opt || {})
      console.log('执行搜索...', _searchParam)

      that.loading = true
      task_bonus_sharesPageList(_searchParam)
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
      task_bonus_sharesPageSum(_searchParam).then((res) => {
        console.log(that, res)
        if (+res.code !== 200) {
          let msg = `获取【汇总合计金额】接口出错，错误代码:${res.code} 错误消息：${res.msg}。`
          msg += `查询参数:${_searchParam}，`
          msg += '请与管理员联系，谢谢合作。'
          that.searchTotalMoney = 0
          that.$message.error(msg)
          return
        }
        that.searchTotalMoney = `本次搜索汇总合计金额：${that.$root._f('moneyFormatNumber')(res.data)}`
      })
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
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
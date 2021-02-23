<template>
  <!-- 工作餐统计 -->
  <div class="wdf-custom-wrapper" id="work-meals-statistics-list">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-button-group>
            <a-button
              type="primary"
              :class="{ currentDayWeekMonth: +searchParam.isToday === 2 }"
              @click="simpleSearch(2)"
              >今天</a-button
            >
            <a-button
              type="primary"
              :class="{ currentDayWeekMonth: +searchParam.isToday === 1 }"
              @click="simpleSearch(1)"
              >全部</a-button
            >
          </a-button-group>
        </a-form-item>
        <a-form-item>
          <a-input placeholder="员工名模糊查询" v-model="searchParam.trueName" allowClear style="width: 200px" />
        </a-form-item>
        <a-form-item v-if="activeKey === 1">
          <a-select placeholder="选择体温状态" v-model="searchParam.status" :allowClear="true" style="width: 200px">
            <a-select-option :value="1">正常体温</a-select-option>
            <a-select-option :value="2">为异常体温</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select placeholder="选择部门" v-model="searchParam.departmentId" :allowClear="true" style="width: 200px">
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="activeKey === 1">
          <a-range-picker v-model="sDate" @change="rangePickerChange" style="width: 220px" :allowClear="true" />
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction({ current: 1 })">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="有体温数据" key="1" />
        <a-tab-pane tab="没有测量体温数据" key="2" />
      </a-tabs>
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
        <div slot="status" slot-scope="text, record">
          {{ +text === 1 ? '正常体温' : +text === 2 ? '异常体温' : '未知' }}
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  departmentList, //所有部门
} from '@/api/systemSetting'
import { getTemperatureList } from '@/api/attendanceManagement'

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
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '员工名',
    dataIndex: 'trueName',
  },
  {
    align: 'center',
    title: '体温状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '体温',
    dataIndex: 'temperature',
  },

  {
    align: 'center',
    title: '创建日期',
    dataIndex: 'createdTime',
  },
]

export default {
  name: 'work-meals-statistics-list',
  components: {},
  data() {
    return {
      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
      searchParam: {
        isToday: 2,
        type: 1,
      },
      sDate: [undefined, undefined],
      activeKey: 1,
      depList: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      mealInfo: {},
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'attendance-body-temperature') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let that = this
    let ele = document.querySelector('#work-meals-statistics-list')
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
  methods: {
    init() {
      let that = this
      let queue = []
      let task1 = departmentList().then((res) => (that.depList = res.data))
      queue.push(task1)
      that.searchAction()
      return Promise.all(queue)
    },
    // initWorkLunchNum() {
    //   let that = this
    //   getWorkLunchNum(Object.assign({}, this.searchParam)).then((res) => {
    //     //console.log(res)
    //     that.mealInfo = res.data
    //   })
    // },
    simpleSearch(type) {
      this.searchParam = Object.assign({}, this.searchParam, { isToday: +type })
      this.searchAction()
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      this.searchParam.type = this.activeKey
      this.searchAction({ current: 1 })
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      //   that.initWorkLunchNum()
      getTemperatureList(_searchParam)
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
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('#work-meals-statistics-list')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
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
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>

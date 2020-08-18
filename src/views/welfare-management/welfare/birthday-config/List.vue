<template>
  <!-- 生日福利管理 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-button-group style="position: relative;top: -1px;">
        <a-button
          type="primary"
          :class="{currentDayWeekMonth:dayWeekMonth === 1}"
          @click="simpleSearch(1)"
        >今天</a-button>
        <a-button
          type="primary"
          :class="{currentDayWeekMonth:dayWeekMonth === 2}"
          @click="simpleSearch(2)"
        >本周</a-button>
        <a-button
          type="primary"
          :class="{currentDayWeekMonth:dayWeekMonth === 3}"
          @click="simpleSearch(3)"
        >本月</a-button>
        <a-button
          type="primary"
          :class="{currentDayWeekMonth:dayWeekMonth === 4}"
          @click="simpleSearch(4)"
        >全部</a-button>
      </a-button-group>

      <a-input style="width:150px;" placeholder="姓名模糊查询" v-model="userName" :allowClear="true"/>

      <a-select style="width:150px;" placeholder="领取状态" v-model="receiveStatus" :allowClear="true">
        <a-select-option :value="1">已领取</a-select-option>
        <a-select-option :value="2">未领取</a-select-option>
      </a-select>

      <a-range-picker v-model="sDate" style="width:280px;" />

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
        <div
          slot="receiveStatus"
          slot-scope="text, record, index"
        >{{ {1:'已领取',2:'未领取'}[text] || '未知' }}</div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <a-popconfirm
            v-if="record.receiveStatus === 2"
            title="确定执行领取操作？"
            @confirm="doAction('get',record)"
          >
            <a type="primary">领取</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep,
} from '@/api/systemSetting'
import { birthdayWelfareManagementList, birthdayWelfareManagementGetWelfare } from '@/api/welfareManagement'

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
    title: '年份',
    dataIndex: 'welfareYear',
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
    dataIndex: 'userName',
  },
  {
    align: 'center',
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    align: 'center',
    title: '生日',
    dataIndex: 'birthDate',
  },
  {
    align: 'center',
    title: '领取状态',
    dataIndex: 'receiveStatus',
    scopedSlots: { customRender: 'receiveStatus' },
  },
  {
    align: 'center',
    title: '领取时间',
    dataIndex: 'receiveTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'welfare-management-welfare-birthday-config',
  components: {},
  data() {
    return {
      dayWeekMonth: 1,
      userName: undefined,
      receiveStatus: undefined,
      sDate: [undefined, undefined],

      columns: columns,
      dataSource: [],
      pagination: {
        current: 1,
      },
      loading: false,
    }
  },
  computed: {
    searchParam() {
      let sDate = this.sDate,
        receiveStartTime,
        receiveEndTime
      if (Array.isArray(sDate) && sDate.length === 2) {
        if (sDate[0] instanceof moment) {
          receiveStartTime = sDate[0].format('YYYY-MM-DD')
        } else {
          receiveStartTime = undefined
        }
        if (sDate[1] instanceof moment) {
          receiveEndTime = sDate[1].format('YYYY-MM-DD')
        } else {
          receiveEndTime = undefined
        }
      }
      return {
        userName: this.userName,
        receiveStatus: this.receiveStatus,
        checkupResult: this.checkupResult,
        receiveStartTime,
        receiveEndTime,
        queryType: this.dayWeekMonth,
      }
    },
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'welfare-management-welfare-birthday-config') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    moment,
    init() {
      this.searchAction()
    },
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination }, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      birthdayWelfareManagementList(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            if(item.birthDate){
              item.birthDate = item.birthDate.slice(0,10)
            }
            if(item.welfareYear){
              item.welfareYear = item.welfareYear.slice(0,10)
            }
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
    doAction(actionType, record) {
      let that = this
      if (actionType === 'get') {
        birthdayWelfareManagementGetWelfare(`id=${record.id}`).then((res) => {
          console.log(res)
          that.$message.info(res.msg)
          if (res.code === 200) {
            that.searchAction()
          }
        })
      } else {
        this.$message.info('功能尚未实现！')
      }
    },
    simpleSearch(type) {
      this.dayWeekMonth = this.dayWeekMonth === type ? undefined : type
      this.searchAction()
    },
  },
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.wdf-custom-wrapper .search-wrapper > * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>

<template>
  <!-- 人脸打卡记录 -->
  <div class="wdf-custom-wrapper" id="attendance-over-time-apply">
    <div class="search-wrapper">
      <a-form layout="inline">
        <a-form-item>
          <a-button-group>
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 1 }" @click="simpleSearch(1)"
              >上月</a-button
            >
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 2 }" @click="simpleSearch(2)"
              >本月</a-button
            >
            <a-button type="primary" :class="{ currentDayWeekMonth: dayWeekMonth === 3 }" @click="simpleSearch(3)"
              >全部</a-button
            >
          </a-button-group>
        </a-form-item>
        <a-form-item>
          <a-input placeholder="员工名模糊查询" v-model="searchParam.userName" allowClear style="width: 150px" />
        </a-form-item>
        <a-form-item>
          <a-select placeholder="选择部门" v-model="searchParam.departmentId" :allowClear="true" style="width: 150px">
            <a-select-option v-for="item in depList" :key="item.id" :value="item.id">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-month-picker
            @change="onChange"
            style="width: 220px"
            :allowClear="true"
            :disabled-date="disabledDate"
            placeholder="请选择月份"
          />
        </a-form-item>


        <a-form-item v-if="$auth('attendanceStatistics:personStatus')">
            <a-select placeholder="人员状态" v-model="searchParam.userPositionStatus" :allowClear="true" style="width: 160px">
              <a-select-option :value="1">在职</a-select-option>
              <a-select-option :value="0">离职</a-select-option>
            </a-select>
          </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="search" @click="searchAction()">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button class="a-button" type="primary" icon="download" @click="downAction">下载</a-button>
        </a-form-item>
      </a-form>
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
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  departmentList, //所有部门
} from '@/api/systemSetting'
import { getStatisticsList, downStatisticsList } from '@/api/attendanceManagement'
import moment from 'moment'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    fixed: 'left',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '考勤月',
    dataIndex: 'statiticsMonth',
    key: 'statiticsMonth',
  },
  {
    align: 'center',
    title: '工号',
    dataIndex: 'jobNum',
    key: 'jobNum',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    align: 'center',
    title: '工作时长（小时）',
    dataIndex: 'workHours',
    key: 'workHours',
  },
  {
    align: 'center',
    title: '出勤（天）',
    dataIndex: 'workDayNum',
    key: 'workDayNum',
  },
  {
    align: 'center',
    title: '请假（h）',
    dataIndex: 'leaveHours',
    key: 'leaveHours',
  },
  {
    align: 'center',
    title: '调休（h）',
    dataIndex: 'leaveWithRestHours',
    key: 'leaveWithRestHours',
  },

  // {
  //   align: 'center',
  //   title: '外出（h）',
  //   dataIndex: 'egressLeaveHours',
  //   key: 'egressLeaveHours',
  // },

  {
    align: 'center',
    title: '加班（h）',
    key: 'overWorkHours',
    dataIndex: 'overWorkHours',
  },
  {
    align: 'center',
    title: '出差（天）',
    key: 'travelDayNum',
    dataIndex: 'travelDayNum',
  },
  {
    align: 'center',
    title: '迟到（h）',
    dataIndex: 'laterHours',
    key: 'laterHours',
  },
  {
    align: 'center',
    title: '早退（h）',
    dataIndex: 'earlyHours',
    key: 'earlyHours',
  },
  {
    align: 'center',
    title: '餐补（次）',
    dataIndex: 'overLunchNum',
    key: 'overLunchNum',
  },
  {
    align: 'center',
    title: '工作餐（天）',
    dataIndex: 'lunchNum',
    key: 'lunchNum',
  },
]

export default {
  name: 'attendance-statistics',
  data() {
    return {
      disabled: false,
      columns: columns,
      dataSource: [],
      pagination:{
        current:1,
        _prePageSize: 10,
        pageSize:10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      searchParam: {
        userPositionStatus:1
      }, //查询参数
      downParam: {}, //下载参数
      depList: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      dayWeekMonth: 2,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'attendance-statistics') {
          let nowDate = moment().format('YYYY-MM')
          this.init({ current: 1, statiticsMonthDate: nowDate })
          this.searchParam.statiticsMonthDate = nowDate
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let nowDate = moment().format('YYYY-MM')
    this.init({ current: 1, statiticsMonthDate: nowDate })
    this.searchParam.statiticsMonthDate = nowDate
  },
  methods: {
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    init(params) {
      let that = this
      let queue = []

      //有查看全部权限时， 部门搜索条件 去除，显示全部部门
      let hasAuth = that.$auth('attendanceStatistics:findAll')
      let task1 = departmentList(hasAuth ? undefined : { id: this.$store.getters.userInfo.departmentId }).then(
        (res) => (that.depList = res.data)
      )
      queue.push(task1)
      // that.searchAction(params)

      let nowDate = moment().format('YYYY-MM')
      this.downParam.userName = ''
      this.downParam.statiticsMonthDate = nowDate
      this.downParam.departmentId = ''
      this.searchParam.statiticsMonthDate = nowDate
      that.getList(params)
      return Promise.all(queue)
    },
    // // 下载传参
    // downParamFun(){
    //   const resultDownParams=Object.assign({},{...this.downParam})
    //   return resultDownParams
    // },
    searchAction(opt = {}) {
      this.disabled = false
      let that = this

      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...this.searchParam }, paginationParam, opt)
      console.log('执行搜索...', _searchParam)
      that.loading = true
      getStatisticsList(_searchParam)
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

          try{
            //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
            //刷新也不显示数据
            let {current,pages} = res.data
            if(+pages > 0 && +current > +pages){
              that.pagination = {...pagination,current:pages}
              that.searchAction()
            }
          }catch(err){
            console.log(err)
          }
        })
        .catch((err) => (that.loading = false))
      this.downParam.userName = _searchParam.userName
      this.downParam.statiticsMonthDate = _searchParam.statiticsMonthDate
      this.downParam.departmentId = _searchParam.departmentId
      this.getList(_searchParam)
    },
    // 分页
    handleTableChange (pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if(+pager.pageSize !== +pager._prePageSize){ //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = {...this.pagination,...pager}
      this.searchAction()
    },

    onChange(date, dateString) {
      if (typeof dateString === 'string') {
        this.searchParam.statiticsMonthDate = dateString
        this.dayWeekMonth = 0
      }
    },
    getList(params) {
      this.loading = true
      getStatisticsList(params)
        .then((res) => {
          this.loading = false
          this.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })

          //设置数据总条数
          const pagination = { ...this.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          this.pagination = pagination
        })
        .catch((err) => (this.loading = false))
    },
    simpleSearch(num) {
      console.log(num)
      if (num === 1) {
        // 上月
        this.disabled = true
        this.dayWeekMonth = 1
        let lastMonth = moment().add(-1,'months').format('YYYY-MM')
        this.getList({ current: 1, statiticsMonthDate: lastMonth })
        // 存储上月参数
        this.downParam.userName = ''
        this.searchParam.statiticsMonthDate = lastMonth
        this.downParam.statiticsMonthDate = lastMonth
        this.downParam.departmentId = ''
      } else if (num === 3) {
        // 全部
        this.disabled = false
        this.dayWeekMonth = 3
        this.searchParam.statiticsMonthDate = ''
        this.downParam.userName = ''
        this.downParam.statiticsMonthDate = ''
        this.downParam.departmentId = ''
        this.getList({ current: 1, statiticsMonthDate: undefined })
      } else if (num === 2) {
        // 本月
        this.disabled = false
        this.dayWeekMonth = 2
        let month = moment().format('YYYY-MM')
        this.downParam.userName = ''
        this.searchParam.statiticsMonthDate = month
        this.downParam.statiticsMonthDate = month
        this.downParam.departmentId = ''
        this.getList({ current: 1, statiticsMonthDate: month })
      }
    },
    // 下载
    downAction() {
      let that = this
      const downListParams = Object.assign({}, { ...that.downParam })
      console.log(downListParams)
      that.loading = true
      downStatisticsList(downListParams)
        .then((res) => {
          console.log(res)
          this.loading = false
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            //const isFile = res.type === 'application/msword'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = '考勤统计列表.xls'
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => (this.loading = false))
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
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>

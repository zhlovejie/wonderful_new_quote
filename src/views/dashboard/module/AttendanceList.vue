<template>
  <div class="main-wrapper">
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
    >
    </a-table>
  </div>
</template>

<script>
import { getStatisticsList } from '@/api/attendanceManagement'
const columns = [
  {
    align: 'center',
    title: '工作时长（小时）',
    dataIndex: 'workHours',
    key: 'workHours'
  },
  {
    align: 'center',
    title: '出勤（天）',
    dataIndex: 'workDayNum',
    key: 'workDayNum'
  },
  {
    align: 'center',
    title: '请假（h）',
    dataIndex: 'leaveHours',
    key: 'leaveHours'
  },
  {
    align: 'center',
    title: '加班（h）',
    key: 'overWorkHours',
    dataIndex: 'overWorkHours'
  },
  {
    align: 'center',
    title: '出差（天）',
    key: 'travelDayNum',
    dataIndex: 'travelDayNum'
  },
  {
    align: 'center',
    title: '迟到（h）',
    dataIndex: 'laterHours',
    key: 'laterHours'
  },
  {
    align: 'center',
    title: '早退（h）',
    dataIndex: 'earlyHours',
    key: 'earlyHours'
  },
  {
    align: 'center',
    title: '餐补（次）',
    dataIndex: 'overLunchNum',
    key: 'overLunchNum'
  },
  {
    align: 'center',
    title: '工作餐（天）',
    dataIndex: 'lunchNum',
    key: 'lunchNum'
  }
]

export default {
  name:'',
  props:{
    statiticsMonthDate:{
      type:String,
      default:() =>{
        const d = new Date()
        return `${d.getFullYear()}-${d.getMonth() + 1}`
      }
    }
  },
  data(){
    return {
      columns: columns,
      dataSource: [],
      loading: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
    }
  },
  mounted(){
    this.searchAction()
  },
  watch:{
    statiticsMonthDate(val){
      this.searchAction()
    }
  },
  methods:{
    searchAction(){
      let that = this
      let _searchParam = {
        statiticsMonthDate:that.statiticsMonthDate || undefined,
        userName:that.userInfo.trueName
      }
      that.loading = true
      getStatisticsList(_searchParam)
        .then(res => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch(err => (that.loading = false))
    }
  }
}
</script>
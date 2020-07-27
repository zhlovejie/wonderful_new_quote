<template>
  <a-modal title="修改内容" v-model="visible" :width="900" :footer="null" :maskClosable="false">
    <a-table
      :columns="priewColumns"
      rowKey="id"
      :dataSource="priewData"
      :pagination="false"
      :loading="loading"
      size="small"
    >
      <div
        slot="caculatorHousType"
        slot-scope="text, record, index"
      >{{record.caculatorHousType+record.caculatorHous}}</div>
      <div slot="attanceUser" slot-scope="text">
        <a-tooltip v-if="String(text).length > 10">
          <template slot="title">{{text}}</template>
          {{ String(text).slice(0,10) }}...
        </a-tooltip>
        <span v-else>{{text}}</span>
      </div>
    </a-table>
  </a-modal>
</template>
<script>
import { attenceChangeApproveDetail } from '@/api/attendanceManagement'
const priewColumns = [
  {
    align: 'center',
    title: '修改内容',
    dataIndex: 'editType'
  },
  {
    align: 'center',
    title: '班次',
    dataIndex: 'className'
  },
  {
    align: 'center',
    title: '考勤类型',
    dataIndex: 'attanceType'
  },
  {
    align: 'center',
    title: '工作日设置',
    dataIndex: 'workDays'
  },
  {
    align: 'center',
    title: '时长处理',
    dataIndex: 'isFreeType'
  },
  {
    align: 'center',
    title: '扣除规则',
    dataIndex: 'caculatorHousType',
    scopedSlots: { customRender: 'caculatorHousType' }
  },
  {
    align: 'center',
    title: '考勤组人员',
    dataIndex: 'attanceUser',
    scopedSlots: { customRender: 'attanceUser' }
  }
]

export default {
  name: 'over-time-rule-edit',
  data() {
    return {
      visible: false,
      loading: false,
      priewColumns: priewColumns,
      priewData: []
    }
  },
  methods: {
    async init(id) {
      let that = this
      that.priewData = []
      that.visible = true
      that.loading = true
      let result = await this.initDetail(id)
      that.priewData = [...result]
      that.loading = false
    },

    initDetail(id) {
      let that = this
      // 获取审批预览信息
      return attenceChangeApproveDetail({ id: id })
        .then(res => {
          console.log(res)
          let isEmpty = obj => obj === null || obj === undefined
          //debugger
          let _attanceType = { 1: '固定班制', 2: '排班制', 3: '自由工时' }
          let _isFreeType = { 0: '不计入调休', 1: '计入调休' }
          let _caculatorHousType = { 1: '按月', 2: '按周', 3: '按日' }
          let result = { ...res.data }
          let arr = []
          arr.push({
            key: 1,
            editType: '修改前',
            className: result.beforeClassName,
            attanceType: _attanceType[result.beforeAttanceType],
            workDays: that.workDaysFormat(result.beforeWorkDays),
            isFreeType: _isFreeType[result.beforeIsFreeType],
            caculatorHousType: !isEmpty(result.beforeCaculatorHousType) ? _caculatorHousType[result.beforeCaculatorHousType] : '',
            caculatorHous: !isEmpty(result.beforeCaculatorHous) ? '低于' + result.beforeCaculatorHous + '小时' : '',
            attanceUser: result.beforeAttanceUser
          })
          arr.push({
            key: 2,
            editType: '修改后',
            className: result.afterClassName,
            attanceType: _attanceType[result.afterAttanceType],
            workDays: that.workDaysFormat(result.afterWorkDays),
            isFreeType: _isFreeType[result.afterIsFreeType],
            caculatorHousType: !isEmpty(result.afterCaculatorHousType) ? _caculatorHousType[result.afterCaculatorHousType] : '',
            caculatorHous: !isEmpty(result.afterCaculatorHous) ? '低于' + result.afterCaculatorHous + '小时' : '',
            attanceUser: result.afterAttanceUser
          })
          return arr
        })
        .catch(error => {
          console.error(error)
          return []
        })
    },
    initDetailForView(id) {
      let that = this
      // 获取审批预览信息
      return attenceChangeApproveDetail({ id: id })
        .then(res => {
          let result = { ...res.data }
          return {
            editType: '修改后',
            attanceName: result.attanceName,
            className: result.afterClassName,
            attanceType: result.afterAttanceType,
            workDays: result.afterWorkDays,
            isFreeType: result.afterIsFreeType,
            caculatorHousType: result.afterCaculatorHousType,
            caculatorHous: result.afterCaculatorHous,
            attanceUsers: result.afterAttanceUser
          }
        })
        .catch(error => {
          console.error(error)
          return {}
        })
    },
    workDaysFormat(strs) {
      let w = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
      let str = ''
      return strs
        .split(',')
        .map(s => w[s])
        .join(',')
    }
  }
}
</script>
<style scoped>
</style>
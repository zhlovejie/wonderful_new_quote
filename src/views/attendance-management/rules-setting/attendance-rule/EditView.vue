<template>
  <a-modal title="修改内容" v-model="visible" :width="650" :footer="null" :maskClosable="false">
    <a-table
      :columns="priewColumns"
      rowKey="id"
      :dataSource="priewData"
      :pagination="false"
      :loading="loading"
    />
  </a-modal>
</template>
<script>

import {attenceChangeApproveDetail } from '@/api/attendanceManagement'
const priewColumns = [
  {
    align: 'center',
    title: '修改内容',
    dataIndex:'editType'
  },
  {
    align: 'center',
    title: '班次',
    dataIndex: 'ClassName'
  },
  {
    align: 'center',
    title: '考勤类型',
    dataIndex: 'AttanceTypeName'
  },
  {
    align: 'center',
    title: '工作日设置',
    dataIndex: 'WorkDays'
  },
  {
    align: 'center',
    title: '时长处理',
    dataIndex: 'CaculatorHous'
  },
  {
    align: 'center',
    title: '扣除规则',
    dataIndex: 'CaculatorHousType'
  },
  {
    align: 'center',
    title: '考勤组人员',
    dataIndex: 'AttanceUser'
  }
]

export default {
  name:'over-time-rule-edit',
  data(){
    return {
      visible:false,
      loading:false,
      priewColumns:priewColumns,
      priewData:[]
    }
  },
  methods:{
    init (id) {
      this.priewData = []
      this.visible = true
      this.loading = true
      // 获取审批预览信息
      attenceChangeApproveDetail({id: id})
      .then(res => {
        console.log(res)
        this.priewData = res.data
        this.loading = false
      })
      .catch(error => {
        this.loading = false
        console.error(error)
      })
    }
  }
}
</script>
<style scoped>

</style>
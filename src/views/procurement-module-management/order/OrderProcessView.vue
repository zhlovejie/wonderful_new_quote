<template>
  <table class="custom-table custom-table-border" v-if="Array.isArray(dataSource) && dataSource.length > 0">
    <tr>
      <th>进程</th>
      <th>操作人</th>
      <th>单号</th>
      <th>时间</th>
    </tr>
    <tr v-for="item in dataSource" :key="item.id">
      <td> {{ {1:'下单',2:'提货',3:'收料',4:'质检',5:'入库',6:'完成'}[item.type] }} </td>
      <td>{{item.createdName}}</td>
      <td>{{item.orderId}}</td>
      <td>{{item.createdTime}}</td>
    </tr>
  </table>
  <span v-else>无</span>
</template>

<script>
import { orderProcessList } from '@/api/procurementModuleManagement'

export default {
  data(){
    return {
      dataSource:[]
    }
  },
  methods:{
    query(orderId){
      const that = this
      orderProcessList({orderId}).then(res => {
        that.dataSource = res.data
      }).catch(err => {
        that.dataSource = []
        that.$message.error(err.message)
      })
    }
  }
}
</script>

<style scoped>
.custom-table-border th, .custom-table-border td{
  padding: 5px;
  text-align: left;
}
</style>

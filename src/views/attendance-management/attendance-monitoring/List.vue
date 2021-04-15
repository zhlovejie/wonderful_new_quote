<template>
  <div class="wdf-custom-wrapper">
    <a-tabs :activeKey="activeKey" :defaultActiveKey="0" @change="tabChange">
      <a-tab-pane tab="大门口门卫室上方" :key="1" />
      <a-tab-pane tab="105会议室" :key="2" />
      <a-tab-pane tab="大门口监控杆" :key="3" />
    </a-tabs>

    <MonitorDevice v-if="activeKey === 1" :deviceKey="activeKey" />
    <MonitorDevice v-if="activeKey === 2" :deviceKey="activeKey" />
    <MonitorDevice v-if="activeKey === 3" :deviceKey="activeKey" />
  </div>
</template>

<script>
import MonitorDevice from '@/components/CustomerList/MonitorDevice'
export default {
  name: 'attendance-monitoring',
  components:{MonitorDevice},
  data() {
    return {
      activeKey:1
    }
  },
  methods:{
    tabChange(key){
      this.activeKey = +key
    }
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 20px;
}
</style>

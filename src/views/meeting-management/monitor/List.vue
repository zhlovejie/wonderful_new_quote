<template>
  <div class="wdf-custom-wrapper">
    <MonitorDevice :deviceKey="2" />
  </div>
</template>

<script>
import MonitorDevice from '@/components/CustomerList/MonitorDevice'
export default {
  name: 'meetingManagementMonitor',
  components:{MonitorDevice},
  data() {
    return {}
  }
}
</script>

<style scoped>
.wdf-custom-wrapper {
  background-color: #fff;
  padding: 20px;
}
</style>

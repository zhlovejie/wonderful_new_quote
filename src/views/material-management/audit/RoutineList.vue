<template>
  <!-- 物料规则审核 -->
  <BaseList key="BaseList-1" ref="baseList" :type="type" />
</template>

<script>

import BaseList from './BaseList'
export default {
  name: 'material-management-audit-RoutineList',
  components: {
    BaseList
  },
  data() {
    return {
      type:1
    }
  }
}
</script>


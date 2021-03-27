<template>
  <!-- 物料规则审核 -->
  <BaseList key="BaseList-1" ref="baseList" :type="type" :tabKey="tabKey" />
</template>

<script>

import BaseList from './BaseList'
export default {
  name: 'material-management-audit-RoutineList',
  components: {
    BaseList
  },
  props:{
    type:{
      type:[Number,String],
      default:() => 1
    },
    tabKey:{
      type:[Number,String],
      default:() => 1
    }
  }
}
</script>


<template>
  <!-- 物料库审核 -->
  <BaseList key="BaseList-1" ref="baseList" :type="type" :tabKey="tabKey" />
</template>

<script>

import BaseList from './BaseList'
export default {
  name: 'material-rule-management-library-normal-audit',
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


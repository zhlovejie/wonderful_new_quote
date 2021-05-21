<template>
  <!-- 成品物料库审核 -->
  <BaseList key="BaseList-2" :type="type" :tabKey="tabKey" />
</template>

<script>

import BaseList from './BaseList'

export default {
  name: 'material-rule-management-finished-product-audit',
  components: {
    BaseList
  },
  props:{
    type:{
      type:[Number,String],
      default:() => 2
    },
    tabKey:{
      type:[Number,String],
      default:() => 1
    }
  }
}
</script>


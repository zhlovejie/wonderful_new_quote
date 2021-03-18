<template>
  <!-- 成品物料规则审核 -->
  <BaseList key="BaseList-2" :type="type" />
</template>

<script>

import BaseList from './BaseList'

export default {
  name: 'material-management-audit-FinishedProductList',
  components: {
    BaseList
  },
  data() {
    return {
      type:2
    }
  }
}
</script>


<template>
  <!-- 2.0产品价格系数 -->
  <BaseList ref="baseList" :type="1" />
</template>
<script>

import BaseList from './List'

export default {
  name: 'productPriceCoefficient2d0',
  components: {
    BaseList
  },
  data() {
    return {
      
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'productPriceCoefficient2d0') {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      let that = this
      that.$nextTick(() => that.$refs.baseList && that.$refs.baseList.searchAction())
    },
  }
}
</script>

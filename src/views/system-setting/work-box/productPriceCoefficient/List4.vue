<template>
  <!-- 厨余价格系数-->
  <BaseList ref="baseList" :type="3" />
</template>
<script>
import BaseList from './List'

export default {
  name: 'productPriceCoefficientWaste',
  components: {
    BaseList,
  },
  data() {
    return {}
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'productPriceCoefficientWaste') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      that.$nextTick(() => that.$refs.baseList && that.$refs.baseList.searchAction())
    },
  },
}
</script>

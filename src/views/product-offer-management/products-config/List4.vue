<template>
  <!-- 厨余系列产品配置 -->
  <BaseList ref="baseList" :productType="3" />
</template>
<script>
import BaseList from './List'

export default {
  name: 'pomproductsconfigWaste',
  components: {
    BaseList,
  },
  data() {
    return {}
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'pom-products-configWaste') {
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
<style scoped>
.customer-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.customer-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
.main-wrapper {
  margin-top: 20px;
}
</style>
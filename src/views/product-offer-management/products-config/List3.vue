<template>
  <!-- 5.0系列产品配置 -->
  <BaseList ref="baseList" :productType="2" />
</template>
<script>
import BaseList from './List'

export default {
  name: 'pomproductsconfig5d0',
  components: {
    BaseList,
  },
  data() {
    return {}
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'pom-products-config5d0') {
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
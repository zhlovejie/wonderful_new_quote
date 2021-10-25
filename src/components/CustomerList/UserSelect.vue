<template>
  <a-select
    v-bind="$attrs"
    :value="userId"
    @change="change"
    option-filter-prop="children"
    :filter-option="filterOption"
  >
    <a-select-option
      v-for="item in list"
      :key="item.id"
      :value="item.id"
    >{{ item.trueName }}</a-select-option>
  </a-select>
</template>

<script>
import {
  getUserListNoPage //所有部门
} from '@/api/systemSetting'
export default {
  props: {
    userId: [String,Number]
  },
  data() {
    return {
      list: []
    };
  },
  created(){
    this.init()
  },
  methods: {
    init() {
      const that = this
      return getUserListNoPage().then(res => {
        that.list = res.data
      })
    },
    change(userId) {
      this.$emit("update:userId", userId);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

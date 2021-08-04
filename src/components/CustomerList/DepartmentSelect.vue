<template>
  <a-select
    v-bind="$attrs"
    :value="depId"
    @change="depChange"
  >
    <a-select-option
      v-for="item in depList"
      :key="item.id"
      :value="item.id"
    >{{ item.departmentName }}</a-select-option>
  </a-select>
</template>

<script>
import {
  departmentList //所有部门
} from '@/api/systemSetting'
export default {
  props: {
    depId: [String,Number]
  },
  data() {
    return {
      depList: []
    };
  },
  created(){
    this.init()
  },
  methods: {
    init() {
      this.initDepartment()
    },
    initDepartment() {
      const that = this
      return departmentList().then(res => {
        that.depList = res.data
      })
    },
    depChange(depId) {
      this.$emit("update:depId", depId);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

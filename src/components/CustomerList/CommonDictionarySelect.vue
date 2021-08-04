<template>
  <a-select
    v-bind="$attrs"
    :value="dictionaryId"
    @change="changeHandler"
  >
    <a-select-option
      v-for="item in dataSource"
      :key="item.id"
      :value="item.id"
    >{{ item.text }}</a-select-option>
  </a-select>
</template>

<script>
import { getDictionary } from '@/api/common'
export default {
  props: {
    text: [String],
    dictionaryId:[Number]
  },
  data() {
    return {
      dataSource: []
    };
  },
  created(){
    this.init()
  },
  methods: {
    init() {
      const that = this;
      that.dataSource = []
      if(!that.text){
        console.warn(`text参数缺失`)
        return
      }
      getDictionary({text:that.text}).then(res => (that.dataSource = res.data));
    },
    changeHandler(dictionaryId) {
      this.$emit("update:dictionaryId", dictionaryId);
      let target = this.dataSource.find(item => item.id === dictionaryId)
      this.$emit("selected",{...target})
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<template>
  <a-select
    v-bind="$attrs"
    :value="dictionaryId"
    @change="changeHandler"
    :filter-option="filterOption"
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
    dictionaryId:[Number,String,Array]
  },
  data() {
    return {
      dataSource: []
    };
  },
  computed:{
    isMultiple(){
      return Array.isArray(this.dictionaryId)
    }
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
      getDictionary({text:that.text}).then(res => {
        that.dataSource = res.data
        that.$emit("loaded",[...that.dataSource])
      });
    },
    changeHandler(dictionaryId) {
      this.$emit("update:dictionaryId", dictionaryId);
      if(this.isMultiple){
        let list = this.dataSource.filter(item => dictionaryId.includes(item.id))
        this.$emit("selected",list)
      }else{
        let target = this.dataSource.find(item => item.id === dictionaryId)
        this.$emit("selected",{...target})
      }
    },
    getTarget(){
      let {dataSource,dictionaryId} = this
      if(this.isMultiple){
        console.log(dataSource.filter(item => dictionaryId.includes(item.id)))
        return dataSource.filter(item => dictionaryId.includes(item.id))
      }else{
        let target = dataSource.find(item => item.id === dictionaryId)
        return target ? {...target} : null
      }
    },
    getDataSource(){
      return [...this.dataSource]
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    bindByText(text){
      let target = this.dataSource.find(item => item.text === text)
      this.dictionaryId = target.id
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

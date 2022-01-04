<template>
  <a-select
    v-bind="$attrs"
    :value="value"
    @change="handlerChange"
  >
    <a-select-option v-for="item in list" :key="item.id">
      {{item.termName}}
    </a-select-option>
  </a-select>
</template>
<script>
import {
  checkParameterTermList,
} from '@/api/qualityManagement'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name:'tools-single-select',
  props:{
    termName:[String],
    value:[Number,String]
  },
  data(){
    return {
      list:[],
    }
  },
  watch:{
    termName(){
      this.init()
    }
  },
  created(){
    this.init()
  },
  methods:{
    async init() {
      const that = this
      if(String(that.termName).length === 0){
        return
      }
      let id = await checkParameterTermList({ termName: that.termName })
        .then((res) => {
          return Array.isArray(res.data) && res.data.length > 0 ? res.data[0].id : null
        })
        .catch((err) => {
          return null
        })

      let list = await checkParameterTermList({ parentId: id })
        .then((res) => {
          return Array.isArray(res.data) && res.data.length > 0 ? res.data : []
        })
        .catch((err) => {
          return []
        })
      that.list = list
    },
    handlerChange(val){
      debugger
      let target = this.list.find(item => item.id === val)
      this.$emit('update:value',target || {})
    }
  }
}
</script>

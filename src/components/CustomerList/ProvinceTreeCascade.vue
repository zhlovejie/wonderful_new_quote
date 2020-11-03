<template>
  <div>
    <a-tree-select
      style="width: 100%;"
      v-model="value"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      tree-checkable
      :show-checked-strategy="SHOW_PARENT" 
      @change="treeChangeAction"
    />
  </div>
</template>
<script>
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
import {getAllArea} from '@/api/common'
import treeData from './ProvinceTreeCascadeData'
export default {
  props:{
    areaList:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      SHOW_PARENT,
      treeData:Object.freeze(this.formatData(treeData)),
      value:[],
    };
  },
  watch: {
    areaList(val){
      if(Array.isArray(val)){
        this.value = [...val] || []
      }
    }
  },
  created(){
    let that = this
    that.levelObj = Object.freeze({
      level1:that.getNodes(1),
      level2:that.getNodes(2),
      level3:that.getNodes(3),
    })
  },
  methods: {
    treeChangeAction(arrVal,arrValTxt){
      //console.log(arguments)
      let txt = this.getNodesTxt(arrVal)
      this.$emit('change',{val:arrVal.join(','),txt})
    },
    formatData(arr){
      let format = (data) =>{
        let _data = [...data]
        _data = _data.map(item =>{
          return {
            key:item.id,
            value:item.id,
            title:item.area,
            level:item.level,
            parentId:item.parentId,
            children:Array.isArray(item.children) && item.children.length > 0 ? format(item.children) : []
          }
        })
        return _data
      }
      return format(arr)
    },
    findKey(key){
      let res = [null,null,null]
      let t = this.parseKey(key)
      let {level1,level2,level3} = this.levelObj
      if(t.p){
        let p = level1.find(item => item.key === key)
        res = [p,null,null]
      }else if(t.c){
        let c = level2.find(item => item.key === key)
        let p = level1.find(item => item.key === c.parentId)
        res = [p,c,null]
      }else if(t.a){
        let a = level3.find(item => item.key === key)
        let c = level2.find(item => item.key === a.parentId)
        let p = level1.find(item => item.key === c.parentId)
        res = [p,c,a]
      }
      return res
    },
    parseKey(key){
      return {
        p:String(key).endsWith('0000'),
        c:String(key).endsWith('00') && !String(key).endsWith('0000'),
        a:!String(key).endsWith('00')
      }
    },
    getNodes(level=1){
      let res = []
      let format = (data) =>{
        data.map(item =>{
          if(item.level === level){
            res.push(item)
          }
          if(Array.isArray(item.children) && item.children.length > 0){
            format(item.children)
          }
        })
      }
      format(this.treeData)
      return res
    },
    getNodesTxt(value){
      return value.map(v =>{
        let res = this.findKey(v)
        return res.filter(item => item !== null).map(item => item.title).join('')
      }).join(',')
    }
  },
};
</script>

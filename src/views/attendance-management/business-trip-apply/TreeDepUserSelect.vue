<template>
  <a-tree-select 
    ref="treeRef"
    :value="fillList"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    tree-checkable
    :show-checked-strategy="SHOW_PARENT"
    :load-data="onLoadData" 
    @change="treeSelectChange"
  />
</template>

<script>

import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT

import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
  getUserByDep //获取人员
} from '@/api/systemSetting'

let uuid = () => Math.random().toString(32).slice(-10);

export default {
  name:'',
  props:{
    fill:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  data(){
    return {
      SHOW_PARENT,
      treeData: [],
      fillList:[],
    }
  },
  mounted(){
    this.init().then(res =>{
      console.log(this.$refs.treeRef)
    })
  },
  methods:{
    init(){
      let that = this
      let fillValues = [] 
      let keys = Object.keys(that.fill || {})
      keys.map(k => fillValues.push(...that.fill[k]))
      that.fillList = fillValues
      let queue = []
      let task1 = that.initDepList().then(res =>{
        that.treeData = res.map(item => {
          return {
            key: uuid(),
            value: item.id,
            title: item.departmentName,
            isLeaf: false
          }
        })
      }).then(() => that.fillAction(Object.keys(that.fill || {})))
      queue.push(task1)
      return Promise.all(queue)
    },
    initDepList(){//部门  id,departmentName
      return departmentList().then(res => res.data) 
    },
    onLoadData(treeNode) {
      let that = this
      let { value } = treeNode.dataRef
      let treeData = [...that.treeData]
      let target = treeData.find(item => item.value === value)
      if (target && target.children) {
        return
      }
      return getUserByDep({ departmentId: value }).then(res => {
        target.children = res.data.map(item => {
          let _uuid = uuid()
          return {
            key: uuid(),
            parentId: value,
            value: item.id,
            title: item.trueName,
            isLeaf: true
          }
        })
        that.treeData = [...treeData]
      })
    },
    treeSelectChange(arrValues,arrLabels,arrNodes){
      let that = this
      that.fillList = [...arrValues]
      let result = arrNodes.allCheckedNodes
      .map(item => item.node.data.props.dataRef)
      .reduce((target,val,idx,arr) =>{
        if(val.isLeaf){
          let parentNode = that.treeData.find(n => String(n.value) === String(val.parentId))
          let hasParent = target.find(n => String(n.value) === String(parentNode.value))
          if(hasParent){
            hasParent.children = hasParent.children || []
            hasParent.children.push({...val})
          }else{
            target.push({
              ...parentNode,
              children:[{...val}]
            })
          }
        }else{
          target.push({
            ...val,
            children:that.treeData.find(n => String(n.value) === String(val.value)).children.map(n => Object.assign({},n))
          })
        }
        return target
      },[])
      console.log(result)
      that.$emit('change',result)
    },
    formatDataList(){
      let that = this
      let _fillList = [...that.fillList ]
      let items = that.$_.flattenDeep(that.treeData.map(item =>item.children))
      let targetItemList = items.filter(item => _fillList.includes(item.value))
      let result = targetItemList.reduce((target,val,idx,arr) =>{
        if(val.isLeaf){
          let parentNode = that.treeData.find(n => String(n.value) === String(val.parentId))
          let hasParent = target.find(n => String(n.value) === String(parentNode.value))
          if(hasParent){
            hasParent.children = hasParent.children || []
            hasParent.children.push({...val})
          }else{
            target.push({
              ...parentNode,
              children:[{...val}]
            })
          }
        }else{
          target.push({
            ...val,
            children:that.treeData.find(n => String(n.value) === String(val.value)).children.map(n => Object.assign({},n))
          })
        }
        return target
      },[])
      return result
    },
    fillAction(_fillList){
      let that = this
      that.treeData.map(item => {
        if(_fillList.includes(String(item.value))){
          that.onLoadData({dataRef:{value:item.value}})
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <a-tree-select
    :allowClear="true"
    v-model="selectedList"
    :disabled="disabled"
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    tree-checkable
  />
</template>

<script>
import {
  departmentList, //所有部门
  getStationList, //获取部门下面的岗位
} from '@/api/systemSetting'
import { TreeSelect } from 'ant-design-vue'

//:show-checked-strategy="SHOW_PARENT" 是否只显示部门ID
//const SHOW_PARENT = TreeSelect.SHOW_PARENT

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name:'depPostTree',
  props:{
    fillPost:{
      type:Array,
      default:() => []
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      selectedList: [],
      //SHOW_PARENT,
      treeData: [],
      postMap:{},
      postKeyMap:{}
    }
  },
  mounted(){
    this.init()
  },
  watch:{
    selectedList(newVal,oldVal){
      this.$emit('change', (newVal || []).map(val => this.postKeyMap[val]) )
    },
    fillPost(newVal,oldVal){
      this.fillTreeData(newVal || [])
    }
  },
  methods:{
    init(){
      this.initTreeData().then(() =>this.fillTreeData(this.fillPost || []))
    },
    async initTreeData(){
      let that = this

      let fetchDeps = await departmentList().then(res => {
        return res.data.map(item => {
          let _uuid = uuid()
          return {
            id: item.id,
            key: _uuid,
            value: _uuid,
            title: item.departmentName,
            isLeaf: false,
            children:null
          }
        })
      })

      for(let dep of fetchDeps){
        await getStationList({ id: dep.id }).then(res => {
          dep.children = res.data.map(item => {
            let _uuid = uuid()
            let __item = {
              parentId: dep.id,
              parentTitle: dep.title,
              parentKey:dep.key,
              id: item.id,
              key: _uuid,
              value: _uuid,
              title: item.stationName,
              isLeaf: true
            }
            that.postKeyMap[_uuid] = {
              id:item.id,
              name:item.stationName
            }
            that.postMap[item.id] = Object.assign({},__item)
            return __item
          })
        })
      }

      that.treeData = fetchDeps
      return fetchDeps
    },
    fillTreeData(selectedList = []){
      let that = this
      if(selectedList.length === 0) return 
      let res = selectedList.map(postid => {
        let post = that.postMap[postid]
        return post ? post.key : null
      })
      if(res.every(item => item !== null)){
        that.selectedList = [...res]
      }
    }
  }
}
</script>

<style scoped>

</style>
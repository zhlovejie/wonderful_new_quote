<template>
  <a-tree-select
    v-model="authoritySaveBoList"
    style="width: 100%"
    :dropdown-style="{ maxHeight: '280px', overflow: 'auto' }"
    :tree-data="orgTree"
    :load-data="onLoadData"
    @change="treeSelectChange"
  />
</template>
<script>
import { TreeSelect } from 'ant-design-vue'
import {
  checkParameterTermList,
} from '@/api/qualityManagement'

const SHOW_PARENT = TreeSelect.SHOW_PARENT
let uuid = () => Math.random().toString(32).slice(-10)



export default {
  name:'tools-select',
  props:{
    termName:{
      type:String,
      default:''
    }
  },
  data(){
    return {
      authoritySaveBoList:[],
      SHOW_PARENT,
      parentId:0,
      parentItem:{},
      selectedTreeNode:null,
      orgTree:[]
    }
  },
  created(){
    this.fetchTree()
  },
  methods:{
    treeSelectChange(value,titleList,vnode){
      let {remarks,parentId} = vnode.triggerNode.dataRef
      let result = {
        name:titleList[0],
        value,
        remarks,
        parentId
      }
      this.$emit('change',{...result})
    },

    onLoadData(treeNode ) {
      const that = this
      that.selectedTreeNode = treeNode
      return new Promise((resolve) => {
        checkParameterTermList({ parentId: treeNode.dataRef.value })
          .then(res => {
            if(res && res.code === 200 && Array.isArray(res.data) && res.data.length > 0){
              let children = res.data.map(item => that.formatTreeData(item))
              treeNode.dataRef.isLeaf = false
              treeNode.dataRef.children = children
              that.selectedTreeNode = treeNode
              that.orgTree = [...that.orgTree]
              // that.dataList = that.generateList(that.orgTree)
            }else{
              treeNode.dataRef.isLeaf = true
              treeNode.dataRef.children = []
              that.selectedTreeNode = treeNode
              that.orgTree = [...that.orgTree]
              // that.dataList = that.generateList(that.orgTree)
            }
            resolve()
          })
          .catch((err) => {
            that.$message.error(err.message)
            resolve()
            return
          })
      })
    },
        //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)

      obj.title = item.termName
      obj.value = String(item.id)
      obj.remarks = item.remarks,
      obj.parentId = item.parentId
      if (Array.isArray(item.children) && item.children.length > 0) {
        obj.children = item.children.map((v) => that.formatTreeData(v))
      }
      return obj
    },

    fetchTree() {
      const that = this
      if(that.termName.length === 0){
        return
      }
      that.modelType = 1
      that.spinning = true
      that.dataSource = []
      that.selectedRowKeys = []
      that.selectedRows = []
      that.loadedKeys = []
      checkParameterTermList({ termName: that.termName })
        .then((res) => {
          that.spinning = false
          if(+res.code !== 200){
            that.$message.info(res.msg)
            return
          }
          let node =  Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : []
          if(node.length === 0){
            return
          }
          const root = {
            key: String(node.id),
            value: String(node.id),
            title: node.termName,
            remarks:node.remarks,
            isLeaf: false,
            parentId: node.parentId,
            children: [],
          }
          that.orgTree = [root]
          // that.dataList = that.generateList(that.orgTree)
          that.selectedTreeNode = {
            dataRef:{
              ...root
            }
          }

          that.parentItem = root
          // Object.assign(that, {
          //     expandedKeys:['0'],
          //     autoExpandParent: true,
          //   })
        })
        .catch((err) => {
          that.spinning = false
          that.$message.error(err.message)
        })
    },

  }
}
</script>

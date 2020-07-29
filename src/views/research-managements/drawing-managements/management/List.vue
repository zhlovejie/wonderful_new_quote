<template>
<!-- 图纸管理 -->
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="4">
        <div class="menu-tree-list-wrapper" style="width:100%;overflow:auto;box-shadow: 7px 0px 7px -7px #ddd;height: 600px;">
          <a-tree 
            :treeData="orgTree" 
            :replaceFields="replaceFields" 
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            :selectedKeys="selectedKeys"
            @select="handleClick" 
            @expand="onExpand"
            :showLine="true"
          />
        </div>
      </a-col>
      <a-col :span="20">
        <LevelOne key="l1" v-if="+currentItem.type === 0" ref="levelOne" :params="currentItem" @finish="() => { initTreeData('refresh') }" />
        <LevelTwo key="l2" v-if="+currentItem.type === 1" ref="levelTwo" :params="currentItem" @finish="() => { initTreeData('refresh') }" />
        <LevelThree key="l3" v-if="+currentItem.type === 3" ref="levelThree" :params="currentItem" @finish="() => { initTreeData('refresh') }" />
      </a-col>
    </a-row>

  </a-card>
</template>

<script>
import {
  blueprintMenuTreeList,
  blueprintMenuPageList,
  blueprintMenuDetail,
  blueprintMenuDel,
  blueprintMenuAddOrUpdate
} from '@/api/researchManagement'

import LevelOne from './levelone/List'
import LevelTwo from './leveltwo/List'
import LevelThree from './levelthree/List'
export default {
  name: 'research-managements-drawing-managements-management',
  components: {
    LevelOne,
    LevelTwo,
    LevelThree
  },
  data () {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      superiorId: 0, // 父id

      orgTree: [],
      replaceFields:{
        key:'id',
        title:'menuName',
        children:'subList'
      },
      expandedKeys:[],
      selectedKeys:[],
      autoExpandParent:true,

      currentItem:{}, //当前选择的项
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'research-managements-drawing-managements-management') {
          this.init()
        }
      },
      immediate: true
    }
  },
  created () {
    
  },
  methods: {
    init(){
      this.initTreeData()
    },
    onExpand(expandedKeys){
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    initTreeData(actionType='normal'){
      let that = this
      return blueprintMenuTreeList({superiorId:that.superiorId}).then(res => {
        that.orgTree = [that.fillParentNode(res.data)]
        if(actionType !== 'refresh'){
          //展开根目录
          that.$nextTick(() => {
            that.expandedKeys = [0]
            that.selectedKeys = [0]
            that.currentItem = that.orgTree[0]
          })
        }
      })
    },
    handleClick (selectedKeys,nodes) { // 点击树结构菜单
      debugger
      let that = this
      that.selectedKeys = selectedKeys
      that.currentItem = Object.assign({},nodes.node.dataRef)


      that.$nextTick(() =>{
        that.$refs.levelOne && that.$refs.levelOne.searchAction()
      })
    },
    fillParentNode(node) {
      let fillParentId = (n) =>{
        if(n && Array.isArray(n.subList) && n.subList.length > 0){
          for(let _n of n.subList){
            _n.superiorId = n.id
            if(+_n.type === 2){  //产品层 禁止选择
              _n.selectable = false
            }
            fillParentId(_n)
          }
        }
        return n
      }
      return fillParentId(node)
    }
  }
}
</script>



<template>
  <!-- 图纸管理 -->
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="5">
        <div
          class="menu-tree-list-wrapper"
          style="width:100%;overflow:auto;box-shadow: 7px 0px 7px -7px #ddd;height: 800px;"
        >
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
      <a-col :span="19">
        <!-- <LevelOne
          key="l1"
          v-if="+currentItem.type === 0"
          ref="levelOne"
          :params="currentItem"
          @finish="() => { initTreeData('refresh') }"
        />-->
        <LevelThree
          key="l1"
          v-if="+currentItem.type === 0"
          ref="levelThree"
          :params="currentItem"
          :globalSearch="true"
          @finish="() => { initTreeData('refresh') }"
          @rowhover="rowhoverChange"
        />
        <LevelTwo
          key="l2"
          v-if="+currentItem.type === 1"
          ref="levelTwo"
          :params="currentItem"
          @finish="() => { initTreeData('refresh') }" 
          @rowhover="rowhoverChange2" 
        />
        <LevelThree
          key="l3"
          v-if="+currentItem.type === 3"
          ref="levelThree"
          :params="currentItem"
          :globalSearch="false"
          @finish="() => { initTreeData('refresh') }"
        />
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
  blueprintMenuAddOrUpdate,
} from '@/api/researchManagement'

import LevelOne from './levelone/List'
import LevelTwo from './leveltwo/List'
import LevelThree from './levelthree/List'

let uuid = () => `${Math.random().toString(32).slice(-6)}-${Math.random().toString(32).slice(-6)}`
export default {
  name: 'research-managements-drawing-managements-management',
  components: {
    LevelOne,
    LevelTwo,
    LevelThree,
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo, // 当前登录人
      superiorId: 0, // 父id

      orgTree: [],
      replaceFields: {
        key: 'key',
        title: 'menuName',
        children: 'subList',
      },
      expandedKeys: [],
      selectedKeys: [],
      autoExpandParent: true,

      currentItem: {}, //当前选择的项
      cacheExpandedKeys: [],
      cacheSelectedKeys: [],
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'research-managements-drawing-managements-management') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    init() {
      this.initTreeData()
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
      this.cacheExpandedKeys = this.expandedKeys.map((key) => this.findNodeByKey(this.orgTree[0], key))
    },
    initTreeData(actionType = 'normal') {
      let that = this
      return blueprintMenuTreeList({ superiorId: that.superiorId, type: 1 }).then((res) => {
        that.orgTree = [that.fillParentNode(res.data)]
        if (actionType !== 'refresh') {
          //展开根目录
          //that.$nextTick(() => {
          let rootKey = that.orgTree[0].key
          let levelOneKey = that.orgTree[0].subList.map((node) => node.key)
          let expandedKeys = [rootKey, ...levelOneKey]

          that.expandedKeys = expandedKeys
          that.selectedKeys = [rootKey]
          that.currentItem = that.orgTree[0]

          that.cacheSelectedKeys = that.orgTree[0]
          that.cacheExpandedKeys = that.expandedKeys.map((key) => that.findNodeByKey(that.orgTree[0], key))
          //})
        } else {
          that.expandedKeys = that.cacheExpandedKeys
            .map((item) => that.findNode(that.orgTree[0], item.id))
            .map((node) => node.key)

          that.selectedKeys = that.cacheSelectedKeys
            .map((item) => that.findNode(that.orgTree[0], item.id))
            .map((node) => node.key)
        }
      })
    },
    handleClick(selectedKeys, nodes) {
      // 点击树结构菜单
      //debugger
      let that = this
      that.selectedKeys = selectedKeys
      that.currentItem = Object.assign({}, nodes.node.dataRef)

      that.cacheSelectedKeys = that.selectedKeys.map((key) => that.findNodeByKey(that.orgTree[0], key))

      that.$nextTick(() => {
        that.$refs.levelOne && that.$refs.levelOne.searchAction()
      })
    },
    fillParentNode(node) {
      let fillParentId = (n) => {
        if (n && Array.isArray(n.subList) && n.subList.length > 0) {
          for (let _n of n.subList) {
            _n.superiorId = n.id
            _n.key = uuid()
            if (+_n.type === 2) {
              //产品层 禁止选择
              _n.selectable = false
              _n.menuName = `${_n.menuName}(${_n.code})` //名称+(代码)
            }
            fillParentId(_n)
          }
        }
        return n
      }
      node.key = uuid()
      return fillParentId(node)
    },
    findNode(node, id) {
      //查找指定ID的节点
      let res = null
      let fNode = (obj) => {
        if (obj.id === id) {
          return obj
        }
        if (obj && obj.subList) {
          for (let i = 0, len = obj.subList.length; i < len; i++) {
            res = fNode(obj.subList[i])
            if (res !== null) {
              return res
            }
          }
        }
        return null
      }
      return fNode(node)
    },
    findNodeByKey(node, key) {
      //查找指定key的节点
      let res = null
      let fNode = (obj) => {
        if (obj.key === key) {
          return obj
        }
        if (obj && obj.subList) {
          for (let i = 0, len = obj.subList.length; i < len; i++) {
            res = fNode(obj.subList[i])
            if (res !== null) {
              return res
            }
          }
        }
        return null
      }
      return fNode(node)
    },
    getNodePath(node, id) {
      let that = this
      let res = []
      let pid = id
      while (pid !== null) {
        let target = that.findNode(that.orgTree[0], pid)
        if (target) {
          res.unshift(target)
          pid = target.superiorId
        } else {
          break
        }
      }
      return res
    },
    rowhoverChange(record) {
      let that = this
      let { menuId, permissionId } = record
      that.initTreeData().then(() => {
        let nodePaths = that.getNodePath(that.orgTree[0], menuId)
        that.expandedKeys = nodePaths.map((node) => node.key)
        that.cacheExpandedKeys = [...nodePaths]
        let node = nodePaths[nodePaths.length - 1]
        if (Array.isArray(node.subList)) {
          let targetNode = node.subList.find((n) => +n.id === +permissionId)
          if (targetNode) {
            that.selectedKeys = [targetNode.key]
            that.cacheSelectedKeys = [targetNode]

            setTimeout(() => {that.autoLocationNode() }, 500);
          }
        }
      })
    },
    rowhoverChange2(record) {
      let that = this
      let { menuId, permissionId } = record
      that.initTreeData().then(() => {
        let nodePaths = that.getNodePath(that.orgTree[0], menuId)
        that.expandedKeys = nodePaths.map((node) => node.key)
        that.cacheExpandedKeys = [...nodePaths]
        let node = nodePaths[nodePaths.length - 1]
        that.selectedKeys = [node.key]
        that.cacheSelectedKeys = [node]

        setTimeout(() => {that.autoLocationNode() }, 500);
      })
    },

    autoLocationNode(){
      //点击右侧列表的文件夹或文件 ，左侧树形菜单同步定位并且滚动到该位置
      let treeWrapper = document.querySelector('.menu-tree-list-wrapper')//tree的父节点元素
      let treeNode = document.querySelector('ul[role=tree]',treeWrapper) //tree元素
      let selectedNode = document.querySelector('.ant-tree-treenode-selected',treeNode)//被选中的node元素

      let rect_treeWrapper = treeWrapper.getBoundingClientRect()
      let rect_treeNode = treeNode.getBoundingClientRect()
      let rect_selectedNode = selectedNode.getBoundingClientRect()

      let distance = Math.abs(rect_treeNode.top - rect_selectedNode.top) 
      //tree元素和被选中的node元素之间的距离 大于 （tree的父节点元素） 需要滑动位置
      if(distance > rect_treeWrapper.height){
        treeWrapper.scrollTop = distance + 30
      }
      //如果整个页面也存在滚动条，如果符合条件 整个页面也需要滑动位置
      //tree可视高度
      let tree_availHeight = document.documentElement.offsetHeight - 210
      let body_scroll_top = distance + 30 - tree_availHeight
      console.log(distance,tree_availHeight,body_scroll_top)
      body_scroll_top = body_scroll_top < 0 ? 0 : body_scroll_top
      //设置页面的滚动
      document.body.scrollTop = body_scroll_top  * 2
    }
  },
}
</script>



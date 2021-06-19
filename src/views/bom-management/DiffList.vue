<template>
  <a-card
    :bordered="false"
    class="bom-management_list"
  >
  <div class="search-wrapper">
          <a-form layout="inline">
            <a-form-item>
              <a-input
                placeholder="BOM单编号"
                v-model="queryParam.bomCode"
                allowClear
                style="width: 200px"
              />
            </a-form-item>
            <a-form-item>
              <a-input
                placeholder="物料名称模糊查询"
                v-model="queryParam.materialName"
                allowClear
                style="width: 200px"
              />
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                icon="search"
                @click="() => {fetchTree()}"
              >查询</a-button>
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                :disabled="btnMoveDisabled"
                @click="doAction('diff')"
              >差异分析</a-button>
            </a-form-item>
          </a-form>
        </div>
    <div class="resize-column-wrapper">
      <div class="resize-column-left">
        <div class="__hd">BOM资料</div>
        <div
          class="__bd"
          style="width: 100%; overflow: auto; height: auto; min-height: 600px"
        >
          <a-tree
            ref="treeRef"
            :loadData="onLoadData"
            :treeData="orgTree"
            :selectedKeys="treeSelectedKeys"
            :defaultExpandAll="true"
            @select="handleClick"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            @expand="onExpand"
            :showLine="true"
          />
        </div>
      </div>
      <div class="resize-column-control-bar">
        <div class="__hd">操作</div>
        <div class="__bd">
          <a-button :disabled="btnSelectedDisabled" @click="doAction('select')" type="primary" block>选取</a-button>
          <a-button :disabled="btnClearDisabled" @click="doAction('clear')" type="primary" block>清除</a-button>
          <a-button :disabled="btnMoveDisabled" @click="doAction('up')" type="primary" block>上移</a-button>
          <a-button :disabled="btnMoveDisabled" @click="doAction('down')" type="primary" block>下移</a-button>
        </div>
      </div>
      <div class="resize-column-right">
        <div class="__hd">对比数据</div>
        <div class="__bd">
          <p v-for="item in selectedList" :key="item.key">{{item.title}}</p>
        </div>
      </div>
    </div>
    <DiffForm ref="diffForm" />
  </a-card>
</template>

<script>
import {
  getBomTree
} from '@/api/bomManagement'
import DiffForm from './modules/DiffForm'
let uuid = () => Math.random().toString(16).slice(2);

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

export default {
  name: 'bom-management_diff',
  components:{DiffForm},
  data() {
    return {
      parentId: 0, // 父id
      parentItem: {},
      selectedTreeNode: null, //新增修改后刷新节点用
      // 表头
      orgTree: [],
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],

      dataList: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,

      loading: false,
      queryParam: {},

      selectedList:[]
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'bom-management_diff') {
          this.init()
        }
      },
      immediate: true
    }
  },
  computed:{
    treeSelectedKeys() {
      return [String(this.parentId)]
    },
    btnSelectedDisabled(){
      return +this.parentItem.__bomStatus !== 1 || this.selectedList.length === 2
    },
    btnClearDisabled(){
      return this.selectedList.length === 0
    },
    btnMoveDisabled(){
      return this.selectedList.length !== 2
    }
  },
  methods: {
    doAction(type){
      const that = this
      if(type === 'diff'){
        that.$refs['diffForm'].query([...that.selectedList])
      }else if(type === 'select'){
        if(that.selectedList.find(item => item.key === that.parentItem.key)){
          that.$message.info('选取的BOM重复。')
          return
        }
        that.selectedList = [...that.selectedList,{...that.parentItem}]
      }else if(type === 'clear'){
        that.selectedList = []
      }else if(type === 'up' || type === 'down'){
        that.selectedList = that.selectedList.reverse()
      }else{
        console.warn('不支持的指令:',type)
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    generateList(data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        arr.push({ ...node })
        if (node.children) {
          arr.push(...this.generateList(node.children))
        }
      }
      return arr
    },

    rowSelectionChangeHnadler(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    init() {
      this.parentId = 0
      this.selectedTreeNode = null
      this.fetchTree()
    },
    onLoadData(treeNode, isForceRefresh = false) {
      const that = this
      that.selectedTreeNode = treeNode
      return new Promise(resolve => {
        if (!isForceRefresh && treeNode.dataRef.children) {
          resolve()
          return
        }
        getBomTree({ parentId: treeNode.dataRef.value })
          .then(res => {
            let newChildren = res.data.map(item => that.formatTreeData(item))
            treeNode.dataRef.children = newChildren
            that.orgTree = [...that.orgTree]
            that.dataList = that.generateList(that.orgTree)
            resolve()
          })
          .catch(err => {
            console.error(err)
            that.$message.error(`调用接口[getBomTree]时发生错误，错误信息:${err}`)
          })
      })
    },
    margeNode(oldChildren, newChildren) {
      let arr = []
      for (let i = 0; i < newChildren.length; i++) {
        let newNode = newChildren[i]
        let oldNode = oldChildren.find(node => node.value === newNode.value)
        if (oldNode) {
          for (let key in newNode) {
            if (newNode.hasOwnProperty(key) && key !== 'children') {
              oldNode[key] = newNode[key]
            }
          }
          arr.push(oldNode)
        } else {
          arr.push(newNode)
        }
      }
      return arr
    },
    fetchTree() {
      const that = this
      // getBomTree({parentId:that.parentId}).then(res =>{
      //   console.log(res)
      // })
      getBomTree({ parentId: 0 })
        .then(res => {
          const root = {
            key: '0',
            value: '0',
            title: 'BOM资料',
            isLeaf: false,
            parentId: 0,
            children: res.data.map(item => that.formatTreeData(item)),
            scopedSlots: { title: 'title' }
          }
          that.orgTree = [root]
          that.dataList = that.generateList(that.orgTree)

          if (String(that.parentId) === '0') {
            that.parentItem = root
          }
        })
        .catch(err => {
          that.$message.error(`调用接口[getBomTree]时发生错误，错误信息:${err}`)
        })
    },
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)
      obj.title = item.bomName
      obj.value = String(item.id)
      obj.isLeaf = !(Array.isArray(item.sunList) && item.sunList.length > 0)
      obj.parentId = item.parentId
      obj.__bomStatus = item.bomStatus
      obj.__useStatus = item.useStatus
      obj.__status = item.status
      obj.scopedSlots = { title: 'title' }
      if (Array.isArray(item.sunList) && item.sunList.length > 0) {
        obj.children = item.sunList.map(v => that.formatTreeData(v))
      }
      return obj
    },
    handleClick(selectedKeys, e) {
      const that = this
      that.selectedTreeNode = e.node
      let dataRef = e.node.dataRef
      // 点击树结构菜单
      var parentId = this.parentId
      if (selectedKeys[0] !== undefined) {
        parentId = selectedKeys[0]
      }
      that.queryParam = { ...that.queryParam, groupId: parentId }
      that.parentId = parentId
      that.parentItem = { ...dataRef }

      that.selectedRowKeys = []
      that.selectedRows = []
    }
  }
}
</script>

<style scoped>
.resize-column-wrapper{
  display: flex;
  max-width: 1000px;
  border-radius: 3px;
}
.resize-column-left{
  flex: 3;
  border: 1px solid #d9d9d9;
}
.resize-column-control-bar{
  flex: 1;
  border: 1px solid #d9d9d9;
  border-left: none;
  border-right: none;
}
.resize-column-control-bar >>> .ant-btn{
  margin-bottom: 20px;
}
.resize-column-right{
  flex: 3;
  border: 1px solid #d9d9d9;
}
.__hd{
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid #d9d9d9;
  line-height: 40px;
}
.__bd{
  padding: 20px;
  overflow: auto;
}
</style>


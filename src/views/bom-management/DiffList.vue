<template>
  <a-card
    :bordered="false"
    class="bom-management_list"
  >
    <div class="search-wrapper">
      <a-form layout="inline">
        <!-- <a-form-item>
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
        </a-form-item> -->
        <!-- <a-form-item>
          <a-button
            type="primary"
            :disabled="btnMoveDisabled"
            @click="doAction('diff')"
          >差异分析</a-button>
        </a-form-item> -->
      </a-form>
    </div>
    <div class="resize-column-wrapper">
      <div class="resize-column-left">
        <div class="__hd">BOM资料</div>
        <div
          class="__bd"
          style="width: 400px; overflow: auto; height: auto; min-height: 600px"
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
          >
            <template
              slot="title"
              slot-scope="{ title ,__color}"
            >
              <span :style="{'color':__color}">{{ title }}</span>
            </template>
          </a-tree>
        </div>
      </div>
      <div class="resize-column-control-bar">
        <div class="__hd">操作</div>
        <div class="__bd">
          <a-button
            :disabled="btnSelectedDisabled"
            @click="doAction('select')"
            type="primary"
            block
          >选取</a-button>
          <a-button
            :disabled="btnClearDisabled"
            @click="doAction('clear')"
            type="primary"
            block
          >清除</a-button>
          <a-button
            :disabled="btnMoveDisabled"
            @click="doAction('up')"
            type="primary"
            block
          >上移</a-button>
          <a-button
            :disabled="btnMoveDisabled"
            @click="doAction('down')"
            type="primary"
            block
          >下移</a-button>
          <a-button
            type="primary"
            :disabled="btnMoveDisabled"
            @click="doAction('diff')"
            block
          >差异分析</a-button>
        </div>
      </div>
      <div class="resize-column-right">
        <div class="__hd">对比数据</div>
        <div class="__bd">
          <p
            v-for="item in selectedList"
            :key="item.key"
          >{{item.title}}</p>
        </div>
      </div>
    </div>
    <DiffForm ref="diffForm" />
  </a-card>
</template>

<script>
//左侧树 使用工艺路线的树
import {
  productMaterialInfoTwoTierTreeList,
} from '@/api/routineMaterial'

import {
  getAllProductMaterial,
  craftRouteListByMaterial
} from '@/api/craftRoute'
//左侧树 使用工艺路线的树 END

import {
  allListMaterialForm
} from '@/api/bomManagement'

import DiffForm from './modules/DiffForm'
const uuid = () =>
  Math.random()
    .toString(16)
    .slice(2)

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
  components: { DiffForm },
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

      selectedList: []
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
  computed: {
    treeSelectedKeys() {
      return [String(this.parentId)]
    },
    btnSelectedDisabled() {
      return !this.parentItem.isSubProduct || this.selectedList.length === 2
    },
    btnClearDisabled() {
      return this.selectedList.length === 0
    },
    btnMoveDisabled() {
      return this.selectedList.length !== 2
    }
  },
  methods: {
    doAction(type) {
      const that = this
      if (type === 'diff') {
        that.$refs['diffForm'].query([...that.selectedList])
      } else if (type === 'select') {
        if (that.selectedList.find(item => item.key === that.parentItem.key)) {
          that.$message.info('选取的BOM重复。')
          return
        }
        that.selectedList = [...that.selectedList, { ...that.parentItem }]
      } else if (type === 'clear') {
        that.selectedList = []
      } else if (type === 'up' || type === 'down') {
        that.selectedList = that.selectedList.reverse()
      } else {
        console.warn('不支持的指令:', type)
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    generateList(data) {
      const arr = []
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

      allListMaterialForm().then(res => {
        console.log(res)
      })
    },

    margeNode(oldChildren, newChildren) {
      const arr = []
      for (let i = 0; i < newChildren.length; i++) {
        const newNode = newChildren[i]
        const oldNode = oldChildren.find(node => node.value === newNode.value)
        if (oldNode) {
          for (const key in newNode) {
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
      productMaterialInfoTwoTierTreeList({ parentId: 0 })
        .then(res => {
          const root = {
            key: '0',
            value: '0',
            title: 'BOM资料',
            isLeaf: false,
            code: '0',
            parentId: 0,
            children: res.data.map(item => that.formatRuleNode(item)),
            scopedSlots: { title: 'title' }
          }
          that.orgTree = [root]
          that.dataList = that.generateList(that.orgTree)

          if (String(that.parentId) === '0') {
            that.parentItem = root
          }
        })
        .catch(err => {
          that.$message.error(`调用接口[productMaterialInfoTwoTierTreeList]时发生错误，错误信息:${err}`)
        })
    },
    /**
     * @description 树加载规则： 1.先加载规则 2.如果没有规则，尝试加载规则对应的成品 3.如果是成品 加载对应成品的工艺
     * @param {treeNode} treeNode 被展开的树节点
     * @param {boolean} force 是否强制加载节点数据
     */
    onLoadData(treeNode,force=false) {
      const that = this
      that.selectedTreeNode = treeNode
      return new Promise(async resolve => {
        if (treeNode.dataRef.children && !force) {
          resolve()
          return
        }
        let {isRule,isProduct,isSubProduct} = treeNode.dataRef
        if(isRule){
          let ruleResult = await productMaterialInfoTwoTierTreeList({ parentId: treeNode.dataRef.value }).then(res => res.data || []).catch(err => {
            console.log(err)
            return []
          })
          if(ruleResult.length > 0){
            treeNode.dataRef.children = ruleResult.map(item => that.formatRuleNode(item))
            that.orgTree = [...that.orgTree]
          }else{
            let productResult = await getAllProductMaterial({ruleId:treeNode.dataRef.value}).then(res => res.data || []).catch(err => {
            console.log(err)
            return []
          })
            if(productResult.length > 0){
              treeNode.dataRef.children = productResult.map(item => that.formatProductNode(item))
              that.orgTree = [...that.orgTree]
            }
          }
        }
        if(isProduct){
          let subProductResult = await allListMaterialForm({groupId:treeNode.dataRef.__id}).then(res => res.data || []).catch(err => {
            console.log(err)
            return []
          })
          if(subProductResult.length > 0){
            treeNode.dataRef.children = subProductResult.map(item => that.formatSubProductNode(item))
            that.orgTree = [...that.orgTree]
          }
        }
        resolve()
      })
    },
    //格式化接口数据 key,title,value
    formatRuleNode(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)
      let ruleName = item.newRuleName || item.ruleName
      let showCode = +item.isSpecification === 1 ? '' : `(${item.code})`
      obj.title = `${ruleName}${showCode}`
      obj.value = String(item.id)
      obj.parentId = item.parentId
      obj.codeLength = +item.codeLength
      obj.code = item.code
      obj.scopedSlots = { title: 'title' }
      obj.isRule = true
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map(v => that.formatRuleNode(v))
      }
      return obj
    },
    formatProductNode(item) {
      let that = this
      let obj = {}
      obj.key = obj.value = String(item.materialCode)
      obj.__id = item.id
      obj.__ruleId = item.ruleId
      obj.title = `${item.materialName}(${item.materialCode})`
      obj.__materialName = item.materialName
      obj.__materialCode = item.materialCode
      obj.__mainUnit = item.mainUnit
      obj.__materialSource = item.materialSource
      obj.scopedSlots = { title: 'title' }
      obj.isProduct = true
      return obj
    },
    formatSubProductNode(item) {
      let that = this
      let obj = {}
      obj.key = obj.value = String(item.routeCode)+'_'+String(item.routeName)+'_'+String(item.materialCode)
      obj.__id = item.id
      obj.__materialName = item.materialName
      obj.__materialCode = item.materialCode
      obj.__status = item.status
      //蓝色-使用绿色-已审核黑色-未使用/未审核
      let {status,useStatus} = item
      obj.__color = +status === 2 ? 'green' : +useStatus === 1 ? 'blue' : ''

      // obj.__color = +useStatus === 1 ? 'blue' : status === 2 ? '#b1b1b1' : ''
      obj.title = `${item.materialName}(${item.bomCode})`
      obj.scopedSlots = { title: 'title' }
      obj.isSubProduct = true
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
      // that.queryParam = { ...that.queryParam, groupId: parentId }
      that.parentId = parentId
      that.parentItem = { ...dataRef }

      that.selectedRowKeys = []
      that.selectedRows = []
      // that.search()
      // if(dataRef.isProduct){
      //   that.queryParam = { ...that.queryParam, groupId: dataRef.__id}
      //   that.search()
      // }else{
      //   that.dataSource = []
      // }
    },
  }
}
</script>

<style scoped>
.resize-column-wrapper {
  display: flex;
  max-width: 1000px;
  border-radius: 3px;
}
.resize-column-left {
  flex: 3;
  border: 1px solid #d9d9d9;
}
.resize-column-control-bar {
  flex: 1;
  border: 1px solid #d9d9d9;
  border-left: none;
  border-right: none;
}
.resize-column-control-bar >>> .ant-btn {
  margin-bottom: 20px;
}
.resize-column-right {
  flex: 3;
  border: 1px solid #d9d9d9;
}
.__hd {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid #d9d9d9;
  line-height: 40px;
}
.__bd {
  padding: 20px;
  overflow: auto;
}
</style>


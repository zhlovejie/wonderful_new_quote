<template>
  <a-card :bordered="false" class="material-management-rule-FinishedProductList">
    <div class="resize-column-wrapper">
      <div id="split-0">
        <a-spin :spinning="spinning">
        <div class="menu-tree-list-wrapper" style="width: 100%; overflow: auto; max-height: 900px; min-height: 600px">
          <div style="display:flex;margin-top:4px;">
            <a-input
              style="line-height: 40px;flex:1;"
              placeholder="规则名称模糊查询"
              v-model="searchValue"
            />
            <a-button title="查询" style="margin:0 7px;" icon="search" @click="() => searchAction(1)"></a-button>
            <a-button title="重置" icon="reload" @click="() => searchAction(2)"></a-button>
          </div>
          <a-tree
            ref="treeRef"
            :loadData="onLoadData"
            @load="onLoadAction"
            :loadedKeys="loadedKeys"
            :treeData="orgTree"
            :selectedKeys="treeSelectedKeys"
            :defaultExpandAll="true"
            @select="handleClick"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            @expand="onExpand"
            :showLine="true"
          >
            <template slot="title" slot-scope="{ title }">
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </template>
          </a-tree>
        </div>
        </a-spin>
      </div>
      <div id="split-1">
        <div class="search-wrapper">
          <a-form layout="inline">
            <a-form-item>
              <a-input placeholder="代码模糊查询" v-model="queryParam.code" allowClear style="width: 150px" />
            </a-form-item>
            <a-form-item>
              <a-input placeholder="名称模糊查询" v-model="queryParam.ruleName" allowClear style="width: 150px" />
            </a-form-item>
            <a-form-item>
              <a-select
                placeholder="创建日期排序"
                :allowClear="true"
                style="width: 130px;"
                v-model="queryParam.orderCreatedTimeDesc"
              >
                  <a-select-option :value="1">降序</a-select-option>
                  <a-select-option :value="2">升序</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" icon="search" @click="search({ current: 1 })">查询</a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="doAction('add', null)">新增</a-button>
            </a-form-item>
            <a-form-item>
              <a-button :disabled="!canEdit" type="primary" @click="doAction('edit', null)">修改</a-button>
            </a-form-item>
            <a-form-item>
              <a-button :disabled="!canUse" type="primary" @click="doAction('disable', null)">禁用</a-button>
            </a-form-item>
            <a-form-item>
              <a-button :disabled="!canUse" type="primary" @click="doAction('enable', null)">启用</a-button>
            </a-form-item>
            <a-form-item>
              <a-button :disabled="!canUse" type="primary" @click="doAction('del', null)">删除</a-button>
            </a-form-item>
            <a-form-item>
              <a-button :disabled="!canUse" type="primary" @click="doAction('approval', null)">提交审核</a-button>
            </a-form-item>
            <a-form-item>
              <a-button :disabled="!canUse" type="primary" @click="doAction('unapproval', null)">反审核</a-button>
            </a-form-item>
          </a-form>
        </div>
        <a-alert message="字体颜色说明" type="info" show-icon style="margin-top: 10px">
          <div slot="description">
            <span style="color: blue">蓝色已审核</span>
            <span style="color: red; margin: 0 10px">红色禁用</span>
            <span style="font-weight: bold; margin: 0 10px">加粗常用</span>
            <span>黑色未审核</span>
          </div>
        </a-alert>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :customRow="customRowFunction"
          :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="customerName" slot-scope="text, record, index">
            <a href="javascript:void(0);" @click="clickVue(record)">{{ text }}</a>
          </div>
        </a-table>
      </div>
    </div>
    <RoutineAddForm ref="routineAddForm" @finish="finishHandler" />
  </a-card>
</template>

<script>
import {
  productMaterialRuleDelete,
  productMaterialRuleAnnulAudit,
  productMaterialRuleAudit,
  productMaterialRuleForbidden,
  productMaterialRuleStartUsing,
  productMaterialRulePageList,
  productMaterialRulePageTwoTierTreeList,
  productMaterialRulePageConditionTreeList
} from '@/api/routineMaterial'

import RoutineAddForm from './module/RoutineAddForm'
import Split from 'split.js'
const columns = [
  {
    align: 'center',
    title: '代码',
    dataIndex: 'fullCode',
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'ruleName',
  },
  {
    align: 'center',
    title: '创建人',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '创建时间',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '修改人',
    dataIndex: 'modifierName',
  },
  {
    align: 'center',
    title: '修改时间',
    dataIndex: 'modifyTime',
  },
]

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

export default {
  name: 'material-management-rule-FinishedProductList',
  components: {
    RoutineAddForm,
  },
  data() {
    return {
      parentId: 0, // 父id
      parentItem: {},
      // 表头
      columns,
      orgTree: [],
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],

      dataList: [],
      expandedKeys: [],
      loadedKeys:[],
      searchValue: '',
      autoExpandParent: true,

      loading: false,
      queryParam: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler,
      },
      treeInputSearchDebounce: null,
      spinning:false,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'material-rule-management-finished-product') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {
    canEdit() {
      // auditStatus 审核状态：1未审核，2审批中，3已审核
      // forbidden  是否禁用：1禁用，2启用
      let selectedRows = this.selectedRows
      if (selectedRows.length === 1) {
        let { auditStatus, forbidden } = selectedRows[0]
        return !(+forbidden === 1 || +auditStatus === 3)
      }
      return false
    },
    canUse() {
      return this.selectedRows.length > 0
    },
    treeSelectedKeys() {
      return [String(this.parentId)]
    },
    parentCodes() {
      let arr = []
      let parentId = this.parentId
      while (+parentId) {
        let target = this.dataList.find((item) => +item.key === +parentId)
        arr.push({ ...target })
        parentId = target.parentId
      }
      return arr
        .reverse()
        .map((item) => item.code)
        .join('.')
    },
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    searchAction(type) {
      const that = this
      const value = that.searchValue ? that.searchValue.trim() : ''
      if(type === 1){
        if(value.length === 0){
          return
        }else{
          that.fetchTreeWithName(value)
        }
      }else{
        that.searchValue = ''
        that.fetchTree()
      }
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
      const that = this
      // if (this.treeInputSearchDebounce === null) {
      //   this.treeInputSearchDebounce = this.$_.debounce(this.onChange, 2000)
      // }

      that.parentId = 0
      ;(that.queryParam = {
        ...that.queryParam,
        parentId: that.parentId,
      }),
      that.fetchTree()
      that.search()

      that.$nextTick(() => {
        that.splitClear()
        that.splitInstance = Split(['#split-0', '#split-1'], {
          gutter: function(i, gutterDirection) {
            var gut = document.createElement('div')
            gut.className = '_wdf_split_gutter _wdf_split_gutter-' + gutterDirection
            return gut
          },
          sizes: [20, 80]
        })
      })
    },
    onLoadData(treeNode, isForceRefresh = false) {
      const that = this
      return new Promise((resolve,reject) => {
        if (!isForceRefresh && treeNode.dataRef.children) {
          resolve();
          return;
        }
        productMaterialRulePageTwoTierTreeList({parentId:treeNode.dataRef.value})
        .then((res) => {
          if(res && res.code === 200 && Array.isArray(res.data)){
            let oldChildren = [...(treeNode.dataRef.children || [])]
            let newChildren = res.data.map((item) => that.formatTreeData(item))
            let children = that.margeNode(oldChildren, newChildren)

            treeNode.dataRef.children = children
            treeNode.dataRef.isLeaf = children.length === 0
            that.selectedTreeNode = treeNode
            that.orgTree = [...that.orgTree]
            that.dataList = that.generateList(that.orgTree)
          }else{
            treeNode.dataRef.isLeaf = true
            treeNode.dataRef.children = []
            that.selectedTreeNode = treeNode
            that.orgTree = [...that.orgTree]
            that.dataList = that.generateList(that.orgTree)
            that.$message.info(res.msg)
          }
          resolve();
        })
        .catch((err) => {
          reject()
          that.$message.error(`调用接口[productMaterialRulePageTwoTierTreeList]时发生错误，错误信息:${err}`)
        })
      });
    },
    margeNode(oldChildren, newChildren) {
      let arr = []
      for (let i = 0; i < newChildren.length; i++) {
        let newNode = newChildren[i]
        let oldNode = oldChildren.find((node) => node.value === newNode.value)
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
      that.spinning = true
      that.dataSource = []
      that.selectedRowKeys = []
      that.selectedRows = []
      that.loadedKeys = []
      that.spinning = true
      productMaterialRulePageTwoTierTreeList({ parentId: 0 })
        .then((res) => {
          that.spinning = false
          if(+res.code !== 200){
            that.$message.info(res.msg)
            return
          }
          const root = {
            key: '0',
            value: '0',
            title: '成品物料规则',
            isLeaf: false,
            code: '0',
            codeLength: 10,
            parentId: 0,
            children: res.data.map((item) => that.formatTreeData(item)),
            scopedSlots: { title: 'title' },
          }
          that.orgTree = [root]
          that.dataList = that.generateList(that.orgTree)
          that.selectedTreeNode = {
            dataRef:{
              ...root
            }
          }

          if (String(that.parentId) === '0') {
            that.parentItem = root
          }
          Object.assign(that, {
              expandedKeys:['0'],
              autoExpandParent: true,
            })
        })
        .catch((err) => {
          that.spinning = false
          that.$message.error(`调用接口[routineMaterialRulePageTreeList]时发生错误，错误信息:${err}`)
        })
    },
    fetchTreeWithName(w) {
      const that = this
      that.modelType = 2
      that.dataSource = []
      that.selectedRowKeys = []
      that.selectedRows = []
      that.loadedKeys = []
      that.spinning = true
      productMaterialRulePageConditionTreeList({ ruleName: w,type:1 })
        .then((res) => {
          that.spinning = false
          if(+res.code !== 200){
            that.$message.info(res.msg)
            return
          }
          const root = {
            key: '0',
            value: '0',
            title: '成品物料规则',
            isLeaf: false,
            code: '0',
            codeLength: 10,
            parentId: 0,
            children: res.data.map((item) => that.formatTreeData(item)),
            scopedSlots: { title: 'title' },
          }
          that.orgTree = []
          that.dataList = []

          if (String(that.parentId) === '0') {
            that.parentItem = root
          }

          that.$nextTick(() => {

            that.orgTree = [root]
            that.dataList = that.generateList(that.orgTree)


            let expandedKeys = that.dataList
            .map((item) => {
              return getParentKey(item.key, that.orgTree)
            }).filter(item => item !== undefined && item !== null)

            // let expandedKeys = that.dataList
            // .map((item) => {
            //   return item.key
            // })

            expandedKeys = [...new Set(expandedKeys)]
            console.log(that.dataList.map(item =>item.key))

            console.log(expandedKeys)

            Object.assign(that, {
              expandedKeys,
              autoExpandParent: true,
            })
          })


        })
        .catch((err) => {
          that.spinning = false
          that.$message.error(`调用接口[routineMaterialRulePageConditionTreeList]时发生错误，错误信息:${err}`)
        })
    },
    search(params = {}) {
      const that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      that.selectedRowKeys = []
      that.selectedRows = []
      that.loading = true
      productMaterialRulePageList(_searchParam)
        .then((res) => {
          that.loading = false
          if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
            return
          }
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.fullCode = that.parentCodes ? `${that.parentCodes}.${item.code}` : item.code
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination

          //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
          //刷新也不显示数据
          let { current, pages } = res.data
          if (+pages > 0 && +current > +pages) {
            that.pagination = { ...pagination, current: pages }
            that.search()
          }
        })
        .catch((err) => {
          console.error(err)
          that.loading = false
        })
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = { ...this.pagination, current: pagination.current }
      this.search()
    },
    onShowSizeChangeHandler(current, pageSize) {
      this.pagination = { ...this.pagination, current, pageSize }
    },
    //格式化接口数据 key,title,value
    formatTreeData(item) {
      let that = this
      let obj = {}
      obj.key = String(item.id)
      obj.title = `${item.newRuleName || item.ruleName}(${item.code})`
      obj.value = String(item.id)
      // obj.isLeaf = !(Array.isArray(item.subList) && item.subList.length > 0)
      obj.codeLength = +item.codeLength
      obj.newCodeLength = +item.newCodeLength
      obj.parentId = item.parentId
      obj.code = item.code
      obj.scopedSlots = { title: 'title' }
      //obj.__selectable = obj.isLeaf
      if (Array.isArray(item.subList) && item.subList.length > 0) {
        obj.children = item.subList.map((v) => that.formatTreeData(v))
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
      that.queryParam = { ...that.queryParam, parentId }
      that.parentId = parentId
      that.parentItem = { ...dataRef }
      // if(dataRef.isLeaf){

      // }
      that.selectedRowKeys = []
      that.selectedRows = []
      that.search()
    },
    doAction(type, record) {
      const that = this
      if (type === 'add') {
        that.$refs.routineAddForm.query(type, {
          ...record,
          __selectItem: that.parentItem,
          __treeData: [...that.orgTree],
          __from: 'product',
        })
        return
      } else if (type === 'edit') {
        that.$refs.routineAddForm.query(type, {
          ...that.selectedRows[0],
          __selectItem: that.parentItem,
          __treeData: [...that.orgTree],
          __from: 'product',
        })
        return
      } else {
        let m = {
          disable: {
            api: productMaterialRuleForbidden,
            title: '禁用',
            tpl: (names) => `确定要禁用${names}吗？`,
          },
          enable: {
            api: productMaterialRuleStartUsing,
            title: '启用',
            tpl: (names) => `确定要启用${names}吗？`,
          },
          del: {
            api: productMaterialRuleDelete,
            title: '删除',
            tpl: (names) => `确定要删除${names}吗？`,
          },
          approval: {
            api: productMaterialRuleAudit,
            title: '审核',
            tpl: (names) =>
              `提交审核项目${names}后，将不能修改，同时该核算项目的所有直接上级项目都会被自动审核，是否继续？`,
          },
          unapproval: {
            api: productMaterialRuleAnnulAudit,
            title: '反审核',
            tpl: (names) => `反审核项目${names}后，数据标记为未审核，是否继续？`,
          },
        }
        let target = m[type]
        if (!target) {
          that.$message.error(`不支持的操作类型:${type}`)
          return
        }
        let itemNames = `【${that.selectedRows.map((item) => item.ruleName).join('，')}】`
        let ids = that.selectedRows.map((item) => item.id).join(',')
        that.$confirm({
          title: '提示',
          content: target.tpl(itemNames),
          okText: '确定',
          cancelText: '取消',
          onOk() {
            target
              .api(`ids=${ids}`)
              .then((res) => {
                that.$message.info(res.msg)
                if (res.code === 200) {
                  that.finishHandler({ key: that.parentItem.value })
                }
              })
              .catch((err) => {
                that.$message.error(err.message)
              })
          },
        })
      }
    },
    finishHandler(param) {
      this.selectedRowKeys = []
      this.selectedRows = []
      let target = this.findTreeNode(this.$refs.treeRef, param.key)
      if (target) {
        this.onLoadData(target, true)
      }
      this.search()
    },
    findTreeNode(rootNode, key) {
      if (rootNode.dataRef && rootNode.dataRef.value === key) {
        return rootNode
      }
      if (Array.isArray(rootNode.$children)) {
        for (let i = 0; i < rootNode.$children.length; i++) {
          let node = this.findTreeNode(rootNode.$children[i], key)
          if (node) {
            return node
          }
        }
      }
    },
    customRowFunction(record) {
      const that = this
      // auditStatus审核状态：1未审核，2审批中，3已审核
      // forbidden  是否禁用：1禁用，2启用
      let { auditStatus, forbidden } = record
      return {
        style: {
          color: +forbidden === 1 ? 'red' : +auditStatus === 3 ? 'blue' : '',
        },
        on:{
          click:async event => {
            try{
              debugger
              if(that.selectedTreeNode){
                let expandedKeys = [...that.expandedKeys]
                Object.assign(that, {
                  expandedKeys:[...new Set([...expandedKeys,that.selectedTreeNode.dataRef.key])],
                  autoExpandParent: true,
                })
                let children = that.selectedTreeNode.dataRef.children || []
                let target = children.find(n => n.code === record.code)
                if(target){
                  that.parentId = target.key
                }
              }
            }catch(err){
              console.log(err)
            }
          }
        }
      }
    },
    onLoadAction(loadedKeys){
      this.loadedKeys = loadedKeys
    },
    splitClear() {
      try {
        if (this.splitInstance !== null) {
          this.splitInstance.destroy()
          this.splitInstance = null
        }
      } catch (err) {
        this.splitInstance = null
        console.log(err)
      }
    }
  },
  beforeDestroy() {
    this.splitClear()
  },
}
</script>

<style scoped>
.material-management-rule-FinishedProductList >>> .resize-column-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  overflow: hidden;
}

#split-0,
#split-1 {
  padding: 0 5px;
}
</style>

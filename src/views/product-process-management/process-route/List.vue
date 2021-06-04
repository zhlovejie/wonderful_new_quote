<template>
  <a-card
    :bordered="false"
    class="product-process-management_process-route-management_route"
  >
    <div class="resize-column-wrapper">
      <div class="resize-column-left">
        <div
          class="menu-tree-list-wrapper"
          style="width: 100%; overflow: auto; height: auto; min-height: 600px"
        >
          <a-tree
            ref="treeRef"
            :loadData="onLoadData"
            :treeData="orgTree"
            :defaultExpandAll="true"
            @select="handleClick"
            :showLine="true"
          >
            <template
              slot="title"
              slot-scope="{ title }"
            >
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </template>
          </a-tree>
        </div>
      </div>
      <div class="resize-column-control-bar"></div>
      <div class="resize-column-right">
        <div class="search-wrapper">
          <a-form layout="inline">
            <a-form-item>
              <a-input
                placeholder="代码模糊查询"
                v-model="queryParam.materialCode"
                allowClear
                style="width: 150px"
              />
            </a-form-item>
            <a-form-item>
              <a-input
                placeholder="名称模糊查询"
                v-model="queryParam.materialName"
                allowClear
                style="width: 150px"
              />
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                icon="search"
                @click="search({ current: 1 })"
              >查询</a-button>
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                icon="filter"
                @click="doAction('filter', null)"
              >筛选</a-button>
            </a-form-item>
            <a-form-item >
              <a-button
                type="primary"
                @click="doAction('add', null)"
              >新增</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialInfo:edit')">
              <a-button
                :disabled="!canEdit"
                type="primary"
                @click="doAction('edit', null)"
              >修改</a-button>
            </a-form-item>

            <a-form-item v-if="$auth('routineMaterialInfo:disable')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('disable', null)"
              >禁用</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialInfo:enable')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('enable', null)"
              >启用</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialInfo:del')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('del', null)"
              >删除</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterialInfo:audit')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('approval', null)"
              >审核</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterial:annulAudit')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('unapproval', null)"
              >反审核</a-button>
            </a-form-item>
            <a-form-item v-if="$auth('routineMaterial:annulAudit')">
              <a-button
                :disabled="!canUse"
                type="primary"
                @click="doAction('export', null)"
              >导出</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
    <NormalAddForm
      ref="NormalAddForm"
      :key="normalAddFormKeyCount"
      @finish="finishHandler"
    />
    <ApproveInfo ref="approveInfoCard" />
    <SearchForm
      ref="searchForm"
      @change="paramChangeHandler"
    />
  </a-card>
</template>

<script>
import {
  productMaterialInfoDelete,
  productMaterialInfoAnnulAudit,
  productMaterialInfoAudit,
  productMaterialInfoForbidden,
  productMaterialInfoStartUsing,
  productMaterialInfoPageList,
  productMaterialInfoTwoTierTreeList,
  __MaterialInfoExport
} from '@/api/routineMaterial'

import {getAllProductMaterial,craftRouteDetail,craftRouteListByMaterial} from '@/api/craftRoute'

import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import AddForm from './module/AddForm'
import ResizeColumn from '@/components/CustomerList/ResizeColumn'
import SearchForm from './module/SearchForm'

const columns = [
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    align: 'center',
    title: '中文名称',
    dataIndex: 'materialName'
  },
  {
    align: 'center',
    title: '物料来源属性',
    dataIndex: 'materialSource',
    scopedSlots: { customRender: 'materialSource' }
  },
  // {
  //   align: 'center',
  //   title: '规格型号',
  //   dataIndex: 'specifications',
  //   scopedSlots: { customRender: 'specifications' }
  // },
  {
    align: 'center',
    title: '主计量单位',
    dataIndex: 'mainUnit',
    scopedSlots: { customRender: 'mainUnit' }
  },
  {
    align: 'center',
    title: '录入人',
    dataIndex: 'createdName'
  },
  {
    align: 'center',
    title: '审核状态',
    dataIndex: 'auditStatus',
    scopedSlots: { customRender: 'auditStatus' }
  }
]

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
  name: 'product-process-management_process-route-management_route',
  components: {
    NormalAddForm:AddForm,
    ApproveInfo,
    SearchForm
  },
  data() {
    return {
      parentId: 0, // 父id
      parentItem: {},
      selectedTreeNode: null, //新增修改后刷新节点用
      // 表头
      columns,
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
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: this.onShowSizeChangeHandler
      },
      treeInputSearchDebounce: null,
      normalAddFormKeyCount: 1
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'product-process-management_process-route-management_route') {
          this.init()
        }
      },
      immediate: true
    }
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
    }
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange(e) {
      const that = this
      const value = e.target.value.trim()

      const expandedKeys = that.dataList
        .map(item => {
          if (value && item.title.indexOf(value) > -1) {
            return getParentKey(item.key, that.orgTree)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)

      Object.assign(that, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
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
      // if (this.treeInputSearchDebounce === null) {
      //   this.treeInputSearchDebounce = this.$_.debounce(this.onChange, 2000)
      // }

      this.parentId = 0
      this.selectedTreeNode = null
      this.queryParam = {
        ...this.queryParam,
        ruleId: this.parentId
      }
      this.fetchTree()
      //this.search()

      this.$nextTick(() => {
        this._ResizeColumnInstance = new ResizeColumn()
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
          let ruleResult = await productMaterialInfoTwoTierTreeList({ parentId: treeNode.dataRef.value }).then(res => res.data)
          if(ruleResult.length > 0){
            treeNode.dataRef.children = ruleResult.map(item => that.formatRuleNode(item))
            that.orgTree = [...that.orgTree]
          }else{
            let productResult = await getAllProductMaterial({ruleId:treeNode.dataRef.value}).then(res => res.data)
            if(productResult.length > 0){
              treeNode.dataRef.children = productResult.map(item => that.formatProductNode(item))
              that.orgTree = [...that.orgTree]
            }
          }
        }
        if(isProduct){
          let subProductResult = await craftRouteListByMaterial({materialGroupId:treeNode.dataRef.__id}).then(res => res.data)
          if(subProductResult.length > 0){
            treeNode.dataRef.children = subProductResult.map(item => that.formatSubProductNode(item))
            that.orgTree = [...that.orgTree]
          }
        }
        resolve()
      })
    },
    fetchTree() {
      const that = this
      productMaterialInfoTwoTierTreeList({ parentId: 0 })
        .then(res => {
          const root = {
            key: '0',
            value: '0',
            title: '成品代码库',
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
      obj.scopedSlots = { title: 'title' }
      obj.isProduct = true
      return obj
    },
    formatSubProductNode(item) {
      let that = this
      let obj = {}
      obj.key = obj.value = String(item.routeCode)+'_'+String(item.routeName)+'_'+String(item.materialCommonCode)
      obj.__id = item.id
      obj.__materialName = item.materialCommonName
      obj.__materialCode = item.materialCommonCode
      obj.title = `${item.materialCommonCode}(${item.materialCommonName})`
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
      that.queryParam = { ...that.queryParam, ruleId: parentId }
      that.parentId = parentId
      that.parentItem = { ...dataRef }

      that.selectedRowKeys = []
      that.selectedRows = []

    },

    async doAction(type, record) {
      const that = this
      if (type === 'add') {
        that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1
        that.$nextTick(() => {
          that.$refs.NormalAddForm.query(type, {
            ...record,
            __selectItem: that.parentItem,
            __treeData: [...that.orgTree],
            __from: 'product'
          })
        })
        return
      } else if (type === 'edit') {
        that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1
        that.$nextTick(() => {
          that.$refs.NormalAddForm.query(type, {
            ...that.selectedRows[0],
            __selectItem: that.parentItem,
            __treeData: [...that.orgTree],
            __from: 'product'
          })
        })
        return
      } else if (type === 'export') {
        let ids = that.selectedRows.map(item => `ids=${item.id}`).join('&')
        let res = await __MaterialInfoExport(2,ids)
        console.log(res)
        that.$message.info(res.msg)
        return
      } else if (type === 'filter') {
        that.$refs.searchForm.query()
        return
      } else {
        let m = {
          disable: {
            api: productMaterialInfoForbidden,
            title: '禁用',
            tpl: names => `是否要删除所选项目${names}？`
          },
          enable: {
            api: productMaterialInfoStartUsing,
            title: '启用',
            tpl: names => `确定要启用${names}吗？`
          },
          del: {
            api: productMaterialInfoDelete,
            title: '删除',
            tpl: names => `确定要删除${names}吗？`
          },
          approval: {
            api: productMaterialInfoAudit,
            title: '审核',
            tpl: names => `确定要审核项目${names}吗？`
          },
          unapproval: {
            api: productMaterialInfoAnnulAudit,
            title: '反审核',
            tpl: names => `反审核项目${names}后，数据标记为未审核，是否继续？`
          }
        }
        let target = m[type]
        if (!target) {
          that.$message.error(`不支持的操作类型:${type}`)
          return
        }
        let itemNames = `【${that.selectedRows.map(item => item.materialName).join('，')}】`
        let ids = that.selectedRows.map(item => item.id).join(',')
        that.$confirm({
          title: '提示',
          content: target.tpl(itemNames),
          okText: '确定',
          cancelText: '取消',
          onOk() {
            target
              .api(`ids=${ids}`)
              .then(res => {
                that.$message.info(res.msg)
                if (res.code === 200) {
                  that.finishHandler({ key: that.parentItem.value })
                }
              })
              .catch(err => {
                that.$message.error(err.message)
              })
          }
        })
      }
    },
    finishHandler(param) {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.search()
      if (param && param.key) {
        let target = this.findTreeNode(this.$refs.treeRef, param.key)
        if (target) {
          this.onLoadData(target, true)
        }
      }
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
    approvalPreview(record) {
      if (!record.instanceId) {
        this.$message.info('未生成审批流程')
        return
      }
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    paramChangeHandler(params) {
      this.queryParam = { ...this.queryParam, ...params }
      this.search()
    }
  },
  beforeDestroy() {
    if (this._ResizeColumnInstance) {
      this._ResizeColumnInstance.destory()
      this._ResizeColumnInstance = null
    }
  }
}
</script>

<style scoped>
.product-process-management_process-route-management_route >>> .resize-column-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  overflow: hidden;
}

.product-process-management_process-route-management_route >>> .resize-column-wrapper .resize-column-control-bar {
  width: 10px;
  background-color: #f5f5f5;
  cursor: col-resize;
  box-shadow: 0 0px 3px 1px #ddd;
  border-radius: 6px;
  margin: 0 10px;
}

.product-process-management_process-route-management_route >>> .resize-column-wrapper .resize-column-left {
  overflow: auto;
}
.product-process-management_process-route-management_route >>> .resize-column-wrapper .resize-column-right {
  flex: 1;
}
</style>


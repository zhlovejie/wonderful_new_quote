<template>
  <a-card
    :bordered="false"
    class="bom-management_list"
  >
    <div class="resize-column-wrapper">
      <div id="split-0">
        <div
          class="menu-tree-list-wrapper"
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
      <div id="split-1">
        <template v-if="routeView">
          <FormView ref="formView" />
        </template>

        <template v-else>
        <div class="search-wrapper">
          <a-form layout="inline">
            <a-form-item>
              <a-input
                placeholder="BOM单编号"
                v-model="queryParam.bomCode"
                allowClear
                style="width: 150px"
              />
            </a-form-item>
            <a-form-item>
              <a-input
                placeholder="物料代码模糊查询"
                v-model="queryParam.materialCode"
                allowClear
                style="width: 150px"
              />
            </a-form-item>
            <a-form-item>
              <a-input
                placeholder="物料名称模糊查询"
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
                v-if="$auth('bom-management_list:filter')"
                type="primary"
                icon="filter"
                @click="doAction('filter', null)"
              >筛选</a-button>
            </a-form-item>
            <!-- <a-form-item >
              <a-button
                type="primary"
                @click="doAction('addGroup', null)"
              >新增BOM组</a-button>
            </a-form-item> -->
            <a-form-item >
              <a-button
                v-if="$auth('bom-management_list:add')"
                :disabled="canAdd"
                type="primary"
                @click="doAction('add', null)"
              >新增</a-button>
            </a-form-item>
            <a-form-item >
              <a-button
                v-if="$auth('bom-management_list:edit')"
                :disabled="!canEdit"
                type="primary"
                @click="doAction('edit', null)"
              >修改</a-button>
            </a-form-item>

            <a-form-item >
              <a-button
                v-if="$auth('bom-management_list:del')"
                type="primary"
                @click="doAction('del', null)"
              >删除</a-button>
            </a-form-item>
            <a-form-item >
              <a-button
                v-if="$auth('bom-management_list:copy')"
                :disabled="!canUse"
                type="primary"
                @click="doAction('copy', null)"
              >复制</a-button>
            </a-form-item>
            <a-form-item >
              <a-button
                v-if="$auth('bom-management_list:use')"
                :disabled="!canUseButton"
                type="primary"
                @click="doAction('use', null)"
              >使用</a-button>
            </a-form-item>
            <a-form-item >
              <a-button
                v-if="$auth('bom-management_list:approval')"
                type="primary"
                @click="doAction('approval', null)"
              >审核</a-button>
            </a-form-item>
            <a-form-item >
              <a-button
                v-if="$auth('bom-management_list:unapproval')"
                type="primary"
                @click="doAction('unapproval', null)"
              >反审核</a-button>
            </a-form-item>
            <a-form-item >
              <a-button
                v-if="$auth('bom-management_list:batchupdate')"
                type="primary"
                @click="doAction('editBatch', null)"
              >BOM成批修改</a-button>
            </a-form-item>
            <!-- <a-form-item >
              <a-button
                v-if="$auth('bom-management_list:import')"
                :disabled="!canUse"
                type="primary"
                @click="doAction('import', null)"
              >导入</a-button>
            </a-form-item> -->
            <a-form-item >
              <a-button
                v-if="$auth('bom-management_list:export')"
                :disabled="!canUse"
                type="primary"
                @click="doAction('export', null)"
              >导出</a-button>
            </a-form-item>
          </a-form>
        </div>
        <a-alert
          message="字体颜色说明"
          type="info"
          show-icon
          style="margin-top: 10px"
        >
          <div slot="description">
            <span style="color: blue">蓝色-使用</span>
            <span style="color: green; margin: 0 10px">绿色-已审核</span>
            <span>黑色-未使用/未审核</span>
          </div>
        </a-alert>
        <a-card title="BOM基本数据" size="small" :bordered="false">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :customRow="customRowFunction"
          :rowSelection="{ onChange: rowSelectionChangeHnadler, selectedRowKeys: selectedRowKeys }"
          size="small"
        >
          <div
            slot="useStatus"
            slot-scope="text, record, index"
          >
            {{ {0:'未使用',1:'使用'}[text] }}
          </div>
          <div
            slot="modelType"
            slot-scope="text, record, index"
          >
            <a-tooltip>
              <template slot="title">
                {{text}}
              </template>
              <span class="icon-required">查看</span>
              <a-icon
                type="question-circle"
                style="margin-left:5px;color:#1890ff;"
              />
            </a-tooltip>
          </div>
          <div
            slot="status"
            slot-scope="text, record"

          >
            <a href="javascript:void(0);" v-if="+text !== 0" @click="approvalPreview(record)">
              {{ {0:'待审核',1:'待审批',2:'通过',3:'不通过',4:'已反审核'}[text] }}
            </a>
            <span v-else>待审核</span>

          </div>
          <div slot="materialProperty" slot-scope="text, record, index" >
            {{ {1:'自制',2:'外购',3:'委外',4:'标准件'}[text] }}
          </div>
          <div slot="materialUnit" slot-scope="text, record, index" >
            {{ {1:'支',2:'把',3:'件'}[text] || text }}
          </div>
          <div slot="isDelete" slot-scope="text, record, index" >
            {{ {1:'是',0:'否'}[text] }}
          </div>
        </a-table>
        </a-card>

        <a-card title="BOM详情数据" size="small" :bordered="false"  style="margin-top:10px;">
        <a-table
          :columns="columnsDetail"
          :dataSource="detailDataSource"
          :loading="loadingDetail"
          :pagination="false"
          size="small"
          :scroll="{ y: 300 }"
        >
          <div
            slot="useStatus"
            slot-scope="text, record, index"
          >
            {{ {0:'未使用',1:'使用'}[text] }}
          </div>
          <div
            slot="modelType"
            slot-scope="text, record, index"
          >
            <a-tooltip>
              <template slot="title">
                {{text}}
              </template>
              <span class="icon-required">查看</span>
              <a-icon
                type="question-circle"
                style="margin-left:5px;color:#1890ff;"
              />
            </a-tooltip>
          </div>
          <a
            slot="status"
            slot-scope="text, record"
            @click="approvalPreview(record)"
          >
            {{ {0:'待审核',1:'待审批',2:'通过',3:'不通过',4:'已反审核'}[text] }}
          </a>


          <div slot="materialProperty" slot-scope="text, record, index" >
            {{ {1:'自制',2:'外购',3:'委外',4:'标准件'}[text] }}
          </div>
          <div slot="materialUnit" slot-scope="text, record, index" >
            {{ {1:'支',2:'把',3:'件'}[text] || text }}
          </div>
          <div slot="isDelete" slot-scope="text, record, index" >
            {{ {1:'是',0:'否'}[text] }}
          </div>

          <div
                slot="materialUseStatus"
                slot-scope="text, record, index"
              >
                {{ {0:'未使用',1:'使用'}[text] }}
              </div>

        </a-table>
        </a-card>
        </template>
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
    <AddGroupForm ref="addGroupForm" @finish="finishHandler"/>
    <BatchUpdate ref="batchUpdate" @finish="finishHandler"/>
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
  delMaterialForm,
  listMaterialForm,
  getBomTree,
  listMaterialFormChildDetail,
  useMaterialForm,
  auditMaterialForm,
  reverseAuditMaterialForm,
  allListMaterialForm,
  __MaterialInfoExport
} from '@/api/bomManagement'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import NormalAddForm from './modules/AddForm'
import FormView from './modules/FormView'

import AddGroupForm from './modules/AddGroupForm'
import SearchForm from './modules/SearchForm'
import BatchUpdate from './modules/BatchUpdate'
import Split from 'split.js'

let uuid = () => Math.random().toString(16).slice(2);
const columns = [
  {
    align: 'center',
    title: 'BOM单编号',
    dataIndex: 'bomCode'
  },
  {
    align: 'center',
    title: '状态',
    dataIndex: 'useStatus',
    scopedSlots: { customRender: 'useStatus' }
  },
  {
    align: 'center',
    title: '审核',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'modelType',
    scopedSlots: { customRender: 'modelType' }
  },
  {
    align: 'center',
    title: '物料属性',
    dataIndex: 'materialProperty',
    scopedSlots: { customRender: 'materialProperty' }
  },
  {
    align: 'center',
    title: '使用计量单位',
    dataIndex: 'materialUnit',
    scopedSlots: { customRender: 'materialUnit' }
  },
  {
    align: 'center',
    title: '工艺路线代码',
    dataIndex: 'routeCode'
  },
  {
    align: 'center',
    title: '工艺路线名称',
    dataIndex: 'routeName'
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark'
  },
]

const columnsDetail = [
  {
    align: 'center',
    title: '层级号',
    dataIndex: 'level'
  },
  {
    align: 'center',
    title: '自研结构件代码',
    dataIndex: 'researchCode'
  },
  {
    align: 'center',
    title: '物料代码',
    dataIndex: 'materialCode'
  },
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    align: 'center',
    title: '规格型号',
    dataIndex: 'modelType',
    scopedSlots: { customRender: 'modelType' }
  },
  {
    align: 'center',
    title: '物料属性',
    dataIndex: 'materialProperty',
    scopedSlots: { customRender: 'materialProperty' }
  },
  {
    align: 'center',
    title: '使用计量单位',
    dataIndex: 'materialUnit',
    scopedSlots: { customRender: 'materialUnit' }
  },
  {
    align: 'center',
    title: '用量',
    dataIndex: 'materialNum'
  },
  {
    align: 'center',
    title: '使用状态',
    dataIndex: 'materialUseStatus',
    scopedSlots: { customRender: 'materialUseStatus' }
  },
  {
    align: 'center',
    title: '是否禁用',
    dataIndex: 'isDelete',
    scopedSlots: { customRender: 'isDelete' }
  },
  {
    align: 'center',
    title: '发料仓库',
    dataIndex: 'storeAddress'
  },
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
  name: 'bom-management_list',
  components: {
    NormalAddForm,
    ApproveInfo,
    SearchForm,
    AddGroupForm,
    BatchUpdate,
    FormView
  },
  data() {
    return {
      parentId: 0, // 父id
      parentItem: {},
      selectedTreeNode: null, //新增修改后刷新节点用
      // 表头
      columns,
      columnsDetail,
      detailDataSource:[],
      orgTree: [],
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],

      dataList: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,

      loading: false,
      loadingDetail:false,
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
      normalAddFormKeyCount: 1,
      routeView: false //点击 subProduct 需要查看详情
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'bom-management_list') {
          this.init()
        }
      },
      immediate: true
    }
  },
  computed: {
    canAdd(){
      let {isProduct} = this.parentItem
      return !isProduct
    },
    canEdit() {
      // debugger
      let selectedRows = this.selectedRows
      if(selectedRows.length === 1 && +selectedRows[0].status !== 2){
        return true
      }
      return false
    },
    canUse() {
      return this.selectedRows.length > 0
    },
    /**
     * 如果点击BOM组别名称，点击使用，则是对BOM组别名称下的所有的BOM组进行使用
     * 如果BOM组别下有未审核过的数据，则只对审核过的数据更改状态为使用
     */
    canUseButton(){
      // debugger
      // let {__status,__useStatus} = this.parentItem
      // if(!('__status' in this.parentItem)){
      //   return false
      // }
      // if(__useStatus === null && __status === null){
      //   return true
      // }
      // return +__status === 2
      return true
    },
    treeSelectedKeys() {
      return [String(this.parentId)]
    },
    parentCodes() {
      let arr = []
      let parentId = this.parentId
      while (+parentId) {
        let target = this.dataList.find(item => +item.key === +parentId)
        arr.push({ ...target })
        parentId = target.parentId
      }
      return arr
        .reverse()
        .map(item => item.key)
        .join('.')
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
      const that = this
      // if (this.treeInputSearchDebounce === null) {
      //   this.treeInputSearchDebounce = this.$_.debounce(this.onChange, 2000)
      // }

      that.parentId = 0
      that.selectedTreeNode = null
      that.queryParam = {
        ...that.queryParam,
        groupId: that.parentId
      }
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
    search(params = {}) {
      const that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10
      }
      that.loading = true
      let _searchParam = Object.assign({}, { ...that.queryParam }, paginationParam, params)
      listMaterialForm(_searchParam)
        .then(res => {
          that.loading = false
          if (!(res && res.data && res.data.records && Array.isArray(res.data.records))) {
            return
          }
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            item.fullCode = that.parentCodes ? `${that.parentCodes}.${item.code}` : item.code
            item.specifications = `
              材质：${item.texture}
              厚度：${item.thickness}
              宽度：${item.width}
              长度：${item.length}
            `
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
        .catch(err => {
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

      that.dataSource = []
      that.detailDataSource = []
      that.pagination = {...that.pagination,total:0,current:1}



      that.routeView = false

      if (dataRef.isSubProduct) {
        that.routeView = true
        that.$nextTick(() => {
          that.$refs['formView'] && that.$refs['formView'].query('view', { id: dataRef.__id })
        })
      } else if(dataRef.isProduct){
        that.queryParam = { ...that.queryParam, groupId: dataRef.__id}
        that.search()
      }else{
        // that.dataSource = []
      }


    },
    async doAction(type, record) {

      const that = this
      if(type === 'editBatch'){
        that.$refs['batchUpdate'].query()
        return
      }else if(type === 'addGroup'){
        that.$refs['addGroupForm'].query({
          __selectItem: that.parentItem
        })
        return
      }
      else if (type === 'add') {
        that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1
        that.$nextTick(() => {
          that.$refs.NormalAddForm.query(type, {
            ...record,
            __selectItem: that.parentItem,
            __treeData: [...that.orgTree],
            __from: 'normal'
          })
        })
        return
      } else if (type === 'edit' || type === 'copy') {
        that.normalAddFormKeyCount = that.normalAddFormKeyCount + 1
        that.$nextTick(() => {
          that.$refs.NormalAddForm.query(type, {
            ...that.selectedRows[0],
            __selectItem: that.parentItem,
            __treeData: [...that.orgTree],
            __from: 'normal'
          })
        })
        return
      }
      else if (type === 'export') {
        // let ids = that.selectedRows.map(item => `ids=${item.id}`).join('&')
        // let res = await __MaterialInfoExport(1,ids)
        // console.log(res)
        that.$message.info('功能开发中...')
        return
      } else if (type === 'filter') {
        that.$refs.searchForm.query()
        return
      } else {
        let m = {
          use:{
            api:useMaterialForm,
            title:'使用',
            tpl: names => `是否要更改状态未使用？`
          },
          del: {
            api: delMaterialForm,
            title: '删除',
            /**
             * 如果此物料关联了 BOM则不可以删除 给出提示物料已使用，禁止删除！
             */
            tpl: names => `确定要删除${names}吗？`
          },
          approval: {
            api: auditMaterialForm,
            title: '审核',
            tpl: names => `确定要审核项目${names}吗？`
          },
          unapproval: {
            api: reverseAuditMaterialForm,
            title: '反审核',
            tpl: names => `反审核项目${names}后，数据标记为未审核，是否继续？`
          }
        }
        let target = m[type]
        if (!target) {
          that.$message.error(`不支持的操作类型:${type}`)
          return
        }

        let isSingle = that.selectedRows.length > 0
        let itemNames = isSingle
          ? `【${that.selectedRows.map(item => item.bomCode).join('，')}】`
          : `节点【${that.parentItem.title}】`

        if(!isSingle && +that.parentItem.key === 0){
          that.$message.info('根节点禁止操作')
          return
        }

        that.$confirm({
          title: '提示',
          content: target.tpl(itemNames),
          okText: '确定',
          cancelText: '取消',
          onOk() {
            if(isSingle){
              let arr = []
              that.selectedRows.map(item => {
                arr.push(target.api({bomStatus:1,id:item.id}).then(res => {
                  return {result:res,target:item}
                }))
              })
              Promise.all(arr).then(res => {
                let msg = ''

                res.map(r => {
                  let {result,target} = r
                  if(+result.code !== 200){
                    msg += `【${target.bomCode}】${result.msg} `
                  }
                })
                if(msg.length > 0){
                  const h = that.$createElement;
                  that.$info({
                    title: '提示',
                    content: h('div', {}, [
                      h('p', msg)
                    ]),
                    width: 450,
                    onOk() {},
                  });
                }else{
                  that.$message.info('操作成功')
                }
                that.finishHandler({ key: that.parentItem.value })
              }).catch(err => {
                that.$message.error(err.message)
              })
            }else{
              let {isRule,isProduct,isSubProduct,__id,key} = that.parentItem
              let __bomStatus = isProduct ? 0 : 1
              let _id = isRule ? key : __id

              target.api({bomStatus:__bomStatus,id:_id}).then(res => {
                that.$message.info(res.msg)
                if (+res.code === 200) {
                  that.finishHandler({ key: that.parentItem.value })
                }
              }).catch(err => {
                that.$message.error(err.message)
              })
            }
          }
        })
      }
    },
    finishHandler(param) {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.search()
      // this.fetchTree()
      // return
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
    customRowFunction(record) {
      let {useStatus,status} = record
      return {
        // style: {
        //   color: +useStatus === 1 ? 'blue' : status === 2 ? 'green' : ''
        // },
        on: {
          click:event => {
            let target = event.currentTarget
            target.parentNode.querySelectorAll('.ant-table-row').forEach((ele) => {
                ele.classList.remove('tr-bg-e6f7ff')
            })
            target.classList.add('tr-bg-e6f7ff')
            const that = this
            that.loadingDetail = true
            listMaterialFormChildDetail({bomId:record.id}).then(res => {
              that.loadingDetail = false
              console.log(res)
              let format2Children = (item)=> {
                let _item = Object.assign({},item)
                _item.key = _item.level
                _item.children = _item.detailListVo || []
                if (Array.isArray(_item.children) && _item.children.length > 0) {
                  _item.children = _item.children.map(v => format2Children(v))
                }else{
                  delete _item.children
                }
                return _item
              }
              that.detailDataSource = res.data.map(item => format2Children(item))
            }).catch(err => {
              that.$message.err(err)
              that.loadingDetail = false
            })
          },
          dblclick: event => {
            console.log(record)
            const that = this
            that.$refs['NormalAddForm'].query('view', {
              ...record,
              __selectItem: {
                title: record.groupName,
                value: record.groupId
              }
            })

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
  }
}
</script>

<style scoped>
.bom-management_list >>> .resize-column-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  overflow: hidden;
}

.bom-management_list >>> .tr-bg-e6f7ff{
  background-color: #e6f7ff;
}

#split-0,
#split-1 {
  padding: 0 5px;
}
</style>

